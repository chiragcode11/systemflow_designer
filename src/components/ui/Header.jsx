import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';

const Header = () => {
  const { user, userProfile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Layers" size={20} className="text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                SystemFlow Designer
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to="/ai-design-generator"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                AI Generator
              </Link>
              <Link
                to="/interactive-canvas-studio"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Canvas Studio
              </Link>
              <Link
                to="/collaboration-workspace"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Workspace
              </Link>
              <Link
                to="/community-gallery"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/component-library-marketplace"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Components
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      {userProfile?.full_name ? (
                        <span className="text-sm font-medium text-primary-foreground">
                          {userProfile.full_name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <Icon name="User" size={16} className="text-primary-foreground" />
                      )}
                    </div>
                    <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg py-2">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {userProfile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                        {userProfile?.role && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full capitalize">
                            {userProfile.role}
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon name="Settings" size={16} />
                          <span>Profile Settings</span>
                        </Link>
                        <Link
                          to="/collaboration-workspace"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon name="FolderOpen" size={16} />
                          <span>My Projects</span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Icon name="LogOut" size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowLoginModal(true)}
                    iconName="LogIn"
                    iconPosition="left"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    className="brand-gradient"
                    onClick={() => setShowSignupModal(true)}
                    iconName="UserPlus"
                    iconPosition="left"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Menu" size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
      
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default Header;