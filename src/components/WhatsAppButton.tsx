import React from 'react';
import { Button, Tooltip } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const WhatsAppButton: React.FC = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in learning more about your yoga classes.");
    const whatsappUrl = `https://wa.me/919863779900?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Tooltip title="Chat on WhatsApp" placement="left">
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<MessageOutlined />}
        onClick={handleWhatsAppClick}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#25D366',
          borderColor: '#25D366',
          width: '56px',
          height: '56px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)'
        }}
        aria-label="Chat on WhatsApp"
      />
    </Tooltip>
  );
};

export default WhatsAppButton;