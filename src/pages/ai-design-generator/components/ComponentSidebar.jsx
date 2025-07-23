import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComponentSidebar = ({ isVisible, onToggle, currentPrompt }) => {
  const [activeCategory, setActiveCategory] = useState('suggested');

  const componentCategories = [
    {
      id: 'suggested',
      name: 'AI Suggested',
      icon: 'Sparkles',
      components: [
        { name: 'Load Balancer', icon: 'Zap', description: 'Distributes incoming requests', usage: 'High' },
        { name: 'API Gateway', icon: 'Globe', description: 'Single entry point for APIs', usage: 'High' },
        { name: 'Message Queue', icon: 'MessageSquare', description: 'Asynchronous communication', usage: 'Medium' },
        { name: 'Cache Layer', icon: 'Layers', description: 'Fast data retrieval', usage: 'High' }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      icon: 'Server',
      components: [
        { name: 'Load Balancer', icon: 'Zap', description: 'Traffic distribution', usage: 'High' },
        { name: 'CDN', icon: 'Globe', description: 'Content delivery network', usage: 'Medium' },
        { name: 'Firewall', icon: 'Shield', description: 'Security protection', usage: 'High' },
        { name: 'Monitoring', icon: 'Activity', description: 'System observability', usage: 'Medium' }
      ]
    },
    {
      id: 'services',
      name: 'Services',
      icon: 'Box',
      components: [
        { name: 'User Service', icon: 'User', description: 'User management', usage: 'High' },
        { name: 'Auth Service', icon: 'Lock', description: 'Authentication & authorization', usage: 'High' },
        { name: 'Notification Service', icon: 'Bell', description: 'Push notifications', usage: 'Medium' },
        { name: 'Search Service', icon: 'Search', description: 'Full-text search', usage: 'Medium' }
      ]
    },
    {
      id: 'storage',
      name: 'Storage',
      icon: 'Database',
      components: [
        { name: 'SQL Database', icon: 'Database', description: 'Relational data storage', usage: 'High' },
        { name: 'NoSQL Database', icon: 'HardDrive', description: 'Document/key-value store', usage: 'Medium' },
        { name: 'File Storage', icon: 'Folder', description: 'Object/file storage', usage: 'Medium' },
        { name: 'Data Warehouse', icon: 'Archive', description: 'Analytics data store', usage: 'Low' }
      ]
    }
  ];

  const getUsageColor = (usage) => {
    switch (usage) {
      case 'High': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Low': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const handleComponentDrag = (component) => {
    console.log('Dragging component:', component.name);
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="fixed top-24 right-4 z-30 bg-surface border border-border"
      >
        <Icon name={isVisible ? "PanelRightClose" : "PanelRightOpen"} size={20} />
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-surface border-l border-border z-20
        transform transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={20} className="text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Component Library</h3>
                <p className="text-xs text-muted-foreground">Drag components to canvas</p>
              </div>
            </div>
          </div>

          {/* Context Banner */}
          {currentPrompt && (
            <div className="p-4 bg-primary/5 border-b border-border">
              <div className="flex items-start space-x-2">
                <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-primary">AI Context</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Components suggested based on: "{currentPrompt.substring(0, 50)}..."
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex overflow-x-auto border-b border-border">
            {componentCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={category.icon} size={16} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Components List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {componentCategories
                .find(cat => cat.id === activeCategory)
                ?.components.map((component, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleComponentDrag(component)}
                  className="p-3 bg-background border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Icon name={component.icon} size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {component.name}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getUsageColor(component.usage)}`}>
                          {component.usage}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {component.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Icon name="Move" size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Drag to canvas</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-center space-y-2">
              <div className="text-xs text-muted-foreground">
                {componentCategories.find(cat => cat.id === activeCategory)?.components.length} components available
              </div>
              <Button variant="outline" size="sm" fullWidth iconName="Plus">
                Request Component
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComponentSidebar;