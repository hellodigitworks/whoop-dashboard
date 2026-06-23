const https = require('https');

// Generate mock data for testing (90 days of realistic data)
function generateMockData() {
  const cycles = [];
  const workouts = [];
  const now = new Date('2026-06-23');
  const activities = ['Padel', 'Weightlifting', 'Running', 'Cycling', 'Yoga'];

  for (let i = 90; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Cycle data
    const recovery = Math.max(35, Math.min(95, 65 + Math.random() * 30 - 15));
    const rhr = Math.max(50, Math.min(80, 62 + Math.random() * 15 - 7));
    const hrv = Math.max(30, Math.min(120, 75 + Math.random() * 40 - 20));
    const asleepMin = Math.max(240, Math.min(600, 420 + Math.random() * 120 - 60));
    const sleepOnset = new Date(d);
    sleepOnset.setHours(0 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 60), 0);
    const wakeOnset = new Date(sleepOnset);
    wakeOnset.setMinutes(wakeOnset.getMinutes() + asleepMin);

    const deep = Math.round(asleepMin * (0.15 + Math.random() * 0.1));
    const rem = Math.round(asleepMin * (0.2 + Math.random() * 0.1));
    const light = Math.round(asleepMin * (0.55 + Math.random() * 0.1));
    const awake = asleepMin - deep - rem - light;

    cycles.push({
      cycleStart: dateStr + 'T' + sleepOnset.getHours().toString().padStart(2, '0') + ':' + sleepOnset.getMinutes().toString().padStart(2, '0') + ':00',
      recovery: Math.round(recovery),
      rhr: Math.round(rhr),
      hrv: Math.round(hrv),
      spo2: Math.max(90, Math.min(100, 96 + Math.random() * 4 - 2)),
      strain: Math.random() > 0.5 ? Math.round((Math.random() * 18) * 10) / 10 : null,
      sleepOnset: sleepOnset.toISOString(),
      wakeOnset: wakeOnset.toISOString(),
      sleepPerf: Math.round(70 + Math.random() * 25),
      asleepMin,
      light,
      deep,
      rem,
      awake
    });

    // Random workouts (40% of days have a workout)
    if (Math.random() < 0.4) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      const duration = Math.round(30 + Math.random() * 90);
      const strain = Math.round((Math.random() * 15) * 10) / 10;
      workouts.push({
        workoutStart: dateStr + 'T' + (9 + Math.floor(Math.random() * 12)).toString().padStart(2, '0') + ':' + Math.floor(Math.random() * 60).toString().padStart(2, '0') + ':00',
        workoutEnd: dateStr + 'T' + (10 + Math.floor(Math.random() * 11)).toString().padStart(2, '0') + ':' + Math.floor(Math.random() * 60).toString().padStart(2, '0') + ':00',
        duration,
        activityName: activity,
        activityStrain: strain
      });
    }
  }

  return { cycles, workouts };
}

const mockData = generateMockData();

function httpsRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    }).on('error', reject).on('timeout', function() {
      this.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function fetchFromWhoop() {
  try {
    const clientId = process.env.WHOOP_CLIENT_ID;
    const clientSecret = process.env.WHOOP_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      // Return mock data if no credentials
      return mockData;
    }

    // Get access token (placeholder — implement actual OAuth flow)
    const token = process.env.WHOOP_ACCESS_TOKEN;
    if (!token) {
      return mockData;
    }

    // Fetch cycles from Whoop API (v4)
    const cyclesUrl = 'https://api.prod.whoop.com/developer/v4/physiological_cycles?limit=3650&order=desc';
    const cyclesData = await httpsRequest(cyclesUrl);

    // Fetch workouts from Whoop API
    const workoutsUrl = 'https://api.prod.whoop.com/developer/v4/workouts?limit=3650&order=desc';
    const workoutsData = await httpsRequest(workoutsUrl);

    return {
      cycles: cyclesData.records || [],
      workouts: workoutsData.records || []
    };
  } catch (e) {
    console.error('Whoop API error:', e.message);
    // Fall back to mock data on error
    return mockData;
  }
}

exports.handler = async (event, context) => {
  try {
    const data = await fetchFromWhoop();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
