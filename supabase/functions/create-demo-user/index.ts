// Public endpoint used to create a demo account for quick testing.
// NOTE: This is intentionally simple and should not be used as-is for production.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const demoEmail = "demo@bosshuddle.com";
  const demoPassword = "test123456";

  // Create the demo user if it doesn't exist (idempotent-ish).
  const { error } = await admin.auth.admin.createUser({
    email: demoEmail,
    password: demoPassword,
    email_confirm: true,
    user_metadata: { full_name: "Demo User" },
  });

  // If user already exists, we treat it as success.
  const alreadyExists = (error?.message ?? "").toLowerCase().includes("already") ||
    (error?.message ?? "").toLowerCase().includes("exists") ||
    (error?.code ?? "").toLowerCase().includes("already") ||
    (error?.code ?? "").toLowerCase().includes("exists");

  if (error && !alreadyExists) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, email: demoEmail }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
