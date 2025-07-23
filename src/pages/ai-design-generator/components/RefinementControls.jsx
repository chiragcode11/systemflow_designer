import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RefinementControls = ({ isVisible, onApplyRefinements, generatedDesign }) => {
  const [complexity, setComplexity] = useState('medium');
  const [architecture, setArchitecture] = useState('microservices');
  const [scale, setScale] = useState('startup');
  const [focus, setFocus] = useState('performance');

  const complexityOptions = [
    { value: 'simple', label: 'Simple', description: 'Basic components and connections' },
    { value: 'medium', label: 'Medium', description: 'Balanced detail and clarity' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive system view' }
  ];

  const architectureOptions = [
    { value: 'monolithic', label: 'Monolithic', description: 'Single deployable unit' },
    { value: 'microservices', label: 'Microservices', description: 'Distributed services' },
    { value: 'serverless', label: 'Serverless', description: 'Function-based architecture' },
    { value: 'hybrid', label: 'Hybrid', description: 'Mixed architectural patterns' }
  ];

  const scaleOptions = [
    { value: 'startup', label: 'Startup Scale', description: '< 100K users' },
    { value: 'growth', label: 'Growth Stage', description: '100K - 1M users' },
    { value: 'enterprise', label: 'Enterprise', description: '> 1M users' }
  ];

  const focusOptions = [
    { value: 'performance', label: 'Performance', description: 'Optimize for speed' },
    { value: 'scalability', label: 'Scalability', description: 'Handle growth' },
    { value: 'reliability', label: 'Reliability', description: 'Minimize downtime' },
    { value: 'cost', label: 'Cost Efficiency', description: 'Optimize expenses' },
    { value: 'security', label: 'Security', description: 'Enhance protection' }
  ];

  const handleApplyRefinements = () => {
    const refinements = {
      complexity,
      architecture,
      scale,
      focus
    };
    onApplyRefinements(refinements);
  };

  const handleReset = () => {
    setComplexity('medium');
    setArchitecture('microservices');
    setScale('startup');
    setFocus('performance');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Refinement Controls</h3>
            <p className="text-sm text-muted-foreground">Customize your system design parameters</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} iconName="RotateCcw">
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Select
            label="Complexity Level"
            description="How detailed should the diagram be?"
            options={complexityOptions}
            value={complexity}
            onChange={setComplexity}
          />

          <Select
            label="Architecture Pattern"
            description="Choose the architectural approach"
            options={architectureOptions}
            value={architecture}
            onChange={setArchitecture}
          />
        </div>

        <div className="space-y-4">
          <Select
            label="Scale Requirements"
            description="Expected system scale and load"
            options={scaleOptions}
            value={scale}
            onChange={setScale}
          />

          <Select
            label="Optimization Focus"
            description="Primary optimization target"
            options={focusOptions}
            value={focus}
            onChange={setFocus}
          />
        </div>
      </div>

      {/* Advanced Options */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Sliders" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Advanced Options</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Include Monitoring</label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Yes</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Show Data Flow</label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Yes</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Add Security</label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Yes</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Include Backup</label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Yes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Configuration Summary */}
      <div className="bg-muted/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Current Configuration</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Complexity:</span>
            <span className="ml-2 text-foreground capitalize">{complexity}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Architecture:</span>
            <span className="ml-2 text-foreground capitalize">{architecture}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Scale:</span>
            <span className="ml-2 text-foreground capitalize">{scale}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Focus:</span>
            <span className="ml-2 text-foreground capitalize">{focus}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          Changes will regenerate the diagram with new parameters
        </div>
        <Button
          variant="default"
          onClick={handleApplyRefinements}
          iconName="Wand2"
          iconPosition="left"
          className="brand-gradient"
          disabled={!generatedDesign}
        >
          Apply Refinements
        </Button>
      </div>
    </div>
  );
};

export default RefinementControls;