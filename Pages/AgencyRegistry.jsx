import React, { useState, useEffect } from 'react';
import { Building2, Upload, Download, MapPin, Phone, Mail, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Agency } from '@/entities/Agency';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddAgencyDialog from '../components/agency/AddAgencyDialog';
import { ExtractDataFromUploadedFile, UploadFile } from '@/integrations/Core';
import { useLanguage } from '../components/LanguageContext';

export default function AgencyRegistry() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    setLoading(true);
    try {
      const data = await Agency.list("-created_date");
      setAgencies(data);
    } catch (error) {
      console.error("Failed to load agencies:", error);
    }
    setLoading(false);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const data = await Agency.list();
      if (data.length === 0) {
        alert(t.noDataToExport || "No data to export");
        setExporting(false);
        return;
      }
      
      const headers = ['Name', 'Type', 'State', 'District', 'Head Name', 'Contact', 'Email', 'Status'];
      const csvRows = [headers.join(',')];
      
      for (const agency of data) {
        const values = [
          `"${agency.name}"`,
          `"${agency.type}"`,
          `"${agency.state_name || ''}"`,
          `"${agency.district_name || ''}"`,
          `"${agency.head_name || ''}"`,
          `"${agency.head_contact || ''}"`,
          `"${agency.head_email || ''}"`,
          `"${agency.status}"`
        ];
        csvRows.push(values.join(','));
      }
      
      const csvData = csvRows.join('\n');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agencies_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert(t.exportSuccess || "Export successful!");
    } catch (error) {
      console.error("Failed to export:", error);
      alert(t.exportFailed || "Export failed");
    }
    setExporting(false);
  };

  const handleImportCSV = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    try {
      const { file_url } = await UploadFile({ file });
      
      const schema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            type: { type: "string" },
            state_name: { type: "string" },
            district_name: { type: "string" },
            head_name: { type: "string" },
            head_contact: { type: "string" },
            head_email: { type: "string" },
            status: { type: "string" }
          }
        }
      };
      
      const result = await ExtractDataFromUploadedFile({ file_url, json_schema: schema });
      
      if (result.status === "success" && result.output) {
        for (const row of result.output) {
          await Agency.create({
            name: row.name,
            type: row.type || "Implementing",
            state_name: row.state_name,
            district_name: row.district_name,
            head_name: row.head_name,
            head_contact: row.head_contact,
            head_email: row.head_email,
            address: "",
            status: row.status || "Active"
          });
        }
        alert(t.importSuccess || `Successfully imported ${result.output.length} agencies!`);
        loadAgencies();
      } else {
        alert(t.importFailed || "Import failed: " + (result.details || "Unknown error"));
      }
    } catch (error) {
      console.error("Import error:", error);
      alert(t.importFailed || "Import failed");
    }
    setImporting(false);
    event.target.value = '';
  };

  const filteredAgencies = agencies.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.state_name && a.state_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-orange-500" />
          {t.agencyRegistry || "Agency Registry"}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} disabled={exporting}>
            <Download className="w-4 h-4 mr-2" /> {exporting ? t.exporting : t.exportCSV || "Export CSV"}
          </Button>
          <label htmlFor="import-csv">
            <Button variant="outline" disabled={importing} asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" /> {importing ? t.importing : t.importCSV || "Import CSV"}
              </span>
            </Button>
            <input
              id="import-csv"
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          <AddAgencyDialog onSuccess={loadAgencies} />
        </div>
      </div>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t.agencyDirectory || "Agency Directory"}</CardTitle>
          <CardDescription>{t.agencyDirectoryDesc || "Search, filter, and manage all implementing and executing agencies."}</CardDescription>
          <div className="pt-4">
            <Input 
              placeholder={t.searchAgencies || "Search by agency name, state, or type..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : filteredAgencies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="font-semibold">{t.noAgenciesFound || "No agencies found"}</p>
              <p className="text-sm">{t.addNewAgency || "Add a new agency to get started"}</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.agencyName || "Agency Name"}</TableHead>
                    <TableHead>{t.type || "Type"}</TableHead>
                    <TableHead>{t.location || "Location"}</TableHead>
                    <TableHead>{t.contact || "Contact"}</TableHead>
                    <TableHead>{t.status || "Status"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgencies.map(agency => (
                    <TableRow key={agency.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{agency.name}</p>
                          <p className="text-xs text-gray-500">{agency.head_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={agency.type === "Implementing" ? "default" : "secondary"}>
                          {agency.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3" />
                          {agency.district_name ? `${agency.district_name}, ` : ""}{agency.state_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{agency.head_contact}</div>
                          <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{agency.head_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={agency.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {agency.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}