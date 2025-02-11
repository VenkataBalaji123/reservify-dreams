
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const SAMPLE_EVENTS = [
  { id: 1, name: 'Music Festival 2024', location: 'Mumbai', date: '2024-04-15', time: '18:00', price: 1500 },
  { id: 2, name: 'Comedy Night', location: 'Delhi', date: '2024-04-20', time: '20:00', price: 800 },
  { id: 3, name: 'Art Exhibition', location: 'Bangalore', date: '2024-04-25', time: '11:00', price: 500 },
];

const EventResults = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {SAMPLE_EVENTS.map((event) => (
        <Card key={event.id} className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>
            <div className="text-center">
              <p className="font-medium">{event.date}</p>
              <p className="text-sm text-gray-600">{event.time}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-lg font-bold">₹{event.price}</p>
              <Button onClick={() => navigate(`/events/${event.id}/seats`)}>
                Book Tickets
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventResults;
