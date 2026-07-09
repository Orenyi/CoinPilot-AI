import { supabase } from "./supabase";

/**
 * Get user's watchlist
 */
export const getWatchlist = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

/**
 * Add coin to watchlist
 */
export const addToWatchlist = async (coinId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated.");

  const { data, error } = await supabase
    .from("watchlist")
    .insert({
      user_id: user.id,
      coin_id: coinId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

/**
 * Remove coin from watchlist
 */
export const removeFromWatchlist = async (coinId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated.");

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("coin_id", coinId);

  if (error) throw error;

  return true;
};
