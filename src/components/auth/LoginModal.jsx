import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Icon from '../AppIcon';
import authService from '../../utils/authService';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const { signIn, authError, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    github: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result?.success) {
        onClose();
        setFormData({ email: '', password: '' });
        setFormErrors({});
      }
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    
    try {
      const result = await signIn('admin@systemdesign.com', 'admin123');
      
      if (result?.success) {
        onClose();
      }
    } catch (error) {
      console.log('Demo login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      let result;
      if (provider === 'google') {
        result = await authService.signInWithGoogle();
      } else if (provider === 'github') {
        result = await authService.signInWithGitHub();
      }
      
      if (result?.success) {
        // OAuth providers will redirect, so we don't need to handle success here
        // The redirect will happen automatically
      } else {
        // Show error to user if OAuth fails
        console.log(`${provider} login error:`, result?.error);
      }
    } catch (error) {
      console.log(`${provider} login error:`, error);
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Auth Error Display */}
        {authError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <p className="text-sm text-destructive">{authError}</p>
            </div>
          </div>
        )}

        {/* Enhanced Social Login Buttons */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full border-red-200 hover:border-red-300 hover:bg-red-50"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading.google || isSubmitting}
          >
            {socialLoading.google ? (
              <Icon name="Loader2" size={20} className="animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            onClick={() => handleSocialLogin('github')}
            disabled={socialLoading.github || isSubmitting}
          >
            {socialLoading.github ? (
              <Icon name="Loader2" size={20} className="animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            )}
            Continue with GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {/* Demo Account Notice */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm text-primary font-medium">Demo Account Available</p>
              <p className="text-xs text-primary/80 mt-1">
                Use the demo login button below to explore with sample data
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full brand-gradient"
              disabled={isSubmitting}
              iconName={isSubmitting ? "Loader2" : "LogIn"}
              iconPosition="left"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              iconName="Play"
              iconPosition="left"
            >
              Try Demo Account
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;