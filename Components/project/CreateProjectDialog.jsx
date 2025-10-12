import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Project } from '@/entities/all'
import { PlusCircle } from 'lucide-react'

export default function CreateProjectDialog({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    component: 'Adarsh Gram',
    state_name: '',
    district_name: '',
    budget_allocated: ''
  })

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
        current_status: 'Planning',
        created_date: new Date().toISOString(),
        progress_percent: 0
      })
      setOpen(false)
      setForm({ title: '', component: 'Adarsh Gram', state_name: '', district_name: '', budget_allocated: '' })
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Quickly add a new project</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Title *</label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
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