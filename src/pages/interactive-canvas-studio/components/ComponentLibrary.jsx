import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ComponentLibrary = ({ onAddComponent, searchQuery, onSearchChange }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');

  const categories = [
    { id: 'all', name: 'All', icon: 'Grid3X3' },
    { id: 'infrastructure', name: 'Infrastructure', icon: 'Server' },
    { id: 'api', name: 'API & Services', icon: 'Globe' },
    { id: 'database', name: 'Databases', icon: 'Database' },
    { id: 'cache', name: 'Caching', icon: 'Zap' },
    { id: 'messaging', name: 'Messaging', icon: 'MessageSquare' },
    { id: 'security', name: 'Security', icon: 'Shield' },
    { id: 'monitoring', name: 'Monitoring', icon: 'Activity' },
    { id: 'custom', name: 'Custom', icon: 'Plus' }
  ];

  // Enhanced component library with more complex components
  const components = [
    // Infrastructure
    { id: 'lb1', name: 'Load Balancer', type: 'load_balancer', category: 'infrastructure', icon: 'Zap', color: '#00d4ff', description: 'Distribute traffic across servers', properties: { algorithm: 'round-robin', healthCheck: true } },
    { id: 'cdn1', name: 'CDN', type: 'cdn', category: 'infrastructure', icon: 'Globe', color: '#ff9500', description: 'Content delivery network', properties: { provider: 'CloudFlare', caching: true } },
    { id: 'proxy1', name: 'Reverse Proxy', type: 'proxy', category: 'infrastructure', icon: 'ArrowRightLeft', color: '#8b5cf6', description: 'Reverse proxy server', properties: { ssl: true, compression: true } },
    
    // API & Services
    { id: 'api1', name: 'API Gateway', type: 'api_gateway', category: 'api', icon: 'Globe', color: '#8b5cf6', description: 'API management gateway', properties: { rateLimiting: true, authentication: 'JWT' } },
    { id: 'rest1', name: 'REST API', type: 'api', category: 'api', icon: 'Code', color: '#10b981', description: 'RESTful web service', properties: { version: 'v1', format: 'JSON' } },
    { id: 'graphql1', name: 'GraphQL API', type: 'graphql', category: 'api', icon: 'Layers', color: '#e91e63', description: 'GraphQL endpoint', properties: { schema: 'dynamic', subscriptions: true } },
    { id: 'webhook1', name: 'Webhook', type: 'webhook', category: 'api', icon: 'Webhook', color: '#ff6b35', description: 'HTTP callback endpoint', properties: { retry: true, security: 'HMAC' } },
    
    // Microservices
    { id: 'user-service', name: 'User Service', type: 'microservice', category: 'api', icon: 'Users', color: '#ff6b35', description: 'User management service', properties: { framework: 'Node.js', replicas: 3 } },
    { id: 'order-service', name: 'Order Service', type: 'microservice', category: 'api', icon: 'ShoppingCart', color: '#ff6b35', description: 'Order processing service', properties: { framework: 'Java', replicas: 5 } },
    { id: 'payment-service', name: 'Payment Service', type: 'microservice', category: 'api', icon: 'CreditCard', color: '#ff6b35', description: 'Payment processing service', properties: { framework: 'Python', replicas: 4 } },
    { id: 'notification-service', name: 'Notification Service', type: 'notification_service', category: 'api', icon: 'Bell', color: '#ff6b35', description: 'Send notifications', properties: { channels: ['email', 'sms', 'push'] } },
    
    // Databases
    { id: 'postgres', name: 'PostgreSQL', type: 'database', category: 'database', icon: 'Database', color: '#336791', description: 'Relational database', properties: { engine: 'PostgreSQL', replication: true } },
    { id: 'mysql', name: 'MySQL', type: 'database', category: 'database', icon: 'Database', color: '#4479a1', description: 'Relational database', properties: { engine: 'MySQL', clustering: true } },
    { id: 'mongodb', name: 'MongoDB', type: 'database', category: 'database', icon: 'Database', color: '#47a248', description: 'Document database', properties: { engine: 'MongoDB', sharding: true } },
    { id: 'cassandra', name: 'Cassandra', type: 'database', category: 'database', icon: 'Database', color: '#1287b1', description: 'Wide-column database', properties: { engine: 'Cassandra', consistency: 'eventual' } },
    { id: 'elasticsearch', name: 'Elasticsearch', type: 'search_engine', category: 'database', icon: 'Search', color: '#f8bf1c', description: 'Search and analytics engine', properties: { indexing: true, clustering: true } },
    
    // Caching
    { id: 'redis', name: 'Redis Cache', type: 'cache', category: 'cache', icon: 'Zap', color: '#dc382d', description: 'In-memory cache', properties: { type: 'Redis', persistence: true } },
    { id: 'memcached', name: 'Memcached', type: 'cache', category: 'cache', icon: 'Zap', color: '#blue', description: 'Memory caching system', properties: { type: 'Memcached', distributed: true } },
    { id: 'varnish', name: 'Varnish Cache', type: 'cache', category: 'cache', icon: 'Zap', color: '#00a8cc', description: 'HTTP accelerator', properties: { type: 'HTTP', ttl: '1h' } },
    
    // Messaging
    { id: 'rabbitmq', name: 'RabbitMQ', type: 'message_queue', category: 'messaging', icon: 'MessageSquare', color: '#ff6600', description: 'Message broker', properties: { type: 'RabbitMQ', durability: true } },
    { id: 'kafka', name: 'Apache Kafka', type: 'message_queue', category: 'messaging', icon: 'MessageSquare', color: '#231f20', description: 'Event streaming platform', properties: { type: 'Kafka', partitions: 12 } },
    { id: 'sqs', name: 'AWS SQS', type: 'message_queue', category: 'messaging', icon: 'MessageSquare', color: '#ff9900', description: 'Managed message queue', properties: { type: 'SQS', fifo: true } },
    { id: 'pubsub', name: 'Pub/Sub', type: 'pubsub', category: 'messaging', icon: 'Radio', color: '#4285f4', description: 'Publish/Subscribe messaging', properties: { topics: true, streaming: true } },
    
    // Security
    { id: 'auth', name: 'Auth Service', type: 'auth_service', category: 'security', icon: 'Shield', color: '#dc2626', description: 'Authentication service', properties: { provider: 'OAuth2', mfa: true } },
    { id: 'firewall', name: 'Firewall', type: 'firewall', category: 'security', icon: 'Shield', color: '#dc2626', description: 'Network firewall', properties: { rules: 100, logging: true } },
    { id: 'waf', name: 'Web Application Firewall', type: 'waf', category: 'security', icon: 'ShieldCheck', color: '#dc2626', description: 'Web application protection', properties: { rules: 'OWASP', ddos: true } },
    
    // Monitoring
    { id: 'prometheus', name: 'Prometheus', type: 'monitoring', category: 'monitoring', icon: 'Activity', color: '#e6522c', description: 'Monitoring system', properties: { tool: 'Prometheus', alerting: true } },
    { id: 'grafana', name: 'Grafana', type: 'monitoring', category: 'monitoring', icon: 'BarChart', color: '#f46800', description: 'Analytics platform', properties: { dashboards: true, alerts: true } },
    { id: 'elk', name: 'ELK Stack', type: 'logging', category: 'monitoring', icon: 'FileText', color: '#005571', description: 'Logging and analytics', properties: { elasticsearch: true, kibana: true } },
    { id: 'jaeger', name: 'Jaeger', type: 'tracing', category: 'monitoring', icon: 'GitBranch', color: '#60d0e4', description: 'Distributed tracing', properties: { sampling: '1%', storage: 'Cassandra' } },
    
    // Storage
    { id: 's3', name: 'Object Storage', type: 'storage', category: 'infrastructure', icon: 'HardDrive', color: '#ff9900', description: 'Object storage service', properties: { type: 'S3', encryption: true } },
    { id: 'nfs', name: 'Network File System', type: 'storage', category: 'infrastructure', icon: 'Folder', color: '#0066cc', description: 'Shared file storage', properties: { protocol: 'NFS', backup: true } },
    
    // Analytics
    { id: 'analytics', name: 'Analytics Engine', type: 'analytics', category: 'monitoring', icon: 'TrendingUp', color: '#8b5cf6', description: 'Data analytics platform', properties: { realtime: true, ml: true } },
    { id: 'data-warehouse', name: 'Data Warehouse', type: 'data_warehouse', category: 'database', icon: 'Warehouse', color: '#059669', description: 'Analytical data store', properties: { engine: 'Snowflake', compression: true } }
  ];

  const filteredComponents = components.filter(component => {
    const matchesCategory = activeCategory === 'all' || component.category === activeCategory;
    const matchesSearch = !searchTerm || 
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddComponent = (component) => {
    onAddComponent?.(component);
  };

  const handleCreateCustomComponent = () => {
    const customComponent = {
      id: `custom-${Date.now()}`,
      name: 'Custom Component',
      type: 'custom',
      category: 'custom',
      icon: 'Box',
      color: '#6b7280',
      description: 'Custom component',
      properties: { customizable: true }
    };
    onAddComponent?.(customComponent);
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Package" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Component Library</h3>
        </div>
        
        {/* Search */}
        <Input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearchChange?.(e.target.value);
          }}
          className="w-full"
        />
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Icon name={category.icon} size={14} />
              <span className="truncate">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredComponents.length > 0 ? (
          <div className="space-y-2">
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                onClick={() => handleAddComponent(component)}
                className="group flex items-center space-x-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-sm"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${component.color}20` }}
                >
                  <Icon 
                    name={component.icon} 
                    size={16} 
                    style={{ color: component.color }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                    {component.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {component.description}
                  </p>
                </div>
                
                <Icon 
                  name="Plus" 
                  size={14} 
                  className="text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200" 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No components found</p>
            {searchTerm && (
              <p className="text-muted-foreground text-xs mt-1">
                Try adjusting your search term
              </p>
            )}
          </div>
        )}

        {/* Create Custom Component */}
        {activeCategory === 'custom' && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              fullWidth
              iconName="Plus"
              iconPosition="left"
              onClick={handleCreateCustomComponent}
            >
              Create Custom Component
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} available
        </div>
        <div className="text-xs text-muted-foreground text-center mt-1">
          Drag to canvas or click to add
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;