import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Building2, Briefcase, MapPin, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from '@/entities/User';
import { useLanguage } from './LanguageContext';

export default function ProfileSettingsDialog({ open, onOpenChange }) {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    agency_name: '',
    state_name: '',
    district_name: '',
    preferred_language: 'English'
  });

  useEffect(() => {
    if (open) {
      loadUserData();
    }
  }, [open]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        department: currentUser.department || '',
        designation: currentUser.designation || '',
        agency_name: currentUser.agency_name || '',
        state_name: currentUser.state_name || '',
        district_name: currentUser.district_name || '',
        preferred_language: currentUser.preferred_language || 'English'
      });
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await User.updateMyUserData({
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        agency_name: formData.agency_name,
        state_name: formData.state_name,
        district_name: formData.district_name,
        preferred_language: formData.preferred_language
      });
      alert(t.profileUpdated || 'Profile updated successfully!');
      onOpenChange(false);
      window.location.reload(); // Reload to apply language changes
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(t.updateFailed || 'Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            {t.profileSettings || 'Profile Settings'}
          </DialogTitle>
          <DialogDescription>
            {t.updateYourProfile || 'Update your personal information and preferences'}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-gray-500">{t.loading || 'Loading...'}</div>
        ) : (
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="w-20 h-20 bg-gradient-to-br from-orange-400 to-green-500">
                <AvatarFallback className="text-white text-2xl font-bold">
                  {formData.full_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{formData.full_name}</h3>
                <p className="text-sm text-gray-500">{formData.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {t.role || 'Role'}: <span className="font-medium">{user?.role === 'admin' ? 'Administrator' : 'User'}</span>
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                {t.personalInformation || 'Personal Information'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t.fullName || 'Full Name'}</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">{t.nameCannotBeChanged || 'Name cannot be changed'}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t.email || 'Email'}</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500">{t.emailCannotBeChanged || 'Email cannot be changed'}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phoneNumber || 'Phone Number'}</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_language">{t.preferredLanguage || 'Preferred Language'}</Label>
                  <Select
                    value={formData.preferred_language}
                    onValueChange={(value) => setFormData({...formData, preferred_language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="Regional">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t.workInformation || 'Work Information'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">{t.department || 'Department'}</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder={t.enterDepartment || "e.g., Ministry of Tribal Affairs"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">{t.designation || 'Designation'}</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    placeholder={t.enterDesignation || "e.g., Project Officer"}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="agency_name">{t.agency || 'Agency'}</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <Input
                      id="agency_name"
                      value={formData.agency_name}
                      onChange={(e) => setFormData({...formData, agency_name: e.target.value})}
                      placeholder={t.enterAgency || "e.g., State Tribal Welfare Department"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t.locationInformation || 'Location Information'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state_name">{t.state || 'State/UT'}</Label>
                  <Input
                    id="state_name"
                    value={formData.state_name}
                    onChange={(e) => setFormData({...formData, state_name: e.target.value})}
                    placeholder={t.enterState || "e.g., Maharashtra"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district_name">{t.district || 'District'}</Label>
                  <Input
                    id="district_name"
                    value={formData.district_name}
                    onChange={(e) => setFormData({...formData, district_name: e.target.value})}
                    placeholder={t.enterDistrict || "e.g., Mumbai"}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            <X className="w-4 h-4 mr-2" />
            {t.cancel || 'Cancel'}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-gradient-to-r from-orange-500 to-green-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? t.saving || 'Saving...' : t.saveChanges || 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}