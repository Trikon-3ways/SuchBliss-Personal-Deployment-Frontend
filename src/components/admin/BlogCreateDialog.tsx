import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Typography,
  Card,
  Select,
  Tag,
  Divider
} from 'antd';
import {
  FileTextOutlined,
  EditOutlined,
  TagOutlined,
  PictureOutlined,
  SaveOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { blogAPI } from '../../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface BlogCreateDialogProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface BlogData {
  title: string;
  content: string; 
  tags: string[];
  category: string;
  featuredImage?: string;
}

const BlogCreateDialog: React.FC<BlogCreateDialogProps> = ({
  visible,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogData>>({});

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Always set status to published
      const blogData = {
        ...values,
        status: 'published'
      };
      
      console.log('Creating blog with data:', blogData);
      const response = await blogAPI.createBlog(blogData);
      
      console.log('Blog created successfully:', response);
      message.success('Blog post published successfully!');
      
      form.resetFields();
      setFormData({});
      onSuccess();
    } catch (error) {
      console.error('Error creating blog:', error);
      message.error('Failed to create blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFormData({});
    setPreviewMode(false);
    onCancel();
  };

  const handleFormChange = (_changedValues: any, allValues: Partial<BlogData>) => {
    setFormData(allValues);
  };

  const handleTagChange = (value: string[]) => {
    form.setFieldsValue({ tags: value });
    setFormData(prev => ({ ...prev, tags: value }));
  };

  const categories = [
    'Yoga & Wellness',
    'Meditation',
    'Health & Fitness',
    'Lifestyle',
    'Spirituality',
    'Nutrition',
    'Mental Health',
    'General'
  ];

  const renderPreview = () => {
    if (!formData.title && !formData.content) {
      return (
        <div style={{ 
          height: '500px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#999'
        }}>
          <div style={{ textAlign: 'center' }}>
            <EditOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <Text>Start writing to see preview</Text>
          </div>
        </div>
      );
    }

    return (
      <Card size="small" style={{ height: '500px', overflow: 'auto' }}>
        <div style={{ padding: '12px' }}>
          <Title level={4} style={{ marginBottom: '8px' }}>
            {formData.title || 'Untitled'}
          </Title>
          
          {formData.category && (
            <Tag color="blue" style={{ marginBottom: '12px' }}>
              {formData.category}
            </Tag>
          )}
          
          {formData.tags && formData.tags.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              {formData.tags.map((tag, index) => (
                <Tag key={index} color="green" style={{ marginRight: '4px' }}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          
          <Divider style={{ margin: '12px 0' }} />
          
          <div style={{ 
            fontSize: '14px', 
            lineHeight: '1.6',
            color: '#666'
          }}>
            { formData.content?.substring(0, 200) + '...' || 'No content yet'}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span>Create Blog Post</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={1200}
      style={{ top: 20 }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button 
          key="preview" 
          icon={<EyeOutlined />}
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? 'Edit' : 'Preview'}
        </Button>,
        <Button 
          key="publish" 
          type="primary" 
          icon={<SaveOutlined />}
          loading={loading} 
          onClick={handleOk}
        >
          Publish Blog
        </Button>
      ]}
    >
      <div style={{ display: 'flex', gap: '24px', height: '600px', maxHeight: '70vh' }}>
        {/* Form Section */}
        <div style={{ 
          flex: 1, 
          display: previewMode ? 'none' : 'block',
          overflowY: 'auto',
          paddingRight: '8px'
        }}>
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleFormChange}
            initialValues={{
              category: 'General'
            }}
          >
            <Form.Item
              label="Blog Title"
              name="title"
              rules={[{ required: true, message: 'Please enter blog title' }]}
            >
              <Input
                placeholder="Enter an engaging title for your blog post"
                prefix={<FileTextOutlined />}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select size="large" placeholder="Select category">
                {categories.map(category => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Tags"
              name="tags"
            >
              <Select
                mode="tags"
                size="large"
                placeholder="Add tags (press Enter to add)"
                onChange={handleTagChange}
                suffixIcon={<TagOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Featured Image URL"
              name="featuredImage"
            >
              <Input
                placeholder="https://example.com/image.jpg"
                prefix={<PictureOutlined />}
                size="large"
              />
            </Form.Item>

            

            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: 'Please enter blog content' }]}
            >
              <TextArea
                rows={8}
                placeholder="Write your blog post content here..."
                showCount
                maxLength={10000}
                style={{ resize: 'vertical' }}
              />
            </Form.Item>
          </Form>
        </div>

        {/* Preview Section */}
        <div style={{ 
          width: '300px', 
          display: previewMode ? 'block' : 'none',
          overflowY: 'auto'
        }}>
          <Title level={5} style={{ marginBottom: '12px' }}>Preview</Title>
          {renderPreview()}
        </div>
      </div>
    </Modal>
  );
};

export default BlogCreateDialog;
