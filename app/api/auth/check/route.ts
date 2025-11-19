// app/api/auth/check/route.ts
import { createSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return NextResponse.json({ session });
}
