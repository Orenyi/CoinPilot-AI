import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const BASE_URL = "https://api.coingecko.com/api/v3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    try {
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

        const apiKey = Deno.env.get("COINGECKO_API_KEY");

        const headers = {
            accept: "application/json",
            "x-cg-demo-api-key": apiKey ?? "",
        };

        const url = new URL(`${BASE_URL}/coins/${encodeURIComponent(id)}`);

        url.searchParams.set("localization", "false");
        url.searchParams.set("tickers", "false");
        url.searchParams.set("market_data", "true");
        url.searchParams.set("community_data", "false");
        url.searchParams.set("developer_data", "false");
        url.searchParams.set("sparkline", "false");

        const response = await fetch(url.toString(), {
            headers,
        });

        if (!response.ok) {
            throw new Error(
                `CoinGecko request failed: ${response.status} ${response.statusText}`,
            );
        }

        const coin = await response.json();

        return new Response(
            JSON.stringify({
                success: true,
                coin,
            }),
            {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Failed to fetch coin details.",
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
