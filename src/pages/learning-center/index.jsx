import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';

const LearningCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const tabs = [
    { id: 'courses', name: 'Courses', icon: 'GraduationCap' },
    { id: 'tutorials', name: 'Tutorials', icon: 'BookOpen' },
    { id: 'workshops', name: 'Workshops', icon: 'Users' },
    { id: 'certifications', name: 'Certifications', icon: 'Award' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fundamentals', label: 'System Design Fundamentals' },
    { value: 'databases', label: 'Database Design' },
    { value: 'microservices', label: 'Microservices Architecture' },
    { value: 'scalability', label: 'Scalability & Performance' },
    { value: 'security', label: 'Security & Compliance' },
    { value: 'cloud', label: 'Cloud Architecture' },
    { value: 'devops', label: 'DevOps & Infrastructure' }
  ];

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const courses = [
    {
      id: 1,
      title: 'System Design Fundamentals',
      description: 'Learn the core principles of system design including scalability, reliability, and performance.',
      category: 'fundamentals',
      level: 'beginner',
      duration: '8 hours',
      lessons: 12,
      instructor: 'Dr. Sarah Chen',
      rating: 4.9,
      students: 15420,
      price: 'Free',
      thumbnail: '/assets/images/no_image.png',
      topics: ['Scalability', 'Load Balancing', 'Caching', 'Database Design']
    },
    {
      id: 2,
      title: 'Microservices Architecture Mastery',
      description: 'Deep dive into microservices patterns, communication, and deployment strategies.',
      category: 'microservices',
      level: 'intermediate',
      duration: '12 hours',
      lessons: 18,
      instructor: 'Mike Johnson',
      rating: 4.8,
      students: 8930,
      price: '$49',
      thumbnail: '/assets/images/no_image.png',
      topics: ['Service Discovery', 'API Gateway', 'Circuit Breaker', 'Event Sourcing']
    },
    {
      id: 3,
      title: 'Database Design for Scale',
      description: 'Master database design patterns, sharding, replication, and performance optimization.',
      category: 'databases',
      level: 'intermediate',
      duration: '10 hours',
      lessons: 15,
      instructor: 'David Rodriguez',
      rating: 4.7,
      students: 12100,
      price: '$39',
      thumbnail: '/assets/images/no_image.png',
      topics: ['SQL vs NoSQL', 'Sharding', 'Replication', 'ACID Properties']
    },
    {
      id: 4,
      title: 'Cloud Architecture on AWS',
      description: 'Build scalable and resilient systems using AWS cloud services and best practices.',
      category: 'cloud',
      level: 'advanced',
      duration: '16 hours',
      lessons: 24,
      instructor: 'Jennifer Liu',
      rating: 4.9,
      students: 6780,
      price: '$79',
      thumbnail: '/assets/images/no_image.png',
      topics: ['EC2', 'RDS', 'Lambda', 'API Gateway', 'CloudFormation']
    },
    {
      id: 5,
      title: 'Security in System Design',
      description: 'Learn to design secure systems with authentication, authorization, and encryption.',
      category: 'security',
      level: 'intermediate',
      duration: '6 hours',
      lessons: 10,
      instructor: 'Alex Kumar',
      rating: 4.6,
      students: 9450,
      price: '$29',
      thumbnail: '/assets/images/no_image.png',
      topics: ['OAuth 2.0', 'JWT', 'Encryption', 'API Security']
    },
    {
      id: 6,
      title: 'Performance Optimization Techniques',
      description: 'Advanced techniques for optimizing system performance and reducing latency.',
      category: 'scalability',
      level: 'advanced',
      duration: '14 hours',
      lessons: 20,
      instructor: 'Emma Thompson',
      rating: 4.8,
      students: 4320,
      price: '$59',
      thumbnail: '/assets/images/no_image.png',
      topics: ['CDN', 'Caching Strategies', 'Database Optimization', 'Load Testing']
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Building a URL Shortener',
      description: 'Step-by-step guide to design and implement a URL shortening service.',
      category: 'fundamentals',
      level: 'beginner',
      duration: '45 min',
      type: 'Hands-on Tutorial',
      author: 'Tech Team',
      views: 23500
    },
    {
      id: 2,
      title: 'Implementing Rate Limiting',
      description: 'Learn different rate limiting algorithms and how to implement them.',
      category: 'scalability',
      level: 'intermediate',
      duration: '30 min',
      type: 'Code Tutorial',
      author: 'System Architects',
      views: 18700
    },
    {
      id: 3,
      title: 'Setting up Monitoring & Alerting',
      description: 'Configure monitoring and alerting for your distributed systems.',
      category: 'devops',
      level: 'intermediate',
      duration: '60 min',
      type: 'DevOps Guide',
      author: 'DevOps Team',
      views: 15200
    }
  ];

  const workshops = [
    {
      id: 1,
      title: 'System Design Workshop: E-commerce Platform',
      description: 'Interactive workshop designing a complete e-commerce system from scratch.',
      category: 'fundamentals',
      level: 'intermediate',
      duration: '3 hours',
      date: '2024-02-15',
      instructor: 'Industry Expert',
      participants: 45,
      maxParticipants: 50,
      price: '$99'
    },
    {
      id: 2,
      title: 'Microservices Migration Strategy',
      description: 'Learn how to migrate from monolith to microservices architecture.',
      category: 'microservices',
      level: 'advanced',
      duration: '4 hours',
      date: '2024-02-22',
      instructor: 'Senior Architect',
      participants: 28,
      maxParticipants: 40,
      price: '$149'
    }
  ];

  const certifications = [
    {
      id: 1,
      title: 'Certified System Design Professional',
      description: 'Industry-recognized certification for system design expertise.',
      category: 'fundamentals',
      level: 'intermediate',
      duration: '3 months',
      examFee: '$199',
      passingScore: '80%',
      validity: '2 years',
      enrolled: 2340
    },
    {
      id: 2,
      title: 'Advanced Microservices Architect',
      description: 'Specialized certification for microservices architecture mastery.',
      category: 'microservices',
      level: 'advanced',
      duration: '4 months',
      examFee: '$299',
      passingScore: '85%',
      validity: '3 years',
      enrolled: 1180
    }
  ];

  const filteredContent = (content) => {
    return content.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesLevel && matchesSearch;
    });
  };

  const handleEnrollCourse = (course) => {
    console.log('Enrolling in course:', course.title);
    // Handle course enrollment
  };

  const handleStartTutorial = (tutorial) => {
    // Navigate to canvas with tutorial setup
    navigate('/canvas-studio', {
      state: {
        mode: 'tutorial',
        tutorial: tutorial
      }
    });
  };

  const handleJoinWorkshop = (workshop) => {
    console.log('Joining workshop:', workshop.title);
    // Handle workshop registration
  };

  const handleStartCertification = (certification) => {
    console.log('Starting certification:', certification.title);
    // Handle certification enrollment
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={12}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Learning Center</h1>
              <p className="text-muted-foreground">Master system design through structured learning</p>
            </div>

            <div className="flex items-center space-x-3">
              {user && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Trophy" size={16} className="text-yellow-500" />
                  <span>Learning Streak: 7 days</span>
                </div>
              )}
              
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg mb-6 max-w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-surface border border-border rounded-lg">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search courses, tutorials, workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="min-w-[200px]"
          />
          
          <Select
            options={levelOptions}
            value={selectedLevel}
            onChange={setSelectedLevel}
            className="min-w-[140px]"
          />
        </div>

        {/* Content */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent(courses).map((course) => (
              <div
                key={course.id}
                className="bg-surface border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="aspect-video bg-muted/20 flex items-center justify-center">
                  <Icon name="Play" size={24} className="text-muted-foreground" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${getLevelColor(course.level)}`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {course.price}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="BookOpen" size={14} />
                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(course.rating)}
                      <span className="text-sm text-muted-foreground ml-1">
                        {course.rating} ({course.students.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.topics.slice(0, 3).map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    fullWidth
                    onClick={() => handleEnrollCourse(course)}
                    iconName="GraduationCap"
                    iconPosition="left"
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tutorials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent(tutorials).map((tutorial) => (
              <div
                key={tutorial.id}
                className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${getLevelColor(tutorial.level)}`}>
                    {tutorial.level.charAt(0).toUpperCase() + tutorial.level.slice(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">{tutorial.type}</span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">{tutorial.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Eye" size={14} />
                    <span>{tutorial.views.toLocaleString()} views</span>
                  </div>
                </div>
                
                <Button
                  fullWidth
                  onClick={() => handleStartTutorial(tutorial)}
                  iconName="Play"
                  iconPosition="left"
                >
                  Start Tutorial
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'workshops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredContent(workshops).map((workshop) => (
              <div
                key={workshop.id}
                className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${getLevelColor(workshop.level)}`}>
                    {workshop.level.charAt(0).toUpperCase() + workshop.level.slice(1)}
                  </span>
                  <span className="text-sm font-semibold text-primary">{workshop.price}</span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">{workshop.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{workshop.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{workshop.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="User" size={14} />
                    <span>{workshop.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={14} />
                    <span>{workshop.participants}/{workshop.maxParticipants}</span>
                  </div>
                </div>
                
                <Button
                  fullWidth
                  onClick={() => handleJoinWorkshop(workshop)}
                  disabled={workshop.participants >= workshop.maxParticipants}
                  iconName="Users"
                  iconPosition="left"
                >
                  {workshop.participants >= workshop.maxParticipants ? 'Full' : 'Join Workshop'}
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredContent(certifications).map((cert) => (
              <div
                key={cert.id}
                className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Icon name="Award" size={24} className="text-yellow-500" />
                  <span className={`text-sm font-medium ${getLevelColor(cert.level)}`}>
                    {cert.level.charAt(0).toUpperCase() + cert.level.slice(1)} Level
                  </span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">{cert.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <div className="font-medium text-foreground">{cert.duration}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Exam Fee:</span>
                    <div className="font-medium text-foreground">{cert.examFee}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Passing Score:</span>
                    <div className="font-medium text-foreground">{cert.passingScore}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valid for:</span>
                    <div className="font-medium text-foreground">{cert.validity}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {cert.enrolled.toLocaleString()} enrolled
                  </span>
                </div>
                
                <Button
                  fullWidth
                  onClick={() => handleStartCertification(cert)}
                  iconName="Award"
                  iconPosition="left"
                >
                  Start Certification Path
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningCenter;