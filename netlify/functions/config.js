exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: process.env.WHOOP_CLIENT_ID || '',
      redirectUri: 'https://' + (process.env.NETLIFY_SITE_NAME ? process.env.NETLIFY_SITE_NAME + '.netlify.app' : 'whoop-dashboard.netlify.app') + '/callback'
    })
  };
};
