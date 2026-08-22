const API_URL = 'http://localhost:5001/api';

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${data?.message || response.statusText}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runWizardE2ETest() {
  console.log('🚀 Starting Full Wizard End-to-End Automated Test...\n');

  try {
    // 1. Auth Login
    console.log('1️⃣ Authenticating test user (hashim@example.com)...');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'hashim@example.com',
        password: 'password123'
      })
    });
    const token = loginRes.data.accessToken;
    const authHeaders = { Authorization: `Bearer ${token}` };
    console.log('   ✅ Authenticated! Token acquired.\n');

    // 2. Create Aluminium Workflow
    console.log('2️⃣ Creating Aluminium Wizard Workflow...');
    const createRes = await request('/wizard/workflows', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'E2E Test Aluminium Plant - Odisha',
        metalType: 'Aluminium',
        description: 'Automated test of full 7-stage LCA wizard workflow'
      })
    });

    const workflow = createRes.data?.workflow || createRes.data;
    const workflowId = workflow._id || workflow.id;
    console.log(`   ✅ Workflow created: ${workflowId} (${workflow.name})\n`);

    // 3. Step 0 - Mining
    console.log('3️⃣ Updating & Completing Step 0: Mining (Bauxite Extraction)...');
    await request(`/wizard/workflows/${workflowId}/steps/mining`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        applicableProcesses: ['openPit', 'dieselHaul'],
        location: 'Odisha',
        oreGrade: '46.5',
        overburdenRatio: '3.2',
        mining_ore_grade_percent: 46.5,
        mining_overburden_ratio: 3.2,
        mining_energy_MJ_per_t_ore: 580,
        mining_water_m3_per_t_ore: 1.1,
        mining_co2_kg_per_t_ore: 62.4
      })
    });
    const completeStep0 = await request(`/wizard/workflows/${workflowId}/steps/mining/complete`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log(`   ✅ Mining completed (Progress: ${completeStep0.data?.completionPercentage}%)\n`);

    // 4. Step 1 - Beneficiation
    console.log('4️⃣ Updating & Completing Step 1: Beneficiation (Crushing & Washing)...');
    await request(`/wizard/workflows/${workflowId}/steps/beneficiation`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        processes: ['crushing', 'washing_screening'],
        beneficiation_water_m3_per_t_ore: 1.4,
        beneficiation_electricity_kWh_per_t_ore: 22.5,
        beneficiation_tailings_management: 'Thickened'
      })
    });
    const completeStep1 = await request(`/wizard/workflows/${workflowId}/steps/beneficiation/complete`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log(`   ✅ Beneficiation completed (Progress: ${completeStep1.data?.completionPercentage}%)\n`);

    // 5. Step 2 - Refining (Bayer Process)
    console.log('5️⃣ Updating & Completing Step 2: Refining (Bayer Alumina Refinery)...');
    await request(`/wizard/workflows/${workflowId}/steps/refining`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        processes: ['digestion', 'precipitation', 'calcination'],
        refining_energy_MJ_per_t_alumina: 11800,
        refining_water_m3_per_t_alumina: 2.9,
        refining_red_mud_kg_per_t_alumina: 1250,
        refining_caustic_soda_kg_per_t_alumina: 11.5,
        refining_lime_kg_per_t_alumina: 8.2
      })
    });
    const completeStep2 = await request(`/wizard/workflows/${workflowId}/steps/refining/complete`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log(`   ✅ Refining completed (Progress: ${completeStep2.data?.completionPercentage}%)\n`);

    // 6. Step 3 - Smelting (Hall-Héroult Reduction)
    console.log('6️⃣ Updating & Completing Step 3: Smelting (Potline Reduction)...');
    await request(`/wizard/workflows/${workflowId}/steps/smelting`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        processes: ['pre_baking_anodes', 'electrolysis'],
        smelting_energy_kWh_per_t_al: 14200,
        smelting_co2_kg_per_t_al: 1650,
        smelting_pfc_kg_per_t_al: 45,
        smelting_so2_kg_per_t_al: 2.8,
        fluorideRecovery: '96.5'
      })
    });
    const completeStep3 = await request(`/wizard/workflows/${workflowId}/steps/smelting/complete`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log(`   ✅ Smelting completed (Progress: ${completeStep3.data?.completionPercentage}%)\n`);

    // 7. Step 4 - Manufacturing
    console.log('7️⃣ Updating & Completing Step 4: Manufacturing (Ingot & Extrusion)...');
    await request(`/wizard/workflows/${workflowId}/steps/manufacturing`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        processes: ['casting', 'extrusion'],
        manufacturing_scrap_rate_percent: 8.5,
        manufacturing_energy_MJ_per_t_product: 3200
      })
    });
    const completeStep4 = await request(`/wizard/workflows/${workflowId}/steps/manufacturing/complete`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log(`   ✅ Manufacturing completed (Progress: ${completeStep4.data?.completionPercentage}%)\n`);

    // 8. Step 5 - Recycling
    console.log('8️⃣ Updating & Completing Step 5: Recycling (Secondary Scrap Remelt)...');
    await request(`/wizard/workflows/${workflowId}/steps/recycling`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        processes: ['collection', 'remelting'],
        recycling_scrap_input_percent: 35,
        recycling_energy_kWh_per_t_Al: 780,
        recoveryEfficiency: '94'
      })
    });
    const completeStep5 = await request(`/wizard/workflows/${workflowId}/steps/recycling/complete`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log(`   ✅ Recycling completed (Progress: ${completeStep5.data?.completionPercentage}%)\n`);

    // 9. Step 6 - Valorization
    console.log('9️⃣ Updating & Completing Step 6: Valorization (Red Mud to Cement)...');
    await request(`/wizard/workflows/${workflowId}/steps/valorization`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        valorizationMethods: ['cement_additive', 'dross_recovery'],
        waste_utilization_Red_Mud_percent: 65,
        waste_utilization_Dross_percent: 80,
        valorization_recovery_efficiency_percent: 82
      })
    });
    const completeStep6 = await request(`/wizard/workflows/${workflowId}/steps/valorization/complete`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log(`   ✅ Valorization completed (Progress: ${completeStep6.data?.completionPercentage}%)\n`);

    // 10. Submit Workflow
    console.log('🔟 Submitting Completed Wizard Workflow...');
    const submitRes = await request(`/wizard/workflows/${workflowId}/submit`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log(`   ✅ Submission status: ${submitRes.message || 'Workflow submitted'}\n`);

    // 11. Generate Final LCA Report
    console.log('1️⃣1️⃣ Generating ISO 14040/44 LCA Report from Wizard Data...');
    const reportRes = await request(`/wizard/workflows/${workflowId}/generate-report`, {
      method: 'POST',
      headers: authHeaders
    });
    console.log('   ✅ Report Generated Successfully!');
    console.log('   📄 Report Output:', {
      reportId: reportRes.data?.report?._id || reportRes.data?._id || reportRes.data?.id,
      name: reportRes.data?.report?.name || reportRes.data?.name,
      gwp: reportRes.data?.report?.lcaResults?.gwpTotal || reportRes.data?.lcaResults?.gwpTotal || reportRes.data?.results?.carbonFootprint,
      circularity: reportRes.data?.report?.lcaResults?.circularityIndex || reportRes.data?.lcaResults?.circularityIndex || reportRes.data?.results?.circularityIndex
    });

    console.log('\n================================================================');
    console.log('🎉 ALL 11 WIZARD LIFECYCLE TESTS PASSED WITH 100% SUCCESS!');
    console.log('================================================================\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error(error.message, error.data || '');
    process.exit(1);
  }
}

runWizardE2ETest();
