import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SuccessStories = () => {
  const successStories = [
    {
      id: 1,
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "Senior Software Engineer",
      company: "Google",
      previousRole: "Mid-level Developer",
      story: `After struggling with system design interviews for months, I discovered SystemFlow Designer. The community gallery was a game-changer - I could see real solutions to problems I was practicing. The Netflix architecture design by Sarah helped me understand microservices at scale, and I used similar patterns in my Google interview.`,
      designUsed: "Distributed Cache Architecture",
      outcome: "Landed Senior SWE role at Google",
      salaryIncrease: "$45,000",
      timeframe: "3 months",
      interviewCompanies: ["Google", "Meta", "Amazon", "Netflix"],
      offers: 3,
      avatar_fallback: "MC"
    },
    {
      id: 2,
      name: "Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      title: "Principal Engineer",
      company: "Stripe",
      previousRole: "Senior Developer",
      story: `The community gallery's payment processing designs were incredibly detailed. I studied the Stripe-like architecture and learned about handling financial transactions at scale. During my interview, I confidently designed a payment system that impressed the panel. The collaborative features helped me get feedback from experienced engineers.`,
      designUsed: "Payment Processing System",
      outcome: "Promoted to Principal Engineer",
      salaryIncrease: "$60,000",
      timeframe: "4 months",
      interviewCompanies: ["Stripe", "Square", "PayPal"],
      offers: 2,
      avatar_fallback: "PS"
    },
    {
      id: 3,
      name: "David Kim",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      title: "Staff Engineer",
      company: "Uber",
      previousRole: "Senior SWE",
      story: `The real-time location tracking designs in the gallery were phenomenal. I forked several ride-sharing architectures and practiced explaining trade-offs. The community feedback helped me refine my approach. When Uber asked me to design their driver matching system, I was ready with a solid solution.`,
      designUsed: "Real-time Location System",
      outcome: "Joined as Staff Engineer at Uber",
      salaryIncrease: "$55,000",
      timeframe: "2 months",
      interviewCompanies: ["Uber", "Lyft", "DoorDash"],
      offers: 3,
      avatar_fallback: "DK"
    }
  ];

  return (
    <div className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Success Stories from Our Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real engineers who transformed their careers using community designs and collaborative learning. 
            Their stories prove that great system design skills can be learned and mastered.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {successStories.map((story) => (
            <div
              key={story.id}
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/20 transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative">
                  <Image
                    src={story.avatar}
                    alt={story.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle" size={14} className="text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-lg">{story.name}</h3>
                  <p className="text-primary font-medium">{story.title}</p>
                  <p className="text-sm text-muted-foreground">{story.company}</p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>From: {story.previousRole}</span>
                    <span>•</span>
                    <span className="text-accent font-medium">+{story.salaryIncrease}</span>
                  </div>
                </div>
              </div>

              {/* Story */}
              <blockquote className="text-sm text-muted-foreground mb-6 italic leading-relaxed">
                "{story.story}"
              </blockquote>

              {/* Key Design Used */}
              <div className="bg-primary/5 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Lightbulb" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Key Design Used</span>
                </div>
                <p className="text-sm text-foreground font-medium">{story.designUsed}</p>
              </div>

              {/* Outcome Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-accent">{story.offers}</div>
                  <div className="text-xs text-muted-foreground">Job Offers</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-secondary">{story.timeframe}</div>
                  <div className="text-xs text-muted-foreground">Timeline</div>
                </div>
              </div>

              {/* Interview Companies */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-2">Interviewed at:</p>
                <div className="flex flex-wrap gap-1">
                  {story.interviewCompanies.map((company, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <Button
                variant="outline"
                size="sm"
                className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
              >
                <Icon name="ExternalLink" size={14} />
                <span className="ml-2">View Their Design</span>
              </Button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of engineers who have transformed their careers using our community-driven 
              approach to system design mastery. Start learning from the best designs today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="lg" className="brand-gradient">
                <Icon name="Rocket" size={20} />
                <span className="ml-2">Start Your Journey</span>
              </Button>
              <Button variant="outline" size="lg">
                <Icon name="Users" size={20} />
                <span className="ml-2">Join Community</span>
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={16} />
                <span>50,000+ Engineers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Trophy" size={16} />
                <span>89% Success Rate</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={16} />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;