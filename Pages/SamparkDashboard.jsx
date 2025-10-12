import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Map,
  FolderKanban,
  DollarSign,
  CheckSquare,
  Camera,
  MessageSquare,
  BarChart3,
  BookOpen,
  Settings,
  Search,
  Globe,
  Bell,
  TrendingUp,
  Users,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronDown,
  X
} from "lucide-react";
import { createPageUrl } from "@/utils";

const SamparkDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/sampark" },
    { id: "agency", label: "Agency Registry", icon: Building2, path: createPageUrl("AgencyRegistry") },
    { id: "projects-map", label: "Projects Map", icon: Map, path: createPageUrl("ProjectsMap") },
    { id: "projects-list", label: "Projects List", icon: FolderKanban, path: createPageUrl("ProjectsList") },
    { id: "fund-flow", label: "Fund Flow", icon: DollarSign, path: createPageUrl("FundFlow") },
    { id: "approvals", label: "Approvals", icon: CheckSquare, path: createPageUrl("Approvals") },
    { id: "task-board", label: "Task Board", icon: FolderKanban, path: createPageUrl("TaskBoard") },
    { id: "evidence", label: "Evidence Gallery", icon: Camera, path: createPageUrl("EvidenceGallery") },
    { id: "communications", label: "Communications", icon: MessageSquare, path: createPageUrl("Communications") },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3, path: createPageUrl("Reports") },
    { id: "help", label: "Help & Training", icon: BookOpen, path: createPageUrl("Help") },
  ];

  const notifications = [
    {
      id: 1,
      title: "New approval pending",
      message: "Project 'Adarsh Gram Phase 2' requires your approval",
      time: "5 min ago",
      type: "approval"
    },
    {
      id: 2,
      title: "Fund released",
      message: "₹10 Cr released for Girls Hostel Construction",
      time: "1 hour ago",
      type: "fund"
    },
    {
      id: 3,
      title: "Task assigned",
      message: "You have been assigned 'Review contractor bills'",
      time: "2 hours ago",
      type: "task"
    },
    {
      id: 4,
      title: "Photo evidence uploaded",
      message: "New evidence uploaded for Thane District project",
      time: "3 hours ago",
      type: "evidence"
    }
  ];

  const dashboardStats = [
    {
      title: "Total Projects",
      value: "8",
      subtitle: "5 active projects",
      trend: "+12%",
      trendUp: true,
      icon: FolderKanban,
      color: "blue"
    },
    {
      title: "Total Budget",
      value: "₹18,70,00,000",
      subtitle: "₹12,10,00,000 released",
      trend: "+8%",
      trendUp: true,
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Pending Approvals",
      value: "1",
      subtitle: "Awaiting action",
      trend: null,
      trendUp: null,
      icon: Clock,
      color: "orange"
    },
    {
      title: "Delayed Projects",
      value: "1",
      subtitle: "Requires attention",
      trend: null,
      trendUp: null,
      icon: AlertCircle,
      color: "red"
    }
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "ta", name: "தமிழ்" }
  ];

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-500",
      green: "text-green-500",
      orange: "text-orange-500",
      red: "text-red-500"
    };
    return colors[color] || "text-gray-500";
  };

  const getIconBgColor = (color) => {
    const colors = {
      blue: "bg-blue-100",
      green: "bg-green-100",
      orange: "bg-orange-100",
      red: "bg-red-100"
    };
    return colors[color] || "bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">SAMPARK 360</h2>
              <p className="text-xs text-gray-600 font-medium">PM-AJAY Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
              Navigation
            </h3>
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.id === "approvals" && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">1</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2 flex-1 max-w-xl">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects, agencies, or funds"
                  className="flex-1 border-0 bg-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Globe className="w-5 h-5 text-gray-600" />
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900">Language / भाषा / மொழி</h4>
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.name);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                          selectedLanguage === lang.name ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        {lang.name} {selectedLanguage === lang.name && '✓'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900">Notifications</h4>
                      <p className="text-sm text-gray-600">You have {notifications.length} unread notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                          <p className="font-semibold text-sm text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* System Status */}
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">systemOnline</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-green-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full transform -translate-x-24 translate-y-24"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome to SAMPARK 360
              </h1>
              <p className="text-white/90 text-lg mb-6">
                PM-AJAY Scheme Management Portal — Connecting Every Stakeholder
              </p>
                        <div className="flex flex-wrap gap-4">
                            <button 
                              onClick={() => navigate(createPageUrl("ProjectsList"))}
                              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                View All Projects
                                <ArrowRight className="w-4 h-4" />
                            </button>
                <div className="bg-white/20 border border-white/30 px-6 py-3 rounded-lg">
                  <input
                    type="text"
                    placeholder=""
                    className="bg-transparent text-white placeholder-white/70 focus:outline-none w-32"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getIconBgColor(stat.color)}`}>
                    <stat.icon className={`w-6 h-6 ${getIconColor(stat.color)}`} />
                  </div>
                  {stat.trend && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trend}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* PM-AJAY Components Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-500" />
              PM-AJAY Components Overview
            </h2>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p>Component overview data will be displayed here</p>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for dropdowns */}
      {(showNotifications || showLanguageMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowLanguageMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default SamparkDashboard;
