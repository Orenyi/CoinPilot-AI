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

    // Read request body from Supabase invoke()
    const {
      search = "",
      category = "",
      sort = "market_cap_desc",
      page = 1,
      perPage = 50,
      ids = [],
    } = req.method === "POST" ? await req.json() : {};

    const marketUrl = new URL(`${BASE_URL}/coins/markets`);

    marketUrl.searchParams.set("vs_currency", "usd");
    marketUrl.searchParams.set("sparkline", "true");
    marketUrl.searchParams.set("price_change_percentage", "24h");

    if (ids.length) {
      marketUrl.searchParams.set("ids", ids.join(","));
    } else {
      marketUrl.searchParams.set("order", sort);
      marketUrl.searchParams.set("page", page.toString());
      marketUrl.searchParams.set("per_page", perPage.toString());

      if (category && category !== "all") {
        marketUrl.searchParams.set("category", category);
      }
    }

    if (category && category !== "all") {
      marketUrl.searchParams.set("category", category);
    }

    // Search every coin in CoinGecko
    if (search) {
      const searchResponse = await fetch(
        `${BASE_URL}/search?query=${encodeURIComponent(search)}`,
        { headers },
      );

      const searchData = await searchResponse.json();

      const ids = searchData.coins
        ?.slice(0, 50)
        .map((coin: any) => coin.id)
        .join(",");

      if (ids) {
        marketUrl.searchParams.delete("order");
        marketUrl.searchParams.delete("page");
        marketUrl.searchParams.delete("per_page");

        marketUrl.searchParams.set("ids", ids);
      }
    }

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

      fetch(marketUrl.toString(), {
        headers,
      }),

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
    let coins = await marketResponse.json();
    const totalCoins = global.data.active_cryptocurrencies;

    const totalPages = Math.ceil(
      totalCoins / Number(perPage),
    );

    if (search) {
      const query = search.toLowerCase();

      coins = coins.filter((coin: any) => {
        return (
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
        );
      });
    }
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

        pagination: {
          page: Number(page),
          perPage: Number(perPage),
          totalCoins,
          totalPages,
        },
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
