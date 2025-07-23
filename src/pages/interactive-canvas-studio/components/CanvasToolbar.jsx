import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CanvasToolbar = ({
  selectedTool,
  onToolChange,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  isPlaying,
  onPlay
}) => {
  const tools = [
    { id: 'select', name: 'Select', icon: 'MousePointer', shortcut: 'V' },
    { id: 'connect', name: 'Connect', icon: 'Link', shortcut: 'C' },
    { id: 'text', name: 'Text', icon: 'Type', shortcut: 'T' },
    { id: 'comment', name: 'Comment', icon: 'MessageCircle', shortcut: 'M' }
  ];

  const handleAddText = () => {
    // Create a text component
    const textComponent = {
      id: `text-${Date.now()}`,
      type: 'text',
      name: 'Text Label',
      x: 200,
      y: 200,
      width: 100,
      height: 30,
      color: '#000000',
      properties: {
        text: 'Enter text...',
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center'
      }
    };
    
    // Trigger component creation
    window.dispatchEvent(new CustomEvent('addTextComponent', { detail: textComponent }));
  };

  const handleAddComment = () => {
    // Create a comment component
    const commentComponent = {
      id: `comment-${Date.now()}`,
      type: 'comment',
      name: 'Comment',
      x: 250,
      y: 250,
      width: 200,
      height: 100,
      color: '#fbbf24',
      properties: {
        text: 'Add your comment here...',
        author: 'User',
        timestamp: new Date().toISOString()
      }
    };
    
    // Trigger component creation
    window.dispatchEvent(new CustomEvent('addCommentComponent', { detail: commentComponent }));
  };

  const handleToolClick = (toolId) => {
    if (toolId === 'text') {
      handleAddText();
      return;
    }
    
    if (toolId === 'comment') {
      handleAddComment();
      return;
    }
    
    onToolChange(toolId);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-surface border-b border-border">
      {/* Left - Tools */}
      <div className="flex items-center space-x-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => handleToolClick(tool.id)}
            title={`${tool.name} (${tool.shortcut})`}
            className="relative"
          >
            <Icon name={tool.icon} size={16} />
            {tool.shortcut && (
              <span className="absolute -top-1 -right-1 text-xs bg-muted text-muted-foreground px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {tool.shortcut}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Center - Zoom Controls */}
      <div className="flex items-center space-x-2 bg-muted/30 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          disabled={zoomLevel <= 0.1}
          title="Zoom Out (Ctrl+-)"
        >
          <Icon name="ZoomOut" size={16} />
        </Button>
        
        <button
          onClick={onZoomReset}
          className="px-3 py-1 text-sm font-medium text-foreground hover:bg-muted/50 rounded transition-colors min-w-[60px]"
          title="Reset Zoom (Ctrl+0)"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          disabled={zoomLevel >= 3}
          title="Zoom In (Ctrl++)"
        >
          <Icon name="ZoomIn" size={16} />
        </Button>
      </div>

      {/* Right - Simulation Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant={isPlaying ? "default" : "outline"}
          size="sm"
          onClick={onPlay}
          title={isPlaying ? "Stop Simulation" : "Start Simulation"}
        >
          <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
          <span className="ml-2 hidden sm:inline">
            {isPlaying ? "Stop" : "Simulate"}
          </span>
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <div className="text-xs text-muted-foreground">
          Mode: {selectedTool === 'select' ? 'Select' : selectedTool === 'connect' ? 'Connect' : 'Tool'}
        </div>
      </div>
    </div>
  );
};

export default CanvasToolbar;