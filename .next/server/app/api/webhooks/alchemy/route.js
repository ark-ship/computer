(()=>{var a={};a.id=88,a.ids=[88],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1011:(a,b,c)=>{"use strict";c.d(b,{AC:()=>d,E0:()=>e,FW:()=>l,G7:()=>f,KX:()=>h,WC:()=>n,kE:()=>m,rA:()=>k,si:()=>g,tF:()=>i,ze:()=>j});let d=Number("4663"),e="https://rpc.mainnet.chain.robinhood.com",f="0x83ffb626bbff9e5159856f31921ae98f285c39ff",g="super-computers",h=process.env.OPENSEA_CHAIN??"robinhood",i=process.env.OPENSEA_API_KEY??"82a15a484e089dfbb314a41218ecc5f0",j=process.env.BLOCKSCOUT_API_KEY??"";process.env.ALCHEMY_API_KEY;let k=process.env.ALCHEMY_WEBHOOK_SECRET??"whsec_dKPNOBY7OwnrocCvv6qSSmwH",l=process.env.ALCHEMY_MULTI_WEBHOOK_SECRET??"whsec_UjFZIVomatnnWu4LBdYJCnb9",m=process.env.ALCHEMY_NOTIFY_TOKEN??"aeUwwqO3x2_UOOjB15wap-xayDXV9XNm",n=process.env.ALCHEMY_CONTRACT_VARIABLE??"contractAddresses"},1410:(a,b,c)=>{"use strict";async function d(a){let b=process.env.TELEGRAM_BOT_TOKEN,c=process.env.TELEGRAM_CHAT_ID;return!!b&&!!c&&(await fetch(`https://api.telegram.org/bot${b}/sendMessage`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({chat_id:c,text:a,disable_web_page_preview:!0})})).ok}async function e(a){let b=process.env.DISCORD_WEBHOOK_URL;return!!b&&(await fetch(b,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({content:a})})).ok}async function f(a){return(await Promise.allSettled([d(a),e(a)])).some(a=>"fulfilled"===a.status&&!0===a.value)}c.d(b,{L:()=>f})},2138:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{handler:()=>x,patchFetch:()=>w,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var e=c(5736),f=c(9117),g=c(4044),h=c(9326),i=c(2324),j=c(261),k=c(4290),l=c(5328),m=c(8928),n=c(6595),o=c(3421),p=c(7679),q=c(1681),r=c(3446),s=c(6439),t=c(1356),u=c(5520),v=a([u]);u=(v.then?(await v)():v)[0];let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/webhooks/alchemy/route",pathname:"/api/webhooks/alchemy",filename:"route",bundlePath:"app/api/webhooks/alchemy/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"D:\\coding\\super-computers-real\\super-computers-site\\app\\api\\webhooks\\alchemy\\route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function w(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function x(a,b,c){var d;let e="/api/webhooks/alchemy/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G=D,G="/index"===G?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}d()}catch(a){d(a)}})},3033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4939:a=>{"use strict";a.exports=import("pg")},5511:a=>{"use strict";a.exports=require("crypto")},5520:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{POST:()=>n,dynamic:()=>p,runtime:()=>o});var e=c(641),f=c(5511),g=c.n(f),h=c(7143),i=c(1410),j=c(1011),k=a([h]);h=(k.then?(await k)():k)[0];let o="nodejs",p="force-dynamic";function l(a){if(!a)return null;let b=a.replace(/^0x/,"");return b.length<40?null:("0x"+b.slice(-40)).toLowerCase()}function m(a){if(!a)return null;let b=a.replace(/^0x/,"");if(!b)return null;try{return BigInt("0x"+b).toString()}catch{return null}}async function n(a){try{var b;let c,d=await a.text(),f=a.headers.get("x-alchemy-signature")??"";if(!function(a,b){if(!j.rA)return console.error("ALCHEMY_WEBHOOK_SECRET is missing."),!1;if(!b)return!1;let c=g().createHmac("sha256",j.rA).update(a,"utf8").digest("hex"),d=Buffer.from(c,"utf8"),e=Buffer.from(b,"utf8");if(d.length!==e.length)return!1;try{return g().timingSafeEqual(d,e)}catch{return!1}}(d,f))return e.NextResponse.json({ok:!1,error:"Invalid Alchemy signature."},{status:401});try{c=JSON.parse(d)}catch{return e.NextResponse.json({ok:!1,error:"Invalid JSON payload."},{status:400})}if(c.type&&"GRAPHQL"!==c.type)return e.NextResponse.json({ok:!0,ignored:!0});await (0,h.X)();let k=(b=c,b?.event?.data?.block?.logs??[]),n=c?.event?.data?.block?.number,o=0,p=0;for(let a of k){if(!function(a){let b=Array.isArray(a.topics)?a.topics:[];if(!b[0]||"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"!==b[0].toLowerCase())return!1;let c=l(b[1]);return!!c&&"0x0000000000000000000000000000000000000000"===c}(a))continue;o++;let b=a?.account?.address?.toLowerCase();if(!b)continue;let c=Array.isArray(a.topics)?a.topics:[],d=m(c[3]),e=l(c[2]),f=a?.transaction?.hash??null;if(!d||!e||!f)continue;let j=function(a,b){let c=a?.transaction?.hash??"unknown",d=a?.index??"0",e=m(a?.topics?.[3])??"unknown";return["alchemy-mint",c,String(d),e,String(b??"unknown")].join(":")}(a,n),k=await (0,h.db)(`
          SELECT
            id,
            owner,
            target
          FROM worker_tasks
          WHERE active = TRUE
            AND type = 'mint'
            AND LOWER(contract_address) = LOWER($1)
          ORDER BY created_at ASC
          LIMIT 500
          `,[b]);if(0!==k.length)for(let a of k){let c=`🖥️ SUPER COMPUTER ALERT

New mint detected.

Collection: ${a.target}
Contract: ${b}
Token: #${d}
Recipient: ${e}
Tx: ${f}
Block: ${n??"—"}

Your Computer detected the mint.`,k=await (0,h.db)(`
            INSERT INTO worker_events
              (
                id,
                task_id,
                owner,
                message,
                event_key
              )
            VALUES
              (
                $1,
                $2,
                $3,
                $4,
                $5
              )
            ON CONFLICT (
              task_id,
              event_key
            )
            DO NOTHING
            RETURNING id
            `,[g().randomUUID(),a.id,a.owner,c,j]);if(0!==k.length){await (0,h.db)(`
          UPDATE worker_tasks
          SET
            last_checked_at = NOW(),
            last_triggered_at = NOW(),
            last_event_key = $2
          WHERE id = $1
          `,[a.id,j]);try{await (0,i.L)(c)}catch(a){console.error("Alert delivery failed:",a)}p++}}}return e.NextResponse.json({ok:!0,webhook:!0,checked:o,triggered:p,timestamp:new Date().toISOString()})}catch(a){return console.error("Alchemy webhook error:",a),e.NextResponse.json({ok:!1,error:a instanceof Error?a.message:"Webhook processing failed."},{status:500})}}d()}catch(a){d(a)}})},6439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},6487:()=>{},7143:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{X:()=>h,db:()=>g});var e=c(4939),f=a([e]);e=(f.then?(await f)():f)[0];let i=global.__superComputersPool??new e.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL?.includes("sslmode=require")?{rejectUnauthorized:!1}:void 0,max:5});async function g(a,b=[]){return(await i.query(a,b)).rows}async function h(){await i.query(`
    CREATE TABLE IF NOT EXISTS worker_tasks (
      id UUID PRIMARY KEY,
      owner TEXT NOT NULL,
      type TEXT NOT NULL
        CHECK (type IN ('wallet', 'floor', 'mint')),
      target TEXT NOT NULL,
      condition TEXT NOT NULL,

      /*
       * Contract address is used for realtime
       * mint monitoring.
       */
      contract_address TEXT,

      active BOOLEAN NOT NULL DEFAULT TRUE,

      last_checked_at TIMESTAMPTZ,
      last_triggered_at TIMESTAMPTZ,
      last_event_key TEXT,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS worker_tasks_owner_idx
      ON worker_tasks(owner);

    CREATE INDEX IF NOT EXISTS worker_tasks_active_idx
      ON worker_tasks(active);

    CREATE INDEX IF NOT EXISTS worker_tasks_contract_idx
      ON worker_tasks(contract_address);
  `),await i.query(`
    ALTER TABLE worker_tasks
    ADD COLUMN IF NOT EXISTS contract_address TEXT;
  `),await i.query(`
    CREATE TABLE IF NOT EXISTS worker_events (
      id UUID PRIMARY KEY,
      task_id UUID NOT NULL
        REFERENCES worker_tasks(id)
        ON DELETE CASCADE,

      owner TEXT NOT NULL,
      message TEXT NOT NULL,
      event_key TEXT NOT NULL,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS
      worker_events_unique_event
    ON worker_events(task_id, event_key);
  `)}d()}catch(a){d(a)}})},8335:()=>{},9121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[331,692],()=>b(b.s=2138));module.exports=c})();