
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

interface Message {
  text: string;
  isBot: boolean;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your booking assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

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
        <Card className="w-80 h-96 flex flex-col animate-fade-in-up">
          <div className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Booking Assistant</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-indigo-700">
              <X size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.isBot
                    ? 'bg-gray-100 rounded-br-lg'
                    : 'bg-indigo-600 text-white ml-auto rounded-bl-lg'
                } p-3 rounded-tl-lg rounded-tr-lg max-w-[80%] animate-fade-in-up`}
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
        </Card>
      )}
    </div>
  );
};

export default ChatBot;
