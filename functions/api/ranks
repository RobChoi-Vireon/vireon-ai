// Mock API endpoint for development.
// Serves GET /api/ranks and returns the content of /components/fixtures/ranks.json.
// This allows the frontend to fetch data from a realistic API path.

Deno.serve(async (req) => {
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const ranksFixturePath = './components/fixtures/ranks.json';
        const ranksData = await Deno.readTextFile(ranksFixturePath);
        
        return new Response(ranksData, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to read ranks fixture:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error: Could not load ranks data.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});