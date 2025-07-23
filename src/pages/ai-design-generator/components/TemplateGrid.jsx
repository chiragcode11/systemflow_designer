import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplateGrid = ({ templates = [], onTemplateSelect }) => {
  const navigate = useNavigate();

  const templateCategories = [
    {
      id: 'social',
      name: 'Social Media Platforms',
      icon: 'Users',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      templates: [
        { id: 'twitter', name: 'Twitter-like Microblogging', complexity: 'Medium', users: '1.2k', category: 'social' },
        { id: 'instagram', name: 'Instagram Photo Sharing', complexity: 'High', users: '890', category: 'social' },
        { id: 'linkedin', name: 'LinkedIn Professional Network', complexity: 'High', users: '650', category: 'social' },
        { id: 'discord', name: 'Discord Chat Platform', complexity: 'Medium', users: '1.5k', category: 'social' }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Systems',
      icon: 'ShoppingCart',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      templates: [
        { id: 'amazon', name: 'Amazon Marketplace', complexity: 'High', users: '2.1k', category: 'ecommerce' },
        { id: 'shopify', name: 'Shopify Store Builder', complexity: 'Medium', users: '980', category: 'ecommerce' },
        { id: 'payment', name: 'Payment Gateway System', complexity: 'High', users: '1.3k', category: 'ecommerce' },
        { id: 'inventory', name: 'Inventory Management', complexity: 'Medium', users: '750', category: 'ecommerce' }
      ]
    },
    {
      id: 'streaming',
      name: 'Streaming Services',
      icon: 'Play',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      templates: [
        { id: 'netflix', name: 'Netflix Video Streaming', complexity: 'High', users: '1.8k', category: 'streaming' },
        { id: 'spotify', name: 'Spotify Music Platform', complexity: 'High', users: '1.4k', category: 'streaming' },
        { id: 'youtube', name: 'YouTube Content Platform', complexity: 'High', users: '2.3k', category: 'streaming' },
        { id: 'twitch', name: 'Twitch Live Streaming', complexity: 'Medium', users: '920', category: 'streaming' }
      ]
    },
    {
      id: 'database',
      name: 'Distributed Databases',
      icon: 'Database',
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      templates: [
        { id: 'mongodb', name: 'MongoDB Cluster Design', complexity: 'High', users: '680', category: 'database' },
        { id: 'redis', name: 'Redis Caching Layer', complexity: 'Medium', users: '1.1k', category: 'database' },
        { id: 'elasticsearch', name: 'Elasticsearch Search', complexity: 'High', users: '540', category: 'database' },
        { id: 'cassandra', name: 'Cassandra NoSQL', complexity: 'High', users: '420', category: 'database' }
      ]
    }
  ];

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Low': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'High': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const handleTemplateClick = (template) => {
    // Navigate directly to canvas with template data
    navigate('/canvas-studio', { 
      state: { 
        template: template,
        fromTemplate: true 
      } 
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Popular Templates</h2>
        <p className="text-muted-foreground">Start with proven system design patterns from real interviews</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {templateCategories.map((category) => (
          <div key={category.id} className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={category.icon} size={20} className={category.color} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.templates.length} templates available</p>
              </div>
            </div>

            <div className="space-y-2">
              {category.templates.map((template, index) => (
                <button
                  key={template.id || index}
                  onClick={() => handleTemplateClick(template)}
                  className="w-full p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {template.name}
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(template.complexity)}`}>
                          {template.complexity}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center space-x-1">
                          <Icon name="Users" size={12} />
                          <span>{template.users} used</span>
                        </span>
                      </div>
                    </div>
                    <Icon name="ArrowRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              fullWidth
              iconName="Plus"
              iconPosition="left"
              onClick={() => navigate('/canvas-studio', { 
                state: { 
                  category: category.name,
                  fromTemplate: true 
                } 
              })}
            >
              Browse All {category.name}
            </Button>
          </div>
        ))}
      </div>

      {/* Database Templates Section */}
      {templates.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-400/10 rounded-lg flex items-center justify-center">
              <Icon name="Layers" size={20} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Community Templates</h3>
              <p className="text-sm text-muted-foreground">{templates.length} templates from the community</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.slice(0, 4).map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {template.name}
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(template.difficulty_level > 3 ? 'High' : template.difficulty_level > 1 ? 'Medium' : 'Low')}`}>
                        Level {template.difficulty_level}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Icon name="Users" size={12} />
                        <span>{template.usage_count || 0} used</span>
                      </span>
                    </div>
                  </div>
                  <Icon name="ArrowRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGrid;