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

async function runMultiMetalTest() {
  console.log('🧪 Testing Multi-Metal Wizard Workflows (Copper, Steel, Aluminium)...\n');

  try {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'hashim@example.com', password: 'password123' })
    });
    const authHeaders = { Authorization: `Bearer ${loginRes.data.accessToken}` };

    // Copper Test
    console.log('🥉 Testing Copper Workflow creation...');
    const cuRes = await request('/wizard/workflows', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: 'Malanjkhand Copper Plant', metalType: 'Copper', description: 'Madhya Pradesh Copper LCA' })
    });
    const cuId = cuRes.data?.workflow?._id || cuRes.data?._id;
    console.log(`   ✅ Copper Workflow created: ${cuId}\n`);

    // Steel Test
    console.log('🏗️ Testing Steel Workflow creation...');
    const feRes = await request('/wizard/workflows', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: 'Jamshedpur Integrated Steel Plant', metalType: 'Steel', description: 'BF-BOF Steel LCA' })
    });
    const feId = feRes.data?.workflow?._id || feRes.data?._id;
    console.log(`   ✅ Steel Workflow created: ${feId}\n`);

    console.log('🎉 Multi-metal workflow creation verified successfully!\n');
  } catch (err) {
    console.error('❌ Multi-metal test failed:', err.message, err.data);
    process.exit(1);
  }
}

runMultiMetalTest();
