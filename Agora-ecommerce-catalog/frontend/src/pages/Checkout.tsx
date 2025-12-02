import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { clearCart } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import SuccessDialog from '../components/common/SuccessDialog';
import { useToast } from '../hooks/useToast';

interface BillingDetails {
  firstName: string;
  companyName: string;
  streetAddress: string;
  apartment: string;
  townCity: string;
  phoneNumber: string;
  emailAddress: string;
}

interface FormErrors {
  firstName?: string;
  streetAddress?: string;
  townCity?: string;
  phoneNumber?: string;
  emailAddress?: string;
}

const Checkout: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast, success, error, hideToast } = useToast();
  
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    townCity: '',
    phoneNumber: '',
    emailAddress: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saveInfo, setSaveInfo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cash'>('bank');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!billingDetails.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!billingDetails.streetAddress.trim()) {
      errors.streetAddress = 'Street address is required';
    }
    if (!billingDetails.townCity.trim()) {
      errors.townCity = 'Town/City is required';
    }
    if (!billingDetails.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    if (!billingDetails.emailAddress.trim()) {
      errors.emailAddress = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingDetails.emailAddress)) {
      errors.emailAddress = 'Please enter a valid email';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Please fill in all required fields correctly');
      return;
    }

    if (cartItems.length === 0) {
      error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate order ID
    const newOrderId = `#ORD-${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);
    
    // Clear cart
    dispatch(clearCart());
    
    setIsProcessing(false);
    setShowSuccessDialog(true);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      error('Please enter a coupon code');
      return;
    }
    
    // Simulate coupon validation
    if (couponCode.toUpperCase() === 'SAVE10') {
      success('Coupon applied! You saved 10%');
    } else {
      error('Invalid coupon code');
    }
    setCouponCode('');
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/');
  };

  const inputClassName = (fieldName: keyof FormErrors) => `
    w-full h-[50px] bg-secondary rounded px-4 outline-none transition-all font-poppins
    ${formErrors[fieldName] 
      ? 'ring-2 ring-secondary-2 bg-secondary-2/5' 
      : 'focus:ring-2 focus:ring-secondary-2/30'
    }
  `;

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
          {/* Breadcrumb */}
          <div className="mb-10 md:mb-20 text-sm text-gray-400">
            <Link to="/" className="hover:text-secondary-2 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/cart" className="hover:text-secondary-2 transition-colors">Cart</Link>
            <span className="mx-2">/</span>
            <span className="text-text-2">Checkout</span>
          </div>

          {/* Page Title */}
          <h1 className="text-4xl font-inter font-medium text-text-2 mb-10 md:mb-12">Billing Details</h1>

          <form onSubmit={handlePlaceOrder}>
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-[170px]">
              {/* Left Column - Billing Details Form */}
              <div className="flex-1 max-w-[470px]">
                <div className="flex flex-col gap-6">
                  {/* First Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-base text-gray-400 font-poppins">
                      First Name<span className="text-secondary-2">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={billingDetails.firstName}
                      onChange={handleInputChange}
                      className={inputClassName('firstName')}
                    />
                    {formErrors.firstName && (
                      <span className="text-secondary-2 text-xs">{formErrors.firstName}</span>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="companyName" className="text-base text-gray-400 font-poppins">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={billingDetails.companyName}
                      onChange={handleInputChange}
                      className="w-full h-[50px] bg-secondary rounded px-4 outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all font-poppins"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="streetAddress" className="text-base text-gray-400 font-poppins">
                      Street Address<span className="text-secondary-2">*</span>
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={billingDetails.streetAddress}
                      onChange={handleInputChange}
                      className={inputClassName('streetAddress')}
                    />
                    {formErrors.streetAddress && (
                      <span className="text-secondary-2 text-xs">{formErrors.streetAddress}</span>
                    )}
                  </div>

                  {/* Apartment */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="apartment" className="text-base text-gray-400 font-poppins">
                      Apartment, floor, etc. (optional)
                    </label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={billingDetails.apartment}
                      onChange={handleInputChange}
                      className="w-full h-[50px] bg-secondary rounded px-4 outline-none focus:ring-2 focus:ring-secondary-2/30 transition-all font-poppins"
                    />
                  </div>

                  {/* Town/City */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="townCity" className="text-base text-gray-400 font-poppins">
                      Town/City<span className="text-secondary-2">*</span>
                    </label>
                    <input
                      type="text"
                      id="townCity"
                      name="townCity"
                      value={billingDetails.townCity}
                      onChange={handleInputChange}
                      className={inputClassName('townCity')}
                    />
                    {formErrors.townCity && (
                      <span className="text-secondary-2 text-xs">{formErrors.townCity}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phoneNumber" className="text-base text-gray-400 font-poppins">
                      Phone Number<span className="text-secondary-2">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={billingDetails.phoneNumber}
                      onChange={handleInputChange}
                      className={inputClassName('phoneNumber')}
                    />
                    {formErrors.phoneNumber && (
                      <span className="text-secondary-2 text-xs">{formErrors.phoneNumber}</span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="emailAddress" className="text-base text-gray-400 font-poppins">
                      Email Address<span className="text-secondary-2">*</span>
                    </label>
                    <input
                      type="email"
                      id="emailAddress"
                      name="emailAddress"
                      value={billingDetails.emailAddress}
                      onChange={handleInputChange}
                      className={inputClassName('emailAddress')}
                    />
                    {formErrors.emailAddress && (
                      <span className="text-secondary-2 text-xs">{formErrors.emailAddress}</span>
                    )}
                  </div>

                  {/* Save Information Checkbox */}
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="w-6 h-6 rounded border-gray-300 text-secondary-2 focus:ring-secondary-2 cursor-pointer accent-secondary-2"
                    />
                    <label htmlFor="saveInfo" className="text-base text-text-2 font-poppins cursor-pointer">
                      Save this information for faster check-out next time
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="flex-1 max-w-[527px]">
                {/* Cart Items */}
                <div className="flex flex-col gap-6 mb-8">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4 md:gap-6">
                          <div className="w-[54px] h-[54px] bg-secondary rounded flex items-center justify-center overflow-hidden">
                            <img 
                              src={item.image || '/vite.svg'} 
                              alt={item.title} 
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/vite.svg';
                              }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-poppins text-base text-text-2 truncate max-w-[180px] md:max-w-[250px]">
                              {item.title}
                            </span>
                            <span className="text-sm text-gray-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-poppins text-base text-text-2 font-medium">
                          ${item.price * item.quantity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>Your cart is empty</p>
                      <Link to="/" className="text-secondary-2 hover:underline text-sm mt-2 inline-block">
                        Continue shopping
                      </Link>
                    </div>
                  )}
                </div>

                {/* Order Totals */}
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="font-poppins text-base text-text-2">Subtotal:</span>
                    <span className="font-poppins text-base text-text-2">${subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="font-poppins text-base text-text-2">Shipping:</span>
                    <span className="font-poppins text-base text-button-1 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-poppins text-base text-text-2 font-medium">Total:</span>
                    <span className="font-poppins text-xl text-text-2 font-semibold">${total}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="flex flex-col gap-4 mb-8">
                  {/* Bank Option */}
                  <div className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bank' ? 'border-secondary-2 bg-secondary-2/5' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => setPaymentMethod('bank')}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'bank' ? 'border-secondary-2' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'bank' && (
                          <div className="w-3 h-3 rounded-full bg-secondary-2" />
                        )}
                      </div>
                      <span className="font-poppins text-base text-text-2">Bank / Card</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[42px] h-[28px] bg-[#1A1F71] rounded flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">VISA</span>
                      </div>
                      <div className="w-[42px] h-[28px] bg-gray-100 rounded flex items-center justify-center">
                        <div className="flex -space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        </div>
                      </div>
                      <div className="w-[42px] h-[28px] bg-[#003087] rounded flex items-center justify-center">
                        <span className="text-white text-[6px] font-bold">PayPal</span>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery Option */}
                  <div className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cash' ? 'border-secondary-2 bg-secondary-2/5' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => setPaymentMethod('cash')}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cash' ? 'border-secondary-2' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cash' && (
                          <div className="w-3 h-3 rounded-full bg-secondary-2" />
                        )}
                      </div>
                      <span className="font-poppins text-base text-text-2">Cash on Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 h-[56px] border border-gray-300 rounded-lg px-6 font-poppins text-base outline-none focus:border-secondary-2 transition-all"
                  />
                  <Button 
                    type="button" 
                    variant="primary"
                    onClick={handleApplyCoupon}
                    className="h-[56px] px-8"
                  >
                    Apply Coupon
                  </Button>
                </div>

                {/* Place Order Button */}
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full h-[56px]"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing Order...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessClose}
        title="Order Placed Successfully!"
        message={`Thank you for your order! Your order ${orderId} has been placed and will be processed shortly. You will receive a confirmation email soon.`}
        buttonText="Continue Shopping"
        onButtonClick={handleSuccessClose}
      />

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default Checkout;
