import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'Sparkles',
      title: 'AI-Powered Generation',
      description: 'Transform natural language prompts into comprehensive system diagrams with intelligent component suggestions.',
      examples: [
        'Design a microservices architecture',
        'Create a real-time chat system',
        'Build a scalable e-commerce platform'
      ],
      color: 'primary',
      link: '/ai-design-generator'
    },
    {
      icon: 'Users',
      title: 'Real-Time Collaboration',
      description: 'Work together seamlessly with live cursors, instant updates, and conflict-free collaborative editing.',
      examples: [
        'Multiple cursors and selections',
        'Live commenting and feedback',
        'Version history and rollback'
      ],
      color: 'secondary',
      link: '/collaboration-workspace'
    },
    {
      icon: 'Target',
      title: 'Interview Preparation',
      description: 'Practice with real system design questions, get AI feedback, and track your improvement over time.',
      examples: [
        'System design interview questions',
        'Difficulty rating system',
        'Performance analytics'
      ],
      color: 'accent',
      link: '/community-gallery'
    }
  ];

  return (
    <section className="py-24 bg-surface/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Master System Design
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From AI-powered diagram generation to collaborative learning, we've built the complete toolkit 
            for system design mastery and interview success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-card border border-border rounded-2xl p-8 h-full hover:border-primary/30 transition-all duration-300 hover:shadow-brand-interactive">
                {/* Feature Icon */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  feature.color === 'primary' ? 'bg-primary/10' :
                  feature.color === 'secondary' ? 'bg-secondary/10' : 'bg-accent/10'
                }`}>
                  <Icon 
                    name={feature.icon} 
                    size={24} 
                    className={
                      feature.color === 'primary' ? 'text-primary' :
                      feature.color === 'secondary' ? 'text-secondary' : 'text-accent'
                    }
                  />
                </div>

                {/* Feature Content */}
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Examples */}
                <div className="space-y-3 mb-8">
                  {feature.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        feature.color === 'primary' ? 'bg-primary' :
                        feature.color === 'secondary' ? 'bg-secondary' : 'bg-accent'
                      }`} />
                      <span className="text-sm text-muted-foreground">{example}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link to={feature.link}>
                  <Button 
                    variant="ghost" 
                    className="group-hover:bg-muted/50 transition-colors w-full justify-start"
                  >
                    <span>Explore Feature</span>
                    <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;