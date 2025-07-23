import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'All': 'Grid3X3',
      'Data Storage': 'Database',
      'Compute Services': 'Server',
      'Networking': 'Network',
      'Monitoring': 'Activity',
      'Security': 'Shield',
      'Messaging': 'MessageSquare'
    };
    return icons[category] || 'Package';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Filter" size={18} className="text-primary" />
        <span>Categories</span>
      </h3>
      
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategoryChange(category.name)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
              selectedCategory === category.name
                ? 'bg-primary/10 text-primary border border-primary/20' :'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={getCategoryIcon(category.name)} 
                size={18} 
                className={selectedCategory === category.name ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className="font-medium">{category.name}</span>
            </div>
            <span className={`text-sm px-2 py-1 rounded-md ${
              selectedCategory === category.name
                ? 'bg-primary/20 text-primary' :'bg-muted text-muted-foreground'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;