// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Wand2, 
  Grid3x3, 
  BarChart3,
  Edit, 
  Eye, 
  Trash2, 
  ArrowUpDown, 
  MoreHorizontal,
  FolderOpen, 
  Recycle, 
  Leaf,
  ChevronDown, 
  Lightbulb,
  CheckCircle2,
  Award,
  Paintbrush
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const { sidebarOpen } = useSidebar()
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for sorting projects
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // State for benchmark animations
  const [animatedUserScore, setAnimatedUserScore] = useState(0);
  const [animatedIndustryScore, setAnimatedIndustryScore] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardService.getDashboard();
        console.log('Dashboard API Response:', response);
        
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Animate benchmark scores
  useEffect(() => {
    if (dashboardData?.kpis) {
      const userScore = dashboardData.kpis.averageCircularityScore || 0;
      const industryScore = 65; // Default industry benchmark
      
      const duration = 1200;
      const steps = 60;
      const userIncrement = userScore / steps;
      const industryIncrement = industryScore / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedUserScore(Math.min(userIncrement * currentStep, userScore));
          setAnimatedIndustryScore(Math.min(industryIncrement * currentStep, industryScore));
        } else {
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [dashboardData]);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      return new Date().toLocaleDateString('en-US', options);
    }
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProjects = React.useMemo(() => {
    if (!dashboardData?.recentProjects) return [];
    let sortableProjects = [...dashboardData.recentProjects];
    if (sortConfig.key) {
      sortableProjects.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableProjects;
  }, [dashboardData, sortConfig]);

  const handleEdit = (projectId) => {
    window.location.href = `/wizard?id=${projectId}`;
  };

  const handleView = (projectId) => {
    window.location.href = `/analytics?reportId=${projectId}`;
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      console.log('Delete project:', projectId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FCFAF6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#68538C] mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FCFAF6]">
        <div className="text-center p-6 max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#68538C] text-[#FCFAF6] rounded-lg hover:bg-[#342744] shadow-sm transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FCFAF6]">
        <p className="text-[#342744]/70">No dashboard data available</p>
      </div>
    );
  }

  // Quick Actions data - keeping Wizard and Canvas separate for clarity
  const actions = [
    {
      id: 'wizard',
      icon: Wand2,
      label: 'Open Wizard',
      path: '/wizard',
      color: 'bg-[#68538C]',
      hoverColor: 'hover:bg-[#342744]'
    },
    {
      id: 'canvas',
      icon: Grid3x3,
      label: 'Go to Canvas',
      path: '/canvas',
      color: 'bg-[#526B91]',
      hoverColor: 'hover:bg-[#3E5270]'
    },
    {
      id: 'reports',
      icon: BarChart3,
      label: 'Generate Report',
      path: '/reports',
      color: 'bg-[#C9A96E]',
      hoverColor: 'hover:bg-[#AB8E56]'
    }
  ];

  // KPIs data
  const kpis = [
    {
      id: 'total-projects',
      icon: FolderOpen,
      label: 'Total Projects',
      value: dashboardData.kpis?.totalProjects || 0,
      trend: dashboardData.kpis?.projectsThisMonth || 0,
      trendLabel: 'vs last month',
      color: 'bg-[#68538C]/15',
      iconColor: 'text-[#68538C]'
    },
    {
      id: 'average-circularity',
      icon: Recycle,
      label: 'Average Circularity',
      value: `${(dashboardData.kpis?.averageCircularityScore || 0).toFixed(1)}%`,
      trend: dashboardData.kpis?.circularityTrend || 0,
      trendLabel: 'vs last month',
      color: 'bg-[#8FAF9A]/20',
      iconColor: 'text-[#24422E]'
    },
    {
      id: 'total-co2-saved',
      icon: Leaf,
      label: 'Total CO₂ Saved',
      value: `${(dashboardData.kpis?.totalCO2Saved || 0).toLocaleString()} kg`,
      trend: dashboardData.kpis?.gwpTrend || 0,
      trendLabel: 'vs last month',
      color: 'bg-[#B87968]/15',
      iconColor: 'text-[#B87968]'
    }
  ];

  // AI Recommendations from insights
  const recommendations = dashboardData.insights || [];

  // Benchmark data from API
  const userScore = dashboardData.benchmark?.userAverageCircularity || dashboardData.kpis?.averageCircularityScore || 0;
  const industryScore = dashboardData.benchmark?.industryMedianCircularity || 65;
  const percentile = dashboardData.benchmark?.userPercentile || 70;
  const isOutperforming = userScore > industryScore;
  const scoreDifference = Math.abs(Math.round(userScore - industryScore));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-[#B87968]/20 text-[#B87968] border border-[#B87968]/30';
      case 'medium': return 'bg-[#C9A96E]/20 text-[#59421A] border border-[#C9A96E]/30';
      default: return 'bg-[#8FAF9A]/20 text-[#24422E] border border-[#8FAF9A]/30';
    }
  };

  const getPerformanceMessage = () => {
    if (isOutperforming) {
      return `Outperforming by ${scoreDifference}%`;
    }
    if (userScore === industryScore) {
      return 'At Industry Median';
    }
    return `Below Industry by ${scoreDifference}%`;
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6] p-2 sm:p-6">
      <div className="w-full space-y-4 sm:space-y-6">
        {/* Row 1: Welcome and Quick Actions */}
        <div className={`grid gap-4 sm:gap-6 ${sidebarOpen ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 xl:grid-cols-3'}`}>
          {/* Section A - Welcome */}
          <div className={sidebarOpen ? 'lg:col-span-2' : 'xl:col-span-2'}>
            <Card className="p-4 sm:p-6 md:p-8 lg:p-10 bg-[#F5F0E8] border border-[#DED6CC]">
              <div className="space-y-10 sm:space-y-20">
                {/* Header Section */}
                <div className="text-center md:text-left">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#342744] mb-2">
                    Welcome back, {dashboardData.user?.name?.split(' ')[0] || 'User'}
                  </h1>
                  <p className="text-sm md:text-base text-[#342744]/70">
                    Today is {formatDate()}
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                  {/* Active Projects */}
                  <div className="bg-[#FCFAF6] rounded-lg p-4 md:p-6 border border-[#DED6CC]/70 shadow-xs">
                    <p className="text-sm text-[#342744]/70 mb-3 md:mb-4">Active Projects</p>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#342744]">
                        {dashboardData.summary?.totalProjects || 0}
                      </p>
                      {dashboardData.summary?.trendingScore !== undefined && (
                        <div className={`flex items-center gap-1 ${getTrendColor(dashboardData.summary.trendingScore)}`}>
                          {getTrendIcon(dashboardData.summary.trendingScore)}
                          <span className="text-sm font-medium">
                            {Math.abs(dashboardData.summary.trendingScore)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated Reports */}
                  <div className="bg-[#FCFAF6] rounded-lg p-4 md:p-6 border border-[#DED6CC]/70 shadow-xs">
                    <p className="text-sm text-[#342744]/70 mb-3 md:mb-4">Generated Reports</p>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#342744]">
                        {dashboardData.summary?.completedAssessments || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Section B - Quick Actions */}
          <div>
            <Card className="p-4 sm:p-6 bg-[#F5F0E8] border border-[#DED6CC]">
              <h2 className="text-lg sm:text-xl font-bold text-[#342744] mb-4 sm:mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {actions.map((action) => (
                  <Link
                    key={action.id}
                    to={action.path}
                    className={`${action.color} ${action.hoverColor} text-[#FCFAF6] rounded-lg p-3 sm:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all duration-200 transform hover:scale-105 hover:shadow-lg group shadow-xs`}
                  >
                    <action.icon className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm font-semibold text-center">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Row 2: Recent Projects - Section C */}
        <div>
          <Card className="p-4 sm:p-6 bg-[#F5F0E8] border border-[#DED6CC]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#342744]">Recent Projects</h2>
              <Button 
                variant="link" 
                className="text-[#68538C] hover:text-[#342744] font-medium p-0 h-auto self-start sm:self-auto"
                onClick={() => window.location.href = '/projects'}
              >
                View All Projects
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#DED6CC]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#342744]">
                      <button 
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1 hover:text-[#68538C] transition-colors"
                      >
                        Project Name
                        <ArrowUpDown className="w-3 h-3 text-[#A996C7]" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#342744]">
                      <button 
                        onClick={() => handleSort('metalType')}
                        className="flex items-center gap-1 hover:text-[#68538C] transition-colors"
                      >
                        Metal & Process
                        <ArrowUpDown className="w-3 h-3 text-[#A996C7]" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#342744]">
                      <button 
                        onClick={() => handleSort('lastModified')}
                        className="flex items-center gap-1 hover:text-[#68538C] transition-colors"
                      >
                        Last Modified
                        <ArrowUpDown className="w-3 h-3 text-[#A996C7]" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#342744]">
                      <button 
                        onClick={() => handleSort('circularityScore')}
                        className="flex items-center gap-1 hover:text-[#68538C] transition-colors"
                      >
                        Circularity Score
                        <ArrowUpDown className="w-3 h-3 text-[#A996C7]" />
                      </button>
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[#342744]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProjects.slice(0, 8).map((project) => (
                    <tr 
                      key={project._id || project.id} 
                      className="border-b border-[#DED6CC]/60 hover:bg-[#FCFAF6] transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-[#342744]">
                        {project.name}
                      </td>
                      <td className="py-4 px-4 text-sm text-[#342744]/80">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#BA7967]/15 text-[#BA7967] mr-2">
                          {project.metalType || 'Copper'}
                        </span>
                        {project.processType}
                      </td>
                      <td className="py-4 px-4 text-sm text-[#342744]/70">
                        {formatDate(project.lastModified || project.updatedAt || project.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-[#342744] min-w-[2rem]">
                            {project.circularityScore}%
                          </span>
                          <Progress 
                            value={project.circularityScore} 
                            className="h-2 flex-1 bg-[#DED6CC]"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleView(project._id || project.id)}
                            className="p-2 hover:bg-[#FCFAF6] rounded-lg transition-colors text-[#342744]/70 hover:text-[#68538C] cursor-pointer"
                            title="View Analytics"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(project._id || project.id)}
                            className="p-2 hover:bg-[#FCFAF6] rounded-lg transition-colors text-[#342744]/70 hover:text-[#68538C] cursor-pointer"
                            title="Edit in Wizard"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id || project.id)}
                            className="p-2 hover:bg-[#FCFAF6] rounded-lg transition-colors text-[#342744]/70 hover:text-[#B87968] cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sortedProjects.length === 0 && (
                <div className="text-center py-12">
                  <div className="mb-2">
                    <FolderOpen className="w-16 h-16 mx-auto text-[#A996C7]/50 mb-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#342744] mb-2">No projects yet</h3>
                  <p className="text-sm text-[#342744]/70 mb-2">
                    Projects are automatically created when you complete a wizard workflow
                  </p>
                  <p className="text-sm text-[#342744]/70 mb-8">
                    or you can build one from scratch using the Canvas
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => window.location.href = '/wizard'}
                      className="bg-[#68538C] text-[#FCFAF6] hover:bg-[#342744] flex items-center gap-2 shadow-sm"
                    >
                      <Wand2 className="w-4 h-4" />
                      Start Wizard
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/canvas'}
                      className="border-[#68538C] text-[#68538C] hover:bg-[#68538C] hover:text-[#FCFAF6] flex items-center gap-2"
                    >
                      <Grid3x3 className="w-4 h-4" />
                      Open Canvas
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Row 3: KPIs - Section D */}
        <div>
          <div className={`grid gap-4 sm:gap-6 ${sidebarOpen ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {kpis.map((kpi) => (
              <Card key={kpi.id} className="p-4 sm:p-6 bg-[#F5F0E8] border border-[#DED6CC] hover:bg-[#FCFAF6] transition-colors duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${kpi.color}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.iconColor}`} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-[#342744]/70 font-medium">
                    {kpi.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#342744]">
                    {kpi.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 ${getTrendColor(kpi.trend)}`}>
                      {getTrendIcon(kpi.trend)}
                      <span className="text-sm font-semibold">
                        {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                      </span>
                    </div>
                    <span className="text-xs text-[#342744]/50">
                      {kpi.trendLabel}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Row 4: AI Recommendations and Industry Benchmarking */}
        <div className={`grid gap-4 sm:gap-6 ${sidebarOpen ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 xl:grid-cols-2'}`}>
          {/* Section E - AI Recommendations */}
          <Card className="p-4 sm:p-6 bg-[#F5F0E8] border border-[#DED6CC]">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 bg-[#68538C]/15 rounded-lg">
                <Lightbulb className="w-5 h-5 text-[#68538C]" />
              </div>
              <h2 className="text-xl font-bold text-[#342744]">
                AI Recommendations & Insights
              </h2>
            </div>
            
            <div className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((recommendation, index) => (
                  <div
                    key={recommendation._id || recommendation.id || index}
                    className="bg-[#FCFAF6] rounded-lg p-4 border border-[#DED6CC] hover:border-[#68538C] hover:shadow-sm transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-[#342744] group-hover:text-[#68538C] transition-colors truncate">
                            {recommendation.title}
                          </h3>
                          {recommendation.priority && (
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(recommendation.priority)}`}>
                              {recommendation.priority}
                            </span>
                          )}
                        </div>
                        
                        {recommendation.description && (
                          <p className="text-sm text-[#342744]/80 line-clamp-2">
                            {recommendation.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-3">
                          {recommendation.confidenceScore && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-[#A996C7]" />
                              <span className="text-xs text-[#342744]/70">
                                {recommendation.confidenceScore}% confidence
                              </span>
                            </div>
                          )}
                          
                          {recommendation.type && (
                            <span className="text-xs text-[#342744]/70 capitalize">
                              {recommendation.type.replace(/-/g, ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ChevronDown className="w-5 h-5 text-[#A996C7] group-hover:text-[#68538C] transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-[#A996C7]/50 mx-auto mb-4" />
                  <p className="text-[#342744]/70 mb-2">No recommendations available</p>
                  <p className="text-sm text-[#342744]/50">
                    AI insights will appear here as you use the platform
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Section F - Industry Benchmarking */}
          <Card className="p-4 sm:p-6 bg-[#F5F0E8] border border-[#DED6CC]">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 bg-[#68538C]/15 rounded-lg">
                <BarChart3 className="w-5 h-5 text-[#68538C]" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#342744]">
                Industry Benchmarking
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Performance Summary */}
              <div className="text-center mb-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className={`w-5 h-5 ${isOutperforming ? 'text-[#8FAF9A]' : 'text-[#C9A96E]'}`} />
                  <span className={`text-sm font-semibold ${isOutperforming ? 'text-[#24422E]' : 'text-[#59421A]'}`}>
                    {getPerformanceMessage()}
                  </span>
                </div>
                {percentile > 0 && (
                  <p className="text-xs text-[#342744]/70">
                    You're in the top <span className="font-semibold">{100 - percentile}%</span> of companies
                  </p>
                )}
              </div>

              {/* User Score */}
              <div className="bg-[#FCFAF6] rounded-lg p-4 border border-[#DED6CC]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#68538C]"></div>
                    <span className="text-sm font-medium text-[#342744]">
                      Your Average
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#68538C]" />
                    <span className="text-lg font-bold text-[#342744]">
                      {Math.round(animatedUserScore)}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={animatedUserScore} 
                  className="h-3 bg-[#DED6CC]"
                />
              </div>

              {/* Industry Score */}
              <div className="bg-[#FCFAF6] rounded-lg p-4 border border-[#DED6CC]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#A996C7]"></div>
                    <span className="text-sm font-medium text-[#342744]/80">
                      Industry Median
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[#342744]/70">
                    {Math.round(animatedIndustryScore)}%
                  </span>
                </div>
                <Progress 
                  value={animatedIndustryScore} 
                  className="h-3 bg-[#DED6CC]"
                />
              </div>

              {/* Performance Insight */}
              {isOutperforming ? (
                <div className="bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#8FAF9A] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#24422E] mb-1">
                        Industry Leader
                      </p>
                      <p className="text-xs text-[#24422E]/85">
                        You're performing {scoreDifference}% better than the industry average. 
                        {percentile > 75 && " Keep up the excellent work!"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : userScore < industryScore ? (
                <div className="bg-[#C9A96E]/15 border border-[#C9A96E]/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-[#C9A96E] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#59421A] mb-1">
                        Growth Opportunity
                      </p>
                      <p className="text-xs text-[#59421A]/85">
                        You're {scoreDifference}% below industry average. Focus on improving circularity practices.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <Button 
                onClick={() => window.location.href = '/reports'}
                className="w-full bg-[#68538C] hover:bg-[#342744] text-[#FCFAF6] font-semibold py-3 transition-colors shadow-sm"
              >
                View Detailed Benchmark Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;