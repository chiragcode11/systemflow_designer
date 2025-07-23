import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SearchAndFilters from './components/SearchAndFilters';
import CategoryFilter from './components/CategoryFilter';
import ComponentCard from './components/ComponentCard';
import ComponentPreviewModal from './components/ComponentPreviewModal';
import FeaturedCreators from './components/FeaturedCreators';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ComponentLibraryMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add filter state
  const [filters, setFilters] = useState({
    sort: 'popular',
    difficulty: 'all',
    company: 'all',
    premium: false,
    community: false,
    minRating: 0
  });

  // Mock creators data
  const mockCreators = [
    {
      id: 'creator-1',
      name: 'Alex Chen',
      title: 'Senior System Architect',
      bio: 'Specializing in scalable infrastructure design and microservices architecture.',
      avatar: '/assets/images/no_image.png',
      isVerified: true,
      componentsCount: 42,
      totalDownloads: '15.2k',
      averageRating: 4.9,
      specialties: ['Infrastructure', 'Microservices', 'Cloud Native']
    },
    {
      id: 'creator-2',
      name: 'Sarah Johnson',
      title: 'Full-Stack Developer',
      bio: 'Expert in API design and database optimization with 8+ years experience.',
      avatar: '/assets/images/no_image.png',
      isVerified: true,
      componentsCount: 28,
      totalDownloads: '9.8k',
      averageRating: 4.7,
      specialties: ['API Design', 'Databases', 'Performance']
    },
    {
      id: 'creator-3',
      name: 'Michael Rodriguez',
      title: 'DevOps Engineer',
      bio: 'Passionate about automation, CI/CD pipelines, and container orchestration.',
      avatar: '/assets/images/no_image.png',
      isVerified: false,
      componentsCount: 35,
      totalDownloads: '12.1k',
      averageRating: 4.8,
      specialties: ['DevOps', 'Automation', 'Containers', 'Monitoring']
    }
  ];

  // Mock component data
  const mockComponents = [
    {
      id: 'lb-1',
      name: 'Load Balancer',
      description: 'High-performance load balancer component for distributing traffic',
      category: 'infrastructure',
      type: 'load_balancer',
      icon: 'Zap',
      color: '#00d4ff',
      downloads: 1250,
      rating: 4.8,
      creator: 'System Architect',
      isVerified: true,
      tags: ['performance', 'scaling', 'infrastructure'],
      properties: {
        algorithm: 'round-robin',
        healthCheck: true,
        ssl: true
      }
    },
    {
      id: 'api-1',
      name: 'API Gateway',
      description: 'RESTful API gateway with authentication and rate limiting',
      category: 'api',
      type: 'api',
      icon: 'Globe',
      color: '#8b5cf6',
      downloads: 980,
      rating: 4.6,
      creator: 'API Expert',
      isVerified: true,
      tags: ['api', 'gateway', 'authentication'],
      properties: {
        rateLimiting: true,
        authentication: 'JWT',
        cors: true
      }
    },
    {
      id: 'db-1',
      name: 'PostgreSQL Database',
      description: 'Scalable PostgreSQL database component with replication',
      category: 'database',
      type: 'database',
      icon: 'Database',
      color: '#336791',
      downloads: 2100,
      rating: 4.9,
      creator: 'DB Specialist',
      isVerified: true,
      tags: ['database', 'postgresql', 'replication'],
      properties: {
        replication: 'master-slave',
        backup: 'automated',
        ssl: true
      }
    },
    {
      id: 'cache-1',
      name: 'Redis Cache',
      description: 'In-memory caching solution for high-speed data access',
      category: 'cache',
      type: 'cache',
      icon: 'Zap',
      color: '#dc382d',
      downloads: 1450,
      rating: 4.7,
      creator: 'Cache Expert',
      isVerified: false,
      tags: ['cache', 'redis', 'performance'],
      properties: {
        persistence: true,
        clustering: true,
        sentinel: true
      }
    },
    {
      id: 'ms-1',
      name: 'User Microservice',
      description: 'User management microservice with CRUD operations',
      category: 'microservice',
      type: 'microservice',
      icon: 'Users',
      color: '#ff6b35',
      downloads: 890,
      rating: 4.5,
      creator: 'Microservice Dev',
      isVerified: true,
      tags: ['microservice', 'users', 'crud'],
      properties: {
        framework: 'Node.js',
        database: 'MongoDB',
        authentication: 'JWT'
      }
    },
    {
      id: 'mq-1',
      name: 'Message Queue',
      description: 'Reliable message queue for asynchronous processing',
      category: 'messaging',
      type: 'queue',
      icon: 'MessageSquare',
      color: '#10b981',
      downloads: 670,
      rating: 4.4,
      creator: 'Queue Master',
      isVerified: false,
      tags: ['messaging', 'queue', 'async'],
      properties: {
        durability: true,
        routing: 'topic',
        clustering: true
      }
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setComponents(mockComponents);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', name: 'All Components', count: mockComponents.length },
    { id: 'infrastructure', name: 'Infrastructure', count: mockComponents.filter(c => c.category === 'infrastructure').length },
    { id: 'api', name: 'API & Services', count: mockComponents.filter(c => c.category === 'api').length },
    { id: 'database', name: 'Databases', count: mockComponents.filter(c => c.category === 'database').length },
    { id: 'cache', name: 'Caching', count: mockComponents.filter(c => c.category === 'cache').length },
    { id: 'microservice', name: 'Microservices', count: mockComponents.filter(c => c.category === 'microservice').length },
    { id: 'messaging', name: 'Messaging', count: mockComponents.filter(c => c.category === 'messaging').length }
  ];

  const filteredComponents = components?.filter(component => {
    const matchesCategory = activeCategory === 'all' || component?.category === activeCategory;
    const matchesSearch = !searchQuery || 
      component?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component?.tags?.some(tag => tag?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    // Apply sorting based on filters.sort
    switch (filters?.sort) {
      case 'newest':
        return new Date(b?.createdAt || Date.now()) - new Date(a?.createdAt || Date.now());
      case 'rating':
        return (b?.rating || 0) - (a?.rating || 0);
      case 'downloads':
        return (b?.downloads || 0) - (a?.downloads || 0);
      case 'name':
        return (a?.name || '').localeCompare(b?.name || '');
      case 'popular':
      default:
        return (b?.downloads || 0) - (a?.downloads || 0);
    }
  }) || [];

  // Add filter change handler
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Add search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddToCanvas = (component) => {
    // Navigate to canvas with component
    navigate('/canvas-studio', { 
      state: { 
        addComponent: component,
        fromLibrary: true 
      } 
    });
  };

  const handleContribute = () => {
    if (!user) {
      setError('Please sign in to contribute components');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Navigate to contribution page or show modal
    navigate('/canvas-studio', { 
      state: { 
        mode: 'contribute'
      } 
    });
  };

  const handleCreateComponent = () => {
    if (!user) {
      setError('Please sign in to create components');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    // Navigate to component creation
    navigate('/canvas-studio', { 
      state: { 
        mode: 'create-component'
      } 
    });
  };

  const handleViewProfile = (creator) => {
    // Navigate to creator profile or show modal
    console.log('View profile for:', creator?.name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading components...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Component Library</h1>
              <p className="text-muted-foreground">Reusable system design components</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                onClick={handleContribute}
              >
                Contribute
              </Button>
              
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleCreateComponent}
              >
                Create Component
              </Button>

              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="AlertCircle" size={20} className="text-destructive" />
              <span className="text-destructive font-medium">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-destructive/70 hover:text-destructive"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="px-6 py-6">
        {/* Search and Filters */}
        <SearchAndFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          filters={filters}
        />

        {/* Category Filter */}
        <div className="mt-6">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Components Grid */}
        <div className="mt-8">
          {filteredComponents?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component?.id}
                  component={component}
                  onAddToCanvas={() => handleAddToCanvas(component)}
                  onPreview={() => setSelectedComponent(component)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No components found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No components match "${searchQuery}". Try a different search term.`
                  : `No components found in the ${categories?.find(c => c?.id === activeCategory)?.name} category.`
                }
              </p>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleCreateComponent}
              >
                Create Component
              </Button>
            </div>
          )}
        </div>

        {/* Featured Creators - Trending This Week removed as requested */}
        <div className="mt-16">
          <FeaturedCreators 
            creators={mockCreators}
            onViewProfile={handleViewProfile}
          />
        </div>
      </div>

      {/* Component Preview Modal */}
      {selectedComponent && (
        <ComponentPreviewModal
          component={selectedComponent}
          onClose={() => setSelectedComponent(null)}
          onAddToCanvas={() => {
            handleAddToCanvas(selectedComponent);
            setSelectedComponent(null);
          }}
        />
      )}
    </div>
  );
};

export default ComponentLibraryMarketplace;