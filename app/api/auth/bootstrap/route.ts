import { NextResponse } from "next/server";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

// Creates the organization + users row for a just-confirmed sign-up.
// Runs under the service role because RLS correctly forbids a brand-new
// user (who has no organization yet) from inserting one for themself.
// Idempotent — safe to call more than once for the same user.
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { data: existing } = await admin
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();
  if (existing?.organization_id) {
    return NextResponse.json({ organizationId: existing.organization_id });
  }

  const body = await request.json().catch(() => ({}));
  const orgName = typeof body.orgName === "string" && body.orgName.trim() ? body.orgName.trim() : "Unnamed organization";
  const country = typeof body.country === "string" && body.country.trim() ? body.country.trim() : "Nigeria";

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: orgName, country })
    .select("id")
    .single();
  if (orgError || !org) {
    return NextResponse.json({ error: "organization_create_failed" }, { status: 500 });
  }

  const { error: userError } = await admin
    .from("users")
    .upsert({ id: user.id, organization_id: org.id, role: "owner" }, { onConflict: "id" });
  if (userError) {
    return NextResponse.json({ error: "user_link_failed" }, { status: 500 });
  }

  return NextResponse.json({ organizationId: org.id });
}
