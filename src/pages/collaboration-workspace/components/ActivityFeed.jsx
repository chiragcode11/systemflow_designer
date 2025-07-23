import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities = [], onActivityAction }) => {
  const [filter, setFilter] = useState("all");
  const [showMore, setShowMore] = useState(false);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project_created': return { icon: 'Plus', color: 'text-success' };
      case 'project_updated': return { icon: 'Edit', color: 'text-primary' };
      case 'comment_added': return { icon: 'MessageSquare', color: 'text-warning' };
      case 'member_joined': return { icon: 'UserPlus', color: 'text-success' };
      case 'file_uploaded': return { icon: 'Upload', color: 'text-primary' };
      case 'review_requested': return { icon: 'Eye', color: 'text-warning' };
      case 'merge_completed': return { icon: 'GitMerge', color: 'text-success' };
      case 'branch_created': return { icon: 'GitBranch', color: 'text-primary' };
      default: return { icon: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredActivities = filter === "all" 
    ? (activities || [])
    : (activities || []).filter(activity => activity?.type === filter);

  const displayedActivities = showMore 
    ? filteredActivities 
    : filteredActivities?.slice(0, 10) || [];

  const ActivityItem = ({ activity }) => {
    const iconConfig = getActivityIcon(activity.type);
    
    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group">
        <div className="relative">
          <Image
            src={activity.user.avatar}
            alt={activity.user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center border border-border`}>
            <Icon name={iconConfig.icon} size={8} className={iconConfig.color} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">
              <span className="font-medium">{activity.user.name}</span>
              <span className="text-muted-foreground ml-1">{activity.description}</span>
            </p>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-muted-foreground">
                {getTimeAgo(activity.timestamp)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onActivityAction(activity, 'menu')}
                className="w-6 h-6"
              >
                <Icon name="MoreHorizontal" size={12} />
              </Button>
            </div>
          </div>

          {activity.project && (
            <div className="flex items-center space-x-2 mt-1">
              <Icon name="FileText" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{activity.project}</span>
            </div>
          )}

          {activity.details && (
            <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
              {activity.details}
            </div>
          )}

          {activity.attachments && activity.attachments.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              {activity.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-1 bg-muted/50 rounded px-2 py-1">
                  <Icon name="Paperclip" size={10} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const filterOptions = [
    { value: "all", label: "All Activity", count: (activities || []).length },
    { value: "project_created", label: "Projects", count: (activities || []).filter(a => a?.type?.includes('project')).length },
    { value: "comment_added", label: "Comments", count: (activities || []).filter(a => a?.type === 'comment_added').length },
    { value: "member_joined", label: "Members", count: (activities || []).filter(a => a?.type?.includes('member')).length },
    { value: "review_requested", label: "Reviews", count: (activities || []).filter(a => a?.type?.includes('review')).length }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Activity Feed</h2>
            <p className="text-sm text-muted-foreground">Recent workspace activity</p>
          </div>
          <Button variant="ghost" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className="whitespace-nowrap"
            >
              {option.label}
              <span className="ml-1 text-xs opacity-70">({option.count})</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {displayedActivities.length > 0 ? (
          <div className="p-2">
            {displayedActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
            
            {filteredActivities.length > 10 && !showMore && (
              <div className="text-center p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMore(true)}
                >
                  Show {filteredActivities.length - 10} more activities
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="Activity" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No activity found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === "all" ? "Start collaborating to see activity here" : "No activity for this filter"}
            </p>
          </div>
        )}
      </div>

      {displayedActivities.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {displayedActivities.length} of {filteredActivities.length} activities</span>
            <Button variant="ghost" size="sm">
              View All Activity
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;