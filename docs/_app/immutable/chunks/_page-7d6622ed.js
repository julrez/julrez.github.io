import{_ as o}from"./preload-helper-9b728935.js";const m=(s,r)=>{const t=s[r];return t?typeof t=="function"?t():Promise.resolve(t):new Promise((i,e)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(e.bind(null,new Error("Unknown variable dynamic import: "+r)))})};async function l({fetch:s}){const r=Object.entries(Object.assign({"/src/lib/posts/finally.md":()=>o(()=>import("./finally-fe27051d.js"),["./finally-fe27051d.js","./index-e41cafb2.js"],import.meta.url),"/src/lib/posts/project0.md":()=>o(()=>import("./project0-b3e1a581.js"),["./project0-b3e1a581.js","./index-e41cafb2.js"],import.meta.url),"/src/lib/posts/test.md":()=>o(()=>import("./test-8997cbb0.js"),["./test-8997cbb0.js","./index-e41cafb2.js","..\\assets\\test-d944c7a9.css"],import.meta.url),"/src/lib/posts/test2.md":()=>o(()=>import("./test2-baa5aa3e.js"),["./test2-baa5aa3e.js","./index-e41cafb2.js"],import.meta.url),"/src/lib/posts/webgpu.md":()=>o(()=>import("./webgpu-f53e70f1.js"),["./webgpu-f53e70f1.js","./index-e41cafb2.js"],import.meta.url)}));let t=[];for(let e=0;e<r.length;e++)t.push(r[e][0]);const i=[];for(let e=0;e<t.length;e++){let _=t[e].replace("/src/lib/posts/","").replace(".md","");i[e]=await m(Object.assign({"../../lib/posts/finally.md":()=>o(()=>import("./finally-fe27051d.js"),["./finally-fe27051d.js","./index-e41cafb2.js"],import.meta.url),"../../lib/posts/project0.md":()=>o(()=>import("./project0-b3e1a581.js"),["./project0-b3e1a581.js","./index-e41cafb2.js"],import.meta.url),"../../lib/posts/test.md":()=>o(()=>import("./test-8997cbb0.js"),["./test-8997cbb0.js","./index-e41cafb2.js","..\\assets\\test-d944c7a9.css"],import.meta.url),"../../lib/posts/test2.md":()=>o(()=>import("./test2-baa5aa3e.js"),["./test2-baa5aa3e.js","./index-e41cafb2.js"],import.meta.url),"../../lib/posts/webgpu.md":()=>o(()=>import("./webgpu-f53e70f1.js"),["./webgpu-f53e70f1.js","./index-e41cafb2.js"],import.meta.url)}),`../../lib/posts/${_}.md`)}return console.log(t),{postFilenames:t,posts:i}}const u=Object.freeze(Object.defineProperty({__proto__:null,load:l},Symbol.toStringTag,{value:"Module"}));export{u as _,l};
