
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
    name: string;
    location: string;
    start_date: string;
    event_type: string;
    base_price: number;
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
  const navigate = useNavigate();

  // Fetch schedule information when the component mounts
  useEffect(() => {
    const fetchScheduleInfo = async () => {
      try {
        // Fetch flights
        const { data: flights } = await supabase
          .from('flights')
          .select('flight_number, airline, departure_city, arrival_city, departure_time, arrival_time, available_seats, base_price')
          .limit(10);

        // Fetch trains
        const { data: trains } = await supabase
          .from('train_routes')
          .select('train_number, train_name, departure_station, arrival_station, departure_time, arrival_time, available_seats, base_price')
          .limit(10);

        // Fetch events
        const { data: events } = await supabase
          .from('events')
          .select('name, location, start_date, event_type, base_price')
          .limit(10);

        setScheduleInfo({
          flights: flights || [],
          trains: trains || [],
          events: events || []
        });
      } catch (error) {
        console.error("Error fetching schedule information:", error);
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

      // Basic booking and navigation responses
      if (userMessage.includes('flight') || userMessage.includes('fly')) {
        if (userMessage.includes('schedule') || userMessage.includes('time') || userMessage.includes('available')) {
          // Provide flight schedule information
          if (scheduleInfo && scheduleInfo.flights.length > 0) {
            const flightInfo = scheduleInfo.flights.slice(0, 3).map(flight => 
              `${flight.airline} (${flight.flight_number}): ${flight.departure_city} to ${flight.arrival_city}, ${formatDate(flight.departure_time)}, ${flight.available_seats} seats, ₹${flight.base_price}`
            ).join('\n\n');
            
            botResponse = `Here are some upcoming flights:\n\n${flightInfo}\n\nWould you like to book a flight or see more options?`;
          } else {
            botResponse = "I'm having trouble retrieving flight schedules at the moment. Would you like to visit our flights page to see all available options?";
          }
        } else {
          botResponse = "I can help you book a flight. Let me take you to our flights page.";
          setTimeout(() => navigate('/flights'), 1000);
        }
      } else if (userMessage.includes('movie') || userMessage.includes('film')) {
        botResponse = "Looking to watch a movie? I'll show you what's playing.";
        setTimeout(() => navigate('/movies'), 1000);
      } else if (userMessage.includes('train') || userMessage.includes('railway')) {
        if (userMessage.includes('schedule') || userMessage.includes('time') || userMessage.includes('available')) {
          // Provide train schedule information
          if (scheduleInfo && scheduleInfo.trains.length > 0) {
            const trainInfo = scheduleInfo.trains.slice(0, 3).map(train => 
              `${train.train_name} (${train.train_number}): ${train.departure_station} to ${train.arrival_station}, ${formatDate(train.departure_time)}, ${train.available_seats} seats, ₹${train.base_price}`
            ).join('\n\n');
            
            botResponse = `Here are some upcoming trains:\n\n${trainInfo}\n\nWould you like to book a train ticket or see more options?`;
          } else {
            botResponse = "I'm having trouble retrieving train schedules at the moment. Would you like to visit our trains page to see all available options?";
          }
        } else {
          botResponse = "Let me help you find train tickets.";
          setTimeout(() => navigate('/trains'), 1000);
        }
      } else if (userMessage.includes('event') || userMessage.includes('show')) {
        if (userMessage.includes('schedule') || userMessage.includes('time') || userMessage.includes('available')) {
          // Provide event schedule information
          if (scheduleInfo && scheduleInfo.events.length > 0) {
            const eventInfo = scheduleInfo.events.slice(0, 3).map(event => 
              `${event.name}: ${event.location}, ${formatDate(event.start_date)}, ${event.event_type}, ₹${event.base_price}`
            ).join('\n\n');
            
            botResponse = `Here are some upcoming events:\n\n${eventInfo}\n\nWould you like to book tickets for an event or see more options?`;
          } else {
            botResponse = "I'm having trouble retrieving event schedules at the moment. Would you like to visit our events page to see all available options?";
          }
        } else {
          botResponse = "I'll show you upcoming events in your area.";
          setTimeout(() => navigate('/events'), 1000);
        }
      } else if (userMessage.includes('sign') || userMessage.includes('login')) {
        botResponse = "Let me help you with authentication.";
        setTimeout(() => navigate('/signin'), 1000);
      } else if (userMessage.includes('profile') || userMessage.includes('account')) {
        botResponse = "I'll take you to your dashboard.";
        setTimeout(() => navigate('/dashboard'), 1000);
      } else if (userMessage.includes('service') || userMessage.includes('premium')) {
        botResponse = "We offer several premium services including Personal Travel Concierge, Mystery Destination packages, and Smart Bundle Builders. Would you like to learn more about these?";
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
