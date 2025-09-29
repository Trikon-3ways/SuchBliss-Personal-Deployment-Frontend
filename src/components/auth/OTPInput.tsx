import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  length, 
  value, 
  onChange, 
  disabled = false, 
  autoFocus = false 
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    // Update internal state when value prop changes
    const otpArray = (value || '').split('').slice(0, length);
    while (otpArray.length < length) {
      otpArray.push('');
    }
    setOtp(otpArray);
  }, [value, length]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    const otpValue = newOtp.join('');
    
    // Only call onChange when OTP is complete (all digits filled)
    if (otpValue.length === length) {
      onChange(otpValue);
    }

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      if (otp[index]) {
        // Clear current input
        newOtp[index] = '';
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = '';
        inputRefs.current[index - 1]?.focus();
      }
      
      setOtp(newOtp);
      onChange(newOtp.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newOtp = pastedData.split('');
    
    while (newOtp.length < length) {
      newOtp.push('');
    }
    
    setOtp(newOtp);
    
    // Only call onChange if the pasted data is complete (length matches)
    if (pastedData.length === length) {
      onChange(pastedData);
    }
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
            disabled
              ? 'bg-gray-100 border-gray-300 text-gray-500'
              : digit
              ? 'border-blue-500 bg-blue-50 text-blue-600 focus:ring-blue-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default OTPInput;