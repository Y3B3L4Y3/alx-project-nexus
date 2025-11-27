import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'Continue',
  onButtonClick,
}) => {
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-button-1/10 flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-button-1 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-inter font-semibold text-text-2 mb-3">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-500 font-poppins text-sm mb-8 max-w-[300px] leading-relaxed">
          {message}
        </p>

        {/* Button */}
        <Button onClick={handleClick} variant="primary" className="w-full">
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessDialog;

