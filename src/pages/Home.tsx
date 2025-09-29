import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Carousel, 
  Button, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Tag, 
  Avatar,
  Rate,
  Statistic
} from 'antd';
import { 
  PlayCircleOutlined, 
  UserOutlined,  
} from '@ant-design/icons'; 

const { Title, Paragraph, Text } = Typography;

const heroSlides = [
  {
    id: 1,
    title: 'Transform Your Life with Yoga',
    subtitle: 'Live Interactive Sessions',
    description: 'Join thousands of practitioners learning authentic yoga with experienced guru in real-time.',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 2,
    title: 'Guru-Led Live Sessions',
    subtitle: 'Learn from Yoga Masters',
    description: 'Get personalized guidance from experienced yoga guru in interactive live sessions.',
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1200',
 
  },
  {
    id: 3,
    title: 'Spiritual Growth',
    subtitle: 'Mind-Body-Soul Harmony',
    description: 'Develop inner peace and spiritual awareness through authentic yoga practices.',
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=1200',
 
  }
];

const Home: React.FC = () => {

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Slider */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <Carousel
          autoplay
          autoplaySpeed={5000}
          effect="fade"
          style={{ height: '100%' }}
        >
          {heroSlides.map((slide) => (
            <div key={slide.id}>
              <div
                style={{
                  height: '100vh',
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)'
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    color: 'white',
                    maxWidth: '800px',
                    padding: '0 2rem'
                  }}
                >
                  <Tag color="orange" style={{ marginBottom: '1rem', fontSize: '1rem', padding: '0.5rem 1rem' }}>
                    {slide.subtitle}
                  </Tag>
                  <Title level={1} style={{ color: 'white', fontSize: '3.5rem', marginBottom: '1.5rem' }}>
                    {slide.title}
                  </Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: '2rem' }}>
                    {slide.description}
                  </Paragraph>
                  <Space size="large">
                    <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
                      <Link to="/register">Start Your Journey Today</Link>
                    </Button>
                    <Button size="large" style={{ color: '#f97316', borderColor: 'white' }}>
                      <Link to="/pricing">View Pricing</Link>
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Title level={2} style={{ marginBottom: '1rem' }}>
              Why Choose SuchBliss?
            </Title>
            <Paragraph style={{ fontSize: '1.125rem', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
              Experience authentic yoga with our comprehensive platform designed for spiritual growth and physical wellness.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card style={{ textAlign: 'center', height: '100%', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <Avatar 
                  size={80} 
                  icon={<PlayCircleOutlined />} 
                  style={{ backgroundColor: '#F97316', marginBottom: '1.5rem' }}
                />
                <Title level={4} style={{ marginBottom: '1rem' }}>Live Interactive Sessions</Title>
                <Paragraph style={{ color: '#6B7280' }}>
                  Join real-time yoga sessions with experienced guru and get personalized guidance.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={{ textAlign: 'center', height: '100%', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <Avatar 
                  size={80} 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#10B981', marginBottom: '1.5rem' }}
                />
                <Title level={4} style={{ marginBottom: '1rem' }}>Expert Guru</Title>
                <Paragraph style={{ color: '#6B7280' }}>
                  Learn from certified yoga master with years of experience in traditional practices.
                </Paragraph>
              </Card>
            </Col> 
          </Row>
        </div>
      </section>
  

      {/* CTA Section */}
      <section style={{ padding: '5rem 0', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <Title level={2} style={{ marginBottom: '1rem' }}>
            Ready to Start Your Yoga Journey?
          </Title>
          <Paragraph style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '2rem' }}>
            Join thousands of practitioners who have transformed their lives through authentic yoga practices.
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button size="large">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </Space>
        </div>
      </section>
    </div>
  );
};

export default Home;