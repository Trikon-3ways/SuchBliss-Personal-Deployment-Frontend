import React, { useState, useEffect } from 'react';
import { Play, Users, Clock, Calendar, Lock, CheckCircle, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { motion } from 'framer-motion';
import { liveClasses } from '../data/mockData';
import { videoAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format, isAfter, isBefore, addMinutes } from 'date-fns';
import toast from 'react-hot-toast';

const LiveClasses: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scheduledVideos, setScheduledVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [joinPromptClass, setJoinPromptClass] = useState<any | null>(null);
  const [dismissedPrompts, setDismissedPrompts] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const [playheadStartSec, setPlayheadStartSec] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const res = await videoAPI.getScheduledVideos();
        const apiVideos = Array.isArray(res?.data) ? res.data : [];
        const mapped = apiVideos.map((v: any) => {
          const startAt = v.scheduleTime || v.scheduleDate || v.scheduledAt;
          return {
            id: String(v._id || v.id),
            title: v.title,
            description: v.description,
            instructor: v.instructor || 'Admin',
            scheduledAt: new Date(startAt),
            duration: Number(v.duration || 60),
            youtubeUrl: v.youtubeUrl,
            maxParticipants: v.maxParticipants || 100,
            currentParticipants: v.currentParticipants || 0,
            status: v.status || 'scheduled',
            plan: v.plan || 'quarterly'
          };
        });
        setScheduledVideos(mapped);
      } catch (err: any) {
        console.error(err);
        setLoadError(err?.response?.data?.message || 'Failed to load scheduled videos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Prompt to join when a class turns live at its scheduled time
  useEffect(() => {
    if (!user) return;
    if (selectedClass) return;
    if (joinPromptClass) return;
    const all = scheduledVideos.length ? scheduledVideos : liveClasses;
    const eligible = all
      .filter((cls: any) => canJoinClass(cls) && !dismissedPrompts.has(cls.id))
      .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    if (eligible.length > 0) {
      setJoinPromptClass(eligible[0]);
      toast.success(`${eligible[0].title} is live now`);
    }
  }, [currentTime, scheduledVideos, user, selectedClass, joinPromptClass, dismissedPrompts]);

  const canJoinClass = (liveClass: any) => {
    if (!user) return false;
    
    // Check if user has an active paid plan
    if (!user.plan || user.status !== 'active') {
      return false;
    }
    
    // Check if user's plan allows access to this class
    const userPlanPriority = user.plan === 'quarterly' ? 1 : user.plan === 'half-yearly' ? 2 : 3;
    const classPlanPriority = liveClass.plan === 'quarterly' ? 1 : liveClass.plan === 'half-yearly' ? 2 : 3;
    
    if (classPlanPriority > userPlanPriority) {
      return false;
    }
    
    const classStart = new Date(liveClass.scheduledAt);
    const classEnd = addMinutes(classStart, liveClass.duration);
    const joinWindowStart = classStart; // allow only after scheduled time
    
    return (isAfter(currentTime, joinWindowStart) || currentTime.getTime() === classStart.getTime()) && isBefore(currentTime, classEnd);
  };

  const getClassStatus = (liveClass: any) => {
    const classStart = new Date(liveClass.scheduledAt);
    const classEnd = addMinutes(classStart, liveClass.duration);
    
    if (isBefore(currentTime, classStart)) {
      return 'upcoming';
    } else if (isAfter(currentTime, classStart) && isBefore(currentTime, classEnd)) {
      return 'live';
    } else {
      return 'ended';
    }
  };

  const handleJoinClass = (classId: string) => {
    const all = scheduledVideos.length ? scheduledVideos : liveClasses;
    const liveClass = all.find((c: any) => c.id === classId);
    if (!liveClass) return;

    // Check if user has an active paid plan
    if (!user?.plan || user.status !== 'active') {
      toast.error('You need to purchase a plan to access live classes. Please visit the pricing page.');
      return;
    }

    // Check plan access
    const userPlanPriority = user?.plan === 'quarterly' ? 1 : user?.plan === 'half-yearly' ? 2 : 3;
    const classPlanPriority = liveClass.plan === 'quarterly' ? 1 : liveClass.plan === 'half-yearly' ? 2 : 3;
    
    if (classPlanPriority > userPlanPriority) {
      toast.error(`This class requires ${liveClass.plan} plan or higher. Please upgrade your plan.`);
      return;
    }
    if (!canJoinClass(liveClass)) {
      const classStart = new Date(liveClass.scheduledAt);
      const status = getClassStatus(liveClass);
      
      if (status === 'upcoming') {
        const minutesUntilStart = Math.ceil((classStart.getTime() - currentTime.getTime()) / (1000 * 60));
        toast.error(`Class starts in ${minutesUntilStart} minutes. You can join right at start time.`);
      } else if (status === 'ended') {
        toast.error('This class has already ended. Check schedule for upcoming sessions.');
      } else {
        toast.error('Class is not available at this time');
      }
      return;
    }

    // Compute start offset once at join time to avoid per-second reloads
    const classStartMs = new Date(liveClass.scheduledAt).getTime();
    const nowMs = Date.now();
    const elapsedSec = Math.max(0, Math.floor((nowMs - classStartMs) / 1000));
    const durationSec = Math.max(1, Number(liveClass.duration || 60) * 60);
    const startSec = Math.min(elapsedSec, durationSec - 1);
    setPlayheadStartSec(startSec);
    setSelectedClass(classId);
    toast.success(`Joining ${liveClass.title}...`);
  };

  const userPlanPriority = user?.plan === 'quarterly' ? 1 : user?.plan === 'half-yearly' ? 2 : 3;

  const sourceClasses = scheduledVideos.length ? scheduledVideos : liveClasses;
  const availableClasses = sourceClasses.filter(liveClass => {
    // Only show classes if user has an active paid plan
    if (!user?.plan || user.status !== 'active') {
      return false;
    }
    
    const classPlanPriority = liveClass.plan === 'quarterly' ? 1 : liveClass.plan === 'half-yearly' ? 2 : 3;
    const status = getClassStatus(liveClass);
    return classPlanPriority <= userPlanPriority && status !== 'ended';
  });

  useEffect(() => {
    if (!selectedClass) return;
    const all = scheduledVideos.length ? scheduledVideos : liveClasses;
    const cls: any = all.find((c: any) => c.id === selectedClass);
    if (!cls) return;
    const classStart = new Date(cls.scheduledAt);
    const classEnd = addMinutes(classStart, cls.duration);
    if (isAfter(currentTime, classEnd)) {
      setSelectedClass(null);
      toast.error('Session has ended.');
    }
  }, [currentTime, selectedClass, scheduledVideos]);

  const getEmbedUrl = (url: string, startSeconds?: number) => {
    // Convert various YouTube URLs to embed with restricted controls
    try {
      const u = new URL(url);
      let videoId = '';
      if (u.hostname.includes('youtu.be')) {
        videoId = u.pathname.replace('/', '');
      } else {
        videoId = u.searchParams.get('v') || '';
        if (!videoId && u.pathname.includes('/embed/')) {
          videoId = u.pathname.split('/embed/')[1];
        }
      }
      if (!videoId) return url;
      // Disable controls, keyboard, seeking UI; autoplay on join; jump to elapsed position
      const startParam = Math.max(0, Number(startSeconds || 0));
      return `https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&disablekb=1&fs=1&cc_load_policy=0&iv_load_policy=3&autoplay=1&start=${startParam}`;
    } catch {
      return url;
    }
  };

  const extractVideoId = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        return u.pathname.replace('/', '');
      }
      const v = u.searchParams.get('v');
      if (v) return v;
      if (u.pathname.includes('/embed/')) {
        return u.pathname.split('/embed/')[1];
      }
      return '';
    } catch {
      return '';
    }
  };

  const getThumbnailUrl = (url: string) => {
    const id = extractVideoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  };

  if (selectedClass) {
    const all = scheduledVideos.length ? scheduledVideos : liveClasses;
    const classData: any = all.find((c: any) => c.id === selectedClass);
    if (!classData) return null;

    return (
      <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-black`}>
        <div className="flex flex-col h-screen">
          {/* Class Header */}
          <div className={`bg-gray-900 text-white p-4 ${isFullscreen ? 'hidden' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">{classData.title}</h1>
                <p className="text-gray-300">Guru: {classData.instructor}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">LIVE</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{classData.currentParticipants} practitioners</span>
                </div>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Leave Session
                </button>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="w-full h-full">
              <iframe
                src={getEmbedUrl(classData.youtubeUrl, playheadStartSec)}
                title={classData.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                style={{ border: 'none', pointerEvents: 'none' }}
              ></iframe>
            </div>
            
            {/* Live Indicator */}
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              LIVE YOGA SESSION
            </div>
            
            {/* Participant Count */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {classData.currentParticipants} watching
            </div>
            
            {/* Session Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
              <div className="text-sm">
                <div className="font-medium">{classData.instructor}</div>
                <div className="text-gray-300">{classData.duration} min session</div>
              </div>
            </div>
            
            {/* No Controls Warning */}
            <div className="absolute bottom-4 right-4 bg-red-600 bg-opacity-90 text-white px-3 py-2 rounded-lg text-xs">
              🔴 LIVE - No Rewind/Forward
            </div>
          </div>

          {/* Class Controls */}
          <div className={`bg-gray-900 text-white p-4 ${isFullscreen ? 'hidden' : ''}`}>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Started: {format(classData.scheduledAt, 'h:mm a')}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="text-sm">
                  Duration: {classData.duration} minutes
                </span>
              </div>
              <div className="flex items-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  Live Yoga Session - No Rewind/Forward
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Live Yoga Sessions
          </h1>
          <p className="text-xl text-gray-600">
            Join interactive yoga sessions with certified guru
          </p>
          {user && (
            <div className="mt-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                user.plan && user.status === 'active' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {user.plan && user.status === 'active' 
                  ? `Your Plan: ${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}`
                  : 'No Active Plan - Purchase Required'
                }
              </span>
            </div>
          )}
        </div>

        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Login Required
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please sign in to view and join live yoga sessions.{' '}
                  <Link to="/login" className="font-medium underline">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {user && (!user.plan || user.status !== 'active') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-orange-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-orange-800">
                  Plan Required
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  You need to purchase a plan to access live yoga sessions.{' '}
                  <Link to="/pricing" className="font-medium underline">
                    Choose a plan here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Join Prompt Banner */}
        {user && joinPromptClass && !selectedClass && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="text-green-800 text-sm">
              <span className="font-semibold">{joinPromptClass.title}</span> is live now. Join the session?
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  handleJoinClass(joinPromptClass.id);
                  setJoinPromptClass(null);
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
              >
                Join Now
              </button>
              <button
                onClick={() => {
                  setJoinPromptClass(null);
                  setDismissedPrompts(prev => new Set(prev).add(joinPromptClass.id));
                  
                  // Clear dismissed prompt after 5 minutes so user can see it again
                  setTimeout(() => {
                    setDismissedPrompts(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(joinPromptClass.id);
                      return newSet;
                    });
                  }, 5 * 60 * 1000); // 5 minutes
                }}
                className="text-green-700 hover:text-green-800 text-sm px-3 py-2"
              >
                Not now
              </button>
            </div>
          </div>
        )}

        {/* Loading / Error / Empty States */}
        {isLoading && (
          <div className="text-center text-gray-600 py-8">Loading scheduled sessions...</div>
        )}
        {loadError && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-8">{loadError}</div>
        )}
        {!isLoading && !loadError && availableClasses.length === 0 && user && user.plan && user.status === 'active' && (
          <div className="text-center text-gray-600 py-8">No live sessions available for your plan right now.</div>
        )}
        {!isLoading && !loadError && availableClasses.length === 0 && user && (!user.plan || user.status !== 'active') && (
          <div className="text-center text-gray-600 py-8">
            <p className="mb-4">No live sessions available. Purchase a plan to access live yoga classes.</p>
            <Link 
              to="/pricing" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Choose a Plan
            </Link>
          </div>
        )}

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableClasses.map((liveClass, index) => {
            const status = getClassStatus(liveClass);
            const canJoin = canJoinClass(liveClass);
            
            return (
              <motion.div
                key={liveClass.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-900 overflow-hidden">
                    {getThumbnailUrl(liveClass.youtubeUrl) ? (
                      <img
                        src={getThumbnailUrl(liveClass.youtubeUrl)}
                        alt={liveClass.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-12 w-12 text-white opacity-80" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <Play className="absolute inset-0 m-auto h-12 w-12 text-white opacity-80" />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'live' ? 'bg-red-600 text-white' :
                      status === 'upcoming' ? 'bg-yellow-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {status === 'live' ? 'LIVE NOW' :
                       status === 'upcoming' ? 'UPCOMING' :
                       'ENDED'}
                    </span>
                  </div>

                  {/* Plan Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      liveClass.plan === 'quarterly' ? 'bg-blue-100 text-blue-800' :
                      liveClass.plan === 'half-yearly' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {liveClass.plan.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {liveClass.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{liveClass.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Guru: {liveClass.instructor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(liveClass.scheduledAt, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {format(liveClass.scheduledAt, 'h:mm a')} • {liveClass.duration} min
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        {liveClass.currentParticipants}/{liveClass.maxParticipants} practitioners
                      </span>
                    </div>
                  </div>

                  {user ? (
                    !user.plan || user.status !== 'active' ? (
                      <Link
                        to="/pricing"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Purchase Plan to Join
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleJoinClass(liveClass.id)}
                        disabled={!canJoinClass(liveClass) || status === 'ended' || (user.plan === 'quarterly' && liveClass.plan !== 'quarterly') || (user.plan === 'half-yearly' && liveClass.plan === 'annually')}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                          canJoin && status === 'live'
                            ? 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
                            : status === 'upcoming'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : status === 'ended'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : (user.plan === 'quarterly' && liveClass.plan !== 'quarterly') || (user.plan === 'half-yearly' && liveClass.plan === 'annually')
                            ? 'bg-orange-100 text-orange-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                        }`}
                      >
                        {status === 'live' && canJoin && (
                          <>
                            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                            Join Live Now
                          </>
                        )}
                        {status === 'upcoming' && canJoinClass(liveClass) && 'Starts Soon'}
                        {status === 'upcoming' && !canJoinClass(liveClass) && (user.plan === 'quarterly' && liveClass.plan !== 'quarterly') && 'Upgrade Required'}
                        {status === 'upcoming' && !canJoinClass(liveClass) && (user.plan === 'half-yearly' && liveClass.plan === 'annually') && 'Annual Plan Required'}
                        {status === 'upcoming' && !canJoinClass(liveClass) && !((user.plan === 'quarterly' && liveClass.plan !== 'quarterly') || (user.plan === 'half-yearly' && liveClass.plan === 'annually')) && 'Starts at scheduled time'}
                        {status === 'ended' && (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Class Ended
                          </>
                        )}
                      </button>
                    )
                  ) : (
                    <Link
                      to="/login"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Login to Join
                    </Link>
                  )}
                  
                  {/* Plan Upgrade Notice */}
                  {user && user.status === 'active' && ((user.plan === 'quarterly' && liveClass.plan !== 'quarterly') || (user.plan === 'half-yearly' && liveClass.plan === 'annually')) && (
                    <div className="mt-3 text-center">
                      <Link
                        to="/pricing"
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium underline"
                      >
                        Upgrade to {liveClass.plan} plan to access this class
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Class Schedule Info */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How Live Yoga Sessions Work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Scheduled Sessions</h3>
              <p className="text-gray-600 text-sm">
                Yoga sessions start at specific times. You can join right at the scheduled start.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Interaction</h3>
              <p className="text-gray-600 text-sm">
                Experience authentic live yoga sessions with real-time guidance from certified guru.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Access Control</h3>
              <p className="text-gray-600 text-sm">
                Sessions are restricted by plan level and time slots. No rewind/forward to maintain live authenticity.
              </p>
            </div>
          </div>
          
          {/* Live Session Rules */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-3">Live Session Guidelines</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• Sessions are available only during scheduled time slots</li>
              <li>• You can join only at and after the scheduled start time</li>
              <li>• No pause, rewind, or fast-forward functionality</li>
              <li>• Access restricted based on your subscription plan</li>
              <li>• Prepare your yoga space and mat before joining</li>
              <li>• Maintain silence and respect during the session</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;