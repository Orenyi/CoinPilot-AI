export interface PortfolioAsset {
    id?: string;

    user_id: string;

    coin_id: string;

    quantity: number;

    buy_price: number;

    buy_date: string;

    created_at?: string;

    updated_at?: string;
}

export interface PortfolioRequest {
    action: "add" | "list" | "update" | "delete";

    currency?: string;

    assetId?: string;

    coinId?: string;

    quantity?: number;

    buyPrice?: number;

    buyDate?: string;
}
