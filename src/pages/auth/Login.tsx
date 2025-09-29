import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Tabs,
  message,
  Space,
  Divider
} from 'antd';
import { 
  LockOutlined, 
  PhoneOutlined, 
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import OTPInput from '../../components/auth/OTPInput';

const { Title, Text, Link: AntLink } = Typography;

type LoginMethod = 'phone' | 'admin';

const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [currentStep, setCurrentStep] = useState<'credentials' | 'otp'>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { 
    sendPhoneOTP, 
    signinWithPhone,
    signinAsAdmin
  } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMethodSelect = (method: LoginMethod) => {
    setLoginMethod(method);
    setCurrentStep('credentials');
    form.resetFields();
  };

  const handlePhoneOTPLogin = async (values: { phone: string }) => {
    setIsLoading(true);
    try {
      await sendPhoneOTP(values.phone, 'signin');
      setCurrentStep('otp');
      startResendTimer();
      message.success('OTP sent to your WhatsApp and SMS');
    } catch (error: any) {
      message.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (otp: string) => {
    setIsLoading(true);
    try {
      await signinWithPhone({ phone: form.getFieldValue('phone'), otp });
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      await sendPhoneOTP(form.getFieldValue('phone'), 'signin');
      startResendTimer();
      message.success('OTP resent successfully');
    } catch (error: any) {
      message.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await signinAsAdmin(values);
      message.success('Admin login successful!');
      navigate('/admin');
    } catch (error: any) {
      message.error(error.message || 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCredentialsForm = () => {
    if (loginMethod === 'phone') {
      return (
        <Form
          form={form}
          onFinish={handlePhoneOTPLogin}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^(\+91|91)?[6789]\d{9}$/, message: 'Please enter a valid 10-digit phone number' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="+91 98765 43210"
              size="large"
              onChange={(e) => {
                let value = e.target.value.replace(/[^\d+]/g, '');
                
                // Auto-add +91 if user doesn't include it
                if (value.length > 0 && !value.startsWith('+91')) {
                  if (value.startsWith('91')) {
                    value = '+' + value;
                  } else {
                    value = '+91' + value;
                  }
                }
                
                // Limit to 13 characters (+91 + 10 digits)
                if (value.length > 13) {
                  value = value.substring(0, 13);
                }
                
                e.target.value = value;
                form.setFieldValue('phone', value);
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              block
            >
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      );
    }

    if (loginMethod === 'admin') {
      return (
        <Form
          form={form}
          onFinish={handleAdminLogin}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter admin email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              placeholder="admin@suchbliss.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter admin password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter admin password"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              block
              danger
            >
              Admin Sign In
            </Button>
          </Form.Item>
        </Form>
      );
    }

    return null;
  };

  const renderOTPForm = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={4}>Enter Verification Code</Title>
        <Text type="secondary">
          We've sent a 6-digit code to your WhatsApp and SMS
        </Text>
      </div>

      <OTPInput
        value={form.getFieldValue('otp') || ''}
        length={6}
        onChange={handleOTPVerification}
        disabled={isLoading}
      />

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Text type="secondary">Didn't receive the code? </Text>
        <Button
          type="link"
          onClick={handleResendOTP}
          disabled={resendTimer > 0}
          loading={isLoading}
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
        </Button>
      </div>

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => setCurrentStep('credentials')}
        style={{ marginTop: '1rem' }}
      >
        Back to login
      </Button>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg,rgb(251, 248, 247) 0%,rgb(243, 164, 122) 90%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Title level={2} style={{ marginBottom: '0.5rem' }}>
            Welcome Back
          </Title>
          <Text type="secondary">
            Sign in to continue your yoga journey
          </Text>
        </div>

        {currentStep === 'credentials' ? (
          <div>
            <Tabs
              activeKey={loginMethod}
              onChange={(key) => handleMethodSelect(key as LoginMethod)}
              centered
              style={{ marginBottom: '1.5rem' }}
              items={[
                {
                  key: 'phone',
                  label: 'WhatsApp OTP',
                  children: null
                },
                {
                  key: 'admin',
                  label: 'Admin',
                  children: null
                }
              ]}
            />

            {renderCredentialsForm()}
          </div>
        ) : (
          renderOTPForm()
        )}

        <Divider />

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Text type="secondary">
            Don't have an account?{' '}
            <AntLink href="/register">Sign up</AntLink>
          </Text>
        </div>

        {/* Demo Credentials */}
        <Card 
          size="small" 
          style={{ 
            marginTop: '1.5rem', 
            backgroundColor: '#F0F9FF',
            border: '2px solid #0EA5E9',
            borderRadius: '8px'
          }}
        >
          <Title level={5} style={{ marginBottom: '1rem', color: '#0369A1', textAlign: 'center' }}>
            🚀 Demo Credentials
          </Title>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                block
                style={{ marginBottom: '0.5rem' }}
                onClick={() => {
                  form.setFieldsValue({ phone: '+919863779900' });
                  handlePhoneOTPLogin({ phone: '+919863779900' });
                }}
                loading={isLoading}
              >
                📱 Login as Test User (OTP)
              </Button>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Phone: +919863779900
              </Text>
            </div>
            
            <Divider style={{ margin: '0.5rem 0' }} />
            
            <div style={{ textAlign: 'center' }}>
              <Button
                danger
                size="large"
                block
                style={{ marginBottom: '0.5rem' }}
                onClick={() => {
                  form.setFieldsValue({ 
                    email: 'admin@suchbliss.com',
                    password: 'admin123'
                  });
                  handleAdminLogin({ 
                    email: 'admin@suchbliss.com',
                    password: 'admin123'
                  });
                }}
                loading={isLoading}
              >
                👨‍💼 Login as Admin
              </Button>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Email: admin@suchbliss.com | Password: admin123
              </Text>
            </div>
          </Space>
        </Card>
      </Card>
    </div>
  );
};

export default Login;