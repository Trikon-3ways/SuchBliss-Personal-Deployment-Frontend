import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Button, 
  Tag, 
  Space, 
  Avatar,
  Progress,
  List,
  Card
} from 'antd';
import { 
  BookOutlined, 
  TrophyOutlined, 
  UserOutlined, 
  RiseOutlined, 
  ClockCircleOutlined, 
  PlayCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { liveClasses } from '../data/mockData';
import { format, isAfter } from 'date-fns';

const { Title, Paragraph, Text } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#F9FAFB', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2} style={{ color: '#1F2937', marginBottom: '1rem' }}>
            Please log in to access your dashboard
          </Title>
          <Button type="primary" size="large">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentTime = new Date();
  const upcomingClasses = liveClasses.filter(liveClass => 
    isAfter(new Date(liveClass.scheduledAt), currentTime)
  ).slice(0, 3);

  const completedClasses = 12; // Mock data
  const totalHours = 45; // Mock data
  const certificates = 3; // Mock data
  const currentStreak = 7; // Mock data

  const achievements = [
    { title: 'First Week Complete', description: 'Completed 7 days of practice', icon: <TrophyOutlined />, progress: 100 },
    { title: 'Meditation Master', description: '30 minutes of meditation', icon: <ClockCircleOutlined />, progress: 80 },
    { title: 'Flexibility Goal', description: 'Touch your toes', icon: <RiseOutlined />, progress: 60 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Welcome Section */}
        <Card 
          style={{ 
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            color: 'white',
            border: 'none',
            marginBottom: '2rem'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: 'white', marginBottom: '0.5rem' }}>
              Welcome back, {user.name}!
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem', marginBottom: '2rem' }}>
              Continue your learning journey
            </Paragraph>
          </div>
        </Card>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '2rem' }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <Statistic
                title="Classes Completed"
                value={completedClasses}
                prefix={<BookOutlined style={{ color: '#F97316' }} />}
                suffix={
                  <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                    this month
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <Statistic
                title="Total Hours"
                value={totalHours}
                prefix={<ClockCircleOutlined style={{ color: '#10B981' }} />}
                suffix={
                  <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                    hours
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <Statistic
                title="Certificates"
                value={certificates}
                prefix={<TrophyOutlined style={{ color: '#F59E0B' }} />}
                suffix={
                  <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                    earned
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <Statistic
                title="Current Streak"
                value={currentStreak}
                prefix={<RiseOutlined style={{ color: '#EF4444' }} />}
                suffix={
                  <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                    days
                  </Text>
                }
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Upcoming Classes */}
          <Col xs={24} lg={16}>
            <Card title="Upcoming Classes" style={{ marginBottom: '1.5rem' }}>
              <List
                dataSource={upcomingClasses}
                renderItem={(liveClass) => (
                  <List.Item
                    actions={[
                      <Button type="primary" icon={<PlayCircleOutlined />}>
                        Join Now
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<PlayCircleOutlined />} 
                          style={{ backgroundColor: '#F97316' }}
                        />
                      }
                      title={liveClass.title}
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary">
                            {format(new Date(liveClass.scheduledAt), 'MMM dd, yyyy • h:mm a')}
                          </Text>
                          <Text>{liveClass.description}</Text>
                          <Space>
                            <Tag color="blue">{liveClass.instructor}</Tag>
                            <Tag color="green">{liveClass.duration} min</Tag>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Progress Section */}
            <Card title="Your Progress" style={{ marginBottom: '1.5rem' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <Text strong>Yoga Fundamentals</Text>
                    <Text type="secondary">75%</Text>
                  </div>
                  <Progress percent={75} strokeColor="#F97316" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <Text strong>Meditation Practice</Text>
                    <Text type="secondary">60%</Text>
                  </div>
                  <Progress percent={60} strokeColor="#10B981" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <Text strong>Flexibility Training</Text>
                    <Text type="secondary">40%</Text>
                  </div>
                  <Progress percent={40} strokeColor="#3B82F6" />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Achievements */}
            <Card title="Achievements" style={{ marginBottom: '1.5rem' }}>
              <List
                dataSource={achievements}
                renderItem={(achievement) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={achievement.icon} 
                          style={{ backgroundColor: '#FEF3C7' }}
                        />
                      }
                      title={achievement.title}
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary">{achievement.description}</Text>
                          <Progress 
                            percent={achievement.progress} 
                            size="small" 
                            strokeColor="#F59E0B"
                          />
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" block icon={<PlayCircleOutlined />}>
                  <Link to="/live-classes">Join Live Class</Link>
                </Button>
                <Button block icon={<UserOutlined />}>
                  <Link to="/referrals">Invite Friends</Link>
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;