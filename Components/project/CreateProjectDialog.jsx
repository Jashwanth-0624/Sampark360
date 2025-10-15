import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog.jsx'
import { Button } from '@/Components/ui/button.jsx'
import { Input } from '@/Components/ui/input.jsx'
import { Textarea } from '@/Components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select.jsx'
import { Project, Agency } from '@/Entities/all'
import { PlusCircle, ChevronDown } from 'lucide-react'

export default function CreateProjectDialog({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    component: 'Adarsh Gram',
    state_name: '',
    district_name: '',
    budget_allocated: '',
    agency_id: '',
    agency_name: ''
  })
  const [agencies, setAgencies] = useState([])
  React.useEffect(() => {
    Agency.list().then(setAgencies).catch(() => setAgencies([]))
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) { alert('Please enter project title'); return }
    setSaving(true)
    try {
      await Project.create({
        title: form.title,
        component: form.component,
        state_name: form.state_name,
        district_name: form.district_name,
        budget_allocated: Number(form.budget_allocated || 0),
        agency_id: form.agency_id,
        agency_name: form.agency_name,
        current_status: 'Planning',
        created_date: new Date().toISOString(),
        progress_percent: 0
      })
      setOpen(false)
      setForm({ title: '', component: 'Adarsh Gram', state_name: '', district_name: '', budget_allocated: '', agency_id: '', agency_name: '' })
      if (onSuccess) onSuccess()
      alert('Project created')
    } catch (e) {
      console.error(e)
      alert('Failed to create project')
    }
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-green-600">
          <PlusCircle className="w-4 h-4 mr-2" /> Create New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Quickly add a new project</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Title *</label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">State</label>
              <Input value={form.state_name} onChange={e => setForm({ ...form, state_name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">District</label>
              <Input value={form.district_name} onChange={e => setForm({ ...form, district_name: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm">Component</label>
            <Input value={form.component} onChange={e => setForm({ ...form, component: e.target.value })} />
          </div>
          <div>
            <label className="text-sm">Agency</label>
            <Select
              value={form.agency_id}
              onValueChange={(v) => {
                const a = agencies.find(x => x.id === v)
                setForm({ ...form, agency_id: v, agency_name: a?.name || '' })
              }}
            >
              <SelectTrigger>
                <button type="button" className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                  <SelectValue placeholder="Select agency" />
                  <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                </button>
              </SelectTrigger>
              <SelectContent>
                {agencies.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm">Budget (₹)</label>
            <Input type="number" value={form.budget_allocated} onChange={e => setForm({ ...form, budget_allocated: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-orange-500 to-green-600">{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}