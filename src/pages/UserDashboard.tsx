
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import BookingHistory from "@/components/bookings/BookingHistory";
import BookingManagement from "@/components/bookings/BookingManagement";
import { motion } from 'framer-motion';
import { UserCog, History, CreditCard, CalendarDays, Map, Ticket, Film, Plane, TrainFront, LogOut, BadgePercent, Gift, Bell } from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Authentication Required</CardTitle>
              <CardDescription className="text-center">Please sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/signin')}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stat = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Sidebar */}
          <Card className="md:w-1/4 h-fit border-none shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
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
                    className="justify-start py-3 px-6 w-full rounded-none data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 transition-all duration-200"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bookings" 
                    className="justify-start py-3 px-6 w-full rounded-none data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 transition-all duration-200"
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    Active Bookings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="justify-start py-3 px-6 w-full rounded-none data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 transition-all duration-200"
                  >
                    <History className="mr-2 h-4 w-4" />
                    Booking History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="profile" 
                    className="justify-start py-3 px-6 w-full rounded-none data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 transition-all duration-200"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Edit Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="benefits" 
                    className="justify-start py-3 px-6 w-full rounded-none data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 transition-all duration-200"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Benefits & Rewards
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="p-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-600 hover:text-red-600 transition-colors"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:w-3/4">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="overview" className="mt-0">
                <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Account Overview</CardTitle>
                        <CardDescription>
                          Welcome back! Here's a summary of your account.
                        </CardDescription>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="rounded-full bg-indigo-50 text-indigo-600 border-indigo-200"
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        Notifications
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      <motion.div variants={stat}>
                        <Card className="border border-indigo-100 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center text-indigo-700">
                              <Ticket className="mr-2 h-4 w-4" />
                              Active Bookings
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold">3</p>
                            <p className="text-xs text-indigo-600 mt-1">2 upcoming this week</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                      
                      <motion.div variants={stat}>
                        <Card className="border border-indigo-100 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center text-indigo-700">
                              <CreditCard className="mr-2 h-4 w-4" />
                              Total Spent
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-3xl font-bold">₹12,450</p>
                            <p className="text-xs text-indigo-600 mt-1">+₹2,300 this month</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                      
                      <motion.div variants={stat}>
                        <Card className="border border-indigo-100 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center text-indigo-700">
                              <CalendarDays className="mr-2 h-4 w-4" />
                              Next Trip
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-base font-semibold">Delhi to Mumbai</p>
                            <p className="text-sm text-indigo-600">In 3 days</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      className="mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Quick Actions</h3>
                        <BadgePercent className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/trains')}
                            className="w-full border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
                          >
                            <TrainFront className="mr-2 h-4 w-4" />
                            Book Train
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/flights')}
                            className="w-full border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
                          >
                            <Plane className="mr-2 h-4 w-4" />
                            Book Flight
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/events')}
                            className="w-full border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Book Event
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/movies')}
                            className="w-full border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
                          >
                            <Film className="mr-2 h-4 w-4" />
                            Book Movie
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <Card className="border border-indigo-100 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                        <CardHeader>
                          <CardTitle className="text-indigo-700 flex items-center gap-2">
                            <Gift className="h-5 w-5" />
                            Special Benefits
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-full">
                                <BadgePercent className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold">Loyalty Rewards</h4>
                                <p className="text-sm text-gray-600">Earn points on every booking</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-purple-100 text-purple-700 rounded-full">
                                <CreditCard className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold">Cashback Offers</h4>
                                <p className="text-sm text-gray-600">10% cashback on first booking</p>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="mt-4 w-full"
                            onClick={() => setActiveTab("benefits")}
                          >
                            View All Benefits
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
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
                <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Update your account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => navigate('/profile/edit')}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                    >
                      Edit Profile Details
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits" className="mt-0">
                <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Benefits & Rewards
                    </CardTitle>
                    <CardDescription>
                      Special perks and offers for our valued customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="space-y-6"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      <motion.div variants={item} className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <h3 className="text-lg font-semibold text-indigo-700">Loyalty Program</h3>
                        <p className="text-gray-600 mb-3">Earn 5 points for every ₹100 spent on our platform.</p>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Your Points</span>
                            <span className="font-bold">245 points</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">245/500 points to next tier</p>
                        </div>
                      </motion.div>

                      <motion.div variants={item} className="border rounded-lg p-4 bg-gradient-to-r from-amber-50 to-yellow-50">
                        <h3 className="text-lg font-semibold text-amber-700">Special Offers</h3>
                        <ul className="space-y-3 mt-3">
                          <li className="flex items-start gap-3">
                            <BadgePercent className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                              <p className="font-medium">10% off on weekend flights</p>
                              <p className="text-sm text-gray-600">Valid until 30 July</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <BadgePercent className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                              <p className="font-medium">Free meal on premium train tickets</p>
                              <p className="text-sm text-gray-600">For bookings above ₹1200</p>
                            </div>
                          </li>
                        </ul>
                      </motion.div>

                      <motion.div variants={item} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-teal-50">
                        <h3 className="text-lg font-semibold text-teal-700">Referral Program</h3>
                        <p className="text-gray-600 mb-3">Invite friends and earn rewards.</p>
                        <div className="flex gap-3">
                          <input 
                            type="text" 
                            value="FRIEND250" 
                            readOnly 
                            className="flex-1 p-2 text-sm border rounded bg-white" 
                          />
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Copy</Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Your friend gets ₹250 off and you earn 100 points</p>
                      </motion.div>
                    </motion.div>
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
