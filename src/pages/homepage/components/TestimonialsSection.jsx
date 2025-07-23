import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "David Kim",
      role: "Senior Software Engineer", 
      company: "TechNova Solutions",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: `SystemFlow Designer completely transformed my interview preparation. The AI-generated diagrams helped me visualize complex architectures, and the real-time collaboration feature was perfect for mock interviews with my study group.`,
      beforeAfter: {
        before: "Struggled with system design concepts",
        after: "Landed Senior SWE role with 40% salary increase"
      },
      interviewDetails: {
        company: "TechNova Solutions",
        position: "Senior Software Engineer",
        salary: "$125K + equity",
        rounds: 5
      },
      designUsed: "Distributed Search Engine Architecture"
    },
    {
      id: 2,
      name: "Sarah Martinez",
      role: "Staff Engineer",
      company: "CloudFirst Technologies",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: `The platform's component library and animation features made it so much easier to explain complex data flows during my interviews. I could literally show how data moves through the system in real-time.`,
      beforeAfter: {
        before: "Mid-level engineer for 3 years",
        after: "Promoted to Staff Engineer role"
      },
      interviewDetails: {
        company: "CloudFirst Technologies",
        position: "Staff Engineer",
        salary: "$165K + equity",
        rounds: 6
      },
      designUsed: "Video Streaming Platform Architecture"
    },
    {
      id: 3,
      name: "Alex Chen",
      role: "Principal Engineer",
      company: "DataStream Enterprises",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: `What sets SystemFlow apart is the community aspect. Learning from real designs created by engineers at various companies gave me insights I couldn't get anywhere else. The interview success rate speaks for itself.`,
      beforeAfter: {
        before: "Startup engineer with limited scale experience",
        after: "Principal Engineer at major tech company"
      },
      interviewDetails: {
        company: "DataStream Enterprises",
        position: "Principal Engineer",
        salary: "$195K + equity",
        rounds: 7
      },
      designUsed: "E-commerce Platform Microservices"
    }
  ];

  const stats = [
    { label: "Interview Success Rate", value: "95%", icon: "TrendingUp" },
    { label: "Average Salary Increase", value: "$45K", icon: "DollarSign" },
    { label: "Time to Job Offer", value: "6 weeks", icon: "Clock" },
    { label: "Companies Hiring", value: "150+", icon: "Building" }
  ];

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Success Stories from
            <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Real Engineers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real engineers sharing how SystemFlow Designer helped them land their dream jobs 
            at various tech companies across the industry.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden glass-effect mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Testimonial Content */}
            <div className="lg:col-span-2 p-8">
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-foreground mb-6 leading-relaxed">
                "{currentTestimonial.content}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center space-x-4 mb-6">
                <Image 
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-foreground text-lg">{currentTestimonial.name}</div>
                  <div className="text-muted-foreground">{currentTestimonial.role}</div>
                  <div className="text-primary font-medium">{currentTestimonial.company}</div>
                </div>
              </div>

              {/* Before/After */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="ArrowDown" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Before</span>
                  </div>
                  <p className="text-sm text-foreground">{currentTestimonial.beforeAfter.before}</p>
                </div>
                <div className="bg-success/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="ArrowUp" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">After</span>
                  </div>
                  <p className="text-sm text-foreground">{currentTestimonial.beforeAfter.after}</p>
                </div>
              </div>
            </div>

            {/* Interview Details */}
            <div className="bg-muted/10 p-8">
              <h4 className="font-semibold text-foreground mb-6">Interview Details</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium text-foreground text-right">{currentTestimonial.interviewDetails.company}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Position</span>
                  <span className="font-medium text-foreground text-right">{currentTestimonial.interviewDetails.position}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Salary</span>
                  <span className="font-medium text-success text-right">{currentTestimonial.interviewDetails.salary}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Interview Rounds</span>
                  <span className="font-medium text-foreground">{currentTestimonial.interviewDetails.rounds}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="text-sm font-medium text-primary mb-2">Design Used</div>
                <div className="text-sm text-foreground">{currentTestimonial.designUsed}</div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                >
                  <Icon name="ChevronLeft" size={16} />
                  Previous
                </Button>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === activeTestimonial ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                >
                  Next
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={stat.icon} size={20} className="text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-8">
            Our users have been hired at
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {['TechFlow', 'CloudFirst', 'DataStream', 'InnovateCorp', 'SystemTech', 'DevSolutions', 'CodeCraft', 'DigitalCore'].map((company) => (
              <div key={company} className="text-muted-foreground font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;