import React from 'react';
import Icon from '../../../components/AppIcon';

const SuccessMetrics = () => {
  const metrics = [
    {
      id: 'accuracy',
      title: 'Generation Accuracy',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      description: 'AI-generated designs match expert expectations',
      icon: 'Target'
    },
    {
      id: 'satisfaction',
      title: 'User Satisfaction',
      value: '4.8/5',
      change: '+0.3',
      trend: 'up',
      description: 'Average rating from 12,000+ users',
      icon: 'Star'
    },
    {
      id: 'interview-success',
      title: 'Interview Success Rate',
      value: '87%',
      change: '+12%',
      trend: 'up',
      description: 'Users who practiced with our tool',
      icon: 'TrendingUp'
    },
    {
      id: 'time-saved',
      title: 'Time Saved',
      value: '3.2 hrs',
      change: '+0.8 hrs',
      trend: 'up',
      description: 'Average time saved per design session',
      icon: 'Clock'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      content: `The AI generator helped me visualize complex architectures instantly. Got my dream job at Google after practicing with SystemFlow Designer.`,
      rating: 5
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Senior Architect at Netflix',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      content: `From prompt to production-ready diagram in seconds. The AI understands system design patterns better than most humans.`,
      rating: 5
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Tech Lead at Stripe',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      content: `Revolutionary tool for system design interviews. The refinement controls let me adjust complexity perfectly for different scenarios.`,
      rating: 5
    }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={metric.icon} size={20} className="text-primary" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${getTrendColor(metric.trend)}`}>
                <Icon name={getTrendIcon(metric.trend)} size={16} />
                <span>{metric.change}</span>
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="text-sm font-medium text-foreground mt-1">{metric.title}</div>
              <div className="text-xs text-muted-foreground mt-2">{metric.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Stories */}
      <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Success Stories</h3>
          <p className="text-muted-foreground">Real outcomes from engineers who used our AI generator</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-background border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />
                ))}
              </div>

              <blockquote className="text-sm text-muted-foreground italic">
                "{testimonial.content}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-foreground mb-2">Platform Impact</h3>
          <p className="text-muted-foreground">Real-time statistics from our growing community</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">50K+</div>
            <div className="text-sm text-muted-foreground mt-1">Designs Generated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary">12K+</div>
            <div className="text-sm text-muted-foreground mt-1">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">95%</div>
            <div className="text-sm text-muted-foreground mt-1">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-orange">2.5M+</div>
            <div className="text-sm text-muted-foreground mt-1">Components Placed</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>System Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>AI Processing: 23 designs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={14} />
              <span>1,247 users online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMetrics;