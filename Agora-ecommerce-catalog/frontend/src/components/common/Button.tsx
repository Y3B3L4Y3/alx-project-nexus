import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const baseStyles = 'px-12 py-4 rounded font-poppins font-medium text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg';
  
  const variantStyles = {
    primary: 'bg-button-2 text-text hover:bg-hover-button',
    secondary: 'bg-button text-text hover:bg-gray-800',
    success: 'bg-button-1 text-button hover:bg-green-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
      }`}
    >
      {children}
    </button>
  );
};

export default Button;

