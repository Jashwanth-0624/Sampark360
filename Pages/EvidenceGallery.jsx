import React, { useState, useEffect } from 'react';
import { Camera, UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PhotoEvidence } from '@/entities/PhotoEvidence';
import { Project } from '@/entities/Project';
import { User } from '@/entities/User';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadFile } from '@/integrations/Core';
import { useLanguage } from '../components/LanguageContext';

export default function EvidenceGallery() {
  const [evidence, setEvidence] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    project_id: '',
    project_title: '',
    image_file: null,
    caption: '',
    geo_lat: 0,
    geo_lng: 0,
    milestone_reference: ''
  });

  useEffect(() => {
    fetchData();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to load user");
    }
  };

  async function fetchData() {
    setLoading(true);
    try {
      const [evidenceData, projectData] = await Promise.all([
        PhotoEvidence.list("-timestamp"),
        Project.list()
      ]);
      setEvidence(evidenceData);
      setProjects(projectData);
    } catch(e){ 
      console.error("Failed to fetch data:", e); 
    } finally { 
      setLoading(false); 
    }
  }

  const handleProjectChange = (projectId) => {
    const selectedProject = projects.find(p => p.id === projectId);
    setFormData({
      ...formData,
      project_id: projectId,
      project_title: selectedProject?.title || ''
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image_file: file });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            geo_lat: position.coords.latitude,
            geo_lng: position.coords.longitude
          });
          alert(t.locationCaptured || "Location captured successfully!");
        },
        (error) => {
          alert(t.locationError || "Unable to get location. Please enter manually.");
        }
      );
    } else {
      alert(t.geolocationNotSupported || "Geolocation is not supported by your browser");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.image_file || !formData.project_id) {
      alert(t.fillRequiredFields || "Please fill all required fields");
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file: formData.image_file });
      
      await PhotoEvidence.create({
        project_id: formData.project_id,
        project_title: formData.project_title,
        uploaded_by: user?.id || 'unknown',
        uploaded_by_name: user?.full_name || 'Unknown User',
        image_url: file_url,
        thumbnail_url: file_url,
        geo_lat: formData.geo_lat,
        geo_lng: formData.geo_lng,
        timestamp: new Date().toISOString(),
        caption: formData.caption,
        milestone_reference: formData.milestone_reference,
        verification_status: 'Pending'
      });

      alert(t.uploadSuccess || "Evidence uploaded successfully!");
      setUploadOpen(false);
      setFormData({
        project_id: '',
        project_title: '',
        image_file: null,
        caption: '',
        geo_lat: 0,
        geo_lng: 0,
        milestone_reference: ''
      });
      fetchData();
    } catch (error) {
      console.error("Upload failed:", error);
      alert(t.uploadFailed || "Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80"><CheckCircle className="w-3 h-3 mr-1"/>{t.verified || "Verified"}</Badge>;
      case 'Flagged': return <Badge variant="destructive" className="hover:bg-red-500/80"><AlertTriangle className="w-3 h-3 mr-1"/>{t.flagged || "Flagged"}</Badge>;
      default: return <Badge variant="secondary" className="hover:bg-gray-100/80">{t.pending || "Pending"}</Badge>;
    }
  };

  const filterByStatus = (status) => {
    if (status === 'all') return evidence;
    return evidence.filter(e => e.verification_status === status);
  };

  const PhotoGrid = ({ items }) => (
    loading ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-xl" />
        ))}
      </div>
    ) : items.length === 0 ? (
      <div className="text-center py-12 text-gray-500">
        <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="font-semibold">{t.noPhotos || "No photos in this category"}</p>
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map(item => (
          <HoverCard key={item.id}>
            <HoverCardTrigger asChild>
              <div className="relative group overflow-hidden rounded-xl border cursor-pointer hover:shadow-md transition-shadow">
                <img src={item.image_url} alt={item.caption} className="aspect-square object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                  <p className="text-white text-xs font-semibold truncate">{item.project_title}</p>
                </div>
                <div className="absolute top-2 right-2">{getStatusBadge(item.verification_status)}</div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="font-bold">{item.caption}</p>
              <p className="text-sm text-gray-500 mt-1">{item.project_title}</p>
              <hr className="my-2" />
              <p className="text-xs">{t.uploaded || "Uploaded"}: {format(new Date(item.timestamp), "dd MMM yyyy, p")}</p>
              <p className="text-xs">{t.location || "Location"}: {item.geo_lat.toFixed(4)}, {item.geo_lng.toFixed(4)}</p>
              <p className="text-xs">{t.by || "By"}: {item.uploaded_by_name}</p>
              {item.verification_status === 'Flagged' && <p className="text-xs text-red-600 mt-1">{t.reason || "Reason"}: {item.flagged_reason}</p>}
              {item.verification_status === 'Verified' && <p className="text-xs text-green-600 mt-1">{t.verifiedBy || "Verified by"}: {item.verified_by_name}</p>}
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    )
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Camera className="w-8 h-8 text-orange-500" />
          {t.evidenceGallery || "Evidence Gallery"}
        </h1>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-green-600">
              <UploadCloud className="w-4 h-4 mr-2" /> {t.uploadEvidence || "Upload Evidence"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.uploadPhotoEvidence || "Upload Photo Evidence"}</DialogTitle>
              <DialogDescription>{t.uploadPhotoDesc || "Upload geo-tagged photos with project details"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label>{t.selectProject || "Select Project"} *</Label>
                <Select value={formData.project_id} onValueChange={handleProjectChange}>
                  <SelectTrigger><SelectValue placeholder={t.chooseProject || "Choose a project"} /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.uploadPhoto || "Upload Photo"} *</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} required />
              </div>
              <div className="space-y-2">
                <Label>{t.caption || "Caption"}</Label>
                <Textarea 
                  value={formData.caption} 
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  placeholder={t.describePhoto || "Describe what's in the photo..."}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.milestoneReference || "Milestone Reference"}</Label>
                <Input 
                  value={formData.milestone_reference} 
                  onChange={(e) => setFormData({...formData, milestone_reference: e.target.value})}
                  placeholder={t.milestoneExample || "e.g., Foundation Phase, Roofing Complete"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.latitude || "Latitude"} *</Label>
                  <Input 
                    type="number" 
                    step="any"
                    value={formData.geo_lat} 
                    onChange={(e) => setFormData({...formData, geo_lat: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.longitude || "Longitude"} *</Label>
                  <Input 
                    type="number" 
                    step="any"
                    value={formData.geo_lng} 
                    onChange={(e) => setFormData({...formData, geo_lng: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <Button type="button" variant="outline" onClick={getCurrentLocation} className="w-full">
                {t.useCurrentLocation || "Use Current Location"}
              </Button>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setUploadOpen(false)} disabled={uploading}>
                  {t.cancel || "Cancel"}
                </Button>
                <Button type="submit" disabled={uploading} className="bg-gradient-to-r from-orange-500 to-green-600">
                  {uploading ? t.uploading : t.upload || "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t.geoTaggedPhotos || "Geo-tagged Photo Evidence"}</CardTitle>
          <CardDescription>{t.browseVerifyEvidence || "Browse and verify all visual evidence submitted from the field"}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="all">{t.all || "All"} ({evidence.length})</TabsTrigger>
              <TabsTrigger value="Pending">{t.pending || "Pending"} ({filterByStatus('Pending').length})</TabsTrigger>
              <TabsTrigger value="Verified">{t.verified || "Verified"} ({filterByStatus('Verified').length})</TabsTrigger>
              <TabsTrigger value="Flagged">{t.flagged || "Flagged"} ({filterByStatus('Flagged').length})</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="all">
                <PhotoGrid items={evidence} />
              </TabsContent>
              <TabsContent value="Pending">
                <PhotoGrid items={filterByStatus('Pending')} />
              </TabsContent>
              <TabsContent value="Verified">
                <PhotoGrid items={filterByStatus('Verified')} />
              </TabsContent>
              <TabsContent value="Flagged">
                <PhotoGrid items={filterByStatus('Flagged')} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}