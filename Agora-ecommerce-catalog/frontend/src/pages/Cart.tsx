import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { toast, success, hideToast } = useToast();
  
  const [itemToRemove, setItemToRemove] = useState<{ id: number; title: string } | null>(null);
  const [couponCode, setCouponCode] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleQuantityIncrease = (id: number, currentQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
  };

  const handleQuantityDecrease = (id: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
    }
  };

  const handleRemoveClick = (id: number, title: string) => {
    setItemToRemove({ id, title });
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      dispatch(removeFromCart(itemToRemove.id));
      success(`"${itemToRemove.title}" removed from cart`);
      setItemToRemove(null);
    }
  };

  const handleUpdateCart = () => {
    success('Cart updated successfully!');
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      success(`Coupon "${couponCode}" applied!`);
      setCouponCode('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1170px] mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-6">
          <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-3xl font-inter font-semibold text-text-2">Your Cart is Empty</h2>
          <p className="text-gray-500 max-w-md">Looks like you haven't added anything to your cart yet. Start shopping to fill it up!</p>
          <Link to="/">
            <Button variant="primary">Return to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1170px] mx-auto px-4 py-10 md:py-20">
        {/* Breadcrumb */}
        <div className="mb-10 md:mb-20 text-sm text-gray-500">
          <Link to="/" className="hover:text-secondary-2 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-text-2 font-medium">Cart</span>
        </div>

        {/* Cart Table */}
        <div className="flex flex-col gap-10">
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-white shadow-[0_1px_13px_rgba(0,0,0,0.05)]">
                  <th className="text-left font-poppins text-base font-normal py-6 px-6 md:px-10">Product</th>
                  <th className="text-center font-poppins text-base font-normal py-6 px-4">Price</th>
                  <th className="text-center font-poppins text-base font-normal py-6 px-4">Quantity</th>
                  <th className="text-right font-poppins text-base font-normal py-6 px-6 md:px-10">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className="bg-white shadow-[0_1px_13px_rgba(0,0,0,0.05)] mt-10 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-6 px-6 md:px-10">
                      <div className="flex items-center gap-4 md:gap-5">
                        {/* Remove Button */}
                        <div className="relative">
                          <button 
                            onClick={() => handleRemoveClick(item.id, item.title)}
                            className="absolute -top-2 -left-2 bg-secondary-2 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-md"
                            aria-label="Remove item"
                            title="Remove from cart"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {/* Product Image */}
                          <div className="w-12 h-12 md:w-[54px] md:h-[54px] bg-secondary rounded flex items-center justify-center overflow-hidden">
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
                        </div>
                        {/* Product Title */}
                        <span className="font-poppins text-sm md:text-base text-text-2 truncate max-w-[150px] md:max-w-[200px]">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <span className="font-poppins text-base text-text-2">${item.price}</span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          {/* Decrease Button */}
                          <button 
                            onClick={() => handleQuantityDecrease(item.id, item.quantity)}
                            className="w-8 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-text-2 hover:text-secondary-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          {/* Quantity Display */}
                          <span className="w-10 h-10 flex items-center justify-center font-poppins text-base text-text-2 border-x border-gray-300 bg-white">
                            {item.quantity.toString().padStart(2, '0')}
                          </span>
                          {/* Increase Button */}
                          <button 
                            onClick={() => handleQuantityIncrease(item.id, item.quantity)}
                            className="w-8 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-text-2 hover:text-secondary-2"
                            aria-label="Increase quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 md:px-10 text-right">
                      <span className="font-poppins text-base text-text-2 font-medium">
                        ${(item.price * item.quantity).toFixed(0)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons & Cart Total */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mt-6">
            {/* Left Side Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/">
                <button className="px-12 py-4 border border-gray-400 rounded font-poppins font-medium text-base text-text-2 hover:bg-gray-50 hover:border-gray-500 transition-all duration-200 shadow-sm">
                  Return To Shop
                </button>
              </Link>
              <button 
                onClick={handleUpdateCart}
                className="px-12 py-4 border border-gray-400 rounded font-poppins font-medium text-base text-text-2 hover:bg-gray-50 hover:border-gray-500 transition-all duration-200 shadow-sm"
              >
                Update Cart
              </button>
            </div>

            {/* Cart Total */}
            <div className="w-full lg:w-[470px] border-2 border-text-2 rounded p-6 md:p-8">
              <h3 className="font-inter font-medium text-xl text-text-2 mb-6">Cart Total</h3>
              
              <div className="flex flex-col gap-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="font-poppins text-base text-text-2">Subtotal:</span>
                  <span className="font-poppins text-base text-text-2">${subtotal.toFixed(0)}</span>
                </div>
                
                {/* Shipping */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="font-poppins text-base text-text-2">Shipping:</span>
                  <span className="font-poppins text-base text-text-2">
                    {shipping === 0 ? 'Free' : `$${shipping}`}
                  </span>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center pb-4">
                  <span className="font-poppins text-base text-text-2 font-medium">Total:</span>
                  <span className="font-poppins text-base text-text-2 font-medium">${total.toFixed(0)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="flex justify-center mt-4">
                <Link to="/checkout" className="w-full md:w-auto">
                  <Button 
                    variant="primary" 
                    className="w-full"
                  >
                    Proceed to checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <input 
              type="text" 
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 max-w-[300px] px-6 py-4 border border-gray-400 rounded font-poppins text-base outline-none focus:border-secondary-2 transition-colors"
            />
            <Button variant="primary" onClick={handleApplyCoupon}>
              Apply Coupon
            </Button>
          </div>
        </div>
      </div>

      {/* Confirm Remove Dialog */}
      <ConfirmDialog
        isOpen={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={handleConfirmRemove}
        title="Remove Item"
        message={`Are you sure you want to remove "${itemToRemove?.title}" from your cart?`}
        confirmText="Remove"
        cancelText="Keep"
        variant="danger"
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

export default Cart;
