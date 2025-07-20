export default async (req) => {
  // Get the destination URL from the query parameter
  const url = new URL(req.url).searchParams.get('url');

  // Set CORS headers to allow requests from any origin
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (!url) {
    return new Response('URL parameter is missing', {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }

  try {
    // Fetch the content from the destination URL
    const fetchResponse = await fetch(url);

    // Get the JSON data from the response
    const data = await fetchResponse.json();

    // Create a new response with the correct JSON content type and CORS headers
    return new Response(JSON.stringify(data, null, 2), {
      status: fetchResponse.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    });

  } catch (e) {
    return new Response(`An error occurred: ${e.message}`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
};
