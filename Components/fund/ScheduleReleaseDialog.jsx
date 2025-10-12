import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FundTransaction, Project } from "@/entities/all";
import { PlusCircle } from "lucide-react";

export function ScheduleReleaseDialog({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    project_id: "",
    project_title: "",
    amount: "",
    from_entity: "Centre",
    to_entity: "State",
    remarks: ""
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
        remarks: form.remarks,
        status: "Pending",
        transaction_date: new Date().toISOString()
      });
      setOpen(false);
      setForm({ project_id: "", project_title: "", amount: "", from_entity: "Centre", to_entity: "State", remarks: "" });
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule Fund Release</DialogTitle>
          <DialogDescription>Create a pending fund transaction</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label>Project *</Label>
            <Select value={form.project_id} onValueChange={onProjectChange}>
              <SelectTrigger><SelectValue placeholder="Choose project" /></SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Amount (₹) *</Label>
            <Input type="number" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>From</Label>
              <Input value={form.from_entity} onChange={e => setForm(prev => ({ ...prev, from_entity: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>To</Label>
              <Input value={form.to_entity} onChange={e => setForm(prev => ({ ...prev, to_entity: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Remarks</Label>
            <Textarea rows={3} value={form.remarks} onChange={e => setForm(prev => ({ ...prev, remarks: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-500 to-green-600">{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleReleaseDialog