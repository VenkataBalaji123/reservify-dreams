
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type Event = {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string;
  event_type: string;
  base_price: number;
  max_price: number | null;
  image_url: string | null;
};

const AdminEventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    event_type: "",
    base_price: "",
    max_price: "",
    image_url: ""
  });
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });
        
      if (error) throw error;
      
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredEvents = events.filter(event => {
    const name = event.name.toLowerCase();
    const location = event.location.toLowerCase();
    const type = event.event_type.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return name.includes(search) || location.includes(search) || type.includes(search);
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      event_type: "",
      base_price: "",
      max_price: "",
      image_url: ""
    });
  };
  
  const handleAddEvent = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description || "",
      start_date: new Date(event.start_date).toISOString().slice(0, 16),
      end_date: new Date(event.end_date).toISOString().slice(0, 16),
      location: event.location,
      event_type: event.event_type,
      base_price: event.base_price.toString(),
      max_price: event.max_price?.toString() || "",
      image_url: event.image_url || ""
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };
  
  const submitAddEvent = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("events")
        .insert([
          {
            name: formData.name,
            description: formData.description,
            start_date: formData.start_date,
            end_date: formData.end_date,
            location: formData.location,
            event_type: formData.event_type,
            base_price: parseFloat(formData.base_price),
            max_price: formData.max_price ? parseFloat(formData.max_price) : null,
            image_url: formData.image_url || null
          }
        ]);
        
      if (error) throw error;
      
      toast.success("Event added successfully");
      setIsAddDialogOpen(false);
      resetForm();
      await fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event");
    } finally {
      setIsLoading(false);
    }
  };
  
  const submitEditEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("events")
        .update({
          name: formData.name,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          location: formData.location,
          event_type: formData.event_type,
          base_price: parseFloat(formData.base_price),
          max_price: formData.max_price ? parseFloat(formData.max_price) : null,
          image_url: formData.image_url || null
        })
        .eq("id", selectedEvent.id);
        
      if (error) throw error;
      
      toast.success("Event updated successfully");
      setIsEditDialogOpen(false);
      await fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setIsLoading(false);
    }
  };
  
  const submitDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      setIsLoading(true);
      
      // Delete the event
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", selectedEvent.id);
        
      if (error) throw error;
      
      toast.success("Event deleted successfully");
      setIsDeleteDialogOpen(false);
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && events.length === 0) {
    return (
      <div className="flex justify-center my-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Event Management</CardTitle>
            <CardDescription>Create, edit, or remove events</CardDescription>
          </div>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={handleAddEvent}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
        <div className="flex items-center mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No events found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{event.name}</span>
                        {event.description && (
                          <span className="text-xs text-gray-500 truncate max-w-[200px]">
                            {event.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {event.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {format(new Date(event.start_date), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(event.start_date), "h:mm a")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        {event.base_price.toFixed(2)}
                        {event.max_price && (
                          <span className="text-xs text-gray-500 ml-1">
                            - ${event.max_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditEvent(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteEvent(event)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event for users to book tickets
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="start_date">Start Date & Time</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="end_date">End Date & Time</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="event_type">Event Type</Label>
                <select
                  id="event_type"
                  name="event_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.event_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select type</option>
                  <option value="concert">Concert</option>
                  <option value="sports">Sports</option>
                  <option value="theater">Theater</option>
                  <option value="conference">Conference</option>
                  <option value="festival">Festival</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="base_price">Base Price ($)</Label>
                <Input
                  id="base_price"
                  name="base_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.base_price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="max_price">Max Price ($) (Optional)</Label>
                <Input
                  id="max_price"
                  name="max_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.max_price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="image_url">Image URL (Optional)</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={submitAddEvent}
              disabled={isLoading || !formData.name || !formData.start_date || !formData.end_date || !formData.location || !formData.event_type || !formData.base_price}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-name">Event Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-start_date">Start Date & Time</Label>
                <Input
                  id="edit-start_date"
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-end_date">End Date & Time</Label>
                <Input
                  id="edit-end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-event_type">Event Type</Label>
                <select
                  id="edit-event_type"
                  name="event_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.event_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select type</option>
                  <option value="concert">Concert</option>
                  <option value="sports">Sports</option>
                  <option value="theater">Theater</option>
                  <option value="conference">Conference</option>
                  <option value="festival">Festival</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-base_price">Base Price ($)</Label>
                <Input
                  id="edit-base_price"
                  name="base_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.base_price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-max_price">Max Price ($) (Optional)</Label>
                <Input
                  id="edit-max_price"
                  name="max_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.max_price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-image_url">Image URL (Optional)</Label>
                <Input
                  id="edit-image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={submitEditEvent}
              disabled={isLoading || !formData.name || !formData.start_date || !formData.end_date || !formData.location || !formData.event_type || !formData.base_price}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Update Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Event Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedEvent && (
              <div className="text-sm">
                <p className="font-medium">{selectedEvent.name}</p>
                <p className="text-gray-500 mt-1">
                  {format(new Date(selectedEvent.start_date), "MMMM d, yyyy 'at' h:mm a")}
                </p>
                <p className="text-gray-500">{selectedEvent.location}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={submitDeleteEvent}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminEventManagement;
