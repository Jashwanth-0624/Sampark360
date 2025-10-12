
import React, { useState, useEffect } from 'react';
import { BarChart3, Bot, FileDown, PieChart as PieIcon, TrendingUp, DollarSign, Activity, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Project, FundTransaction } from '@/entities/all';
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '../components/LanguageContext'; // Assuming this path is correct

const COLORS = ['#10B981', '#3B82F6', '#F97316', '#EF4444', '#6B7280', '#8B5CF6'];

export default function Reports() {
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { t } = useLanguage(); // Initialize useLanguage hook

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [projectData, txData] = await Promise.all([
        Project.list(),
        FundTransaction.list()
      ]);
      setProjects(projectData);
      setTransactions(txData);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleExportDashboard = async () => {
    setExporting(true);
    try {
      const dashboardData = {
        summary: {
          totalProjects: projects.length,
          totalBudget: totalBudget,
          totalReleased: totalReleased,
          totalUtilized: totalUtilized,
          avgProgress: avgProgress
        },
        projectStatusData: projectStatusData,
        budgetByComponentData: budgetByComponentData,
        fundUtilizationData: fundUtilizationData,
        progressDistribution: progressDistribution,
        performanceMetrics: performanceMetrics,
        monthlyTrendData: monthlyTrendData,
        stateDistribution: stateDistribution,
        projects: projects, // Full project list
        transactions: transactions, // Full transaction list
        exportDate: new Date().toISOString()
      };

      const jsonData = JSON.stringify(dashboardData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(t('export_success', 'Dashboard exported successfully!'));
    } catch (error) {
      console.error("Export failed:", error);
      alert(t('export_failed', 'Export failed'));
    }
    setExporting(false);
  };

  // Data processing
  const projectStatusData = Object.entries(
    projects.reduce((acc, p) => {
      // Use project status as key, will translate in tooltip/legend formatter
      acc[p.current_status] = (acc[p.current_status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, projects: value }));

  const budgetByComponentData = Object.entries(
    projects.reduce((acc, p) => {
      // Use component name as key, will translate in tooltip/legend formatter
      acc[p.component] = (acc[p.component] || 0) + (p.budget_allocated || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, budget: value }));

  const fundUtilizationData = Object.entries(
    projects.reduce((acc, p) => {
      const state = p.state_name || t('unknown', 'Unknown'); // Translate 'Unknown' if needed
      if (!acc[state]) acc[state] = { state, allocated: 0, released: 0, utilized: 0 };
      acc[state].allocated += p.budget_allocated || 0;
      acc[state].released += p.funds_released || 0;
      acc[state].utilized += p.funds_utilized || 0;
      return acc;
    }, {})
  ).map(([_, data]) => data);

  const progressDistribution = [
    { range: "0-25%", count: projects.filter(p => (p.progress_percent || 0) < 25).length },
    { range: "25-50%", count: projects.filter(p => (p.progress_percent || 0) >= 25 && (p.progress_percent || 0) < 50).length },
    { range: "50-75%", count: projects.filter(p => (p.progress_percent || 0) >= 50 && (p.progress_percent || 0) < 75).length },
    { range: "75-100%", count: projects.filter(p => (p.progress_percent || 0) >= 75).length }
  ];

  const performanceMetrics = [
    { metric: t('metric_on_time', "On Time"), value: Math.round((projects.filter(p => p.current_status !== "Delayed").length / projects.length) * 100) || 0 },
    { metric: t('metric_budget', "Budget"), value: 85 },
    { metric: t('metric_quality', "Quality"), value: 92 },
    { metric: t('metric_stakeholder', "Stakeholder"), value: 88 },
    { metric: t('metric_risk_mgmt', "Risk Mgmt"), value: 78 }
  ];

  // Monthly trend data - hardcoded for now, would typically come from API
  const monthlyTrendData = [
    { month: t('month_jul', 'Jul'), projects: 2, budget: 45 },
    { month: t('month_aug', 'Aug'), projects: 3, budget: 68 },
    { month: t('month_sep', 'Sep'), projects: 5, budget: 95 },
    { month: t('month_oct', 'Oct'), projects: 8, budget: 130 },
    { month: t('month_nov', 'Nov'), projects: 6, budget: 112 },
    { month: t('month_dec', 'Dec'), projects: 9, budget: 145 },
    { month: t('month_jan', 'Jan'), projects: 7, budget: 165 }
  ];

  // State-wise project distribution
  const stateDistribution = Object.entries(
    projects.reduce((acc, p) => {
      const state = p.state_name || t('unknown', "Unknown");
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, count: value }));

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget_allocated || 0), 0);
  const totalReleased = transactions.filter(t => t.status === "Released").reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalUtilized = projects.reduce((sum, p) => sum + (p.funds_utilized || 0), 0);
  const avgProgress = projects.length > 0 ? projects.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / projects.length : 0;

  // Formatter for currency
  const currencyFormatter = (value) => `₹${(value / 10000000).toFixed(2)}${t('currency_cr', 'Cr')}`;
  const budgetValueFormatter = (value) => `₹${(value / 10000000).toFixed(1)}${t('currency_cr', 'Cr')}`;

  // Tooltip formatter for budget related data
  const budgetTooltipFormatter = (value, name) => [currencyFormatter(value), t(`tooltip_${name.toLowerCase()}`, name)];
  const pieLabelFormatter = (entry) => `${t(`status_${entry.name.replace(/\s/g, '_').toLowerCase()}`, entry.name) || t(`component_${entry.name.replace(/\s/g, '_').toLowerCase()}`, entry.name)}: ${(entry.value / totalBudget * 100).toFixed(1)}%`;


  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-orange-500" />
          {t('reports_analytics', 'Reports & Analytics')}
        </h1>
        <Button variant="outline" onClick={handleExportDashboard} disabled={exporting}>
          <FileDown className="w-4 h-4 mr-2" /> {exporting ? t('exporting', 'Exporting...') : t('export_dashboard', 'Export Dashboard')}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">{t('total_projects', 'Total Projects')}</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{projects.length}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {projects.filter(p => p.current_status === "In Progress").length} {t('active', 'active')}
                </p>
              </div>
              <Activity className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">{t('total_budget', 'Total Budget')}</p>
                <p className="text-2xl font-bold text-green-900 mt-1">₹{(totalBudget / 10000000).toFixed(1)}{t('currency_cr', 'Cr')}</p>
                <p className="text-xs text-green-600 mt-1">
                  {t('allocated_across', 'Allocated across')} {projects.length} {t('projects', 'projects')}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">{t('funds_released', 'Funds Released')}</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">₹{(totalReleased / 10000000).toFixed(1)}{t('currency_cr', 'Cr')}</p>
                <p className="text-xs text-orange-600 mt-1">
                  {((totalReleased/totalBudget)*100).toFixed(0)}% {t('of_total_budget', 'of total budget')}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">{t('avg_progress', 'Avg Progress')}</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">{avgProgress.toFixed(1)}%</p>
                <p className="text-xs text-purple-600 mt-1">
                  {t('utilization', 'Utilization')}: ₹{(totalUtilized / 10000000).toFixed(1)}{t('currency_cr', 'Cr')}
                </p>
              </div>
              <Target className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="overview">{t('overview', 'Overview')}</TabsTrigger>
          <TabsTrigger value="financial">{t('financial', 'Financial')}</TabsTrigger>
          <TabsTrigger value="performance">{t('performance', 'Performance')}</TabsTrigger>
          <TabsTrigger value="trends">{t('trends', 'Trends')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5"/> {t('projects_by_status', 'Projects by Status')}</CardTitle></CardHeader>
              <CardContent>
                {projectStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} 
                             tickFormatter={(value) => t(`status_${value.replace(/\s/g, '_').toLowerCase()}`, value)} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                        formatter={(value, name) => [value, t(`status_${name.replace(/\s/g, '_').toLowerCase()}`, name)]}
                        labelFormatter={(label) => t(`status_${label.replace(/\s/g, '_').toLowerCase()}`, label)}
                      />
                      <Bar dataKey="projects" radius={[8, 8, 0, 0]} name={t('projects', 'Projects')}>
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500">{t('no_data_available', 'No data available')}</div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle className="flex items-center gap-2"><PieIcon className="w-5 h-5"/> {t('budget_by_component', 'Budget by Component')}</CardTitle></CardHeader>
              <CardContent>
                {budgetByComponentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie 
                        data={budgetByComponentData} 
                        dataKey="budget" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={100}
                        label={(entry) => `${t(`component_${entry.name.replace(/\s/g, '_').toLowerCase()}`, entry.name) || entry.name}: ${((entry.budget / totalBudget) * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {budgetByComponentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={currencyFormatter} />
                      <Legend formatter={(value) => t(`component_${value.replace(/\s/g, '_').toLowerCase()}`, value) || value} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500">{t('no_data_available', 'No data available')}</div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle>{t('state_wise_project_distribution', 'State-wise Project Distribution')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stateDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#888888" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#F97316" radius={[0, 8, 8, 0]} name={t('project_count', 'Project Count')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle>{t('component_performance', 'Component Performance')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={budgetByComponentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} 
                           tickFormatter={(value) => t(`component_${value.replace(/\s/g, '_').toLowerCase()}`, value)} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip formatter={currencyFormatter} />
                    <Line type="monotone" dataKey="budget" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 5 }} name={t('budget', 'Budget')} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader><CardTitle>{t('fund_utilization_by_state', 'Fund Utilization by State')}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={fundUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="state" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                  <Tooltip formatter={budgetTooltipFormatter} />
                  <Legend formatter={(value) => t(`fund_${value.toLowerCase()}`, value)} />
                  <Bar dataKey="allocated" fill="#3B82F6" name={t('allocated', 'Allocated')} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="released" fill="#10B981" name={t('released', 'Released')} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="utilized" fill="#F97316" name={t('utilized', 'Utilized')} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle>{t('budget_allocation_vs_utilization', 'Budget Allocation vs Utilization')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={[
                        { name: t('utilized', 'Utilized'), value: totalUtilized },
                        { name: t('released_but_unutilized', 'Released but Unutilized'), value: totalReleased - totalUtilized },
                        { name: t('not_released', 'Not Released'), value: totalBudget - totalReleased }
                      ]} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100}
                      label={(entry) => `${entry.name}: ₹${(entry.value / 10000000).toFixed(1)}{t('currency_cr', 'Cr')}`}
                    >
                      {[0,1,2].map((index) => (
                        <Cell key={`cell-${index}`} fill={[COLORS[0], COLORS[1], COLORS[3]][index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={currencyFormatter} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle>{t('fund_release_timeline', 'Fund Release Timeline')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#888888" />
                    <YAxis stroke="#888888" label={{ value: t('currency_cr', 'Cr'), angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={currencyFormatter} />
                    <Area type="monotone" dataKey="budget" stroke="#10B981" fillOpacity={1} fill="url(#colorBudget)" name={t('budget', 'Budget')} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle>{t('progress_distribution', 'Progress Distribution')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} name={t('project_count', 'Project Count')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle>{t('performance_metrics', 'Performance Metrics')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius="80%" data={performanceMetrics}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" stroke="#6b7280" fontSize={12} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" fontSize={10} />
                    <Radar name={t('score', 'Score')} dataKey="value" stroke="#F97316" fill="#F97316" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader><CardTitle>{t('monthly_project_initiation_budget_trend', 'Monthly Project Initiation & Budget Trend')}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#888888" />
                  <YAxis yAxisId="left" stroke="#888888" label={{ value: t('projects_count', 'Projects'), angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888888" label={{ value: t('budget_cr', 'Budget (Cr)'), angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend formatter={(value) => t(`trend_${value.toLowerCase()}`, value)} />
                  <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#3B82F6" strokeWidth={3} name={t('projects', 'Projects')} />
                  <Line yAxisId="right" type="monotone" dataKey="budget" stroke="#10B981" strokeWidth={3} name={t('budget', 'Budget')} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader><CardTitle>{t('cumulative_fund_release', 'Cumulative Fund Release')}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#888888" />
                  <YAxis stroke="#888888" label={{ value: t('budget_cr', 'Budget (Cr)'), angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={currencyFormatter} />
                  <Area type="monotone" dataKey="budget" stroke="#F97316" fillOpacity={1} fill="url(#colorCumulative)" name={t('budget', 'Budget')} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500/10 to-green-500/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot className="w-6 h-6"/> {t('ai_powered_insights', 'AI-Powered Insights')}</CardTitle>
          <CardDescription>{t('ai_insights_description', 'Automated analysis and recommendations based on project data')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-white rounded-xl border-l-4 border-green-500">
            <p className="font-semibold text-green-900 mb-1">✓ {t('budget_performance_strong', 'Budget Performance Strong')}</p>
            <p className="text-sm text-gray-600">
              {t('fund_utilization_message_part1', 'Fund utilization is at')} {((totalUtilized/totalBudget)*100).toFixed(1)}%, {t('fund_utilization_message_part2', 'which is')} {totalUtilized > totalBudget * 0.65 ? t('above', 'above') : t('below', 'below')} {t('fund_utilization_message_part3', 'the national average of 65% for similar schemes.')}
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border-l-4 border-orange-500">
            <p className="font-semibold text-orange-900 mb-1">⚠ {t('attention_needed', 'Attention Needed')}</p>
            <p className="text-sm text-gray-600">
              {projects.filter(p => p.current_status === "Delayed").length} {t('project_delay_message_part1', 'project')}{projects.filter(p => p.current_status === "Delayed").length !== 1 ? t('project_delay_message_part2_plural', 's are') : t('project_delay_message_part2_singular', ' is')} {t('project_delay_message_part3', 'experiencing delays. Consider resource reallocation or intervention.')}
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border-l-4 border-blue-500">
            <p className="font-semibold text-blue-900 mb-1">ℹ {t('trend_analysis', 'Trend Analysis')}</p>
            <p className="text-sm text-gray-600">
              {budgetByComponentData.length > 0 && (t(`component_${budgetByComponentData[0].name.replace(/\s/g, '_').toLowerCase()}`, budgetByComponentData[0].name) || budgetByComponentData[0].name)} {t('trend_analysis_message_part2', 'component has the highest budget allocation. Monitor progress closely to ensure optimal utilization.')}
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-1">📈 {t('performance_insight', 'Performance Insight')}</p>
            <p className="text-sm text-gray-600">
              {t('performance_insight_message_part1', 'Average project progress is')} {avgProgress.toFixed(1)}%. {t('performance_insight_message_part2', 'Projects in')} {stateDistribution[0]?.name || t('top_state', 'top state')} {t('performance_insight_message_part3', 'are performing exceptionally well with')} {stateDistribution[0]?.count || 0} {t('active_projects', 'active projects')}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
