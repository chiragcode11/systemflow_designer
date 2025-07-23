import React from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CommunityShowcase from './components/CommunityShowcase';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <CommunityShowcase />
        <TestimonialsSection />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" className="text-primary">
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" />
                      <stop offset="100%" stopColor="var(--color-secondary)" />
                    </linearGradient>
                  </defs>
                  <rect x="4" y="4" width="8" height="8" rx="2" fill="url(#footerLogoGradient)" />
                  <rect x="20" y="4" width="8" height="8" rx="2" fill="url(#footerLogoGradient)" />
                  <rect x="4" y="20" width="8" height="8" rx="2" fill="url(#footerLogoGradient)" />
                  <rect x="20" y="20" width="8" height="8" rx="2" fill="url(#footerLogoGradient)" />
                  <path d="M12 8h8M8 12v8M24 12v8M12 24h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-xl font-bold text-foreground">SystemFlow Designer</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Transform complex architectural concepts into interactive, collaborative learning experiences.
              </p>
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} SystemFlow Designer. All rights reserved.
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/ai-design-generator" className="hover:text-foreground transition-colors">AI Generator</a></li>
                <li><a href="/interactive-canvas-studio" className="hover:text-foreground transition-colors">Canvas Studio</a></li>
                <li><a href="/component-library-marketplace" className="hover:text-foreground transition-colors">Components</a></li>
                <li><a href="/collaboration-workspace" className="hover:text-foreground transition-colors">Collaborate</a></li>
                <li><a href="/community-gallery" className="hover:text-foreground transition-colors">Gallery</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;