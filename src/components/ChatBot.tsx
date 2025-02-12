
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I'll help you find the best options for your needs. Could you please provide more details?", 
        isBot: true 
      }]);
    }, 1000);

    setInput('');
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
