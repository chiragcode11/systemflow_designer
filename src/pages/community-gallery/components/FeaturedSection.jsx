import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedSection = () => {
  const featuredDesigns = [
    {
      id: 1,
      title: "Netflix-Scale Video Streaming Architecture",
      description: "Complete microservices architecture for a video streaming platform handling 200M+ users with global CDN distribution, real-time recommendations, and fault-tolerant design.",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
      creator: {
        name: "Sarah Chen",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        title: "Senior Software Architect at Netflix",
        company: "Netflix"
      },
      stats: {
        views: 45200,
        likes: 1847,
        forks: 234,
        rating: 4.9
      },
      badges: ["Interview Winner", "Featured", "Template"],
      tags: ["Microservices", "CDN", "Real-time", "Scalability"],
      interviewSuccess: "Led to 12 job offers including FAANG companies"
    },
    {
      id: 2,
      title: "Distributed Chat System with 10M Concurrent Users",
      description: "Real-time messaging architecture supporting millions of concurrent connections using WebSocket clusters, message queues, and horizontal scaling patterns.",
      thumbnail: "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?w=800&h=400&fit=crop",
      creator: {
        name: "Alex Rodriguez",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        title: "Principal Engineer at WhatsApp",
        company: "Meta"
      },
      stats: {
        views: 38900,
        likes: 1523,
        forks: 189,
        rating: 4.8
      },
      badges: ["Interview Winner", "Innovative Solution"],
      tags: ["WebSocket", "Message Queue", "Real-time", "Distributed"],
      interviewSuccess: "Helped 8 engineers land senior positions"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exceptional designs that have helped community members land their dream jobs 
            and solve real-world architectural challenges.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {featuredDesigns.map((design) => (
            <div
              key={design.id}
              className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 group cursor-pointer"
            >
              {/* Hero Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={design.thumbnail}
                  alt={design.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay with badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {design.badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm ${
                        badge === 'Interview Winner' ? 'bg-accent text-white' :
                        badge === 'Featured' ? 'bg-primary text-white' :
                        badge === 'Template'? 'bg-secondary text-white' : 'bg-black/50 text-white'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Stats overlay */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-4 text-white text-sm">
                  <div className="flex items-center space-x-1 backdrop-blur-sm bg-black/30 px-2 py-1 rounded">
                    <Icon name="Eye" size={14} />
                    <span>{(design.stats.views/1000).toFixed(1)}k</span>
                  </div>
                  <div className="flex items-center space-x-1 backdrop-blur-sm bg-black/30 px-2 py-1 rounded">
                    <Icon name="Heart" size={14} />
                    <span>{design.stats.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 backdrop-blur-sm bg-black/30 px-2 py-1 rounded">
                    <Icon name="Star" size={14} />
                    <span>{design.stats.rating}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {design.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {design.description}
                </p>

                {/* Creator Info */}
                <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/30 rounded-lg">
                  <Image
                    src={design.creator.avatar}
                    alt={design.creator.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{design.creator.name}</div>
                    <div className="text-sm text-muted-foreground">{design.creator.title}</div>
                    <div className="text-xs text-primary font-medium">{design.creator.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-accent">Interview Success</div>
                    <div className="text-xs text-muted-foreground">{design.interviewSuccess}</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {design.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Icon name="Eye" size={16} />
                      <span className="ml-2">View Design</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="GitFork" size={16} />
                      <span className="ml-2">Fork ({design.stats.forks})</span>
                    </Button>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Icon name="Share" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="default" size="lg" className="brand-gradient">
            <Icon name="Plus" size={20} />
            <span className="ml-2">Submit Your Design</span>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Share your success story and help others learn
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;