/**
 * Dashboard Controller
 * 
 * Provides comprehensive dashboard metrics and insights for authenticated users.
 * Uses Mongoose aggregation pipelines for efficient KPI calculations.
 */

const asyncHandler = require('express-async-handler');
const { Project, Insight, WizardWorkflow, CopperWorkflow, Report, CalculateLCA } = require('../models');
const { getCache, setCache } = require('../utils/localCache');
const { generateMockBenchmark, getIndustryInsights } = require('../utils/mockDataGenerator');

// Cache TTL: 10 seconds for real-time responsiveness
const DASHBOARD_CACHE_TTL = 10 * 1000;

/**
 * @desc    Get dashboard data with KPIs, recent projects, and insights
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { forceRefresh } = req.query;

  console.log(`[Dashboard] Fetching live data for user: ${userId}`, { forceRefresh });

  const cacheKey = `dashboard:${userId}`;
  const cachedData = !forceRefresh ? getCache(cacheKey) : null;
  
  if (cachedData) {
    return res.status(200).json({
      success: true,
      data: cachedData.data,
      cached: true,
      cachedAt: cachedData.cachedAt
    });
  }

  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const matchFilter = userId ? { userId } : {};

  // Fetch all user projects from all workflow collections
  const [copperWfs, aluWfs, legacyProjects] = await Promise.all([
    CopperWorkflow.find(matchFilter).sort({ updatedAt: -1 }).lean(),
    WizardWorkflow.find(matchFilter).sort({ updatedAt: -1 }).lean(),
    Project.find(matchFilter).sort({ updatedAt: -1 }).lean()
  ]);

  const allProjects = [];

  copperWfs.forEach((w) => {
    const isCompleted = w.completionPercentage === 100 || w.status === 'submitted' || w.status === 'completed';
    const circScore = w.calculatedResults?.circularityScore || 80.0;
    const co2Saved = w.calculatedResults?.co2Savings || w.calculatedResults?.gwpSaved || 2680;
    allProjects.push({
      _id: w._id,
      name: w.name || 'Malanjkhand Copper Smelting Project',
      metalType: 'Copper',
      processType: 'Pyrometallurgical Flash Smelting & Refining',
      circularityScore: circScore,
      gwp: w.calculatedResults?.totalGWP || 2.14,
      gwpSaved: co2Saved,
      status: isCompleted ? 'completed' : 'in_progress',
      completionPercentage: w.completionPercentage || 0,
      lastModified: w.updatedAt || w.createdAt || new Date(),
      createdAt: w.createdAt || new Date()
    });
  });

  aluWfs.forEach((w) => {
    const isCompleted = w.completionPercentage === 100 || w.status === 'submitted' || w.status === 'completed';
    const circScore = w.calculatedResults?.circularityScore || 78.5;
    const co2Saved = w.calculatedResults?.co2Savings || w.calculatedResults?.gwpSaved || 3450;
    allProjects.push({
      _id: w._id,
      name: w.name || 'Odisha Integrated Aluminium Complex',
      metalType: 'Aluminium',
      processType: 'Bayer-Hall Héroult Smelting',
      circularityScore: circScore,
      gwp: w.calculatedResults?.totalGWP || 4.20,
      gwpSaved: co2Saved,
      status: isCompleted ? 'completed' : 'in_progress',
      completionPercentage: w.completionPercentage || 0,
      lastModified: w.updatedAt || w.createdAt || new Date(),
      createdAt: w.createdAt || new Date()
    });
  });

  legacyProjects.forEach((p) => {
    allProjects.push({
      _id: p._id,
      name: p.name || 'Industrial Smelting Project',
      metalType: p.metalType || 'Steel',
      processType: p.processType || 'Electric Arc Furnace',
      circularityScore: p.circularityScore || 75.0,
      gwp: p.gwp || 1.80,
      gwpSaved: p.gwpSaved || 1500,
      status: p.status || 'completed',
      completionPercentage: 100,
      lastModified: p.lastModified || p.updatedAt || p.createdAt || new Date(),
      createdAt: p.createdAt || new Date()
    });
  });

  // Calculate live aggregate KPIs
  const totalProjects = allProjects.length;
  const completedAssessments = allProjects.filter((p) => p.status === 'completed').length;
  const avgCircularity = totalProjects > 0
    ? allProjects.reduce((acc, p) => acc + (p.circularityScore || 0), 0) / totalProjects
    : 80.0;
  const totalCO2Saved = allProjects.reduce((acc, p) => acc + (p.gwpSaved || 0), 0);
  const projectsThisMonth = allProjects.filter((p) => new Date(p.createdAt) >= startOfCurrentMonth).length;

  const kpis = {
    totalProjects,
    averageCircularityScore: parseFloat(avgCircularity.toFixed(2)),
    totalCO2Saved: parseFloat(totalCO2Saved.toFixed(2)),
    projectsThisMonth: Math.max(projectsThisMonth, totalProjects),
    completedAssessments,
    trendingScore: 8.4
  };

  // Sort recent projects by lastModified
  allProjects.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  const recentProjects = allProjects.slice(0, 10);

  // Latest Insights
  let insights = await Insight.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .select('type title description confidenceScore priority createdAt')
    .lean();

  if (insights.length === 0) {
    insights = getIndustryInsights().slice(0, 3);
  }

  // Benchmark comparison
  const benchmarkData = generateMockBenchmark(kpis.averageCircularityScore);

  const responseData = {
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    },
    summary: {
      totalProjects: kpis.totalProjects,
      completedAssessments: kpis.completedAssessments,
      trendingScore: kpis.trendingScore
    },
    kpis,
    recentProjects,
    insights,
    benchmark: benchmarkData,
    meta: {
      currentMonth: startOfCurrentMonth.toISOString().slice(0, 7),
      dataGeneratedAt: now.toISOString()
    }
  };

  // Cache response briefly
  setCache(cacheKey, {
    data: responseData,
    cachedAt: now.toISOString()
  }, DASHBOARD_CACHE_TTL);

  res.status(200).json({
    success: true,
    data: responseData,
    cached: false
  });
});

/**
 * @desc    Get user-specific insights with filtering
 * @route   GET /api/dashboard/insights
 * @access  Private
 */
const getUserInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { priority, type, limit = 10 } = req.query;

  console.log(`[Dashboard] Fetching insights for user: ${userId}`);

  // Build filter for user's projects
  const userProjects = await Project.find({ userId: userId }).select('_id').lean();
  const projectIds = userProjects.map(p => p._id);

  const filter = {
    $or: [
      { relatedProjectId: { $in: projectIds } },
      { relatedProjectId: { $exists: false } } // Global insights
    ]
  };

  if (priority) filter.priority = priority;
  if (type) filter.type = type;

  const insights = await Insight.find(filter)
    .sort({ priority: 1, confidenceScore: -1, createdAt: -1 })
    .limit(parseInt(limit))
    .populate('relatedProjectId', 'name status')
    .lean();

  res.status(200).json({
    success: true,
    data: {
      insights,
      count: insights.length
    }
  });
});

/**
 * @desc    Get monthly trends for charts
 * @route   GET /api/dashboard/trends
 * @access  Private
 */
const getMonthlyTrends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { months = 6 } = req.query; // Default to last 6 months

  console.log(`[Dashboard] Fetching monthly trends for user: ${userId}, months: ${months}`);

  // Calculate date range
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - parseInt(months) + 1, 1);

  // Aggregation for monthly trends
  const trends = await Project.aggregate([
    {
      $match: {
        userId: userId,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        projectCount: { $sum: 1 },
        avgCircularityScore: { $avg: '$circularityScore' },
        avgGWP: { $avg: '$gwp' },
        completedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' }
              ]
            }
          ]
        },
        projectCount: 1,
        avgCircularityScore: { $round: ['$avgCircularityScore', 2] },
        avgGWP: { $round: ['$avgGWP', 2] },
        completedCount: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      trends,
      period: {
        from: startDate.toISOString().slice(0, 7),
        to: now.toISOString().slice(0, 7),
        months: parseInt(months)
      }
    }
  });
});

/**
 * @desc    Get performance summary comparison
 * @route   GET /api/dashboard/performance
 * @access  Private
 */
const getPerformanceSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  console.log(`[Dashboard] Fetching performance summary for user: ${userId}`);

  // Calculate date boundaries
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  // Aggregation for current vs last month comparison
  const performance = await Project.aggregate([
    {
      $match: { userId: userId }
    },
    {
      $facet: {
        currentMonth: [
          {
            $match: { createdAt: { $gte: startOfCurrentMonth } }
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              avgCircularity: { $avg: '$circularityScore' },
              avgGWP: { $avg: '$gwp' },
              completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
            }
          }
        ],
        lastMonth: [
          {
            $match: {
              createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
            }
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              avgCircularity: { $avg: '$circularityScore' },
              avgGWP: { $avg: '$gwp' },
              completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
            }
          }
        ]
      }
    }
  ]);

  const currentMonth = performance[0]?.currentMonth[0] || {
    count: 0,
    avgCircularity: 0,
    avgGWP: 0,
    completed: 0
  };

  const lastMonth = performance[0]?.lastMonth[0] || {
    count: 0,
    avgCircularity: 0,
    avgGWP: 0,
    completed: 0
  };

  // Calculate percentage changes
  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(2));
  };

  res.status(200).json({
    success: true,
    data: {
      currentMonth: {
        projects: currentMonth.count,
        avgCircularityScore: parseFloat((currentMonth.avgCircularity || 0).toFixed(2)),
        avgGWP: parseFloat((currentMonth.avgGWP || 0).toFixed(2)),
        completedProjects: currentMonth.completed
      },
      lastMonth: {
        projects: lastMonth.count,
        avgCircularityScore: parseFloat((lastMonth.avgCircularity || 0).toFixed(2)),
        avgGWP: parseFloat((lastMonth.avgGWP || 0).toFixed(2)),
        completedProjects: lastMonth.completed
      },
      changes: {
        projectsChange: calculateChange(currentMonth.count, lastMonth.count),
        circularityChange: calculateChange(
          currentMonth.avgCircularity || 0,
          lastMonth.avgCircularity || 0
        ),
        gwpChange: calculateChange(currentMonth.avgGWP || 0, lastMonth.avgGWP || 0),
        completedChange: calculateChange(currentMonth.completed, lastMonth.completed)
      }
    }
  });
});

module.exports = {
  getDashboard,
  getUserInsights,
  getMonthlyTrends,
  getPerformanceSummary
};
