import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, ArrowRight, CheckCircle2, 
  Server, Laptop, Smartphone, Wifi, Database, 
  ShieldCheck, Activity
} from 'lucide-react';
import Button from '../../components/ui/Button';

// --- VISUAL COMPONENTS ---

// 1. Floating Asset Nodes (Organic Movement)
const AssetNode = ({ icon: Icon, delay, x, y, size = 20 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.15, 0.4, 0.15], 
      y: [0, -20, 0],
      x: [0, 10, 0], // Added gentle horizontal sway
      scale: [1, 1.1, 1]
    }}
    transition={{ 
      duration: 5 + Math.random() * 2, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
    className="absolute text-slate-900/10 pointer-events-none z-0"
    style={{ left: x, top: y }}
  >
    <Icon size={size} />
  </motion.div>
);

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [activeField, setActiveField] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: authError, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      setIsSuccess(true);
      const timer = setTimeout(() => navigate('/dashboard'), 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    setFormErrors({});
    dispatch(loginUser({ email: formData.email, password: formData.password }));
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    // --- PAGE BACKGROUND ---
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-4 sm:p-6">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px]" />

        {/* Floating Background Nodes */}
        <AssetNode icon={Server} x="5%" y="10%" delay={0} size={32} />
        <AssetNode icon={Laptop} x="85%" y="15%" delay={1.5} size={48} />
        <AssetNode icon={Wifi} x="10%" y="80%" delay={0.5} size={40} />
        <AssetNode icon={Database} x="80%" y="75%" delay={2} size={36} />
        <AssetNode icon={Smartphone} x="45%" y="45%" delay={3} size={24} />
      </div>

      {/* --- THE MAIN FRAME --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden flex flex-col lg:flex-row relative z-10 min-h-[600px]"
      >
        
        {/* --- LEFT PANEL: VISUAL STORYTELLING (45%) --- */}
        <div className="hidden lg:flex lg:w-[45%] bg-[#0041C2] relative flex-col justify-center p-12 overflow-hidden">
          
          {/* Animated "Breathing" Background */}
          <motion.div 
            className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 to-[#002B80]"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Noise Overlay */}
          <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
             
          {/* Internal Contrast Nodes */}
          <motion.div 
            className="absolute text-white/10 z-0" 
            style={{top: '15%', left: '15%'}}
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          >
            <Activity size={120} />
          </motion.div>
          
          <motion.div 
             className="absolute text-white/10 z-0" 
             style={{bottom: '10%', right: '10%'}}
             animate={{ y: [0, -20, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
             <ShieldCheck size={80} />
          </motion.div>

          {/* Content Layer (Centered vertically now) */}
          <div className="relative z-10 text-center lg:text-left space-y-8">
            
            {/* Main Title Block */}
            <div className="space-y-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "40px" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 bg-blue-300 mb-6"
              />
              
              <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
                Panasonic ISD <br/>
                <span className="text-blue-200">Asset Management</span>
              </h2>
              
              <p className="text-blue-100/80 text-sm leading-relaxed max-w-xs">
                Monitor, track, and optimize IT resources across the organization through a centralized dashboard.
              </p>
            </div>
            
          </div>
          
          {/* Footer - Absolute bottom */}
          <div className="absolute bottom-8 left-12 right-12 text-[10px] text-blue-200/40 uppercase tracking-widest">
            Panasonic Manufacturing Malaysia Berhad
          </div>
        </div>

        {/* --- RIGHT PANEL: LOGIN FORM (55%) --- */}
        <div className="w-full lg:w-[55%] p-8 lg:p-16 bg-white flex flex-col justify-center relative">
          
          <div className="max-w-[380px] mx-auto w-full">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
              <p className="text-slate-500 text-sm mt-2">Enter your credentials to access your dashboard.</p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {authError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    disabled={loading || isSuccess}
                    className={`w-full bg-slate-50 px-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-300
                      ${activeField === 'email' 
                        ? 'bg-white border-blue-600 shadow-[0_4px_20px_rgba(37,99,235,0.1)]' 
                        : formErrors.email ? 'border-red-200 bg-red-50/50' : 'border-slate-100 hover:border-slate-300'
                      }`}
                    placeholder="admin@panasonic.com"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-opacity duration-200">
                    {formData.email && !formErrors.email && (
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                </div>
                {formErrors.email && (
                  <p className="text-xs text-red-500 ml-1">{formErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    onFocus={() => setActiveField('password')}
                    onBlur={() => setActiveField(null)}
                    disabled={loading || isSuccess}
                    className={`w-full bg-slate-50 px-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-300 pr-12
                      ${activeField === 'password' 
                        ? 'bg-white border-blue-600 shadow-[0_4px_20px_rgba(37,99,235,0.1)]' 
                        : formErrors.password ? 'border-red-200 bg-red-50/50' : 'border-slate-100 hover:border-slate-300'
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-red-500 ml-1">{formErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading || isSuccess}
                  className={`h-14 rounded-xl font-bold text-sm tracking-wide transition-all duration-500 shadow-xl overflow-hidden group relative
                    ${isSuccess 
                      ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' 
                      : 'bg-[#0041C2] hover:bg-blue-700 shadow-blue-900/20'
                    }`}
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      'Authenticating...'
                    ) : isSuccess ? (
                      <>Access Granted <CheckCircle2 className="w-5 h-5" /></>
                    ) : (
                      <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </div>
                  
                  {/* Hover Shine Effect */}
                  {!isSuccess && !loading && (
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-xs">
                Authorized Personnel Only. <br/>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;