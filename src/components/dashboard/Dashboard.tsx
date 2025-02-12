
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Ticket, CreditCard, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  // This would normally come from your auth state
  const user = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    dateOfBirth: "1990-01-01",
    bookings: [
      { id: 1, type: "Movie", title: "Inception", date: "2024-03-20" },
      { id: 2, type: "Event", title: "Music Festival", date: "2024-04-15" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <Card className="p-6 col-span-1 animate-fade-in-up">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="w-full space-y-2">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Settings size={16} />
                  Settings
                </Button>
                <Button variant="outline" className="w-full flex items-center gap-2 text-red-600 hover:text-red-700">
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            {/* User Details */}
            <Card className="p-6 animate-fade-in-up animation-delay-200">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium">{user.dateOfBirth}</p>
                </div>
              </div>
            </Card>

            {/* Bookings */}
            <Card className="p-6 animate-fade-in-up animation-delay-400">
              <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
              <div className="space-y-4">
                {user.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {booking.type === "Movie" ? (
                        <Ticket className="text-indigo-600" />
                      ) : (
                        <CreditCard className="text-indigo-600" />
                      )}
                      <div>
                        <p className="font-medium">{booking.title}</p>
                        <p className="text-sm text-gray-600">{booking.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{booking.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
