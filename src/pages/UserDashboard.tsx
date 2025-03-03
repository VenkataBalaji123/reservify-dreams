
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import BookingHistory from "@/components/bookings/BookingHistory";
import BookingManagement from "@/components/bookings/BookingManagement";
import { motion } from 'framer-motion';
import { UserCog, History, CreditCard, CalendarDays, Map, Ticket } from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/signin')}
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Sidebar */}
          <Card className="md:w-1/4 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                User Dashboard
              </CardTitle>
              <CardDescription>
                Manage your bookings and profile
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs 
                orientation="vertical" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto w-full rounded-none bg-transparent">
                  <TabsTrigger 
                    value="overview" 
                    className="justify-start py-3 px-6 w-full rounded-none data-[state=active]:bg-gray-100"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bookings" 
                    className="justify-start py-3 px-6 w-full rounded-none data-[state=active]:bg-gray-100"
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    Active Bookings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="justify-start py-3 px-6 w-full rounded-none data-[state=active]:bg-gray-100"
                  >
                    <History className="mr-2 h-4 w-4" />
                    Booking History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="profile" 
                    className="justify-start py-3 px-6 w-full rounded-none data-[state=active]:bg-gray-100"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Edit Profile
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:w-3/4">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="overview" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Overview</CardTitle>
                    <CardDescription>
                      Welcome back! Here's a summary of your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Ticket className="mr-2 h-4 w-4" />
                              Active Bookings
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold">3</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              Total Spent
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold">₹12,450</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <CalendarDays className="mr-2 h-4 w-4" />
                              Next Trip
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-base font-semibold">Delhi to Mumbai</p>
                            <p className="text-sm text-gray-500">In 3 days</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" onClick={() => navigate('/trains')}>
                          <Train className="mr-2 h-4 w-4" />
                          Book Train
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/flights')}>
                          <Plane className="mr-2 h-4 w-4" />
                          Book Flight
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/events')}>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          Book Event
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/movies')}>
                          <Film className="mr-2 h-4 w-4" />
                          Book Movie
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="mt-0">
                <BookingManagement />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <BookingHistory />
              </TabsContent>

              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Update your account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate('/profile/edit')}>
                      Edit Profile Details
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
