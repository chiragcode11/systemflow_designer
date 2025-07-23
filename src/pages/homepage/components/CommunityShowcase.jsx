import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CommunityShowcase = () => {
  const [activeDesign, setActiveDesign] = useState(0);

  const featuredDesigns = [
    {
      id: 1,
      title: "Video Streaming Architecture",
      creator: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      company: "TechFlow Systems",
      difficulty: "Advanced",
      views: "12.5K",
      likes: "2.1K",
      components: 24,
      description: "Complete microservices architecture for global video streaming with CDN optimization and real-time analytics.",
      tags: ["Microservices", "CDN", "Real-time", "Scalability"],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      interviewSuccess: "94%"
    },
    {
      id: 2,
      title: "Real-time Messaging System",
      creator: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      company: "DataStream Inc",
      difficulty: "Intermediate",
      views: "8.7K",
      likes: "1.8K",
      components: 18,
      description: "End-to-end encrypted messaging system with real-time delivery and multi-device synchronization.",
      tags: ["Real-time", "Encryption", "WebSocket", "Mobile"],
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
      interviewSuccess: "89%"
    },
    {
      id: 3,
      title: "Geospatial Matching System",
      creator: "Maria Garcia",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      company: "LocationTech Solutions",
      difficulty: "Advanced",
      views: "15.2K",
      likes: "3.2K",
      components: 32,
      description: "Geospatial matching algorithm with real-time location tracking and dynamic optimization.",
      tags: ["Geospatial", "Real-time", "Algorithms", "Optimization"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      interviewSuccess: "91%"
    }
  ];

  const nextDesign = () => {
    setActiveDesign((prev) => (prev + 1) % featuredDesigns.length);
  };

  const prevDesign = () => {
    setActiveDesign((prev) => (prev - 1 + featuredDesigns.length) % featuredDesigns.length);
  };

  const currentDesign = featuredDesigns[activeDesign];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Learn from the
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore real system designs created by engineers from various tech companies. 
            Each design includes detailed explanations and interview insights.
          </p>
        </div>

        {/* Featured Design Carousel */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden glass-effect">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Design Preview */}
            <div className="relative">
              <Image 
                src={currentDesign.image}
                alt={currentDesign.title}
                className="w-full h-96 lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Navigation Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button variant="ghost" size="icon" onClick={prevDesign} className="bg-black/20 backdrop-blur-sm">
                  <Icon name="ChevronLeft" size={20} />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextDesign} className="bg-black/20 backdrop-blur-sm">
                  <Icon name="ChevronRight" size={20} />
                </Button>
              </div>

              {/* Design Stats Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="Eye" size={16} />
                      <span className="text-sm">{currentDesign.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Heart" size={16} />
                      <span className="text-sm">{currentDesign.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Package" size={16} />
                      <span className="text-sm">{currentDesign.components}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Details */}
            <div className="p-8">
              {/* Creator Info */}
              <div className="flex items-center space-x-4 mb-6">
                <Image 
                  src={currentDesign.avatar}
                  alt={currentDesign.creator}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-foreground">{currentDesign.creator}</div>
                  <div className="text-sm text-muted-foreground">Software Engineer at {currentDesign.company}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentDesign.difficulty === 'Advanced' ? 'bg-error/10 text-error' :
                  currentDesign.difficulty === 'Intermediate'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                }`}>
                  {currentDesign.difficulty}
                </div>
              </div>

              {/* Design Title & Description */}
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {currentDesign.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {currentDesign.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentDesign.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-muted/50 text-muted-foreground text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Success Rate */}
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Icon name="TrendingUp" size={20} className="text-success" />
                  <div>
                    <div className="font-semibold text-success">{currentDesign.interviewSuccess} Interview Success Rate</div>
                    <div className="text-sm text-muted-foreground">Based on community feedback</div>
                  </div>
                </div>
              </div>

              {/* Actions - Only View Design Button */}
              <div className="flex justify-center">
                <Link to="/community-gallery" className="w-full">
                  <Button variant="default" className="w-full brand-gradient">
                    <Icon name="ExternalLink" size={16} />
                    View Design
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Design Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {featuredDesigns.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveDesign(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeDesign ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Community Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-primary mb-2">2,500+</div>
            <div className="text-sm text-muted-foreground">Community Designs</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-secondary mb-2">850+</div>
            <div className="text-sm text-muted-foreground">Active Contributors</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-accent mb-2">92%</div>
            <div className="text-sm text-muted-foreground">Avg Success Rate</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-warning mb-2">150+</div>
            <div className="text-sm text-muted-foreground">Companies Represented</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityShowcase;