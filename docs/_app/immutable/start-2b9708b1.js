import{S as et,i as tt,s as nt,a as rt,e as B,c as at,b as z,g as ue,t as F,d as he,f as J,h as G,j as ot,o as Se,k as st,l as it,m as lt,n as ve,p as V,q as ct,r as ft,u as ut,v as M,w as Y,x as Ae,y as X,z as Z,A as ie}from"./chunks/index-07387a3e.js";import{g as We,f as ze,s as W,a as Oe,b as ht,i as dt,c as pt}from"./chunks/singletons-61b18a41.js";function mt(r,e){return r==="/"||e==="ignore"?r:e==="never"?r.endsWith("/")?r.slice(0,-1):r:e==="always"&&!r.endsWith("/")?r+"/":r}function _t(r){return r.split("%25").map(decodeURI).join("%25")}function gt(r){for(const e in r)r[e]=decodeURIComponent(r[e]);return r}const wt=["href","pathname","search","searchParams","toString","toJSON"];function yt(r,e){const t=new URL(r);for(const o of wt){let s=t[o];Object.defineProperty(t,o,{get(){return e(),s},enumerable:!0,configurable:!0})}return bt(t),t}function bt(r){Object.defineProperty(r,"hash",{get(){throw new Error("Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead")}})}const vt="/__data.json";function Et(r){return r.replace(/\/$/,"")+vt}function kt(r){let e=5381;if(typeof r=="string"){let t=r.length;for(;t;)e=e*33^r.charCodeAt(--t)}else if(ArrayBuffer.isView(r)){const t=new Uint8Array(r.buffer,r.byteOffset,r.byteLength);let o=t.length;for(;o;)e=e*33^t[--o]}else throw new TypeError("value must be a string or TypedArray");return(e>>>0).toString(36)}const de=window.fetch;window.fetch=(r,e)=>{if((r instanceof Request?r.method:(e==null?void 0:e.method)||"GET")!=="GET"){const o=new URL(r instanceof Request?r.url:r.toString(),document.baseURI).href;ne.delete(o)}return de(r,e)};const ne=new Map;function Rt(r,e){const t=Qe(r,e),o=document.querySelector(t);if(o!=null&&o.textContent){const{body:s,...l}=JSON.parse(o.textContent),n=o.getAttribute("data-ttl");return n&&ne.set(t,{body:s,init:l,ttl:1e3*Number(n)}),Promise.resolve(new Response(s,l))}return de(r,e)}function St(r,e,t){if(ne.size>0){const o=Qe(r,t),s=ne.get(o);if(s){if(performance.now()<s.ttl)return new Response(s.body,s.init);ne.delete(o)}}return de(e,t)}function Qe(r,e){let o=`script[data-sveltekit-fetched][data-url=${JSON.stringify(r instanceof Request?r.url:r)}]`;return(e==null?void 0:e.body)&&(typeof e.body=="string"||ArrayBuffer.isView(e.body))&&(o+=`[data-hash="${kt(e.body)}"]`),o}const Ot=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function It(r){const e=[];return{pattern:r==="/"?/^\/$/:new RegExp(`^${$t(r).map(o=>{const s=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(o);if(s)return e.push({name:s[1],matcher:s[2],optional:!1,rest:!0,chained:!0}),"(?:/(.*))?";const l=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(o);if(l)return e.push({name:l[1],matcher:l[2],optional:!0,rest:!1,chained:!0}),"(?:/([^/]+))?";if(!o)return;const n=o.split(/\[(.+?)\](?!\])/);return"/"+n.map((m,p)=>{if(p%2){if(m.startsWith("x+"))return Ee(String.fromCharCode(parseInt(m.slice(2),16)));if(m.startsWith("u+"))return Ee(String.fromCharCode(...m.slice(2).split("-").map(q=>parseInt(q,16))));const g=Ot.exec(m);if(!g)throw new Error(`Invalid param: ${m}. Params and matcher names can only have underscores and alphanumeric characters.`);const[,b,R,T,A]=g;return e.push({name:T,matcher:A,optional:!!b,rest:!!R,chained:R?p===1&&n[0]==="":!1}),R?"(.*?)":b?"([^/]*)?":"([^/]+?)"}return Ee(m)}).join("")}).join("")}/?$`),params:e}}function Lt(r){return!/^\([^)]+\)$/.test(r)}function $t(r){return r.slice(1).split("/").filter(Lt)}function At(r,e,t){const o={},s=r.slice(1);let l="";for(let n=0;n<e.length;n+=1){const f=e[n];let m=s[n];if(f.chained&&f.rest&&l&&(m=m?l+"/"+m:l),l="",m===void 0)f.rest&&(o[f.name]="");else{if(f.matcher&&!t[f.matcher](m)){if(f.optional&&f.chained){let p=s.indexOf(void 0,n);if(p===-1){const g=e[n+1];if((g==null?void 0:g.rest)&&g.chained)l=m;else return}for(;p>=n;)s[p]=s[p-1],p-=1;continue}return}o[f.name]=m}}if(!l)return o}function Ee(r){return r.normalize().replace(/[[\]]/g,"\\$&").replace(/%/g,"%25").replace(/\//g,"%2[Ff]").replace(/\?/g,"%3[Ff]").replace(/#/g,"%23").replace(/[.*+?^${}()|\\]/g,"\\$&")}function Pt(r,e,t,o){const s=new Set(e);return Object.entries(t).map(([f,[m,p,g]])=>{const{pattern:b,params:R}=It(f),T={id:f,exec:A=>{const q=b.exec(A);if(q)return At(q,R,o)},errors:[1,...g||[]].map(A=>r[A]),layouts:[0,...p||[]].map(n),leaf:l(m)};return T.errors.length=T.layouts.length=Math.max(T.errors.length,T.layouts.length),T});function l(f){const m=f<0;return m&&(f=~f),[m,r[f]]}function n(f){return f===void 0?f:[s.has(f),r[f]]}}function jt(r){let e,t,o;var s=r[0][0];function l(n){return{props:{data:n[2],form:n[1]}}}return s&&(e=M(s,l(r))),{c(){e&&Y(e.$$.fragment),t=B()},l(n){e&&Ae(e.$$.fragment,n),t=B()},m(n,f){e&&X(e,n,f),z(n,t,f),o=!0},p(n,f){const m={};if(f&4&&(m.data=n[2]),f&2&&(m.form=n[1]),s!==(s=n[0][0])){if(e){ue();const p=e;F(p.$$.fragment,1,0,()=>{Z(p,1)}),he()}s?(e=M(s,l(n)),Y(e.$$.fragment),J(e.$$.fragment,1),X(e,t.parentNode,t)):e=null}else s&&e.$set(m)},i(n){o||(e&&J(e.$$.fragment,n),o=!0)},o(n){e&&F(e.$$.fragment,n),o=!1},d(n){n&&G(t),e&&Z(e,n)}}}function Nt(r){let e,t,o;var s=r[0][0];function l(n){return{props:{data:n[2],$$slots:{default:[Tt]},$$scope:{ctx:n}}}}return s&&(e=M(s,l(r))),{c(){e&&Y(e.$$.fragment),t=B()},l(n){e&&Ae(e.$$.fragment,n),t=B()},m(n,f){e&&X(e,n,f),z(n,t,f),o=!0},p(n,f){const m={};if(f&4&&(m.data=n[2]),f&523&&(m.$$scope={dirty:f,ctx:n}),s!==(s=n[0][0])){if(e){ue();const p=e;F(p.$$.fragment,1,0,()=>{Z(p,1)}),he()}s?(e=M(s,l(n)),Y(e.$$.fragment),J(e.$$.fragment,1),X(e,t.parentNode,t)):e=null}else s&&e.$set(m)},i(n){o||(e&&J(e.$$.fragment,n),o=!0)},o(n){e&&F(e.$$.fragment,n),o=!1},d(n){n&&G(t),e&&Z(e,n)}}}function Tt(r){let e,t,o;var s=r[0][1];function l(n){return{props:{data:n[3],form:n[1]}}}return s&&(e=M(s,l(r))),{c(){e&&Y(e.$$.fragment),t=B()},l(n){e&&Ae(e.$$.fragment,n),t=B()},m(n,f){e&&X(e,n,f),z(n,t,f),o=!0},p(n,f){const m={};if(f&8&&(m.data=n[3]),f&2&&(m.form=n[1]),s!==(s=n[0][1])){if(e){ue();const p=e;F(p.$$.fragment,1,0,()=>{Z(p,1)}),he()}s?(e=M(s,l(n)),Y(e.$$.fragment),J(e.$$.fragment,1),X(e,t.parentNode,t)):e=null}else s&&e.$set(m)},i(n){o||(e&&J(e.$$.fragment,n),o=!0)},o(n){e&&F(e.$$.fragment,n),o=!1},d(n){n&&G(t),e&&Z(e,n)}}}function He(r){let e,t=r[5]&&Me(r);return{c(){e=st("div"),t&&t.c(),this.h()},l(o){e=it(o,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var s=lt(e);t&&t.l(s),s.forEach(G),this.h()},h(){ve(e,"id","svelte-announcer"),ve(e,"aria-live","assertive"),ve(e,"aria-atomic","true"),V(e,"position","absolute"),V(e,"left","0"),V(e,"top","0"),V(e,"clip","rect(0 0 0 0)"),V(e,"clip-path","inset(50%)"),V(e,"overflow","hidden"),V(e,"white-space","nowrap"),V(e,"width","1px"),V(e,"height","1px")},m(o,s){z(o,e,s),t&&t.m(e,null)},p(o,s){o[5]?t?t.p(o,s):(t=Me(o),t.c(),t.m(e,null)):t&&(t.d(1),t=null)},d(o){o&&G(e),t&&t.d()}}}function Me(r){let e;return{c(){e=ct(r[6])},l(t){e=ft(t,r[6])},m(t,o){z(t,e,o)},p(t,o){o&64&&ut(e,t[6])},d(t){t&&G(e)}}}function Ut(r){let e,t,o,s,l;const n=[Nt,jt],f=[];function m(g,b){return g[0][1]?0:1}e=m(r),t=f[e]=n[e](r);let p=r[4]&&He(r);return{c(){t.c(),o=rt(),p&&p.c(),s=B()},l(g){t.l(g),o=at(g),p&&p.l(g),s=B()},m(g,b){f[e].m(g,b),z(g,o,b),p&&p.m(g,b),z(g,s,b),l=!0},p(g,[b]){let R=e;e=m(g),e===R?f[e].p(g,b):(ue(),F(f[R],1,1,()=>{f[R]=null}),he(),t=f[e],t?t.p(g,b):(t=f[e]=n[e](g),t.c()),J(t,1),t.m(o.parentNode,o)),g[4]?p?p.p(g,b):(p=He(g),p.c(),p.m(s.parentNode,s)):p&&(p.d(1),p=null)},i(g){l||(J(t),l=!0)},o(g){F(t),l=!1},d(g){f[e].d(g),g&&G(o),p&&p.d(g),g&&G(s)}}}function Dt(r,e,t){let{stores:o}=e,{page:s}=e,{components:l}=e,{form:n}=e,{data_0:f=null}=e,{data_1:m=null}=e;ot(o.page.notify);let p=!1,g=!1,b=null;return Se(()=>{const R=o.page.subscribe(()=>{p&&(t(5,g=!0),t(6,b=document.title||"untitled page"))});return t(4,p=!0),R}),r.$$set=R=>{"stores"in R&&t(7,o=R.stores),"page"in R&&t(8,s=R.page),"components"in R&&t(0,l=R.components),"form"in R&&t(1,n=R.form),"data_0"in R&&t(2,f=R.data_0),"data_1"in R&&t(3,m=R.data_1)},r.$$.update=()=>{r.$$.dirty&384&&o.page.set(s)},[l,n,f,m,p,g,b,o,s]}class Vt extends et{constructor(e){super(),tt(this,e,Dt,Ut,nt,{stores:7,page:8,components:0,form:1,data_0:2,data_1:3})}}const Ct="modulepreload",qt=function(r,e){return new URL(r,e).href},Ye={},D=function(e,t,o){if(!t||t.length===0)return e();const s=document.getElementsByTagName("link");return Promise.all(t.map(l=>{if(l=qt(l,o),l in Ye)return;Ye[l]=!0;const n=l.endsWith(".css"),f=n?'[rel="stylesheet"]':"";if(!!o)for(let g=s.length-1;g>=0;g--){const b=s[g];if(b.href===l&&(!n||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${f}`))return;const p=document.createElement("link");if(p.rel=n?"stylesheet":Ct,n||(p.as="script",p.crossOrigin=""),p.href=l,document.head.appendChild(p),n)return new Promise((g,b)=>{p.addEventListener("load",g),p.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${l}`)))})})).then(()=>e())},Bt={},pe=[()=>D(()=>import("./chunks/0-b39fa3a3.js"),["./chunks\\0-b39fa3a3.js","./chunks\\_layout-244212a4.js","./components\\layout.svelte-1950654f.js","./chunks\\index-07387a3e.js"],import.meta.url),()=>D(()=>import("./chunks/1-bacb28f1.js"),["./chunks\\1-bacb28f1.js","./components\\error.svelte-94e3e6aa.js","./chunks\\index-07387a3e.js","./chunks\\singletons-61b18a41.js","./chunks\\index-8fac5b94.js"],import.meta.url),()=>D(()=>import("./chunks/2-b48a00df.js"),["./chunks\\2-b48a00df.js","./components\\pages\\_page.svelte-642409f3.js","./chunks\\index-07387a3e.js","./assets\\_page-b09b0b89.css"],import.meta.url),()=>D(()=>import("./chunks/3-c47ee282.js"),["./chunks\\3-c47ee282.js","./components\\pages\\chatbot\\_page.svelte-15bcd837.js","./chunks\\index-07387a3e.js","./assets\\_page-c73364eb.css"],import.meta.url),()=>D(()=>import("./chunks/4-60eef048.js"),["./chunks\\4-60eef048.js","./components\\pages\\chess\\_page.svelte-c644b939.js","./chunks\\index-07387a3e.js","./assets\\_page-9098d686.css"],import.meta.url),()=>D(()=>import("./chunks/5-aaba4822.js"),["./chunks\\5-aaba4822.js","./components\\pages\\clicker\\_page.svelte-a1ef842a.js","./chunks\\index-07387a3e.js","./assets\\_page-a7d6d99c.css"],import.meta.url),()=>D(()=>import("./chunks/6-d8a875c8.js"),["./chunks\\6-d8a875c8.js","./components\\pages\\memory\\_page.svelte-7433483e.js","./chunks\\index-07387a3e.js","./assets\\_page-25c1bc03.css"],import.meta.url),()=>D(()=>import("./chunks/7-be0f8b11.js"),["./chunks\\7-be0f8b11.js","./components\\pages\\search\\_page.svelte-b38ba7aa.js","./chunks\\index-07387a3e.js"],import.meta.url),()=>D(()=>import("./chunks/8-860f1923.js"),["./chunks\\8-860f1923.js","./components\\pages\\telltale\\_page.svelte-19718bf7.js","./chunks\\index-07387a3e.js","./chunks\\index-8fac5b94.js","./assets\\_page-31959b9b.css"],import.meta.url),()=>D(()=>import("./chunks/9-bf2bd381.js"),["./chunks\\9-bf2bd381.js","./components\\pages\\todo\\_page.svelte-dbe47546.js","./chunks\\index-07387a3e.js"],import.meta.url)],Ft=[],Jt={"/":[2],"/chatbot":[3],"/chess":[4],"/clicker":[5],"/memory":[6],"/search":[7],"/telltale":[8],"/todo":[9]},Gt={handleError:({error:r})=>{console.error(r)}};class Ie{constructor(e,t){this.status=e,typeof t=="string"?this.body={message:t}:t?this.body=t:this.body={message:`Error: ${e}`}}toString(){return JSON.stringify(this.body)}}class Xe{constructor(e,t){this.status=e,this.location=t}}async function Kt(r){var e;for(const t in r)if(typeof((e=r[t])==null?void 0:e.then)=="function")return Object.fromEntries(await Promise.all(Object.entries(r).map(async([o,s])=>[o,await s])));return r}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");Object.getOwnPropertyNames(Object.prototype).sort().join("\0");const Wt=-1,zt=-2,Ht=-3,Mt=-4,Yt=-5,Xt=-6;function Zt(r){if(typeof r=="number")return o(r,!0);if(!Array.isArray(r)||r.length===0)throw new Error("Invalid input");const e=r,t=Array(e.length);function o(s,l=!1){if(s===Wt)return;if(s===Ht)return NaN;if(s===Mt)return 1/0;if(s===Yt)return-1/0;if(s===Xt)return-0;if(l)throw new Error("Invalid input");if(s in t)return t[s];const n=e[s];if(!n||typeof n!="object")t[s]=n;else if(Array.isArray(n))if(typeof n[0]=="string")switch(n[0]){case"Date":t[s]=new Date(n[1]);break;case"Set":const m=new Set;t[s]=m;for(let b=1;b<n.length;b+=1)m.add(o(n[b]));break;case"Map":const p=new Map;t[s]=p;for(let b=1;b<n.length;b+=2)p.set(o(n[b]),o(n[b+1]));break;case"RegExp":t[s]=new RegExp(n[1],n[2]);break;case"Object":t[s]=Object(n[1]);break;case"BigInt":t[s]=BigInt(n[1]);break;case"null":const g=Object.create(null);t[s]=g;for(let b=1;b<n.length;b+=2)g[n[b]]=o(n[b+1]);break}else{const f=new Array(n.length);t[s]=f;for(let m=0;m<n.length;m+=1){const p=n[m];p!==zt&&(f[m]=o(p))}}else{const f={};t[s]=f;for(const m in n){const p=n[m];f[m]=o(p)}}return t[s]}return o(0)}const xe="sveltekit:scroll",C="sveltekit:index",le=Pt(pe,Ft,Jt,Bt),Le=pe[0],$e=pe[1];Le();$e();let re={};try{re=JSON.parse(sessionStorage[xe])}catch{}function ke(r){re[r]=Oe()}function Qt({target:r,base:e}){var Je;const t=[];let o=null;const s={before_navigate:[],after_navigate:[]};let l={branch:[],error:null,url:null},n=!1,f=!1,m=!0,p=!1,g=!1,b=!1,R=!1,T,A=(Je=history.state)==null?void 0:Je[C];A||(A=Date.now(),history.replaceState({...history.state,[C]:A},"",location.href));const q=re[A];q&&(history.scrollRestoration="manual",scrollTo(q.x,q.y));let K,Pe,ae;async function je(){ae=ae||Promise.resolve(),await ae,ae=null;const a=new URL(location.href),c=we(a,!0);o=null,await Te(c,a,[])}async function me(a,{noScroll:c=!1,replaceState:u=!1,keepFocus:i=!1,state:h={},invalidateAll:d=!1},_,E){return typeof a=="string"&&(a=new URL(a,We(document))),ye({url:a,scroll:c?Oe():null,keepfocus:i,redirect_chain:_,details:{state:h,replaceState:u},nav_token:E,accepted:()=>{d&&(R=!0)},blocked:()=>{},type:"goto"})}async function Ne(a){const c=we(a,!1);if(!c)throw new Error(`Attempted to prefetch a URL that does not belong to this app: ${a}`);return o={id:c.id,promise:Ve(c).then(u=>(u.type==="loaded"&&u.state.error&&(o=null),u))},o.promise}async function Te(a,c,u,i,h={},d){var E,k;Pe=h;let _=a&&await Ve(a);if(_||(_=await Fe(c,{id:null},await te(new Error(`Not found: ${c.pathname}`),{url:c,params:{},route:{id:null}}),404)),c=(a==null?void 0:a.url)||c,Pe!==h)return!1;if(_.type==="redirect")if(u.length>10||u.includes(c.pathname))_=await oe({status:500,error:await te(new Error("Redirect loop"),{url:c,params:{},route:{id:null}}),url:c,route:{id:null}});else return me(new URL(_.location,c).href,{},[...u,c.pathname],h),!1;else((k=(E=_.props)==null?void 0:E.page)==null?void 0:k.status)>=400&&await W.updated.check()&&await se(c);if(t.length=0,R=!1,p=!0,i&&i.details){const{details:y}=i,v=y.replaceState?0:1;y.state[C]=A+=v,history[y.replaceState?"replaceState":"pushState"](y.state,"",c)}if(o=null,f){l=_.state,_.props.page&&(_.props.page.url=c);const y=fe();T.$set(_.props),y()}else Ue(_);if(i){const{scroll:y,keepfocus:v}=i;if(v||Re(),await ie(),m){const S=c.hash&&document.getElementById(c.hash.slice(1));y?scrollTo(y.x,y.y):S?S.scrollIntoView():scrollTo(0,0)}}else await ie();m=!0,_.props.page&&(K=_.props.page),d&&d(),p=!1}function Ue(a){var h,d;l=a.state;const c=document.querySelector("style[data-sveltekit]");c&&c.remove(),K=a.props.page;const u=fe();T=new Vt({target:r,props:{...a.props,stores:W},hydrate:!0}),u();const i={from:null,to:ce("to",{params:l.params,route:{id:(d=(h=l.route)==null?void 0:h.id)!=null?d:null},url:new URL(location.href)}),willUnload:!1,type:"enter"};s.after_navigate.forEach(_=>_(i)),f=!0}async function Q({url:a,params:c,branch:u,status:i,error:h,route:d,form:_}){var j;const E=u.filter(Boolean);let k="never";for(const I of u)(I==null?void 0:I.slash)!==void 0&&(k=I.slash);a.pathname=mt(a.pathname,k),a.search=a.search;const y={type:"loaded",state:{url:a,params:c,branch:u,error:h,route:d},props:{components:E.map(I=>I.node.component)}};_!==void 0&&(y.props.form=_);let v={},S=!K;for(let I=0;I<E.length;I+=1){const P=E[I];v={...v,...P.data},(S||!l.branch.some(U=>U===P))&&(y.props[`data_${I}`]=v,S=S||Object.keys((j=P.data)!=null?j:{}).length>0)}if(S||(S=Object.keys(K.data).length!==Object.keys(v).length),!l.url||a.href!==l.url.href||l.error!==h||_!==void 0||S){y.props.page={error:h,params:c,route:d,status:i,url:a,form:_,data:S?v:K.data},Object.defineProperty(y.props.page,"routeId",{get(){throw new Error("$page.routeId has been replaced by $page.route.id")},enumerable:!1});const I=(P,U)=>{Object.defineProperty(y.props.page,P,{get:()=>{throw new Error(`$page.${P} has been replaced by $page.url.${U}`)}})};I("origin","origin"),I("path","pathname"),I("query","searchParams")}return y}async function _e({loader:a,parent:c,url:u,params:i,route:h,server_data_node:d}){var y,v,S,N,j,I,P;let _=null;const E={dependencies:new Set,params:new Set,parent:!1,route:!1,url:!1},k=await a();if((y=k.shared)!=null&&y.load){let U=function(...w){for(const O of w){const{href:L}=new URL(O,u);E.dependencies.add(L)}};const x={route:{get id(){return E.route=!0,h.id}},params:new Proxy(i,{get:(w,O)=>(E.params.add(O),w[O])}),data:(v=d==null?void 0:d.data)!=null?v:null,url:yt(u,()=>{E.url=!0}),async fetch(w,O){let L;w instanceof Request?(L=w.url,O={body:w.method==="GET"||w.method==="HEAD"?void 0:await w.blob(),cache:w.cache,credentials:w.credentials,headers:w.headers,integrity:w.integrity,keepalive:w.keepalive,method:w.method,mode:w.mode,redirect:w.redirect,referrer:w.referrer,referrerPolicy:w.referrerPolicy,signal:w.signal,...O}):L=w;const $=new URL(L,u).href;return U($),f?St(L,$,O):Rt(L,O)},setHeaders:()=>{},depends:U,parent(){return E.parent=!0,c()}};Object.defineProperties(x,{props:{get(){throw new Error("@migration task: Replace `props` with `data` stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1},session:{get(){throw new Error("session is no longer available. See https://github.com/sveltejs/kit/discussions/5883")},enumerable:!1},stuff:{get(){throw new Error("@migration task: Remove stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1},routeId:{get(){throw new Error("routeId has been replaced by route.id")},enumerable:!1}}),_=(S=await k.shared.load.call(null,x))!=null?S:null,_=_?await Kt(_):null}return{node:k,loader:a,server:d,shared:(N=k.shared)!=null&&N.load?{type:"data",data:_,uses:E}:null,data:(j=_!=null?_:d==null?void 0:d.data)!=null?j:null,slash:(P=(I=k.shared)==null?void 0:I.trailingSlash)!=null?P:d==null?void 0:d.slash}}function De(a,c,u,i,h){if(R)return!0;if(!i)return!1;if(i.parent&&a||i.route&&c||i.url&&u)return!0;for(const d of i.params)if(h[d]!==l.params[d])return!0;for(const d of i.dependencies)if(t.some(_=>_(new URL(d))))return!0;return!1}function ge(a,c){var u,i;return(a==null?void 0:a.type)==="data"?{type:"data",data:a.data,uses:{dependencies:new Set((u=a.uses.dependencies)!=null?u:[]),params:new Set((i=a.uses.params)!=null?i:[]),parent:!!a.uses.parent,route:!!a.uses.route,url:!!a.uses.url},slash:a.slash}:(a==null?void 0:a.type)==="skip"&&c!=null?c:null}async function Ve({id:a,invalidating:c,url:u,params:i,route:h}){var x;if((o==null?void 0:o.id)===a)return o.promise;const{errors:d,layouts:_,leaf:E}=h,k=[..._,E];d.forEach(w=>w==null?void 0:w().catch(()=>{})),k.forEach(w=>w==null?void 0:w[1]().catch(()=>{}));let y=null;const v=l.url?a!==l.url.pathname+l.url.search:!1,S=l.route?a!==l.route.id:!1,N=k.reduce((w,O,L)=>{var ee;const $=l.branch[L],H=!!(O!=null&&O[0])&&(($==null?void 0:$.loader)!==O[1]||De(w.some(Boolean),S,v,(ee=$.server)==null?void 0:ee.uses,i));return w.push(H),w},[]);if(N.some(Boolean)){try{y=await Ze(u,N)}catch(w){return oe({status:500,error:await te(w,{url:u,params:i,route:{id:h.id}}),url:u,route:h})}if(y.type==="redirect")return y}const j=y==null?void 0:y.nodes;let I=!1;const P=k.map(async(w,O)=>{var ee;if(!w)return;const L=l.branch[O],$=j==null?void 0:j[O];if((!$||$.type==="skip")&&w[1]===(L==null?void 0:L.loader)&&!De(I,S,v,(ee=L.shared)==null?void 0:ee.uses,i))return L;if(I=!0,($==null?void 0:$.type)==="error")throw $;return _e({loader:w[1],url:u,params:i,route:h,parent:async()=>{var Ke;const Ge={};for(let be=0;be<O;be+=1)Object.assign(Ge,(Ke=await P[be])==null?void 0:Ke.data);return Ge},server_data_node:ge($===void 0&&w[0]?{type:"skip"}:$!=null?$:null,L==null?void 0:L.server)})});for(const w of P)w.catch(()=>{});const U=[];for(let w=0;w<k.length;w+=1)if(k[w])try{U.push(await P[w])}catch(O){if(O instanceof Xe)return{type:"redirect",location:O.location};let L=500,$;j!=null&&j.includes(O)?(L=(x=O.status)!=null?x:L,$=O.error):O instanceof Ie?(L=O.status,$=O.body):$=await te(O,{params:i,url:u,route:{id:h.id}});const H=await Ce(w,U,d);return H?await Q({url:u,params:i,branch:U.slice(0,H.idx).concat(H.node),status:L,error:$,route:h}):await Fe(u,{id:h.id},$,L)}else U.push(void 0);return await Q({url:u,params:i,branch:U,status:200,error:null,route:h,form:c?void 0:null})}async function Ce(a,c,u){for(;a--;)if(u[a]){let i=a;for(;!c[i];)i-=1;try{return{idx:i+1,node:{node:await u[a](),loader:u[a],data:{},server:null,shared:null}}}catch{continue}}}async function oe({status:a,error:c,url:u,route:i}){var y;const h={},d=await Le();let _=null;if(d.server)try{const v=await Ze(u,[!0]);if(v.type!=="data"||v.nodes[0]&&v.nodes[0].type!=="data")throw 0;_=(y=v.nodes[0])!=null?y:null}catch{(u.origin!==location.origin||u.pathname!==location.pathname||n)&&await se(u)}const E=await _e({loader:Le,url:u,params:h,route:i,parent:()=>Promise.resolve({}),server_data_node:ge(_)}),k={node:await $e(),loader:$e,shared:null,server:null,data:null};return await Q({url:u,params:h,branch:[E,k],status:a,error:c,route:null})}function we(a,c){if(qe(a))return;const u=_t(a.pathname.slice(e.length)||"/");for(const i of le){const h=i.exec(u);if(h)return{id:a.pathname+a.search,invalidating:c,route:i,params:gt(h),url:a}}}function qe(a){return a.origin!==location.origin||!a.pathname.startsWith(e)}function Be({url:a,type:c,intent:u,delta:i}){var E,k,y,v,S;let h=!1;const d={from:ce("from",{params:l.params,route:{id:(k=(E=l.route)==null?void 0:E.id)!=null?k:null},url:l.url}),to:ce("to",{params:(y=u==null?void 0:u.params)!=null?y:null,route:{id:(S=(v=u==null?void 0:u.route)==null?void 0:v.id)!=null?S:null},url:a}),willUnload:!u,type:c};i!==void 0&&(d.delta=i);const _={...d,cancel:()=>{h=!0}};return g||s.before_navigate.forEach(N=>N(_)),h?null:d}async function ye({url:a,scroll:c,keepfocus:u,redirect_chain:i,details:h,type:d,delta:_,nav_token:E,accepted:k,blocked:y}){const v=we(a,!1),S=Be({url:a,type:d,delta:_,intent:v});if(!S){y();return}ke(A),k(),g=!0,f&&W.navigating.set(S),await Te(v,a,i,{scroll:c,keepfocus:u,details:h},E,()=>{g=!1,s.after_navigate.forEach(N=>N(S)),W.navigating.set(null)})}async function Fe(a,c,u,i){return a.origin===location.origin&&a.pathname===location.pathname&&!n?await oe({status:i,error:u,url:a,route:c}):await se(a)}function se(a){return location.href=a.href,new Promise(()=>{})}return{after_navigate:a=>{Se(()=>(s.after_navigate.push(a),()=>{const c=s.after_navigate.indexOf(a);s.after_navigate.splice(c,1)}))},before_navigate:a=>{Se(()=>(s.before_navigate.push(a),()=>{const c=s.before_navigate.indexOf(a);s.before_navigate.splice(c,1)}))},disable_scroll_handling:()=>{(p||!f)&&(m=!1)},goto:(a,c={})=>{if("keepfocus"in c&&!("keepFocus"in c))throw new Error("`keepfocus` has been renamed to `keepFocus` (note the difference in casing)");if("noscroll"in c&&!("noScroll"in c))throw new Error("`noscroll` has been renamed to `noScroll` (note the difference in casing)");return me(a,c,[])},invalidate:a=>{if(a===void 0)throw new Error("`invalidate()` (with no arguments) has been replaced by `invalidateAll()`");if(typeof a=="function")t.push(a);else{const{href:c}=new URL(a,location.href);t.push(u=>u.href===c)}return je()},invalidateAll:()=>(R=!0,je()),prefetch:async a=>{const c=new URL(a,We(document));await Ne(c)},prefetch_routes:async a=>{const u=(a?le.filter(i=>a.some(h=>i.exec(h))):le).map(i=>Promise.all([...i.layouts,i.leaf].map(h=>h==null?void 0:h[1]())));await Promise.all(u)},apply_action:async a=>{if(a.type==="error"){const c=new URL(location.href),{branch:u,route:i}=l;if(!i)return;const h=await Ce(l.branch.length,u,i.errors);if(h){const d=await Q({url:c,params:l.params,branch:u.slice(0,h.idx).concat(h.node),status:500,error:a.error,route:i});l=d.state;const _=fe();T.$set(d.props),_(),ie().then(Re)}}else if(a.type==="redirect")me(a.location,{invalidateAll:!0},[]);else{const c={form:a.data,page:{...K,form:a.data,status:a.status}},u=fe();T.$set(c),u(),a.type==="success"&&ie().then(Re)}},_start_router:()=>{history.scrollRestoration="manual",addEventListener("beforeunload",i=>{var d,_;let h=!1;if(!g){const E={from:ce("from",{params:l.params,route:{id:(_=(d=l.route)==null?void 0:d.id)!=null?_:null},url:l.url}),to:null,willUnload:!0,type:"leave",cancel:()=>h=!0};s.before_navigate.forEach(k=>k(E))}h?(i.preventDefault(),i.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){ke(A);try{sessionStorage[xe]=JSON.stringify(re)}catch{}}});const a=i=>{const{url:h,options:d,has:_}=ze(i);if(h&&d.prefetch&&!qe(h)){if(d.reload||_.rel_external||_.target||_.download)return;Ne(h)}};let c;const u=i=>{clearTimeout(c),c=setTimeout(()=>{var h;(h=i.target)==null||h.dispatchEvent(new CustomEvent("sveltekit:trigger_prefetch",{bubbles:!0}))},20)};r.addEventListener("touchstart",a,{passive:!0}),r.addEventListener("mousemove",u),r.addEventListener("sveltekit:trigger_prefetch",a),r.addEventListener("click",i=>{if(i.button||i.which!==1||i.metaKey||i.ctrlKey||i.shiftKey||i.altKey||i.defaultPrevented)return;const{a:h,url:d,options:_,has:E}=ze(i);if(!h||!d||!(h instanceof SVGAElement)&&d.protocol!==location.protocol&&!(d.protocol==="https:"||d.protocol==="http:")||E.download)return;if(_.reload||E.rel_external||E.target){Be({url:d,type:"link"})||i.preventDefault(),g=!0;return}const[y,v]=d.href.split("#");if(v!==void 0&&y===location.href.split("#")[0]){b=!0,ke(A),l.url=d,W.page.set({...K,url:d}),W.page.notify();return}ye({url:d,scroll:_.noscroll?Oe():null,keepfocus:!1,redirect_chain:[],details:{state:{},replaceState:d.href===location.href},accepted:()=>i.preventDefault(),blocked:()=>i.preventDefault(),type:"link"})}),addEventListener("popstate",i=>{var h;if((h=i.state)!=null&&h[C]){if(i.state[C]===A)return;const d=i.state[C]-A;ye({url:new URL(location.href),scroll:re[i.state[C]],keepfocus:!1,redirect_chain:[],details:null,accepted:()=>{A=i.state[C]},blocked:()=>{history.go(-d)},type:"popstate",delta:d})}}),addEventListener("hashchange",()=>{b&&(b=!1,history.replaceState({...history.state,[C]:++A},"",location.href))});for(const i of document.querySelectorAll("link"))i.rel==="icon"&&(i.href=i.href);addEventListener("pageshow",i=>{i.persisted&&W.navigating.set(null)})},_hydrate:async({status:a,error:c,node_ids:u,params:i,route:h,data:d,form:_})=>{var y;n=!0;const E=new URL(location.href);let k;try{const v=u.map(async(S,N)=>{const j=d[N];return _e({loader:pe[S],url:E,params:i,route:h,parent:async()=>{const I={};for(let P=0;P<N;P+=1)Object.assign(I,(await v[P]).data);return I},server_data_node:ge(j)})});k=await Q({url:E,params:i,branch:await Promise.all(v),status:a,error:c,form:_,route:(y=le.find(({id:S})=>S===h.id))!=null?y:null})}catch(v){if(v instanceof Xe){await se(new URL(v.location,location.href));return}k=await oe({status:v instanceof Ie?v.status:500,error:await te(v,{url:E,params:i,route:h}),url:E,route:h})}Ue(k)}}}async function Ze(r,e){var l;const t=new URL(r);t.pathname=Et(r.pathname);const o=await de(t.href,{headers:{"x-sveltekit-invalidated":e.map(n=>n?"1":"").join(",")}}),s=await o.json();if(!o.ok)throw new Error(s);return(l=s.nodes)==null||l.forEach(n=>{var f,m;(n==null?void 0:n.type)==="data"&&(n.data=Zt(n.data),n.uses={dependencies:new Set((f=n.uses.dependencies)!=null?f:[]),params:new Set((m=n.uses.params)!=null?m:[]),parent:!!n.uses.parent,route:!!n.uses.route,url:!!n.uses.url})}),s}function te(r,e){var t;return r instanceof Ie?r.body:(t=Gt.handleError({error:r,event:e}))!=null?t:{message:e.route.id!=null?"Internal Error":"Not Found"}}const xt=["hash","href","host","hostname","origin","pathname","port","protocol","search","searchParams","toString","toJSON"];function ce(r,e){for(const t of xt)Object.defineProperty(e,t,{get(){throw new Error(`The navigation shape changed - ${r}.${t} should now be ${r}.url.${t}`)},enumerable:!1});return Object.defineProperty(e,"routeId",{get(){throw new Error(`The navigation shape changed - ${r}.routeId should now be ${r}.route.id`)},enumerable:!1}),e}function fe(){return()=>{}}function Re(){const r=document.querySelector("[autofocus]");if(r)r.focus();else{const e=document.body,t=e.getAttribute("tabindex");e.tabIndex=-1,e.focus({preventScroll:!0}),setTimeout(()=>{var o;(o=getSelection())==null||o.removeAllRanges()}),t!==null?e.setAttribute("tabindex",t):e.removeAttribute("tabindex")}}async function nn({env:r,hydrate:e,paths:t,target:o,version:s}){ht(t),pt(s);const l=Qt({target:o,base:t.base});dt({client:l}),e?await l._hydrate(e):l.goto(location.href,{replaceState:!0}),l._start_router()}export{nn as start};
