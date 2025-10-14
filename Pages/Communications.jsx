import React, { useState } from 'react';
import { MessageSquare, Send, Pin, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '../Components/LanguageContext';

const sampleMessages = [
  {
    id: "msg1",
    type: "announcement",
    from: "Ministry of Tribal Affairs",
    title: "Q4 Report Submission Deadline Extended",
    content: "The deadline for Q4 progress reports has been extended to January 31, 2025. All state nodal officers are requested to ensure timely submission with complete documentation.",
    timestamp: "2025-01-02T14:30:00Z",
    isPinned: true,
    recipients: "All States"
  },
  {
    id: "msg2",
    type: "thread",
    from: "Rajesh Kumar (Maharashtra)",
    title: "Query regarding GIA fund allocation",
    content: "We have completed verification of 150 beneficiaries for GIA scholarships. Requesting guidance on the next steps for fund disbursement.",
    timestamp: "2025-01-03T10:15:00Z",
    replies: 3,
    lastReply: "2025-01-03T16:45:00Z"
  },
  {
    id: "msg3",
    type: "announcement",
    from: "Centre - PMU",
    title: "New Photo Evidence Guidelines",
    content: "Updated guidelines for geo-tagged photo submissions are now available. All field officers must ensure photos include timestamp, GPS coordinates, and milestone reference.",
    timestamp: "2024-12-30T09:00:00Z",
    isPinned: true,
    recipients: "All Agencies"
  },
  {
    id: "msg4",
    type: "thread",
    from: "Lakshmi Iyer (Tamil Nadu)",
    title: "Hostel construction material procurement",
    content: "Seeking recommendations for pre-approved vendors for construction materials. Our current vendor list needs updating.",
    timestamp: "2025-01-01T11:20:00Z",
    replies: 5,
    lastReply: "2025-01-02T14:30:00Z"
  },
  {
    id: "msg5",
    type: "announcement",
    from: "State - Uttar Pradesh",
    title: "Training Workshop Schedule - February 2025",
    content: "We are organizing a 2-day training workshop on 'Best Practices in Project Monitoring' on February 10-11, 2025. Registration link will be shared soon.",
    timestamp: "2024-12-28T08:00:00Z",
    recipients: "UP District Officers"
  }
];

export default function Communications() {
  const [messages] = useState(sampleMessages);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const { t } = useLanguage();
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    content: '',
    type: 'announcement',
    recipients: 'All States',
    priority: 'normal'
  });

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setBroadcasting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(t.broadcastSent || "Broadcast sent successfully to " + broadcastData.recipients);
    setBroadcastOpen(false);
    setBroadcastData({
      title: '',
      content: '',
      type: 'announcement',
      recipients: 'All States',
      priority: 'normal'
    });
    setBroadcasting(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-orange-500" />
          {t.communicationHub || "Communication Hub"}
        </h1>
        <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-green-600">
              <Send className="w-4 h-4 mr-2" /> {t.newBroadcast || "New Broadcast"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.createBroadcast || "Create New Broadcast"}</DialogTitle>
              <DialogDescription>{t.sendMessage || "Send messages to users across the portal"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="space-y-2">
                <Label>{t.messageType || "Message Type"}</Label>
                <Select value={broadcastData.type} onValueChange={v => setBroadcastData({...broadcastData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">{t.announcement || "Announcement"}</SelectItem>
                    <SelectItem value="alert">{t.alert || "Alert"}</SelectItem>
                    <SelectItem value="update">{t.update || "Update"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.recipients || "Recipients"}</Label>
                <Select value={broadcastData.recipients} onValueChange={v => setBroadcastData({...broadcastData, recipients: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All States">{t.allStates || "All States"}</SelectItem>
                    <SelectItem value="All Agencies">{t.allAgencies || "All Agencies"}</SelectItem>
                    <SelectItem value="All District Officers">{t.allDistrictOfficers || "All District Officers"}</SelectItem>
                    <SelectItem value="Admin Users">{t.adminUsers || "Admin Users"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.title || "Title"} *</Label>
                <Input 
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({...broadcastData, title: e.target.value})}
                  placeholder={t.enterTitle || "Enter broadcast title..."}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t.message || "Message"} *</Label>
                <Textarea
                  value={broadcastData.content}
                  onChange={(e) => setBroadcastData({...broadcastData, content: e.target.value})}
                  placeholder={t.enterMessage || "Enter your message..."}
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t.priority || "Priority"}</Label>
                <Select value={broadcastData.priority} onValueChange={v => setBroadcastData({...broadcastData, priority: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t.low || "Low"}</SelectItem>
                    <SelectItem value="normal">{t.normal || "Normal"}</SelectItem>
                    <SelectItem value="high">{t.high || "High"}</SelectItem>
                    <SelectItem value="urgent">{t.urgent || "Urgent"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setBroadcastOpen(false)} disabled={broadcasting}>
                  {t.cancel || "Cancel"}
                </Button>
                <Button type="submit" disabled={broadcasting} className="bg-gradient-to-r from-orange-500 to-green-600">
                  {broadcasting ? t.sending : t.sendBroadcast || "Send Broadcast"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Pinned Announcements */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-green-50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pin className="w-5 h-5 text-orange-600" />
            {t.pinnedAnnouncements || "Pinned Announcements"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.filter(m => m.isPinned).map(msg => (
            <div key={msg.id} className="bg-white p-4 rounded-xl border border-orange-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge className="bg-orange-100 text-orange-800 mb-2">{msg.from}</Badge>
                  <h3 className="font-semibold text-gray-900">{msg.title}</h3>
                </div>
                <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</span>
              </div>
              <p className="text-sm text-gray-600">{msg.content}</p>
              <p className="text-xs text-gray-500 mt-2">{t.to || "To"}: {msg.recipients}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Message Threads */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t.discussionThreads || "Discussion Threads"}</CardTitle>
          <CardDescription>{t.projectConversations || "Project-specific conversations and queries"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.filter(m => m.type === "thread").map(msg => (
              <div key={msg.id} className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-400 to-green-500">
                    <AvatarFallback className="text-white font-semibold">
                      {msg.from.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{msg.from}</p>
                      <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</span>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">{msg.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{msg.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{msg.replies} {t.replies || "replies"}</span>
                      <span>{t.lastReply || "Last reply"} {formatDistanceToNow(new Date(msg.lastReply), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t.recentAnnouncements || "Recent Announcements"}</CardTitle>
          <CardDescription>{t.officialCommunications || "Official communications from Centre and State authorities"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.filter(m => m.type === "announcement" && !m.isPinned).map(msg => (
              <div key={msg.id} className="p-4 border rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="mb-2">{msg.from}</Badge>
                  <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{msg.title}</h4>
                <p className="text-sm text-gray-600">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-2">{t.recipients || "Recipients"}: {msg.recipients}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}