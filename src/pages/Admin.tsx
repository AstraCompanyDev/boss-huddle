import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  FileText, 
  Target, 
  Mail, 
  Calendar, 
  Users, 
  Circle,
  MessageSquare,
  Eye,
  Trash2,
  Plus,
  Send,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface UserFile {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  file_url: string | null;
  created_at: string | null;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Goal {
  id: string;
  title: string;
  description: string | null;
  progress: number | null;
  status: string | null;
  deadline: string | null;
  user_id: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface InboxMessage {
  id: string;
  from_user_id: string | null;
  subject: string;
  message: string;
  is_read: boolean | null;
  created_at: string | null;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: string | null;
  created_at: string | null;
}

interface TeamMember {
  id: string;
  user_id: string;
  status: string | null;
  streak: number | null;
  goals_count: number | null;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
    company: string | null;
  };
}

export default function Admin() {
  const { toast } = useToast();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
    event_type: "meeting"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch files with user profiles
      const { data: filesData } = await supabase
        .from('user_files')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch goals with user profiles  
      const { data: goalsData } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch inbox messages
      const { data: inboxData } = await supabase
        .from('admin_inbox')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      // Fetch team members with profiles
      const { data: membersData } = await supabase
        .from('team_members')
        .select('*');

      // Fetch profiles separately
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*');

      // Map profiles to data
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      setFiles((filesData || []).map(f => ({
        ...f,
        profiles: profilesMap.get(f.user_id)
      })));

      setGoals((goalsData || []).map(g => ({
        ...g,
        profiles: profilesMap.get(g.user_id)
      })));

      setInbox((inboxData || []).map(m => ({
        ...m,
        profiles: m.from_user_id ? profilesMap.get(m.from_user_id) : undefined
      })));

      setEvents(eventsData || []);

      setMembers((membersData || []).map(m => ({
        ...m,
        profiles: profilesMap.get(m.user_id)
      })));

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error loading data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) {
      toast({
        title: "Missing fields",
        description: "Please fill in the title and date",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('events')
        .insert({
          title: newEvent.title,
          description: newEvent.description || null,
          event_date: new Date(newEvent.event_date).toISOString(),
          event_type: newEvent.event_type,
          created_by: user?.id
        });

      if (error) throw error;

      toast({ title: "Event created successfully" });
      setNewEventDialogOpen(false);
      setNewEvent({ title: "", description: "", event_date: "", event_type: "meeting" });
      fetchData();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error creating event",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({ title: "Event deleted" });
      fetchData();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error deleting event",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('admin_inbox')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-muted-foreground';
    }
  };

  const onlineMembers = members.filter(m => m.status === 'online');
  const unreadMessages = inbox.filter(m => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Monitor activity, manage events, and communicate with users
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{goals.filter(g => g.status !== 'completed').length}</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold">{unreadMessages}</p>
              </div>
              <Mail className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="files" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Files</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="inbox" className="flex items-center gap-2 relative">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Inbox</span>
            {unreadMessages > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
        </TabsList>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Uploaded Files</CardTitle>
              <CardDescription>Monitor all files uploaded by users</CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No files uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{file.file_name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.file_size)}</span>
                            <span>•</span>
                            <span>{file.file_type || 'Unknown type'}</span>
                            <span>•</span>
                            <span>by {file.profiles?.full_name || 'Unknown user'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {file.created_at ? format(new Date(file.created_at), 'MMM d, yyyy') : 'Unknown date'}
                        </span>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goals Overview</CardTitle>
              <CardDescription>View all user goals and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No goals created yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div key={goal.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={goal.profiles?.avatar_url || undefined} />
                            <AvatarFallback>
                              {goal.profiles?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{goal.title}</p>
                            <p className="text-sm text-muted-foreground">
                              by {goal.profiles?.full_name || 'Unknown user'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={goal.status === 'completed' ? 'default' : goal.status === 'at-risk' ? 'destructive' : 'secondary'}>
                          {goal.status || 'in-progress'}
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${goal.progress || 0}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium">{goal.progress || 0}%</span>
                        {goal.deadline && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(goal.deadline), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inbox Tab */}
        <TabsContent value="inbox" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Messages from users</CardDescription>
              </CardHeader>
              <CardContent>
                {inbox.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {inbox.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedMessage?.id === message.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        } ${!message.is_read ? 'border-l-4 border-l-primary' : ''}`}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (!message.is_read) handleMarkAsRead(message.id);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.profiles?.avatar_url || undefined} />
                            <AvatarFallback>
                              {message.profiles?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">
                                {message.profiles?.full_name || 'Unknown user'}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {message.created_at ? format(new Date(message.created_at), 'MMM d') : ''}
                              </span>
                            </div>
                            <p className="text-sm font-medium truncate">{message.subject}</p>
                            <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedMessage ? selectedMessage.subject : 'Select a message'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMessage ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedMessage.profiles?.avatar_url || undefined} />
                        <AvatarFallback>
                          {selectedMessage.profiles?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedMessage.profiles?.full_name || 'Unknown user'}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedMessage.created_at ? format(new Date(selectedMessage.created_at), 'MMM d, yyyy h:mm a') : ''}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Reply</Label>
                      <Textarea 
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={4}
                      />
                      <Button className="w-full" onClick={() => {
                        toast({ title: "Reply sent!" });
                        setReplyMessage("");
                      }}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a message to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Manage events that appear on user dashboards</CardDescription>
              </div>
              <Dialog open={newEventDialogOpen} onOpenChange={setNewEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Add a new event that will appear on all user dashboards
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Title</Label>
                      <Input 
                        id="event-title" 
                        placeholder="Event title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea 
                        id="event-description" 
                        placeholder="Event description (optional)"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Date & Time</Label>
                      <Input 
                        id="event-date" 
                        type="datetime-local"
                        value={newEvent.event_date}
                        onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Event Type</Label>
                      <Select 
                        value={newEvent.event_type} 
                        onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewEventDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEvent}>
                      Create Event
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No events scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                          <span className="text-xs text-primary font-medium">
                            {format(new Date(event.event_date), 'MMM')}
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {format(new Date(event.event_date), 'd')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{event.event_type}</Badge>
                            <span>{format(new Date(event.event_date), 'h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>View member status and send direct messages</CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No members yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member) => (
                    <div key={member.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.profiles?.avatar_url || undefined} />
                            <AvatarFallback>
                              {member.profiles?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(member.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{member.profiles?.full_name || 'Unknown user'}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {member.profiles?.role || 'Member'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>{member.goals_count || 0} goals</span>
                        <span>{member.streak || 0} day streak</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
