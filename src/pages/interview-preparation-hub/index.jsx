import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';

const InterviewPreparationHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('practice');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [practiceProblems, setPracticeProblems] = useState([]);
  const [userProgress, setUserProgress] = useState({
    completed: 0,
    total: 0,
    streak: 0
  });

  const tabs = [
    { id: 'practice', name: 'Practice Problems', icon: 'Code' },
    { id: 'mock', name: 'Mock Interviews', icon: 'Video' },
    { id: 'study', name: 'Study Materials', icon: 'BookOpen' },
    { id: 'progress', name: 'Progress', icon: 'TrendingUp' }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const companyOptions = [
    { value: 'all', label: 'All Companies' },
    { value: 'google', label: 'Google' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'microsoft', label: 'Microsoft' },
    { value: 'netflix', label: 'Netflix' },
    { value: 'uber', label: 'Uber' },
    { value: 'meta', label: 'Meta' }
  ];

  const mockProblems = [
    {
      id: 1,
      title: 'Design a URL Shortener (like bit.ly)',
      difficulty: 'medium',
      company: 'google',
      tags: ['System Design', 'Distributed Systems', 'Databases'],
      estimatedTime: '45 min',
      completed: false,
      description: 'Design a URL shortening service like bit.ly that can handle millions of URLs.'
    },
    {
      id: 2,
      title: 'Design a Chat System',
      difficulty: 'hard',
      company: 'meta',
      tags: ['Real-time', 'WebSockets', 'Scalability'],
      estimatedTime: '60 min',
      completed: true,
      description: 'Design a real-time chat system that supports millions of users.'
    },
    {
      id: 3,
      title: 'Design a Content Delivery Network (CDN)',
      difficulty: 'hard',
      company: 'amazon',
      tags: ['CDN', 'Caching', 'Global Scale'],
      estimatedTime: '60 min',
      completed: false,
      description: 'Design a global content delivery network for fast content distribution.'
    },
    {
      id: 4,
      title: 'Design a Video Streaming Service',
      difficulty: 'hard',
      company: 'netflix',
      tags: ['Video Streaming', 'Load Balancing', 'Storage'],
      estimatedTime: '60 min',
      completed: false,
      description: 'Design a video streaming platform like Netflix or YouTube.'
    },
    {
      id: 5,
      title: 'Design a Social Media Feed',
      difficulty: 'medium',
      company: 'meta',
      tags: ['News Feed', 'Timeline', 'Social Graph'],
      estimatedTime: '45 min',
      completed: true,
      description: 'Design a social media news feed system like Facebook or Twitter.'
    },
    {
      id: 6,
      title: 'Design a Ride-Sharing Service',
      difficulty: 'hard',
      company: 'uber',
      tags: ['Location Services', 'Real-time Matching', 'GPS'],
      estimatedTime: '60 min',
      completed: false,
      description: 'Design a ride-sharing service like Uber or Lyft.'
    }
  ];

  const studyMaterials = [
    {
      id: 1,
      title: 'System Design Fundamentals',
      type: 'Guide',
      topics: ['Scalability', 'Reliability', 'Consistency', 'Availability'],
      readTime: '30 min',
      icon: 'BookOpen'
    },
    {
      id: 2,
      title: 'Database Design Patterns',
      type: 'Tutorial',
      topics: ['SQL vs NoSQL', 'Sharding', 'Replication', 'ACID'],
      readTime: '45 min',
      icon: 'Database'
    },
    {
      id: 3,
      title: 'Caching Strategies',
      type: 'Article',
      topics: ['Cache Patterns', 'Redis', 'Memcached', 'CDN'],
      readTime: '25 min',
      icon: 'Zap'
    },
    {
      id: 4,
      title: 'Microservices Architecture',
      type: 'Video',
      topics: ['Service Discovery', 'API Gateway', 'Load Balancing'],
      readTime: '60 min',
      icon: 'Play'
    },
    {
      id: 5,
      title: 'Distributed Systems Concepts',
      type: 'Course',
      topics: ['CAP Theorem', 'Consensus', 'Partition Tolerance'],
      readTime: '2 hours',
      icon: 'GraduationCap'
    }
  ];

  useEffect(() => {
    // Filter problems based on selections
    const filtered = mockProblems.filter(problem => {
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      const matchesCompany = selectedCompany === 'all' || problem.company === selectedCompany;
      return matchesDifficulty && matchesCompany;
    });
    
    setPracticeProblems(filtered);
    
    // Update progress
    const completed = mockProblems.filter(p => p.completed).length;
    setUserProgress({
      completed,
      total: mockProblems.length,
      streak: 5 // Mock streak
    });
  }, [selectedDifficulty, selectedCompany]);

  const handleStartProblem = (problem) => {
    // Navigate to canvas with the problem setup
    navigate('/canvas-studio', {
      state: {
        mode: 'interview-practice',
        problem: problem,
        timeLimit: problem.estimatedTime
      }
    });
  };

  const handleStartMockInterview = () => {
    // Start a mock interview session
    navigate('/canvas-studio', {
      state: {
        mode: 'mock-interview',
        timeLimit: '45 min',
        recordSession: true
      }
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getCompanyColor = (company) => {
    const colors = {
      google: '#4285f4',
      amazon: '#ff9900',
      microsoft: '#00a4ef',
      netflix: '#e50914',
      uber: '#000000',
      meta: '#1877f2'
    };
    return colors[company] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Interview Preparation Hub</h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="CheckCircle" size={16} className="text-green-500" />
                  <span>{userProgress.completed}/{userProgress.total} completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Flame" size={16} className="text-orange-500" />
                  <span>{userProgress.streak} day streak</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
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

        {/* Content */}
        {activeTab === 'practice' && (
          <div>
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-surface border border-border rounded-lg">
              <Select
                label="Difficulty"
                options={difficultyOptions}
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
                className="min-w-[120px]"
              />
              
              <Select
                label="Company"
                options={companyOptions}
                value={selectedCompany}
                onChange={setSelectedCompany}
                className="min-w-[150px]"
              />
              
              <div className="flex-1" />
              
              <Button
                onClick={handleStartMockInterview}
                iconName="Video"
                iconPosition="left"
              >
                Start Mock Interview
              </Button>
            </div>

            {/* Practice Problems Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {practiceProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-foreground">{problem.title}</h3>
                        {problem.completed && (
                          <Icon name="CheckCircle" size={16} className="text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {problem.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </span>
                      
                      <div 
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getCompanyColor(problem.company) }}
                      >
                        {companyOptions.find(c => c.value === problem.company)?.label}
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Icon name="Clock" size={14} />
                        <span>{problem.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    fullWidth
                    onClick={() => handleStartProblem(problem)}
                    iconName={problem.completed ? "RotateCcw" : "Play"}
                    iconPosition="left"
                  >
                    {problem.completed ? 'Practice Again' : 'Start Problem'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mock' && (
          <div className="max-w-4xl">
            <div className="bg-surface border border-border rounded-lg p-8 text-center">
              <Icon name="Video" size={64} className="text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">Mock Interview Sessions</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Practice system design interviews in a realistic environment. Get real-time feedback 
                and improve your communication skills while solving complex problems.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 border border-border rounded-lg">
                  <Icon name="Clock" size={24} className="text-primary mx-auto mb-2" />
                  <h3 className="font-medium text-foreground mb-1">45-60 Minutes</h3>
                  <p className="text-sm text-muted-foreground">Realistic interview duration</p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <Icon name="MessageCircle" size={24} className="text-primary mx-auto mb-2" />
                  <h3 className="font-medium text-foreground mb-1">Real-time Feedback</h3>
                  <p className="text-sm text-muted-foreground">Get instant guidance and tips</p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <Icon name="BarChart" size={24} className="text-primary mx-auto mb-2" />
                  <h3 className="font-medium text-foreground mb-1">Performance Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track your improvement over time</p>
                </div>
              </div>
              
              <Button
                size="lg"
                onClick={handleStartMockInterview}
                iconName="Video"
                iconPosition="left"
              >
                Start Mock Interview
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'study' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyMaterials.map((material) => (
                <div
                  key={material.id}
                  className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon name={material.icon} size={24} className="text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">{material.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{material.type}</span>
                        <span>•</span>
                        <span>{material.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {material.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-surface border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {userProgress.completed}
                </div>
                <div className="text-muted-foreground">Problems Solved</div>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {userProgress.streak}
                </div>
                <div className="text-muted-foreground">Day Streak</div>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {Math.round((userProgress.completed / userProgress.total) * 100)}%
                </div>
                <div className="text-muted-foreground">Completion Rate</div>
              </div>
            </div>

            {/* Progress Chart Placeholder */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Weekly Progress</h3>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Icon name="BarChart" size={48} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Progress chart will be available soon</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPreparationHub;