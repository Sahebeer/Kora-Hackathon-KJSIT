/**
 * Canvas Utility Functions
 * Helper functions for canvas operations
 */

/**
 * Generate unique node ID
 */
export const generateNodeId = () => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate unique edge ID
 */
export const generateEdgeId = (source, target) => {
  return `edge_${source}_${target}_${Date.now()}`;
};

/**
 * Create a process node for ReactFlow
 */
export const createProcessNode = (process, position, metal, stage) => {
  return {
    id: generateNodeId(),
    type: 'canvasNode',
    position,
    data: {
      process: {
        id: process.id,
        name: process.name,
        label: process.label,
        description: process.description,
        color: process.color,
        icon: process.icon, // Explicitly preserve icon component
        hasSubprocesses: process.hasSubprocesses,
        parameters: process.parameters || {},
        metal,
        stage
      },
      label: process.label || process.name,
      metal,
      stage
    }
  };
};

/**
 * Create a connection/edge for ReactFlow
 */
export const createConnection = (source, target) => {
  return {
    id: generateEdgeId(source, target),
    source,
    target,
    type: 'bezier',
    animated: true,
    style: { strokeWidth: 2 }
  };
};

/**
 * Build workflow object for predictions
 */
export const buildWorkflowObject = (nodes, edges, metal) => {
  const processes = nodes.map(node => ({
    id: node.id,
    typeId: node.data.process.id || node.data.process.typeId,
    label: node.data.label,
    stage: node.data.stage,
    parameters: node.data.process.parameters || {},
    position: node.position
  }));

  const connections = edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target
  }));

  return {
    metal,
    processes,
    connections,
    metadata: {
      createdAt: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length
    }
  };
};

/**
 * Validate workflow structure
 */
export const validateWorkflow = (workflow) => {
  const errors = [];

  if (!workflow.metal) {
    errors.push('Metal type is required');
  }

  if (!workflow.processes || workflow.processes.length === 0) {
    errors.push('At least one process is required');
  }

  // Check for disconnected nodes (except single node workflows)
  if (workflow.processes.length > 1 && workflow.connections.length === 0) {
    errors.push('Processes should be connected');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculate canvas bounds
 */
export const calculateCanvasBounds = (nodes) => {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    const x = node.position.x;
    const y = node.position.y;
    
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });

  return { minX, minY, maxX, maxY };
};

/**
 * Export workflow to JSON
 */
export const exportWorkflow = (nodes, edges, metal, projectName) => {
  const workflow = buildWorkflowObject(nodes, edges, metal);
  
  const exportData = {
    ...workflow,
    projectName,
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName.replace(/\s+/g, '_')}_workflow_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import workflow from JSON
 */
export const importWorkflow = (jsonData) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Reconstruct nodes
    const nodes = data.processes.map(process => ({
      id: process.id,
      type: 'canvasNode',
      position: process.position,
      data: {
        process: {
          id: process.typeId,
          typeId: process.typeId,
          label: process.label,
          parameters: process.parameters,
          stage: process.stage,
          metal: data.metal
        },
        label: process.label,
        metal: data.metal,
        stage: process.stage
      }
    }));

    // Reconstruct edges
    const edges = data.connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: 'bezier',
      animated: true,
      style: { strokeWidth: 2 }
    }));

    return {
      nodes,
      edges,
      metal: data.metal,
      projectName: data.projectName
    };
  } catch (error) {
    console.error('Failed to import workflow:', error);
    throw new Error('Invalid workflow file');
  }
};

/**
 * Get center position for canvas
 */
export const getCenterPosition = (reactFlowInstance) => {
  if (!reactFlowInstance) {
    return { x: 250, y: 250 };
  }

  const viewport = reactFlowInstance.getViewport();
  const zoom = viewport.zoom;
  const { x: viewportX, y: viewportY } = viewport;
  
  // Get canvas dimensions (estimate)
  const canvasWidth = window.innerWidth - 600; // Subtract sidebars
  const canvasHeight = window.innerHeight - 100;
  
  // Calculate center in flow coordinates
  const centerX = (canvasWidth / 2 - viewportX) / zoom;
  const centerY = (canvasHeight / 2 - viewportY) / zoom;
  
  return { x: centerX, y: centerY };
};

/**
 * Format parameter value for display
 */
export const formatParameterValue = (value, paramName) => {
  if (typeof value === 'number') {
    // Add appropriate units
    if (paramName.includes('temperature') || paramName.includes('Temperature')) {
      return `${value}°C`;
    }
    if (paramName.includes('percent') || paramName.includes('Percent') || paramName.includes('Grade')) {
      return `${value}%`;
    }
    if (paramName.includes('energy') || paramName.includes('Energy') || paramName.includes('power') || paramName.includes('Power')) {
      return `${value} kWh`;
    }
    if (paramName.includes('water') || paramName.includes('Water')) {
      return `${value} m³`;
    }
    return value.toString();
  }
  
  if (typeof value === 'string') {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return value;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate full pre-connected Copper Circular Ecosystem Canvas Template
 */
export const createCopperCircularTemplate = (processLibrary) => {
  const cu = processLibrary?.copper;
  if (!cu) return { nodes: [], edges: [] };

  const pMining = cu.extraction?.find(p => p.id === 'openPitMiningCu') || cu.extraction?.[0];
  const pBen = cu.processing?.find(p => p.id === 'frothFlotationCu') || cu.processing?.[0];
  const pSmelt = cu.refining?.find(p => p.id === 'flashSmeltingCu') || cu.refining?.[0];
  const pManuf = cu.manufacturing?.find(p => p.id === 'continuousCastingRodCu') || cu.manufacturing?.[0];
  const pUse = cu.use_phase?.find(p => p.id === 'evMotorWindingsCu') || cu.use_phase?.[0];
  const pRec = cu.recycling?.find(p => p.id === 'closedLoopScrapRecyclingCu') || cu.recycling?.[0];
  const pVal = cu.valorization?.find(p => p.id === 'slagGreenConcreteCu') || cu.valorization?.[0];

  const n1 = createProcessNode(pMining, { x: 60, y: 100 }, 'copper', 'extraction');
  const n2 = createProcessNode(pBen, { x: 320, y: 100 }, 'copper', 'processing');
  const n3 = createProcessNode(pSmelt, { x: 580, y: 100 }, 'copper', 'refining');
  const n4 = createProcessNode(pManuf, { x: 840, y: 100 }, 'copper', 'manufacturing');
  const n5 = createProcessNode(pUse, { x: 1100, y: 100 }, 'copper', 'use_phase');
  const n6 = createProcessNode(pRec, { x: 840, y: 320 }, 'copper', 'recycling');
  const n7 = createProcessNode(pVal, { x: 580, y: 320 }, 'copper', 'valorization');

  const nodes = [n1, n2, n3, n4, n5, n6, n7];

  const edges = [
    createConnection(n1.id, n2.id), // Mining -> Beneficiation
    createConnection(n2.id, n3.id), // Beneficiation -> Flash Smelting
    createConnection(n3.id, n4.id), // Smelting -> Continuous Casting
    createConnection(n4.id, n5.id), // Manufacturing -> EV Motor Use
    createConnection(n5.id, n6.id), // End-of-Life -> Secondary Scrap Remelting
    createConnection(n6.id, n3.id), // Circular Feedback: Secondary Scrap -> Smelter!
    createConnection(n3.id, n7.id), // Byproduct Valorization: Slag -> Green Concrete Sand!
  ];

  return { nodes, edges };
};
