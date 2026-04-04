// Gathers web evidence using Google Custom Search + Wikipedia in parallel.
// If Google hits its 100/day free limit (429) or any other error,
// the pipeline gracefully falls back to Wikipedia + Gemini only.

const searchGoogle = async (text) => {
    const apiKey = process.env.GOOGLE_API_KEY?.trim();
    const cx     = process.env.GOOGLE_CX?.trim();

    if (!apiKey || !cx) {
        console.warn('⚠️  Google Search skipped: missing GOOGLE_API_KEY or GOOGLE_CX in .env');
        return { results: [], skipped: true, reason: 'missing_credentials' };
    }

    const query = encodeURIComponent(text.substring(0, 150));
    const url   = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}&num=3`;

    try {
        const res  = await fetch(url);
        const data = await res.json();

        // 429 = daily quota exceeded
        if (res.status === 429) {
            console.warn('⚠️  Google Search quota exhausted (100/day limit hit). Falling back to Wikipedia + Gemini only.');
            return { results: [], skipped: true, reason: 'quota_exceeded' };
        }

        // Any other non-OK response (403, 400, etc.)
        if (!res.ok) {
            console.warn(`⚠️  Google Search failed (HTTP ${res.status}): ${data.error?.message || 'Unknown error'}. Falling back.`);
            return { results: [], skipped: true, reason: `http_${res.status}` };
        }

        const results = data.items
            ? data.items.map(item => `${item.title}: ${item.snippet}`)
            : [];

        return { results, skipped: false, reason: null };

    } catch (e) {
        // Network error, timeout, JSON parse failure, etc.
        console.warn(`⚠️  Google Search fetch error: ${e.message}. Falling back.`);
        return { results: [], skipped: true, reason: 'network_error' };
    }
};

const searchWikipedia = async (text) => {
    const query = encodeURIComponent(text.substring(0, 150));
    const url   = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&utf8=&format=json&srlimit=3`;

    try {
        const res  = await fetch(url);
        const data = await res.json();
        return data.query?.search
            ? data.query.search.map(item => item.snippet.replace(/<[^>]+>/g, ''))
            : [];
    } catch (e) {
        console.warn(`⚠️  Wikipedia fetch error: ${e.message}`);
        return [];
    }
};

const searchNewsApi = async (text) => {
    const apiKey = process.env.NEWS_API_KEY?.trim();

    if (!apiKey) {
        console.warn('⚠️  NewsAPI skipped: missing NEWS_API_KEY in .env');
        return [];
    }

    const query = encodeURIComponent(text.substring(0, 100));
    // Sort by relevance to find the best journalistic matches
    const url   = `https://newsapi.org/v2/everything?q=${query}&sortBy=relevance&pageSize=5&apiKey=${apiKey}`;

    try {
        const res  = await fetch(url);
        const data = await res.json();

        if (res.status === 429) {
            console.warn('⚠️  NewsAPI quota exhausted. Falling back.');
            return [];
        }

        return data.articles
            ? data.articles.map(a => `${a.title}: ${a.description || a.content?.substring(0, 200)}`)
            : [];
    } catch (e) {
        console.warn(`⚠️  NewsAPI fetch error: ${e.message}`);
        return [];
    }
};

const gatherEvidence = async (text) => {
    console.log(`[${new Date().toLocaleTimeString()}] 🔎 Gathering evidence (Google + News + Wiki)...`);

    const [googleResponse, newsResults, wikiResults] = await Promise.all([
        searchGoogle(text),
        searchNewsApi(text),
        searchWikipedia(text)
    ]);

    // Log the gathered payload
    const gCount = googleResponse.results.length;
    const nCount = newsResults.length;
    const wCount = wikiResults.length;

    if (googleResponse.skipped) {
        console.log(`⚠️  Google: skipped (${googleResponse.reason}) | 📰 News: ${nCount} | 📖 Wiki: ${wCount}`);
    } else {
        console.log(`✅ Google: ${gCount} | 📰 News: ${nCount} | 📖 Wiki: ${wCount}`);
    }

    return {
        google:           googleResponse.results,
        googleSkipped:    googleResponse.skipped,
        googleSkipReason: googleResponse.reason,
        news:             newsResults,
        wikipedia:        wikiResults
    };
};

module.exports = { gatherEvidence };