import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import WorkspaceHeader from './components/WorkspaceHeader';
import ProjectGrid from './components/ProjectGrid';
import ActivityFeed from './components/ActivityFeed';
import VersionControl from './components/VersionControl';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import projectService from '../../utils/projectService';

const CollaborationWorkspace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const result = await projectService.getUserProjects();
      if (result.success) {
        setProjects(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const result = await projectService.createProject(projectData);
      if (result.success) {
        setProjects(prev => [result.data, ...prev]);
        setShowCreateModal(false);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create project');
    }
  };

  const handleShareProject = async (project) => {
    try {
      setSelectedProject(project);
      
      // Generate shareable link for real-time collaboration
      const shareResult = await projectService.generateShareLink(project.id);
      if (shareResult.success) {
        setShareLink(shareResult.data.shareLink);
        setShowShareModal(true);
      } else {
        setError('Failed to generate share link');
      }
    } catch (error) {
      setError('Failed to share project');
    }
  };

  const handleJoinWorkspace = async (shareLink) => {
    try {
      const result = await projectService.joinWorkspace(shareLink);
      if (result.success) {
        // Navigate to shared canvas
        navigate('/canvas-studio', {
          state: {
            projectId: result.data.projectId,
            isCollaborative: true,
            shareToken: result.data.shareToken
          }
        });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to join workspace');
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    // Show success message
    const originalText = 'Copy Link';
    // Could add toast notification here
  };

  const tabs = [
    { id: 'projects', name: 'Projects', icon: 'Folder' },
    { id: 'activity', name: 'Activity', icon: 'Activity' },
    { id: 'versions', name: 'Version Control', icon: 'GitBranch' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the collaboration workspace.
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <WorkspaceHeader />

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowCreateModal(true)}
            >
              New Project
            </Button>
            
            <Button
              variant="default"
              iconName="Share"
              iconPosition="left"
              onClick={() => {
                if (projects.length > 0) {
                  handleShareProject(projects[0]);
                } else {
                  setError('Create a project first to share');
                }
              }}
            >
              Share Workspace
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
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

        {/* Tab Content */}
        <div className="grid grid-cols-12 gap-6">
          {activeTab === 'projects' && (
            <>
              <div className="col-span-8">
                <ProjectGrid
                  projects={projects}
                  loading={loading}
                  onProjectClick={(project) => navigate('/canvas-studio', { state: { projectId: project.id } })}
                  onShareProject={handleShareProject}
                  onDeleteProject={async (projectId) => {
                    const result = await projectService.deleteProject(projectId);
                    if (result.success) {
                      setProjects(prev => prev.filter(p => p.id !== projectId));
                    }
                  }}
                />
              </div>
              <div className="col-span-4">
                <ActivityFeed projectId={selectedProject?.id} />
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <div className="col-span-12">
              <ActivityFeed />
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="col-span-12">
              <VersionControl projectId={selectedProject?.id} />
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          project={selectedProject}
          shareLink={shareLink}
          onClose={() => setShowShareModal(false)}
          onCopy={copyShareLink}
        />
      )}
    </div>
  );
};

// Create Project Modal Component
const CreateProjectModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-brand w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Create New Project</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Project Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter project name"
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter project description"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
            />
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm text-foreground">Make project public</span>
          </label>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Share Modal Component
const ShareModal = ({ project, shareLink, onClose, onCopy }) => {
  const [joinLink, setJoinLink] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-brand w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Share Workspace</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Collaboration Link
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted text-foreground"
              />
              <Button variant="outline" onClick={onCopy}>
                <Icon name="Copy" size={16} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Share this link to allow others to collaborate on your workspace in real-time.
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Join Existing Workspace
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={joinLink}
                onChange={(e) => setJoinLink(e.target.value)}
                placeholder="Paste workspace link here"
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button 
                onClick={() => {
                  if (joinLink.trim()) {
                    // Handle join workspace
                    console.log('Joining workspace:', joinLink);
                  }
                }}
                disabled={!joinLink.trim()}
              >
                Join
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-border">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationWorkspace;