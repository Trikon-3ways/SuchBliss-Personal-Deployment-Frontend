import React from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Button
} from 'antd';
import { 
  BookOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link: AntLink } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quick: [
      { label: 'Pricing', to: '/pricing' },
      { label: 'Blog', to: '/blog' },
      { label: 'Events', to: '/events' },
      { label: 'Contact', to: '/contact' }
    ], 
    support: [
      { label: 'Help Center', to: '/help' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Refund Policy', to: '/refund' }
    ]
  };

  return (
    <AntFooter 
      style={{ 
        background: '#1F2937', 
        color: 'white',
        padding: '3rem 0 1rem'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <Row gutter={[48, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={12} md={6}>
            <Space align="center" style={{ marginBottom: '1rem' }}>
              <BookOutlined style={{ fontSize: '24px', color: '#F97316' }} />
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                SuchBliss
              </Title>
            </Space>
            <Text style={{ color: '#9CA3AF', lineHeight: 1.6 }}>
              Transform your life through authentic yoga practices. Join our community of mindful practitioners and discover inner peace.
            </Text>
            <div style={{ marginTop: '1.5rem' }}>
              <Space size="middle">
                <Button 
                  type="text" 
                  icon={<FacebookOutlined />} 
                  style={{ color: '#9CA3AF' }}
                />
                <Button 
                  type="text" 
                  icon={<TwitterOutlined />} 
                  style={{ color: '#9CA3AF' }}
                />
                <Button 
                  type="text" 
                  icon={<InstagramOutlined />} 
                  style={{ color: '#9CA3AF' }}
                />
                <Button 
                  type="text" 
                  icon={<YoutubeOutlined />} 
                  style={{ color: '#9CA3AF' }}
                />
              </Space>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '1rem' }}>
              Quick Links
            </Title>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {footerLinks.quick.map((link) => (
                <AntLink 
                  key={link.to}
                  style={{ color: '#9CA3AF', display: 'block' }}
                  href={link.to}
                >
                  {link.label}
                </AntLink>
              ))}
            </Space>
          </Col> 

          {/* Contact Info */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '1rem' }}>
              Contact Us
            </Title>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF' }}>
                <MailOutlined />
                <Text style={{ color: '#9CA3AF' }}>info@suchbliss.com</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF' }}>
                <PhoneOutlined />
                <Text style={{ color: '#9CA3AF' }}>+1 (555) 123-4567</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF' }}>
                <EnvironmentOutlined />
                <Text style={{ color: '#9CA3AF' }}>123 Yoga Street, Peace City</Text>
              </div>
            </Space>
          </Col>
        </Row>

        {/* Copyright */}
        <div style={{ 
          textAlign: 'center', 
          paddingTop: '2rem', 
          borderTop: '1px solid #374151',
          marginTop: '2rem'
        }}>
          <Text style={{ color: '#6B7280' }}>
            © {currentYear} SuchBliss. All rights reserved. | Made with ❤️ for spiritual growth
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;