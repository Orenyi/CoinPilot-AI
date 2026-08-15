import { CoinMarket } from "./coingecko.ts";
import { PortfolioAsset } from "./types.ts";

function round(value: number, decimals = 2): number {
    return Number(value.toFixed(decimals));
}

export type ExchangeRates = Record<string, number>;

export interface PortfolioAssetSummary extends PortfolioAsset, CoinMarket {
    current_value: number;
    invested_value: number;
    profit_loss: number;
    profit_loss_percentage: number;
    allocation_percentage: number;

    buy_currency: string;
    converted_buy_price: number;
}

export interface PortfolioSummary {
    portfolio_value: number;
    invested_value: number;
    total_profit_loss: number;
    total_profit_loss_percentage: number;

    asset_count: number;

    largest_holding: PortfolioAssetSummary | null;
    best_performer: PortfolioAssetSummary | null;
    worst_performer: PortfolioAssetSummary | null;

    top_gainer_24h: PortfolioAssetSummary | null;
    top_loser_24h: PortfolioAssetSummary | null;

    diversification_score: number;
    concentration_percentage: number;

    assets: PortfolioAssetSummary[];
}

/**
 * Convert an amount using rates expressed as:
 *
 * USD = 1
 * NGN = 1500
 * EUR = 0.86
 *
 * Example:
 *
 * USD -> NGN
 * 100 * 1500 = 150,000
 *
 * NGN -> USD
 * 150,000 / 1500 = 100
 */
export function convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    exchangeRates: ExchangeRates,
): number {
    const from = fromCurrency.toLowerCase();
    const to = toCurrency.toLowerCase();

    if (from === to) {
        return amount;
    }

    const fromRate = exchangeRates[from];
    const toRate = exchangeRates[to];

    if (!fromRate || fromRate <= 0) {
        throw new Error(
            `Exchange rate missing for ${fromCurrency}.`,
        );
    }

    if (!toRate || toRate <= 0) {
        throw new Error(
            `Exchange rate missing for ${toCurrency}.`,
        );
    }

    // Convert source currency -> USD
    const usdValue = amount / fromRate;

    // Convert USD -> target currency
    return usdValue * toRate;
}

/**
 * Calculate a single portfolio asset.
 *
 * IMPORTANT:
 * buy_fx_rate_to_usd is the FX rate that existed
 * on the original purchase date.
 *
 * Example:
 *
 * USD = 1
 * NGN = 1500
 *
 * $30,000 BTC:
 * 30,000 / 1 = $30,000
 *
 * ₦45,000,000 BTC:
 * 45,000,000 / 1500 = $30,000
 */
export function calculateAsset(
    asset: PortfolioAsset,
    market: CoinMarket,
    portfolioCurrency: string,
    currentExchangeRates: ExchangeRates,
): PortfolioAssetSummary {
    const buyCurrency = (
        asset.buy_currency ?? "usd"
    ).toLowerCase();

    const historicalBuyFxRate = asset.buy_fx_rate_to_usd;

    if (buyCurrency === "usd") {
        // USD is always 1 USD = 1 USD.
    } else if (
        !historicalBuyFxRate ||
        historicalBuyFxRate <= 0
    ) {
        throw new Error(
            `Historical FX rate missing for ${asset.coin_id} purchased in ${buyCurrency.toUpperCase()} on ${asset.buy_date}.`,
        );
    }

    /**
     * Step 1:
     * Convert the original purchase price into USD
     * using the FX rate from the purchase date.
     *
     * This prevents today's FX rate from changing
     * the original investment amount.
     */
    const historicalUsdBuyPrice = buyCurrency === "usd"
        ? asset.buy_price
        : asset.buy_price / historicalBuyFxRate;

    /**
     * Step 2:
     * Convert the historical USD purchase price
     * into the currently selected portfolio currency.
     *
     * Example:
     *
     * Original:
     * $30,000 BTC
     *
     * Display currency:
     * NGN
     *
     * The current USD/NGN rate is used only to
     * display the historical USD cost in NGN.
     */
    const convertedBuyPrice = round(
        convertCurrency(
            historicalUsdBuyPrice,
            "usd",
            portfolioCurrency,
            currentExchangeRates,
        ),
    );

    /**
     * Step 3:
     * Total amount invested in display currency.
     */
    const investedValue = round(
        asset.quantity * convertedBuyPrice,
    );

    /**
     * Step 4:
     * CoinGecko already returns the current coin
     * price in the selected portfolio currency.
     */
    const currentValue = round(
        asset.quantity * market.current_price,
    );

    /**
     * Step 5:
     * Profit / Loss.
     */
    const profitLoss = round(
        currentValue - investedValue,
    );

    const profitPercentage = investedValue === 0 ? 0 : round(
        (profitLoss / investedValue) * 100,
    );

    return {
        ...asset,
        ...market,

        buy_currency: buyCurrency,

        converted_buy_price: convertedBuyPrice,

        invested_value: investedValue,

        current_value: currentValue,

        profit_loss: profitLoss,

        profit_loss_percentage: profitPercentage,

        allocation_percentage: 0,
    };
}

/**
 * Calculate the entire portfolio.
 */
export function calculatePortfolio(
    assets: PortfolioAsset[],
    markets: Map<string, CoinMarket>,
    portfolioCurrency = "usd",
    currentExchangeRates: ExchangeRates = {},
): PortfolioSummary {
    const summaries = assets.map((asset) => {
        const market = markets.get(asset.coin_id);

        if (!market) {
            throw new Error(
                `Market data missing for ${asset.coin_id}`,
            );
        }

        return calculateAsset(
            asset,
            market,
            portfolioCurrency,
            currentExchangeRates,
        );
    });

    const portfolioValue = round(
        summaries.reduce(
            (sum, asset) => sum + asset.current_value,
            0,
        ),
    );

    const investedValue = round(
        summaries.reduce(
            (sum, asset) => sum + asset.invested_value,
            0,
        ),
    );

    /**
     * Allocation
     */
    summaries.forEach((asset) => {
        asset.allocation_percentage = portfolioValue === 0 ? 0 : round(
            (asset.current_value /
                portfolioValue) *
                100,
        );
    });

    const profit = round(
        portfolioValue - investedValue,
    );

    const profitPercentage = investedValue === 0 ? 0 : round(
        (profit / investedValue) * 100,
    );

    /**
     * Largest Holding
     */
    const largestHolding = summaries.length > 0
        ? summaries.reduce(
            (largest, current) =>
                current.current_value >
                        largest.current_value
                    ? current
                    : largest,
        )
        : null;

    const concentrationPercentage = largestHolding && portfolioValue > 0
        ? round(
            (largestHolding.current_value /
                portfolioValue) *
                100,
        )
        : 0;

    /**
     * Diversification Score
     */
    let diversificationScore = 100;

    if (summaries.length === 1) {
        diversificationScore -= 40;
    } else if (summaries.length === 2) {
        diversificationScore -= 25;
    } else if (summaries.length === 3) {
        diversificationScore -= 10;
    }

    if (concentrationPercentage > 70) {
        diversificationScore -= 40;
    } else if (concentrationPercentage > 50) {
        diversificationScore -= 25;
    } else if (concentrationPercentage > 35) {
        diversificationScore -= 10;
    }

    diversificationScore = Math.max(
        0,
        Math.min(100, diversificationScore),
    );

    /**
     * Best Performer
     */
    const bestPerformer = summaries.length > 0
        ? summaries.reduce(
            (best, current) =>
                current.profit_loss_percentage >
                        best.profit_loss_percentage
                    ? current
                    : best,
        )
        : null;

    /**
     * Worst Performer
     */
    const worstPerformer = summaries.length > 0
        ? summaries.reduce(
            (worst, current) =>
                current.profit_loss_percentage <
                        worst.profit_loss_percentage
                    ? current
                    : worst,
        )
        : null;

    /**
     * Top 24h Gainer
     */
    const topGainer24h = summaries.length > 0
        ? summaries.reduce(
            (best, current) =>
                current.price_change_percentage_24h >
                        best.price_change_percentage_24h
                    ? current
                    : best,
        )
        : null;

    /**
     * Top 24h Loser
     */
    const topLoser24h = summaries.length > 0
        ? summaries.reduce(
            (worst, current) =>
                current.price_change_percentage_24h <
                        worst.price_change_percentage_24h
                    ? current
                    : worst,
        )
        : null;

    return {
        portfolio_value: portfolioValue,

        invested_value: investedValue,

        total_profit_loss: profit,

        total_profit_loss_percentage: profitPercentage,

        asset_count: summaries.length,

        largest_holding: largestHolding,

        best_performer: bestPerformer,

        worst_performer: worstPerformer,

        top_gainer_24h: topGainer24h,

        top_loser_24h: topLoser24h,

        concentration_percentage: concentrationPercentage,

        diversification_score: diversificationScore,

        assets: summaries,
    };
}
