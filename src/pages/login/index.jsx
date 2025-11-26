import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Zap, Users, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - in real app, this would be actual auth
      localStorage?.setItem('user', JSON.stringify({
        id: 1,
        name: 'Sarah Johnson',
        email: formData?.email,
        role: 'it_staff'
      }));
      
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e?.target?.value
    }));
    
    // Clear field error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with multi-factor authentication support'
    },
    {
      icon: Zap,
      title: 'Real-time Tracking',
      description: 'Monitor asset status, location, and lifecycle in real-time'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Streamline workflows with role-based access controls'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 bg-background/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Panel - Branding & Features */}
        <div className="bg-primary text-primary-foreground p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AssetPro</h1>
                <p className="text-primary-foreground/80 text-sm">Asset Management System</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Welcome Back to Your
                  <br />
                  Asset Dashboard
                </h2>
                <p className="text-primary-foreground/80 text-lg">
                  Manage your IT assets with confidence. Track, monitor, and optimize your technology resources efficiently.
                </p>
              </div>

              <div className="space-y-4">
                {features?.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature?.title}</h3>
                      <p className="text-primary-foreground/80 text-sm">{feature?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-primary-foreground/60 text-sm">
            © 2024 AssetPro. Secure asset management for modern enterprises.
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Sign In</h2>
              <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
            </div>

            {errors?.general && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{errors?.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="sarah.johnson@company.com"
                  value={formData?.email}
                  onChange={handleInputChange('email')}
                  error={errors?.email}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData?.password}
                    onChange={handleInputChange('password')}
                    error={errors?.password}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{' '}
                <button className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Contact Administrator
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Email:</strong> demo@assetpro.com</p>
                <p><strong>Password:</strong> demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;