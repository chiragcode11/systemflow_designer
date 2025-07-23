import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryTabs = ({ activeCategory, onCategoryChange, designCounts }) => {
  const categories = [
    {
      id: 'all',
      name: 'All Designs',
      icon: 'Grid3X3',
      description: 'Browse all community designs',
      color: 'text-foreground'
    },
    {
      id: 'interview-winners',
      name: 'Interview Winners',
      icon: 'Trophy',
      description: 'Designs that led to job offers',
      color: 'text-accent'
    },
    {
      id: 'innovative-solutions',
      name: 'Innovative Solutions',
      icon: 'Lightbulb',
      description: 'Creative architectural approaches',
      color: 'text-primary'
    },
    {
      id: 'learning-examples',
      name: 'Learning Examples',
      icon: 'BookOpen',
      description: 'Educational system breakdowns',
      color: 'text-secondary'
    },
    {
      id: 'templates',
      name: 'Templates',
      icon: 'Layout',
      description: 'Reusable architectural patterns',
      color: 'text-warning'
    },
    {
      id: 'trending',
      name: 'Trending',
      icon: 'TrendingUp',
      description: 'Popular designs this week',
      color: 'text-error'
    }
  ];

  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              Discover designs organized by type, complexity, and learning objectives
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-sm text-muted-foreground">
              Showing {designCounts?.[activeCategory] || 0} designs
            </div>
            <Button variant="outline" size="sm">
              <Icon name="Filter" size={16} />
              <span className="ml-2">More Filters</span>
            </Button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                relative p-4 rounded-lg border transition-all duration-200 text-left group
                ${activeCategory === category.id
                  ? 'border-primary bg-primary/5 shadow-brand-shadow-primary'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-primary/5'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${activeCategory === category.id
                    ? 'bg-primary/20' :'bg-muted group-hover:bg-primary/10'
                  }
                `}>
                  <Icon 
                    name={category.icon} 
                    size={20} 
                    className={activeCategory === category.id ? 'text-primary' : category.color}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-semibold text-sm mb-1 transition-colors
                    ${activeCategory === category.id ? 'text-primary' : 'text-foreground'}
                  `}>
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                  
                  {/* Count badge */}
                  <div className="mt-2">
                    <span className={`
                      inline-flex items-center px-2 py-1 text-xs rounded-full
                      ${activeCategory === category.id
                        ? 'bg-primary/20 text-primary' :'bg-muted text-muted-foreground'
                      }
                    `}>
                      {designCounts?.[category.id] || 0} designs
                    </span>
                  </div>
                </div>
              </div>

              {/* Active indicator */}
              {activeCategory === category.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-accent">89%</div>
              <div className="text-xs text-muted-foreground">Interview Success Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">2.4k</div>
              <div className="text-xs text-muted-foreground">Total Designs</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">156</div>
              <div className="text-xs text-muted-foreground">Templates Available</div>
            </div>
            <div>
              <div className="text-lg font-bold text-warning">1.2k</div>
              <div className="text-xs text-muted-foreground">Active Contributors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;