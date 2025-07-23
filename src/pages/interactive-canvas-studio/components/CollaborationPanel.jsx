import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CollaborationPanel = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState("users");

  const collaborators = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      status: "online",
      role: "Editor",
      cursor: { x: 245, y: 180, color: "#00d4ff" },
      lastActive: "Active now"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      email: "marcus.r@company.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      status: "online",
      role: "Owner",
      cursor: { x: 420, y: 320, color: "#00ff88" },
      lastActive: "Active now"
    },
    {
      id: 3,
      name: "Emily Watson",
      email: "emily.watson@company.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      status: "away",
      role: "Viewer",
      lastActive: "5 minutes ago"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Chen",
      action: "Added Load Balancer component",
      timestamp: "2 minutes ago",
      type: "component"
    },
    {
      id: 2,
      user: "Marcus Rodriguez",
      action: "Connected Database to API Gateway",
      timestamp: "5 minutes ago",
      type: "connection"
    },
    {
      id: 3,
      user: "You",
      action: "Updated microservice configuration",
      timestamp: "8 minutes ago",
      type: "edit"
    },
    {
      id: 4,
      user: "Emily Watson",
      action: "Left a comment on Cache component",
      timestamp: "12 minutes ago",
      type: "comment"
    }
  ];

  const comments = [
    {
      id: 1,
      user: "Emily Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      content: "Should we consider adding a Redis cache layer here for better performance?",
      timestamp: "12 minutes ago",
      position: { x: 350, y: 250 },
      resolved: false
    },
    {
      id: 2,
      user: "Marcus Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      content: "Great point! Let\'s also think about the failover strategy.",
      timestamp: "8 minutes ago",
      position: { x: 350, y: 250 },
      resolved: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'component': return 'Package';
      case 'connection': return 'GitBranch';
      case 'edit': return 'Edit';
      case 'comment': return 'MessageCircle';
      default: return 'Activity';
    }
  };

  return (
    <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-surface border-r border-border z-20 transition-all duration-300 ${
      isOpen ? 'w-80' : 'w-0 overflow-hidden'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <span className="font-semibold text-foreground">Collaboration</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: "users", label: "Users", icon: "Users" },
            { id: "activity", label: "Activity", icon: "Activity" },
            { id: "comments", label: "Comments", icon: "MessageCircle" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "users" && (
            <div className="p-4">
              <div className="space-y-3">
                {collaborators.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="relative">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-surface ${getStatusColor(user.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-foreground text-sm truncate">{user.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'Owner' ? 'bg-primary/10 text-primary' :
                          user.role === 'Editor'? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.lastActive}</p>
                    </div>
                    {user.cursor && (
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: user.cursor.color }}
                        title="Active cursor"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button variant="outline" size="sm" fullWidth>
                  <Icon name="UserPlus" size={14} />
                  <span className="ml-2">Invite Collaborators</span>
                </Button>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="p-4">
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={getActivityIcon(activity.type)} size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="p-4">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-card border border-border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Image
                        src={comment.avatar}
                        alt={comment.user}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-foreground text-sm">{comment.user}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-foreground">{comment.content}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button variant="ghost" size="sm">
                            <Icon name="Reply" size={12} />
                            <span className="ml-1 text-xs">Reply</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Icon name="Check" size={12} />
                            <span className="ml-1 text-xs">Resolve</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Button variant="outline" size="sm" fullWidth>
                  <Icon name="Plus" size={14} />
                  <span className="ml-2">Add Comment</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;