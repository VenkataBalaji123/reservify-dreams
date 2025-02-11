
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const EventSeats = () => {
  const { eventId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Select Your Event Seats</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-center mb-4">Event ID: {eventId}</p>
          {/* Seat selection UI will be implemented here */}
        </div>
      </div>
    </div>
  );
};

export default EventSeats;
