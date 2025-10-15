import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Agency, State, District } from "@/Entities/all";
import { Plus, ChevronDown } from "lucide-react";

export default function AddAgencyDialog({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "Implementing",
    state_id: "",
    state_name: "",
    district_id: "",
    district_name: "",
    address: "",
    head_name: "",
    head_contact: "",
    head_email: "",
    roles_description: "",
    sla_terms: "",
    status: "Active"
  });

  React.useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    const stateList = await State.list();
    setStates(stateList);
  };

  const handleStateChange = async (stateId) => {
    const selectedState = states.find(s => s.id === stateId);
    setFormData({ ...formData, state_id: stateId, state_name: selectedState?.name || "", district_id: "", district_name: "" });
    const districtList = await District.filter({ state_id: stateId });
    setDistricts(districtList);
  };

  const handleDistrictChange = (districtId) => {
    const selectedDistrict = districts.find(d => d.id === districtId);
    setFormData({ ...formData, district_id: districtId, district_name: selectedDistrict?.name || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Agency.create(formData);
      setOpen(false);
      setFormData({
        name: "", type: "Implementing", state_id: "", state_name: "", district_id: "", district_name: "",
        address: "", head_name: "", head_contact: "", head_email: "", roles_description: "", sla_terms: "", status: "Active"
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to create agency:", error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-green-600">
          <Plus className="w-4 h-4 mr-2" /> Add New Agency
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Agency</DialogTitle>
          <DialogDescription>Register a new implementing or executing agency</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Agency Name *</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Agency Type *</Label>
              <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                <SelectTrigger>
                  <button type="button" className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                    <SelectValue placeholder="Select type" />
                    <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                  </button>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Implementing">Implementing</SelectItem>
                  <SelectItem value="Executing">Executing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>State *</Label>
              <Select value={formData.state_id} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <button type="button" className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                    <SelectValue placeholder="Select state" />
                    <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                  </button>
                </SelectTrigger>
                <SelectContent>
                  {states.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>District</Label>
              <Select value={formData.district_id} onValueChange={handleDistrictChange}>
                <SelectTrigger>
                  <button type="button" disabled={!formData.state_id} className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Select district" />
                    <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                  </button>
                </SelectTrigger>
                <SelectContent>
                  {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address *</Label>
            <Textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Head Name *</Label>
              <Input value={formData.head_name} onChange={e => setFormData({...formData, head_name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Contact *</Label>
              <Input value={formData.head_contact} onChange={e => setFormData({...formData, head_contact: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={formData.head_email} onChange={e => setFormData({...formData, head_email: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Roles & Responsibilities</Label>
            <Textarea value={formData.roles_description} onChange={e => setFormData({...formData, roles_description: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>SLA Terms</Label>
            <Textarea value={formData.sla_terms} onChange={e => setFormData({...formData, sla_terms: e.target.value})} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-500 to-green-600">
              {loading ? "Creating..." : "Create Agency"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}