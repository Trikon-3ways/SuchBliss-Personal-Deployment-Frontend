import { Course, LiveClass, BlogPost, Event, Plan, AdminStats } from '../types';

export const courses: Course[] = [
  {
    id: '1',
    title: 'Hatha Yoga Foundation Course',
    description: 'Master traditional Hatha Yoga postures, breathing techniques, and meditation',
    thumbnail: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    instructor: 'Guru Ananda',
    duration: '8 weeks',
    level: 'beginner',
    price: 3999,
    features: ['Live Yoga Sessions', '24/7 Support', 'Lifetime Access', 'Yoga Certification']
  },
  {
    id: '2',
    title: 'Vinyasa Flow Mastery',
    description: 'Advanced flowing sequences, breath synchronization, and dynamic movements',
    thumbnail: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
    instructor: 'Priya Devi',
    duration: '10 weeks',
    level: 'advanced',
    price: 6999,
    features: ['Live Flow Sessions', 'Personal Guidance', 'Anatomy Training', 'Teacher Certification']
  },
  {
    id: '3',
    title: 'Meditation & Mindfulness',
    description: 'Deep meditation practices, mindfulness techniques, and spiritual growth',
    thumbnail: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
    instructor: 'Swami Krishnananda',
    duration: '12 weeks',
    level: 'intermediate',
    price: 5999,
    features: ['Live Meditation Sessions', 'Spiritual Guidance', 'Personal Mentorship', 'Wellness Coaching']
  }
];

export const liveClasses: LiveClass[] = [
  {
    id: '1',
    title: 'Morning Hatha Yoga Flow',
    description: 'Gentle morning practice to energize your day with traditional asanas',
    instructor: 'Guru Ananda',
    scheduledAt: new Date('2025-01-20T06:00:00'),
    duration: 90,
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    maxParticipants: 50,
    currentParticipants: 35,
    status: 'scheduled',
    plan: 'basic'
  },
  {
    id: '2',
    title: 'Advanced Vinyasa Workshop',
    description: 'Dynamic sequences with advanced poses and breathing techniques',
    instructor: 'Priya Devi',
    scheduledAt: new Date('2025-01-21T18:00:00'),
    duration: 120,
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    maxParticipants: 30,
    currentParticipants: 25,
    status: 'scheduled',
    plan: 'premium'
  },
  {
    id: '3',
    title: 'Deep Meditation Practice',
    description: 'Guided meditation session for inner peace and spiritual awakening',
    instructor: 'Swami Krishnananda',
    scheduledAt: new Date('2025-01-22T19:30:00'),
    duration: 75,
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    maxParticipants: 100,
    currentParticipants: 80,
    status: 'scheduled',
    plan: 'basic'
  }
];
 

export const events: Event[] = [
  {
    id: '1',
    title: 'International Yoga Day Celebration',
    description: 'Join thousands of practitioners for a global yoga celebration',
    date: new Date('2025-03-15'),
    location: 'Virtual',
    type: 'conference',
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=600',
    registrationUrl: '#'
  },
  {
    id: '2',
    title: 'Pranayama Intensive Workshop',
    description: 'Deep dive into advanced breathing techniques and energy work',
    date: new Date('2025-02-28'),
    location: 'Online',
    type: 'workshop',
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600',
    registrationUrl: '#'
  }
];

export const plans: Plan[] = [
  {
    id: 'quarterly',
    name: 'Quarterly Plan',
    description: 'Perfect for beginners starting their yoga journey',
    price: 999,
    billingCycle: 'quarterly',
    popular: false,
    maxLiveClasses: 5,
    supportLevel: 'Email Support',
    features: [
      'Access to basic yoga courses',
      '5 live yoga sessions per month',
      'Email support',
      'Basic yoga guides',
      'Community access'
    ]
  },
  {
    id: 'half-yearly',
    name: 'Half-Yearly Plan',
    description: 'Complete yoga journey with expert guidance',
    price: 1899,
    billingCycle: 'half-yearly',
    popular: true,
    maxLiveClasses: 15,
    supportLevel: 'Priority Support',
    features: [
      'Access to all yoga courses',
      '15 live yoga sessions per month',
      'Priority support',
      'Downloadable yoga guides',
      'Yoga certification',
      'One-on-one yoga mentoring (2 sessions)',
      'WhatsApp group access',
      'Personal yoga practice plan',
      'Advanced yoga workshops'
    ]
  },
  {
    id: 'annually',
    name: 'Annual Plan',
    description: 'Ultimate yoga experience with unlimited access',
    price: 3499,
    billingCycle: 'annually',
    popular: false,
    maxLiveClasses: -1,
    supportLevel: '24/7 Dedicated Support',
    features: [
      'Access to all yoga courses',
      'Unlimited live yoga sessions',
      '24/7 dedicated support',
      'Premium yoga guides',
      'Advanced yoga certification',
      'Unlimited one-on-one mentoring',
      'VIP WhatsApp group access',
      'Custom yoga practice plans',
      'Exclusive yoga workshops',
      'Lifetime access to all content',
      'Personal yoga instructor',
      'Monthly wellness consultations'
    ]
  }
];

export const adminStats: AdminStats = {
  totalUsers: 2847,
  activeUsers: 1923,
  totalRevenue: 8547650,
  monthlyRevenue: 1245890,
  totalOrders: 3421,
  pendingOrders: 23,
  activeLiveClasses: 12,
  totalReferrals: 456
};