import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LearningPathways = () => {
  const pathways = [
    {
      id: 1,
      title: "System Design Fundamentals",
      level: "Beginner",
      duration: "4 weeks",
      modules: 12,
      students: "15.2K",
      rating: 4.9,
      progress: 0,
      description: "Master the core concepts of system design including scalability, reliability, and basic architectural patterns.",
      topics: [
        "Scalability Principles",
        "Load Balancing",
        "Database Design",
        "Caching Strategies"
      ],
      color: "success",
      certificate: true,
      nextModule: "Introduction to Scalability"
    },
    {
      id: 2,
      title: "Microservices Architecture",
      level: "Intermediate",
      duration: "6 weeks",
      modules: 18,
      students: "8.7K",
      rating: 4.8,
      progress: 35,
      description: "Deep dive into microservices patterns, service communication, and distributed system challenges.",
      topics: [
        "Service Decomposition",
        "API Gateway Patterns",
        "Event-Driven Architecture",
        "Service Mesh"
      ],
      color: "primary",
      certificate: true,
      nextModule: "Service Communication Patterns"
    },
    {
      id: 3,
      title: "Advanced Distributed Systems",
      level: "Advanced",
      duration: "8 weeks",
      modules: 24,
      students: "4.1K",
      rating: 4.9,
      progress: 0,
      description: "Explore complex distributed system concepts including consensus algorithms, distributed databases, and fault tolerance.",
      topics: [
        "Consensus Algorithms",
        "Distributed Databases",
        "CAP Theorem",
        "Fault Tolerance"
      ],
      color: "secondary",
      certificate: true,
      nextModule: "Consensus in Distributed Systems"
    }
  ];

  const achievements = [
    { icon: "Award", title: "System Design Expert", description: "Complete all pathways" },
    { icon: "Target", title: "Interview Ready", description: "Pass 10 mock interviews" },
    { icon: "Users", title: "Community Contributor", description: "Share 5 designs" },
    { icon: "Zap", title: "Speed Designer", description: "Create design in under 30 min" }
  ];

  return (
    <section className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Structured Learning
            <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Pathways
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Follow our expertly crafted learning paths from system design fundamentals to advanced distributed systems. 
            Each pathway includes hands-on projects and industry certifications.
          </p>
        </div>

        {/* Learning Pathways Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pathways.map((pathway) => (
            <div key={pathway.id} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-brand-interactive">
              {/* Pathway Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  pathway.level === 'Beginner' ? 'bg-success/10 text-success' :
                  pathway.level === 'Intermediate'? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                }`}>
                  {pathway.level}
                </div>
                {pathway.certificate && (
                  <div className="flex items-center space-x-1 text-warning">
                    <Icon name="Award" size={16} />
                    <span className="text-xs">Certificate</span>
                  </div>
                )}
              </div>

              {/* Pathway Title */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {pathway.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {pathway.description}
              </p>

              {/* Pathway Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold text-foreground">{pathway.duration}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold text-foreground">{pathway.modules}</div>
                  <div className="text-xs text-muted-foreground">Modules</div>
                </div>
              </div>

              {/* Progress Bar */}
              {pathway.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium text-foreground">{pathway.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        pathway.color === 'success' ? 'bg-success' :
                        pathway.color === 'primary' ? 'bg-primary' : 'bg-secondary'
                      }`}
                      style={{ width: `${pathway.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Topics */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Key Topics</h4>
                <div className="space-y-2">
                  {pathway.topics.map((topic, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        pathway.color === 'success' ? 'bg-success' :
                        pathway.color === 'primary' ? 'bg-primary' : 'bg-secondary'
                      }`} />
                      <span className="text-sm text-muted-foreground">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pathway Footer */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{pathway.students}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning" />
                    <span className="text-xs text-foreground">{pathway.rating}</span>
                  </div>
                </div>
              </div>

              {/* Next Module */}
              {pathway.nextModule && (
                <div className="bg-muted/20 rounded-lg p-3 mb-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    {pathway.progress > 0 ? 'Continue with:' : 'Start with:'}
                  </div>
                  <div className="text-sm font-medium text-foreground">{pathway.nextModule}</div>
                </div>
              )}

              {/* CTA */}
              <Button 
                variant={pathway.progress > 0 ? "default" : "outline"} 
                className="w-full"
              >
                {pathway.progress > 0 ? (
                  <>
                    <Icon name="Play" size={16} />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <Icon name="BookOpen" size={16} />
                    Start Pathway
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-background border border-border rounded-2xl p-8 glass-effect">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Unlock Achievements
            </h3>
            <p className="text-muted-foreground">
              Track your progress and earn recognition for your system design mastery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name={achievement.icon} size={20} className="text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Link to="/ai-design-generator">
            <Button variant="default" size="lg" className="brand-gradient">
              <Icon name="Rocket" size={20} />
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LearningPathways;