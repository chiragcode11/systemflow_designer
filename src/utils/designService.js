import { supabase } from './supabaseClient';

class DesignService {
  // Create new system design
  async createSystemDesign(designData) {
    try {
      const { data, error } = await supabase
        .from('system_designs')
        .insert([{
          project_id: designData.projectId,
          name: designData.name,
          description: designData.description,
          prompt_text: designData.promptText,
          canvas_data: designData.canvasData || {},
          status: designData.status || 'draft',
          complexity_score: designData.complexityScore || 5
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to create system design' };
    }
  }

  // Get system design by ID
  async getSystemDesign(designId) {
    try {
      const { data, error } = await supabase
        .from('system_designs')
        .select(`
          *,
          projects (
            name,
            description,
            owner_id,
            user_profiles (
              full_name,
              avatar_url
            )
          ),
          design_components (*),
          design_connections (
            *,
            source_component:design_components!source_component_id (
              id,
              name,
              component_type
            ),
            target_component:design_components!target_component_id (
              id,
              name,
              component_type
            )
          )
        `)
        .eq('id', designId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load system design' };
    }
  }

  // Update system design
  async updateSystemDesign(designId, updates) {
    try {
      const { data, error } = await supabase
        .from('system_designs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', designId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to update system design' };
    }
  }

  // Delete system design
  async deleteSystemDesign(designId) {
    try {
      const { error } = await supabase
        .from('system_designs')
        .delete()
        .eq('id', designId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to delete system design' };
    }
  }

  // Add component to design
  async addComponent(componentData) {
    try {
      const { data, error } = await supabase
        .from('design_components')
        .insert([{
          design_id: componentData.designId,
          component_type: componentData.componentType,
          name: componentData.name,
          description: componentData.description,
          position_x: componentData.positionX || 0,
          position_y: componentData.positionY || 0,
          width: componentData.width || 120,
          height: componentData.height || 80,
          color: componentData.color || '#3B82F6',
          icon: componentData.icon,
          properties: componentData.properties || {}
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to add component' };
    }
  }

  // Update component
  async updateComponent(componentId, updates) {
    try {
      const { data, error } = await supabase
        .from('design_components')
        .update(updates)
        .eq('id', componentId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to update component' };
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
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to delete component' };
    }
  }

  // Add connection between components
  async addConnection(connectionData) {
    try {
      const { data, error } = await supabase
        .from('design_connections')
        .insert([{
          design_id: connectionData.designId,
          source_component_id: connectionData.sourceComponentId,
          target_component_id: connectionData.targetComponentId,
          connection_type: connectionData.connectionType || 'api_call',
          label: connectionData.label,
          description: connectionData.description,
          properties: connectionData.properties || {}
        }])
        .select(`
          *,
          source_component:design_components!source_component_id (
            id,
            name,
            component_type
          ),
          target_component:design_components!target_component_id (
            id,
            name,
            component_type
          )
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to add connection' };
    }
  }

  // Update connection
  async updateConnection(connectionId, updates) {
    try {
      const { data, error } = await supabase
        .from('design_connections')
        .update(updates)
        .eq('id', connectionId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to update connection' };
    }
  }

  // Delete connection
  async deleteConnection(connectionId) {
    try {
      const { error } = await supabase
        .from('design_connections')
        .delete()
        .eq('id', connectionId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to delete connection' };
    }
  }

  // Generate AI system design based on prompt
  async generateDesignFromPrompt(projectId, prompt, complexity = 5) {
    try {
      // Create the base system design
      const designResult = await this.createSystemDesign({
        projectId,
        name: `AI Generated: ${prompt.substring(0, 50)}...`,
        description: `Generated from prompt: ${prompt}`,
        promptText: prompt,
        complexityScore: complexity,
        status: 'draft'
      });

      if (!designResult.success) {
        return designResult;
      }

      const designId = designResult.data.id;

      // Generate components based on prompt analysis
      const components = this._analyzePromptForComponents(prompt, complexity);
      const createdComponents = [];

      for (const comp of components) {
        const componentResult = await this.addComponent({
          designId,
          ...comp
        });
        if (componentResult.success) {
          createdComponents.push(componentResult.data);
        }
      }

      // Generate connections between components
      const connections = this._generateConnections(createdComponents, complexity);
      
      for (const conn of connections) {
        await this.addConnection({
          designId,
          ...conn
        });
      }

      // Get the complete design with all components and connections
      return await this.getSystemDesign(designId);
    } catch (error) {
      return { success: false, error: 'Failed to generate AI design' };
    }
  }

  // Private method to analyze prompt and suggest components
  _analyzePromptForComponents(prompt, complexity) {
    const components = [];
    const lowerPrompt = prompt.toLowerCase();
    
    // Base components that most systems need
    if (lowerPrompt.includes('user') || lowerPrompt.includes('auth')) {
      components.push({
        componentType: 'user_interface',
        name: 'User Interface',
        description: 'Frontend application for user interaction',
        positionX: 100,
        positionY: 100,
        color: '#8B5CF6'
      });
    }

    if (lowerPrompt.includes('api') || lowerPrompt.includes('service') || lowerPrompt.includes('backend')) {
      components.push({
        componentType: 'api',
        name: 'API Gateway',
        description: 'Main API entry point',
        positionX: 300,
        positionY: 100,
        color: '#10B981'
      });
    }

    if (lowerPrompt.includes('database') || lowerPrompt.includes('data') || lowerPrompt.includes('store')) {
      components.push({
        componentType: 'database',
        name: 'Primary Database',
        description: 'Main data storage',
        positionX: 500,
        positionY: 200,
        color: '#3B82F6'
      });
    }

    // Add complexity-based components
    if (complexity >= 6) {
      components.push({
        componentType: 'load_balancer',
        name: 'Load Balancer',
        description: 'Distributes incoming requests',
        positionX: 150,
        positionY: 50,
        color: '#F59E0B'
      });
    }

    if (complexity >= 7) {
      components.push({
        componentType: 'cache',
        name: 'Redis Cache',
        description: 'In-memory caching layer',
        positionX: 400,
        positionY: 300,
        color: '#EF4444'
      });
    }

    if (complexity >= 8) {
      components.push({
        componentType: 'queue',
        name: 'Message Queue',
        description: 'Asynchronous message processing',
        positionX: 600,
        positionY: 100,
        color: '#8B5CF6'
      });
    }

    // Domain-specific components
    if (lowerPrompt.includes('payment') || lowerPrompt.includes('commerce')) {
      components.push({
        componentType: 'external_service',
        name: 'Payment Gateway',
        description: 'External payment processing',
        positionX: 700,
        positionY: 200,
        color: '#059669'
      });
    }

    if (lowerPrompt.includes('file') || lowerPrompt.includes('upload') || lowerPrompt.includes('media')) {
      components.push({
        componentType: 'external_service',
        name: 'File Storage',
        description: 'Cloud file storage service',
        positionX: 300,
        positionY: 300,
        color: '#7C3AED'
      });
    }

    return components;
  }

  // Private method to generate logical connections between components
  _generateConnections(components, complexity) {
    const connections = [];
    
    // Find common component types
    const ui = components.find(c => c.component_type === 'user_interface');
    const api = components.find(c => c.component_type === 'api');
    const db = components.find(c => c.component_type === 'database');
    const lb = components.find(c => c.component_type === 'load_balancer');
    const cache = components.find(c => c.component_type === 'cache');
    const queue = components.find(c => c.component_type === 'queue');

    // Basic connections
    if (ui && api) {
      connections.push({
        sourceComponentId: ui.id,
        targetComponentId: api.id,
        connectionType: 'api_call',
        label: 'HTTP Requests',
        description: 'Frontend sends API requests'
      });
    }

    if (api && db) {
      connections.push({
        sourceComponentId: api.id,
        targetComponentId: db.id,
        connectionType: 'database_query',
        label: 'SQL Queries',
        description: 'API queries database'
      });
    }

    // Advanced connections based on complexity
    if (lb && api && complexity >= 6) {
      connections.push({
        sourceComponentId: lb.id,
        targetComponentId: api.id,
        connectionType: 'http_request',
        label: 'Load Balance',
        description: 'Distributes requests to API instances'
      });
    }

    if (api && cache && complexity >= 7) {
      connections.push({
        sourceComponentId: api.id,
        targetComponentId: cache.id,
        connectionType: 'api_call',
        label: 'Cache Access',
        description: 'Caching layer for performance'
      });
    }

    if (api && queue && complexity >= 8) {
      connections.push({
        sourceComponentId: api.id,
        targetComponentId: queue.id,
        connectionType: 'message_queue',
        label: 'Async Processing',
        description: 'Queue background tasks'
      });
    }

    return connections;
  }
}

export default new DesignService();