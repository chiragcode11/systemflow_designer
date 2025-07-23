import { supabase } from './supabaseClient';

class TemplateService {
  // Get all templates with filtering and pagination
  async getTemplates(options = {}) {
    try {
      let query = supabase
        .from('design_templates')
        .select(`
          *,
          user_profiles (
            full_name,
            avatar_url
          )
        `);

      // Apply filters
      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.difficulty) {
        query = query.eq('difficulty_level', options.difficulty);
      }

      if (options.featured) {
        query = query.eq('is_featured', true);
      }

      if (options.tags && options.tags.length > 0) {
        query = query.contains('tags', options.tags);
      }

      // Apply sorting
      const sortBy = options.sortBy || 'updated_at';
      const sortOrder = options.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

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
      return { success: false, error: 'Failed to load templates' };
    }
  }

  // Get featured templates
  async getFeaturedTemplates(limit = 6) {
    try {
      const { data, error } = await supabase
        .from('design_templates')
        .select(`
          *,
          user_profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('is_featured', true)
        .order('usage_count', { ascending: false })
        .limit(limit);

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
      return { success: false, error: 'Failed to load featured templates' };
    }
  }

  // Get template by ID
  async getTemplate(templateId) {
    try {
      const { data, error } = await supabase
        .from('design_templates')
        .select(`
          *,
          user_profiles (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('id', templateId)
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
      return { success: false, error: 'Failed to load template' };
    }
  }

  // Create new template
  async createTemplate(templateData) {
    try {
      const { data, error } = await supabase
        .from('design_templates')
        .insert([{
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          difficulty_level: templateData.difficultyLevel || 3,
          template_data: templateData.templateData,
          tags: templateData.tags || [],
          is_featured: false,
          usage_count: 0
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
      return { success: false, error: 'Failed to create template' };
    }
  }

  // Update template
  async updateTemplate(templateId, updates) {
    try {
      const { data, error } = await supabase
        .from('design_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', templateId)
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
      return { success: false, error: 'Failed to update template' };
    }
  }

  // Delete template
  async deleteTemplate(templateId) {
    try {
      const { error } = await supabase
        .from('design_templates')
        .delete()
        .eq('id', templateId);

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
      return { success: false, error: 'Failed to delete template' };
    }
  }

  // Increment template usage count
  async incrementUsageCount(templateId) {
    try {
      const { data, error } = await supabase
        .from('design_templates')
        .select('usage_count')
        .eq('id', templateId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      const newCount = (data.usage_count || 0) + 1;

      const { error: updateError } = await supabase
        .from('design_templates')
        .update({ usage_count: newCount })
        .eq('id', templateId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, data: { usage_count: newCount } };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to update usage count' };
    }
  }

  // Get template categories with counts
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('design_templates')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        return { success: false, error: error.message };
      }

      // Count templates per category
      const categoryCounts = data.reduce((acc, template) => {
        acc[template.category] = (acc[template.category] || 0) + 1;
        return acc;
      }, {});

      const categories = Object.keys(categoryCounts).map(category => ({
        name: category,
        count: categoryCounts[category]
      }));

      return { success: true, data: categories };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load categories' };
    }
  }

  // Create project from template
  async createProjectFromTemplate(templateId, projectData) {
    try {
      // Get template data
      const templateResult = await this.getTemplate(templateId);
      if (!templateResult.success) {
        return templateResult;
      }

      const template = templateResult.data;

      // Increment usage count
      await this.incrementUsageCount(templateId);

      // Import project service to create project
      const { default: projectService } = await import('./projectService');

      // Create new project
      const projectResult = await projectService.createProject({
        name: projectData.name || `${template.name} Project`,
        description: projectData.description || `Project created from ${template.name} template`,
        status: 'draft',
        isPublic: false,
        tags: [...(template.tags || []), 'from-template']
      });

      if (!projectResult.success) {
        return projectResult;
      }

      // Import design service to create design
      const { default: designService } = await import('./designService');

      // Create system design from template
      const designResult = await designService.createSystemDesign({
        projectId: projectResult.data.id,
        name: template.name,
        description: template.description,
        promptText: `Created from template: ${template.name}`,
        canvasData: template.template_data?.canvas || {},
        status: 'draft',
        complexityScore: template.difficulty_level
      });

      if (!designResult.success) {
        return designResult;
      }

      // Create components from template data
      const components = template.template_data?.components || [];
      const createdComponents = [];

      for (const comp of components) {
        const componentResult = await designService.addComponent({
          designId: designResult.data.id,
          componentType: comp.type || 'server',
          name: comp.name,
          description: comp.description || '',
          positionX: comp.position?.x || 0,
          positionY: comp.position?.y || 0,
          width: comp.width || 120,
          height: comp.height || 80,
          color: comp.color || '#3B82F6',
          properties: comp.properties || {}
        });

        if (componentResult.success) {
          createdComponents.push({
            ...componentResult.data,
            templateId: comp.id || comp.name
          });
        }
      }

      // Create connections from template data
      const connections = template.template_data?.connections || [];

      for (const conn of connections) {
        const sourceComp = createdComponents.find(c => 
          c.templateId === conn.from || c.name === conn.from
        );
        const targetComp = createdComponents.find(c => 
          c.templateId === conn.to || c.name === conn.to
        );

        if (sourceComp && targetComp) {
          await designService.addConnection({
            designId: designResult.data.id,
            sourceComponentId: sourceComp.id,
            targetComponentId: targetComp.id,
            connectionType: conn.type || 'api_call',
            label: conn.label || '',
            description: conn.description || ''
          });
        }
      }

      return { 
        success: true, 
        data: {
          project: projectResult.data,
          design: designResult.data,
          template: template
        }
      };
    } catch (error) {
      return { success: false, error: 'Failed to create project from template' };
    }
  }

  // Search templates
  async searchTemplates(searchTerm, options = {}) {
    try {
      let query = supabase
        .from('design_templates')
        .select(`
          *,
          user_profiles (
            full_name,
            avatar_url
          )
        `);

      // Apply text search
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`);
      }

      // Apply additional filters
      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.difficulty) {
        query = query.eq('difficulty_level', options.difficulty);
      }

      // Apply sorting
      const sortBy = options.sortBy || 'updated_at';
      const sortOrder = options.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

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
      return { success: false, error: 'Failed to search templates' };
    }
  }
}

export default new TemplateService();