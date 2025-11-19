import "server-only";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseClient() {
  const cookieStore = await cookies();

  // cookieStore.forEach(({ name, value, options }) =>
  //   supabaseResponse.cookies.set(name, value, options)
  // );
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // process.env.SUPABASE_SERVICE_ROLE_KEY!, // or SUPABASE_ANON_KEY, depending on use
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Handle cookie removal in Server Components
          }
        },
      },
    }
  );
}

// export async function createClient() {
//   const cookieStore = await cookies();

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll();
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             );
//           } catch {
//             // The "setAll" method was called from a Server Component.
//             // This can be ignored if you have middleware refreshing user sessions.
//           }
//         },
//       },
//     }
//   );
// }
