import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PropertiesPanel = ({ selectedComponent, onUpdateComponent, onDeleteComponent }) => {
  const [properties, setProperties] = useState({
    name: '',
    description: '',
    type: '',
    configuration: {},
    width: 120,
    height: 80,
    x: 0,
    y: 0,
    color: '#8b5cf6'
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update local state when selectedComponent changes
  useEffect(() => {
    if (selectedComponent) {
      setProperties({
        name: selectedComponent.name || '',
        description: selectedComponent.description || '',
        type: selectedComponent.type || '',
        configuration: selectedComponent.properties || {},
        width: selectedComponent.width || 120,
        height: selectedComponent.height || 80,
        x: selectedComponent.x || 0,
        y: selectedComponent.y || 0,
        color: selectedComponent.color || '#8b5cf6'
      });
      setHasUnsavedChanges(false);
    }
  }, [selectedComponent]);

  const componentTypes = [
    { value: 'load_balancer', label: 'Load Balancer' },
    { value: 'database', label: 'Database' },
    { value: 'cache', label: 'Cache' },
    { value: 'microservice', label: 'Microservice' },
    { value: 'message_queue', label: 'Message Queue' },
    { value: 'cdn', label: 'CDN' },
    { value: 'api_gateway', label: 'API Gateway' },
    { value: 'monitoring', label: 'Monitoring' },
    { value: 'auth_service', label: 'Auth Service' },
    { value: 'storage', label: 'Storage' },
    { value: 'search_engine', label: 'Search Engine' },
    { value: 'notification_service', label: 'Notification Service' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'logging', label: 'Logging' }
  ];

  const colorOptions = [
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#00d4ff', label: 'Cyan' },
    { value: '#ff6b35', label: 'Orange' },
    { value: '#10b981', label: 'Green' },
    { value: '#dc382d', label: 'Red' },
    { value: '#336791', label: 'Blue' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#06b6d4', label: 'Teal' }
  ];

  const getConfigurationFields = (type) => {
    switch (type) {
      case 'load_balancer':
        return [
          { key: 'algorithm', label: 'Algorithm', type: 'select', options: [
            { value: 'round-robin', label: 'Round Robin' },
            { value: 'least-connections', label: 'Least Connections' },
            { value: 'ip-hash', label: 'IP Hash' },
            { value: 'weighted', label: 'Weighted' }
          ]},
          { key: 'healthCheck', label: 'Health Check Interval', type: 'text', placeholder: '30s' },
          { key: 'maxConnections', label: 'Max Connections', type: 'number', placeholder: '1000' },
          { key: 'timeout', label: 'Timeout', type: 'text', placeholder: '30s' },
          { key: 'sslTermination', label: 'SSL Termination', type: 'select', options: [
            { value: 'enabled', label: 'Enabled' },
            { value: 'disabled', label: 'Disabled' }
          ]}
        ];
      case 'database':
        return [
          { key: 'engine', label: 'Database Engine', type: 'select', options: [
            { value: 'postgresql', label: 'PostgreSQL' },
            { value: 'mysql', label: 'MySQL' },
            { value: 'mongodb', label: 'MongoDB' },
            { value: 'redis', label: 'Redis' },
            { value: 'cassandra', label: 'Cassandra' },
            { value: 'elasticsearch', label: 'Elasticsearch' }
          ]},
          { key: 'replication', label: 'Replication', type: 'select', options: [
            { value: 'master-slave', label: 'Master-Slave' },
            { value: 'master-master', label: 'Master-Master' },
            { value: 'cluster', label: 'Cluster' },
            { value: 'none', label: 'None' }
          ]},
          { key: 'storage', label: 'Storage Size', type: 'text', placeholder: '100GB' },
          { key: 'backup', label: 'Backup Strategy', type: 'select', options: [
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'realtime', label: 'Real-time' }
          ]}
        ];
      case 'cache':
        return [
          { key: 'type', label: 'Cache Type', type: 'select', options: [
            { value: 'redis', label: 'Redis' },
            { value: 'memcached', label: 'Memcached' },
            { value: 'in-memory', label: 'In-Memory' },
            { value: 'distributed', label: 'Distributed' }
          ]},
          { key: 'ttl', label: 'Default TTL', type: 'text', placeholder: '3600s' },
          { key: 'maxMemory', label: 'Max Memory', type: 'text', placeholder: '2GB' },
          { key: 'evictionPolicy', label: 'Eviction Policy', type: 'select', options: [
            { value: 'lru', label: 'LRU' },
            { value: 'lfu', label: 'LFU' },
            { value: 'fifo', label: 'FIFO' }
          ]}
        ];
      case 'microservice':
        return [
          { key: 'language', label: 'Language', type: 'select', options: [
            { value: 'nodejs', label: 'Node.js' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'go', label: 'Go' },
            { value: 'csharp', label: 'C#' },
            { value: 'rust', label: 'Rust' }
          ]},
          { key: 'replicas', label: 'Replicas', type: 'number', placeholder: '3' },
          { key: 'cpu', label: 'CPU Cores', type: 'text', placeholder: '1 CPU' },
          { key: 'memory', label: 'Memory', type: 'text', placeholder: '2GB RAM' },
          { key: 'port', label: 'Port', type: 'number', placeholder: '8080' }
        ];
      case 'api_gateway':
        return [
          { key: 'rateLimiting', label: 'Rate Limiting', type: 'select', options: [
            { value: 'enabled', label: 'Enabled' },
            { value: 'disabled', label: 'Disabled' }
          ]},
          { key: 'authentication', label: 'Authentication', type: 'select', options: [
            { value: 'jwt', label: 'JWT' },
            { value: 'oauth2', label: 'OAuth2' },
            { value: 'api-key', label: 'API Key' },
            { value: 'none', label: 'None' }
          ]},
          { key: 'cors', label: 'CORS', type: 'select', options: [
            { value: 'enabled', label: 'Enabled' },
            { value: 'disabled', label: 'Disabled' }
          ]},
          { key: 'logging', label: 'Request Logging', type: 'select', options: [
            { value: 'full', label: 'Full' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'disabled', label: 'Disabled' }
          ]}
        ];
      default:
        return [
          { key: 'description', label: 'Description', type: 'text', placeholder: 'Component description' },
          { key: 'version', label: 'Version', type: 'text', placeholder: '1.0.0' },
          { key: 'environment', label: 'Environment', type: 'select', options: [
            { value: 'development', label: 'Development' },
            { value: 'staging', label: 'Staging' },
            { value: 'production', label: 'Production' }
          ]}
        ];
    }
  };

  const handlePropertyChange = (key, value) => {
    if (key.startsWith('config.')) {
      const configKey = key.replace('config.', '');
      setProperties(prev => ({
        ...prev,
        configuration: {
          ...prev.configuration,
          [configKey]: value
        }
      }));
    } else {
      setProperties(prev => ({
        ...prev,
        [key]: value
      }));
    }
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (selectedComponent && onUpdateComponent) {
      const updatedComponent = {
        ...selectedComponent,
        name: properties.name,
        description: properties.description,
        type: properties.type,
        properties: properties.configuration,
        width: properties.width,
        height: properties.height,
        x: properties.x,
        y: properties.y,
        color: properties.color
      };
      
      onUpdateComponent(selectedComponent.id, updatedComponent);
      setHasUnsavedChanges(false);
    }
  };

  const handleDelete = () => {
    if (selectedComponent && onDeleteComponent) {
      if (window.confirm(`Are you sure you want to delete "${selectedComponent.name}"?`)) {
        onDeleteComponent(selectedComponent.id);
      }
    }
  };

  const configFields = getConfigurationFields(properties.type);

  if (!selectedComponent) {
    return (
      <div className="w-full h-full bg-surface border-l border-border flex flex-col">
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <Icon name="MousePointer" size={48} className="text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No Component Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a component on the canvas to view and edit its properties.
          </p>
          <div className="mt-4 text-xs text-muted-foreground/70">
            <p>Tips:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Click on any component to select it</li>
              <li>Use connection tool to link components</li>
              <li>Drag components to reposition them</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-surface border-l border-border flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={20} className="text-primary" />
          <span className="font-semibold text-foreground">Properties</span>
          {hasUnsavedChanges && (
            <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Unsaved changes"></div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Basic Properties */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Basic Properties</h3>
            <div className="space-y-3">
              <Input
                label="Component Name"
                type="text"
                value={properties.name}
                onChange={(e) => handlePropertyChange('name', e.target.value)}
                placeholder="Enter component name"
              />
              
              <Select
                label="Component Type"
                options={componentTypes}
                value={properties.type}
                onChange={(value) => handlePropertyChange('type', value)}
              />
              
              <Input
                label="Description"
                type="text"
                value={properties.description}
                onChange={(e) => handlePropertyChange('description', e.target.value)}
                placeholder="Enter description"
              />

              <Select
                label="Color"
                options={colorOptions}
                value={properties.color}
                onChange={(value) => handlePropertyChange('color', value)}
              />
            </div>
          </div>

          {/* Configuration */}
          {configFields.length > 0 && (
            <div>
              <h3 className="font-medium text-foreground mb-3">Configuration</h3>
              <div className="space-y-3">
                {configFields.map((field) => (
                  <div key={field.key}>
                    {field.type === 'select' ? (
                      <Select
                        label={field.label}
                        options={field.options}
                        value={properties.configuration[field.key] || ''}
                        onChange={(value) => handlePropertyChange(`config.${field.key}`, value)}
                      />
                    ) : (
                      <Input
                        label={field.label}
                        type={field.type}
                        value={properties.configuration[field.key] || ''}
                        onChange={(e) => handlePropertyChange(`config.${field.key}`, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Styling */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Dimensions & Position</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Width"
                  type="number"
                  value={properties.width}
                  onChange={(e) => handlePropertyChange('width', parseInt(e.target.value) || 120)}
                  placeholder="120"
                />
                <Input
                  label="Height"
                  type="number"
                  value={properties.height}
                  onChange={(e) => handlePropertyChange('height', parseInt(e.target.value) || 80)}
                  placeholder="80"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="X Position"
                  type="number"
                  value={properties.x}
                  onChange={(e) => handlePropertyChange('x', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <Input
                  label="Y Position"
                  type="number"
                  value={properties.y}
                  onChange={(e) => handlePropertyChange('y', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Preview</h3>
            <div className="p-4 bg-background border border-border rounded-lg flex items-center justify-center">
              <div
                className="flex flex-col items-center justify-center p-2 border-2 rounded-lg"
                style={{
                  width: Math.min(properties.width, 100),
                  height: Math.min(properties.height, 60),
                  backgroundColor: `${properties.color}10`,
                  borderColor: properties.color
                }}
              >
                <div 
                  className="w-4 h-4 rounded flex items-center justify-center mb-1"
                  style={{ backgroundColor: `${properties.color}20` }}
                >
                  <div 
                    className="w-2 h-2 rounded"
                    style={{ backgroundColor: properties.color }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {properties.name || 'Component'}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Properties for advanced users */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Advanced</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Component ID: <span className="font-mono">{selectedComponent.id}</span></div>
                  <div>Created: {new Date().toLocaleDateString()}</div>
                  <div>Properties: {Object.keys(properties.configuration).length} configured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-surface/50">
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              fullWidth 
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              iconName={hasUnsavedChanges ? "Save" : "Check"}
              iconPosition="left"
            >
              {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
            </Button>
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            fullWidth 
            onClick={handleDelete}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Component
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;