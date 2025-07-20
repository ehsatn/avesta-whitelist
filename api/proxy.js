export default async (req) => {
  const host = req.headers.get('host');
  const fullUrl = new URL(req.url, `https://${host}`);
  const targetUrl = fullUrl.searchParams.get('url');

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (!targetUrl) {
    return new Response('URL parameter is missing', {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers: req.headers,
      redirect: 'follow',
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req.body;
    }

    const fetchResponse = await fetch(targetUrl, fetchOptions);

    const responseHeaders = new Headers(fetchResponse.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(fetchResponse.body, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: responseHeaders,
    });

  } catch (e) {
    return new Response(`Proxy error: ${e.message}`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
};
