import { createClient } from 'npm:@base44/sdk@0.1.0';
import finnhub from 'npm:finnhub';

// Cache is valid for 15 minutes
const CACHE_EXPIRATION_MINUTES = 15;

Deno.serve(async (req) => {
    const base44 = createClient({
        appId: Deno.env.get('BASE44_APP_ID'),
    });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const token = authHeader.split(' ')[1];
    base44.auth.setToken(token);
    try {
        await base44.auth.me();
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    
    const { dataType, ticker } = await req.json();
    const cacheKey = ticker ? `${dataType}_${ticker}` : dataType;

    try {
        // 1. Check for valid cache entry
        const cachedResults = await base44.entities.CachedMarketData.filter({ cacheKey });
        if (cachedResults.length > 0) {
            const cache = cachedResults[0];
            const cacheAgeMinutes = (new Date() - new Date(cache.lastUpdated)) / (1000 * 60);

            if (cacheAgeMinutes < CACHE_EXPIRATION_MINUTES) {
                // Return fresh data from cache
                return new Response(JSON.stringify({ data: cache.data, source: 'cache' }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        // 2. If cache is stale or missing, fetch from API
        const finnhubKey = Deno.env.get('Finnhub_Key');
        if (!finnhubKey) {
             return new Response(JSON.stringify({ error: 'Finnhub API key is not configured.' }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
        
        const api_key = finnhub.ApiClient.instance.authentications['api_key'];
        api_key.apiKey = finnhubKey;
        const finnhubClient = new finnhub.DefaultApi();

        let newData;
        switch (dataType) {
            case 'earnings_calendar':
                newData = await new Promise((resolve, reject) => {
                    finnhubClient.earningsCalendar({}, (error, data, response) => {
                        if (error) reject(error);
                        else resolve(data.earningsCalendar);
                    });
                });
                break;
            default:
                 return new Response(JSON.stringify({ error: 'Invalid data type requested' }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        if (!newData) {
            return new Response(JSON.stringify({ error: 'Failed to fetch data from provider.' }), { status: 502, headers: { "Content-Type": "application/json" } });
        }

        // 3. Update the cache with the new data
        const upsertData = { cacheKey, data: newData, lastUpdated: new Date().toISOString() };
        
        if (cachedResults.length > 0) {
            await base44.entities.CachedMarketData.update(cachedResults[0].id, upsertData);
        } else {
            await base44.entities.CachedMarketData.create(upsertData);
        }

        // 4. Return the new data
        return new Response(JSON.stringify({ data: newData, source: 'api' }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('Error in getOptimizedMarketData:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});