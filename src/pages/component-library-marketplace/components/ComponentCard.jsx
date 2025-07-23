import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ComponentCard = ({ component, onAddToCanvas, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryIcon = (category) => {
    const icons = {
      'Data Storage': 'Database',
      'Compute Services': 'Server',
      'Networking': 'Network',
      'Monitoring': 'Activity',
      'Security': 'Shield',
      'Messaging': 'MessageSquare'
    };
    return icons[category] || 'Package';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'text-green-400',
      'Intermediate': 'text-yellow-400',
      'Advanced': 'text-red-400'
    };
    return colors[difficulty] || 'text-gray-400';
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Component Preview */}
      <div className="relative mb-4 h-32 bg-muted rounded-lg overflow-hidden">
        <Image
          src={component?.preview}
          alt={component?.name}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview?.(component)}
              className="mr-2"
            >
              <Icon name="Eye" size={16} />
              Preview
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onAddToCanvas?.(component)}
            >
              <Icon name="Plus" size={16} />
              Add
            </Button>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
          <Icon name={getCategoryIcon(component?.category)} size={12} className="text-primary" />
          <span className="text-xs font-medium">{component?.category}</span>
        </div>

        {/* Premium Badge */}
        {component?.isPremium && (
          <div className="absolute top-2 right-2 bg-secondary/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <Icon name="Crown" size={12} className="text-white" />
          </div>
        )}
      </div>

      {/* Component Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-foreground mb-1">{component?.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{component?.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {component?.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {component?.tags?.length > 3 && (
            <span className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground">
              +{component?.tags?.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Download" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">{component?.downloads}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-yellow-400" />
              <span className="text-muted-foreground">{component?.rating}</span>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${getDifficultyColor(component?.difficulty)}`}>
            <Icon name="TrendingUp" size={14} />
            <span className="text-xs font-medium">{component?.difficulty}</span>
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center space-x-2 pt-2 border-t border-border">
          <Image
            src={component?.creator?.avatar}
            alt={component?.creator?.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-muted-foreground">{component?.creator?.name}</span>
          {component?.creator?.isVerified && (
            <Icon name="BadgeCheck" size={14} className="text-primary" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentCard;