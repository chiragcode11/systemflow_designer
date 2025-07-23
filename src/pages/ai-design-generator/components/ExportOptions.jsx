import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportOptions = ({ isVisible, onExport, generatedDesign }) => {
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [selectedQuality, setSelectedQuality] = useState('high');
  const [includeAnnotations, setIncludeAnnotations] = useState(true);

  const exportFormats = [
    { 
      id: 'png', 
      name: 'PNG Image', 
      icon: 'Image', 
      description: 'High-quality raster image',
      size: '~2MB'
    },
    { 
      id: 'svg', 
      name: 'SVG Vector', 
      icon: 'Vector', 
      description: 'Scalable vector graphics',
      size: '~500KB'
    },
    { 
      id: 'pdf', 
      name: 'PDF Document', 
      icon: 'FileText', 
      description: 'Professional document format',
      size: '~1MB'
    },
    { 
      id: 'json', 
      name: 'JSON Data', 
      icon: 'Code', 
      description: 'Structured data format',
      size: '~50KB'
    }
  ];

  const integrationOptions = [
    {
      id: 'figma',
      name: 'Figma',
      icon: 'Figma',
      description: 'Import to Figma workspace',
      status: 'available'
    },
    {
      id: 'miro',
      name: 'Miro',
      icon: 'Layout',
      description: 'Export to Miro board',
      status: 'available'
    },
    {
      id: 'confluence',
      name: 'Confluence',
      icon: 'BookOpen',
      description: 'Add to Confluence page',
      status: 'coming-soon'
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: 'FileText',
      description: 'Embed in Notion page',
      status: 'coming-soon'
    }
  ];

  const handleExport = (format) => {
    const exportConfig = {
      format,
      quality: selectedQuality,
      includeAnnotations,
      timestamp: new Date().toISOString()
    };
    onExport(exportConfig);
  };

  const handleIntegrationExport = (integration) => {
    if (integration.status === 'available') {
      console.log(`Exporting to ${integration.name}`);
    }
  };

  if (!isVisible || !generatedDesign) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Download" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Export Options</h3>
          <p className="text-sm text-muted-foreground">Download or share your system design</p>
        </div>
      </div>

      {/* Export Formats */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Export Formats</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exportFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedFormat === format.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedFormat === format.id ? 'bg-primary/10' : 'bg-muted/20'
                }`}>
                  <Icon 
                    name={format.icon} 
                    size={18} 
                    className={selectedFormat === format.id ? 'text-primary' : 'text-muted-foreground'} 
                  />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    selectedFormat === format.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {format.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format.description}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Est. size: {format.size}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Export Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quality</label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="low">Low (Fast)</option>
              <option value="medium">Medium</option>
              <option value="high">High (Recommended)</option>
              <option value="ultra">Ultra (Slow)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Options</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeAnnotations}
                onChange={(e) => setIncludeAnnotations(e.target.checked)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-foreground">Include annotations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Export Actions */}
      <div className="flex items-center space-x-3">
        <Button
          variant="default"
          onClick={() => handleExport(selectedFormat)}
          iconName="Download"
          iconPosition="left"
          className="brand-gradient"
        >
          Export as {selectedFormat.toUpperCase()}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExport('png')}
          iconName="Image"
          iconPosition="left"
        >
          Quick PNG
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          iconName="Link"
          iconPosition="left"
        >
          Copy Link
        </Button>
      </div>

      {/* Integration Options */}
      <div className="border-t border-border pt-6 space-y-4">
        <h4 className="text-sm font-medium text-foreground">Direct Integrations</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {integrationOptions.map((integration) => (
            <button
              key={integration.id}
              onClick={() => handleIntegrationExport(integration)}
              disabled={integration.status !== 'available'}
              className={`p-3 rounded-lg border transition-all duration-200 text-center ${
                integration.status === 'available' ?'border-border hover:border-primary/50 hover:bg-primary/5' :'border-border opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="w-8 h-8 bg-muted/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name={integration.icon} size={16} className="text-muted-foreground" />
              </div>
              <div className="text-xs font-medium text-foreground">{integration.name}</div>
              {integration.status === 'coming-soon' && (
                <div className="text-xs text-muted-foreground mt-1">Soon</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Export History */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-foreground">Recent Exports</h4>
          <Button variant="ghost" size="sm" iconName="History">
            View All
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20">
            <div className="flex items-center space-x-3">
              <Icon name="Image" size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm text-foreground">chat-app-design.png</div>
                <div className="text-xs text-muted-foreground">2 minutes ago</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" iconName="Download">
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;