import { Database, Tables, TablesInsert, TablesUpdate } from "./database.types";

export type PortfolioAsset = Tables<"portfolio_assets">;

export type PortfolioAssetInsert = TablesInsert<"portfolio_assets">;

export type PortfolioAssetUpdate = TablesUpdate<"portfolio_assets">;

export type Watchlist = Tables<"watchlist">;

export type WatchlistInsert = TablesInsert<"watchlist">;

export type WatchlistUpdate = TablesUpdate<"watchlist">;

export type { Database };
