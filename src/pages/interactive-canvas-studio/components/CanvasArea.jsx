import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import Icon from '../../../components/AppIcon';
import 'react-resizable/css/styles.css';

const CanvasArea = forwardRef(({ 
  selectedTool, 
  zoomLevel, 
  onZoomChange, 
  isPlaying,
  components = [],
  connections = [],
  selectedComponent,
  onComponentSelect,
  onComponentUpdate,
  onCreateConnection,
  onDeleteConnection,
  collaborators = []
}, ref) => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 200, y: 200 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);

  // Canvas dimensions - make it large and scrollable
  const canvasWidth = 4000;
  const canvasHeight = 3000;

  // Handle wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min(3, zoomLevel + delta));
      onZoomChange(newZoom);
    }
  }, [zoomLevel, onZoomChange]);

  // Handle canvas drag for panning
  const handleCanvasMouseDown = useCallback((e) => {
    if (selectedTool === 'select' && e.target === containerRef.current) {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      onComponentSelect(null);
      e.preventDefault();
    }
  }, [selectedTool, onComponentSelect]);

  const handleCanvasMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    
    if (isDraggingCanvas && scrollContainerRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Update scroll position instead of canvas offset
      scrollContainerRef.current.scrollLeft -= deltaX;
      scrollContainerRef.current.scrollTop -= deltaY;
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDraggingCanvas, dragStart]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDraggingCanvas(false);
    setIsDraggingConnection(false);
    if (connectingFrom && selectedTool === 'connect') {
      setConnectingFrom(null);
    }
  }, [connectingFrom, selectedTool]);

  // Enhanced component drag with constraints
  const handleComponentDrag = useCallback((componentId, e, data) => {
    const newX = Math.max(0, Math.min(canvasWidth - 120, data.x));
    const newY = Math.max(0, Math.min(canvasHeight - 80, data.y));
    
    onComponentUpdate(componentId, {
      x: newX,
      y: newY
    });
  }, [onComponentUpdate, canvasWidth, canvasHeight]);

  // Handle component resize
  const handleComponentResize = useCallback((componentId, event, { size }) => {
    onComponentUpdate(componentId, {
      width: Math.max(80, Math.min(400, size.width)),
      height: Math.max(60, Math.min(300, size.height))
    });
  }, [onComponentUpdate]);

  // Enhanced component selection
  const handleComponentClick = useCallback((e, component) => {
    e.stopPropagation();
    if (selectedTool === 'connect') {
      if (connectingFrom) {
        if (connectingFrom !== component.id) {
          onCreateConnection(connectingFrom, component.id);
        }
        setConnectingFrom(null);
        setIsDraggingConnection(false);
      } else {
        setConnectingFrom(component.id);
        setIsDraggingConnection(true);
      }
    } else {
      onComponentSelect(component);
    }
  }, [onComponentSelect, selectedTool, connectingFrom, onCreateConnection]);

  // Improved connection handling
  const handleConnectionStart = useCallback((e, componentId) => {
    e.stopPropagation();
    if (selectedTool === 'connect') {
      setConnectingFrom(componentId);
      setIsDraggingConnection(true);
    }
  }, [selectedTool]);

  const handleConnectionEnd = useCallback((e, componentId) => {
    e.stopPropagation();
    if (selectedTool === 'connect' && connectingFrom && connectingFrom !== componentId) {
      onCreateConnection(connectingFrom, componentId);
    }
    setConnectingFrom(null);
    setIsDraggingConnection(false);
  }, [selectedTool, connectingFrom, onCreateConnection]);

  // Enhanced connection deletion
  const handleConnectionClick = useCallback((e, connection) => {
    e.stopPropagation();
    if (selectedTool === 'select') {
      if (window.confirm('Delete this connection?')) {
        onDeleteConnection?.(connection.id);
      }
    }
  }, [selectedTool, onDeleteConnection]);

  // Improved drop handling
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = containerRef.current.getBoundingClientRect();
      const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
      const scrollTop = scrollContainerRef.current?.scrollTop || 0;
      
      const x = (e.clientX - rect.left + scrollLeft - canvasOffset.x) / zoomLevel;
      const y = (e.clientY - rect.top + scrollTop - canvasOffset.y) / zoomLevel;
      
      const newComponent = {
        id: `${componentData.type}-${Date.now()}`,
        type: componentData.type,
        name: componentData.name,
        x: Math.max(0, Math.min(canvasWidth - 120, x - 60)),
        y: Math.max(0, Math.min(canvasHeight - 80, y - 40)),
        width: 120,
        height: 80,
        color: componentData.color || '#8b5cf6',
        properties: componentData.properties || {}
      };
      
      if (onComponentUpdate) {
        onComponentUpdate('__ADD_COMPONENT__', newComponent);
      }
    } catch (error) {
      console.log('Error dropping component:', error);
    }
  }, [canvasOffset, zoomLevel, onComponentUpdate, canvasWidth, canvasHeight]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Improved connection path calculation
  const getConnectionPath = useCallback((connection) => {
    const sourceComp = components.find(c => c.id === connection.sourceId);
    const targetComp = components.find(c => c.id === connection.targetId);
    
    if (!sourceComp || !targetComp) return '';
    
    // Calculate connection points on component edges
    const sourceX = sourceComp.x + sourceComp.width / 2;
    const sourceY = sourceComp.y + sourceComp.height;
    const targetX = targetComp.x + targetComp.width / 2;
    const targetY = targetComp.y;
    
    // Create curved path
    const midY = sourceY + (targetY - sourceY) / 2;
    const controlOffset = Math.abs(targetY - sourceY) / 3;
    
    return `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + controlOffset} ${targetX} ${targetY - controlOffset} ${targetX} ${targetY}`;
  }, [components]);

  // Enhanced event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(0.1, Math.min(3, zoomLevel + delta));
        onZoomChange(newZoom);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleCanvasMouseDown);
    container.addEventListener('mousemove', handleCanvasMouseMove);
    container.addEventListener('mouseup', handleCanvasMouseUp);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragover', handleDragOver);

    // Global mouse up for connection dragging
    const handleGlobalMouseUp = () => {
      setIsDraggingCanvas(false);
      setIsDraggingConnection(false);
      if (connectingFrom) {
        setConnectingFrom(null);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleCanvasMouseDown);
      container.removeEventListener('mousemove', handleCanvasMouseMove);
      container.removeEventListener('mouseup', handleCanvasMouseUp);
      container.removeEventListener('drop', handleDrop);
      container.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleDrop, handleDragOver, zoomLevel, onZoomChange, connectingFrom]);

  const getCursor = () => {
    if (isDraggingCanvas) return 'grabbing';
    if (selectedTool === 'select') return 'grab';
    if (selectedTool === 'connect') return 'crosshair';
    return 'default';
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-background">
      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-scroll"
        style={{ cursor: getCursor() }}
      >
        {/* Canvas Container */}
        <div
          ref={containerRef}
          className="relative bg-background"
          style={{
            width: canvasWidth * zoomLevel,
            height: canvasHeight * zoomLevel,
            minWidth: '100%',
            minHeight: '100%'
          }}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
            }}
          />

          {/* Canvas Content */}
          <div
            className="absolute"
            style={{
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: '0 0',
              width: canvasWidth,
              height: canvasHeight
            }}
          >
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                </marker>
                <marker
                  id="arrowhead-animated"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="currentColor"
                    className="text-primary"
                  />
                </marker>
              </defs>
              
              {connections.map((connection) => (
                <g key={connection.id}>
                  <path
                    d={getConnectionPath(connection)}
                    stroke={connection.animated && isPlaying ? "var(--color-primary)" : "var(--color-muted-foreground)"}
                    strokeWidth="2"
                    fill="none"
                    markerEnd={connection.animated && isPlaying ? "url(#arrowhead-animated)" : "url(#arrowhead)"}
                    className={`cursor-pointer hover:stroke-red-500 transition-colors ${connection.animated && isPlaying ? "animate-pulse" : ""}`}
                    onClick={(e) => handleConnectionClick(e, connection)}
                    style={{ pointerEvents: 'stroke', strokeWidth: '8px', strokeOpacity: 0 }}
                  />
                  <path
                    d={getConnectionPath(connection)}
                    stroke={connection.animated && isPlaying ? "var(--color-primary)" : "var(--color-muted-foreground)"}
                    strokeWidth="2"
                    fill="none"
                    markerEnd={connection.animated && isPlaying ? "url(#arrowhead-animated)" : "url(#arrowhead)"}
                    className={`pointer-events-none ${connection.animated && isPlaying ? "animate-pulse" : ""}`}
                  />
                  
                  {/* Connection label */}
                  {connection.label && (
                    <text
                      x={components.find(c => c.id === connection.sourceId)?.x + 
                        (components.find(c => c.id === connection.targetId)?.x - components.find(c => c.id === connection.sourceId)?.x) / 2 || 0}
                      y={components.find(c => c.id === connection.sourceId)?.y + 
                        (components.find(c => c.id === connection.targetId)?.y - components.find(c => c.id === connection.sourceId)?.y) / 2 - 10 || 0}
                      fill="var(--color-muted-foreground)"
                      fontSize="12"
                      textAnchor="middle"
                      className="pointer-events-none select-none font-medium"
                    >
                      {connection.label}
                    </text>
                  )}
                  
                  {/* Animated flow particles */}
                  {connection.animated && isPlaying && (
                    <circle
                      r="4"
                      fill="var(--color-primary)"
                      className="animate-pulse"
                    >
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path={getConnectionPath(connection)}
                      />
                    </circle>
                  )}
                </g>
              ))}

              {/* Temporary connection line while connecting */}
              {connectingFrom && isDraggingConnection && selectedTool === 'connect' && (
                <line
                  x1={components.find(c => c.id === connectingFrom)?.x + (components.find(c => c.id === connectingFrom)?.width / 2) || 0}
                  y1={components.find(c => c.id === connectingFrom)?.y + components.find(c => c.id === connectingFrom)?.height || 0}
                  x2={(mousePosition.x + (scrollContainerRef.current?.scrollLeft || 0) - canvasOffset.x) / zoomLevel || 0}
                  y2={(mousePosition.y + (scrollContainerRef.current?.scrollTop || 0) - canvasOffset.y) / zoomLevel || 0}
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse pointer-events-none"
                />
              )}
            </svg>

            {/* Components */}
            {components.map((component) => (
              <Draggable
                key={component.id}
                position={{ x: component.x, y: component.y }}
                onDrag={(e, data) => handleComponentDrag(component.id, e, data)}
                disabled={selectedTool !== 'select'}
                handle=".drag-handle"
                bounds={{ left: 0, top: 0, right: canvasWidth - component.width, bottom: canvasHeight - component.height }}
              >
                <div style={{ position: 'absolute', zIndex: 2 }}>
                  <ResizableBox
                    width={component.width}
                    height={component.height}
                    onResize={(event, data) => handleComponentResize(component.id, event, data)}
                    minConstraints={[80, 60]}
                    maxConstraints={[400, 300]}
                    resizeHandles={selectedComponent?.id === component.id ? ['se'] : []}
                  >
                    <div
                      className={`w-full h-full bg-card border-2 rounded-lg shadow-brand transition-all duration-200 cursor-pointer group drag-handle ${
                        selectedComponent?.id === component.id 
                          ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                      } ${selectedTool === 'connect' ? 'hover:ring-2 hover:ring-green-400/50' : ''}`}
                      onClick={(e) => handleComponentClick(e, component)}
                      onMouseEnter={() => setHoveredComponent(component.id)}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{
                        backgroundColor: `${component.color}10`,
                        borderColor: selectedComponent?.id === component.id ? component.color : undefined
                      }}
                    >
                      <div className="flex flex-col items-center justify-center h-full p-2">
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center mb-1"
                          style={{ backgroundColor: `${component.color}20` }}
                        >
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: component.color }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground text-center leading-tight">
                          {component.name}
                        </span>
                        
                        {/* Status indicator for properties */}
                        {component.properties && Object.keys(component.properties).length > 0 && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full opacity-70"></div>
                        )}
                      </div>
                      
                      {/* Enhanced Connection points */}
                      <div 
                        className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                          selectedTool === 'connect' || hoveredComponent === component.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        } hover:scale-125 cursor-crosshair z-10`}
                        onMouseDown={(e) => handleConnectionStart(e, component.id)}
                        onMouseUp={(e) => handleConnectionEnd(e, component.id)}
                        style={{ pointerEvents: 'auto' }}
                      />
                      <div 
                        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                          selectedTool === 'connect' || hoveredComponent === component.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        } hover:scale-125 cursor-crosshair z-10`}
                        onMouseDown={(e) => handleConnectionStart(e, component.id)}
                        onMouseUp={(e) => handleConnectionEnd(e, component.id)}
                        style={{ pointerEvents: 'auto' }}
                      />
                      <div 
                        className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                          selectedTool === 'connect' || hoveredComponent === component.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        } hover:scale-125 cursor-crosshair z-10`}
                        onMouseDown={(e) => handleConnectionStart(e, component.id)}
                        onMouseUp={(e) => handleConnectionEnd(e, component.id)}
                        style={{ pointerEvents: 'auto' }}
                      />
                      <div 
                        className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                          selectedTool === 'connect' || hoveredComponent === component.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        } hover:scale-125 cursor-crosshair z-10`}
                        onMouseDown={(e) => handleConnectionStart(e, component.id)}
                        onMouseUp={(e) => handleConnectionEnd(e, component.id)}
                        style={{ pointerEvents: 'auto' }}
                      />
                      
                      {/* Connection indicator when connecting */}
                      {connectingFrom === component.id && (
                        <div className="absolute inset-0 border-2 border-green-400 rounded-lg animate-pulse bg-green-400/10 z-5"></div>
                      )}
                    </div>
                  </ResizableBox>
                </div>
              </Draggable>
            ))}

            {/* Collaborator cursors */}
            {collaborators?.map((collaborator) => (
              collaborator.cursor && (
                <div
                  key={collaborator.id}
                  className="absolute pointer-events-none z-10"
                  style={{
                    left: collaborator.cursor.x,
                    top: collaborator.cursor.y,
                    transform: 'translate(-2px, -2px)'
                  }}
                >
                  <div className="relative">
                    <Icon 
                      name="MousePointer" 
                      size={16} 
                      style={{ color: collaborator.cursor.color }}
                    />
                    <div 
                      className="absolute top-4 left-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
                      style={{ backgroundColor: collaborator.cursor.color }}
                    >
                      {collaborator.name}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Info */}
      <div className="absolute top-4 left-4 glass-effect border border-border rounded-lg p-3 shadow-brand z-20">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Zoom: {Math.round(zoomLevel * 100)}%</div>
          <div>Components: {components.length}</div>
          <div>Connections: {connections.length}</div>
          <div>Mode: {selectedTool === 'connect' ? 'Connect Components' : selectedTool}</div>
          {connectingFrom && <div className="text-green-400">Connecting from: {components.find(c => c.id === connectingFrom)?.name}</div>}
          <div className="text-xs text-muted-foreground/70 mt-2">
            Ctrl+Wheel: Zoom | Drag: Pan
          </div>
        </div>
      </div>

      {/* Scroll indicators */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-surface/80 backdrop-blur-sm border border-border rounded px-2 py-1">
        Scrollable Canvas: {canvasWidth} × {canvasHeight}
      </div>
    </div>
  );
});

CanvasArea.displayName = 'CanvasArea';

export default CanvasArea;