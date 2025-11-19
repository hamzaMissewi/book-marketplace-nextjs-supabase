module.exports=[71369,a=>{"use strict";var b=a.i(1956),c=a.i(98310);async function d(){let a=await (0,c.createSupabaseClient)(),{data:{user:b}}=await a.auth.getUser();if(!b)return[];let{data:d,error:e}=await a.from("orders").select(`*,
       order_items(
         id,
         order_id,
         book_id,
         price_cents,
         quantity,
         created_at,
         books(id, title, author, cover_image_url)
       )`).eq("user_id",b.id).order("created_at",{ascending:!1});return e?(console.error("Error fetching orders:",e),[]):d||[]}async function e(a){let b=await (0,c.createSupabaseClient)(),{data:{user:d}}=await b.auth.getUser();if(!d)return null;let{data:e,error:f}=await b.from("orders").select(`*,
       order_items(
         id,
         order_id,
         book_id,
         price_cents,
         quantity,
         created_at,
         books(id, title, author, cover_image_url)
       )`).eq("id",a).eq("user_id",d.id).single();return f?(console.error("Error fetching order:",f),null):e}(0,a.i(27603).ensureServerEntryExports)([d,e]),(0,b.registerServerReference)(d,"0010ef3e687496c8a4b536ce7df46cf044ace23e69",null),(0,b.registerServerReference)(e,"40b51e2299398d27a6ad27458973eb24c7aef78e26",null),a.s(["getOrderById",()=>e,"getUserOrders",()=>d])},67123,a=>{"use strict";var b=a.i(71369);a.s([],68487),a.i(68487),a.s(["0010ef3e687496c8a4b536ce7df46cf044ace23e69",()=>b.getUserOrders],67123)}];

//# sourceMappingURL=_0fcd6e07._.js.map