import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  message,
  Space,
  Typography,
  Card
} from 'antd';
import {
  YoutubeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  LinkOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs'; 

const { Title, Text } = Typography;
const { TextArea } = Input;

interface VideoScheduleDialogProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: VideoScheduleData) => void;
}

interface VideoScheduleData {
  title: string;
  description: string;
  youtubeUrl: string;
  scheduleDate: dayjs.Dayjs;
  scheduleTime: dayjs.Dayjs;
  duration?: number;
  category?: string;
}

const VideoScheduleDialog: React.FC<VideoScheduleDialogProps> = ({
  visible,
  onCancel,
  onOk
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<VideoScheduleData>>({});

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onOk(values);
      message.success('Video scheduled successfully!');
      form.resetFields();
      setPreviewData({});
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewData({});
    onCancel();
  };
  const handleFormChange = (_changedValues: any, allValues: Partial<VideoScheduleData>) => {
    setPreviewData(allValues);
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getVideoThumbnail = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined;
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <YoutubeOutlined style={{ color: '#ff0000' }} />
          <span>Schedule YouTube Video</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          Schedule Video
        </Button>
      ]}
    >
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleFormChange}
            initialValues={{
              scheduleDate: dayjs(),
              scheduleTime: dayjs().add(1, 'hour')
            }}
          >
            <Form.Item
              label="Video Title"
              name="title"
              rules={[{ required: true, message: 'Please enter video title' }]}
            >
              <Input
                placeholder="Enter video title"
                prefix={<FileTextOutlined />}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="YouTube Video URL"
              name="youtubeUrl"
              rules={[
                { required: true, message: 'Please enter YouTube URL' },
                { 
                  pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/, 
                  message: 'Please enter a valid YouTube URL' 
                }
              ]}
            >
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                prefix={<LinkOutlined />}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please enter video description' }]}
            >
              <TextArea
                rows={4}
                placeholder="Enter video description"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                label="Schedule Date"
                name="scheduleDate"
                rules={[{ required: true, message: 'Please select date' }]}
                style={{ flex: 1 }}
              >
                <DatePicker
                  size="large"
                  style={{ width: '100%' }}
                  disabledDate={(current: any) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>

              <Form.Item
                label="Schedule Time"
                name="scheduleTime"
                rules={[{ required: true, message: 'Please select time' }]}
                style={{ flex: 1 }}
              >
                <TimePicker
                  size="large"
                  style={{ width: '100%' }}
                  format="HH:mm"
                  minuteStep={15}
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Duration (minutes)"
              name="duration"
            >
              <Input
                type="number"
                placeholder="e.g., 60"
                suffix="minutes"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
            >
              <Input
                placeholder="e.g., Hatha Yoga, Vinyasa, Meditation"
                size="large"
              />
            </Form.Item>
          </Form>
        </div>

        {/* Preview Section */}
        <div style={{ width: '300px' }}>
          <Title level={5}>Preview</Title>
          <Card size="small" style={{ marginBottom: '16px' }}>
            {previewData.youtubeUrl && getVideoThumbnail(previewData.youtubeUrl) ? (
              <div>
                <img
                  src={getVideoThumbnail(previewData.youtubeUrl)}
                  alt="Video thumbnail"
                  style={{ width: '100%', borderRadius: '4px', marginBottom: '8px' }}
                />
                <Text strong style={{ fontSize: '12px' }}>
                  {previewData.title || 'Video Title'}
                </Text>
              </div>
            ) : (
              <div style={{ 
                height: '120px', 
                backgroundColor: '#f5f5f5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '4px',
                marginBottom: '8px'
              }}>
                <YoutubeOutlined style={{ fontSize: '24px', color: '#ccc' }} />
              </div>
            )}
          </Card>

          <Card size="small">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined />
                <Text style={{ fontSize: '12px' }}>
                  {previewData.scheduleDate?.format('MMM DD, YYYY') || 'Select date'}
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClockCircleOutlined />
                <Text style={{ fontSize: '12px' }}>
                  {previewData.scheduleTime?.format('HH:mm') || 'Select time'}
                </Text>
              </div>
              {previewData.duration && (
                <Text style={{ fontSize: '12px' }}>
                  Duration: {previewData.duration} minutes
                </Text>
              )}
              {previewData.category && (
                <Text style={{ fontSize: '12px' }}>
                  Category: {previewData.category}
                </Text>
              )}
            </Space>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

export default VideoScheduleDialog;
