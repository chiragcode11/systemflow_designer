import { supabase } from './supabaseClient';

class CanvasService {
  // Save design to database
  async saveDesign(designData) {
    try {
      const { data, error } = await supabase
        .from('system_designs')
        .insert({
          project_id: designData.projectId,
          name: designData.name,
          description: designData.description,
          canvas_data: designData.canvasData,
          status: designData.status || 'draft'
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to save design' };
    }
  }

  // Load design from database
  async loadDesign(designId) {
    try {
      const { data, error } = await supabase
        .from('system_designs')
        .select(`
          *,
          project:projects(*),
          components:design_components(*),
          connections:design_connections(*)
        `)
        .eq('id', designId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load design' };
    }
  }

  // Save component to database
  async saveComponent(designId, componentData) {
    try {
      const { data, error } = await supabase
        .from('design_components')
        .insert({
          design_id: designId,
          component_type: componentData.type,
          name: componentData.name,
          position_x: componentData.x,
          position_y: componentData.y,
          width: componentData.width,
          height: componentData.height,
          color: componentData.color,
          properties: componentData.properties || {}
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to save component' };
    }
  }

  // Update component position
  async updateComponentPosition(componentId, x, y) {
    try {
      const { data, error } = await supabase
        .from('design_components')
        .update({
          position_x: x,
          position_y: y
        })
        .eq('id', componentId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update component position' };
    }
  }

  // Create connection between components
  async createConnection(designId, sourceId, targetId, connectionType = 'api_call') {
    try {
      const { data, error } = await supabase
        .from('design_connections')
        .insert({
          design_id: designId,
          source_component_id: sourceId,
          target_component_id: targetId,
          connection_type: connectionType,
          label: `${connectionType} connection`
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create connection' };
    }
  }

  // Delete component
  async deleteComponent(componentId) {
    try {
      const { error } = await supabase
        .from('design_components')
        .delete()
        .eq('id', componentId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete component' };
    }
  }

  // Get recent designs
  async getRecentDesigns(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('system_designs')
        .select(`
          *,
          project:projects(name)
        `)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to load recent designs' };
    }
  }

  // Import AI generated design
  async importAIDesign(aiDesignData) {
    try {
      // First create the design
      const designResult = await this.saveDesign({
        projectId: aiDesignData.projectId,
        name: aiDesignData.name || 'AI Generated Design',
        description: aiDesignData.description || 'Generated by AI',
        canvasData: aiDesignData.canvasData || {},
        status: 'draft'
      });

      if (!designResult.success) {
        return designResult;
      }

      const designId = designResult.data.id;

      // Save all components
      if (aiDesignData.components?.length > 0) {
        const componentPromises = aiDesignData.components.map(component =>
          this.saveComponent(designId, component)
        );
        await Promise.all(componentPromises);
      }

      // Save all connections
      if (aiDesignData.connections?.length > 0) {
        const connectionPromises = aiDesignData.connections.map(connection =>
          this.createConnection(
            designId,
            connection.sourceId,
            connection.targetId,
            connection.type
          )
        );
        await Promise.all(connectionPromises);
      }

      return { success: true, data: designResult.data };
    } catch (error) {
      return { success: false, error: 'Failed to import AI design' };
    }
  }
}

export default new CanvasService();