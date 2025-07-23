import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fix side menu readjustment behavior
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        onToggle(); // Close sidebar on mobile when content needs to readjust
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onToggle]);

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: 'Home',
      isActive: location.pathname === '/'
    },
    {
      name: 'AI Generator',
      href: '/ai-design-generator',
      icon: 'Zap',
      isActive: location.pathname === '/ai-design-generator'
    },
    {
      name: 'Canvas Studio',
      href: '/canvas-studio',
      icon: 'PenTool',
      isActive: location.pathname === '/canvas-studio'
    },
    {
      name: 'Workspace',
      href: '/collaboration-workspace',
      icon: 'Users',
      isActive: location.pathname === '/collaboration-workspace'
    },
    {
      name: 'Community',
      href: '/community-gallery',
      icon: 'Globe',
      isActive: location.pathname === '/community-gallery'
    },
    {
      name: 'Components',
      href: '/component-library-marketplace',
      icon: 'Package',
      isActive: location.pathname === '/component-library-marketplace'
    }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-surface border-r border-border z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        } md:relative md:translate-x-0 ${isOpen ? 'md:w-64' : 'md:w-0'}`}
      >
        <div className={`h-full flex flex-col ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'} transition-opacity duration-300`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Layers" size={20} className="text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">SystemFlow</span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-muted rounded-md transition-colors md:hidden"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User Section */}
          {user && userProfile && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {userProfile.full_name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {userProfile.role}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  iconName="User"
                  iconPosition="left"
                  onClick={() => {
                    navigate('/profile');
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className="justify-start"
                >
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => {
                    navigate('/settings');
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className="justify-start"
                >
                  Settings
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              SystemFlow Designer v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;