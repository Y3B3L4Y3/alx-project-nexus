import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useRegisterMutation } from '../api/authApi';
import Button from '../components/common/Button';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerApi, { isLoading }] = useRegisterMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isValid = firstName.trim() !== '' && lastName.trim() !== '' && /.+@.+\..+/.test(email) && password.length >= 8;

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setErrorMessage('');

    try {
      const result = await registerApi({
        email,
        password,
        firstName,
        lastName,
      }).unwrap();

      if (result.success && result.data) {
        dispatch(login({
          user: result.data.user,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        }));
        navigate('/products');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage(err?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Illustration / Image - hidden on small screens */}
        <div className="hidden lg:block">
          <div className="w-full h-[500px] rounded bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiNlMmU4ZjAiLz48L2c+PC9zdmc+')] opacity-50"></div>
              <div className="relative flex flex-col items-center gap-6">
                <div className="text-8xl animate-bounce-slow">🛒</div>
                <div className="flex gap-4">
                  <span className="text-5xl">👕</span>
                  <span className="text-5xl">👟</span>
                  <span className="text-5xl">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full max-w-[480px] mx-auto lg:mx-0">
          <h1 className="text-2xl md:text-4xl font-inter font-semibold text-text-2">Create an account</h1>
          <p className="mt-3 text-sm md:text-base text-text-2/70">Enter your details below</p>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 md:mt-10 flex flex-col gap-6">
            {/* First Name */}
            <div className="flex flex-col gap-2">
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border-b border-gray-300 px-0 py-3 text-base outline-none focus:border-secondary-2 transition-colors bg-transparent placeholder:text-gray-400"
                autoComplete="given-name"
                disabled={isLoading}
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border-b border-gray-300 px-0 py-3 text-base outline-none focus:border-secondary-2 transition-colors bg-transparent placeholder:text-gray-400"
                autoComplete="family-name"
                disabled={isLoading}
              />
            </div>

            {/* Email or Phone */}
            <div className="flex flex-col gap-2">
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 px-0 py-3 text-base outline-none focus:border-secondary-2 transition-colors bg-transparent placeholder:text-gray-400"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 8 chars, 1 uppercase, 1 number, 1 special)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-gray-300 px-0 py-3 pr-10 text-base outline-none focus:border-secondary-2 transition-colors bg-transparent placeholder:text-gray-400"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-secondary-2 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-4" disabled={!isValid || isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Google signup */}
            <button
              type="button"
              className="w-full border border-gray-300 rounded py-4 flex items-center justify-center gap-4 hover:bg-gray-50 transition-colors"
              onClick={() => alert('Continue with Google')}
            >
              <svg className="w-6 h-6" viewBox="0 0 533.5 544.3" aria-hidden="true">
                <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.5-37-4.6-54.8H272v103.8h147.1c-6.4 34.6-25.9 63.9-55.2 83.5v69.3h89.2c52.3-48.1 80.4-119 80.4-201.8z"/>
                <path fill="#34A853" d="M272 544.3c73.5 0 135.2-24.3 180.3-66l-89.2-69.3c-24.7 16.6-56.3 26.5-91.1 26.5-70 0-129.3-47.2-150.5-110.6H30.8v69.7C75.6 486.2 167.8 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M121.5 324.8c-10.4-30.6-10.4-63.6 0-94.2V160.9H30.8c-41.9 83.9-41.9 182.3 0 266.2l90.7-69.7z"/>
                <path fill="#EA4335" d="M272 107.7c39.9-.6 78.4 14.7 107.8 42.6l80.4-80.4C408.4 21.5 343.6-.8 272 0 167.8 0 75.6 57.9 30.8 160.9l90.7 69.7C142.6 167.2 202 107.7 272 107.7z"/>
              </svg>
              <span className="text-base text-text-2">Sign up with Google</span>
            </button>

            <p className="text-base text-center text-text-2/70 mt-4">
              Already have account?{' '}
              <Link to="/login" className="text-text-2 font-medium hover:underline underline-offset-4 border-b border-gray-400 pb-0.5">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
