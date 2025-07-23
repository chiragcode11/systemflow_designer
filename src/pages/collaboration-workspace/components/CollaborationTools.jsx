import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const CollaborationTools = ({ 
  onlineUsers = [], 
  onStartVideoCall = () => {}, 
  onSendMessage = () => {}, 
  onCreateMeeting = () => {},
  recentMessages = [] 
}) => {
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage("");
    }
  };

  const handleCreateMeeting = () => {
    if (meetingTitle.trim() && meetingTime) {
      onCreateMeeting?.({ title: meetingTitle, time: meetingTime });
      setMeetingTitle("");
      setMeetingTime("");
      setShowMeetingModal(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-error';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {/* Online Users */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Online Now</h3>
          <span className="text-sm text-muted-foreground">{onlineUsers?.length || 0} online</span>
        </div>

        <div className="space-y-2">
          {onlineUsers?.slice(0, 5)?.map((user) => (
            <div key={user?.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={user?.avatar}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user?.status)}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user?.name || 'Unknown User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.currentActivity || 'No activity'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSendMessage?.(`@${user?.name} `)}
                  className="w-6 h-6"
                >
                  <Icon name="MessageSquare" size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStartVideoCall?.(user)}
                  className="w-6 h-6"
                >
                  <Icon name="Video" size={12} />
                </Button>
              </div>
            </div>
          )) || (
            <p className="text-sm text-muted-foreground text-center py-4">No users online</p>
          )}
          
          {(onlineUsers?.length || 0) > 5 && (
            <Button variant="ghost" size="sm" className="w-full">
              View all {onlineUsers?.length} online users
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="flex flex-col items-center space-y-1 h-auto py-3"
          >
            <Icon name="MessageSquare" size={16} />
            <span className="text-xs">Team Chat</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMeetingModal(true)}
            className="flex flex-col items-center space-y-1 h-auto py-3"
          >
            <Icon name="Calendar" size={16} />
            <span className="text-xs">Schedule</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStartVideoCall?.()}
            className="flex flex-col items-center space-y-1 h-auto py-3"
          >
            <Icon name="Video" size={16} />
            <span className="text-xs">Start Call</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center space-y-1 h-auto py-3"
          >
            <Icon name="Share" size={16} />
            <span className="text-xs">Share Screen</span>
          </Button>
        </div>
      </div>

      {/* Team Chat */}
      {showChat && (
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Team Chat</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {recentMessages?.length > 0 ? (
              recentMessages.map((msg) => (
                <div key={msg?.id} className="flex items-start space-x-3">
                  <Image
                    src={msg?.user?.avatar}
                    alt={msg?.user?.name || 'User'}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">{msg?.user?.name || 'Unknown User'}</span>
                      <span className="text-xs text-muted-foreground">{msg?.timestamp || 'Now'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{msg?.content || ''}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
            )}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                variant="default"
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Schedule Meeting</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMeetingModal(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                label="Meeting Title"
                type="text"
                placeholder="Weekly sync meeting"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                required
              />

              <Input
                label="Date & Time"
                type="datetime-local"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                required
              />

              <div className="flex items-center space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowMeetingModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleCreateMeeting}
                  className="flex-1 brand-gradient"
                  disabled={!meetingTitle.trim() || !meetingTime}
                >
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Tools */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Integrations</h3>
        
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Icon name="MessageSquare" size={16} className="mr-3" />
            Connect Slack
            <Icon name="ExternalLink" size={12} className="ml-auto" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Icon name="CheckSquare" size={16} className="mr-3" />
            Sync with Jira
            <Icon name="ExternalLink" size={12} className="ml-auto" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Icon name="FileText" size={16} className="mr-3" />
            Export to Confluence
            <Icon name="ExternalLink" size={12} className="ml-auto" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationTools;