
import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface Message {
  text: string;
  isBot: boolean;
}

interface ScheduleInfo {
  flights: {
    flight_number: string;
    airline: string;
    departure_city: string;
    arrival_city: string;
    departure_time: string;
    arrival_time: string;
    available_seats: number;
    base_price: number;
  }[];
  trains: {
    train_number: string;
    train_name: string;
    departure_station: string;
    arrival_station: string;
    departure_time: string;
    arrival_time: string;
    available_seats: number;
    base_price: number;
  }[];
  events: {
    id: string;
    name: string;
    location: string;
    start_date: string;
    event_type: string;
    base_price: number;
    available_seats?: number;
  }[];
  movies: {
    id: string;
    title: string;
    language?: string;
    duration?: number;
    release_date?: string;
    base_price: number;
    available_seats?: number;
    showtimes?: string[];
  }[];
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your booking assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch schedule information when the component mounts
  useEffect(() => {
    const fetchScheduleInfo = async () => {
      try {
        setIsLoading(true);
        
        // Fetch flights
        const { data: flights } = await supabase
          .from('flights')
          .select('id, flight_number, airline, departure_city, arrival_city, departure_time, arrival_time, available_seats, base_price')
          .limit(10);

        // Fetch trains
        const { data: trains } = await supabase
          .from('train_routes')
          .select('id, train_number, train_name, departure_station, arrival_station, departure_time, arrival_time, available_seats, base_price')
          .limit(10);

        // Fetch events
        const { data: events } = await supabase
          .from('events')
          .select('id, name, location, start_date, event_type, base_price')
          .limit(10);

        // Fetch movies
        const { data: movies } = await supabase
          .from('movies')
          .select('id, title, language_id, duration, release_date, base_price')
          .limit(10);

        // Fetch seats for events to calculate available seats
        const { data: eventSeats } = await supabase
          .from('seats')
          .select('id, event_id, status')
          .eq('status', 'available')
          .limit(100);

        // Calculate available seats for events
        const eventSeatsCount: Record<string, number> = {};
        if (eventSeats) {
          eventSeats.forEach(seat => {
            if (seat.event_id) {
              eventSeatsCount[seat.event_id] = (eventSeatsCount[seat.event_id] || 0) + 1;
            }
          });
        }

        // Process movie showtimes (mock as we don't have a showtimes table)
        // In a real implementation, we would fetch from a showtimes table if it existed
        const movieShowtimesMap: Record<string, string[]> = {};
        if (movies) {
          movies.forEach(movie => {
            // Generate placeholder showtimes for each movie
            movieShowtimesMap[movie.id] = [
              new Date(Date.now() + 86400000).toISOString(), // tomorrow
              new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
            ];
          });
        }

        // Add available seats to events
        const eventsWithSeats = events?.map(event => ({
          ...event,
          available_seats: eventSeatsCount[event.id] || 0
        })) || [];

        // Add showtimes to movies
        const moviesWithSeats = movies?.map(movie => ({
          ...movie,
          available_seats: Math.floor(Math.random() * 50) + 10, // Placeholder for available seats
          showtimes: movieShowtimesMap[movie.id] || []
        })) || [];

        setScheduleInfo({
          flights: flights || [],
          trains: trains || [],
          events: eventsWithSeats,
          movies: moviesWithSeats
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching schedule information:", error);
        setIsLoading(false);
      }
    };

    fetchScheduleInfo();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const findSpecificItem = (type: 'flight' | 'train' | 'event' | 'movie', query: string) => {
    if (!scheduleInfo) return null;
    
    let results = null;
    const lowerQuery = query.toLowerCase();
    
    switch(type) {
      case 'flight':
        results = scheduleInfo.flights.find(flight => 
          flight.flight_number.toLowerCase().includes(lowerQuery) || 
          flight.airline.toLowerCase().includes(lowerQuery) ||
          flight.departure_city.toLowerCase().includes(lowerQuery) ||
          flight.arrival_city.toLowerCase().includes(lowerQuery)
        );
        break;
      case 'train':
        results = scheduleInfo.trains.find(train => 
          train.train_number.toLowerCase().includes(lowerQuery) || 
          train.train_name.toLowerCase().includes(lowerQuery) ||
          train.departure_station.toLowerCase().includes(lowerQuery) ||
          train.arrival_station.toLowerCase().includes(lowerQuery)
        );
        break;
      case 'event':
        results = scheduleInfo.events.find(event => 
          event.name.toLowerCase().includes(lowerQuery) || 
          event.location.toLowerCase().includes(lowerQuery) ||
          event.event_type.toLowerCase().includes(lowerQuery)
        );
        break;
      case 'movie':
        results = scheduleInfo.movies.find(movie => 
          movie.title.toLowerCase().includes(lowerQuery)
        );
        break;
    }
    
    return results;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = input.toLowerCase();
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput('');

    // Process user input and generate response
    setTimeout(() => {
      let botResponse = "I'll help you find what you're looking for. Could you please provide more details?";

      // Check if the user is looking for specific information about flights, trains, events, or movies
      const isAskingForSchedule = userMessage.includes('schedule') || userMessage.includes('time') || 
                                  userMessage.includes('available') || userMessage.includes('when') ||
                                  userMessage.includes('seats') || userMessage.includes('details');
      
      // Check if the user is looking for a specific flight, train, event, or movie
      const isSpecificFlight = userMessage.includes('flight') && 
                               (userMessage.includes('number') || /\b[A-Z]{2}\d+\b/.test(userMessage));
      const isSpecificTrain = userMessage.includes('train') && 
                              (userMessage.includes('number') || /\b\d{4,}\b/.test(userMessage));
      const isSpecificEvent = userMessage.includes('event') && 
                              (/concert|festival|conference|show|game/.test(userMessage));
      const isSpecificMovie = userMessage.includes('movie') && 
                              (/\b(watch|see|movie titled|film called)\b/.test(userMessage));
      
      // Extract specific item details if mentioned
      let specificItemName = '';
      if (isSpecificFlight || isSpecificTrain || isSpecificEvent || isSpecificMovie) {
        const words = userMessage.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
          if (words[i].match(/\b(flight|train|event|movie|titled|called)\b/) && i < words.length - 1) {
            specificItemName = words.slice(i + 1).join(' ').replace(/[,.?!]/g, '');
            break;
          }
        }
      }

      // Check for specific item information
      if (isAskingForSchedule) {
        if (isSpecificFlight && specificItemName) {
          const flightInfo = findSpecificItem('flight', specificItemName);
          if (flightInfo) {
            botResponse = `Here are the details for flight ${(flightInfo as any).flight_number}:\n\n` +
              `Airline: ${(flightInfo as any).airline}\n` +
              `From: ${(flightInfo as any).departure_city}\n` +
              `To: ${(flightInfo as any).arrival_city}\n` +
              `Departure: ${formatDate((flightInfo as any).departure_time)}\n` +
              `Arrival: ${formatDate((flightInfo as any).arrival_time)}\n` +
              `Available Seats: ${(flightInfo as any).available_seats}\n` +
              `Price: ₹${(flightInfo as any).base_price}\n\n` +
              `Would you like to book this flight?`;
          } else {
            botResponse = `I couldn't find any information about a flight matching "${specificItemName}". Please check the flight details or try a different search.`;
          }
        } else if (isSpecificTrain && specificItemName) {
          const trainInfo = findSpecificItem('train', specificItemName);
          if (trainInfo) {
            botResponse = `Here are the details for train ${(trainInfo as any).train_number}:\n\n` +
              `Name: ${(trainInfo as any).train_name}\n` +
              `From: ${(trainInfo as any).departure_station}\n` +
              `To: ${(trainInfo as any).arrival_station}\n` +
              `Departure: ${formatDate((trainInfo as any).departure_time)}\n` +
              `Arrival: ${formatDate((trainInfo as any).arrival_time)}\n` +
              `Available Seats: ${(trainInfo as any).available_seats}\n` +
              `Price: ₹${(trainInfo as any).base_price}\n\n` +
              `Would you like to book this train?`;
          } else {
            botResponse = `I couldn't find any information about a train matching "${specificItemName}". Please check the train details or try a different search.`;
          }
        } else if (isSpecificEvent && specificItemName) {
          const eventInfo = findSpecificItem('event', specificItemName);
          if (eventInfo) {
            botResponse = `Here are the details for event "${(eventInfo as any).name}":\n\n` +
              `Type: ${(eventInfo as any).event_type}\n` +
              `Location: ${(eventInfo as any).location}\n` +
              `Date: ${formatDate((eventInfo as any).start_date)}\n` +
              `Available Seats: ${(eventInfo as any).available_seats || 'Information not available'}\n` +
              `Price: ₹${(eventInfo as any).base_price}\n\n` +
              `Would you like to book tickets for this event?`;
          } else {
            botResponse = `I couldn't find any information about an event matching "${specificItemName}". Please check the event details or try a different search.`;
          }
        } else if (isSpecificMovie && specificItemName) {
          const movieInfo = findSpecificItem('movie', specificItemName);
          if (movieInfo) {
            const showtimes = (movieInfo as any).showtimes?.map((time: string) => formatDate(time)).join('\n- ') || 'No showtimes available';
            botResponse = `Here are the details for movie "${(movieInfo as any).title}":\n\n` +
              `Duration: ${(movieInfo as any).duration || 'Information not available'} minutes\n` +
              `Release Date: ${(movieInfo as any).release_date ? formatDate((movieInfo as any).release_date) : 'Information not available'}\n` +
              `Available Seats: ${(movieInfo as any).available_seats || 'Information not available'}\n` +
              `Price: ₹${(movieInfo as any).base_price}\n\n` +
              `Showtimes:\n- ${showtimes}\n\n` +
              `Would you like to book tickets for this movie?`;
          } else {
            botResponse = `I couldn't find any information about a movie matching "${specificItemName}". Please check the movie title or try a different search.`;
          }
        }
        // Show generic schedule information if no specific item is mentioned
        else if (userMessage.includes('flight')) {
          if (scheduleInfo && scheduleInfo.flights.length > 0) {
            const flightInfo = scheduleInfo.flights.slice(0, 3).map(flight => 
              `${flight.airline} (${flight.flight_number}): ${flight.departure_city} to ${flight.arrival_city}, ${formatDate(flight.departure_time)}, ${flight.available_seats} seats, ₹${flight.base_price}`
            ).join('\n\n');
            
            botResponse = `Here are some upcoming flights:\n\n${flightInfo}\n\nWould you like to book a flight or see more options?`;
          } else {
            botResponse = "I'm having trouble retrieving flight schedules at the moment. Would you like to visit our flights page to see all available options?";
          }
        } else if (userMessage.includes('train')) {
          if (scheduleInfo && scheduleInfo.trains.length > 0) {
            const trainInfo = scheduleInfo.trains.slice(0, 3).map(train => 
              `${train.train_name} (${train.train_number}): ${train.departure_station} to ${train.arrival_station}, ${formatDate(train.departure_time)}, ${train.available_seats} seats, ₹${train.base_price}`
            ).join('\n\n');
            
            botResponse = `Here are some upcoming trains:\n\n${trainInfo}\n\nWould you like to book a train ticket or see more options?`;
          } else {
            botResponse = "I'm having trouble retrieving train schedules at the moment. Would you like to visit our trains page to see all available options?";
          }
        } else if (userMessage.includes('event')) {
          if (scheduleInfo && scheduleInfo.events.length > 0) {
            const eventInfo = scheduleInfo.events.slice(0, 3).map(event => 
              `${event.name}: ${event.location}, ${formatDate(event.start_date)}, ${event.event_type}, Available Seats: ${event.available_seats || 'N/A'}, ₹${event.base_price}`
            ).join('\n\n');
            
            botResponse = `Here are some upcoming events:\n\n${eventInfo}\n\nWould you like to book tickets for an event or see more options?`;
          } else {
            botResponse = "I'm having trouble retrieving event schedules at the moment. Would you like to visit our events page to see all available options?";
          }
        } else if (userMessage.includes('movie')) {
          if (scheduleInfo && scheduleInfo.movies.length > 0) {
            const movieInfo = scheduleInfo.movies.slice(0, 3).map(movie => 
              `${movie.title}: Released on ${movie.release_date ? formatDate(movie.release_date) : 'N/A'}, Duration: ${movie.duration || 'N/A'} minutes, Available Seats: ${movie.available_seats || 'N/A'}, ₹${movie.base_price}`
            ).join('\n\n');
            
            botResponse = `Here are some movies currently showing:\n\n${movieInfo}\n\nWould you like to book tickets for a movie or see more options?`;
          } else {
            botResponse = "I'm having trouble retrieving movie schedules at the moment. Would you like to visit our movies page to see all available options?";
          }
        }
      } 
      // Basic booking and navigation responses without specific schedule info
      else if (userMessage.includes('flight') || userMessage.includes('fly')) {
        botResponse = "I can help you book a flight. Let me take you to our flights page.";
        setTimeout(() => navigate('/flights'), 1000);
      } else if (userMessage.includes('movie') || userMessage.includes('film')) {
        botResponse = "Looking to watch a movie? I'll show you what's playing.";
        setTimeout(() => navigate('/movies'), 1000);
      } else if (userMessage.includes('train') || userMessage.includes('railway')) {
        botResponse = "Let me help you find train tickets.";
        setTimeout(() => navigate('/trains'), 1000);
      } else if (userMessage.includes('event') || userMessage.includes('show')) {
        botResponse = "I'll show you upcoming events in your area.";
        setTimeout(() => navigate('/events'), 1000);
      } else if (userMessage.includes('premium') || userMessage.includes('service') || userMessage.includes('special')) {
        botResponse = "Let me show you our premium services that offer exclusive benefits.";
        setTimeout(() => navigate('/premium-services'), 1000);
      } else if (userMessage.includes('sign') || userMessage.includes('login')) {
        botResponse = "Let me help you with authentication.";
        setTimeout(() => navigate('/signin'), 1000);
      } else if (userMessage.includes('profile') || userMessage.includes('account')) {
        botResponse = "I'll take you to your dashboard.";
        setTimeout(() => navigate('/dashboard'), 1000);
      }
      
      // Payment and ticket specific responses
      else if (userMessage.includes('payment') && userMessage.includes('fail')) {
        botResponse = "I'm sorry to hear about your payment issue. This could be due to insufficient funds, network issues, or card restrictions. You can try again with a different payment method or contact your bank.";
      } else if (userMessage.includes('refund')) {
        botResponse = "For refund inquiries, please check your booking history section in the dashboard. If eligible, you can initiate a refund there. Refunds typically take 5-7 business days to process.";
        setTimeout(() => navigate('/bookings'), 1500);
      } else if (userMessage.includes('cancel')) {
        botResponse = "To cancel a booking, go to your booking history, select the booking you wish to cancel, and click on 'Cancel Booking'. Please note cancellation charges may apply based on the timing.";
        setTimeout(() => navigate('/bookings'), 1500);
      } else if (userMessage.includes('receipt') || userMessage.includes('invoice')) {
        botResponse = "You can find and download your payment receipts from your booking history. Each confirmed booking has an option to view and download the receipt.";
        setTimeout(() => navigate('/bookings'), 1000);
      } else if (userMessage.includes('ticket') && userMessage.includes('print')) {
        botResponse = "To print your tickets, go to your booking history, select the specific booking, and click on 'View Ticket'. From there, you can download or print your tickets.";
        setTimeout(() => navigate('/bookings'), 1000);
      } else if (userMessage.includes('payment method')) {
        botResponse = "We accept various payment methods including credit/debit cards, UPI, and bank transfers. You can select your preferred method during the checkout process.";
      } else if (userMessage.includes('booking') && userMessage.includes('confirm')) {
        botResponse = "Once payment is successful, you'll receive a booking confirmation on the screen and via email. You can also check your booking status in your account dashboard.";
        setTimeout(() => navigate('/dashboard'), 1500);
      } else if (userMessage.includes('coupon') || userMessage.includes('discount')) {
        botResponse = "You can apply coupon codes during the payment process. Enter your code in the designated field and click 'Apply' to get the discount. Keep an eye on our offers section for the latest promotions!";
      }

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg animate-bounce"
        >
          <MessageCircle size={24} />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 flex flex-col animate-fade-in-up shadow-xl border-indigo-200" 
              style={{ height: isMinimized ? '52px' : '96' }}>
          <div className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMinimized(!isMinimized)} 
              className="text-white hover:bg-indigo-700 mr-auto"
            >
              {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Button>
            <h3 className="font-semibold">Booking Assistant</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:bg-indigo-700 ml-auto"
            >
              <X size={20} />
            </Button>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`${
                      message.isBot
                        ? 'bg-gray-100 rounded-br-lg'
                        : 'bg-indigo-600 text-white ml-auto rounded-bl-lg'
                    } p-3 rounded-tl-lg rounded-tr-lg max-w-[80%] animate-fade-in-up whitespace-pre-line`}
                  >
                    {message.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-gray-100 p-3 rounded-lg max-w-[80%] animate-pulse">
                    Loading...
                  </div>
                )}
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-700">
                    <Send size={18} />
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default ChatBot;
