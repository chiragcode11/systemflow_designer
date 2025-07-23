import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const GalleryHeader = ({ onSubmitDesign, isSubmitting, submitError }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [designData, setDesignData] = useState({
    name: '',
    description: '',
    category: 'web',
    tags: ''
  });

  const handleSubmitDesign = async (e) => {
    e.preventDefault();
    if (!designData.name.trim()) return;

    const submitData = {
      ...designData,
      tags: designData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    const result = await onSubmitDesign(submitData);
    
    if (result?.success) {
      setShowSubmitModal(false);
      setDesignData({ name: '', description: '', category: 'web', tags: '' });
    }
  };

  const categories = [
    { value: 'web', label: 'Web Applications' },
    { value: 'mobile', label: 'Mobile Systems' },
    { value: 'backend', label: 'Backend Architecture' },
    { value: 'microservices', label: 'Microservices' },
    { value: 'database', label: 'Database Design' }
  ];

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Community Gallery</h1>
              <p className="text-muted-foreground">Discover and share system designs</p>
            </div>

            <div className="flex items-center space-x-3">
              {user && (
                <Button
                  variant="default"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={() => setShowSubmitModal(true)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Design'}
                </Button>
              )}
              
              <Button
                variant="outline"
                iconName="Plus"
                iconPosition="left"
                onClick={() => navigate('/ai-design-generator')}
              >
                Create New
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

      {/* Submit Design Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Submit Your Design</h2>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {submitError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-destructive" />
                  <span className="text-destructive text-sm">{submitError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitDesign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Design Name
                </label>
                <Input
                  type="text"
                  value={designData.name}
                  onChange={(e) => setDesignData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter design name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={designData.description}
                  onChange={(e) => setDesignData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your design"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={designData.category}
                  onChange={(e) => setDesignData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  type="text"
                  value={designData.tags}
                  onChange={(e) => setDesignData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., microservices, scalable, cloud"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setShowSubmitModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  fullWidth
                  disabled={isSubmitting || !designData.name.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Design'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryHeader;