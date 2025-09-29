import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ConfigProvider, Layout } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import Events from './pages/Events'; 
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import LiveClasses from './pages/LiveClasses';
import Payment from './pages/Payment';
import Referrals from './pages/Referrals';
import AdminDashboard from './pages/admin/AdminDashboard';

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
          colorSuccess: '#10B981',
          colorWarning: '#F59E0B',
          colorError: '#EF4444',
          colorInfo: '#3B82F6',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Layout: {
            bodyBg: '#FFF6F3',
          },
          Card: {
            borderRadiusLG: 12,
          },
          Button: {
            borderRadius: 8,
          },
        },
      }}
    >
      <AuthProvider>
        <Router>
          <Layout style={{ minHeight: '100vh', background: '#FFF6F3' }}>
            <Header />
            <Content>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/events" element={<Events />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/live-classes" element={<LiveClasses />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/referrals" element={<Referrals />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Content>
            <Footer />
            <WhatsAppButton />
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
              },
              success: {
                duration: 1500,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 2500,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;