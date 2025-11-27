import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showBanner, setShowBanner] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && !/^\+?[\d\s-]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email or phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      alert('Account created successfully!');
      navigate('/login');
    }, 1500);
  };

  const handleGoogleSignup = () => {
    alert('Google signup coming soon!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header Banner */}
      {showBanner && (
        <div className="bg-button text-text py-3 relative animate-fade-in">
          <div className="max-w-[1170px] mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 flex-1 justify-center md:justify-start">
              <span className="text-xs md:text-sm">Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</span>
              <Link to="/" className="font-semibold underline ml-2 hover:text-button-1 transition-colors">
                ShopNow
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-button-1 transition-colors">
              <span>English</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              className="absolute right-4 md:relative md:right-0 hover:text-secondary-2 transition-colors ml-4"
              aria-label="Close banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Separator Line */}
      <div className="w-full h-[1px] bg-gray-200" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#CBE4E8] items-center justify-center relative overflow-hidden min-h-[600px]">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Shopping Cart Illustration */}
            <div className="relative">
              <svg className="w-[500px] h-[400px] text-white opacity-90" viewBox="0 0 500 400" fill="none">
                {/* Cart Body */}
                <rect x="80" y="120" width="340" height="180" rx="20" fill="currentColor" />
                {/* Cart Handle */}
                <path d="M50 160 L80 160 L100 120" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
                {/* Wheels */}
                <circle cx="140" cy="320" r="30" fill="currentColor" />
                <circle cx="360" cy="320" r="30" fill="currentColor" />
                {/* Inner wheel */}
                <circle cx="140" cy="320" r="15" fill="#CBE4E8" />
                <circle cx="360" cy="320" r="15" fill="#CBE4E8" />
                {/* Products in cart */}
                <rect x="120" y="80" width="80" height="100" rx="8" fill="#E8A87C" />
                <rect x="220" y="60" width="70" height="120" rx="8" fill="#85DCB0" />
                <rect x="310" y="70" width="75" height="110" rx="8" fill="#F7DC6F" />
                {/* Phone in front */}
                <rect x="200" y="180" width="100" height="180" rx="12" fill="#2C3E50" />
                <rect x="210" y="195" width="80" height="140" rx="4" fill="#3498DB" />
                <circle cx="250" cy="350" r="8" fill="#95A5A6" />
              </svg>
              {/* Decorative elements */}
              <div className="absolute top-10 left-20 w-8 h-8 bg-white/30 rounded-full animate-bounce-slow" />
              <div className="absolute bottom-20 right-10 w-6 h-6 bg-white/40 rounded-full animate-pulse" />
              <div className="absolute top-32 right-32 w-4 h-4 bg-white/50 rounded-full animate-bounce-slow" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-20 lg:px-16 bg-white">
          <div className="w-full max-w-[370px] animate-fade-in">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-inter font-medium text-text-2 mb-6 tracking-wide">
                Create an account
              </h1>
              <p className="text-base font-poppins text-text-2">
                Enter your details below
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Name Input */}
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <p className="text-secondary-2 text-sm mt-1 animate-fade-in">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <Input
                  type="text"
                  name="email"
                  placeholder="Email or Phone Number"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-secondary-2 text-sm mt-1 animate-fade-in">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <p className="text-secondary-2 text-sm mt-1 animate-fade-in">{errors.password}</p>
                )}
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Google Signup Button */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-4 py-4 px-6 border border-gray-400/40 rounded hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Google Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                  <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z" />
                  <path fill="#FBBC04" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
                  <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
                </svg>
                <span className="text-base font-poppins text-text-2">Sign up with Google</span>
              </button>

              {/* Login Link */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <span className="text-base font-poppins text-text-2 opacity-70">
                  Already have account?
                </span>
                <Link
                  to="/login"
                  className="text-base font-poppins font-medium text-text-2 opacity-70 hover:opacity-100 transition-opacity relative group"
                >
                  Log in
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-text-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Signup;
