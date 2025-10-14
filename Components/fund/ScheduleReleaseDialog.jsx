import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FundTransaction, Project } from "@/entities/all";
import { PlusCircle, ChevronDown } from "lucide-react";

export function ScheduleReleaseDialog({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const [form, setForm] = useState({
    project_id: "",
    project_title: "",
    amount: "",
    transaction_date: `${yyyy}-${mm}-${dd}`,
    from_entity: "Ministry of Tribal Affairs",
    to_entity: "",
    reference_no: "",
    purpose: ""
  });

  React.useEffect(() => {
    (async () => {
      try {
        const list = await Project.list();
        setProjects(list);
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    })();
  }, []);

  const onProjectChange = (id) => {
    const p = projects.find(x => x.id === id);
    setForm(prev => ({ ...prev, project_id: id, project_title: p?.title || "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.project_id || !form.amount) {
      alert("Please select a project and enter amount");
      return;
    }
    setSaving(true);
    try {
      await FundTransaction.create({
        project_id: form.project_id,
        project_title: form.project_title,
        amount: Number(form.amount),
        from_entity: form.from_entity,
        to_entity: form.to_entity,
        reference_no: form.reference_no,
        purpose: form.purpose,
        status: "Released",
        transaction_date: new Date(form.transaction_date).toISOString()
      });
      setOpen(false);
      setForm({
        project_id: "",
        project_title: "",
        amount: "",
        transaction_date: `${yyyy}-${mm}-${dd}`,
        from_entity: "Ministry of Tribal Affairs",
        to_entity: "",
        reference_no: "",
        purpose: ""
      });
      if (onSuccess) onSuccess();
      alert("Release scheduled");
    } catch (e) {
      console.error(e);
      alert("Failed to schedule release");
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-green-600">
          <PlusCircle className="w-4 h-4 mr-2" /> Schedule Release
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Schedule Fund Release</DialogTitle>
          <DialogDescription>Create a new fund release transaction</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Project *</Label>
            <Select value={form.project_id} onValueChange={onProjectChange}>
              <SelectTrigger>
                <button type="button" className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                  <SelectValue placeholder="Select project" />
                  <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                </button>
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (₹) *</Label>
              <Input type="number" placeholder="0" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Transaction Date *</Label>
              <Input type="date" value={form.transaction_date} onChange={e => setForm(prev => ({ ...prev, transaction_date: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Entity *</Label>
              <Input value={form.from_entity} onChange={e => setForm(prev => ({ ...prev, from_entity: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>To Entity *</Label>
              <Input value={form.to_entity} onChange={e => setForm(prev => ({ ...prev, to_entity: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reference Number</Label>
            <Input placeholder="Sanction order number" value={form.reference_no} onChange={e => setForm(prev => ({ ...prev, reference_no: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Purpose</Label>
            <Textarea rows={4} value={form.purpose} onChange={e => setForm(prev => ({ ...prev, purpose: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-500 to-green-600">{saving ? 'Scheduling...' : 'Schedule Release'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleReleaseDialog