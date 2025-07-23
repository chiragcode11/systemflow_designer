import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GalleryHeader from './components/GalleryHeader';
import CategoryTabs from './components/CategoryTabs';
import DesignCard from './components/DesignCard';
import FeaturedSection from './components/FeaturedSection';
import CommunityStats from './components/CommunityStats';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import projectService from '../../utils/projectService';

const CommunityGallery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [designs, setDesigns] = useState([]);
  const [featuredDesigns, setFeaturedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadGalleryData();
  }, [activeCategory]);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load public projects
      const result = await projectService.getPublicProjects(activeCategory);
      if (result.success) {
        const publicDesigns = result.data || [];
        setDesigns(publicDesigns);
        
        // Set featured designs (first 3 public designs)
        setFeaturedDesigns(publicDesigns.slice(0, 3));
      } else {
        setError(result.error);
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      setError('Failed to load gallery data');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDesign = async (designData) => {
    if (!user) {
      setSubmitError('Please sign in to submit designs');
      setTimeout(() => setSubmitError(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await projectService.createProject({
        ...designData,
        is_public: true,
        status: 'published'
      });

      if (result.success) {
        // Refresh gallery data
        await loadGalleryData();
        return { success: true, data: result.data };
      } else {
        setSubmitError(result.error);
        setTimeout(() => setSubmitError(null), 5000);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMsg = 'Failed to submit design';
      setSubmitError(errorMsg);
      setTimeout(() => setSubmitError(null), 5000);
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDesignClick = (design) => {
    // Navigate to canvas with design
    navigate('/canvas-studio', { 
      state: { 
        designId: design.id,
        projectId: design.id,
        design: design,
        readOnly: !user || design.owner_id !== user.id // Read-only if not owner
      } 
    });
  };

  const handleLikeDesign = async (designId) => {
    if (!user) return;

    try {
      // Implement like functionality with Supabase
      const result = await projectService.likeProject(designId);
      if (result.success) {
        // Update local state
        setDesigns(prev => prev.map(design => 
          design.id === designId 
            ? { ...design, likes: (design.likes || 0) + 1, isLiked: true }
            : design
        ));
      }
    } catch (error) {
      console.log('Failed to like design:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Designs', count: designs.length },
    { id: 'web', name: 'Web Applications', count: designs.filter(d => d.category === 'web').length },
    { id: 'mobile', name: 'Mobile Systems', count: designs.filter(d => d.category === 'mobile').length },
    { id: 'backend', name: 'Backend Architecture', count: designs.filter(d => d.category === 'backend').length },
    { id: 'microservices', name: 'Microservices', count: designs.filter(d => d.category === 'microservices').length },
    { id: 'database', name: 'Database Design', count: designs.filter(d => d.category === 'database').length }
  ];

  // Create designCounts object for CategoryTabs
  const designCounts = {
    all: designs.length,
    'interview-winners': designs.filter(d => d?.tags?.includes('interview-winner')).length,
    'innovative-solutions': designs.filter(d => d?.tags?.includes('innovative')).length,
    'learning-examples': designs.filter(d => d?.tags?.includes('learning')).length,
    'templates': designs.filter(d => d?.tags?.includes('template')).length,
    'trending': designs.filter(d => d?.trending === true).length,
    web: designs.filter(d => d?.category === 'web').length,
    mobile: designs.filter(d => d?.category === 'mobile').length,
    backend: designs.filter(d => d?.category === 'backend').length,
    microservices: designs.filter(d => d?.category === 'microservices').length,
    database: designs.filter(d => d?.category === 'database').length
  };

  const filteredDesigns = activeCategory === 'all' 
    ? designs 
    : designs.filter(design => design.category === activeCategory || design.tags?.includes(activeCategory));

  return (
    <div className="min-h-screen bg-background">
      <GalleryHeader 
        onSubmitDesign={handleSubmitDesign}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

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
        {/* Featured Section - Featured Success Stories removed as requested */}
        <FeaturedSection 
          designs={featuredDesigns}
          onDesignClick={handleDesignClick}
        />

        {/* Category Navigation */}
        <div className="mt-12">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            designCounts={designCounts}
          />
        </div>

        {/* Main Gallery */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading designs...</p>
              </div>
            </div>
          ) : filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesigns.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  onClick={() => handleDesignClick(design)}
                  onLike={() => handleLikeDesign(design.id)}
                  currentUser={user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No designs found</h3>
              <p className="text-muted-foreground mb-6">
                {activeCategory === 'all' ?'Be the first to share your design with the community!'
                  : `No designs found in the ${categories.find(c => c.id === activeCategory)?.name} category.`
                }
              </p>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => navigate('/ai-design-generator')}
              >
                Create Design
              </Button>
            </div>
          )}
        </div>

        {/* Community Stats */}
        <div className="mt-16">
          <CommunityStats designs={designs} />
        </div>
      </div>
    </div>
  );
};

export default CommunityGallery;