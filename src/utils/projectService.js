import { supabase } from './supabaseClient';

class ProjectService {
  // Create new project
  async createProject(projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description,
          is_public: projectData.is_public || false,
          status: projectData.status || 'draft',
          tags: projectData.tags || [],
          metadata: projectData.metadata || {}
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
      return { success: false, error: 'Failed to create project' };
    }
  }

  // Get user's projects
  async getUserProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          designs:system_designs(count),
          collaborators:project_collaborators(count)
        `)
        .order('updated_at', { ascending: false });

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
      return { success: false, error: 'Failed to load projects' };
    }
  }

  // Get single project
  async getProject(projectId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          designs:system_designs(*),
          collaborators:project_collaborators(
            *,
            user:user_profiles(*)
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to load project' };
    }
  }

  // Get public projects
  async getPublicProjects(category = 'all') {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          owner:user_profiles(full_name, avatar_url),
          designs:system_designs(count)
        `)
        .eq('is_public', true)
        .eq('status', 'published')
        .order('updated_at', { ascending: false });

      if (category !== 'all') {
        query = query.contains('tags', [category]);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to load public projects' };
    }
  }

  // Update project
  async updateProject(projectId, updates) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update project' };
    }
  }

  // Delete project
  async deleteProject(projectId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete project' };
    }
  }

  // Get collaborators
  async getCollaborators() {
    try {
      const { data, error } = await supabase
        .from('project_collaborators')
        .select(`
          *,
          user:user_profiles(*),
          project:projects(name)
        `)
        .eq('accepted_at', null, { negated: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to load collaborators' };
    }
  }

  // Invite collaborator
  async inviteCollaborator(projectId, userEmail, role = 'viewer') {
    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (userError) {
        return { success: false, error: 'User not found' };
      }

      // Create collaboration invitation
      const { data, error } = await supabase
        .from('project_collaborators')
        .insert({
          project_id: projectId,
          user_id: userData.id,
          role: role
        })
        .select(`
          *,
          user:user_profiles(*)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to invite collaborator' };
    }
  }

  // Get recent activity
  async getRecentActivity() {
    try {
      // Mock activity data since we don't have activity tracking yet
      const activities = [
        {
          id: '1',
          type: 'project_created',
          message: 'New project created',
          timestamp: new Date().toISOString(),
          user: 'System Designer'
        },
        {
          id: '2',
          type: 'design_updated',
          message: 'Design updated',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'System Designer'
        }
      ];

      return { success: true, data: activities };
    } catch (error) {
      return { success: false, error: 'Failed to load activity' };
    }
  }

  // Like project (for community gallery)
  async likeProject(projectId) {
    try {
      // This would need a likes table in a real implementation
      // For now, just return success
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to like project' };
    }
  }
}

export default new ProjectService();