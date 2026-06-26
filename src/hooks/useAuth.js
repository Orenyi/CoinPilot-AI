import { supabase } from "../lib/supabase";

export const signUp = async (email, password) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPassword = async (email) => {
  return await supabase.auth.resetPasswordForEmail(email);
};

export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
  });
};
