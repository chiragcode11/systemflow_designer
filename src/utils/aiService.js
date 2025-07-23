import openai from './openaiClient';
import { supabase } from './supabaseClient';

class AIService {
  // Generate system design from prompt using OpenAI
  async generateDesign(prompt, complexity = 'high') {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        console.warn('OpenAI API key not configured, using fallback');
        return this.generateMockDesign(prompt, complexity);
      }

      // Create a detailed system prompt for complex architecture generation
      const systemPrompt = `You are an expert system architect and software engineer. Generate a comprehensive, production-ready system design based on the user's requirements. 

      CRITICAL REQUIREMENTS:
      - Create a COMPLEX system with 10-15 components minimum
      - Include proper microservices architecture patterns
      - Add realistic connections between components
      - Use appropriate colors and positioning
      - Include detailed configuration properties
      
      Component Types Available: load_balancer, api_gateway, microservice, database, cache, message_queue, cdn, monitoring, auth_service, storage, search_engine, notification_service, analytics, logging, file_storage, security
      
      Connection Types: http_request, api_call, database_query, cache_access, message_publish, file_upload, auth_check, log_write, data_flow, websocket, grpc_call
      
      Position components in a logical flow (left to right, top to bottom) with proper spacing.
      Use these colors strategically:
      - Load Balancers: #00d4ff (cyan)
      - API Gateway: #8b5cf6 (purple) 
      - Microservices: #ff6b35 (orange)
      - Databases: #336791 (blue)
      - Cache: #dc382d (red)
      - Message Queues: #10b981 (green)
      - Monitoring: #06b6d4 (teal)
      - Security: #dc2626 (dark red)
      
      Return ONLY valid JSON with this exact structure (no markdown, no explanation):`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a ${complexity} complexity system architecture for: ${prompt}. Make it production-ready with proper scalability, security, and monitoring components.` },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'system_design_response',
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                components: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string' },
                      name: { type: 'string' },
                      x: { type: 'number' },
                      y: { type: 'number' },
                      width: { type: 'number' },
                      height: { type: 'number' },
                      color: { type: 'string' },
                      properties: { 
                        type: 'object',
                        additionalProperties: true
                      }
                    },
                    required: ['id', 'type', 'name', 'x', 'y', 'width', 'height', 'color']
                  }
                },
                connections: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      sourceId: { type: 'string' },
                      targetId: { type: 'string' },
                      type: { type: 'string' },
                      label: { type: 'string' },
                      animated: { type: 'boolean' }
                    },
                    required: ['id', 'sourceId', 'targetId', 'type', 'label']
                  }
                }
              },
              required: ['name', 'description', 'components', 'connections'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.8,
        max_tokens: 4000,
      });

      const designData = JSON.parse(response.choices[0].message.content);
      
      // Validate and enhance the generated design
      const enhancedDesign = this.validateAndEnhanceDesign(designData, prompt, complexity);
      
      return {
        success: true,
        data: {
          ...enhancedDesign,
          prompt,
          complexity,
          generatedAt: new Date().toISOString(),
          canvasData: {
            zoom: 1,
            pan: { x: 0, y: 0 }
          }
        }
      };
    } catch (error) {
      console.error('OpenAI generation error:', error);
      
      // Enhanced fallback with more realistic mock data
      return this.generateMockDesign(prompt, complexity);
    }
  }

  // Validate and enhance AI generated design
  validateAndEnhanceDesign(design, prompt, complexity) {
    // Ensure minimum complexity
    if (design.components?.length < 8) {
      return this.generateMockDesign(prompt, complexity).then(mock => mock.data);
    }

    // Enhance components with missing properties
    const enhancedComponents = design.components?.map(comp => ({
      ...comp,
      width: comp.width || 120,
      height: comp.height || 80,
      properties: comp.properties || {},
      color: comp.color || this.getDefaultColorForType(comp.type)
    })) || [];

    // Ensure connections have proper animation flags
    const enhancedConnections = design.connections?.map(conn => ({
      ...conn,
      animated: conn.animated !== false, // Default to true
      label: conn.label || this.getDefaultLabelForConnectionType(conn.type)
    })) || [];

    return {
      ...design,
      components: enhancedComponents,
      connections: enhancedConnections
    };
  }

  // Get default color for component type
  getDefaultColorForType(type) {
    const colorMap = {
      'load_balancer': '#00d4ff',
      'api_gateway': '#8b5cf6',
      'microservice': '#ff6b35',
      'database': '#336791',
      'cache': '#dc382d',
      'message_queue': '#10b981',
      'cdn': '#ff9500',
      'monitoring': '#06b6d4',
      'auth_service': '#dc2626',
      'storage': '#336791',
      'search_engine': '#f59e0b',
      'notification_service': '#8b5cf6',
      'analytics': '#06b6d4',
      'logging': '#10b981',
      'file_storage': '#336791',
      'security': '#dc2626'
    };
    return colorMap[type] || '#8b5cf6';
  }

  // Get default label for connection type
  getDefaultLabelForConnectionType(type) {
    const labelMap = {
      'http_request': 'HTTP Request',
      'api_call': 'API Call',
      'database_query': 'DB Query',
      'cache_access': 'Cache Access',
      'message_publish': 'Message',
      'file_upload': 'File Upload',
      'auth_check': 'Auth Check',
      'log_write': 'Logs',
      'data_flow': 'Data Flow',
      'websocket': 'WebSocket',
      'grpc_call': 'gRPC Call'
    };
    return labelMap[type] || 'Connection';
  }

  // Enhanced fallback mock design generation
  async generateMockDesign(prompt, complexity) {
    const mockDesigns = {
      'e-commerce': {
        name: 'Enterprise E-Commerce Platform',
        description: 'Highly scalable, cloud-native e-commerce platform with advanced microservices architecture, real-time analytics, and comprehensive security',
        components: [
          { id: 'cdn-1', type: 'cdn', name: 'Global CDN', x: 50, y: 50, width: 140, height: 70, color: '#ff9500', properties: { provider: 'CloudFlare', regions: 'Global', cache_ttl: '24h' } },
          { id: 'lb-1', type: 'load_balancer', name: 'Load Balancer', x: 250, y: 50, width: 140, height: 70, color: '#00d4ff', properties: { algorithm: 'least-connections', health_check: true, ssl_termination: true } },
          { id: 'api-1', type: 'api_gateway', name: 'API Gateway', x: 450, y: 50, width: 140, height: 70, color: '#8b5cf6', properties: { rate_limiting: '1000/min', authentication: 'JWT', cors: true } },
          { id: 'auth-1', type: 'auth_service', name: 'Auth Service', x: 50, y: 180, width: 120, height: 80, color: '#dc2626', properties: { provider: 'Auth0', mfa: true, session_timeout: '30min' } },
          { id: 'user-1', type: 'microservice', name: 'User Service', x: 200, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Node.js', replicas: 3, cpu: '0.5', memory: '1Gi' } },
          { id: 'product-1', type: 'microservice', name: 'Product Service', x: 350, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Java', replicas: 5, cpu: '1', memory: '2Gi' } },
          { id: 'cart-1', type: 'microservice', name: 'Cart Service', x: 500, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Python', replicas: 3, cpu: '0.5', memory: '1Gi' } },
          { id: 'order-1', type: 'microservice', name: 'Order Service', x: 650, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Go', replicas: 4, cpu: '1', memory: '1.5Gi' } },
          { id: 'payment-1', type: 'microservice', name: 'Payment Service', x: 800, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Java', replicas: 3, cpu: '1', memory: '2Gi', pci_compliant: true } },
          { id: 'cache-1', type: 'cache', name: 'Redis Cluster', x: 350, y: 320, width: 140, height: 60, color: '#dc382d', properties: { type: 'Redis', cluster_mode: true, memory: '8GB', ttl: '1h' } },
          { id: 'search-1', type: 'search_engine', name: 'Elasticsearch', x: 500, y: 320, width: 140, height: 60, color: '#f59e0b', properties: { version: '8.x', indices: 'products,orders', replicas: 3 } },
          { id: 'queue-1', type: 'message_queue', name: 'Event Bus', x: 650, y: 320, width: 140, height: 60, color: '#10b981', properties: { type: 'Apache Kafka', partitions: 12, retention: '7days' } },
          { id: 'db-users', type: 'database', name: 'User Database', x: 50, y: 460, width: 130, height: 60, color: '#336791', properties: { engine: 'PostgreSQL', version: '15', storage: '100GB', backup: 'daily' } },
          { id: 'db-products', type: 'database', name: 'Product DB', x: 200, y: 460, width: 130, height: 60, color: '#336791', properties: { engine: 'MongoDB', sharding: true, storage: '500GB', backup: 'continuous' } },
          { id: 'db-orders', type: 'database', name: 'Order Database', x: 350, y: 460, width: 130, height: 60, color: '#336791', properties: { engine: 'PostgreSQL', version: '15', storage: '200GB', backup: 'hourly' } },
          { id: 'analytics-1', type: 'analytics', name: 'Real-time Analytics', x: 500, y: 460, width: 140, height: 60, color: '#06b6d4', properties: { tool: 'Apache Spark', streaming: true, retention: '30days' } },
          { id: 'monitor-1', type: 'monitoring', name: 'Monitoring Stack', x: 650, y: 460, width: 140, height: 60, color: '#06b6d4', properties: { tools: 'Prometheus+Grafana', alerts: true, retention: '15days' } },
          { id: 'log-1', type: 'logging', name: 'Log Aggregation', x: 800, y: 460, width: 140, height: 60, color: '#10b981', properties: { tool: 'ELK Stack', retention: '30days', log_level: 'info' } }
        ],
        connections: [
          { id: 'c1', sourceId: 'cdn-1', targetId: 'lb-1', type: 'http_request', label: 'Static Assets', animated: true },
          { id: 'c2', sourceId: 'lb-1', targetId: 'api-1', type: 'http_request', label: 'Load Balance', animated: true },
          { id: 'c3', sourceId: 'api-1', targetId: 'auth-1', type: 'auth_check', label: 'Authenticate', animated: true },
          { id: 'c4', sourceId: 'api-1', targetId: 'user-1', type: 'api_call', label: 'User API', animated: true },
          { id: 'c5', sourceId: 'api-1', targetId: 'product-1', type: 'api_call', label: 'Product API', animated: true },
          { id: 'c6', sourceId: 'api-1', targetId: 'cart-1', type: 'api_call', label: 'Cart API', animated: true },
          { id: 'c7', sourceId: 'api-1', targetId: 'order-1', type: 'api_call', label: 'Order API', animated: true },
          { id: 'c8', sourceId: 'order-1', targetId: 'payment-1', type: 'api_call', label: 'Process Payment', animated: true },
          { id: 'c9', sourceId: 'user-1', targetId: 'db-users', type: 'database_query', label: 'User Data', animated: false },
          { id: 'c10', sourceId: 'product-1', targetId: 'db-products', type: 'database_query', label: 'Product Data', animated: false },
          { id: 'c11', sourceId: 'order-1', targetId: 'db-orders', type: 'database_query', label: 'Order Data', animated: false },
          { id: 'c12', sourceId: 'product-1', targetId: 'cache-1', type: 'cache_access', label: 'Product Cache', animated: true },
          { id: 'c13', sourceId: 'cart-1', targetId: 'cache-1', type: 'cache_access', label: 'Cart Cache', animated: true },
          { id: 'c14', sourceId: 'product-1', targetId: 'search-1', type: 'data_flow', label: 'Search Index', animated: true },
          { id: 'c15', sourceId: 'order-1', targetId: 'queue-1', type: 'message_publish', label: 'Order Events', animated: true },
          { id: 'c16', sourceId: 'payment-1', targetId: 'queue-1', type: 'message_publish', label: 'Payment Events', animated: true },
          { id: 'c17', sourceId: 'queue-1', targetId: 'analytics-1', type: 'data_flow', label: 'Event Stream', animated: true },
          { id: 'c18', sourceId: 'monitor-1', targetId: 'api-1', type: 'log_write', label: 'Metrics', animated: false },
          { id: 'c19', sourceId: 'log-1', targetId: 'monitor-1', type: 'log_write', label: 'Logs', animated: false }
        ]
      },
      'social-media': {
        name: 'Large-Scale Social Media Platform',
        description: 'Distributed social media platform supporting millions of users with real-time feeds, messaging, and content delivery',
        components: [
          { id: 'cdn-1', type: 'cdn', name: 'Global CDN', x: 100, y: 50, width: 140, height: 70, color: '#ff9500', properties: { provider: 'CloudFront', regions: 'Global', cache_ttl: '1h' } },
          { id: 'lb-1', type: 'load_balancer', name: 'Load Balancer', x: 300, y: 50, width: 140, height: 70, color: '#00d4ff', properties: { algorithm: 'round-robin', health_check: true } },
          { id: 'api-1', type: 'api_gateway', name: 'API Gateway', x: 500, y: 50, width: 140, height: 70, color: '#8b5cf6', properties: { rate_limiting: '5000/min', websocket: true } },
          { id: 'auth-1', type: 'auth_service', name: 'OAuth Service', x: 50, y: 180, width: 120, height: 80, color: '#dc2626', properties: { provider: 'OAuth2', scopes: 'read,write,admin' } },
          { id: 'user-1', type: 'microservice', name: 'User Service', x: 200, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Go', replicas: 5 } },
          { id: 'post-1', type: 'microservice', name: 'Post Service', x: 350, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Python', replicas: 8 } },
          { id: 'feed-1', type: 'microservice', name: 'Feed Service', x: 500, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Java', replicas: 10 } },
          { id: 'msg-1', type: 'microservice', name: 'Messaging Service', x: 650, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Node.js', websocket: true } },
          { id: 'media-1', type: 'microservice', name: 'Media Service', x: 800, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Go', storage: 'S3' } },
          { id: 'cache-1', type: 'cache', name: 'Redis Cluster', x: 200, y: 320, width: 140, height: 60, color: '#dc382d', properties: { type: 'Redis Cluster', memory: '64GB' } },
          { id: 'cache-2', type: 'cache', name: 'Feed Cache', x: 400, y: 320, width: 140, height: 60, color: '#dc382d', properties: { type: 'Redis', specialized: 'timeline' } },
          { id: 'search-1', type: 'search_engine', name: 'Search Engine', x: 600, y: 320, width: 140, height: 60, color: '#f59e0b', properties: { engine: 'Elasticsearch', indices: 'posts,users' } },
          { id: 'queue-1', type: 'message_queue', name: 'Event Stream', x: 800, y: 320, width: 140, height: 60, color: '#10b981', properties: { type: 'Apache Pulsar', topics: 'posts,likes,follows' } },
          { id: 'db-users', type: 'database', name: 'User DB', x: 50, y: 460, width: 120, height: 60, color: '#336791', properties: { engine: 'PostgreSQL', partitioned: true } },
          { id: 'db-posts', type: 'database', name: 'Posts DB', x: 200, y: 460, width: 120, height: 60, color: '#336791', properties: { engine: 'Cassandra', distributed: true } },
          { id: 'db-graph', type: 'database', name: 'Social Graph', x: 350, y: 460, width: 120, height: 60, color: '#336791', properties: { engine: 'Neo4j', relationships: true } },
          { id: 'storage-1', type: 'storage', name: 'Media Storage', x: 500, y: 460, width: 120, height: 60, color: '#336791', properties: { type: 'S3', cdn_enabled: true } },
          { id: 'analytics-1', type: 'analytics', name: 'User Analytics', x: 650, y: 460, width: 140, height: 60, color: '#06b6d4', properties: { real_time: true, ml_enabled: true } },
          { id: 'monitor-1', type: 'monitoring', name: 'System Monitor', x: 800, y: 460, width: 140, height: 60, color: '#06b6d4', properties: { alerts: true, dashboards: 15 } }
        ],
        connections: [
          { id: 'c1', sourceId: 'cdn-1', targetId: 'lb-1', type: 'http_request', label: 'Static Content', animated: true },
          { id: 'c2', sourceId: 'lb-1', targetId: 'api-1', type: 'http_request', label: 'Route Request', animated: true },
          { id: 'c3', sourceId: 'api-1', targetId: 'auth-1', type: 'auth_check', label: 'Verify Token', animated: true },
          { id: 'c4', sourceId: 'api-1', targetId: 'user-1', type: 'api_call', label: 'User API', animated: true },
          { id: 'c5', sourceId: 'api-1', targetId: 'post-1', type: 'api_call', label: 'Post API', animated: true },
          { id: 'c6', sourceId: 'api-1', targetId: 'feed-1', type: 'api_call', label: 'Feed API', animated: true },
          { id: 'c7', sourceId: 'api-1', targetId: 'msg-1', type: 'websocket', label: 'Real-time Messages', animated: true },
          { id: 'c8', sourceId: 'post-1', targetId: 'media-1', type: 'api_call', label: 'Media Processing', animated: true },
          { id: 'c9', sourceId: 'user-1', targetId: 'db-users', type: 'database_query', label: 'User Data', animated: false },
          { id: 'c10', sourceId: 'post-1', targetId: 'db-posts', type: 'database_query', label: 'Posts Data', animated: false },
          { id: 'c11', sourceId: 'feed-1', targetId: 'db-graph', type: 'database_query', label: 'Social Graph', animated: false },
          { id: 'c12', sourceId: 'media-1', targetId: 'storage-1', type: 'file_upload', label: 'Media Upload', animated: false },
          { id: 'c13', sourceId: 'user-1', targetId: 'cache-1', type: 'cache_access', label: 'User Cache', animated: true },
          { id: 'c14', sourceId: 'feed-1', targetId: 'cache-2', type: 'cache_access', label: 'Feed Cache', animated: true },
          { id: 'c15', sourceId: 'post-1', targetId: 'search-1', type: 'data_flow', label: 'Index Posts', animated: true },
          { id: 'c16', sourceId: 'post-1', targetId: 'queue-1', type: 'message_publish', label: 'Post Events', animated: true },
          { id: 'c17', sourceId: 'queue-1', targetId: 'analytics-1', type: 'data_flow', label: 'Analytics Stream', animated: true },
          { id: 'c18', sourceId: 'monitor-1', targetId: 'api-1', type: 'log_write', label: 'System Metrics', animated: false }
        ]
      },
      'default': {
        name: 'Complex Distributed System Architecture',
        description: 'Enterprise-grade distributed system with advanced patterns, monitoring, and security',
        components: [
          { id: 'lb-1', type: 'load_balancer', name: 'Load Balancer', x: 200, y: 50, width: 140, height: 70, color: '#00d4ff', properties: { algorithm: 'least-connections', health_check: true } },
          { id: 'api-1', type: 'api_gateway', name: 'API Gateway', x: 400, y: 50, width: 140, height: 70, color: '#8b5cf6', properties: { rate_limiting: true, cors: true } },
          { id: 'auth-1', type: 'auth_service', name: 'Auth Service', x: 50, y: 180, width: 120, height: 80, color: '#dc2626', properties: { type: 'JWT', timeout: '30min' } },
          { id: 'service-1', type: 'microservice', name: 'Core Service', x: 200, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Go', replicas: 3 } },
          { id: 'service-2', type: 'microservice', name: 'Data Service', x: 350, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Python', replicas: 5 } },
          { id: 'service-3', type: 'microservice', name: 'Business Service', x: 500, y: 180, width: 120, height: 80, color: '#ff6b35', properties: { language: 'Java', replicas: 4 } },
          { id: 'cache-1', type: 'cache', name: 'Redis Cache', x: 650, y: 180, width: 120, height: 60, color: '#dc382d', properties: { type: 'Redis', memory: '8GB' } },
          { id: 'queue-1', type: 'message_queue', name: 'Message Queue', x: 350, y: 320, width: 140, height: 60, color: '#10b981', properties: { type: 'RabbitMQ', durability: true } },
          { id: 'db-1', type: 'database', name: 'Primary Database', x: 100, y: 400, width: 130, height: 60, color: '#336791', properties: { engine: 'PostgreSQL', replication: true } },
          { id: 'db-2', type: 'database', name: 'Analytics DB', x: 300, y: 400, width: 130, height: 60, color: '#336791', properties: { engine: 'ClickHouse', columnar: true } },
          { id: 'search-1', type: 'search_engine', name: 'Search Engine', x: 500, y: 400, width: 140, height: 60, color: '#f59e0b', properties: { engine: 'Elasticsearch', indices: 5 } },
          { id: 'monitor-1', type: 'monitoring', name: 'Monitoring', x: 700, y: 400, width: 120, height: 60, color: '#06b6d4', properties: { tool: 'Prometheus', alerts: true } }
        ],
        connections: [
          { id: 'c1', sourceId: 'lb-1', targetId: 'api-1', type: 'http_request', label: 'Load Balance', animated: true },
          { id: 'c2', sourceId: 'api-1', targetId: 'auth-1', type: 'auth_check', label: 'Authenticate', animated: true },
          { id: 'c3', sourceId: 'api-1', targetId: 'service-1', type: 'api_call', label: 'Core API', animated: true },
          { id: 'c4', sourceId: 'api-1', targetId: 'service-2', type: 'api_call', label: 'Data API', animated: true },
          { id: 'c5', sourceId: 'api-1', targetId: 'service-3', type: 'api_call', label: 'Business API', animated: true },
          { id: 'c6', sourceId: 'service-1', targetId: 'db-1', type: 'database_query', label: 'Primary Data', animated: false },
          { id: 'c7', sourceId: 'service-2', targetId: 'db-2', type: 'database_query', label: 'Analytics', animated: false },
          { id: 'c8', sourceId: 'service-2', targetId: 'cache-1', type: 'cache_access', label: 'Cache Access', animated: true },
          { id: 'c9', sourceId: 'service-3', targetId: 'search-1', type: 'data_flow', label: 'Search Index', animated: true },
          { id: 'c10', sourceId: 'service-1', targetId: 'queue-1', type: 'message_publish', label: 'Events', animated: true },
          { id: 'c11', sourceId: 'monitor-1', targetId: 'api-1', type: 'log_write', label: 'Metrics', animated: false }
        ]
      }
    };

    // Add artificial delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Determine design type based on prompt
    let designType = 'default';
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('ecommerce') || promptLower.includes('e-commerce') || promptLower.includes('shop') || promptLower.includes('store')) {
      designType = 'e-commerce';
    } else if (promptLower.includes('social') || promptLower.includes('media') || promptLower.includes('chat') || promptLower.includes('messaging')) {
      designType = 'social-media';
    }

    const design = mockDesigns[designType];
    
    return {
      success: true,
      data: {
        ...design,
        prompt,
        complexity,
        generatedAt: new Date().toISOString(),
        canvasData: {
          zoom: 1,
          pan: { x: 0, y: 0 }
        }
      }
    };
  }

  // Get design templates with enhanced data
  async getTemplates() {
    try {
      // Enhanced default templates with more variety
      const defaultTemplates = [
        {
          id: 'template-microservices-ecommerce',
          name: 'Microservices E-Commerce Platform',
          description: 'Complete e-commerce platform with microservices architecture, caching, and real-time analytics',
          category: 'e-commerce',
          difficulty_level: 5,
          usage_count: 342,
          tags: ['microservices', 'e-commerce', 'scalable', 'production'],
          template_data: {
            components: [
              { id: 'lb1', type: 'load_balancer', name: 'Load Balancer', x: 100, y: 50, width: 140, height: 70, color: '#00d4ff' },
              { id: 'api1', type: 'api_gateway', name: 'API Gateway', x: 300, y: 50, width: 140, height: 70, color: '#8b5cf6' },
              { id: 'user1', type: 'microservice', name: 'User Service', x: 100, y: 180, width: 120, height: 80, color: '#ff6b35' },
              { id: 'product1', type: 'microservice', name: 'Product Service', x: 250, y: 180, width: 120, height: 80, color: '#ff6b35' },
              { id: 'order1', type: 'microservice', name: 'Order Service', x: 400, y: 180, width: 120, height: 80, color: '#ff6b35' },
              { id: 'payment1', type: 'microservice', name: 'Payment Service', x: 550, y: 180, width: 120, height: 80, color: '#ff6b35' },
              { id: 'cache1', type: 'cache', name: 'Redis Cache', x: 325, y: 280, width: 120, height: 60, color: '#dc382d' },
              { id: 'db1', type: 'database', name: 'User Database', x: 100, y: 380, width: 120, height: 60, color: '#336791' },
              { id: 'db2', type: 'database', name: 'Product DB', x: 250, y: 380, width: 120, height: 60, color: '#336791' },
              { id: 'db3', type: 'database', name: 'Order Database', x: 400, y: 380, width: 120, height: 60, color: '#336791' }
            ],
            connections: [
              { id: 'c1', sourceId: 'lb1', targetId: 'api1', type: 'http_request', label: 'HTTP', animated: true },
              { id: 'c2', sourceId: 'api1', targetId: 'user1', type: 'api_call', label: 'User API', animated: true },
              { id: 'c3', sourceId: 'api1', targetId: 'product1', type: 'api_call', label: 'Product API', animated: true },
              { id: 'c4', sourceId: 'api1', targetId: 'order1', type: 'api_call', label: 'Order API', animated: true },
              { id: 'c5', sourceId: 'order1', targetId: 'payment1', type: 'api_call', label: 'Payment', animated: true },
              { id: 'c6', sourceId: 'product1', targetId: 'cache1', type: 'cache_access', label: 'Cache', animated: true },
              { id: 'c7', sourceId: 'user1', targetId: 'db1', type: 'database_query', label: 'User Data', animated: false },
              { id: 'c8', sourceId: 'product1', targetId: 'db2', type: 'database_query', label: 'Product Data', animated: false },
              { id: 'c9', sourceId: 'order1', targetId: 'db3', type: 'database_query', label: 'Order Data', animated: false }
            ]
          }
        },
        {
          id: 'template-realtime-chat',
          name: 'Real-time Chat & Messaging Platform',
          description: 'Scalable real-time messaging platform with WebSocket support and message queuing',
          category: 'messaging',
          difficulty_level: 4,
          usage_count: 178,
          tags: ['real-time', 'websocket', 'messaging', 'scalable'],
          template_data: {
            components: [
              { id: 'ws1', type: 'api_gateway', name: 'WebSocket Gateway', x: 200, y: 100, width: 140, height: 70, color: '#8b5cf6' },
              { id: 'msg1', type: 'microservice', name: 'Message Service', x: 150, y: 220, width: 120, height: 80, color: '#ff6b35' },
              { id: 'user1', type: 'microservice', name: 'User Service', x: 300, y: 220, width: 120, height: 80, color: '#ff6b35' },
              { id: 'presence1', type: 'microservice', name: 'Presence Service', x: 450, y: 220, width: 120, height: 80, color: '#ff6b35' },
              { id: 'cache1', type: 'cache', name: 'Redis Cache', x: 325, y: 340, width: 120, height: 60, color: '#dc382d' },
              { id: 'queue1', type: 'message_queue', name: 'Message Queue', x: 150, y: 340, width: 140, height: 60, color: '#10b981' },
              { id: 'db1', type: 'database', name: 'Message DB', x: 200, y: 460, width: 120, height: 60, color: '#336791' },
              { id: 'db2', type: 'database', name: 'User Database', x: 350, y: 460, width: 120, height: 60, color: '#336791' }
            ],
            connections: [
              { id: 'c1', sourceId: 'ws1', targetId: 'msg1', type: 'websocket', label: 'WebSocket', animated: true },
              { id: 'c2', sourceId: 'ws1', targetId: 'user1', type: 'api_call', label: 'User API', animated: true },
              { id: 'c3', sourceId: 'ws1', targetId: 'presence1', type: 'websocket', label: 'Presence', animated: true },
              { id: 'c4', sourceId: 'msg1', targetId: 'queue1', type: 'message_publish', label: 'Queue Messages', animated: true },
              { id: 'c5', sourceId: 'presence1', targetId: 'cache1', type: 'cache_access', label: 'Status Cache', animated: true },
              { id: 'c6', sourceId: 'msg1', targetId: 'db1', type: 'database_query', label: 'Message Store', animated: false },
              { id: 'c7', sourceId: 'user1', targetId: 'db2', type: 'database_query', label: 'User Data', animated: false }
            ]
          }
        },
        {
          id: 'template-data-pipeline',
          name: 'Big Data Processing Pipeline',
          description: 'Enterprise data processing pipeline with real-time analytics and machine learning',
          category: 'data-processing',
          difficulty_level: 5,
          usage_count: 156,
          tags: ['big-data', 'analytics', 'ml', 'streaming'],
          template_data: {
            components: [
              { id: 'api1', type: 'api_gateway', name: 'Data API', x: 100, y: 100, width: 140, height: 70, color: '#8b5cf6' },
              { id: 'ingestion1', type: 'microservice', name: 'Data Ingestion', x: 300, y: 100, width: 120, height: 80, color: '#ff6b35' },
              { id: 'processor1', type: 'microservice', name: 'Stream Processor', x: 450, y: 100, width: 120, height: 80, color: '#ff6b35' },
              { id: 'ml1', type: 'microservice', name: 'ML Pipeline', x: 600, y: 100, width: 120, height: 80, color: '#ff6b35' },
              { id: 'queue1', type: 'message_queue', name: 'Kafka Stream', x: 300, y: 220, width: 140, height: 60, color: '#10b981' },
              { id: 'cache1', type: 'cache', name: 'Redis Cache', x: 450, y: 220, width: 120, height: 60, color: '#dc382d' },
              { id: 'warehouse1', type: 'database', name: 'Data Warehouse', x: 150, y: 340, width: 140, height: 60, color: '#336791' },
              { id: 'lake1', type: 'storage', name: 'Data Lake', x: 350, y: 340, width: 120, height: 60, color: '#336791' },
              { id: 'analytics1', type: 'analytics', name: 'Analytics Engine', x: 550, y: 340, width: 140, height: 60, color: '#06b6d4' }
            ],
            connections: [
              { id: 'c1', sourceId: 'api1', targetId: 'ingestion1', type: 'api_call', label: 'Data Input', animated: true },
              { id: 'c2', sourceId: 'ingestion1', targetId: 'queue1', type: 'message_publish', label: 'Stream Data', animated: true },
              { id: 'c3', sourceId: 'queue1', targetId: 'processor1', type: 'data_flow', label: 'Process Stream', animated: true },
              { id: 'c4', sourceId: 'processor1', targetId: 'ml1', type: 'api_call', label: 'ML Inference', animated: true },
              { id: 'c5', sourceId: 'processor1', targetId: 'cache1', type: 'cache_access', label: 'Cache Results', animated: true },
              { id: 'c6', sourceId: 'ingestion1', targetId: 'lake1', type: 'file_upload', label: 'Raw Data', animated: false },
              { id: 'c7', sourceId: 'processor1', targetId: 'warehouse1', type: 'database_query', label: 'Processed Data', animated: false },
              { id: 'c8', sourceId: 'warehouse1', targetId: 'analytics1', type: 'data_flow', label: 'Analytics', animated: true }
            ]
          }
        }
      ];

      // Try to get templates from database first
      const { data, error } = await supabase
        .from('design_templates')
        .select('*')
        .eq('is_featured', true)
        .order('usage_count', { ascending: false });

      if (error && !error.message.includes('Failed to fetch')) {
        console.warn('Database template fetch failed:', error.message);
      }

      // Combine database templates with defaults
      const allTemplates = [...defaultTemplates, ...(data || [])];
      
      return { success: true, data: allTemplates };
    } catch (error) {
      console.warn('Template loading error:', error);
      return { success: false, error: 'Failed to load templates, using defaults' };
    }
  }

  // Save template with enhanced metadata
  async saveTemplate(templateData) {
    try {
      const templateRecord = {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category || 'general',
        difficulty_level: templateData.difficulty || 3,
        template_data: templateData.data,
        tags: templateData.tags || [],
        is_featured: false,
        usage_count: 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('design_templates')
        .insert(templateRecord)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to save template' };
    }
  }

  // Apply template to canvas with usage tracking
  async applyTemplate(templateId) {
    try {
      const { data, error } = await supabase
        .from('design_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Increment usage count asynchronously
      supabase
        .from('design_templates')
        .update({ usage_count: (data.usage_count || 0) + 1 })
        .eq('id', templateId)
        .then(() => console.log('Template usage count updated'));

      return { success: true, data: data.template_data };
    } catch (error) {
      return { success: false, error: 'Failed to apply template' };
    }
  }

  // Refine existing design with AI
  async refineDesign(currentDesign, refinementPrompt) {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        console.warn('OpenAI API key not configured for refinement');
        return { success: false, error: 'AI refinement not available' };
      }

      const systemPrompt = `You are a system architecture expert. Refine the existing system design based on the user's feedback. 
      
      Current Design: ${JSON.stringify(currentDesign, null, 2)}
      
      Apply the requested changes while maintaining system coherence. Return the complete refined design in the same JSON format.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please refine the design with these changes: ${refinementPrompt}` },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'refined_system_design',
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                components: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string' },
                      name: { type: 'string' },
                      x: { type: 'number' },
                      y: { type: 'number' },
                      width: { type: 'number' },
                      height: { type: 'number' },
                      color: { type: 'string' },
                      properties: { type: 'object' }
                    },
                    required: ['id', 'type', 'name', 'x', 'y', 'width', 'height', 'color']
                  }
                },
                connections: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      sourceId: { type: 'string' },
                      targetId: { type: 'string' },
                      type: { type: 'string' },
                      label: { type: 'string' },
                      animated: { type: 'boolean' }
                    },
                    required: ['id', 'sourceId', 'targetId', 'type', 'label']
                  }
                }
              },
              required: ['name', 'description', 'components', 'connections'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.7,
        max_tokens: 3000,
      });

      const refinedDesign = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        data: {
          ...refinedDesign,
          refinedAt: new Date().toISOString(),
          originalPrompt: currentDesign.prompt,
          refinementPrompt
        }
      };
    } catch (error) {
      console.error('Design refinement error:', error);
      return { success: false, error: 'Failed to refine design with AI' };
    }
  }
}

export default new AIService();