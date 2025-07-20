export default async (req) => {
  // Log 1: Function execution started.
  console.log("Function execution started.");

  try {
    const host = req.headers.get('host');
    // Log 2: Retrieved host from headers.
    console.log(`Retrieved host: ${host}`);

    const fullUrl = new URL(req.url, `https://${host}`);
    // Log 3: Constructed the full URL.
    console.log(`Constructed full URL: ${fullUrl.href}`);

    const targetUrl = fullUrl.searchParams.get('url');
    // Log 4: Extracted the target URL.
    console.log(`Target URL to fetch: ${targetUrl}`);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (req.method === 'OPTIONS') {
      console.log("Responding to OPTIONS preflight request.");
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!targetUrl) {
      console.error("Error: Target URL parameter is missing.");
      return new Response('URL parameter is missing', {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Log 5: Preparing to fetch the target URL.
    console.log(`Preparing to fetch with method: ${req.method}`);
    
    const fetchOptions = {
      method: req.method,
      headers: req.headers,
      redirect: 'follow',
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req.body;
    }

    const fetchResponse = await fetch(targetUrl, fetchOptions);
    // Log 6: Fetch successful.
    console.log(`Fetch completed with status: ${fetchResponse.status}`);

    const responseHeaders = new Headers(fetchResponse.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    // Log 7: Sending back the response.
    console.log("Sending final response to the client.");
    return new Response(fetchResponse.body, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: responseHeaders,
    });

  } catch (e) {
    // Log 8: An error was caught.
    console.error("--- CRITICAL ERROR CAUGHT ---");
    console.error(e);
    return new Response(`Proxy error: ${e.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
