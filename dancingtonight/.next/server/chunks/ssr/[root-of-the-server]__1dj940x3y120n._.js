module.exports=[66680,(a,b,c)=>{b.exports=a.x("node:crypto",()=>require("node:crypto"))},86607,a=>a.a(async(b,c)=>{try{var d=a.i(7997),e=a.i(37936),f=a.i(5246);a.i(70396);var g=a.i(73727),h=a.i(66680),i=a.i(66879),j=a.i(46046),k=b([i,j]);[i,j]=k.then?(await k)():k;let p="lw_admin";function l(){return(0,h.createHash)("sha256").update(`dancingtonight-admin:${process.env.ADMIN_PASSWORD}`).digest("hex")}async function m(){if(!process.env.ADMIN_PASSWORD)return!1;let a=(await (0,f.cookies)()).get(p)?.value??"",b=l();return a.length===b.length&&(0,h.timingSafeEqual)(Buffer.from(a),Buffer.from(b))}let q=async function(a){let b=String(a.get("password")??""),c=process.env.ADMIN_PASSWORD??"",d=c.length>0&&b.length===c.length&&(0,h.timingSafeEqual)(Buffer.from(b),Buffer.from(c));d&&(await (0,f.cookies)()).set(p,l(),{httpOnly:!0,sameSite:"strict",secure:!0,maxAge:1209600,path:"/admin"}),(0,g.redirect)(d?"/admin":"/admin?error=1")};(0,e.registerServerReference)(q,"40d1d411a6c75df9415422c474b42a1e3b38dd747f",null);let r=a=>null===a?"Not yet":`${Math.round(100*a)}%`;function n({title:a,rows:b,unit:c}){return(0,d.jsxs)("div",{className:"admin-box",children:[(0,d.jsx)("h3",{children:a}),0===b.length?(0,d.jsx)("p",{className:"empty",children:"No data yet."}):(0,d.jsx)("table",{children:(0,d.jsx)("tbody",{children:b.map(a=>(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:a.label}),(0,d.jsxs)("td",{className:"num",children:[a.count," ",c]})]},a.label))})})]})}async function o({searchParams:a}){if(!process.env.ADMIN_PASSWORD)return(0,d.jsxs)("div",{className:"admin",children:[(0,d.jsx)("h1",{children:"Admin"}),(0,d.jsx)("p",{children:"Set the ADMIN_PASSWORD environment variable in Vercel to turn on this page."})]});if(!await m()){let{error:b}=await a;return(0,d.jsxs)("div",{className:"admin",children:[(0,d.jsx)("h1",{children:"Admin"}),(0,d.jsxs)("form",{action:q,className:"admin-login",children:[(0,d.jsx)("input",{type:"password",name:"password",placeholder:"Password","aria-label":"Password",required:!0}),(0,d.jsx)("button",{type:"submit",children:"Sign in"})]}),b&&(0,d.jsx)("p",{className:"empty",children:"Wrong password."})]})}if(!(0,i.B)())return(0,d.jsxs)("div",{className:"admin",children:[(0,d.jsx)("h1",{children:"Admin"}),(0,d.jsx)("p",{children:"No database yet. In Vercel: Storage, Create Database, Neon (Postgres), connect it to this project. DATABASE_URL is then set automatically."})]});let[b,c,e,f,g,h,k]=await Promise.all([(0,j.R)(),(0,j.G)(30),(0,j.P)(),(0,j.Q)(),(0,j.D)(),(0,j.o)(),(0,j.Z)()]),l=Math.max(1,...c.map(a=>a.visitors)),p=[{label:"Visitors today",value:b.visitors1},{label:"Visitors, 7 days",value:b.visitors7},{label:"Visitors, 30 days",value:b.visitors30},{label:"Page views, 30 days",value:b.pageviews30},{label:"Came back on another day",value:r(b.returningRate30),hint:"share of 30 day visitors"},{label:"Source link clicks, 30 days",value:b.outbound30,hint:"visitors opening an organizer link"},{label:"Cities saved, 30 days",value:b.addCity30}];return(0,d.jsxs)("div",{className:"admin",children:[(0,d.jsx)("h1",{children:"Admin"}),(0,d.jsx)("div",{className:"tiles",children:p.map(a=>(0,d.jsxs)("div",{className:"tile",children:[(0,d.jsx)("span",{className:"tile-label",children:a.label}),(0,d.jsx)("strong",{children:a.value}),a.hint&&(0,d.jsx)("small",{children:a.hint})]},a.label))}),(0,d.jsxs)("div",{className:"admin-box",children:[(0,d.jsx)("h3",{children:"Daily visitors, last 30 days"}),(0,d.jsx)("div",{className:"bars",role:"img","aria-label":"Daily visitors bar chart; the table below has the same numbers",children:c.map(a=>(0,d.jsx)("div",{className:"bar-slot",title:`${a.day}: ${a.visitors} visitors (${a.newVisitors} new), ${a.pageviews} page views`,children:(0,d.jsx)("div",{className:"bar",style:{height:`${a.visitors/l*100}%`}})},a.day))}),(0,d.jsxs)("div",{className:"bars-axis",children:[(0,d.jsx)("span",{children:c[0]?.day}),(0,d.jsx)("span",{children:c[c.length-1]?.day})]}),(0,d.jsxs)("details",{children:[(0,d.jsx)("summary",{children:"Show as table"}),(0,d.jsxs)("table",{children:[(0,d.jsx)("thead",{children:(0,d.jsxs)("tr",{children:[(0,d.jsx)("th",{children:"Day"}),(0,d.jsx)("th",{className:"num",children:"Visitors"}),(0,d.jsx)("th",{className:"num",children:"New"}),(0,d.jsx)("th",{className:"num",children:"Page views"})]})}),(0,d.jsx)("tbody",{children:[...c].reverse().map(a=>(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:a.day}),(0,d.jsx)("td",{className:"num",children:a.visitors}),(0,d.jsx)("td",{className:"num",children:a.newVisitors}),(0,d.jsx)("td",{className:"num",children:a.pageviews})]},a.day))})]})]})]}),(0,d.jsxs)("div",{className:"admin-box",children:[(0,d.jsx)("h3",{children:"Retention by first visit week"}),(0,d.jsx)("p",{className:"empty",children:'Of the people who first came in a week, the share that returned. Shows "Not yet" until enough time has passed.'}),(0,d.jsxs)("table",{children:[(0,d.jsx)("thead",{children:(0,d.jsxs)("tr",{children:[(0,d.jsx)("th",{children:"First week"}),(0,d.jsx)("th",{className:"num",children:"New visitors"}),(0,d.jsx)("th",{className:"num",children:"Back within 7 days"}),(0,d.jsx)("th",{className:"num",children:"Back on day 8 to 30"})]})}),(0,d.jsx)("tbody",{children:e.map(a=>(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:a.week}),(0,d.jsx)("td",{className:"num",children:a.size}),(0,d.jsx)("td",{className:"num",children:r(a.week1)}),(0,d.jsx)("td",{className:"num",children:r(a.week4)})]},a.week))})]})]}),(0,d.jsxs)("div",{className:"admin-grid",children:[(0,d.jsx)(n,{title:"Most viewed cities",rows:f,unit:"visitors"}),(0,d.jsx)(n,{title:"Where visitors come from",rows:g,unit:"visitors"}),(0,d.jsx)(n,{title:"Visitor countries",rows:h,unit:"visitors"}),(0,d.jsx)(n,{title:"Most clicked source links",rows:k,unit:"clicks"})]})]})}a.s(["$$RSC_SERVER_ACTION_0",0,q,"default",0,o,"dynamic",0,"force-dynamic","metadata",0,{title:"Admin",robots:{index:!1,follow:!1}}]),c()}catch(a){c(a)}},!1),46046,a=>a.a(async(b,c)=>{try{var d=a.i(66879),e=b([d]);async function f(){let[a]=await (0,d.z)(`
    WITH v AS (
      SELECT visitor_id, COUNT(DISTINCT ts::date) AS days
      FROM events WHERE ts > now() - interval '30 days' GROUP BY visitor_id
    )
    SELECT
      (SELECT COUNT(DISTINCT visitor_id) FROM events WHERE ts > now() - interval '1 day') AS visitors1,
      (SELECT COUNT(DISTINCT visitor_id) FROM events WHERE ts > now() - interval '7 days') AS visitors7,
      (SELECT COUNT(*) FROM v) AS visitors30,
      (SELECT COUNT(*) FROM events WHERE event = 'pageview' AND ts > now() - interval '30 days') AS pageviews30,
      (SELECT COUNT(*) FILTER (WHERE days >= 2) FROM v) AS returning30,
      (SELECT COUNT(*) FROM events WHERE event = 'outbound' AND ts > now() - interval '30 days') AS outbound30,
      (SELECT COUNT(*) FROM events WHERE event = 'add_city' AND ts > now() - interval '30 days') AS addcity30
  `),b=Number(a.visitors30);return{visitors1:Number(a.visitors1),visitors7:Number(a.visitors7),visitors30:b,pageviews30:Number(a.pageviews30),returningRate30:b?Number(a.returning30)/b:0,outbound30:Number(a.outbound30),addCity30:Number(a.addcity30)}}async function g(a=30){return(await (0,d.z)(`WITH first_seen AS (SELECT visitor_id, MIN(ts::date) AS d FROM events GROUP BY visitor_id),
     series AS (SELECT generate_series(current_date - ($1::int - 1), current_date, interval '1 day')::date AS day)
     SELECT to_char(s.day, 'YYYY-MM-DD') AS day,
       COUNT(DISTINCT e.visitor_id) AS visitors,
       COUNT(DISTINCT e.visitor_id) FILTER (WHERE f.d = s.day) AS new_visitors,
       COUNT(e.id) FILTER (WHERE e.event = 'pageview') AS pageviews
     FROM series s
     LEFT JOIN events e ON e.ts::date = s.day
     LEFT JOIN first_seen f ON f.visitor_id = e.visitor_id
     GROUP BY s.day ORDER BY s.day`,[a])).map(a=>({day:a.day,visitors:Number(a.visitors),newVisitors:Number(a.new_visitors),pageviews:Number(a.pageviews)}))}async function h(){let a=await (0,d.z)(`
    WITH first_seen AS (SELECT visitor_id, MIN(ts) AS first_ts FROM events GROUP BY visitor_id),
    returns AS (
      SELECT f.visitor_id, date_trunc('week', f.first_ts) AS week, f.first_ts,
        BOOL_OR(e.ts::date BETWEEN f.first_ts::date + 1 AND f.first_ts::date + 7) AS w1,
        BOOL_OR(e.ts::date BETWEEN f.first_ts::date + 8 AND f.first_ts::date + 30) AS w4
      FROM first_seen f JOIN events e USING (visitor_id)
      GROUP BY f.visitor_id, f.first_ts
    )
    SELECT to_char(week, 'YYYY-MM-DD') AS week, COUNT(*) AS size,
      COUNT(*) FILTER (WHERE w1) AS w1,
      COUNT(*) FILTER (WHERE w4) AS w4,
      MAX(first_ts) AS last_first
    FROM returns
    WHERE week > now() - interval '12 weeks'
    GROUP BY week ORDER BY week DESC
  `),b=Date.now();return a.map(a=>{let c=Number(a.size),d=(b-new Date(a.week).getTime())/864e5;return{week:a.week,size:c,week1:d>=14?Number(a.w1)/c:null,week4:d>=37?Number(a.w4)/c:null}})}async function i(a){return(await (0,d.z)(a)).map(a=>({label:a.label??"(none)",count:Number(a.count)}))}[d]=e.then?(await e)():e,a.s(["P",0,h,"G",0,g,"R",0,f,"Q",0,()=>i(`SELECT city AS label, COUNT(DISTINCT visitor_id) AS count FROM events
       WHERE event = 'pageview' AND city IS NOT NULL AND ts > now() - interval '30 days'
       GROUP BY city ORDER BY count DESC LIMIT 15`),"o",0,()=>i(`SELECT COALESCE(country, 'Unknown') AS label, COUNT(DISTINCT visitor_id) AS count FROM events
       WHERE ts > now() - interval '30 days' GROUP BY label ORDER BY count DESC LIMIT 10`),"Z",0,()=>i(`SELECT target AS label, COUNT(*) AS count FROM events
       WHERE event = 'outbound' AND ts > now() - interval '30 days'
       GROUP BY target ORDER BY count DESC LIMIT 10`),"D",0,()=>i(`SELECT COALESCE(referrer_host, 'Direct or unknown') AS label, COUNT(DISTINCT visitor_id) AS count FROM events
       WHERE event = 'pageview' AND ts > now() - interval '30 days'
       GROUP BY label ORDER BY count DESC LIMIT 10`)]),c()}catch(a){c(a)}},!1),66879,a=>a.a(async(b,c)=>{try{var d=a.i(23862),e=b([d]);[d]=e.then?(await e)():e;let h=null,i=null;function f(){if(!h){let a=process.env.DATABASE_URL,b=/localhost|127\.0\.0\.1/.test(a);h=new d.Pool({connectionString:a,max:3,ssl:b?void 0:{rejectUnauthorized:!1}})}return h}async function g(a,b=[]){return await (!i&&(i=f().query(`CREATE TABLE IF NOT EXISTS events (
          id BIGSERIAL PRIMARY KEY,
          ts TIMESTAMPTZ NOT NULL DEFAULT now(),
          visitor_id TEXT NOT NULL,
          event TEXT NOT NULL,
          path TEXT,
          city TEXT,
          target TEXT,
          referrer_host TEXT,
          country TEXT
        );
        CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts);
        CREATE INDEX IF NOT EXISTS events_visitor_idx ON events (visitor_id, ts);`).then(()=>void 0).catch(a=>{throw i=null,a})),i),(await f().query(a,b)).rows}a.s(["B",0,function(){return!!process.env.DATABASE_URL},"z",0,g]),c()}catch(a){c(a)}},!1),37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1dj940x3y120n._.js.map