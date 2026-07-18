import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { addAsset, deleteAsset, listAssets, updateAsset } from "./portfolio.ts";
import {
    validateAssetId,
    validateCurrency,
    validateRequest,
} from "./validators.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    try {
        // -----------------------------
        // Environment Variables
        // -----------------------------

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceRoleKey = Deno.env.get(
            "SUPABASE_SERVICE_ROLE_KEY",
        )!;

        // -----------------------------
        // Supabase Client
        // -----------------------------

        const supabase = createClient(
            supabaseUrl,
            supabaseServiceRoleKey,
            {
                global: {
                    headers: {
                        Authorization: req.headers.get("Authorization") ?? "",
                    },
                },
            },
        );

        // -----------------------------
        // Read Request Body
        // -----------------------------

        let rawBody;

        try {
            rawBody = await req.json();
        } catch {
            throw new Error("Invalid JSON payload.");
        }

        const body = validateRequest(rawBody);

        const { action } = body;

        // -----------------------------
        // Current User
        // -----------------------------

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Unauthorized",
                }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // -----------------------------
        // Action Router
        // -----------------------------

        switch (action) {
            case "add": {
                const asset = await addAsset(
                    supabase,
                    user.id,
                    body,
                );

                return new Response(
                    JSON.stringify({
                        success: true,
                        message: "Asset added successfully.",
                        asset,
                    }),
                    {
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    },
                );
            }

            case "list": {
                const portfolio = await listAssets(
                    supabase,
                    user.id,
                    validateCurrency(body.currency),
                );

                return new Response(
                    JSON.stringify({
                        success: true,
                        portfolio,
                    }),
                    {
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    },
                );
            }

            case "update": {
                const asset = await updateAsset(
                    supabase,
                    user.id,
                    body,
                );

                return new Response(
                    JSON.stringify({
                        success: true,
                        message: "Asset updated successfully.",
                        asset,
                    }),
                    {
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    },
                );
            }

            case "delete": {
                const asset = await deleteAsset(
                    supabase,
                    user.id,
                    validateAssetId(body.assetId),
                );

                return new Response(
                    JSON.stringify({
                        success: true,
                        message: "Asset deleted successfully.",
                        asset,
                    }),
                    {
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    },
                );
            }

            default:
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "Invalid action.",
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
