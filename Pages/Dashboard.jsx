import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Project, FundTransaction, Task, Approval, State, Agency } from "@/entities/all";
import {
  TrendingUp, TrendingDown, Activity, IndianRupee, FolderKanban,
  AlertCircle, CheckCircle, Clock, Users, MapPin, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    delayedProjects: 0,
    totalBudget: 0,
    fundsReleased: 0,
    pendingApprovals: 0,
    pendingTasks: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const projects = await Project.list("-created_date", 100);
      const transactions = await FundTransaction.list("-created_date", 100);
      const tasks = await Task.filter({ status: "To Do" });
      const approvals = await Approval.filter({ status: "Pending" });

      const activeProjects = projects.filter(p => p.current_status === "In Progress");
      const completedProjects = projects.filter(p => p.current_status === "Completed");
      const delayedProjects = projects.filter(p => p.current_status === "Delayed");

      const totalBudget = projects.reduce((sum, p) => sum + (p.budget_allocated || 0), 0);
      const fundsReleased = transactions
        .filter(t => t.status === "Released")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        totalProjects: projects.length,
        activeProjects: activeProjects.length,
        completedProjects: completedProjects.length,
        delayedProjects: delayedProjects.length,
        totalBudget,
        fundsReleased,
        pendingApprovals: approvals.length,
        pendingTasks: tasks.length
      });

      setRecentProjects(projects.slice(0, 6));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      "In Progress": "!bg-blue-100 !text-blue-800",
      "Completed": "!bg-green-100 !text-green-800",
      "Delayed": "!bg-red-100 !text-red-800",
      "Planning": "!bg-gray-100 !text-gray-800",
      "On Hold": "!bg-yellow-100 !text-yellow-800",
      "Approval Pending": "!bg-orange-100 !text-orange-800"
    };
    return colors[status] || "!bg-gray-100 !text-gray-800";
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "bg-blue-500" }) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full transform translate-x-16 -translate-y-16`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-3 ${color} bg-opacity-20 rounded-xl`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-orange-50/50 via-white to-green-50/50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-green-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full transform -translate-x-24 translate-y-24" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to SAMPARK 360
          </h1>
          <p className="text-white/90 text-lg mb-6">
            PM-AJAY Scheme Management Portal — Connecting Every Stakeholder
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to={createPageUrl("ProjectsList")}>
              <Button size="lg" variant="secondary" className="!bg-white !text-gray-900 hover:!bg-gray-100">
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("AdminConsole")}>
              <Button size="lg" variant="outline" className="!bg-transparent !border-white !text-white hover:!bg-white/20">
                Admin Console
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          subtitle={`${stats.activeProjects} active projects`}
          icon={FolderKanban}
          color="bg-blue-500"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Total Budget"
          value={formatCurrency(stats.totalBudget)}
          subtitle={`${formatCurrency(stats.fundsReleased)} released`}
  icon={IndianRupee}
          color="bg-green-500"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          subtitle="Awaiting action"
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="Delayed Projects"
          value={stats.delayedProjects}
          subtitle="Requires attention"
          icon={AlertCircle}
          color="bg-red-500"
        />
      </div>

      {/* Component Distribution */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            PM-AJAY Components Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Adarsh Gram", "GIA", "Hostel"].map(component => {
              const componentProjects = recentProjects.filter(p => p.component === component);
              const completedCount = componentProjects.filter(p => p.current_status === "Completed").length;
              return (
                <div key={component} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-2">{component}</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {componentProjects.length}
                  </div>
                  <p className="text-sm text-gray-600">
                    {completedCount} completed
                  </p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${componentProjects.length ? (completedCount / componentProjects.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-green-500" />
            Recent Projects
          </CardTitle>
          <Link to={createPageUrl("ProjectsList")}>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects yet. Start by creating one!</p>
              <Link to={createPageUrl("AdminConsole")}>
                <Button className="mt-4 bg-gradient-to-r from-orange-500 to-green-600">
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map(project => (
                <div
                  key={project.id}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={getStatusColor(project.current_status)}>
                      {project.current_status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {project.component}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{project.district_name}, {project.state_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span className="font-semibold text-gray-900">
                      {project.progress_percent || 0}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-green-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${project.progress_percent || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500/10 to-green-500/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to={createPageUrl("AgencyRegistry")}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span className="text-xs">Agencies</span>
              </Button>
            </Link>
            <Link to={createPageUrl("FundFlow")}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <IndianRupee className="w-6 h-6" />
                <span className="text-xs">Fund Flow</span>
              </Button>
            </Link>
            <Link to={createPageUrl("Approvals")}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <CheckCircle className="w-6 h-6" />
                <span className="text-xs">Approvals</span>
              </Button>
            </Link>
            <Link to={createPageUrl("TaskBoard")}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Activity className="w-6 h-6" />
                <span className="text-xs">Tasks</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
