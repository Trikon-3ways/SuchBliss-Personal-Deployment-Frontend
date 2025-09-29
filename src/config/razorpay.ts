// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  key_id: '', // Will be set dynamically from backend
  currency: 'INR',
  name: 'SuchBliss',
  description: 'Yoga Classes Subscription',
  image: '/logo.png', // Add your logo path
  theme: {
    color: '#2563EB'
  },
  prefill: {
    // These will be populated dynamically
    name: '',
    email: '',
    contact: ''
  },
  notes: {
    // These will be populated dynamically
    plan_id: '',
    user_id: ''
  },
  modal: {
    ondismiss: function() {
      console.log('Payment modal dismissed');
    }
  }
};

// Razorpay Script Loading Utility
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Razorpay Payment Options Interface
export interface RazorpayPaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email?: string;
    contact: string;
  };
  notes: {
    plan_id: string;
    user_id: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}
