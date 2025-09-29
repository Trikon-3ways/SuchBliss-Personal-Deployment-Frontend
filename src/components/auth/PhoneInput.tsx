import React from 'react';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
  name?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "98765 43210",
  className = "",
  required = false,
  id = "phone",
  name = "phone"
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleanedValue = e.target.value.replace(/[^\d+]/g, '');
    
    // Auto-add +91 if user doesn't include it
    if (cleanedValue.length > 0 && !cleanedValue.startsWith('+91')) {
      if (cleanedValue.startsWith('91')) {
        cleanedValue = '+' + cleanedValue;
      } else {
        cleanedValue = '+91' + cleanedValue;
      }
    }
    
    // Limit to 13 characters (+91 + 10 digits)
    if (cleanedValue.length > 13) {
      cleanedValue = cleanedValue.substring(0, 13);
    }
    
    onChange(cleanedValue);
  };

  return (
    <div className="relative">
      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
        +91
      </div>
      <input
        type="tel"
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={handleChange}
        className={`w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PhoneInput;
