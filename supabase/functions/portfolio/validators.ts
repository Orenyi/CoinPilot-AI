import { PortfolioRequest } from "./types.ts";

const VALID_ACTIONS = [
    "add",
    "list",
    "update",
    "delete",
] as const;

const VALID_CURRENCIES = [
    "usd",
    "eur",
    "gbp",
    "ngn",
    "cad",
    "aud",
    "jpy",
    "inr",
    "cny",
] as const;

export function validateCurrency(
    currency?: string,
): string {
    if (!currency) {
        return "usd";
    }

    const normalized = currency.toLowerCase();

    if (!VALID_CURRENCIES.includes(normalized)) {
        throw new Error("Unsupported currency.");
    }

    return normalized;
}

export function validateRequest(body: unknown): PortfolioRequest {
    if (!body || typeof body !== "object") {
        throw new Error("Request body is required.");
    }

    const request = body as PortfolioRequest;

    if (!request.action) {
        throw new Error("Action is required.");
    }

    if (!VALID_ACTIONS.includes(request.action)) {
        throw new Error(`Invalid action: ${request.action}`);
    }

    return request;
}

function validateAssetFields(data: PortfolioRequest): void {
    if (!data.coinId) {
        throw new Error("Coin is required.");
    }

    if (!data.quantity || Number(data.quantity) <= 0) {
        throw new Error("Quantity must be greater than zero.");
    }

    if (!data.buyPrice || Number(data.buyPrice) <= 0) {
        throw new Error("Buy price must be greater than zero.");
    }

    if (!data.buyDate) {
        throw new Error("Buy date is required.");
    }
}

export function validateAddAsset(
    data: PortfolioRequest,
): void {
    validateAssetFields(data);
}

export function validateUpdateAsset(
    data: PortfolioRequest,
): void {
    validateAssetId(data.assetId);

    validateAssetFields(data);
}

export function validateAssetId(
    assetId?: string,
): string {
    if (!assetId) {
        throw new Error("Asset ID is required.");
    }

    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(assetId)) {
        throw new Error("Invalid Asset ID.");
    }

    return assetId;
}
