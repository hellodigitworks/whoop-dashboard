const https = require('https');

// Mock data from your CSVs for testing
const mockData = {
  cycles: [
    {
      cycleStart: "2026-06-23T01:44:12",
      recovery: 74,
      rhr: 66,
      hrv: 74,
      spo2: 95.30,
      strain: null,
      sleepOnset: "2026-06-23T01:44:12",
      wakeOnset: "2026-06-23T10:04:58",
      sleepPerf: 80,
      asleepMin: 465,
      light: 216,
      deep: 137,
      rem: 112,
      awake: 35
    },
    {
      cycleStart: "2026-06-22T02:16:41",
      recovery: 75,
      rhr: 63,
      hrv: 74,
      spo2: 98.27,
      strain: 15.1,
      sleepOnset: "2026-06-22T02:16:41",
      wakeOnset: "2026-06-22T10:51:43",
      sleepPerf: 80,
      asleepMin: 490,
      light: 285,
      deep: 103,
      rem: 102,
      awake: 25
    },
    {
      cycleStart: "2026-06-21T04:42:06",
      recovery: 89,
      rhr: 60,
      hrv: 92,
      spo2: 98.29,
      strain: 17.7,
      sleepOnset: "2026-06-21T04:42:06",
      wakeOnset: "2026-06-21T11:12:10",
      sleepPerf: 75,
      asleepMin: 383,
      light: 185,
      deep: 125,
      rem: 73,
      awake: 7
    },
    {
      cycleStart: "2026-06-20T04:42:28",
      recovery: 62,
      rhr: 67,
      hrv: 68,
      spo2: 96.84,
      strain: 16.0,
      sleepOnset: "2026-06-20T04:42:28",
      wakeOnset: "2026-06-20T11:41:29",
      sleepPerf: 76,
      asleepMin: 403,
      light: 192,
      deep: 83,
      rem: 128,
      awake: 16
    }
  ],
  workouts: [
    { workoutStart: "2026-06-23T21:11:00", workoutEnd: "2026-06-23T22:09:59", duration: 58, activityName: "Padel", activityStrain: 9.6 },
    { workoutStart: "2026-06-23T20:09:07", workoutEnd: "2026-06-23T20:43:24", duration: 34, activityName: "Weightlifting", activityStrain: 8.7 },
    { workoutStart: "2026-06-22T22:04:00", workoutEnd: "2026-06-22T23:09:59", duration: 65, activityName: "Padel", activityStrain: 10.9 },
    { workoutStart: "2026-06-22T20:17:03", workoutEnd: "2026-06-22T21:15:42", duration: 58, activityName: "Weightlifting", activityStrain: 12.2 }
  ]
};

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
