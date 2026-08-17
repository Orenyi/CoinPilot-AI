import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
    // ==========================================
    // CORS PREFLIGHT
    // ==========================================

    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    try {
        // ==========================================
        // REQUEST BODY
        // ==========================================

        const {
            id,
            currency = "usd",
            days = "1",
            type = "market",
        } = await req.json();

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
        // CACHE KEY
        // ==========================================

        const cacheKey = `${id}:${currency}:${days}:${type}`;

        // ==========================================
        // CHECK CACHE
        // ==========================================

        const { data: cached, error: cacheError } = await supabase
            .from("coin_chart_cache")
            .select(
                "payload, expires_at",
            )
            .eq(
                "cache_key",
                cacheKey,
            )
            .maybeSingle();

        if (cacheError) {
            console.error(
                "[coin-chart] Cache read error:",
                cacheError,
            );
        }

        if (
            cached &&
            new Date(cached.expires_at).getTime() >
                Date.now()
        ) {
            return new Response(
                JSON.stringify({
                    success: true,
                    source: "cache",
                    data: cached.payload,
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
        // COINGECKO ENDPOINT
        // ==========================================

        const endpoint = type === "ohlc"
            ? `${COINGECKO_BASE_URL}/coins/${
                encodeURIComponent(
                    id,
                )
            }/ohlc`
            : `${COINGECKO_BASE_URL}/coins/${
                encodeURIComponent(
                    id,
                )
            }/market_chart`;

        const url = new URL(endpoint);

        url.searchParams.set(
            "vs_currency",
            currency,
        );

        url.searchParams.set(
            "days",
            days,
        );

        // ==========================================
        // COINGECKO REQUEST
        // ==========================================

        const response = await fetch(
            url.toString(),
            {
                headers: {
                    accept: "application/json",
                    "x-cg-demo-api-key": apiKey,
                },
            },
        );

        if (!response.ok) {
            // Return stale cache if available
            if (cached?.payload) {
                return new Response(
                    JSON.stringify({
                        success: true,
                        source: "stale-cache",
                        data: cached.payload,
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

            throw new Error(
                `CoinGecko request failed: ${response.status} ${response.statusText}`,
            );
        }

        const chartData = await response.json();

        // ==========================================
        // SAVE CACHE
        // ==========================================

        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000,
        ).toISOString();

        const { error: cacheWriteError } = await supabase
            .from("coin_chart_cache")
            .upsert(
                {
                    cache_key: cacheKey,
                    coin_id: id,
                    currency,
                    days: String(days),
                    chart_type: type,
                    payload: chartData,
                    expires_at: expiresAt,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "cache_key",
                },
            );

        if (cacheWriteError) {
            console.error(
                "[coin-chart] Cache write error:",
                cacheWriteError,
            );
        }

        // ==========================================
        // RESPONSE
        // ==========================================

        return new Response(
            JSON.stringify({
                success: true,
                source: "coingecko",
                data: chartData,
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
        console.error(
            "[coin-chart] Error:",
            error,
        );

        return new Response(
            JSON.stringify({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Failed to load chart data.",
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            },
        );
    }
});
