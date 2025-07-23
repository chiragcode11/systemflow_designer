import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

import { useAuth } from '../../../contexts/AuthContext';
import canvasService from '../../../utils/canvasService';

const ExportModal = ({ design, onClose, onExport }) => {
  const { user } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeBackground: true,
    includeGrid: false,
    resolution: 'high',
    paperSize: 'a4',
    orientation: 'landscape'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportFormats = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'png', label: 'PNG Image' },
    { value: 'jpg', label: 'JPEG Image' },
    { value: 'svg', label: 'SVG Vector' },
    { value: 'json', label: 'JSON Data' }
  ];

  const resolutionOptions = [
    { value: 'low', label: 'Low (72 DPI)' },
    { value: 'medium', label: 'Medium (150 DPI)' },
    { value: 'high', label: 'High (300 DPI)' }
  ];

  const paperSizeOptions = [
    { value: 'a4', label: 'A4' },
    { value: 'a3', label: 'A3' },
    { value: 'letter', label: 'Letter' },
    { value: 'legal', label: 'Legal' }
  ];

  const orientationOptions = [
    { value: 'landscape', label: 'Landscape' },
    { value: 'portrait', label: 'Portrait' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      switch (selectedFormat) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'png':
          await exportToImage('png');
          break;
        case 'jpg':
          await exportToImage('jpeg');
          break;
        case 'svg':
          await exportToSVG();
          break;
        case 'json':
          await exportToJSON();
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Save export record if user is authenticated
      if (user) {
        await canvasService.saveExport({
          designId: design.id,
          format: selectedFormat,
          options: exportOptions
        });
      }

      onExport(selectedFormat, exportOptions);
    } catch (error) {
      setError(error.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    const canvasElement = document.querySelector('.canvas-area') || document.body;
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: exportOptions.includeBackground ? '#ffffff' : null,
      scale: exportOptions.resolution === 'high' ? 2 : exportOptions.resolution === 'medium' ? 1.5 : 1,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    
    // PDF dimensions based on paper size
    const dimensions = {
      a4: exportOptions.orientation === 'landscape' ? [297, 210] : [210, 297],
      a3: exportOptions.orientation === 'landscape' ? [420, 297] : [297, 420],
      letter: exportOptions.orientation === 'landscape' ? [279, 216] : [216, 279],
      legal: exportOptions.orientation === 'landscape' ? [356, 216] : [216, 356]
    };

    const [width, height] = dimensions[exportOptions.paperSize];
    const pdf = new jsPDF(exportOptions.orientation, 'mm', [width, height]);

    // Calculate scaling to fit canvas in PDF
    const canvasAspect = canvas.width / canvas.height;
    const pdfAspect = width / height;
    
    let imgWidth, imgHeight, x, y;
    
    if (canvasAspect > pdfAspect) {
      imgWidth = width - 20; // 10mm margin on each side
      imgHeight = imgWidth / canvasAspect;
      x = 10;
      y = (height - imgHeight) / 2;
    } else {
      imgHeight = height - 20; // 10mm margin on top and bottom
      imgWidth = imgHeight * canvasAspect;
      x = (width - imgWidth) / 2;
      y = 10;
    }

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(design.name || 'System Design', 10, 10);
    
    pdf.save(`${design.name || 'system-design'}.pdf`);
  };

  const exportToImage = async (format) => {
    const canvasElement = document.querySelector('.canvas-area') || document.body;
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: exportOptions.includeBackground ? '#ffffff' : null,
      scale: exportOptions.resolution === 'high' ? 2 : exportOptions.resolution === 'medium' ? 1.5 : 1,
      useCORS: true,
      allowTaint: true
    });

    const link = document.createElement('a');
    link.download = `${design.name || 'system-design'}.${format === 'jpeg' ? 'jpg' : format}`;
    link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : undefined);
    link.click();
  };

  const exportToSVG = async () => {
    // Create SVG representation of the design
    const svgContent = generateSVG();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${design.name || 'system-design'}.svg`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const exportToJSON = async () => {
    const jsonData = {
      name: design.name,
      version: '1.0',
      exportedAt: new Date().toISOString(),
      components: design.components,
      connections: design.connections,
      metadata: {
        format: 'SystemFlow Designer JSON',
        exportOptions
      }
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${design.name || 'system-design'}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const generateSVG = () => {
    const { components = [], connections = [] } = design;
    
    // Calculate canvas bounds
    let minX = 0, minY = 0, maxX = 800, maxY = 600;
    components.forEach(comp => {
      minX = Math.min(minX, comp.x);
      minY = Math.min(minY, comp.y);
      maxX = Math.max(maxX, comp.x + comp.width);
      maxY = Math.max(maxY, comp.y + comp.height);
    });

    const width = maxX - minX + 100; // Add padding
    const height = maxY - minY + 100;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    if (exportOptions.includeBackground) {
      svg += `<rect width="100%" height="100%" fill="white"/>`;
    }

    // Add connections
    connections.forEach(conn => {
      const sourceComp = components.find(c => c.id === conn.sourceId);
      const targetComp = components.find(c => c.id === conn.targetId);
      
      if (sourceComp && targetComp) {
        const x1 = sourceComp.x + sourceComp.width / 2 - minX + 50;
        const y1 = sourceComp.y + sourceComp.height - minY + 50;
        const x2 = targetComp.x + targetComp.width / 2 - minX + 50;
        const y2 = targetComp.y - minY + 50;
        
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>`;
        
        if (conn.label) {
          const labelX = (x1 + x2) / 2;
          const labelY = (y1 + y2) / 2;
          svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="#666" font-size="10">${conn.label}</text>`;
        }
      }
    });

    // Add arrow marker
    svg += `<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#666"/></marker></defs>`;

    // Add components
    components.forEach(comp => {
      const x = comp.x - minX + 50;
      const y = comp.y - minY + 50;
      
      svg += `<rect x="${x}" y="${y}" width="${comp.width}" height="${comp.height}" fill="${comp.color}20" stroke="${comp.color}" stroke-width="2" rx="8"/>`;
      svg += `<text x="${x + comp.width/2}" y="${y + comp.height/2}" text-anchor="middle" fill="black" font-size="12" font-weight="bold">${comp.name}</text>`;
    });

    svg += '</svg>';
    return svg;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-brand w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Export Design</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Format Selection */}
          <Select
            label="Export Format"
            options={exportFormats}
            value={selectedFormat}
            onChange={setSelectedFormat}
          />

          {/* Format-specific options */}
          {(selectedFormat === 'pdf' || selectedFormat === 'png' || selectedFormat === 'jpg') && (
            <>
              <Select
                label="Resolution"
                options={resolutionOptions}
                value={exportOptions.resolution}
                onChange={(value) => setExportOptions(prev => ({ ...prev, resolution: value }))}
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeBackground"
                  checked={exportOptions.includeBackground}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeBackground: e.target.checked }))}
                  className="rounded border-border"
                />
                <label htmlFor="includeBackground" className="text-sm text-foreground">
                  Include background
                </label>
              </div>
            </>
          )}

          {selectedFormat === 'pdf' && (
            <>
              <Select
                label="Paper Size"
                options={paperSizeOptions}
                value={exportOptions.paperSize}
                onChange={(value) => setExportOptions(prev => ({ ...prev, paperSize: value }))}
              />

              <Select
                label="Orientation"
                options={orientationOptions}
                value={exportOptions.orientation}
                onChange={(value) => setExportOptions(prev => ({ ...prev, orientation: value }))}
              />
            </>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <span className="text-destructive text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Icon name="Download" size={16} className="mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;