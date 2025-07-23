import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeDataFlow, setActiveDataFlow] = useState(0);

  const prompts = [
    "Design Netflix\'s video streaming architecture",
    "Build a scalable chat application like WhatsApp", 
    "Create an e-commerce platform like Amazon",
    "Design a ride-sharing system like Uber"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPrompt((prev) => (prev + 1) % prompts.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Enhanced data flow animation cycle
  useEffect(() => {
    const flowInterval = setInterval(() => {
      setActiveDataFlow((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(flowInterval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Enhanced Floating Elements with Physics */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-bounce" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-xl animate-ping delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-primary/5 rounded-full blur-lg animate-spin delay-3000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Main Heading */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            System Design
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
              Made Visual
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform complex architectural concepts into interactive, collaborative learning experiences. 
            From AI-powered generation to interview mastery.
          </p>
        </div>

        {/* Enhanced Interactive Demo Video */}
        <div className="mb-16">
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-5xl mx-auto glass-effect">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-warning rounded-full animate-pulse delay-200" />
                <div className="w-3 h-3 bg-success rounded-full animate-pulse delay-400" />
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Users" size={16} />
                <span className="animate-pulse">3 collaborators online</span>
              </div>
            </div>

            {/* Enhanced AI Prompt Interface */}
            <div className="bg-muted/30 rounded-lg p-4 mb-8 border border-primary/20">
              <div className="flex items-center space-x-3">
                <Icon name="Sparkles" size={20} className="text-primary animate-spin" />
                <div className="flex-1">
                  <div className={`text-left text-foreground transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                    "{prompts[currentPrompt]}"
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Revolutionary Interactive Canvas Preview */}
            <div className="bg-background/50 rounded-lg p-8 min-h-96 relative border border-border/50">
              {/* Component Grid with Enhanced Layout */}
              <div className="grid grid-cols-4 gap-8 h-full relative">
                {/* User/Client */}
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-24 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/40 border-2 rounded-lg flex items-center justify-center transition-all duration-1000 hover:scale-110 ${activeDataFlow === 0 ? 'border-blue-500 shadow-lg shadow-blue-500/50 animate-pulse' : 'border-blue-500/40'}`}>
                    <Icon name="Users" size={24} className="text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Users</span>
                  <div className="text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded animate-pulse">
                    {activeDataFlow === 0 ? 'Requesting' : 'Idle'}
                  </div>
                </div>

                {/* Load Balancer */}
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-24 h-20 bg-gradient-to-br from-primary/20 to-primary/40 border-2 rounded-lg flex items-center justify-center transition-all duration-1000 hover:scale-110 ${activeDataFlow === 1 ? 'border-primary shadow-lg shadow-primary/50 animate-pulse' : 'border-primary/40'}`}>
                    <Icon name="Zap" size={24} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Load Balancer</span>
                  <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded animate-pulse">
                    {activeDataFlow === 1 ? 'Routing' : 'Ready'}
                  </div>
                </div>

                {/* API Gateway/Microservices */}
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-24 h-20 bg-gradient-to-br from-secondary/20 to-secondary/40 border-2 rounded-lg flex items-center justify-center transition-all duration-1000 hover:scale-110 ${activeDataFlow === 2 ? 'border-secondary shadow-lg shadow-secondary/50 animate-pulse' : 'border-secondary/40'}`}>
                    <Icon name="Globe" size={24} className="text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">API Services</span>
                  <div className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded animate-pulse">
                    {activeDataFlow === 2 ? 'Processing' : 'Standby'}
                  </div>
                </div>

                {/* Database Cluster */}
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-24 h-20 bg-gradient-to-br from-accent/20 to-accent/40 border-2 rounded-lg flex items-center justify-center transition-all duration-1000 hover:scale-110 ${activeDataFlow === 0 ? 'border-accent shadow-lg shadow-accent/50 animate-pulse' : 'border-accent/40'}`}>
                    <Icon name="Database" size={24} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Database</span>
                  <div className="text-xs text-accent bg-accent/10 px-2 py-1 rounded animate-pulse">
                    {activeDataFlow === 0 ? 'Querying' : 'Connected'}
                  </div>
                </div>
              </div>

              {/* Revolutionary Animated Connection System */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  {/* Advanced Gradient Definitions */}
                  <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                    <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
                    <stop offset="50%" stopColor="#10B981" stopOpacity="1" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="flowGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>
                  
                  {/* Pulsing Effect Filter */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Connection Lines with Enhanced Animations */}
                {/* User to Load Balancer */}
                <line 
                  x1="20%" y1="50%" x2="45%" y2="50%" 
                  stroke="url(#flowGradient1)" 
                  strokeWidth="4" 
                  opacity={activeDataFlow === 0 ? "1" : "0.3"}
                  filter="url(#glow)"
                  className="transition-opacity duration-500"
                >
                  {activeDataFlow === 0 && (
                    <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="2s" repeatCount="indefinite" />
                  )}
                </line>

                {/* Load Balancer to API Services */}
                <line 
                  x1="45%" y1="50%" x2="70%" y2="50%" 
                  stroke="url(#flowGradient2)" 
                  strokeWidth="4" 
                  opacity={activeDataFlow === 1 ? "1" : "0.3"}
                  filter="url(#glow)"
                  className="transition-opacity duration-500"
                >
                  {activeDataFlow === 1 && (
                    <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="2s" repeatCount="indefinite" />
                  )}
                </line>

                {/* API Services to Database */}
                <line 
                  x1="70%" y1="50%" x2="95%" y2="50%" 
                  stroke="url(#flowGradient3)" 
                  strokeWidth="4" 
                  opacity={activeDataFlow === 2 ? "1" : "0.3"}
                  filter="url(#glow)"
                  className="transition-opacity duration-500"
                >
                  {activeDataFlow === 2 && (
                    <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="2s" repeatCount="indefinite" />
                  )}
                </line>

                {/* Bidirectional Data Flow Indicators */}
                <circle r="4" fill="#3B82F6" opacity="0.8" filter="url(#glow)">
                  <animateMotion dur="3s" repeatCount="indefinite" begin={activeDataFlow === 0 ? "0s" : "never"}>
                    <path d="M 120 150 L 270 150" />
                  </animateMotion>
                </circle>
                
                <circle r="4" fill="#10B981" opacity="0.8" filter="url(#glow)">
                  <animateMotion dur="3s" repeatCount="indefinite" begin={activeDataFlow === 1 ? "0s" : "never"}>
                    <path d="M 270 150 L 420 150" />
                  </animateMotion>
                </circle>
                
                <circle r="4" fill="#F59E0B" opacity="0.8" filter="url(#glow)">
                  <animateMotion dur="3s" repeatCount="indefinite" begin={activeDataFlow === 2 ? "0s" : "never"}>
                    <path d="M 420 150 L 570 150" />
                  </animateMotion>
                </circle>

                {/* Response Flow (Return Journey) */}
                <circle r="3" fill="#8B5CF6" opacity="0.6">
                  <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.5s">
                    <path d="M 570 160 L 120 160" />
                  </animateMotion>
                </circle>
              </svg>

              {/* Enhanced Live Metrics Dashboard */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Requests/sec</div>
                      <div className="text-lg font-bold text-blue-500 animate-pulse">
                        {activeDataFlow === 0 ? '1,247' : '892'}
                      </div>
                      <div className="w-full bg-blue-500/20 rounded-full h-1">
                        <div className={`bg-blue-500 h-1 rounded-full transition-all duration-1000 ${activeDataFlow === 0 ? 'w-full' : 'w-3/4'}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Latency</div>
                      <div className="text-lg font-bold text-primary animate-pulse">
                        {activeDataFlow === 1 ? '23ms' : '45ms'}
                      </div>
                      <div className="w-full bg-primary/20 rounded-full h-1">
                        <div className={`bg-primary h-1 rounded-full transition-all duration-1000 ${activeDataFlow === 1 ? 'w-5/6' : 'w-2/3'}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">CPU Usage</div>
                      <div className="text-lg font-bold text-secondary animate-pulse">
                        {activeDataFlow === 2 ? '67%' : '34%'}
                      </div>
                      <div className="w-full bg-secondary/20 rounded-full h-1">
                        <div className={`bg-secondary h-1 rounded-full transition-all duration-1000 ${activeDataFlow === 2 ? 'w-2/3' : 'w-1/3'}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Uptime</div>
                      <div className="text-lg font-bold text-accent">99.9%</div>
                      <div className="w-full bg-accent/20 rounded-full h-1">
                        <div className="bg-accent h-1 rounded-full w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Labels */}
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute left-1/4 top-1/3 text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded transition-opacity duration-500 ${activeDataFlow === 0 ? 'opacity-100' : 'opacity-50'}`}>
                  HTTP Requests
                </div>
                <div className={`absolute left-1/2 top-1/3 text-xs text-primary bg-primary/10 px-2 py-1 rounded transition-opacity duration-500 ${activeDataFlow === 1 ? 'opacity-100' : 'opacity-50'}`}>
                  Load Balance
                </div>
                <div className={`absolute right-1/4 top-1/3 text-xs text-secondary bg-secondary/10 px-2 py-1 rounded transition-opacity duration-500 ${activeDataFlow === 2 ? 'opacity-100' : 'opacity-50'}`}>
                  API Calls
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
          <Link to="/ai-design-generator">
            <Button variant="default" size="lg" className="brand-gradient brand-shadow-primary hover:scale-105 transition-transform duration-300">
              <Icon name="Sparkles" size={20} />
              Start Designing Now
            </Button>
          </Link>
          <Link to="/interactive-canvas-studio">
            <Button variant="outline" size="lg" className="hover:scale-105 transition-transform duration-300">
              <Icon name="Play" size={20} />
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* Enhanced Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-pulse">50K+</div>
            <div className="text-muted-foreground">Diagrams Created</div>
            <div className="w-full bg-primary/20 rounded-full h-1 mt-2">
              <div className="bg-primary h-1 rounded-full w-4/5 animate-pulse" />
            </div>
          </div>
          <div className="text-center p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-2 animate-pulse delay-200">1M+</div>
            <div className="text-muted-foreground">Components Used</div>
            <div className="w-full bg-secondary/20 rounded-full h-1 mt-2">
              <div className="bg-secondary h-1 rounded-full w-full animate-pulse delay-200" />
            </div>
          </div>
          <div className="text-center p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2 animate-pulse delay-400">95%</div>
            <div className="text-muted-foreground">Interview Success Rate</div>
            <div className="w-full bg-accent/20 rounded-full h-1 mt-2">
              <div className="bg-accent h-1 rounded-full w-11/12 animate-pulse delay-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;