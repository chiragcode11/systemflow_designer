import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CanvasToolbar from './components/CanvasToolbar';
import CanvasArea from './components/CanvasArea';
import ComponentLibrary from './components/ComponentLibrary';
import PropertiesPanel from './components/PropertiesPanel';
import CollaborationPanel from './components/CollaborationPanel';
import ExportModal from './components/ExportModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import canvasService from '../../utils/canvasService';
import projectService from '../../utils/projectService';

const InteractiveCanvasStudio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef(null);
  
  // Canvas state
  const [selectedTool, setSelectedTool] = useState('select');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  
  // Project and design state
  const [currentProject, setCurrentProject] = useState(null);
  const [currentDesign, setCurrentDesign] = useState(null);
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    if (location.state) {
      initializeFromState(location.state);
    } else {
      initializeBlankCanvas();
    }
  }, [location.state]);

  const initializeFromState = async (state) => {
    try {
      setLoading(true);
      
      if (state.designId) {
        const result = await canvasService.loadDesign(state.designId);
        if (result.success) {
          setCurrentDesign(result.data);
          setComponents(result.data.components || []);
          setConnections(result.data.connections || []);
        }
      } else if (state.template || state.design) {
        const designData = state.template || state.design;
        setComponents(designData.components || []);
        setConnections(designData.connections || []);
        setCurrentDesign(designData);
      } else if (state.addComponent) {
        const newComponent = {
          ...state.addComponent,
          id: `${state.addComponent.id}-${Date.now()}`,
          x: 200,
          y: 200,
          width: 120,
          height: 80
        };
        setComponents([newComponent]);
      }
      
      if (state.projectId) {
        const projectResult = await projectService.getProject(state.projectId);
        if (projectResult.success) {
          setCurrentProject(projectResult.data);
        }
      }
    } catch (error) {
      setError('Failed to initialize canvas');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const initializeBlankCanvas = () => {
    setComponents([]);
    setConnections([]);
    setCurrentDesign(null);
    setCurrentProject(null);
  };

  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    if (tool !== 'select') {
      setSelectedComponent(null);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  const handlePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleAddComponent = useCallback((componentData) => {
    const newComponent = {
      id: `component-${Date.now()}`,
      type: componentData.type,
      name: componentData.name,
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
      width: 120,
      height: 80,
      color: componentData.color || '#8b5cf6',
      properties: componentData.properties || {}
    };
    
    setComponents(prev => [...prev, newComponent]);
    setIsDirty(true);
  }, []);

  const handleUpdateComponent = useCallback((componentId, updates) => {
    if (componentId === '__ADD_COMPONENT__') {
      setComponents(prev => [...prev, updates]);
      setIsDirty(true);
      return;
    }
    
    setComponents(prev => prev.map(comp => 
      comp.id === componentId ? { ...comp, ...updates } : comp
    ));
    
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(prev => ({ ...prev, ...updates }));
    }
    
    setIsDirty(true);
  }, [selectedComponent]);

  const handleDeleteComponent = useCallback((componentId) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
    setConnections(prev => prev.filter(conn => 
      conn.sourceId !== componentId && conn.targetId !== componentId
    ));
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
    setIsDirty(true);
  }, [selectedComponent]);

  const handleCreateConnection = useCallback((sourceId, targetId) => {
    const existingConnection = connections.find(conn => 
      conn.sourceId === sourceId && conn.targetId === targetId
    );
    
    if (existingConnection) {
      setError('Connection already exists between these components');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newConnection = {
      id: `connection-${Date.now()}`,
      sourceId,
      targetId,
      type: 'api_call',
      label: 'API Call',
      animated: true
    };
    
    setConnections(prev => [...prev, newConnection]);
    setIsDirty(true);
  }, [connections]);

  const handleDeleteConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    if (!user) {
      setError('Please sign in to save your design');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setLoading(true);
      
      let projectId = currentProject?.id;
      
      if (!projectId) {
        const projectResult = await projectService.createProject({
          name: 'Canvas Design',
          description: 'Created in Canvas Studio'
        });
        
        if (projectResult.success) {
          projectId = projectResult.data.id;
          setCurrentProject(projectResult.data);
        } else {
          throw new Error(projectResult.error);
        }
      }
      
      const designData = {
        projectId,
        name: currentDesign?.name || 'Canvas Design',
        description: currentDesign?.description || 'Created in Canvas Studio',
        canvasData: {
          zoom: zoomLevel,
          components,
          connections
        }
      };
      
      const result = await canvasService.saveDesign(designData);
      
      if (result.success) {
        setCurrentDesign(result.data);
        setIsDirty(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(error.message || 'Failed to save design');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            break;
          case 'y':
            e.preventDefault();
            break;
          case '=': case'+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleZoomReset();
            break;
        }
      }
      
      if (e.key === 'Delete' && selectedComponent) {
        handleDeleteComponent(selectedComponent.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              iconName="ArrowLeft"
              onClick={() => navigate('/')}
            />
            <h1 className="text-lg font-semibold text-foreground">
              {currentDesign?.name || currentProject?.name || 'Canvas Studio'}
            </h1>
            {isDirty && <span className="text-xs text-muted-foreground">• Unsaved changes</span>}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Save"
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={() => setShowExportModal(true)}
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName={isSidebarOpen ? "PanelRightClose" : "PanelRightOpen"}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-2 mb-2">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <span className="text-destructive text-sm">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-destructive/70 hover:text-destructive"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden bg-surface border-r border-border`}>
          <ComponentLibrary 
            onAddComponent={handleAddComponent}
            searchQuery=""
            onSearchChange={() => {}}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <CanvasToolbar
            selectedTool={selectedTool}
            onToolChange={handleToolChange}
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            isPlaying={isPlaying}
            onPlay={handlePlay}
          />
          
          <CanvasArea
            ref={canvasRef}
            selectedTool={selectedTool}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            isPlaying={isPlaying}
            components={components}
            connections={connections}
            selectedComponent={selectedComponent}
            onComponentSelect={setSelectedComponent}
            onComponentUpdate={handleUpdateComponent}
            onCreateConnection={handleCreateConnection}
            onDeleteConnection={handleDeleteConnection}
            collaborators={collaborators}
          />
        </div>

        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden bg-surface border-l border-border flex flex-col`}>
          <div className="flex-1">
            <PropertiesPanel
              selectedComponent={selectedComponent}
              onUpdateComponent={handleUpdateComponent}
              onDeleteComponent={handleDeleteComponent}
            />
          </div>
          
          <div className="border-t border-border">
            <CollaborationPanel
              collaborators={collaborators}
              onInviteUser={(email) => {
                console.log('Inviting user:', email);
              }}
            />
          </div>
        </div>
      </div>

      {showExportModal && (
        <ExportModal
          design={{
            name: currentDesign?.name || 'Canvas Design',
            components,
            connections
          }}
          onClose={() => setShowExportModal(false)}
          onExport={(format, options) => {
            console.log('Exporting:', format, options);
            setShowExportModal(false);
          }}
        />
      )}
    </div>
  );
};

export default InteractiveCanvasStudio;