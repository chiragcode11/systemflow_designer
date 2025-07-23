import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import designService from '../../../utils/designService';
import projectService from '../../../utils/projectService';

const PromptInput = ({ onGenerate, isGenerating }) => {
  const { user, userProfile } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [complexity, setComplexity] = useState(5);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const examplePrompts = [
    "Design a scalable e-commerce platform with user management, product catalog, and payment processing",
    "Create a real-time chat application with WebSocket connections and message persistence", 
    "Build a microservices architecture for a social media platform with content delivery",
    "Design a streaming video platform with content distribution and user analytics",
    "Create a task management system with real-time collaboration and file sharing"
  ];

  const complexityLevels = [
    { value: 1, label: 'Very Simple', description: '2-3 components' },
    { value: 3, label: 'Simple', description: '3-4 components' },
    { value: 5, label: 'Medium', description: '4-6 components' },
    { value: 7, label: 'Complex', description: '6-8 components' },
    { value: 9, label: 'Very Complex', description: '8+ components' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setIsCreatingProject(true);

    try {
      // Create a new project first
      const projectResult = await projectService.createProject({
        name: `AI Generated: ${prompt.substring(0, 40)}...`,
        description: `Generated from prompt: ${prompt}`,
        status: 'draft',
        isPublic: false,
        tags: ['ai-generated', 'system-design'],
        metadata: { 
          generatedFromPrompt: true,
          originalPrompt: prompt,
          complexity: complexity
        }
      });

      if (!projectResult.success) {
        console.log('Failed to create project:', projectResult.error);
        return;
      }

      // Generate design using the AI service
      const designResult = await designService.generateDesignFromPrompt(
        projectResult.data.id,
        prompt,
        complexity
      );

      if (designResult.success) {
        onGenerate?.({
          prompt,
          complexity,
          project: projectResult.data,
          design: designResult.data
        });
      } else {
        console.log('Failed to generate design:', designResult.error);
      }
    } catch (error) {
      console.log('Generation error:', error);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleExampleClick = (examplePrompt) => {
    setPrompt(examplePrompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Login Prompt for Unauthenticated Users */}
      {showLoginPrompt && !user && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Icon name="Lock" size={20} className="text-primary mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary">Sign In Required</h3>
              <p className="text-primary/80 mt-1">
                Please sign in to generate AI-powered system designs and save your work.
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <Button variant="default" size="sm" className="brand-gradient">
                  Sign In
                </Button>
                <Button variant="outline" size="sm">
                  Create Account
                </Button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="text-primary/60 hover:text-primary text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Describe Your System</h2>
          <p className="text-muted-foreground">
            Tell us about the application or service you want to design
          </p>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            System Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the system you want to design... (e.g., 'Design a scalable e-commerce platform with user management, product catalog, shopping cart, and payment processing')"
            className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            disabled={isGenerating || isCreatingProject}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {prompt.length}/500 characters
            </span>
            {prompt.length > 500 && (
              <span className="text-destructive">Character limit exceeded</span>
            )}
          </div>
        </div>

        {/* Complexity Slider */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            System Complexity
          </label>
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="9"
              step="2"
              value={complexity}
              onChange={(e) => setComplexity(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              disabled={isGenerating || isCreatingProject}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {complexityLevels.map((level) => (
                <div key={level.value} className="text-center">
                  <div className={`font-medium ${complexity === level.value ? 'text-primary' : ''}`}>
                    {level.label}
                  </div>
                  <div className="text-xs">{level.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || prompt.length > 500 || isGenerating || isCreatingProject}
          variant="default"
          size="lg"
          className="w-full brand-gradient"
          iconName={isGenerating || isCreatingProject ? "Loader2" : "Sparkles"}
          iconPosition="left"
        >
          {isCreatingProject 
            ? 'Creating Project...' 
            : isGenerating 
              ? 'Generating Design...' :'Generate System Design'}
        </Button>

        {/* Preview Mode Notice for Non-Authenticated Users */}
        {!user && (
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              🎯 <strong>Preview Mode:</strong> Sign in to save your generated designs and access collaboration features
            </p>
          </div>
        )}
      </div>

      {/* Example Prompts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Example Prompts</h3>
        <div className="grid grid-cols-1 gap-3">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-left p-4 bg-surface border border-border rounded-lg hover:border-primary/50 transition-colors group"
              disabled={isGenerating || isCreatingProject}
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name="Lightbulb" 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary transition-colors mt-1" 
                />
                <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {example}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary mb-3">💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm text-primary/80">
          <li className="flex items-start space-x-2">
            <Icon name="Check" size={14} className="mt-0.5 text-primary" />
            <span>Be specific about core features and user interactions</span>
          </li>
          <li className="flex items-start space-x-2">
            <Icon name="Check" size={14} className="mt-0.5 text-primary" />
            <span>Mention scalability requirements and expected traffic</span>
          </li>
          <li className="flex items-start space-x-2">
            <Icon name="Check" size={14} className="mt-0.5 text-primary" />
            <span>Include data storage needs and external integrations</span>
          </li>
          <li className="flex items-start space-x-2">
            <Icon name="Check" size={14} className="mt-0.5 text-primary" />
            <span>Higher complexity generates more detailed architectures</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PromptInput;