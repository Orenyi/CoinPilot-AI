import { PortfolioRequest } from "./types.ts";
import { validateAddAsset, validateUpdateAsset } from "./validators.ts";
import {
    getCurrentExchangeRates,
    getHistoricalFxRateToUsd,
    getPortfolioPrices,
} from "./coingecko.ts";
import { calculatePortfolio } from "./calculations.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../../../src/types/database.types.ts";

type PortfolioAssetInsert =
    Database["public"]["Tables"]["portfolio_assets"]["Insert"];

type PortfolioAssetUpdate =
    Database["public"]["Tables"]["portfolio_assets"]["Update"];

// -----------------------------
// Add Portfolio Asset
// -----------------------------

export async function addAsset(
    supabase: SupabaseClient<Database>,
    userId: string,
    body: PortfolioRequest,
) {
    validateAddAsset(body);
    const buyCurrency = (body.buyCurrency ?? "usd").toLowerCase();

    const buyFxRateToUsd = await getHistoricalFxRateToUsd(
        buyCurrency,
        body.buyDate!,
    );

    const asset: PortfolioAssetInsert = {
        user_id: userId,
        coin_id: body.coinId!,
        quantity: body.quantity!,
        buy_price: body.buyPrice!,
        buy_currency: buyCurrency,
        buy_fx_rate_to_usd: buyFxRateToUsd,
        buy_date: body.buyDate!,
    };

    const { data, error } = await supabase
        .from("portfolio_assets")
        .insert(asset)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

// -----------------------------
// List Portfolio Assets
// -----------------------------

export async function listAssets(
    supabase: SupabaseClient<Database>,
    userId: string,
    currency = "usd",
) {
    // -----------------------------
    // Fetch Portfolio Assets
    // -----------------------------

    const { data: assets, error } = await supabase
        .from("portfolio_assets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    // -----------------------------
    // Empty Portfolio
    // -----------------------------

    if (!assets || assets.length === 0) {
        return {
            portfolio_value: 0,
            invested_value: 0,
            total_profit_loss: 0,
            total_profit_loss_percentage: 0,

            asset_count: 0,

            largest_holding: null,

            best_performer: null,

            worst_performer: null,

            top_gainer_24h: null,

            top_loser_24h: null,

            concentration_percentage: 0,

            diversification_score: 100,

            assets: [],
        };
    }

    // -----------------------------
    // Collect Coin IDs
    // -----------------------------

    const coinIds = [
        ...new Set(
            assets.map((asset) => asset.coin_id),
        ),
    ];

    // -----------------------------
    // Fetch Live Prices
    // -----------------------------

    const marketData = await getPortfolioPrices(
        coinIds,
        currency,
    );

    const exchangeRates = await getCurrentExchangeRates();

    // -----------------------------
    // Calculate Portfolio
    // -----------------------------

    return calculatePortfolio(
        assets,
        marketData,
        currency,
        exchangeRates,
    );
}

// -----------------------------
// Update Portfolio Asset
// -----------------------------

export async function updateAsset(
    supabase: SupabaseClient<Database>,
    userId: string,
    body: PortfolioRequest,
) {
    validateUpdateAsset(body);

    const buyCurrency = (
        body.buyCurrency ?? "usd"
    ).toLowerCase();

    const buyFxRateToUsd = await getHistoricalFxRateToUsd(
        buyCurrency,
        body.buyDate!,
    );

    const updates: PortfolioAssetUpdate = {
        coin_id: body.coinId!,
        quantity: body.quantity!,
        buy_price: body.buyPrice!,
        buy_currency: buyCurrency,
        buy_fx_rate_to_usd: buyFxRateToUsd,
        buy_date: body.buyDate!,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("portfolio_assets")
        .update(updates)
        .eq("id", body.assetId!)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error("Portfolio asset not found.");
    }

    return data;
}

// -----------------------------
// Delete Portfolio Asset
// -----------------------------

export async function deleteAsset(
    supabase: SupabaseClient<Database>,
    userId: string,
    assetId: string,
) {
    if (!assetId) {
        throw new Error("Asset ID is required.");
    }

    const { data, error } = await supabase
        .from("portfolio_assets")
        .delete()
        .eq("id", assetId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error("Portfolio asset not found.");
    }

    return data;
}
