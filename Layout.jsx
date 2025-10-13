import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard, Building2, FolderKanban, DollarSign, CheckSquare,
  Camera, MessageSquare, BarChart3, Settings, BookOpen, Users,
  Map, Menu, Bell, Search, Globe, LogOut, User as UserIcon, Shield, X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User, Approval, Project } from "@/entities";
import { LanguageProvider, useLanguage } from "@/components/LanguageContext";
import "leaflet/dist/leaflet.css";

const navigationItems = [
  { title: "dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard, roles: ["admin", "user"] },
  { title: "agencyRegistry", url: createPageUrl("AgencyRegistry"), icon: Building2, roles: ["admin", "user"] },
  { title: "projectsMap", url: createPageUrl("ProjectsMap"), icon: Map, roles: ["admin", "user"] },
  { title: "projectsList", url: createPageUrl("ProjectsList"), icon: FolderKanban, roles: ["admin", "user"] },
  { title: "fundFlow", url: createPageUrl("FundFlow"), icon: DollarSign, roles: ["admin", "user"] },
  { title: "approvals", url: createPageUrl("Approvals"), icon: CheckSquare, roles: ["admin", "user"] },
  { title: "taskBoard", url: createPageUrl("TaskBoard"), icon: FolderKanban, roles: ["admin", "user"] },
  { title: "evidenceGallery", url: createPageUrl("EvidenceGallery"), icon: Camera, roles: ["admin", "user"] },
  { title: "communications", url: createPageUrl("Communications"), icon: MessageSquare, roles: ["admin", "user"] },
  { title: "reports", url: createPageUrl("Reports"), icon: BarChart3, roles: ["admin", "user"] },
  { title: "help", url: createPageUrl("Help"), icon: BookOpen, roles: ["admin", "user"] },
  { title: "adminConsole", url: createPageUrl("AdminConsole"), icon: Settings, roles: ["admin"] }
];

const sampleNotifications = [
  { id: 1, title: "New approval pending", message: "Project 'Adarsh Gram Phase 2' requires your approval", time: "5 min ago", type: "approval" },
  { id: 2, title: "Fund released", message: "₹10Cr released for Girls Hostel Construction", time: "1 hour ago", type: "fund" },
  { id: 3, title: "Task assigned", message: "You have been assigned 'Review contractor bills'", time: "2 hours ago", type: "task" },
  { id: 4, title: "Photo evidence uploaded", message: "New evidence uploaded for Thane District project", time: "3 hours ago", type: "evidence" }
];

function ProfileSettingsDialog({ open, onOpenChange, user }) {
  const { t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("profileSettings")}</SheetTitle>
          <SheetDescription>
            {t("manageYourProfileInfo")}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-xl">
                {user?.full_name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{user?.full_name || t("user")}</p>
              <p className="text-sm text-gray-600">{user?.email || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">{t("role")}</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
                {user?.role === 'admin' ? t("admin") : t("user")}
              </Badge>
            </div>
            {user?.agency_name && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">{t("agency")}</span>
                <span className="text-gray-900 text-right">{user.agency_name}</span>
              </div>
            )}
            {user?.state_name && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">{t("state")}</span>
                <span className="text-gray-900">{user.state_name}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("close")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function LayoutContent({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchBoxRef = React.useRef(null);
  const { language, changeLanguage, t } = useLanguage();

  useEffect(() => {
    loadUser();
    loadPendingApprovals();
  }, []);

  // Debounced global search across pages and projects
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setSearchResults([]); return; }
    const handle = setTimeout(async () => {
      const pageHits = visibleNavItems
        .map(it => ({
          id: `page-${it.title}`,
          type: 'page',
          title: t(it.title),
          subtitle: 'Open page',
          url: it.url,
          icon: it.icon
        }))
        .filter(x => x.title.toLowerCase().includes(q));

      let projectHits = [];
      try {
        const list = await Project.list();
        projectHits = list
          .map(p => ({
            id: p.id,
            type: 'project',
            title: p.title,
            subtitle: [p.district_name, p.state_name].filter(Boolean).join(', '),
            url: createPageUrl('ProjectsList')
          }))
          .filter(x => x.title.toLowerCase().includes(q) || x.subtitle.toLowerCase().includes(q))
          .slice(0, 5);
      } catch {}

      setSearchResults([...pageHits.slice(0,5), ...projectHits]);
    }, 200);
    return () => clearTimeout(handle);
  }, [searchQuery, user]);

  // Close search dropdown on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(e.target)) setShowSearchResults(false);
    };
    if (showSearchResults) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [showSearchResults]);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("User not authenticated");
    }
  };

  const loadPendingApprovals = async () => {
    try {
      const approvals = await Approval.filter({ status: "Pending" });
      setPendingApprovals(approvals.length);
    } catch (error) {
      console.error("Failed to load approvals");
    }
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.href = createPageUrl("Login");
  };

  const handleLanguageChange = async (lang, langName) => {
    await changeLanguage(lang, langName);
  };

  // Compute visible nav based on role (available immediately for effects)
  const visibleNavItems = (user && user.role === "admin")
    ? navigationItems
    : navigationItems.filter(item => item.roles.includes("user"));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50/30 via-white to-green-50/30" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <style>{`
          :root {
            --primary: 34 197 94;
            --primary-foreground: 255 255 255;
            --accent: 249 115 22;
            --accent-foreground: 255 255 255;
            --muted: 243 244 246;
          }
        `}</style>

        <Sidebar className="border-r border-gray-200 bg-white shadow-sm w-64">
          <SidebarHeader className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">SAMPARK 360</h2>
                <p className="text-xs text-gray-600 font-medium">PM-AJAY Portal</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                {t("navigation")}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleNavItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`mb-1 transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-md hover:shadow-lg'
                              : 'hover:bg-orange-50 hover:ring-1 hover:ring-orange-200 text-gray-700'
                          }`}
                        >
                          <Link to={item.url} className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500 hover:bg-orange-50">
                            <item.icon className="w-5 h-5 text-gray-500 group-hover:text-orange-600" />
                            <span className="font-medium text-sm text-gray-800 group-hover:text-orange-800">{t(item.title)}</span>
                            {item.title === "approvals" && pendingApprovals > 0 && (
                              <Badge variant="destructive" className="ml-auto">{pendingApprovals}</Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {user && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  {t("quickInfo")}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-4 py-3 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t("role")}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </div>
                    {user.agency_name && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t("agency")}</span>
                        <span className="font-medium text-gray-900 text-xs text-right">
                          {user.agency_name}
                        </span>
                      </div>
                    )}
                    {user.state_name && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t("state")}</span>
                        <span className="font-medium text-gray-900 text-xs">
                          {user.state_name}
                        </span>
                      </div>
                    )}
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 w-full hover:bg-gray-100 p-3 rounded-xl transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {user.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
<DropdownMenuContent align="end" side="bottom" className="w-56">
                  <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                    <UserIcon className="w-4 h-4 mr-2" />
                    {t("profileSettings")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="text-center text-sm text-gray-500">Loading...</div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <SidebarTrigger className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors" />
                <div ref={searchBoxRef} className="hidden md:flex items-center gap-2 flex-1 max-w-xl relative">
                  <Search className="w-5 h-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onFocus={() => setShowSearchResults(true)}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                    onKeyDown={(e) => { if (e.key === 'Escape') setShowSearchResults(false); }}
                    className="border-0 bg-gray-100/80 focus-visible:ring-orange-500"
                  />
                  {showSearchResults && searchQuery.trim().length >= 2 && searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[1000] overflow-hidden">
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map(item => (
                          <Link
                            key={item.id}
                            to={item.url}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 focus:bg-orange-50 transition-colors"
                            onClick={() => setShowSearchResults(false)}
                          >
                            {item.icon ? (<item.icon className="w-4 h-4 text-gray-500" />) : (<span className="w-4 h-4" />)}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                              {item.subtitle && <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>}
                            </div>
                            <span className="ml-auto text-xs text-gray-400">{item.type}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Globe className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("language")} / भाषा / மொழி</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleLanguageChange("en", "English")}>
                      English {language === "en" && "✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("hi", "Hindi")}>
                      हिंदी {language === "hi" && "✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("ta", "Regional")}>
                      தமிழ் {language === "ta" && "✓"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      {sampleNotifications.length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{t("notifications")}</SheetTitle>
                      <SheetDescription>
                        You have {sampleNotifications.length} unread notifications
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {sampleNotifications.length > 0 ? (
                        sampleNotifications.map(notif => (
                          <div key={notif.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <p className="font-semibold text-sm text-gray-900">{notif.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                          <p>{t("noNewNotifications")}</p>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="hidden sm:block">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                    {t("systemOnline")}
                  </Badge>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>

        {/* Profile Settings Dialog */}
        <ProfileSettingsDialog open={profileOpen} onOpenChange={setProfileOpen} user={user} />
      </div>
    </SidebarProvider>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </LanguageProvider>
  );
}
