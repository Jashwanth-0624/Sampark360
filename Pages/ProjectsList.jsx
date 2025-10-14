import React, { useState, useEffect } from 'react';
import { FolderKanban, Filter, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Project, State } from '@/Entities/all';
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CreateProjectDialog from '../Components/project/CreateProjectDialog';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    component: "all",
    status: "all",
    state: "all",
    priority: "all"
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [projectData, stateData] = await Promise.all([
        Project.list("-created_date"),
        State.list()
      ]);
      setProjects(projectData);
      setStates(stateData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      "In Progress": "!bg-blue-100 !text-blue-800",
      "Completed": "!bg-green-100 !text-green-800",
      "Delayed": "!bg-red-100 !text-red-800",
      "Approval Pending": "!bg-orange-100 !text-orange-800",
      "Planning": "!bg-purple-100 !text-purple-800",
      "On Hold": "!bg-yellow-100 !text-yellow-800"
    };
    return colors[status] || "!bg-gray-100 !text-gray-800";
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.state_name && p.state_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.district_name && p.district_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.id && String(p.id).toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesComponent = filters.component === "all" || p.component === filters.component;
    const matchesStatus = filters.status === "all" || p.current_status === filters.status;
    const matchesState = filters.state === "all" || p.state_id === filters.state;
    const matchesPriority = filters.priority === "all" || p.priority === filters.priority;

    return matchesSearch && matchesComponent && matchesStatus && matchesState && matchesPriority;
  });

  const hasActiveFilters = filters.component !== "all" || filters.status !== "all" || filters.state !== "all" || filters.priority !== "all";

  const clearFilters = () => {
    setFilters({ component: "all", status: "all", state: "all", priority: "all" });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FolderKanban className="w-8 h-8 text-orange-500" />
          Projects List
        </h1>
        <CreateProjectDialog onSuccess={fetchData} />
      </div>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All PM-AJAY Projects</CardTitle>
          <CardDescription>A comprehensive list of all projects with advanced filtering and search.</CardDescription>
          <div className="pt-4 flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search by project title, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" /> 
                  Filters
                  {hasActiveFilters && <Badge variant="secondary" className="ml-1">{Object.values(filters).filter(v => v !== "all").length}</Badge>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Filters</h4>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="w-4 h-4 mr-1" /> Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Component</label>
                    <Select value={filters.component} onValueChange={v => setFilters({...filters, component: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Components</SelectItem>
                        <SelectItem value="Adarsh Gram">Adarsh Gram</SelectItem>
                        <SelectItem value="GIA">GIA</SelectItem>
                        <SelectItem value="Hostel">Hostel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={filters.status} onValueChange={v => setFilters({...filters, status: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Approval Pending">Approval Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Select value={filters.state} onValueChange={v => setFilters({...filters, state: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {states.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={filters.priority} onValueChange={v => setFilters({...filters, priority: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                      No projects found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map(project => (
                    <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell><Badge variant="outline">{project.component}</Badge></TableCell>
                      <TableCell>{project.agency_name || '—'}</TableCell>
                      <TableCell>{project.district_name}, {project.state_name}</TableCell>
                      <TableCell><Badge className={getStatusColor(project.current_status)}>{project.current_status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress_percent || 0} className="w-20" />
                          <span className="text-sm text-gray-600">{project.progress_percent || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {project.budget_allocated ? `₹${project.budget_allocated.toLocaleString('en-IN')}` : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}