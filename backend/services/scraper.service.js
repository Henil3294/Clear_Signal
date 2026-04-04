// Attempts to fetch plain text content from a URL for deeper evidence analysis
// Used optionally to scrape content from Google search result URLs

const scrapeUrl = async (url) => {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ClearSignalBot/1.0)'
            }
        });
        clearTimeout(timeout);

        if (!res.ok) return null;

        const html = await res.text();

        // Strip HTML tags and collapse whitespace — rough but fast
        const text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 2000); // Limit to 2000 chars to keep prompt size manageable

        return text || null;
    } catch (e) {
        // Timeout or network error — skip silently
        return null;
    }
};

const scrapeMultipleUrls = async (urls = []) => {
    console.log(`[${new Date().toLocaleTimeString()}] 🌐 Scraping ${urls.length} URLs...`);
    const results = await Promise.all(urls.map(scrapeUrl));
    const valid = results.filter(Boolean);
    console.log(`✅ Scraped ${valid.length}/${urls.length} URLs successfully`);
    return valid;
};

module.exports = { scrapeUrl, scrapeMultipleUrls };
