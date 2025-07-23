import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ProjectGrid = ({ projects, onProjectClick, onProjectAction }) => {
  const [viewMode, setViewMode] = useState("grid");

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'review': return 'text-warning bg-warning/10';
      case 'completed': return 'text-muted-foreground bg-muted/50';
      case 'draft': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return { icon: 'AlertTriangle', color: 'text-error' };
      case 'medium': return { icon: 'Clock', color: 'text-warning' };
      case 'low': return { icon: 'Minus', color: 'text-muted-foreground' };
      default: return { icon: 'Minus', color: 'text-muted-foreground' };
    }
  };

  const ProjectCard = ({ project }) => {
    const priorityConfig = getPriorityIcon(project.priority);
    
    return (
      <div 
        className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer group"
        onClick={() => onProjectClick(project)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-muted-foreground">{project.type}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon 
              name={priorityConfig.icon} 
              size={14} 
              className={priorityConfig.color} 
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onProjectAction(project, 'menu');
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="MoreHorizontal" size={14} />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex -space-x-2">
            {project.collaborators.slice(0, 3).map((collaborator, index) => (
              <Image
                key={index}
                src={collaborator.avatar}
                alt={collaborator.name}
                className="w-6 h-6 rounded-full border-2 border-background"
              />
            ))}
            {project.collaborators.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  +{project.collaborators.length - 3}
                </span>
              </div>
            )}
          </div>

          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated {project.lastUpdated}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Icon name="MessageSquare" size={12} />
              <span>{project.comments}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="Eye" size={12} />
              <span>{project.views}</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const ProjectListItem = ({ project }) => {
    const priorityConfig = getPriorityIcon(project.priority);
    
    return (
      <div 
        className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer group"
        onClick={() => onProjectClick(project)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={18} className="text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {project.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Icon 
                name={priorityConfig.icon} 
                size={14} 
                className={priorityConfig.color} 
              />
              <span className="text-sm text-muted-foreground">{project.priority}</span>
            </div>

            <div className="flex -space-x-2">
              {project.collaborators.slice(0, 3).map((collaborator, index) => (
                <Image
                  key={index}
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  className="w-6 h-6 rounded-full border-2 border-background"
                />
              ))}
              {project.collaborators.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    +{project.collaborators.length - 3}
                  </span>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground min-w-0">
              <div>Updated {project.lastUpdated}</div>
              <div className="flex items-center space-x-3 mt-1">
                <span className="flex items-center space-x-1">
                  <Icon name="MessageSquare" size={12} />
                  <span>{project.comments}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="Eye" size={12} />
                  <span>{project.views}</span>
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onProjectAction(project, 'menu');
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="MoreHorizontal" size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Active Projects</h2>
          <p className="text-sm text-muted-foreground">{projects.length} projects in workspace</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Icon name="Grid3X3" size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <Icon name="List" size={16} />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;