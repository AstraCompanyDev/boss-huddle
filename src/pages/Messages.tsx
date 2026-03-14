import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Send,
  Search,
  Hash,
  Loader2,
} from "lucide-react";

export default function Messages() {
  const { channelName } = useParams();
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const { data: channels = [], isLoading: channelsLoading } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("channels").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (channels.length > 0 && !selectedChannelId) {
      const match = channelName
        ? channels.find((c) => c.name === channelName)
        : channels[0];
      if (match) setSelectedChannelId(match.id);
    }
  }, [channels, channelName, selectedChannelId]);

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", selectedChannelId],
    queryFn: async () => {
      if (!selectedChannelId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("channel_id", selectedChannelId)
        .order("created_at", { ascending: true });
      if (error) throw error;

      const userIds = [...new Set(data.map((m) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name]) ?? []);

      return data.map((m) => ({
        ...m,
        user_name: profileMap.get(m.user_id) || "Unknown User",
      }));
    },
    enabled: !!selectedChannelId,
  });

  useEffect(() => {
    if (!selectedChannelId) return;
    const channel = supabase
      .channel(`messages-${selectedChannelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${selectedChannelId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messages", selectedChannelId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChannelId, queryClient]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedChannelId || !currentUserId) throw new Error("Not ready");
      const { error } = await supabase.from("messages").insert({
        channel_id: selectedChannelId,
        user_id: currentUserId,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", selectedChannelId] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    },
  });

  const handleSend = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    sendMessage.mutate(trimmed);
  };

  const selectedChannel = channels.find((c) => c.id === selectedChannelId);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-2xl overflow-hidden border bg-card">
      {/* Channel List */}
      <div className="w-72 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search channels..." className="pl-10 bg-secondary border-0 rounded-xl" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Channels
            </h3>
            {channelsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannelId(channel.id)}
                  className={`w-full text-left p-3 rounded-xl mb-1 transition-colors ${
                    selectedChannelId === channel.id
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Hash className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{channel.name}</p>
                      {selectedChannelId !== channel.id && channel.description && (
                        <p className="text-xs opacity-60 truncate">
                          {channel.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
              <Hash className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">
                {selectedChannel?.name || "Select a channel"}
              </h2>
              {selectedChannel?.description && (
                <p className="text-xs text-muted-foreground">{selectedChannel.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
          {messagesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Hash className="h-8 w-8 opacity-40" />
              </div>
              <p className="text-lg font-semibold">No messages yet</p>
              <p className="text-sm">Be the first to send a message!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex space-x-3 group">
                  <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-semibold flex-shrink-0">
                    {getInitials(message.user_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-semibold text-sm">{message.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.created_at!), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={`Message #${selectedChannel?.name || "channel"}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={!selectedChannelId || sendMessage.isPending}
              className="flex-1 rounded-xl"
            />
            <Button
              size="icon"
              disabled={!newMessage.trim() || sendMessage.isPending}
              onClick={handleSend}
              className="rounded-full h-10 w-10"
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
