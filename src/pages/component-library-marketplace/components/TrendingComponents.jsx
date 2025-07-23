import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TrendingComponents = ({ components, onViewComponent, onAddToCanvas }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return { icon: 'TrendingUp', color: 'text-green-400' };
    if (trend < 0) return { icon: 'TrendingDown', color: 'text-red-400' };
    return { icon: 'Minus', color: 'text-muted-foreground' };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
          <Icon name="TrendingUp" size={24} className="text-primary" />
          <span>Trending This Week</span>
        </h2>
        <Button variant="ghost" size="sm">
          View All
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </div>

      <div className="space-y-4">
        {components.map((component, index) => {
          const trendData = getTrendIcon(component.trendPercentage);
          
          return (
            <div
              key={component.id}
              className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-all duration-200 group"
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary">#{index + 1}</span>
              </div>

              {/* Component Preview */}
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={component.preview}
                  alt={component.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Component Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{component.name}</h3>
                  {component.isPremium && (
                    <Icon name="Crown" size={14} className="text-secondary flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                  {component.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Download" size={12} />
                    <span>{component.downloads}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-yellow-400" />
                    <span>{component.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{component.category}</span>
                  </div>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className={`flex items-center space-x-1 ${trendData.color}`}>
                  <Icon name={trendData.icon} size={16} />
                  <span className="text-sm font-medium">
                    {Math.abs(component.trendPercentage)}%
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewComponent(component)}
                >
                  <Icon name="Eye" size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddToCanvas(component)}
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">2.4K</div>
            <div className="text-sm text-muted-foreground">Downloads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">156</div>
            <div className="text-sm text-muted-foreground">New Components</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">89</div>
            <div className="text-sm text-muted-foreground">Active Creators</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingComponents;