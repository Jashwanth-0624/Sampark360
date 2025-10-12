import React, { useState, useEffect } from 'react';
import { Map, Layers, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Project } from '@/entities/Project';
import { Skeleton } from "@/components/ui/skeleton";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';

export default function ProjectsMap() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const projectData = await Project.list();
        setProjects(projectData.filter(p => p.coordinates && p.coordinates.lat && p.coordinates.lng));
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Map className="w-8 h-8 text-orange-500" />
          Projects Map
        </h1>
        <Skeleton className="w-full h-[60vh] rounded-xl" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      "In Progress": "bg-blue-100 text-blue-800", "Completed": "bg-green-100 text-green-800",
      "Delayed": "bg-red-100 text-red-800", "Approval Pending": "bg-orange-100 text-orange-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Map className="w-8 h-8 text-orange-500" />
        Projects Map
      </h1>
      <Card className="flex-grow border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Interactive Geographical View</CardTitle>
          <CardDescription>Visualize project locations, progress, and fund distribution across the country.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {projects.map(project => (
              <Marker key={project.id} position={[project.coordinates.lat, project.coordinates.lng]}>
                <Popup>
                  <div className="w-64">
                    <h3 className="font-bold text-md mb-2">{project.title}</h3>
                    <Badge className={`${getStatusColor(project.current_status)} mb-2`}>{project.current_status}</Badge>
                    <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3"/> {project.district_name}, {project.state_name}</p>
                    <div className="mt-2 text-xs">
                        <span>Progress: {project.progress_percent}%</span>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${project.progress_percent}%` }}></div>
                        </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  );
}