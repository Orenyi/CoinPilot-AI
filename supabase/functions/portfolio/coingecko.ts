const BASE_URL = "https://api.coingecko.com/api/v3";

function getHeaders() {
    const apiKey = Deno.env.get("COINGECKO_API_KEY");

    return {
        accept: "application/json",
        "x-cg-demo-api-key": apiKey ?? "",
    };
}

async function fetchCoinGecko<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(
            `CoinGecko request failed: ${response.status} ${response.statusText}`,
        );
    }

    return await response.json() as T;
}

export interface CoinMarket {
    id: string;
    symbol: string;
    name: string;
    image: string;

    current_price: number;
    market_cap: number;
    market_cap_rank: number;

    total_volume: number;

    price_change_percentage_24h: number;
}

export async function getCoinsByIds(
    ids: string[],
    currency = "usd",
): Promise<CoinMarket[]> {
    if (ids.length === 0) {
        return [];
    }

    const endpoint = `/coins/markets?vs_currency=${currency}` +
        `&ids=${ids.join(",")}` +
        `&price_change_percentage=24h`;

    return await fetchCoinGecko<CoinMarket[]>(endpoint);
}

export async function getCoinPrice(
    coinId: string,
    currency = "usd",
): Promise<number> {
    const coins = await getCoinsByIds([coinId], currency);

    if (coins.length === 0) {
        throw new Error("Coin not found.");
    }

    return coins[0].current_price;
}

export async function getPortfolioPrices(
    ids: string[],
    currency = "usd",
): Promise<Map<string, CoinMarket>> {
    const coins = await getCoinsByIds(ids, currency);

    return new Map(
        coins.map((coin) => [coin.id, coin]),
    );
}
