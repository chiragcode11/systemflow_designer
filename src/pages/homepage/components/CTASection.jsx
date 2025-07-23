import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const features = [
    "AI-powered diagram generation",
    "Real-time collaboration",
    "Interview preparation tools",
    "Community design library",
    "Performance analytics",
    "Export to multiple formats"
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 AI-generated diagrams/month",
        "Basic component library",
        "Community gallery access",
        "Standard export formats"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For serious system designers",
      features: [
        "Unlimited AI generations",
        "Advanced component library",
        "Real-time collaboration",
        "Interview practice mode",
        "Priority support",
        "Custom templates"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Team",
      price: "$49",
      period: "per user/month",
      description: "For engineering teams",
      features: [
        "Everything in Pro",
        "Team workspaces",
        "Advanced analytics",
        "Custom branding",
        "SSO integration",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-surface/50 to-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main CTA */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Ready to Master
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              System Design?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of engineers who've transformed their careers with SystemFlow Designer. 
            Start creating, collaborating, and succeeding today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link to="/ai-design-generator">
              <Button variant="default" size="xl" className="brand-gradient brand-shadow-primary">
                <Icon name="Rocket" size={24} />
                Start Designing Now
              </Button>
            </Link>
            <Button variant="outline" size="xl">
              <Icon name="Play" size={24} />
              Watch 2-Min Demo
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h3>
            <p className="text-muted-foreground">
              Start free and upgrade as you grow. All plans include our core features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`relative bg-card border rounded-2xl p-8 ${
                  tier.popular 
                    ? 'border-primary shadow-brand-interactive scale-105' 
                    : 'border-border hover:border-primary/30'
                } transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-foreground mb-2">{tier.name}</h4>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">/{tier.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={tier.popular ? "default" : "outline"} 
                  className={`w-full ${tier.popular ? 'brand-gradient' : ''}`}
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="bg-surface/50 border border-border rounded-2xl p-8 glass-effect">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Security */}
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={24} className="text-success" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Enterprise Security</h4>
              <p className="text-sm text-muted-foreground">SOC 2 compliant with end-to-end encryption</p>
            </div>

            {/* Support */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Headphones" size={24} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">24/7 Support</h4>
              <p className="text-sm text-muted-foreground">Expert help when you need it most</p>
            </div>

            {/* Guarantee */}
            <div className="text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Award" size={24} className="text-warning" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Success Guarantee</h4>
              <p className="text-sm text-muted-foreground">95% of users pass their interviews</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Ready to join 50,000+ engineers who've mastered system design?
          </p>
          <Link to="/ai-design-generator">
            <Button variant="default" size="lg" className="brand-gradient">
              <Icon name="ArrowRight" size={20} />
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;