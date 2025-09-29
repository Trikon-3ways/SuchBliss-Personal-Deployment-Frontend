import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { events } from '../data/mockData';
import { format } from 'date-fns';

const Events: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const eventTypes = ['all', 'workshop', 'webinar', 'conference'];
  
  const filteredEvents = events.filter(event => 
    selectedType === 'all' || event.type === selectedType
  );

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'webinar':
        return 'bg-blue-100 text-blue-800';
      case 'conference':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Live Events & Workshops
          </h1>
          <p className="text-xl text-gray-600">
            Join our exclusive events and connect with industry experts
          </p>
        </div>

        {/* Event Type Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(event.date, 'MMM dd')}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {format(event.date, 'MMM dd, yyyy • h:mm a')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                
                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Register Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Photo Gallery Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Event Gallery
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300',
              'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=300',
              'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=300',
              'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg?auto=compress&cs=tinysrgb&w=300',
              'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=300',
              'https://images.pexels.com/photos/3823495/pexels-photo-3823495.jpeg?auto=compress&cs=tinysrgb&w=300',
              'https://images.pexels.com/photos/3823531/pexels-photo-3823531.jpeg?auto=compress&cs=tinysrgb&w=300',
              'https://images.pexels.com/photos/3823569/pexels-photo-3823569.jpeg?auto=compress&cs=tinysrgb&w=300'
            ].map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={image}
                  alt={`Event ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Event Highlights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Event Highlight 1"
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Event Highlight 2"
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
 
      </div>
    </div>
  );
};

export default Events;