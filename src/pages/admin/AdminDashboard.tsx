import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Tabs, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Form, 
  Input, 
  Switch,
  Typography,
  Spin,
  message,
  Select,
  DatePicker,
  InputNumber,
} from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  BookOutlined, 
  RiseOutlined, 
  SettingOutlined, 
  FileTextOutlined, 
  CreditCardOutlined,
  ExportOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import VideoScheduleDialog from '../../components/admin/VideoScheduleDialog';
import BlogCreateDialog from '../../components/admin/BlogCreateDialog';
import { videoAPI, VideoScheduleData, blogAPI, adminAPI, DashboardStats, AdminUser, AdminOrder, ContentAnalytics } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [videoScheduleVisible, setVideoScheduleVisible] = useState(false);
  const [blogCreateVisible, setBlogCreateVisible] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Real-time data state
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [usersPagination, setUsersPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [ordersPagination, setOrdersPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  
  // Filters
  const [userFilters, setUserFilters] = useState({ search: '', status: '', plan: '' });
  const [orderFilters, setOrderFilters] = useState({ status: '', plan: '' });

  // Data fetching functions
  const fetchDashboardStats = async () => {
    try {
      setDataLoading(true);
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      message.error('Failed to fetch dashboard statistics');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchUsers = async (page = 1, filters = userFilters) => {
    try {
      setDataLoading(true);
      const response = await adminAPI.getUsers({
        page,
        limit: usersPagination.pageSize,
        ...filters
      });
      if (response.success) {
        setUsers(response.data.users);
        setUsersPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchOrders = async (page = 1, filters = orderFilters) => {
    try {
      setDataLoading(true);
      const response = await adminAPI.getOrders({
        page,
        limit: ordersPagination.pageSize,
        ...filters
      });
      if (response.success) {
        setOrders(response.data.orders);
        setOrdersPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Failed to fetch orders');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchContentAnalytics = async () => {
    try {
      setDataLoading(true);
      const response = await adminAPI.getContentAnalytics();
      if (response.success) {
        setContentAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching content analytics:', error);
      message.error('Failed to fetch content analytics');
    } finally {
      setDataLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'content') fetchContentAnalytics();
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      if (user.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      
      // Fetch initial data
      fetchDashboardStats();
    }
  }, [user, isLoading, navigate]);

  // Fetch data when tab changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      switch (activeTab) {
        case 'users':
          fetchUsers();
          break;
        case 'orders':
          fetchOrders();
          break;
        case 'content':
          fetchContentAnalytics();
          break;
        default:
          fetchDashboardStats();
      }
    }
  }, [activeTab, user]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (user && user.role === 'admin') {
      const interval = setInterval(() => {
        refreshData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, activeTab]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  const handleVideoSchedule = async (values: VideoScheduleData) => {
    try {
      // Convert dayjs objects to ISO strings for API
      const apiData: VideoScheduleData = {
        ...values,
        scheduleDate:  values.scheduleDate ,
        scheduleTime:  values.scheduleTime ,
      };

      console.log('Sending video data to API:', apiData);
      const response = await videoAPI.scheduleVideo(apiData);
      console.log('Video scheduled successfully:', response);
      setVideoScheduleVisible(false);
       
    } catch (error) {
      console.error('Error scheduling video:', error); 
    }
  };

  const handleScheduleClassClick = () => {
    setVideoScheduleVisible(true);
  };

  const handleCreatePostClick = () => {
    setBlogCreateVisible(true);
  };

  const handleBlogSuccess = () => {
    setBlogCreateVisible(false);
    // You could add a success message or refresh data here
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={1} style={{ marginBottom: '8px' }}>Guru Dashboard</Title>
            <Text type="secondary">Manage your yoga teaching platform</Text>
          </div>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={refreshData}
            loading={dataLoading}
          >
            Refresh Data
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: 'Overview',
              icon: <RiseOutlined />
            },
            {
              key: 'users',
              label: 'Users',
              icon: <UserOutlined />
            },
            {
              key: 'orders',
              label: 'Orders',
              icon: <CreditCardOutlined />
            },
            {
              key: 'content',
              label: 'Content',
              icon: <FileTextOutlined />
            },
            {
              key: 'settings',
              label: 'Settings',
              icon: <SettingOutlined />
            }
          ]}
          style={{ marginBottom: '32px' }}
        />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Practitioners"
                    value={dashboardStats?.totalUsers || 0}
                    formatter={(value) => (value as number)?.toLocaleString()}
                    prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                    suffix={
                      <Text type="success" style={{ fontSize: '12px' }}>
                        +{dashboardStats?.recentUsers || 0} this month
                      </Text>
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Revenue"
                    value={dashboardStats?.totalRevenue ? dashboardStats.totalRevenue / 100 : 0}
                    precision={0}
                    prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ color: '#52c41a' }}
                    formatter={(value) => formatCurrency(value as number)}
                    suffix={
                      <div> 
                        <Text type="success" style={{ fontSize: '12px' }}>
                          ₹{(dashboardStats?.monthlyRevenue || 0) / 100} this month
                        </Text>
                  </div>
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Active Sessions"
                    value={dashboardStats?.activeLiveClasses || 0}
                    prefix={<BookOutlined style={{ color: '#722ed1' }} />}
                    suffix={
                      <Text style={{ fontSize: '12px', color: '#1890ff' }}>
                        Live now
                      </Text>
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Pending Orders"
                    value={dashboardStats?.pendingOrders || 0}
                    prefix={<CreditCardOutlined style={{ color: '#fa8c16' }} />}
                    suffix={
                      <Text type="warning" style={{ fontSize: '12px' }}>
                        Needs attention
                      </Text>
                    }
                  />
                </Card>
              </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Revenue Trend" style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardStats?.monthlyRevenueData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Plan Distribution" style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(dashboardStats?.planDistribution || {}).map(([plan, count]) => ({ plan, count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="plan" />
                    <YAxis />
                    <Tooltip />
                      <Bar dataKey="count" fill="#52c41a" />
                  </BarChart>
                </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>User Management</Title>
              <Space>
                <Input.Search
                  placeholder="Search users..."
                  style={{ width: 200 }}
                  onSearch={(value) => {
                    setUserFilters({ ...userFilters, search: value });
                    fetchUsers(1, { ...userFilters, search: value });
                  }}
                />
                <Select
                  placeholder="Filter by status"
                  style={{ width: 120 }}
                  allowClear
                  onChange={(value) => {
                    setUserFilters({ ...userFilters, status: value || '' });
                    fetchUsers(1, { ...userFilters, status: value || '' });
                  }}
                >
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="trial">Trial</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
                <Select
                  placeholder="Filter by plan"
                  style={{ width: 120 }}
                  allowClear
                  onChange={(value) => {
                    setUserFilters({ ...userFilters, plan: value || '' });
                    fetchUsers(1, { ...userFilters, plan: value || '' });
                  }}
                >
                  <Select.Option value="quarterly">Quarterly</Select.Option>
                  <Select.Option value="half-yearly">Half-Yearly</Select.Option>
                  <Select.Option value="annually">Annual</Select.Option>
                </Select>
                <Button type="primary" icon={<ExportOutlined />} onClick={async () => {
                  try {
                    const blob = await adminAPI.exportUsers();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'users.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    message.success('Users exported successfully');
                  } catch (error) {
                    message.error('Failed to export users');
                  }
                }}>
                  Export Users
                </Button>
              </Space>
            </div>

            <Table
              dataSource={users}
              loading={dataLoading}
              pagination={{
                current: usersPagination.current,
                pageSize: usersPagination.pageSize,
                total: usersPagination.total,
                onChange: (page) => fetchUsers(page),
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
              }}
              columns={[
                {
                  title: 'User',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text: string, record: AdminUser) => (
                        <div>
                      <div style={{ fontWeight: 500 }}>{text}</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>{record.phone}</div>
                        </div>
                  ),
                },
                {
                  title: 'Plan',
                  dataIndex: 'plan',
                  key: 'plan',
                  render: (plan: string) => <Tag color="blue">{plan}</Tag>,
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Tag color={status === 'active' ? 'green' : status === 'trial' ? 'orange' : 'red'}>
                      {status}
                    </Tag>
                  ),
                },
                {
                  title: 'Total Spent',
                  dataIndex: 'totalSpent',
                  key: 'totalSpent',
                  render: (amount: number) => formatCurrency(amount),
                },
                {
                  title: 'Joined',
                  dataIndex: 'joinedAt',
                  key: 'joinedAt',
                  render: (date: string) => formatDate(date),
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_: any, record: AdminUser) => (
                    <Space>
                      <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => {
                          const newStatus = record.status === 'active' ? 'inactive' : 'active';
                          adminAPI.updateUserStatus(record.id, newStatus).then(() => {
                            message.success(`User status updated to ${newStatus}`);
                            fetchUsers();
                          }).catch(() => {
                            message.error('Failed to update user status');
                          });
                        }}
                      >
                        {record.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>Order Management</Title>
              <Space>
                <Select
                  placeholder="Filter by status"
                  style={{ width: 120 }}
                  allowClear
                  onChange={(value) => {
                    setOrderFilters({ ...orderFilters, status: value || '' });
                    fetchOrders(1, { ...orderFilters, status: value || '' });
                  }}
                >
                  <Select.Option value="completed">Completed</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                </Select>
                <Select
                  placeholder="Filter by plan"
                  style={{ width: 120 }}
                  allowClear
                  onChange={(value) => {
                    setOrderFilters({ ...orderFilters, plan: value || '' });
                    fetchOrders(1, { ...orderFilters, plan: value || '' });
                  }}
                >
                  <Select.Option value="quarterly">Quarterly</Select.Option>
                  <Select.Option value="half-yearly">Half-Yearly</Select.Option>
                  <Select.Option value="annually">Annual</Select.Option>
                </Select>
                <Button type="primary" icon={<ExportOutlined />}>
                  Export Orders
                </Button>
              </Space>
            </div>

            <Table
              dataSource={orders}
              loading={dataLoading}
              pagination={{
                current: ordersPagination.current,
                pageSize: ordersPagination.pageSize,
                total: ordersPagination.total,
                onChange: (page) => fetchOrders(page),
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
              }}
              columns={[
                {
                  title: 'Order ID',
                  dataIndex: 'id',
                  key: 'id',
                },
                {
                  title: 'Customer',
                  dataIndex: 'customer',
                  key: 'customer',
                  render: (text: string, record: AdminOrder) => (
                    <div>
                      <div style={{ fontWeight: 500 }}>{text}</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>{record.phone}</div>
                    </div>
                  ),
                },
                {
                  title: 'Plan',
                  dataIndex: 'plan',
                  key: 'plan',
                  render: (plan: string) => <Tag color="blue">{plan}</Tag>,
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (amount: number) => formatCurrency(amount),
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => {
                    const color = status === 'Completed' ? 'green' : 
                                 status === 'Pending' ? 'orange' : 'red';
                    return <Tag color={color}>{status}</Tag>;
                  },
                },
                {
                  title: 'Payment Date',
                  dataIndex: 'paidAt',
                  key: 'paidAt',
                  render: (date: string) => date ? formatDate(date) : 'N/A',
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_: any, record: AdminOrder) => (
                    <Space>
                      <Button type="link" icon={<EyeOutlined />} size="small">
                        View
                      </Button>
                      {record.status === 'Pending' && (
                        <Button type="link" icon={<CheckOutlined />} size="small" style={{ color: '#52c41a' }}>
                          Confirm
                        </Button>
                      )}
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
              
              <Col xs={24} md={8}>
                <Card>
                  <Title level={4} style={{ marginBottom: '16px' }}>Live Classes</Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                    Schedule and manage live interactive sessions
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    onClick={handleScheduleClassClick}
                  >
                  Schedule Class
                  </Button>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card>
                  <Title level={4} style={{ marginBottom: '16px' }}>Blog Posts</Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                    Create and publish blog content
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<FileTextOutlined />} 
                    style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                    onClick={handleCreatePostClick}
                  >
                    Create Post
                  </Button>
                </Card>
              </Col>
            </Row>

            <Card>
              <Title level={3} style={{ marginBottom: '24px' }}>Content Analytics</Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', marginBottom: '8px' }}>
                      {contentAnalytics?.videos.total || 0}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Total Videos</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      {contentAnalytics?.videos.scheduled || 0} scheduled, {contentAnalytics?.videos.completed || 0} completed
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a', marginBottom: '8px' }}>
                      {contentAnalytics?.blogs.total || 0}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Total Blog Posts</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      {contentAnalytics?.blogs.published || 0} published
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9f0ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1', marginBottom: '8px' }}>
                      {dashboardStats?.activeLiveClasses || 0}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Active Live Sessions</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      Currently scheduled
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
            </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
                  <div>
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
              <Col xs={24} md={12}>
                <Card title="Platform Settings">
                  <Form layout="vertical">
                    <Form.Item label="Platform Name" name="platformName" initialValue="SuchBliss">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Support Email" name="supportEmail" initialValue="support@suchbliss.com">
                      <Input type="email" />
                    </Form.Item>
                    <Form.Item label="WhatsApp Number" name="whatsappNumber" initialValue="+91 98637 79900">
                      <Input type="tel" />
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Payment Settings">
                  <Form layout="vertical">
                    <Form.Item label="Razorpay Key ID" name="razorpayKey">
                      <Input placeholder="rzp_test_xxxxxxxxxxxx" />
                    </Form.Item>
                    <Form.Item label="Referral Reward Amount (₹)" name="referralAmount" initialValue={500}>
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item name="enableReferrals" valuePropName="checked" initialValue={true}>
                      <Switch />
                      <span style={{ marginLeft: '8px' }}>Enable referral system</span>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
 
            </div>
        )}

        {/* Video Schedule Dialog */}
        <VideoScheduleDialog
          visible={videoScheduleVisible}
          onCancel={() => setVideoScheduleVisible(false)}
          onOk={(values) => {
            const formattedValues = {
              ...values,
              scheduleDate: values.scheduleDate.format('YYYY-MM-DD HH:mm:ss'),
              scheduleTime: values.scheduleTime.format('YYYY-MM-DD HH:mm:ss')
            };
            handleVideoSchedule(formattedValues);
          }}
        />

        {/* Blog Create Dialog */}
        <BlogCreateDialog
          visible={blogCreateVisible}
          onCancel={() => setBlogCreateVisible(false)}
          onSuccess={handleBlogSuccess}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;