exports.handler = async (event, context) => {
  const baseUrl = process.env.URL || 'https://candid-semifreddo-b145eb.netlify.app';
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: process.env.WHOOP_CLIENT_ID || '',
      redirectUri: baseUrl + '/callback'
    })
  };
};
