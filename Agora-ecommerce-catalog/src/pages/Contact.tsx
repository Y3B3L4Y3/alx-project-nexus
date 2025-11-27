import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-10 md:mb-20">
          <Link to="/" className="hover:text-secondary-2 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-text-2">Contact</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[30px]">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded shadow-[0_1px_13px_rgba(0,0,0,0.05)] p-8 md:p-10">
              {/* Call To Us */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-secondary-2 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-poppins font-medium text-base text-text-2">Call To Us</h3>
                </div>
                <p className="text-sm text-text-2 mb-4">We are available 24/7, 7 days a week.</p>
                <p className="text-sm text-text-2">Phone: +8801611112222</p>
              </div>

              {/* Write To Us */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-secondary-2 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-poppins font-medium text-base text-text-2">Write To Us</h3>
                </div>
                <p className="text-sm text-text-2 mb-4">Fill out our form and we will contact you within 24 hours.</p>
                <p className="text-sm text-text-2 mb-2">Emails: customer@exclusive.com</p>
                <p className="text-sm text-text-2">Emails: support@exclusive.com</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded shadow-[0_1px_13px_rgba(0,0,0,0.05)] p-8 md:p-10">
              <form onSubmit={handleSubmit}>
                {/* Top Row - Name, Email, Phone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name *"
                      className={`w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400 ${
                        errors.name ? 'ring-2 ring-secondary-2' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-secondary-2 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email *"
                      className={`w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400 ${
                        errors.email ? 'ring-2 ring-secondary-2' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-secondary-2 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your Phone"
                      className="w-full h-[50px] bg-secondary rounded px-4 font-poppins text-base outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="mb-6">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message *"
                    rows={8}
                    className={`w-full bg-secondary rounded px-4 py-4 font-poppins text-base outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all placeholder:text-gray-400 resize-none ${
                      errors.message ? 'ring-2 ring-secondary-2' : ''
                    }`}
                  />
                  {errors.message && (
                    <p className="text-secondary-2 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

