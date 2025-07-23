import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const WorkspaceHeader = ({ user, onCreateProject, recentProjects = [], onProjectClick }) => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    isPublic: false
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectData.name.trim()) return;

    setIsCreating(true);
    const result = await onCreateProject(newProjectData);
    
    if (result?.success) {
      setShowCreateModal(false);
      setNewProjectData({ name: '', description: '', isPublic: false });
    }
    setIsCreating(false);
  };

  const handleNewDesign = () => {
    navigate('/ai-design-generator');
  };

  // Remove import button functionality as requested
  const handleTemplates = () => {
    navigate('/ai-design-generator', { state: { activeTab: 'templates' } });
  };

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Workspace</h1>
              {user && (
                <div className="text-sm text-muted-foreground">
                  Welcome back, {user.full_name}!
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Workspace Actions - Import button removed */}
              <Button
                variant="outline"
                iconName="Zap"
                iconPosition="left"
                onClick={handleNewDesign}
              >
                New Design
              </Button>
              
              <Button
                variant="outline"
                iconName="Layout"
                iconPosition="left"
                onClick={handleTemplates}
              >
                Templates
              </Button>

              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setShowCreateModal(true)}
              >
                New Project
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

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Create New Project</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Name
                </label>
                <Input
                  type="text"
                  value={newProjectData.name}
                  onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newProjectData.description}
                  onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newProjectData.isPublic}
                  onChange={(e) => setNewProjectData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded border-border"
                />
                <label htmlFor="isPublic" className="text-sm text-foreground">
                  Make project public
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  fullWidth
                  disabled={isCreating || !newProjectData.name.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspaceHeader;