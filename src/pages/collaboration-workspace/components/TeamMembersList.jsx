import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Select from '../../../components/ui/Select';

const TeamMembersList = ({ members = [], onMemberAction, currentUser, onInviteMembers }) => {
  const [selectedRole, setSelectedRole] = useState("all");
  const [showMemberDetails, setShowMemberDetails] = useState(null);

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-error bg-error/10';
      case 'editor': return 'text-primary bg-primary/10';
      case 'viewer': return 'text-muted-foreground bg-muted/50';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const filteredMembers = selectedRole === "all" 
    ? (members || [])
    : (members || []).filter(member => member?.role === selectedRole);

  const MemberCard = ({ member }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={member?.avatar || '/assets/images/no_image.png'}
              alt={member?.name || 'Team member'}
              className="w-12 h-12 rounded-full"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(member?.status)}`} />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground">{member?.name || 'Unknown User'}</h3>
              {member?.id === currentUser && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">You</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{member?.email || 'No email'}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member?.role)}`}>
                {member?.role || 'member'}
              </span>
              <span className="text-xs text-muted-foreground">
                {member?.status === 'online' ? 'Active now' : `Last seen ${member?.lastSeen || 'unknown'}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMemberDetails(member)}
          >
            <Icon name="Info" size={16} />
          </Button>
          {member?.id !== currentUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMemberAction?.(member, 'menu')}
            >
              <Icon name="MoreHorizontal" size={16} />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Projects</span>
          <span className="font-medium text-foreground">{member?.projectsCount || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Contributions</span>
          <span className="font-medium text-foreground">{member?.contributions || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Joined</span>
          <span className="font-medium text-foreground">{member?.joinedDate || 'Unknown'}</span>
        </div>
      </div>

      {member?.recentActivity && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Recent Activity</p>
          <p className="text-sm text-foreground mt-1">{member.recentActivity}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
          <p className="text-sm text-muted-foreground">{filteredMembers?.length || 0} members</p>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            className="w-32"
          />
          <Button 
            variant="outline" 
            iconName="UserPlus" 
            size="sm"
            onClick={() => onInviteMembers?.([])}
          >
            Invite
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers?.map((member) => (
          <MemberCard key={member?.id || Math.random()} member={member} />
        ))}
      </div>

      {filteredMembers?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No team members</h3>
          <p className="text-muted-foreground mb-4">
            Start collaborating by inviting team members to your workspace.
          </p>
          <Button 
            variant="default" 
            iconName="UserPlus"
            onClick={() => onInviteMembers?.([])}
          >
            Invite Team Members
          </Button>
        </div>
      )}

      {/* Member Details Modal */}
      {showMemberDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Member Details</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMemberDetails(null)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={showMemberDetails?.avatar || '/assets/images/no_image.png'}
                    alt={showMemberDetails?.name || 'Team member'}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${getStatusColor(showMemberDetails?.status)}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{showMemberDetails?.name || 'Unknown User'}</h4>
                  <p className="text-sm text-muted-foreground">{showMemberDetails?.email || 'No email'}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(showMemberDetails?.role)}`}>
                    {showMemberDetails?.role || 'member'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <span className="text-sm font-medium text-foreground">{showMemberDetails?.department || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm font-medium text-foreground">{showMemberDetails?.location || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Timezone</span>
                  <span className="text-sm font-medium text-foreground">{showMemberDetails?.timezone || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Projects</span>
                  <span className="text-sm font-medium text-foreground">{showMemberDetails?.projectsCount || 0}</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" className="flex-1">
                  <Icon name="MessageSquare" size={16} className="mr-2" />
                  Message
                </Button>
                <Button variant="default" className="flex-1">
                  <Icon name="UserCheck" size={16} className="mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembersList;