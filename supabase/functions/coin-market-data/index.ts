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

    // Fetch data from CoinGecko API(all categories)
    const [
      globalResponse,
      marketResponse,
      trendingResponse,
      categoriesResponse,
    ] = await Promise.all([
      fetch(`${BASE_URL}/global`, {
        headers,
      }),

      fetch(
        `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`,
        {
          headers,
        },
      ),

      fetch(`${BASE_URL}/search/trending`, {
        headers,
      }),

      fetch(`${BASE_URL}/coins/categories/list`, {
        headers,
      }),
    ]);

    if (
      !globalResponse.ok ||
      !marketResponse.ok ||
      !trendingResponse.ok ||
      !categoriesResponse.ok
    ) {
      throw new Error("Failed to fetch CoinGecko data.");
    }

    const global = await globalResponse.json();
    const coins = await marketResponse.json();
    const trending = await trendingResponse.json();
    const categories = await categoriesResponse.json();

    const normalizedCategories = categories
      .map((category: any) => ({
        id: category.category_id,
        name: category.name
          .replace("Decentralized Finance (DeFi)", "DeFi")
          .replace("Layer 1 (L1)", "Layer 1")
          .replace("Layer 2 (L2)", "Layer 2")
          .replace("Real World Assets (RWA)", "RWA")
          .replace("Non-Fungible Tokens (NFT)", "NFT")
          .trim(),
      }))
      .filter((category: any) => featuredCategories.includes(category.name))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

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
        categories: normalizedCategories,
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
