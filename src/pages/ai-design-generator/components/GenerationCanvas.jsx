import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GenerationCanvas = ({ design, isGenerating, generationStep, onImportToCanvas }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [canvasOffset, setCanvasOffset] = useState({ x: 50, y: 50 });
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Auto-fit design when it loads
  useEffect(() => {
    if (design?.components?.length > 0) {
      fitToView();
    }
  }, [design]);

  const fitToView = () => {
    if (!design?.components?.length || !canvasRef.current) return;

    const components = design.components;
    const padding = 50;
    
    // Calculate bounds
    const minX = Math.min(...components.map(c => c.x));
    const maxX = Math.max(...components.map(c => c.x + c.width));
    const minY = Math.min(...components.map(c => c.y));
    const maxY = Math.max(...components.map(c => c.y + c.height));
    
    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRect.width / contentWidth;
    const scaleY = canvasRect.height / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
    
    setZoomLevel(scale);
    setCanvasOffset({
      x: (canvasRect.width - contentWidth * scale) / 2 + padding * scale - minX * scale,
      y: (canvasRect.height - contentHeight * scale) / 2 + padding * scale - minY * scale
    });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.2));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setCanvasOffset({ x: 50, y: 50 });
  };

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const handleImportClick = () => {
    if (design && onImportToCanvas) {
      onImportToCanvas();
    }
  };

  const handleQuickImport = () => {
    if (design) {
      navigate('/canvas-studio', { 
        state: { 
          design: design,
          fromAI: true 
        } 
      });
    }
  };

  // Get connection path
  const getConnectionPath = (connection) => {
    if (!design?.components) return '';
    
    const sourceComp = design.components.find(c => c.id === connection.sourceId);
    const targetComp = design.components.find(c => c.id === connection.targetId);
    
    if (!sourceComp || !targetComp) return '';
    
    const sourceX = sourceComp.x + sourceComp.width / 2;
    const sourceY = sourceComp.y + sourceComp.height;
    const targetX = targetComp.x + targetComp.width / 2;
    const targetY = targetComp.y;
    
    const midY = sourceY + (targetY - sourceY) / 2;
    const controlOffset = Math.abs(targetY - sourceY) / 3;
    
    return `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + controlOffset} ${targetX} ${targetY - controlOffset} ${targetX} ${targetY}`;
  };

  if (generationStep === 'prompt') {
    return (
      <div className="h-full bg-background border border-border rounded-lg flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
            <Icon name="Sparkles" size={40} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Ready to Generate</h3>
          <p className="text-muted-foreground max-w-md">
            Enter your system requirements in the prompt box and click generate to create your architecture diagram.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={16} className="text-primary" />
              <span>AI-Powered Generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Layers" size={16} className="text-primary" />
              <span>Complex Architectures</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Download" size={16} className="text-primary" />
              <span>Export to Canvas</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Shuffle" size={16} className="text-primary" />
              <span>Multiple Formats</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating || generationStep === 'generating') {
    return (
      <div className="h-full bg-background border border-border rounded-lg flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            </div>
            <Icon name="Cpu" size={24} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Generating Architecture</h3>
            <p className="text-muted-foreground">
              AI is creating your system design with advanced components and connections...
            </p>
          </div>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Analyzing requirements</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
              <span>Designing components</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
              <span>Creating connections</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="h-full bg-background border border-border rounded-lg flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold text-foreground">No Design Generated</h3>
          <p className="text-muted-foreground">
            There was an issue generating your design. Please try again with a different prompt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background border border-border rounded-lg flex flex-col overflow-hidden">
      {/* Canvas Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-surface/50">
        <div className="flex items-center space-x-3">
          <Icon name="Eye" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">{design.name}</h3>
            <p className="text-xs text-muted-foreground">{design.components?.length || 0} components, {design.connections?.length || 0} connections</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-muted transition-colors"
              title="Zoom Out"
            >
              <Icon name="ZoomOut" size={16} className="text-muted-foreground" />
            </button>
            <span className="text-xs text-muted-foreground min-w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-muted transition-colors"
              title="Zoom In"
            >
              <Icon name="ZoomIn" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1 rounded hover:bg-muted transition-colors ml-1"
              title="Reset Zoom"
            >
              <Icon name="RotateCcw" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={fitToView}
              className="p-1 rounded hover:bg-muted transition-colors"
              title="Fit to View"
            >
              <Icon name="Maximize2" size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={handleQuickImport}
          >
            Open in Canvas
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Import"
            iconPosition="left"
            onClick={handleImportClick}
          >
            Import
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-gradient-to-br from-background to-muted/10"
        style={{ cursor: 'grab' }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30"
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
            transformOrigin: '0 0'
          }}
        >
          {/* SVG for connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ 
            width: '2000px', 
            height: '1500px',
            zIndex: 1 
          }}>
            <defs>
              <marker
                id="arrowhead-preview"
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
                id="arrowhead-animated-preview"
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
            
            {design.connections?.map((connection) => (
              <g key={connection.id}>
                <path
                  d={getConnectionPath(connection)}
                  stroke={connection.animated ? "var(--color-primary)" : "var(--color-muted-foreground)"}
                  strokeWidth="2"
                  fill="none"
                  markerEnd={connection.animated ? "url(#arrowhead-animated-preview)" : "url(#arrowhead-preview)"}
                  className={`transition-colors ${connection.animated ? "animate-pulse" : ""}`}
                />
                
                {/* Connection label */}
                {connection.label && (
                  <text
                    x={design.components?.find(c => c.id === connection.sourceId)?.x + 
                      ((design.components?.find(c => c.id === connection.targetId)?.x || 0) - (design.components?.find(c => c.id === connection.sourceId)?.x || 0)) / 2 || 0}
                    y={design.components?.find(c => c.id === connection.sourceId)?.y + 
                      ((design.components?.find(c => c.id === connection.targetId)?.y || 0) - (design.components?.find(c => c.id === connection.sourceId)?.y || 0)) / 2 - 10 || 0}
                    fill="var(--color-muted-foreground)"
                    fontSize="11"
                    fontWeight="500"
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {connection.label}
                  </text>
                )}
                
                {/* Animated flow particles */}
                {connection.animated && (
                  <circle
                    r="3"
                    fill="var(--color-primary)"
                    className="animate-pulse"
                  >
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={getConnectionPath(connection)}
                    />
                  </circle>
                )}
              </g>
            ))}
          </svg>

          {/* Components */}
          {design.components?.map((component) => (
            <div
              key={component.id}
              className={`absolute cursor-pointer transition-all duration-200 ${
                selectedComponent?.id === component.id 
                  ? 'transform scale-105 z-20' 
                  : hoveredComponent === component.id 
                    ? 'transform scale-102 z-10' 
                    : 'z-5'
              }`}
              style={{
                left: component.x,
                top: component.y,
                width: component.width,
                height: component.height
              }}
              onClick={() => handleComponentClick(component)}
              onMouseEnter={() => setHoveredComponent(component.id)}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <div
                className={`w-full h-full bg-card border-2 rounded-lg shadow-brand transition-all duration-200 ${
                  selectedComponent?.id === component.id 
                    ? 'border-primary ring-2 ring-primary/20 shadow-lg' 
                    : hoveredComponent === component.id
                      ? 'border-primary/70 shadow-md'
                      : 'border-border hover:border-primary/50'
                }`}
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
                  
                  {/* Type indicator */}
                  <span className="text-xs text-muted-foreground mt-1 text-center leading-tight">
                    {component.type.replace(/_/g, ' ')}
                  </span>
                  
                  {/* Properties indicator */}
                  {component.properties && Object.keys(component.properties).length > 0 && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full opacity-70" title="Configured"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Component Details Panel */}
        {selectedComponent && (
          <div className="absolute top-4 right-4 bg-surface border border-border rounded-lg shadow-lg p-4 max-w-64 z-30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">{selectedComponent.name}</h4>
              <button
                onClick={() => setSelectedComponent(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 text-foreground">{selectedComponent.type.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Size:</span>
                <span className="ml-2 text-foreground">{selectedComponent.width} × {selectedComponent.height}</span>
              </div>
              {selectedComponent.properties && Object.keys(selectedComponent.properties).length > 0 && (
                <div>
                  <span className="text-muted-foreground">Properties:</span>
                  <div className="mt-1 space-y-1">
                    {Object.entries(selectedComponent.properties).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="ml-1 text-foreground">{String(value)}</span>
                      </div>
                    ))}
                    {Object.keys(selectedComponent.properties).length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{Object.keys(selectedComponent.properties).length - 3} more...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Design Info */}
        <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-sm z-20">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="font-medium text-foreground">{design.name}</div>
            <div>Components: {design.components?.length || 0}</div>
            <div>Connections: {design.connections?.length || 0}</div>
            <div>Zoom: {Math.round(zoomLevel * 100)}%</div>
            {design.generatedAt && (
              <div>Generated: {new Date(design.generatedAt).toLocaleTimeString()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationCanvas;