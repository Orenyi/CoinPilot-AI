import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const BASE_URL = "https://api.coingecko.com/api/v3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("COINGECKO_API_KEY");

    const headers = {
      accept: "application/json",
      "x-cg-demo-api-key": apiKey ?? "",
    };

    // Global Market
    const globalResponse = await fetch(`${BASE_URL}/global`, {
      headers,
    });

    // Top Coins
    const marketResponse = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`,
      { headers },
    );

    // Trending
    const trendingResponse = await fetch(
      `${BASE_URL}/search/trending`,
      { headers },
    );

    if (
      !globalResponse.ok ||
      !marketResponse.ok ||
      !trendingResponse.ok
    ) {
      throw new Error("Failed to fetch CoinGecko data.");
    }

    const global = await globalResponse.json();
    const coins = await marketResponse.json();
    const trending = await trendingResponse.json();

    const trendingIds = trending.coins
      .map((coin: any) => coin.item.id)
      .join(",");

    let trendingCoins: any[] = [];

    if (trendingIds) {
      const trendingMarketResponse = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=usd&ids=${trendingIds}&sparkline=true&price_change_percentage=24h`,
        { headers },
      );

      if (trendingMarketResponse.ok) {
        trendingCoins = await trendingMarketResponse.json();
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        global: global.data,
        coins,
        trending: trendingCoins,
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
          : "Unknown server error",
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
