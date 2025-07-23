-- Location: supabase/migrations/20250123132522_system_design_schema.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete new schema creation
-- Dependencies: Fresh Supabase project

-- 1. Extensions and Types
CREATE TYPE public.user_role AS ENUM ('admin', 'designer', 'viewer');
CREATE TYPE public.design_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.component_type AS ENUM ('server', 'database', 'api', 'load_balancer', 'cache', 'queue', 'cdn', 'user_interface', 'external_service', 'microservice');
CREATE TYPE public.connection_type AS ENUM ('api_call', 'database_query', 'message_queue', 'websocket', 'http_request', 'tcp_connection');
CREATE TYPE public.collaboration_role AS ENUM ('owner', 'editor', 'viewer');

-- 2. Core Tables
-- Critical intermediary table for auth relationships
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'designer'::public.user_role,
    bio TEXT,
    company TEXT,
    website TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Projects table for organizing system designs
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status public.design_status DEFAULT 'draft'::public.design_status,
    is_public BOOLEAN DEFAULT false,
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- System designs table for individual designs within projects
CREATE TABLE public.system_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    prompt_text TEXT,
    canvas_data JSONB DEFAULT '{}',
    status public.design_status DEFAULT 'draft'::public.design_status,
    version_number INTEGER DEFAULT 1,
    complexity_score INTEGER CHECK (complexity_score >= 1 AND complexity_score <= 10),
    estimated_cost DECIMAL(10,2),
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Components table for system architecture components
CREATE TABLE public.design_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_id UUID REFERENCES public.system_designs(id) ON DELETE CASCADE,
    component_type public.component_type NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 120,
    height INTEGER DEFAULT 80,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Connections table for component relationships
CREATE TABLE public.design_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_id UUID REFERENCES public.system_designs(id) ON DELETE CASCADE,
    source_component_id UUID REFERENCES public.design_components(id) ON DELETE CASCADE,
    target_component_id UUID REFERENCES public.design_components(id) ON DELETE CASCADE,
    connection_type public.connection_type DEFAULT 'api_call'::public.connection_type,
    label TEXT,
    description TEXT,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Project collaborators for sharing and real-time collaboration
CREATE TABLE public.project_collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role public.collaboration_role DEFAULT 'viewer'::public.collaboration_role,
    invited_by UUID REFERENCES public.user_profiles(id),
    invited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMPTZ,
    UNIQUE(project_id, user_id)
);

-- Templates table for reusable system design patterns
CREATE TABLE public.design_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    template_data JSONB NOT NULL,
    usage_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Design versions for version control
CREATE TABLE public.design_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_id UUID REFERENCES public.system_designs(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    changes_description TEXT,
    canvas_data JSONB NOT NULL,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(design_id, version_number)
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_is_public ON public.projects(is_public);
CREATE INDEX idx_system_designs_project_id ON public.system_designs(project_id);
CREATE INDEX idx_system_designs_status ON public.system_designs(status);
CREATE INDEX idx_design_components_design_id ON public.design_components(design_id);
CREATE INDEX idx_design_components_type ON public.design_components(component_type);
CREATE INDEX idx_design_connections_design_id ON public.design_connections(design_id);
CREATE INDEX idx_design_connections_source ON public.design_connections(source_component_id);
CREATE INDEX idx_design_connections_target ON public.design_connections(target_component_id);
CREATE INDEX idx_project_collaborators_project_id ON public.project_collaborators(project_id);
CREATE INDEX idx_project_collaborators_user_id ON public.project_collaborators(user_id);
CREATE INDEX idx_design_templates_category ON public.design_templates(category);
CREATE INDEX idx_design_templates_featured ON public.design_templates(is_featured);
CREATE INDEX idx_design_versions_design_id ON public.design_versions(design_id);

-- 4. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_versions ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.is_project_owner(project_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_uuid AND p.owner_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.is_project_collaborator(project_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.project_collaborators pc
    WHERE pc.project_id = project_uuid 
    AND pc.user_id = auth.uid() 
    AND pc.accepted_at IS NOT NULL
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_project(project_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_uuid 
    AND (
        p.owner_id = auth.uid() OR
        p.is_public = true OR
        public.is_project_collaborator(project_uuid)
    )
)
$$;

CREATE OR REPLACE FUNCTION public.can_edit_project(project_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.projects p
    LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id AND pc.user_id = auth.uid()
    WHERE p.id = project_uuid 
    AND (
        p.owner_id = auth.uid() OR
        (pc.role IN ('owner', 'editor') AND pc.accepted_at IS NOT NULL)
    )
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_design(design_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.system_designs sd
    JOIN public.projects p ON sd.project_id = p.id
    WHERE sd.id = design_uuid 
    AND public.can_access_project(p.id)
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'designer'::public.user_role)
  );  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Triggers for updated_at timestamp
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_designs_updated_at
    BEFORE UPDATE ON public.system_designs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_design_templates_updated_at
    BEFORE UPDATE ON public.design_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. RLS Policies
-- User Profiles Policies
CREATE POLICY "users_view_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "public_view_profiles"
ON public.user_profiles
FOR SELECT
TO public
USING (true);

-- Projects Policies
CREATE POLICY "users_manage_own_projects"
ON public.projects
FOR ALL
TO authenticated
USING (public.is_project_owner(id))
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "public_view_public_projects"
ON public.projects
FOR SELECT
TO public
USING (is_public = true);

CREATE POLICY "collaborators_view_projects"
ON public.projects
FOR SELECT
TO authenticated
USING (public.can_access_project(id));

-- System Designs Policies
CREATE POLICY "project_members_access_designs"
ON public.system_designs
FOR ALL
TO authenticated
USING (public.can_access_design(id))
WITH CHECK (public.can_edit_project(project_id));

-- Design Components Policies
CREATE POLICY "design_access_components"
ON public.design_components
FOR ALL
TO authenticated
USING (public.can_access_design(design_id))
WITH CHECK (public.can_access_design(design_id));

-- Design Connections Policies
CREATE POLICY "design_access_connections"
ON public.design_connections
FOR ALL
TO authenticated
USING (public.can_access_design(design_id))
WITH CHECK (public.can_access_design(design_id));

-- Project Collaborators Policies
CREATE POLICY "project_owner_manage_collaborators"
ON public.project_collaborators
FOR ALL
TO authenticated
USING (public.is_project_owner(project_id))
WITH CHECK (public.is_project_owner(project_id));

CREATE POLICY "collaborators_view_collaborators"
ON public.project_collaborators
FOR SELECT
TO authenticated
USING (public.can_access_project(project_id) OR user_id = auth.uid());

-- Design Templates Policies
CREATE POLICY "creators_manage_templates"
ON public.design_templates
FOR ALL
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "public_view_templates"
ON public.design_templates
FOR SELECT
TO public
USING (true);

-- Design Versions Policies
CREATE POLICY "design_access_versions"
ON public.design_versions
FOR ALL
TO authenticated
USING (public.can_access_design(design_id))
WITH CHECK (public.can_edit_project((SELECT project_id FROM public.system_designs WHERE id = design_id)));

-- 7. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    designer_uuid UUID := gen_random_uuid();
    project1_uuid UUID := gen_random_uuid();
    project2_uuid UUID := gen_random_uuid();
    design1_uuid UUID := gen_random_uuid();
    design2_uuid UUID := gen_random_uuid();
    comp1_uuid UUID := gen_random_uuid();
    comp2_uuid UUID := gen_random_uuid();
    comp3_uuid UUID := gen_random_uuid();
    template1_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@systemdesign.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (designer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'designer@systemdesign.com', crypt('designer123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Designer", "role": "designer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create projects
    INSERT INTO public.projects (id, owner_id, name, description, status, is_public, tags) VALUES
        (project1_uuid, admin_uuid, 'E-Commerce Platform', 'Scalable e-commerce system with microservices architecture', 'published'::public.design_status, true, ARRAY['e-commerce', 'microservices', 'scalability']),
        (project2_uuid, designer_uuid, 'Real-time Chat Application', 'WebSocket-based chat system with message persistence', 'draft'::public.design_status, false, ARRAY['chat', 'websocket', 'real-time']);

    -- Create system designs
    INSERT INTO public.system_designs (id, project_id, name, description, prompt_text, status, complexity_score, canvas_data) VALUES
        (design1_uuid, project1_uuid, 'Core E-Commerce Architecture', 'Main system design for the e-commerce platform', 'Design a scalable e-commerce platform with user management, product catalog, shopping cart, and payment processing', 'published'::public.design_status, 8, '{"zoom": 1, "pan": {"x": 0, "y": 0}}'::jsonb),
        (design2_uuid, project2_uuid, 'Chat System Architecture', 'Real-time messaging system design', 'Create a real-time chat application supporting multiple users, message history, and file sharing', 'draft'::public.design_status, 6, '{"zoom": 1, "pan": {"x": 0, "y": 0}}'::jsonb);

    -- Create design components
    INSERT INTO public.design_components (id, design_id, component_type, name, description, position_x, position_y, color, properties) VALUES
        (comp1_uuid, design1_uuid, 'load_balancer'::public.component_type, 'Load Balancer', 'Distributes incoming requests across multiple servers', 100, 100, '#FF6B6B', '{"capacity": "10000 req/s", "algorithm": "round-robin"}'::jsonb),
        (comp2_uuid, design1_uuid, 'database'::public.component_type, 'User Database', 'Stores user account information and preferences', 300, 200, '#4ECDC4', '{"type": "PostgreSQL", "size": "500GB", "replicas": 2}'::jsonb),
        (comp3_uuid, design1_uuid, 'microservice'::public.component_type, 'Payment Service', 'Handles payment processing and transactions', 500, 150, '#45B7D1', '{"framework": "Node.js", "database": "PostgreSQL", "external_apis": ["Stripe", "PayPal"]}'::jsonb);

    -- Create design connections
    INSERT INTO public.design_connections (design_id, source_component_id, target_component_id, connection_type, label, description) VALUES
        (design1_uuid, comp1_uuid, comp3_uuid, 'api_call'::public.connection_type, 'Route Requests', 'Load balancer routes payment requests to payment service'),
        (design1_uuid, comp3_uuid, comp2_uuid, 'database_query'::public.connection_type, 'User Lookup', 'Payment service queries user database for validation');

    -- Create project collaborator
    INSERT INTO public.project_collaborators (project_id, user_id, role, invited_by, accepted_at) VALUES
        (project1_uuid, designer_uuid, 'editor'::public.collaboration_role, admin_uuid, now());

    -- Create design template
    INSERT INTO public.design_templates (id, creator_id, name, description, category, difficulty_level, template_data, is_featured, tags) VALUES
        (template1_uuid, admin_uuid, 'Basic CRUD API', 'Simple REST API with database for basic CRUD operations', 'Web APIs', 2, '{"components": [{"type": "api", "name": "REST API"}, {"type": "database", "name": "PostgreSQL"}], "connections": [{"from": "api", "to": "database", "type": "query"}]}'::jsonb, true, ARRAY['api', 'database', 'crud']);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 8. Cleanup Function
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@systemdesign.com';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.design_connections WHERE design_id IN (
        SELECT sd.id FROM public.system_designs sd
        JOIN public.projects p ON sd.project_id = p.id
        WHERE p.owner_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.design_components WHERE design_id IN (
        SELECT sd.id FROM public.system_designs sd
        JOIN public.projects p ON sd.project_id = p.id
        WHERE p.owner_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.design_versions WHERE design_id IN (
        SELECT sd.id FROM public.system_designs sd
        JOIN public.projects p ON sd.project_id = p.id
        WHERE p.owner_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.system_designs WHERE project_id IN (
        SELECT id FROM public.projects WHERE owner_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.project_collaborators WHERE project_id IN (
        SELECT id FROM public.projects WHERE owner_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.design_templates WHERE creator_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.projects WHERE owner_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;