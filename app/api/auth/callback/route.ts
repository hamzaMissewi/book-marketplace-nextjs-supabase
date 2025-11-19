import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { createServerClient } from "@supabase/ssr";
// import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}

// export async function GET(request: Request) {
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get("code");
//   const cookieStore = await cookies();

//   if (code) {
//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           async get(name: string) {
//             return (await cookieStore.get(name))?.value;
//           },
//           async set(name: string, value: string, options: any) {
//             try {
//               await cookieStore.set(name, value, options);
//             } catch (error) {
//               // Handle cookie setting error
//               console.error("Error setting cookie:", error);
//             }
//           },
//           async remove(name: string, options: any) {
//             try {
//               await cookieStore.set(name, "", { ...options, maxAge: 0 });
//             } catch (error) {
//               console.error("Error removing cookie:", error);
//             }
//           },
//         },
//       }
//     );
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   // URL to redirect to after sign in process completes
//   return NextResponse.redirect(requestUrl.origin);
// }

// export async function GET(request: Request) {
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get("code");
//   const next = requestUrl.searchParams.get("next") || "/browse";

//   if (code) {
//     const supabase = await createServerSupabaseClient();
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   return NextResponse.redirect(new URL(next, request.url));
// }
