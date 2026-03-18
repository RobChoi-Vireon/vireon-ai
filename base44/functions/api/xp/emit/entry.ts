// Mock API endpoint for development.
// Simulates POST /api/xp/emit to add experience points.

Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const body = await req.json();
        const { user_id, amount } = body;
        const points = amount ?? 50;

        // In a real app, you'd fetch the user's current XP from a database.
        // Here, we'll read the fixture to simulate it.
        const profileFixture = await Deno.readTextFile('./components/fixtures/profile-me.json');
        const profile = JSON.parse(profileFixture);
        
        const ranksFixture = await Deno.readTextFile('./components/fixtures/ranks.json');
        const ranks = JSON.parse(ranksFixture);

        // This is a stateless mock, so we can't persist the XP.
        // We'll just calculate what the new XP *would* be.
        const updatedXp = profile.xp_total + points;

        // Utility function to find the new rank
        const rankFor = (xp, rankList) => {
            return [...rankList]
                .sort((a, b) => b.xp_min - a.xp_min)
                .find(r => xp >= r.xp_min);
        };
        
        const newRank = rankFor(updatedXp, ranks);

        const responsePayload = {
            xp_total: updatedXp,
            rank_key: newRank ? newRank.key : profile.rank_key,
            events_last10: [{ type: "manual", points, ts: new Date().toISOString() }]
        };

        // NOTE: This mock does not update the underlying fixture file.
        // The frontend must refetch the profile data (which will still be the original fixture data)
        // or handle the UI update client-side based on this response.
        // For this demo, we'll let the frontend do a local state update on success.

        return new Response(JSON.stringify(responsePayload), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Failed to process XP emit:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});