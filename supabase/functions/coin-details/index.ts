import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://api.coingecko.com/api/v3";

const CACHE_TTL = 60 * 1000;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// ==========================================
// SUPABASE ADMIN CLIENT
// ==========================================

const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// ==========================================
// CACHE LOOKUP
// ==========================================

const getCachedCoin = async (coinId: string) => {
    const { data, error } = await supabaseAdmin
        .from("coin_details_cache")
        .select("payload, fetched_at")
        .eq("coin_id", coinId)
        .maybeSingle();

    if (error) {
        console.error(
            "[coin-details] Cache read error:",
            error,
        );

        return null;
    }

    if (!data) {
        return null;
    }

    const fetchedAt = new Date(data.fetched_at).getTime();
    const age = Date.now() - fetchedAt;

    return {
        coin: data.payload,
        age,
        isFresh: age < CACHE_TTL,
    };
};

// ==========================================
// SAVE TO CACHE
// ==========================================

const saveCoinToCache = async (
    coinId: string,
    coin: unknown,
) => {
    const { error } = await supabaseAdmin
        .from("coin_details_cache")
        .upsert(
            {
                coin_id: coinId,
                payload: coin,
                fetched_at: new Date().toISOString(),
            },
            {
                onConflict: "coin_id",
            },
        );

    if (error) {
        console.error(
            "[coin-details] Cache write error:",
            error,
        );
    }
};

// ==========================================
// COINGECKO REQUEST
// ==========================================

const fetchCoinFromCoinGecko = async (
    coinId: string,
    apiKey: string,
) => {
    const headers = {
        accept: "application/json",
        "x-cg-demo-api-key": apiKey,
    };

    const url = new URL(
        `${BASE_URL}/coins/${encodeURIComponent(coinId)}`,
    );

    url.searchParams.set("localization", "false");
    url.searchParams.set("tickers", "false");
    url.searchParams.set("market_data", "true");
    url.searchParams.set("community_data", "false");
    url.searchParams.set("developer_data", "false");
    url.searchParams.set("sparkline", "false");

    const response = await fetch(url.toString(), {
        headers,
    });

    if (response.status === 429) {
        throw new Error("COINGECKO_RATE_LIMIT");
    }

    if (!response.ok) {
        throw new Error(
            `CoinGecko request failed: ${response.status} ${response.statusText}`,
        );
    }

    return await response.json();
};

// ==========================================
// EDGE FUNCTION
// ==========================================

serve(async (req) => {
    // ==========================================
    // CORS
    // ==========================================

    if (req.method === "OPTIONS") {
        return new Response("ok", {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        });
    }

    try {
        // ==========================================
        // REQUEST
        // ==========================================

        const { id } = await req.json();

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Coin ID is required.",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const coinId = String(id)
            .trim()
            .toLowerCase();

        // ==========================================
        // API KEY
        // ==========================================

        const apiKey = Deno.env.get(
            "COINGECKO_API_KEY",
        );

        if (!apiKey) {
            throw new Error(
                "COINGECKO_API_KEY is not configured.",
            );
        }

        // ==========================================
        // CHECK POSTGRES CACHE
        // ==========================================

        const cached = await getCachedCoin(coinId);

        if (cached?.isFresh) {
            console.log(
                `[coin-details] CACHE HIT: ${coinId}`,
            );

            return new Response(
                JSON.stringify({
                    success: true,
                    coin: cached.coin,
                    cached: true,
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // ==========================================
        // FETCH COINGECKO
        // ==========================================

        try {
            console.log(
                `[coin-details] COINGECKO FETCH: ${coinId}`,
            );

            const coin = await fetchCoinFromCoinGecko(
                coinId,
                apiKey,
            );

            // ==========================================
            // SAVE FRESH DATA
            // ==========================================

            await saveCoinToCache(
                coinId,
                coin,
            );

            return new Response(
                JSON.stringify({
                    success: true,
                    coin,
                    cached: false,
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        } catch (error) {
            // ==========================================
            // RATE LIMIT FALLBACK
            // ==========================================

            if (
                error instanceof Error &&
                error.message ===
                    "COINGECKO_RATE_LIMIT"
            ) {
                if (cached) {
                    console.warn(
                        `[coin-details] RATE LIMITED — returning stale cache: ${coinId}`,
                    );

                    return new Response(
                        JSON.stringify({
                            success: true,
                            coin: cached.coin,
                            cached: true,
                            stale: true,
                        }),
                        {
                            status: 200,
                            headers: {
                                ...corsHeaders,
                                "Content-Type": "application/json",
                            },
                        },
                    );
                }

                throw error;
            }

            throw error;
        }
    } catch (error) {
        console.error(
            "[coin-details]",
            error,
        );

        const isRateLimited = error instanceof Error &&
            error.message ===
                "COINGECKO_RATE_LIMIT";

        return new Response(
            JSON.stringify({
                success: false,
                message: isRateLimited
                    ? "CoinGecko rate limit reached. Please try again shortly."
                    : error instanceof Error
                    ? error.message
                    : "Failed to fetch coin details.",
            }),
            {
                status: isRateLimited ? 429 : 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            },
        );
    }
});
