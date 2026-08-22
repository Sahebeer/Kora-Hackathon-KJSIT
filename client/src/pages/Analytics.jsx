import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProjectSelector from '../sections/analytics/ProjectSelector';
import Header from '../sections/analytics/Header';
import TabbedDashboard from '../sections/analytics/TabbedDashboard';
import { getUserLCAReports, getCalculatelcaById } from '../services/lcaService';
import { getWizardWorkflows } from '../services/wizardService';
import projectAnalyticsData from '../data/projectAnalytics.json';

/**
 * Normalizes any project data source (projectAnalytics.json, DB calculatelca, or LCA report)
 * into a rich, unified analytics data structure compatible with all 7 dashboard tabs.
 */
function normalizeAnalyticsProject(raw) {
  if (!raw) return null;

  const linear = raw.linearModel || {};
  const circular = raw.circularModel || {};
  const prodStages = raw.productionStages || [];

  // Stage dictionary for ProcessStages & DetailedReports
  const stagesObj = raw.stages || {};
  if (prodStages.length > 0) {
    prodStages.forEach((s) => {
      const key = s.stageName || `stage_${s.stageNumber}`;
      if (!stagesObj[key]) {
        stagesObj[key] = {
          energyConsumption: s.energyInput || 0,
          co2Emissions: s.emissions || 0,
          waterUsage: (s.waterInput ? s.waterInput / 100000 : 0.8),
          wasteGeneration: s.wasteOutput || 0,
          yieldEfficiency: s.yieldEfficiency || 85,
          processEfficiency: s.processEfficiency || 84,
          operatingCost: s.operatingCost || 18000000,
          capitalCost: s.capitalCost || 45000000,
          maintenanceCost: s.maintenanceCost || 3500000,
          expectedSavings: s.expectedSavings || 3200000,
          optimizationPotential: s.optimizationPotential || 15,
          completed: true,
        };
      }
    });
  }

  const projName =
    raw.name ||
    raw.projectName ||
    raw.workflowName ||
    'Industrial Lifecycle Project';

  const metalType =
    (raw.metalType ? raw.metalType.charAt(0).toUpperCase() + raw.metalType.slice(1).toLowerCase() : null) ||
    (projName.toLowerCase().includes('copper') ? 'Copper' :
     projName.toLowerCase().includes('alum') ? 'Aluminium' :
     projName.toLowerCase().includes('steel') ? 'Steel' :
     projName.toLowerCase().includes('zinc') ? 'Zinc' : 'Copper');

  const circScore =
    raw.circularityScore ??
    circular.materialCircularity ??
    raw.circularityIndex ??
    80;

  const totalGWP =
    raw.totalCO2Emissions ??
    raw.totalGWP ??
    circular.totalEmissions ??
    620000;

  const totalEnergy =
    raw.totalEnergyConsumption ??
    raw.totalEnergy ??
    circular.energyConsumption ??
    950000;

  const totalWater =
    raw.totalWaterUsage ??
    raw.totalWater ??
    (circular.waterConsumption ? circular.waterConsumption / 100000 : 18);

  const totalWaste =
    raw.totalWasteGeneration ??
    circular.wasteGeneration ??
    280000;

  return {
    ...raw,
    _id: raw._id || raw.projectId || raw.reportId || 'project-default',
    projectId: raw.projectId || raw._id || 'project-default',
    reportId: raw.reportId || raw._id || raw.projectId,
    projectName: projName,
    metalType: metalType,
    location: raw.location || raw.geographicAnalysis?.facilities?.[0]?.name || 'Industrial Smelting Complex, IN',
    timestamp: raw.analysisDate || raw.updatedAt || raw.createdAt || new Date().toISOString(),
    status: raw.status || 'completed',

    // Aggregate Environmental KPIs
    totalCO2Emissions: totalGWP,
    totalGWP: totalGWP,
    totalEnergyConsumption: totalEnergy,
    totalEnergy: totalEnergy,
    totalWaterUsage: totalWater,
    totalWater: totalWater,
    totalWasteGeneration: totalWaste,
    totalAirQualityImpact: raw.totalAirQualityImpact || 380,

    // Circularity Indices
    circularityScore: circScore,
    circularityRating: circScore >= 75 ? 'Superior' : circScore >= 50 ? 'Good' : 'Fair',
    materialRecoveryRate: raw.materialRecoveryRate || circular.recyclingRate || 75,
    circularityIndex: circScore > 1 ? circScore / 100 : circScore,
    linearityIndex: circScore > 1 ? (100 - circScore) / 100 : (1 - circScore),

    // Models
    linearModel: {
      totalCost: linear.totalCost || 250000000,
      capitalExpenditure: linear.capitalExpenditure || 180000000,
      operationalExpenditure: linear.operationalExpenditure || 45000000,
      maintenanceCost: linear.maintenanceCost || 12000000,
      wasteManagementCost: linear.wasteManagementCost || 13000000,
      totalEmissions: linear.totalEmissions || 850000,
      energyConsumption: linear.energyConsumption || 1200000,
      waterConsumption: linear.waterConsumption || 2500000,
      wasteGeneration: linear.wasteGeneration || 450000,
      resourceEfficiency: linear.resourceEfficiency || 65,
      recyclingRate: linear.recyclingRate || 15,
      materialCircularity: linear.materialCircularity || 20,
      paybackPeriod: linear.paybackPeriod || 48,
    },
    circularModel: {
      totalCost: circular.totalCost || 195000000,
      capitalExpenditure: circular.capitalExpenditure || 140000000,
      operationalExpenditure: circular.operationalExpenditure || 35000000,
      maintenanceCost: circular.maintenanceCost || 9000000,
      wasteManagementCost: circular.wasteManagementCost || 11000000,
      totalEmissions: circular.totalEmissions || 620000,
      energyConsumption: circular.energyConsumption || 950000,
      waterConsumption: circular.waterConsumption || 1800000,
      wasteGeneration: circular.wasteGeneration || 280000,
      resourceEfficiency: circular.resourceEfficiency || 85,
      recyclingRate: circular.recyclingRate || 75,
      materialCircularity: circular.materialCircularity || 80,
      paybackPeriod: circular.paybackPeriod || 36,
    },

    comparativeMetrics: {
      totalCost: {
        linear: linear.totalCost || 250000000,
        circular: circular.totalCost || 195000000,
        savings: (linear.totalCost || 250000000) - (circular.totalCost || 195000000),
      },
    },

    productionStages: prodStages.length > 0 ? prodStages : [
      {
        stageId: 'mining-001',
        stageName: 'mining',
        stageNumber: 1,
        materialInput: 1000000,
        energyInput: 450000,
        waterInput: 1200000,
        emissions: 280000,
        yieldEfficiency: 85,
        energyEfficiency: 75,
        waterEfficiency: 70,
        processEfficiency: 82,
        operatingCost: 25000000,
        capitalCost: 80000000,
        maintenanceCost: 5000000,
        optimizationPotential: 18,
        expectedSavings: 4500000,
      },
      {
        stageId: 'beneficiation-001',
        stageName: 'beneficiation',
        stageNumber: 2,
        materialInput: 850000,
        energyInput: 280000,
        waterInput: 800000,
        emissions: 180000,
        yieldEfficiency: 85,
        energyEfficiency: 78,
        waterEfficiency: 72,
        processEfficiency: 84,
        operatingCost: 18000000,
        capitalCost: 45000000,
        maintenanceCost: 3500000,
        optimizationPotential: 15,
        expectedSavings: 3200000,
      },
      {
        stageId: 'smelting-001',
        stageName: 'smelting',
        stageNumber: 3,
        materialInput: 720000,
        energyInput: 380000,
        waterInput: 450000,
        emissions: 320000,
        yieldEfficiency: 90,
        energyEfficiency: 82,
        waterEfficiency: 75,
        processEfficiency: 88,
        operatingCost: 22000000,
        capitalCost: 65000000,
        maintenanceCost: 4200000,
        optimizationPotential: 12,
        expectedSavings: 3800000,
      },
      {
        stageId: 'refining-001',
        stageName: 'refining',
        stageNumber: 4,
        materialInput: 650000,
        energyInput: 220000,
        waterInput: 280000,
        emissions: 95000,
        yieldEfficiency: 95,
        energyEfficiency: 88,
        waterEfficiency: 80,
        processEfficiency: 92,
        operatingCost: 15000000,
        capitalCost: 35000000,
        maintenanceCost: 2800000,
        optimizationPotential: 8,
        expectedSavings: 2100000,
      },
      {
        stageId: 'recycling-001',
        stageName: 'recycling',
        stageNumber: 5,
        materialInput: 150000,
        energyInput: 120000,
        waterInput: 150000,
        emissions: 25000,
        yieldEfficiency: 90,
        energyEfficiency: 85,
        waterEfficiency: 78,
        processEfficiency: 87,
        operatingCost: 8500000,
        capitalCost: 20000000,
        maintenanceCost: 1500000,
        optimizationPotential: 10,
        expectedSavings: 1600000,
      },
    ],

    stages: stagesObj,

    sankeyData: raw.sankeyData || {
      normalizationBasisTonnes: 1,
      nodes: [
        { id: 'primary', name: 'Primary Feedstock', value: 0.25, column: 0, type: 'input', unit: 't' },
        { id: 'recycled', name: 'Recycled Scrap Input', value: 0.75, column: 0, type: 'input', unit: 't' },
        { id: 'manufacturing', name: 'Smelting & Fabrication', value: 1.0, column: 1, type: 'process', unit: 't' },
        { id: 'scrap', name: 'Runaround Scrap', value: 0.065, column: 2, type: 'waste', unit: 't' },
        { id: 'product', name: 'Finished Product (Cathode/Rod)', value: 0.935, column: 2, type: 'output', unit: 't' },
        { id: 'collection', name: 'End-of-Life Scrap Collection', value: 0.78, column: 3, type: 'process', unit: 't' },
        { id: 'recyclingPlant', name: 'Secondary TSL Smelter', value: 0.75, column: 4, type: 'process', unit: 't' },
        { id: 'valorization', name: 'Slag/Acid Valorization', value: 0.85, column: 4, type: 'process', unit: 't' },
      ],
      links: [
        { source: 'primary', target: 'manufacturing', value: 0.25 },
        { source: 'recycled', target: 'manufacturing', value: 0.75 },
        { source: 'manufacturing', target: 'scrap', value: 0.065 },
        { source: 'manufacturing', target: 'product', value: 0.935 },
        { source: 'product', target: 'collection', value: 0.78 },
        { source: 'collection', target: 'recyclingPlant', value: 0.75 },
        { source: 'recyclingPlant', target: 'recycled', value: 0.75 },
        { source: 'manufacturing', target: 'valorization', value: 0.85 },
      ],
    },

    geographicAnalysis: raw.geographicAnalysis || {
      city: 'Malanjkhand',
      state: 'Madhya Pradesh',
      country: 'India',
      facilities: [
        {
          id: 'fac-1',
          name: 'Malanjkhand Copper Mine',
          type: 'mine',
          latitude: 22.0167,
          longitude: 80.7167,
          capacity: 1000000,
          emissions: 280000,
          waterUsage: 1200000,
          energyConsumption: 450000,
        },
        {
          id: 'fac-2',
          name: 'Khetri Smelting Complex',
          type: 'smelter',
          latitude: 27.9833,
          longitude: 75.8000,
          capacity: 720000,
          emissions: 320000,
          waterUsage: 450000,
          energyConsumption: 380000,
        },
      ],
    },

    aiRecommendations: raw.aiRecommendations || raw.recommendations || [
      {
        category: 'Process Optimization',
        title: 'Flash Smelter Oxygen Enrichment',
        impact: 'High',
        potentialSavings: '24% thermal energy reduction',
        description: 'Increase oxygen concentration in reaction shaft to 95% to achieve autogenous smelting kinetics.',
      },
      {
        category: 'Circular Symbiosis',
        title: 'Copper Slag Valorization in Green Concrete',
        impact: 'High',
        potentialSavings: '₹8.4M byproduct revenue',
        description: 'Replace 85% of river sand with granulated copper slag in cementitious concrete mixtures.',
      },
    ],
    recommendations: raw.recommendations || [
      {
        category: 'Process Optimization',
        title: 'Flash Smelter Oxygen Enrichment',
        impact: 'High',
        potentialSavings: '24% thermal energy reduction',
        description: 'Increase oxygen concentration in reaction shaft to 95% to achieve autogenous smelting kinetics.',
      },
      {
        category: 'Circular Symbiosis',
        title: 'Copper Slag Valorization in Green Concrete',
        impact: 'High',
        potentialSavings: '₹8.4M byproduct revenue',
        description: 'Replace 85% of river sand with granulated copper slag in cementitious concrete mixtures.',
      },
    ],
  };
}

export default function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const reportId = searchParams.get('reportId');

  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mode, setMode] = useState('circular');
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);

  // Initialize and load all projects
  useEffect(() => {
    async function loadAllAnalytics() {
      setLoading(true);
      try {
        // 1. Load benchmark datasets from projectAnalytics.json
        const benchmarkProjects = (projectAnalyticsData || []).map(normalizeAnalyticsProject);

        // 2. Fetch live reports from backend if available
        let liveProjects = [];
        try {
          const res = await getUserLCAReports();
          if (res.success && res.data?.reports && Array.isArray(res.data.reports)) {
            liveProjects = res.data.reports.map(normalizeAnalyticsProject);
          }
        } catch (e) {
          console.warn('⚠️ Could not fetch live LCA reports, falling back to rich benchmark library:', e.message);
        }

        // 3. Fetch all saved wizard workflows (Copper & Aluminium) so created projects appear immediately!
        let workflowProjects = [];
        try {
          const wfRes = await getWizardWorkflows({ limit: 50 });
          if (wfRes.success && Array.isArray(wfRes.data?.workflows)) {
            workflowProjects = wfRes.data.workflows.map(normalizeAnalyticsProject);
          }
        } catch (e) {
          console.warn('⚠️ Could not fetch wizard workflows:', e.message);
        }

        // Merge: Workflows first, then Live Reports, then Benchmarks without duplicate IDs
        const combinedMap = new Map();
        [...workflowProjects, ...liveProjects, ...benchmarkProjects].forEach((p) => {
          if (p && p._id && !combinedMap.has(p._id)) {
            combinedMap.set(p._id, p);
          }
        });

        const all = Array.from(combinedMap.values());
        setAvailableProjects(all);

        // Auto-select requested report or first project
        if (reportId) {
          const match = all.find((p) => p._id === reportId || p.reportId === reportId || p.projectId === reportId);
          if (match) {
            setSelectedProject(match);
          } else {
            // Attempt to fetch specific calculateLCA doc
            try {
              const calcData = await getCalculatelcaById(reportId);
              if (calcData) {
                const norm = normalizeAnalyticsProject(calcData);
                setSelectedProject(norm);
                setAvailableProjects((prev) => [norm, ...prev]);
              } else {
                setSelectedProject(all[0] || null);
              }
            } catch {
              setSelectedProject(all[0] || null);
            }
          }
        } else if (all.length > 0) {
          setSelectedProject(all[0]);
        }
      } catch (err) {
        console.error('❌ Failed to load analytics dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAllAnalytics();
  }, [reportId]);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    if (project?._id) {
      setSearchParams({ reportId: project._id });
    }
  };

  if (loading) {
    return (
      <div className="analytics-page min-h-screen bg-[#FCFAF6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BA7967] mx-auto mb-4"></div>
          <p className="text-[#342744]/70 font-medium">Loading Metallurgy Analytics Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page min-h-screen bg-[#FCFAF6]">
      {/* Top Header with Project Switcher & Mode Toggle */}
      <Header
        selectedProject={selectedProject}
        mode={mode}
        onModeChange={setMode}
        onProjectSelect={handleSelectProject}
        projects={availableProjects}
      />

      {/* Project Selector Bar */}
      <div className="px-6 mb-6">
        <ProjectSelector
          projects={availableProjects}
          selectedProject={selectedProject}
          onSelect={handleSelectProject}
        />
      </div>

      {/* Comprehensive 7-Tab Metallurgy Analytics Dashboard */}
      {selectedProject && (
        <TabbedDashboard
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mode={mode}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
}