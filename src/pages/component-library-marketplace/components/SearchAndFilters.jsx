import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchAndFilters = ({ onSearch, onFilterChange, filters }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'name', label: 'Name (A-Z)' }
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const companyOptions = [
    { value: 'all', label: 'All Companies' },
    { value: 'google', label: 'Google' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'microsoft', label: 'Microsoft' },
    { value: 'netflix', label: 'Netflix' },
    { value: 'uber', label: 'Uber' },
    { value: 'airbnb', label: 'Airbnb' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    onSearch('');
    onFilterChange('sort', 'popular');
    onFilterChange('difficulty', 'all');
    onFilterChange('company', 'all');
    onFilterChange('premium', false);
    onFilterChange('community', false);
    onFilterChange('minRating', 0);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search components, patterns, or architectures..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            options={sortOptions}
            value={filters?.sort || 'popular'}
            onChange={(value) => handleFilterChange('sort', value)}
            className="min-w-[140px]"
          />
          
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Difficulty Level
              </label>
              <Select
                options={difficultyOptions}
                value={filters?.difficulty || 'all'}
                onChange={(value) => handleFilterChange('difficulty', value)}
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company/Use Case
              </label>
              <Select
                options={companyOptions}
                value={filters?.company || 'all'}
                onChange={(value) => handleFilterChange('company', value)}
              />
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minimum Rating
              </label>
              <Select
                options={[
                  { value: 0, label: 'Any Rating' },
                  { value: 3, label: '3+ Stars' },
                  { value: 4, label: '4+ Stars' },
                  { value: 4.5, label: '4.5+ Stars' }
                ]}
                value={filters?.minRating || 0}
                onChange={(value) => handleFilterChange('minRating', Number(value))}
              />
            </div>

            {/* Type Filters */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Component Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters?.premium || false}
                    onChange={(e) => handleFilterChange('premium', e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Premium Only</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters?.community || false}
                    onChange={(e) => handleFilterChange('community', e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Community</span>
                </label>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Active filters: {[
                filters?.difficulty !== 'all' && 'Difficulty',
                filters?.company !== 'all' && 'Company',
                filters?.minRating > 0 && 'Rating',
                filters?.premium && 'Premium',
                filters?.community && 'Community'
              ].filter(Boolean).join(', ') || 'None'}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Quick Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: 'Microservices', filter: 'microservices' },
          { label: 'Load Balancing', filter: 'load-balancing' },
          { label: 'Databases', filter: 'databases' },
          { label: 'Caching', filter: 'caching' },
          { label: 'Message Queues', filter: 'messaging' },
          { label: 'Security', filter: 'security' }
        ].map((tag) => (
          <button
            key={tag.filter}
            onClick={() => onSearch(tag.label)}
            className="px-3 py-1 text-sm bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilters;