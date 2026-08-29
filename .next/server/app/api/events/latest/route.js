(()=>{var a={};a.id=301,a.ids=[301],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},857:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{GET:()=>g,dynamic:()=>i,runtime:()=>h});var e=c(7143),f=a([e]);e=(f.then?(await f)():f)[0];let h="nodejs",i="force-dynamic";async function g(a){await (0,e.X)();let b=new TextEncoder,c=a.nextUrl.searchParams.get("wallet")?.toLowerCase();if(!c)return new Response(JSON.stringify({error:"Wallet is required."}),{status:400,headers:{"content-type":"application/json"}});let d=new ReadableStream({async start(d){let f="",g=a=>{try{d.enqueue(b.encode(`data: ${JSON.stringify(a)}

`))}catch{}};try{let a=await (0,e.db)(`
            SELECT id, created_at
            FROM worker_events
            WHERE LOWER(owner) = LOWER($1)
            ORDER BY created_at DESC
            LIMIT 1
          `,[c]);f=a[0]?.id??""}catch(a){console.error("SSE initial query failed:",a)}g({type:"connected",timestamp:new Date().toISOString()});let h=setInterval(async()=>{try{for(let a of(await (0,e.db)(`
              SELECT
                id,
                task_id,
                owner,
                message,
                event_key,
                created_at
              FROM worker_events
              WHERE LOWER(owner) = LOWER($1)
                AND (
                  $2 = ''
                  OR created_at >= (
                    SELECT created_at
                    FROM worker_events
                    WHERE id = $2
                    LIMIT 1
                  )
                )
              ORDER BY created_at ASC
              LIMIT 20
            `,[c,f])))a.id!==f&&(f=a.id,g({type:"event",event:a}));var a=`heartbeat ${Date.now()}`;try{d.enqueue(b.encode(`: ${a}

`))}catch{}}catch(a){console.error("SSE database check failed:",a)}},1e3);a.signal.addEventListener("abort",()=>{clearInterval(h);try{d.close()}catch{}})}});return new Response(d,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache, no-transform",Connection:"keep-alive","X-Accel-Buffering":"no"}})}d()}catch(a){d(a)}})},1420:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{handler:()=>x,patchFetch:()=>w,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var e=c(5736),f=c(9117),g=c(4044),h=c(9326),i=c(2324),j=c(261),k=c(4290),l=c(5328),m=c(8928),n=c(6595),o=c(3421),p=c(7679),q=c(1681),r=c(3446),s=c(6439),t=c(1356),u=c(857),v=a([u]);u=(v.then?(await v)():v)[0];let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/events/latest/route",pathname:"/api/events/latest",filename:"route",bundlePath:"app/api/events/latest/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"D:\\coding\\super-computers-real\\super-computers-site\\app\\api\\events\\latest\\route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function w(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function x(a,b,c){var d;let e="/api/events/latest/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G=D,G="/index"===G?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}d()}catch(a){d(a)}})},3033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3421:(a,b,c)=>{"use strict";Object.defineProperty(b,"I",{enumerable:!0,get:function(){return g}});let d=c(1237),e=c(5088),f=c(7679);async function g(a,b,c,g){if((0,d.isNodeNextResponse)(b)){var h;b.statusCode=c.status,b.statusMessage=c.statusText;let d=["set-cookie","www-authenticate","proxy-authenticate","vary"];null==(h=c.headers)||h.forEach((a,c)=>{if("x-middleware-set-cookie"!==c.toLowerCase())if("set-cookie"===c.toLowerCase())for(let d of(0,f.splitCookiesString)(a))b.appendHeader(c,d);else{let e=void 0!==b.getHeader(c);(d.includes(c.toLowerCase())||!e)&&b.appendHeader(c,a)}});let{originalResponse:i}=b;c.body&&"HEAD"!==a.method?await (0,e.pipeToNodeResponse)(c.body,i,g):i.end()}}},4870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4939:a=>{"use strict";a.exports=import("pg")},5736:(a,b,c)=>{"use strict";a.exports=c(4870)},6439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},6487:()=>{},7143:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{X:()=>h,db:()=>g});var e=c(4939),f=a([e]);e=(f.then?(await f)():f)[0];let i=global.__superComputersPool??new e.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL?.includes("sslmode=require")?{rejectUnauthorized:!1}:void 0,max:5});async function g(a,b=[]){return(await i.query(a,b)).rows}async function h(){await i.query(`
    CREATE TABLE IF NOT EXISTS worker_tasks (
      id UUID PRIMARY KEY,
      owner TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('wallet', 'floor', 'mint')),
      target TEXT NOT NULL,
      condition TEXT NOT NULL,
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

    CREATE TABLE IF NOT EXISTS worker_events (
      id UUID PRIMARY KEY,
      task_id UUID NOT NULL REFERENCES worker_tasks(id) ON DELETE CASCADE,
      owner TEXT NOT NULL,
      message TEXT NOT NULL,
      event_key TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS worker_events_unique_event
      ON worker_events(task_id, event_key);
  `)}d()}catch(a){d(a)}})},8335:()=>{},9294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[873],()=>b(b.s=1420));module.exports=c})();