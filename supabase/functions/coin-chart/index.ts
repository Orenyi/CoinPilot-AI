import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
    // ==========================================
    // CORS PREFLIGHT
    // ==========================================

    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    try {
        // ==========================================
        // REQUEST BODY
        // ==========================================

        const {
            id,
            currency = "usd",
            days = "1",
            type = "market",
        } = await req.json();

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Coin ID is required.",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // ==========================================
        // API KEY
        // ==========================================

        const apiKey = Deno.env.get("COINGECKO_API_KEY");

        if (!apiKey) {
            throw new Error("COINGECKO_API_KEY is not configured.");
        }

        // ==========================================
        // COINGECKO HEADERS
        // ==========================================

        const headers = {
            accept: "application/json",
            "x-cg-demo-api-key": apiKey,
        };

        // ==========================================
        // TECHNICAL ANALYSIS REQUEST
        //
        // One historical market-chart request is used
        // for all technical indicators.
        //
        // RSI
        // MACD
        // 50D SMA
        // Volatility
        //
        // The result is cached as one payload.
        // ==========================================

        if (type === "technical-analysis") {
            const technicalDays = "365";

            const technicalCacheKey =
                `v2:${id}:${currency}:${technicalDays}:technical-analysis`;

            // ==========================================
            // CHECK CACHE
            // ==========================================

            const { data: technicalCached, error: technicalCacheError } =
                await supabase
                    .from("coin_chart_cache")
                    .select("payload, expires_at")
                    .eq("cache_key", technicalCacheKey)
                    .maybeSingle();

            if (technicalCacheError) {
                console.error(
                    "[coin-chart] Technical cache read error:",
                    technicalCacheError,
                );
            }

            // ==========================================
            // RETURN FRESH CACHE
            // ==========================================

            if (
                technicalCached &&
                new Date(technicalCached.expires_at).getTime() > Date.now()
            ) {
                return new Response(
                    JSON.stringify({
                        success: true,
                        source: "cache",
                        data: technicalCached.payload,
                    }),
                    {
                        status: 200,
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    },
                );
            }

            // ==========================================
            // FETCH HISTORICAL MARKET DATA
            // ==========================================

            const technicalUrl = new URL(
                `${COINGECKO_BASE_URL}/coins/${
                    encodeURIComponent(id)
                }/market_chart`,
            );

            technicalUrl.searchParams.set("vs_currency", currency);
            technicalUrl.searchParams.set("days", technicalDays);

            const technicalResponse = await fetch(
                technicalUrl.toString(),
                {
                    headers,
                },
            );

            // ==========================================
            // API FAILURE
            // ==========================================

            if (!technicalResponse.ok) {
                if (technicalCached?.payload) {
                    return new Response(
                        JSON.stringify({
                            success: true,
                            source: "stale-cache",
                            data: technicalCached.payload,
                        }),
                        {
                            status: 200,
                            headers: {
                                ...corsHeaders,
                                "Content-Type": "application/json",
                            },
                        },
                    );
                }

                throw new Error(
                    `CoinGecko technical analysis request failed: ${technicalResponse.status} ${technicalResponse.statusText}`,
                );
            }

            const marketData = await technicalResponse.json();

            // ==========================================
            // NORMALIZE PRICES
            // ==========================================

            const prices = (marketData?.prices ?? [])
                .map(([timestamp, price]: [number, number]) => ({
                    time: timestamp,
                    close: Number(price),
                }))
                .filter(
                    (item) =>
                        Number.isFinite(item.time) &&
                        Number.isFinite(item.close),
                );

            if (prices.length < 50) {
                throw new Error(
                    "Not enough historical data to calculate technical analysis.",
                );
            }

            // ==========================================
            // RSI
            // ==========================================

            const rsiData = calculateRSI(prices, 14);

            const latestRSI = rsiData[rsiData.length - 1]?.value ?? null;

            // ==========================================
            // MACD
            // ==========================================

            const macdData = calculateMACD(
                prices,
                12,
                26,
                9,
            );

            const latestMACD = macdData[macdData.length - 1] ?? null;

            const macdValue = latestMACD?.macd ?? null;

            const signalValue = latestMACD?.signal ?? null;

            // ==========================================
            // 50-DAY MOVING AVERAGE
            // ==========================================

            const movingAverageData = calculateSMA(
                prices,
                50,
            );

            const latestMovingAverage =
                movingAverageData[movingAverageData.length - 1]?.value ??
                    null;

            const currentPrice = prices[prices.length - 1]?.close ?? null;

            const movingAverageStatus = currentPrice !== null &&
                    latestMovingAverage !== null
                ? currentPrice >= latestMovingAverage ? "Bullish" : "Bearish"
                : null;

            // ==========================================
            // VOLATILITY
            // ==========================================

            const priceValues = prices.map(
                (item) => item.close,
            );

            const returns = [];

            for (let i = 1; i < priceValues.length; i++) {
                const previous = priceValues[i - 1];
                const current = priceValues[i];

                if (
                    !Number.isFinite(previous) ||
                    !Number.isFinite(current) ||
                    previous === 0
                ) {
                    continue;
                }

                returns.push(
                    ((current - previous) / previous) * 100,
                );
            }

            const volatility = calculateStandardDeviation(returns);

            const volatilityLabel = getVolatilityLabel(volatility);

            // ==========================================
            // PREPARE TECHNICAL ANALYSIS RESPONSE
            // ==========================================

            const technicalData = {
                currentPrice,

                // ------------------------------------------
                // RSI
                // ------------------------------------------

                rsi: latestRSI,

                rsiValues: rsiData
                    .map((item) => item.value)
                    .filter((value) => Number.isFinite(value)),

                // ------------------------------------------
                // MACD
                // ------------------------------------------

                macd: macdValue,

                signal: signalValue,

                macdValues: macdData
                    .map((item) => item.macd)
                    .filter((value) => Number.isFinite(value)),

                signalValues: macdData
                    .map((item) => item.signal)
                    .filter((value) => Number.isFinite(value)),

                // ------------------------------------------
                // MOVING AVERAGE
                // ------------------------------------------

                movingAverage: latestMovingAverage,

                movingAverageStatus,

                movingAverageValues: movingAverageData
                    .map((item) => item.value)
                    .filter((value) => Number.isFinite(value)),

                // ------------------------------------------
                // VOLATILITY
                // ------------------------------------------

                volatility,

                volatilityLabel,

                // ------------------------------------------
                // PRICE SPARKLINE
                // ------------------------------------------

                priceValues,
            };

            // ==========================================
            // CACHE RESULT
            //
            // 20 minutes is enough for technical
            // analysis and dramatically reduces API calls.
            // ==========================================

            const expiresAt = new Date(
                Date.now() + 20 * 60 * 1000,
            ).toISOString();

            const { error: technicalCacheWriteError } = await supabase
                .from("coin_chart_cache")
                .upsert(
                    {
                        cache_key: technicalCacheKey,
                        coin_id: id,
                        currency,
                        days: technicalDays,
                        chart_type: type,
                        payload: technicalData,
                        expires_at: expiresAt,
                        updated_at: new Date().toISOString(),
                    },
                    {
                        onConflict: "cache_key",
                    },
                );

            if (technicalCacheWriteError) {
                console.error(
                    "[coin-chart] Technical cache write error:",
                    technicalCacheWriteError,
                );
            }

            // ==========================================
            // RESPONSE
            // ==========================================

            return new Response(
                JSON.stringify({
                    success: true,
                    source: "coingecko",
                    data: technicalData,
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // ==========================================
        // CACHE KEY
        // v2 prevents old OHLC-only cache from being
        // returned after this pipeline change.
        // ==========================================

        const cacheKey = `v2:${id}:${currency}:${days}:${type}`;

        // ==========================================
        // CHECK CACHE
        // ==========================================

        const { data: cached, error: cacheError } = await supabase
            .from("coin_chart_cache")
            .select("payload, expires_at")
            .eq("cache_key", cacheKey)
            .maybeSingle();

        if (cacheError) {
            console.error(
                "[coin-chart] Cache read error:",
                cacheError,
            );
        }

        if (
            cached &&
            new Date(cached.expires_at).getTime() > Date.now()
        ) {
            return new Response(
                JSON.stringify({
                    success: true,
                    source: "cache",
                    data: cached.payload,
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // ==========================================
        // OHLC REQUEST
        //
        // OHLC endpoint gives:
        // [timestamp, open, high, low, close]
        //
        // market_chart gives:
        // prices + total_volumes
        //
        // We combine them so every OHLC candle
        // receives real volume.
        // ==========================================

        if (type === "ohlc") {
            const ohlcUrl = new URL(
                `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(id)}/ohlc`,
            );

            ohlcUrl.searchParams.set("vs_currency", currency);
            ohlcUrl.searchParams.set("days", String(days));

            const marketUrl = new URL(
                `${COINGECKO_BASE_URL}/coins/${
                    encodeURIComponent(id)
                }/market_chart`,
            );

            marketUrl.searchParams.set("vs_currency", currency);
            marketUrl.searchParams.set("days", String(days));

            const [ohlcResponse, marketResponse] = await Promise.all([
                fetch(ohlcUrl.toString(), {
                    headers,
                }),

                fetch(marketUrl.toString(), {
                    headers,
                }),
            ]);

            // ==========================================
            // API FAILURE
            // ==========================================

            if (!ohlcResponse.ok || !marketResponse.ok) {
                if (cached?.payload) {
                    return new Response(
                        JSON.stringify({
                            success: true,
                            source: "stale-cache",
                            data: cached.payload,
                        }),
                        {
                            status: 200,
                            headers: {
                                ...corsHeaders,
                                "Content-Type": "application/json",
                            },
                        },
                    );
                }

                const failedResponse = !ohlcResponse.ok
                    ? ohlcResponse
                    : marketResponse;

                throw new Error(
                    `CoinGecko request failed: ${failedResponse.status} ${failedResponse.statusText}`,
                );
            }

            const [ohlcData, marketData] = await Promise.all([
                ohlcResponse.json(),
                marketResponse.json(),
            ]);

            // ==========================================
            // REAL VOLUME DATA
            // ==========================================

            const volumes = marketData?.total_volumes ?? [];

            // ==========================================
            // MERGE OHLC + VOLUME
            // ==========================================

            const combinedData = (ohlcData ?? []).map(
                ([timestamp, open, high, low, close]: [
                    number,
                    number,
                    number,
                    number,
                    number,
                ]) => {
                    const nearestVolume = findNearestVolume(
                        timestamp,
                        volumes,
                    );

                    return [
                        timestamp,
                        open,
                        high,
                        low,
                        close,
                        nearestVolume,
                    ];
                },
            );

            const chartData = {
                ohlc: combinedData,
            };

            // ==========================================
            // SAVE CACHE
            // ==========================================

            const expiresAt = new Date(
                Date.now() + 5 * 60 * 1000,
            ).toISOString();

            const { error: cacheWriteError } = await supabase
                .from("coin_chart_cache")
                .upsert(
                    {
                        cache_key: cacheKey,
                        coin_id: id,
                        currency,
                        days: String(days),
                        chart_type: type,
                        payload: chartData,
                        expires_at: expiresAt,
                        updated_at: new Date().toISOString(),
                    },
                    {
                        onConflict: "cache_key",
                    },
                );

            if (cacheWriteError) {
                console.error(
                    "[coin-chart] Cache write error:",
                    cacheWriteError,
                );
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    source: "coingecko",
                    data: chartData,
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // ==========================================
        // MARKET CHART REQUEST
        // Used by line / area charts.
        // ==========================================

        const marketUrl = new URL(
            `${COINGECKO_BASE_URL}/coins/${
                encodeURIComponent(id)
            }/market_chart`,
        );

        marketUrl.searchParams.set("vs_currency", currency);
        marketUrl.searchParams.set("days", String(days));

        const response = await fetch(
            marketUrl.toString(),
            {
                headers,
            },
        );

        // ==========================================
        // MARKET API FAILURE
        // ==========================================

        if (!response.ok) {
            if (cached?.payload) {
                return new Response(
                    JSON.stringify({
                        success: true,
                        source: "stale-cache",
                        data: cached.payload,
                    }),
                    {
                        status: 200,
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    },
                );
            }

            throw new Error(
                `CoinGecko request failed: ${response.status} ${response.statusText}`,
            );
        }

        const chartData = await response.json();

        // ==========================================
        // SAVE CACHE
        // ==========================================

        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000,
        ).toISOString();

        const { error: cacheWriteError } = await supabase
            .from("coin_chart_cache")
            .upsert(
                {
                    cache_key: cacheKey,
                    coin_id: id,
                    currency,
                    days: String(days),
                    chart_type: type,
                    payload: chartData,
                    expires_at: expiresAt,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "cache_key",
                },
            );

        if (cacheWriteError) {
            console.error(
                "[coin-chart] Cache write error:",
                cacheWriteError,
            );
        }

        // ==========================================
        // RESPONSE
        // ==========================================

        return new Response(
            JSON.stringify({
                success: true,
                source: "coingecko",
                data: chartData,
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            },
        );
    } catch (error) {
        console.error(
            "[coin-chart] Error:",
            error,
        );

        return new Response(
            JSON.stringify({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Failed to load chart data.",
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

// ==========================================
// STANDARD DEVIATION
// ==========================================

function calculateStandardDeviation(
    values: number[],
) {
    if (!values.length) {
        return 0;
    }

    const mean = values.reduce(
        (sum, value) => sum + value,
        0,
    ) / values.length;

    const variance = values.reduce(
        (sum, value) => sum + Math.pow(value - mean, 2),
        0,
    ) / values.length;

    return Math.sqrt(variance);
}

// ==========================================
// RSI
// ==========================================

function calculateRSI(
    data: { time: number; close: number }[],
    period = 14,
) {
    if (data.length <= period) {
        return [];
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const change = data[i].close -
            data[i - 1].close;

        if (change >= 0) {
            gains += change;
        } else {
            losses += Math.abs(change);
        }
    }

    let averageGain = gains / period;
    let averageLoss = losses / period;

    const result: {
        time: number;
        value: number;
    }[] = [];

    for (
        let i = period + 1;
        i < data.length;
        i++
    ) {
        const change = data[i].close -
            data[i - 1].close;

        const gain = Math.max(change, 0);
        const loss = Math.max(-change, 0);

        averageGain = (averageGain * (period - 1) +
            gain) /
            period;

        averageLoss = (averageLoss * (period - 1) +
            loss) /
            period;

        const rsi = averageLoss === 0 ? 100 : 100 -
            100 /
                (1 +
                    averageGain /
                        averageLoss);

        result.push({
            time: data[i].time,
            value: rsi,
        });
    }

    return result;
}

// ==========================================
// SMA
// ==========================================

function calculateSMA(
    data: { time: number; close: number }[],
    period = 50,
) {
    if (data.length < period) {
        return [];
    }

    const result: {
        time: number;
        value: number;
    }[] = [];

    for (
        let i = period - 1;
        i < data.length;
        i++
    ) {
        let sum = 0;

        for (
            let j = i - period + 1;
            j <= i;
            j++
        ) {
            sum += data[j].close;
        }

        result.push({
            time: data[i].time,
            value: sum / period,
        });
    }

    return result;
}

// ==========================================
// EMA
// ==========================================

function calculateEMA(
    data: { time: number; close: number }[],
    period: number,
) {
    if (data.length < period) {
        return [];
    }

    const multiplier = 2 / (period + 1);

    const firstSlice = data.slice(0, period);

    let previous = firstSlice.reduce(
        (sum, item) => sum + item.close,
        0,
    ) / period;

    const result: {
        time: number;
        value: number;
    }[] = [
        {
            time: data[period - 1].time,
            value: previous,
        },
    ];

    for (
        let i = period;
        i < data.length;
        i++
    ) {
        const current = (data[i].close - previous) *
                multiplier +
            previous;

        previous = current;

        result.push({
            time: data[i].time,
            value: current,
        });
    }

    return result;
}

// ==========================================
// MACD
// ==========================================

function calculateMACD(
    data: { time: number; close: number }[],
    fastPeriod = 12,
    slowPeriod = 26,
    signalPeriod = 9,
) {
    if (
        data.length <
            slowPeriod + signalPeriod
    ) {
        return [];
    }

    const fastEMA = calculateEMA(
        data,
        fastPeriod,
    );

    const slowEMA = calculateEMA(
        data,
        slowPeriod,
    );

    const fastMap = new Map(
        fastEMA.map((item) => [
            item.time,
            item.value,
        ]),
    );

    const slowMap = new Map(
        slowEMA.map((item) => [
            item.time,
            item.value,
        ]),
    );

    const macd: {
        time: number;
        value: number;
    }[] = [];

    for (const item of data) {
        const fast = fastMap.get(item.time);

        const slow = slowMap.get(item.time);

        if (
            fast === undefined ||
            slow === undefined
        ) {
            continue;
        }

        macd.push({
            time: item.time,
            value: fast - slow,
        });
    }

    if (macd.length < signalPeriod) {
        return [];
    }

    const multiplier = 2 / (signalPeriod + 1);

    let previous = macd
        .slice(0, signalPeriod)
        .reduce(
            (sum, item) => sum + item.value,
            0,
        ) / signalPeriod;

    const signalValues: {
        time: number;
        value: number;
    }[] = [
        {
            time: macd[
                signalPeriod - 1
            ].time,
            value: previous,
        },
    ];

    for (
        let i = signalPeriod;
        i < macd.length;
        i++
    ) {
        previous = (macd[i].value - previous) *
                multiplier +
            previous;

        signalValues.push({
            time: macd[i].time,
            value: previous,
        });
    }

    const signalMap = new Map(
        signalValues.map((item) => [
            item.time,
            item.value,
        ]),
    );

    return macd
        .filter((item) => signalMap.has(item.time))
        .map((item) => ({
            time: item.time,
            macd: item.value,
            signal: signalMap.get(item.time)!,
            histogram: item.value -
                signalMap.get(item.time)!,
        }));
}

// ==========================================
// VOLATILITY LABEL
// ==========================================

function getVolatilityLabel(
    volatility: number,
) {
    if (volatility < 2) {
        return "Low";
    }

    if (volatility < 5) {
        return "Moderate";
    }

    if (volatility < 8) {
        return "High";
    }

    return "Very High";
}

// ==========================================
// FIND CLOSEST VOLUME POINT
// ==========================================

function findNearestVolume(
    timestamp: number,
    volumes: [number, number][],
) {
    if (!volumes.length) return 0;

    let closest = volumes[0];
    let smallestDifference = Math.abs(timestamp - closest[0]);

    for (let i = 1; i < volumes.length; i++) {
        const current = volumes[i];

        const difference = Math.abs(
            timestamp - current[0],
        );

        if (difference < smallestDifference) {
            closest = current;
            smallestDifference = difference;
        }
    }

    return Number(closest[1] ?? 0);
}
