import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Approval } from '@/entities/Approval';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '../components/LanguageContext';

const ApprovalItem = ({ approval, onAction }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);
  const { t } = useLanguage();

  const handleAction = async (type) => {
    setActionType(type);
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    setProcessing(true);
    await onAction(approval.id, actionType, comments);
    setProcessing(false);
    setDialogOpen(false);
    setComments('');
  };

  return (
    <>
      <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-gray-50/50">
        <div>
          <p className="font-semibold">{approval.step_name}</p>
          <p className="text-sm text-gray-500">{t.project || "Project"}: {approval.project_title}</p>
          <p className="text-xs text-gray-400 mt-1">
            {t.due || "Due"}: {format(new Date(approval.sla_deadline), "dd MMM, yyyy")} ({formatDistanceToNow(new Date(approval.sla_deadline), { addSuffix: true })})
          </p>
        </div>
        {approval.status === 'Pending' && (
          <div className="flex gap-2 flex-shrink-0">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => handleAction('Rejected')}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />{t.reject || "Reject"}
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleAction('Approved')}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />{t.approve || "Approve"}
            </Button>
          </div>
        )}
        {approval.status === 'Approved' && (
          <p className="text-sm text-green-600 font-medium flex items-center gap-2">
            <ThumbsUp className="w-4 h-4"/> {t.approved || "Approved"} {t.on || "on"} {format(new Date(approval.timestamp), "dd MMM")}
          </p>
        )}
        {approval.status === 'Rejected' && (
          <p className="text-sm text-red-600 font-medium flex items-center gap-2">
            <ThumbsDown className="w-4 h-4"/> {t.rejected || "Rejected"} {t.on || "on"} {format(new Date(approval.timestamp), "dd MMM")}
          </p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'Approved' ? t.confirmApproval || 'Confirm Approval' : t.confirmRejection || 'Confirm Rejection'}
            </DialogTitle>
            <DialogDescription>
              {approval.step_name} - {approval.project_title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder={t.addComments || "Add your comments (optional)..."}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>
              {t.cancel || "Cancel"}
            </Button>
            <Button 
              onClick={confirmAction} 
              disabled={processing}
              className={actionType === 'Approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {processing ? t.processing : actionType === 'Approved' ? t.approve : t.reject}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await Approval.list();
      setApprovals(data);
    } catch (error) {
      console.error("Failed to fetch approvals", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (approvalId, action, comments) => {
    try {
      await Approval.update(approvalId, {
        status: action,
        comments: comments,
        timestamp: new Date().toISOString()
      });
      // Optimistically update the local list so items move tabs immediately
      setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: action, comments, timestamp: new Date().toISOString() } : a))
      alert(`${t.approvalUpdated || "Approval updated successfully"}!`);
      fetchData();
    } catch (error) {
      console.error("Failed to update approval:", error);
      alert(t.updateFailed || "Failed to update approval");
    }
  };

  const pending = approvals.filter(a => a.status === 'Pending');
  const approved = approvals.filter(a => a.status === 'Approved');
  const rejected = approvals.filter(a => a.status === 'Rejected');

  const renderContent = (items, status) => {
    if (loading) return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
    if (items.length === 0) return (
      <div className="text-center py-12 text-gray-500">
        <CheckSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="font-semibold">{t.noItems || "No"} {status.toLowerCase()} {t.items || "items"}.</p>
        <p className="text-sm">{t.noItemsDesc || "There are no items currently in this category"}.</p>
      </div>
    );
    return <div className="space-y-4 p-4">{items.map(item => <ApprovalItem key={item.id} approval={item} onAction={handleAction} />)}</div>;
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
        <CheckSquare className="w-8 h-8 text-orange-500" />
        {t.approvalsWorkflow || "Approvals Workflow"}
      </h1>
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="pending">{t.pending || "Pending"} ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">{t.approved || "Approved"} ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">{t.rejected || "Rejected"} ({rejected.length})</TabsTrigger>
        </TabsList>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-4">
          <TabsContent value="pending" className="m-0">
            <CardHeader>
              <CardTitle>{t.pendingApprovals || "Pending Approvals"}</CardTitle>
              <CardDescription>{t.pendingApprovalsDesc || "Items awaiting your review and action"}.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">{renderContent(pending, t.pending || 'Pending')}</CardContent>
          </TabsContent>
          <TabsContent value="approved" className="m-0">
            <CardHeader>
              <CardTitle>{t.approvedItems || "Approved Items"}</CardTitle>
              <CardDescription>{t.approvedItemsDesc || "History of approved items"}.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">{renderContent(approved, t.approved || 'Approved')}</CardContent>
          </TabsContent>
          <TabsContent value="rejected" className="m-0">
            <CardHeader>
              <CardTitle>{t.rejectedItems || "Rejected Items"}</CardTitle>
              <CardDescription>{t.rejectedItemsDesc || "History of rejected items"}.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">{renderContent(rejected, t.rejected || 'Rejected')}</CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}