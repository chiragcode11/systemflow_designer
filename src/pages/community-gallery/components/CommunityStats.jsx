import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityStats = () => {
  const stats = [
    {
      icon: 'Users',
      value: '50,000+',
      label: 'Active Engineers',
      description: 'Learning and sharing knowledge',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: 'FileText',
      value: '2,847',
      label: 'System Designs',
      description: 'Shared by the community',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      icon: 'Trophy',
      value: '89%',
      label: 'Interview Success',
      description: 'Rate for active users',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: 'Building',
      value: '500+',
      label: 'Companies',
      description: 'Where our users work',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      icon: 'GitFork',
      value: '12,450',
      label: 'Design Forks',
      description: 'Templates reused',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      icon: 'MessageCircle',
      value: '25,600',
      label: 'Comments',
      description: 'Knowledge shared',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  const achievements = [
    {
      title: "Most Forked Design",
      value: "Netflix Architecture",
      author: "Sarah Chen",
      count: "1,247 forks"
    },
    {
      title: "Highest Rated",
      value: "Uber Real-time System",
      author: "David Kim",
      count: "4.9/5 stars"
    },
    {
      title: "Most Viewed",
      value: "WhatsApp Chat System",
      author: "Alex Rodriguez",
      count: "45.2k views"
    },
    {
      title: "Interview Champion",
      value: "Payment Gateway Design",
      author: "Priya Sharma",
      count: "23 job offers"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-muted/30 to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Community Impact & Growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our thriving community of engineers is transforming careers and building the future of system design education. 
            Here's the impact we're making together.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border border-border p-6 text-center hover:border-primary/20 transition-all duration-200 group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon name={stat.icon} size={24} className={stat.color} />
              </div>
              
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              
              <div className="text-sm font-medium text-foreground mb-1">
                {stat.label}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-card rounded-xl border border-border p-8">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">
            Community Achievements
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="text-sm text-primary font-medium mb-2">
                  {achievement.title}
                </div>
                
                <div className="text-lg font-bold text-foreground mb-1">
                  {achievement.value}
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  by {achievement.author}
                </div>
                
                <div className="text-xs text-accent font-medium">
                  {achievement.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Timeline */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-foreground mb-8 text-center">
            Community Growth Timeline
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-border" />
            
            <div className="space-y-8">
              {[
                {
                  date: "Jan 2024",
                  title: "Platform Launch",
                  description: "SystemFlow Designer goes live with 100 founding members",
                  stats: "100 users, 25 designs"
                },
                {
                  date: "Mar 2024",
                  title: "First Success Stories",
                  description: "Community members start landing FAANG interviews",
                  stats: "1,000 users, 200 designs"
                },
                {
                  date: "Jun 2024",
                  title: "Template Marketplace",
                  description: "Reusable design templates become available",
                  stats: "10,000 users, 800 designs"
                },
                {
                  date: "Dec 2024",
                  title: "50K Milestone",
                  description: "Reached 50,000 active engineers worldwide",
                  stats: "50,000 users, 2,847 designs"
                }
              ].map((milestone, index) => (
                <div key={index} className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    {index % 2 === 0 && (
                      <div>
                        <div className="text-sm text-primary font-medium">{milestone.date}</div>
                        <div className="text-lg font-bold text-foreground">{milestone.title}</div>
                        <div className="text-sm text-muted-foreground">{milestone.description}</div>
                        <div className="text-xs text-accent font-medium mt-1">{milestone.stats}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-background relative z-10" />
                  
                  <div className="flex-1 text-left pl-8">
                    {index % 2 === 1 && (
                      <div>
                        <div className="text-sm text-primary font-medium">{milestone.date}</div>
                        <div className="text-lg font-bold text-foreground">{milestone.title}</div>
                        <div className="text-sm text-muted-foreground">{milestone.description}</div>
                        <div className="text-xs text-accent font-medium mt-1">{milestone.stats}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;