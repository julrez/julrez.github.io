import{_ as t}from"./preload-helper-9b728935.js";const m=(_,r)=>{const o=_[r];return o?typeof o=="function"?o():Promise.resolve(o):new Promise((i,e)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(e.bind(null,new Error("Unknown variable dynamic import: "+r)))})};async function p({fetch:_}){const r=Object.entries(Object.assign({"/src/lib/posts/finally.md":()=>t(()=>import("./finally-fe27051d.js"),["./finally-fe27051d.js","./index-e41cafb2.js"],import.meta.url),"/src/lib/posts/project0.md":()=>t(()=>import("./project0-b3e1a581.js"),["./project0-b3e1a581.js","./index-e41cafb2.js"],import.meta.url),"/src/lib/posts/test.md":()=>t(()=>import("./test-8997cbb0.js"),["./test-8997cbb0.js","./index-e41cafb2.js","..\\assets\\test-d944c7a9.css"],import.meta.url),"/src/lib/posts/test2.md":()=>t(()=>import("./test2-baa5aa3e.js"),["./test2-baa5aa3e.js","./index-e41cafb2.js"],import.meta.url),"/src/lib/posts/update3.md":()=>t(()=>import("./update3-8266799c.js"),["./update3-8266799c.js","./index-e41cafb2.js"],import.meta.url),"/src/lib/posts/webgpu.md":()=>t(()=>import("./webgpu-f53e70f1.js"),["./webgpu-f53e70f1.js","./index-e41cafb2.js"],import.meta.url)}));let o=[];for(let e=0;e<r.length;e++)o.push(r[e][0]);const i=[];for(let e=0;e<o.length;e++){let s=o[e].replace("/src/lib/posts/","").replace(".md","");i[e]=await m(Object.assign({"../../lib/posts/finally.md":()=>t(()=>import("./finally-fe27051d.js"),["./finally-fe27051d.js","./index-e41cafb2.js"],import.meta.url),"../../lib/posts/project0.md":()=>t(()=>import("./project0-b3e1a581.js"),["./project0-b3e1a581.js","./index-e41cafb2.js"],import.meta.url),"../../lib/posts/test.md":()=>t(()=>import("./test-8997cbb0.js"),["./test-8997cbb0.js","./index-e41cafb2.js","..\\assets\\test-d944c7a9.css"],import.meta.url),"../../lib/posts/test2.md":()=>t(()=>import("./test2-baa5aa3e.js"),["./test2-baa5aa3e.js","./index-e41cafb2.js"],import.meta.url),"../../lib/posts/update3.md":()=>t(()=>import("./update3-8266799c.js"),["./update3-8266799c.js","./index-e41cafb2.js"],import.meta.url),"../../lib/posts/webgpu.md":()=>t(()=>import("./webgpu-f53e70f1.js"),["./webgpu-f53e70f1.js","./index-e41cafb2.js"],import.meta.url)}),`../../lib/posts/${s}.md`)}return console.log(o),{postFilenames:o,posts:i}}const u=Object.freeze(Object.defineProperty({__proto__:null,load:p},Symbol.toStringTag,{value:"Module"}));export{u as _,p as l};