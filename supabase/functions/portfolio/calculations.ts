import { CoinMarket } from "./coingecko.ts";
import { PortfolioAsset } from "./types.ts";

function round(value: number, decimals = 2): number {
    return Number(value.toFixed(decimals));
}

export interface PortfolioAssetSummary extends PortfolioAsset, CoinMarket {
    current_value: number;

    invested_value: number;

    profit_loss: number;

    profit_loss_percentage: number;

    allocation_percentage: number;
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

export function calculateAsset(
    asset: PortfolioAsset,
    market: CoinMarket,
): PortfolioAssetSummary {
    const investedValue = round(
        asset.quantity * asset.buy_price,
    );

    const currentValue = round(
        asset.quantity * market.current_price,
    );

    const profitLoss = round(
        currentValue - investedValue,
    );

    const profitPercentage = investedValue === 0 ? 0 : round(
        (profitLoss / investedValue) * 100,
    );

    return {
        ...asset,
        ...market,

        invested_value: investedValue,

        current_value: currentValue,

        profit_loss: profitLoss,

        profit_loss_percentage: profitPercentage,

        allocation_percentage: 0,
    };
}

export function calculatePortfolio(
    assets: PortfolioAsset[],
    markets: Map<string, CoinMarket>,
): PortfolioSummary {
    const summaries = assets.map((asset) => {
        const market = markets.get(asset.coin_id);

        if (!market) {
            throw new Error(
                `Market data missing for ${asset.coin_id}`,
            );
        }

        return calculateAsset(asset, market);
    });

    const portfolioValue = summaries.reduce(
        (sum, asset) => sum + asset.current_value,
        0,
    );

    const investedValue = summaries.reduce(
        (sum, asset) => sum + asset.invested_value,
        0,
    );

    summaries.forEach((asset) => {
        asset.allocation_percentage = portfolioValue === 0
            ? 0
            : (asset.current_value / portfolioValue) * 100;
    });

    const profit = portfolioValue - investedValue;

    const profitPercentage = investedValue === 0
        ? 0
        : (profit / investedValue) * 100;

    // -----------------------------
    // Portfolio Insights
    // -----------------------------

    const largestHolding = summaries.length > 0
        ? summaries.reduce((largest, current) =>
            current.current_value > largest.current_value ? current : largest
        )
        : null;

    const concentrationPercentage = largestHolding && portfolioValue > 0
        ? (largestHolding.current_value / portfolioValue) * 100
        : 0;

    let diversificationScore = 100;

    // Penalize portfolios with very few assets
    if (summaries.length === 1) {
        diversificationScore -= 40;
    } else if (summaries.length === 2) {
        diversificationScore -= 25;
    } else if (summaries.length === 3) {
        diversificationScore -= 10;
    }

    // Penalize concentration
    if (concentrationPercentage > 70) {
        diversificationScore -= 40;
    } else if (concentrationPercentage > 50) {
        diversificationScore -= 25;
    } else if (concentrationPercentage > 35) {
        diversificationScore -= 10;
    }

    // Clamp score between 0 and 100
    diversificationScore = Math.max(
        0,
        Math.min(100, diversificationScore),
    );

    const bestPerformer = summaries.length > 0
        ? summaries.reduce((best, current) =>
            current.profit_loss_percentage >
                    best.profit_loss_percentage
                ? current
                : best
        )
        : null;

    const worstPerformer = summaries.length > 0
        ? summaries.reduce((worst, current) =>
            current.profit_loss_percentage <
                    worst.profit_loss_percentage
                ? current
                : worst
        )
        : null;

    const topGainer24h = summaries.length > 0
        ? summaries.reduce((best, current) =>
            current.price_change_percentage_24h >
                    best.price_change_percentage_24h
                ? current
                : best
        )
        : null;

    const topLoser24h = summaries.length > 0
        ? summaries.reduce((worst, current) =>
            current.price_change_percentage_24h <
                    worst.price_change_percentage_24h
                ? current
                : worst
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
