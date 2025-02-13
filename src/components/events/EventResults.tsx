
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Music, Tag } from 'lucide-react';

const SAMPLE_EVENTS = [
  { 
    id: 1, 
    name: 'VTAPP 2025', 
    location: 'VIT AP University', 
    date: '2025-09-15', 
    time: '09:00', 
    price: 50,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    category: 'Technical Events',
    organizer: 'VIT AP',
    availableSeats: 1000,
    description: 'Technical fest featuring various competitions and workshops.'
  },
  { 
    id: 2, 
    name: 'VITOPIA 2025', 
    location: 'VIT AP University', 
    date: '2025-03-08', 
    time: '10:00', 
    price: 1000,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
    category: 'Cultural Event',
    organizer: 'VIT AP',
    availableSeats: 2000,
    description: 'Annual cultural festival with performances and activities.'
  },
  { 
    id: 3, 
    name: 'Tech Symposium', 
    location: 'VIT AP University', 
    date: '2025-04-25', 
    time: '11:00', 
    price: 75,
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6',
    category: 'Technical Events',
    organizer: 'CSE Department',
    availableSeats: 500,
    description: 'Technical symposium featuring coding competitions and workshops.'
  },
];

const EventResults = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {SAMPLE_EVENTS.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <img 
                src={event.image} 
                alt={event.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{event.name}</h3>
                  <p className="text-gray-600">by {event.organizer}</p>
                </div>
                <div className="flex items-center gap-1 bg-indigo-100 px-3 py-1 rounded-full">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  <span>{event.category}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mt-4">{event.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>{event.availableSeats} seats left</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                <div className="text-2xl font-bold mb-4 md:mb-0">₹{event.price}</div>
                <div className="flex gap-4">
                  <Button variant="outline">
                    View Details
                  </Button>
                  <Button onClick={() => navigate(`/events/${event.id}/seats`)}>
                    Book Tickets
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventResults;
