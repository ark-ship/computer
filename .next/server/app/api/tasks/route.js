(()=>{var a={};a.id=456,a.ids=[456],a.modules={34:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{handler:()=>x,patchFetch:()=>w,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var e=c(5736),f=c(9117),g=c(4044),h=c(9326),i=c(2324),j=c(261),k=c(4290),l=c(5328),m=c(8928),n=c(6595),o=c(3421),p=c(7679),q=c(1681),r=c(3446),s=c(6439),t=c(1356),u=c(5350),v=a([u]);u=(v.then?(await v)():v)[0];let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/tasks/route",pathname:"/api/tasks",filename:"route",bundlePath:"app/api/tasks/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"D:\\coding\\super-computers-real\\super-computers-site\\app\\api\\tasks\\route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function w(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function x(a,b,c){var d;let e="/api/tasks/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G=D,G="/index"===G?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}d()}catch(a){d(a)}})},261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1011:(a,b,c)=>{"use strict";c.d(b,{AC:()=>d,E0:()=>e,FW:()=>l,G7:()=>f,KX:()=>h,WC:()=>n,kE:()=>m,rA:()=>k,si:()=>g,tF:()=>i,ze:()=>j});let d=Number("4663"),e="https://rpc.mainnet.chain.robinhood.com",f="0x83ffb626bbff9e5159856f31921ae98f285c39ff",g="super-computers",h=process.env.OPENSEA_CHAIN??"robinhood",i=process.env.OPENSEA_API_KEY??"82a15a484e089dfbb314a41218ecc5f0",j=process.env.BLOCKSCOUT_API_KEY??"";process.env.ALCHEMY_API_KEY;let k=process.env.ALCHEMY_WEBHOOK_SECRET??"whsec_dKPNOBY7OwnrocCvv6qSSmwH",l=process.env.ALCHEMY_MULTI_WEBHOOK_SECRET??"whsec_UjFZIVomatnnWu4LBdYJCnb9",m=process.env.ALCHEMY_NOTIFY_TOKEN??"aeUwwqO3x2_UOOjB15wap-xayDXV9XNm",n=process.env.ALCHEMY_CONTRACT_VARIABLE??"contractAddresses"},1630:a=>{"use strict";a.exports=require("http")},2786:(a,b,c)=>{"use strict";c.d(b,{Dy:()=>j,Me:()=>f,dy:()=>i,gG:()=>g});var d=c(1011);async function e(a){let b=await fetch(`https://api.opensea.io/api/v2${a}`,{headers:function(){if(!d.tF)throw Error("OPENSEA_API_KEY is missing.");return{"x-api-key":d.tF,accept:"application/json"}}(),cache:"no-store"});if(!b.ok){let a=await b.text().catch(()=>"");throw Error(`OpenSea API ${b.status}${a?`: ${a}`:""}`)}return b.json()}async function f(a=d.si){if(!a)throw Error("OPENSEA_SLUG is missing.");return e(`/collections/${encodeURIComponent(a)}/stats`)}async function g(a=d.si,b="mint"){if(!a)throw Error("OPENSEA_SLUG is missing.");return e(`/events/collection/${encodeURIComponent(a)}?event_type=${b}&limit=20`)}async function h(a){if(!a)throw Error("Collection slug is missing.");return e(`/collections/${encodeURIComponent(a)}`)}async function i(a){let b=await h(a);for(let a of[b?.primary_asset_contracts?.[0]?.address,b?.contracts?.[0]?.address,b?.contract_address,b?.primary_asset_contract?.address])if("string"==typeof a&&/^0x[a-fA-F0-9]{40}$/.test(a))return a;return null}async function j(a){return d.tF&&d.si?e(`/chain/${encodeURIComponent(d.KX)}/account/${encodeURIComponent(a)}/nfts?collection=${encodeURIComponent(d.si)}&limit=200`):null}},3033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4075:a=>{"use strict";a.exports=require("zlib")},4870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4939:a=>{"use strict";a.exports=import("pg")},5350:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{DELETE:()=>r,PATCH:()=>q,POST:()=>p,dynamic:()=>u,runtime:()=>t});var e=c(641),f=c(5511),g=c.n(f),h=c(161),i=c(586),j=c(6147),k=c(9943),l=c(7143),m=c(7050),n=c(2786),o=a([l]);l=(o.then?(await o)():o)[0];let s=new Set(["wallet","floor","mint"]),t="nodejs",u="force-dynamic";async function p(a){try{let b=(0,j.sc)(a);await (0,k.f)(b),await (0,l.X)();let c=await a.json(),d=c.type?.trim(),f=c.target?.trim(),o=c.condition?.trim();if(!d||!s.has(d))return e.NextResponse.json({error:"Invalid task type."},{status:400});if(!f||f.length>180)return e.NextResponse.json({error:"Invalid target."},{status:400});if(!o||o.length>180)return e.NextResponse.json({error:"Invalid condition."},{status:400});if("wallet"===d&&!h.PW(f))return e.NextResponse.json({error:"Wallet Watcher target must be a valid EVM address."},{status:400});let p=null;if(("floor"===d||"mint"===d)&&!/^[a-zA-Z0-9][a-zA-Z0-9-_]*$/.test(f))return e.NextResponse.json({error:"Collection target must be a valid OpenSea slug."},{status:400});if("mint"===d){try{p=await (0,n.dy)(f)}catch(a){return console.error("OpenSea collection lookup failed:",a),e.NextResponse.json({error:"Unable to find this OpenSea collection."},{status:400})}if(!p||!h.PW(p))return e.NextResponse.json({error:"No contract address found for this OpenSea collection."},{status:400});p=i.b(p);try{await (0,m.f)(p)}catch(a){return console.error("Alchemy contract registration failed:",a),e.NextResponse.json({error:"Collection found, but realtime monitoring could not be registered."},{status:500})}}let q=g().randomUUID(),r=(await (0,l.db)(`
        INSERT INTO worker_tasks
          (
            id,
            owner,
            type,
            target,
            condition,
            contract_address
          )
        VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
          )
        RETURNING
          id,
          owner,
          type,
          target,
          condition,
          contract_address,
          active,
          last_checked_at,
          last_triggered_at,
          created_at
        `,[q,b.toLowerCase(),d,f,o,p]))[0];return e.NextResponse.json({ok:!0,task:{id:r.id,type:r.type,target:r.target,condition:r.condition,contract_address:r.contract_address,active:r.active}})}catch(b){let a=b instanceof Error?b.message:"Unable to create task.";if("UNAUTHORIZED"===a||"WALLET_DOES_NOT_OWN_COMPUTER"===a)return e.NextResponse.json({error:a},{status:401});return console.error("Create task failed:",b),e.NextResponse.json({error:a},{status:500})}}async function q(a){try{let b=(0,j.sc)(a);await (0,l.X)();let c=await a.json();if(!c.id||"boolean"!=typeof c.active)return e.NextResponse.json({error:"Invalid task update."},{status:400});let d=await (0,l.db)(`
        UPDATE worker_tasks
        SET active = $1
        WHERE id = $2
          AND LOWER(owner) = LOWER($3)
        RETURNING id, active
        `,[c.active,c.id,b.toLowerCase()]);if(!d[0])return e.NextResponse.json({error:"Task not found."},{status:404});return e.NextResponse.json({ok:!0,task:d[0]})}catch(b){let a=b instanceof Error?b.message:"Unable to update task.";if("UNAUTHORIZED"===a)return e.NextResponse.json({error:a},{status:401});return e.NextResponse.json({error:a},{status:500})}}async function r(a){try{let b=(0,j.sc)(a);await (0,l.X)();let c=a.nextUrl.searchParams.get("id");if(!c)return e.NextResponse.json({error:"Missing task id."},{status:400});if(!(await (0,l.db)(`
        DELETE FROM worker_tasks
        WHERE id = $1
          AND LOWER(owner) = LOWER($2)
        RETURNING id
        `,[c,b.toLowerCase()]))[0])return e.NextResponse.json({error:"Task not found."},{status:404});return e.NextResponse.json({ok:!0})}catch(b){let a=b instanceof Error?b.message:"Unable to delete task.";if("UNAUTHORIZED"===a)return e.NextResponse.json({error:a},{status:401});return e.NextResponse.json({error:a},{status:500})}}d()}catch(a){d(a)}})},5511:a=>{"use strict";a.exports=require("crypto")},5591:a=>{"use strict";a.exports=require("https")},6147:(a,b,c)=>{"use strict";c.d(b,{$G:()=>n,O8:()=>l,hf:()=>o,kv:()=>m,o2:()=>k,sc:()=>p});var d=c(5511),e=c.n(d),f=c(586),g=c(161);let h="sc_session",i="sc_nonce";function j(a){return e().createHmac("sha256",function(){let a=process.env.AUTH_SECRET;if(!a||a.length<32)throw Error("AUTH_SECRET must be at least 32 characters.");return a}()).update(a).digest("hex")}function k(){return e().randomBytes(24).toString("hex")}function l(a,b){a.cookies.set(i,b,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:600})}function m(a){return a.cookies.get(i)?.value??null}function n(a,b){a.cookies.set(h,function(a){let b=f.b(a).toLowerCase(),c=`${b}:${Date.now()}`;return`${Buffer.from(c).toString("base64url")}.${j(c)}`}(b),{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",maxAge:604800})}function o(a){a.cookies.delete(h),a.cookies.delete(i)}function p(a){let b=function(a){let b=a.cookies.get(h)?.value;if(!b)return null;let[c,d]=b.split(".");if(!c||!d)return null;try{let a=Buffer.from(c,"base64url").toString("utf8"),b=j(a);if(!e().timingSafeEqual(Buffer.from(d),Buffer.from(b)))return null;let[h,i]=a.split(":"),k=Number(i);if(!g.PW(h)||!Number.isFinite(k)||Date.now()-k>6048e5)return null;return f.b(h)}catch{return null}}(a);if(!b)throw Error("UNAUTHORIZED");return b}},6439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},6487:()=>{},7050:(a,b,c)=>{"use strict";c.d(b,{f:()=>e});var d=c(1011);async function e(a){if(!d.kE)throw Error("ALCHEMY_NOTIFY_TOKEN is missing.");if(!/^0x[a-fA-F0-9]{40}$/.test(a))throw Error("Invalid contract address.");let b=await fetch(`https://dashboard.alchemy.com/api/graphql/variables/${encodeURIComponent(d.WC)}`,{method:"PATCH",headers:{"Content-Type":"application/json","X-Alchemy-Token":d.kE},body:JSON.stringify({add:[a]}),cache:"no-store"});if(!b.ok){let a=await b.text().catch(()=>"");throw Error(`Alchemy variable update failed: ${b.status}${a?` ${a}`:""}`)}return b.json().catch(()=>({}))}},7143:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{X:()=>h,db:()=>g});var e=c(4939),f=a([e]);e=(f.then?(await f)():f)[0];let i=global.__superComputersPool??new e.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL?.includes("sslmode=require")?{rejectUnauthorized:!1}:void 0,max:5});async function g(a,b=[]){return(await i.query(a,b)).rows}async function h(){await i.query(`
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
  `)}d()}catch(a){d(a)}})},7598:a=>{"use strict";a.exports=require("node:crypto")},8335:()=>{},9121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},9943:(a,b,c)=>{"use strict";c.d(b,{f:()=>i});var d=c(9402),e=c(2777),f=c(1011);let g=["function balanceOf(address owner) view returns (uint256)"];async function h(a){if(!f.G7)throw Error("NFT contract is not configured.");let b=new d.FR(f.E0,f.AC,{staticNetwork:!0}),c=new e.NZ(f.G7,g,b);return BigInt((await c.balanceOf(a)).toString())}async function i(a){let b=await h(a);if(b<=0n)throw Error("WALLET_DOES_NOT_OWN_COMPUTER");return b}}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[331,692,161,971,402],()=>b(b.s=34));module.exports=c})();