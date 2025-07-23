import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ComponentPreviewModal = ({ component, isOpen, onClose, onAddToCanvas }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !component) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'usage', label: 'Usage Guide', icon: 'BookOpen' },
    { id: 'examples', label: 'Examples', icon: 'Code' },
    { id: 'reviews', label: 'Reviews', icon: 'MessageSquare' }
  ];

  const usageExamples = [
    {
      title: "Basic Implementation",
      code: `// Basic Redis cache setup
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryDelayOnFailover: 100
});

// Cache user data
await redis.set('user:123', JSON.stringify(userData), 'EX', 3600);`
    },
    {
      title: "Advanced Configuration",
      code: `// Redis cluster configuration
const cluster = new Redis.Cluster([
  { host: '127.0.0.1', port: 7000 },
  { host: '127.0.0.1', port: 7001 },
  { host: '127.0.0.1', port: 7002 }
], {
  redisOptions: {
    password: 'your-password'
  }
});`
    }
  ];

  const reviews = [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      rating: 5,
      comment: "Excellent component with clear documentation. Used it in my Netflix system design and got great feedback!",
      date: "2 days ago"
    },
    {
      id: 2,
      user: "Mike Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      rating: 4,
      comment: "Very helpful for understanding Redis implementation patterns. The examples are spot-on.",
      date: "1 week ago"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Database" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{component.name}</h2>
              <p className="text-muted-foreground">{component.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              onClick={() => onAddToCanvas(component)}
              iconName="Plus"
              iconPosition="left"
            >
              Add to Canvas
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Preview Image */}
              <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={component.preview}
                  alt={component.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{component.description}</p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {component.features?.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon name="Check" size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{component.downloads}</div>
                  <div className="text-sm text-muted-foreground">Downloads</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{component.rating}</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{component.difficulty}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {component.creator.name.split(' ')[0]}
                  </div>
                  <div className="text-sm text-muted-foreground">Creator</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Implementation Guide</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground mb-4">
                    This component is commonly used in high-scale applications for caching frequently accessed data. 
                    It's particularly effective in scenarios where you need sub-millisecond response times.
                  </p>
                  
                  <h4 className="text-foreground font-semibold mb-2">When to Use:</h4>
                  <ul className="text-muted-foreground space-y-1 mb-4">
                    <li>• Session storage for user authentication</li>
                    <li>• Caching database query results</li>
                    <li>• Real-time leaderboards and counters</li>
                    <li>• Pub/Sub messaging patterns</li>
                  </ul>

                  <h4 className="text-foreground font-semibold mb-2">Scalability Considerations:</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Memory usage grows with data size</li>
                    <li>• Consider Redis Cluster for horizontal scaling</li>
                    <li>• Implement proper eviction policies</li>
                    <li>• Monitor memory fragmentation</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              {usageExamples.map((example, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{example.title}</h3>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-foreground">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Image
                      src={review.avatar}
                      alt={review.user}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-foreground">{review.user}</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={14}
                              className={i < review.rating ? 'text-yellow-400' : 'text-muted-foreground'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentPreviewModal;