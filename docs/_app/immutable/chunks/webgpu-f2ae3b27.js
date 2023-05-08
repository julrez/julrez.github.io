import{S as Da,i as Ba,s as Ma,k as r,a as f,q as n,l,c as h,m as u,r as o,h as t,N as Za,n as p,p as da,b as i,G as s,B as Ft}from"./index-d063f04b.js";function Xa(pa){let m,Lt,le,w,ue,D,Ge,fe,B,Ce,he,g,Re,O,We,Se,Q,qe,je,ce,M,Ke,de,Z,Je,pe,X,Oe,me,Y,Qe,ge,F,Ve,ye,_,ma=`<code class="language-undefined">@group(0) @binding(0) var outputTexture: texture_storage_2d&lt;rgba16float, write&gt;;
@group(0) @binding(1) var&lt;uniform&gt; constants: Constants;
@group(0) @binding(2) var&lt;storage, read&gt; chunkBuffer: array&lt;u32&gt;;
@group(0) @binding(3) var&lt;storage, read&gt; accelerationBuffer: array&lt;u32&gt;;
@group(0) @binding(4) var depthTexture: texture_2d&lt;f32&gt;;
@group(0) @binding(5) var colorTexture: texture_2d&lt;f32&gt;;

@group(1) @binding(0) var&lt;storage, read_write&gt; debugInfo: DebugMsgInfo;</code>`,be,L,$e,xe,c,et,V,tt,at,$,it,st,ee,nt,ot,te,rt,lt,ve,d,ut,ae,ft,ht,ie,ct,dt,se,pt,mt,we,y,gt,ne,yt,bt,oe,xt,vt,_e,N,wt,Ee,E,ga=`<code class="language-undefined">@compute @workgroup_size(8,8) // 64 invocations per workgroup
fn main(@builtin(global_invocation_id) globalID: vec3&lt;u32&gt;)
&#123;
    // constants.width is Math.ceil(canvas.width*Math.sqrt(1/2));
    // constants.height is Math.ceil(canvas.height*Math.sqrt(1/2));
    if (globalID.x &gt; constants.width || globalID.y &gt; constants.height) &#123;
        return;
    &#125;
    // code to fetch position, normal and ray from primary ray compute shader&#39;s resources
    // ...

    let shininess = 128.0f;
    let specularStrength = 0.5f;

    let lightPos = vec3&lt;f32&gt;(-6612.37984732f, 4207.50836314f, -6210.74118997f);
    let lightDir = normalize(lightPos-originPos);
    let viewDir = normalize(cameraPos-originPos);

    // normal added to pos to get outside of voxel
    let hit = cast_ray(originPos+normal*0.005, lightDir*32.0f);

    // from learnopengl.com
    let reflectDir = reflect(-lightDir, normal);
    let specular = specularStrength
        * pow(max(dot(viewDir, reflectDir), 0.0f), shininess);

    let diffuse = max(dot(normal, lightDir), 0.0f);
    let ambient = 0.3f;
    var outputLighting = ambient;
    if (hit) &#123;
        outputLighting += diffuse+specular;
    &#125;
    textureStore(outputTexture, vec2(globalID.xy), vec4(outputLighting, 0f, 0f, 0f));
&#125;</code>`,Ie,x,_t,re,Et,It,Pe,I,ya=`<code class="language-undefined">from LSB-&gt;MSB
5 bits: distance in negative x direction (from voxel&#39;s position)
5 bits: distance in negative y direction
5 bits: distance in negative z direction
5 bits: distance in positive x direction (from (voxel&#39;s x positition+1))
5 bits: distance in positive y direction
5 bits: distance in positive z direction

top 2 bits: type, should be binary 10</code>`,ze,U,Pt,ke,A,zt,Te,P,ba=`<code class="language-undefined">fn cast_ray(pos: vec3&lt;f32&gt;, dir: vec3&lt;f32&gt;) -&gt; bool
&#123;
	var rayDir = dir;
	if (abs(rayDir.x) &lt; 0.001) &#123;
		rayDir.x = 0.001;
	&#125;
	if (abs(rayDir.y) &lt; 0.001) &#123;
		rayDir.y = 0.001;
	&#125;
	if (abs(rayDir.z) &lt; 0.001) &#123;
		rayDir.z = 0.001;
	&#125;

	var origin = pos;
	var invDir = vec3&lt;f32&gt;(1.0f, 1.0f, 1.0f) / rayDir;
	let sign1or0 = vec3&lt;u32&gt;(u32(rayDir.x&gt;0.0), u32(rayDir.y&gt;0.0), u32(rayDir.z&gt;0.0));
	var gridPos = vec3&lt;u32&gt;(origin);
	
	let addULP = vec3&lt;u32&gt;(
		select(bitcast&lt;u32&gt;(-1), 1u, rayDir.x&gt;0.0),
		select(bitcast&lt;u32&gt;(-1), 1u, rayDir.y&gt;0.0),
		select(bitcast&lt;u32&gt;(-1), 1u, rayDir.z&gt;0.0),
	);
	rayDir.x = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(rayDir.x)+1u);
	rayDir.y = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(rayDir.y)+1u);
	rayDir.z = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(rayDir.z)+1u);
	
	origin.x = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(origin.x)+addULP.x);
	origin.y = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(origin.y)+addULP.y);
	origin.z = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(origin.z)+addULP.z);

    //...</code>`,De,H,kt,Be,z,xa=`<code class="language-undefined">    var voxel = 0u;
    var chunkIndex: u32;
    var oldAccelerationIndex: u32 = 0xFFFFFFFFu;
    var i = 0;
    for (; i &lt; 256; i++) &#123;
        let accelerationIndex: u32 = (((gridPos.z &gt;&gt; 3u) &lt;&lt; 16u)
            | ((gridPos.y &gt;&gt; 3u) &lt;&lt; 8u) | (gridPos.x &gt;&gt; 3u));
        
        if (oldAccelerationIndex != accelerationIndex) &#123;
            chunkIndex = accelerationBuffer[accelerationIndex];
        &#125;
        oldAccelerationIndex = accelerationIndex;
        
        var mask = 0xFFFFFFFFu;
        var shift = 0u;

        if ((chunkIndex &amp; 2147483648u) == 0u) &#123; // iterating over voxel
            let voxelIndex: u32 = chunkIndex
                | ((gridPos.x &amp; 7u))
                | ((gridPos.y &amp; 7u) &lt;&lt; 3u)
                | ((gridPos.z &amp; 7u) &lt;&lt; 6u);
            voxel = chunkBuffer[voxelIndex];
        &#125; else &#123; // iterating over chunk
            voxel = chunkIndex;
            mask = ~7u;
            shift = 3u;
        &#125;

        // exits if border or non-transparent voxel
        if ((voxel &amp; 3221225472u) != 2147483648u) &#123;
            break;
        &#125;

        // approach: generate furthest plane of the cuboid on each x, y and z plane
        // then try to find the plane that has the smallest distance to the ray.
        // Finally, advance the ray with that smallest distance
        let box = (gridPos &amp; vec3&lt;u32&gt;(mask, mask, mask)) - (
            (((vec3&lt;u32&gt;(voxel, voxel, voxel) &gt;&gt; (vec3&lt;u32&gt;(0u, 5u, 10u)+sign1or0*15u))
            &amp; vec3&lt;u32&gt;(31u, 31u, 31u)) ^ vec3&lt;u32&gt;(-vec3&lt;i32&gt;(sign1or0)))
            &lt;&lt; vec3&lt;u32&gt;(shift, shift, shift));
        let t = (vec3&lt;f32&gt;(box) - origin) * invDir;
        
        let tmin = min(min(t.x, t.y), t.z);
        let newTmin = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(tmin)+1u);
        var newPos = origin+rayDir*newTmin;
        newPos.x = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(newPos.x)+addULP.x);
        newPos.y = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(newPos.y)+addULP.y);
        newPos.z = bitcast&lt;f32&gt;(bitcast&lt;u32&gt;(newPos.z)+addULP.z);
        gridPos = vec3&lt;u32&gt;(newPos);
    &#125;
    return (voxel &amp; 3221225472u) != 0u;
&#125;</code>`,Me,G,Tt,Ze,C,Dt,Xe,R,Bt,Ye,W,Mt,Fe,S,Zt,Le,k,va=`<code class="language-undefined">// inax, inay, inaz is index in accelerationBuffer
void acceleration_area_calculate_df(uint16_t inax, uint16_t inay, uint16_t inaz)
&#123;
    // summed area table expanded by 4 voxels in each direction
    uint16_t *sat = malloc(40*40*40*sizeof(uint16_t));
    uint16_t maxDFIterationCount = 31;
    
    // generate summed area table
    for (uint16_t z = 0,satIndex=0; z &lt; 40; z++) &#123;
    for (uint16_t y = 0; y &lt; 40; y++) &#123;
    for (uint16_t x = 0; x &lt; 40; x++,satIndex++) &#123;
    	int accelerationX = inax+x-4;
    	int accelerationY = inay+y-4;
    	int accelerationZ = inaz+z-4;
    	uint32_t accelerationIndex = (accelerationZ&lt;&lt;16)
    		| (accelerationY&lt;&lt;8) | accelerationX;
    	
    	uint16_t sum;
    	if (accelerationX &lt; 0 || accelerationY &lt; 0 || accelerationZ &lt; 0
    			|| accelerationX &gt; 255 || accelerationY &gt; 255
    			|| accelerationZ &gt; 255) &#123;
            // outside map
    		sum = 1;
    	&#125; else &#123;
    		uint32_t voxel = accelerationBufferData[accelerationIndex];
    		switch (voxel &amp; (3u &lt;&lt; 30)) &#123;
    		case 0u: // chunk index
    			sum = 1;
    			break;
    		case 3u&lt;&lt;30: // border
    			sum = 1;
    			break;
    		case 2u&lt;&lt;30: // air or empty cuboid field
    			sum = 0;
    			break;
    		default: __builtin_unreachable();
    		&#125;
    	&#125;
    	
    	if (x &gt; 0 &amp;&amp; y &gt; 0 &amp;&amp; z &gt; 0) &#123;
    		sum += sat_get_element(sat, 40, x-1, y-1, z-1);
    	&#125;
    	if (z &gt; 0) &#123;
    		sum += sat_get_element(sat, 40, x, y, z-1);
    	&#125;
    	if (y &gt; 0) &#123;
    		sum += sat_get_element(sat, 40, x, y-1, z);
    	&#125;
    	if (x &gt; 0) &#123;
    		sum += sat_get_element(sat, 40, x-1, y, z);
    	&#125;
    	if (x &gt; 0 &amp;&amp; y &gt; 0) &#123;
    		sum -= sat_get_element(sat, 40, x-1, y-1, z);
    	&#125;
    	if (y &gt; 0 &amp;&amp; z &gt; 0) &#123;
    		sum -= sat_get_element(sat, 40, x, y-1, z-1);
    	&#125;
    	if (x &gt; 0 &amp;&amp; z &gt; 0) &#123;
    		sum -= sat_get_element(sat, 40, x-1, y, z-1);
    	&#125;
    	
    	sat[satIndex] = sum;
    &#125;&#125;&#125;

    // ...</code>`,Ne,q,Xt,Ue,T,wa=`<code class="language-undefined">    for (uint16_t z = 0,satIndex=0; z &lt; 32; z++) &#123;
    for (uint16_t y = 0; y &lt; 32; y++) &#123;
    for (uint16_t x = 0; x &lt; 32; x++,satIndex++) &#123;
        uint16_t accelerationX = inax+x;
        uint16_t accelerationY = inay+y;
        uint16_t accelerationZ = inaz+z;
        
        uint32_t accelerationIndex = (accelerationZ&lt;&lt;16)
            | (accelerationY&lt;&lt;8) | accelerationX;
        uint32_t voxel = accelerationBufferData[accelerationIndex];
        if ((voxel &amp; (3u &lt;&lt; 30)) != (2u &lt;&lt; 30)) &#123;
            continue;
        &#125;

        int satX = x+4;
        int satY = y+4;
        int satZ = z+4;

        int x0 = satX;
        int y0 = satY;
        int z0 = satZ;
        int x1 = satX;
        int y1 = satY;
        int z1 = satZ;

        // 2: no intersection has been found in that direction
        // 1: 1 intersection found
        // 0: can&#39;t continue
        uint8_t xNegExpand = 2;
        uint8_t yNegExpand = 2;
        uint8_t zNegExpand = 2;
        uint8_t xPosExpand = 2;
        uint8_t yPosExpand = 2;
        uint8_t zPosExpand = 2;
        
        // approach:
        // try to expand in each direction
        // if can not expand in that direction -&gt; stop trying
        for (uint16_t i = 0; i &lt; maxDFIterationCount; i++) &#123;
            if (x0 &lt; 1) xNegExpand = 0;
            if (y0 &lt; 1) yNegExpand = 0;
            if (z0 &lt; 1) zNegExpand = 0;
            if (x1 &gt; 38) xPosExpand = 0;
            if (y1 &gt; 38) yPosExpand = 0;
            if (z1 &gt; 38) zPosExpand = 0;

            uint16_t targetX0 = x0-(xNegExpand == 2);
            uint16_t targetY0 = y0-(yNegExpand == 2);
            uint16_t targetZ0 = z0-(zNegExpand == 2);
            uint16_t targetX1 = x1+(xPosExpand == 2);
            uint16_t targetY1 = y1+(yPosExpand == 2);
            uint16_t targetZ1 = z1+(zPosExpand == 2);

            if (xNegExpand) &#123;
                if (0 == sat_get_sum(sat, 40,
                            x0-1, targetY0, targetZ0,
                            x0-1, targetY1, targetZ1)) &#123;
                    x0--;
                    targetX0 = x0;
                &#125; else &#123;
                    xNegExpand = 1;
                &#125;
            &#125;
            if (yNegExpand) &#123;
                if (0 == sat_get_sum(sat, 40,
                            targetX0, y0-1, targetZ0,
                            targetX1, y0-1, targetZ1)) &#123;
                    y0--;
                    targetY0 = y0;
                &#125; else &#123;
                    yNegExpand = 1;
                &#125;
            &#125;
            if (zNegExpand) &#123;
                if (0 == sat_get_sum(sat, 40,
                            targetX0, targetY0, z0-1,
                            targetX1, targetY1, z0-1)) &#123;
                    z0--;
                    targetZ0 = z0;
                &#125; else &#123;
                    zNegExpand = 1;
                &#125;
            &#125;
            if (xPosExpand) &#123;
                if (0 == sat_get_sum(sat, 40,
                            x1+1, targetY0, targetZ0,
                            x1+1, targetY1, targetZ1)) &#123;
                    x1++;
                    targetX1 = x1;
                &#125; else &#123;
                    xPosExpand = 1;
                &#125;
            &#125;
            if (yPosExpand) &#123;
                if (0 == sat_get_sum(sat, 40,
                            targetX0, y1+1, targetZ0,
                            targetX1, y1+1, targetZ1)) &#123;
                    y1++;
                    targetY1 = y1;
                &#125; else &#123;
                    yPosExpand = 1;
                &#125;
            &#125;
            if (zPosExpand) &#123;
                if (0 == sat_get_sum(sat, 40,
                            targetX0, targetY0, z1+1,
                            targetX1, targetY1, z1+1)) &#123;
                    z1++;
                    targetZ1 = z1;
                &#125; else &#123;
                    zPosExpand = 1;
                &#125;
            &#125;
        &#125;
        voxel = (1 &lt;&lt; 31)
            | (satX-x0) | ((satY-y0) &lt;&lt; 5) | ((satZ-z0) &lt;&lt; 10)
            | ((x1-satX) &lt;&lt; 15) | ((y1-satY) &lt;&lt; 20) | ((z1-satZ) &lt;&lt; 25);
        accelerationBufferData[accelerationIndex] = voxel;
    &#125;&#125;&#125;
&#125;</code>`,Ae,j,Yt;return{c(){m=r("img"),le=f(),w=r("link"),ue=f(),D=r("p"),Ge=n(`In the last 2 weeks I have transitioned from webgl to webgpu and added a more performant rendering system.
I have also added ray-traced shadows, rendered at half resolution to not lag on the shitty school laptops.
I also tried out creating all the chunks for the game in C with webassembly, however, I have not yet ported
that chunks load as you move. Right now lots of chunks load the second you load the page.
Additionally, a skybox has been implemented.`),fe=f(),B=r("h2"),Ce=n("Why did I switch to webGPU?"),he=f(),g=r("p"),Re=n(`The reason I went for webGPU is because that I can have compute shaders, which I emulated with fragment
shaders before. However, the best thing to come from switching to webGPU is better debugging which I really
needed. I implemented a buffer and if the `),O=r("i"),We=n("shaderDebugEnabled"),Se=n(` flag is true, then that buffer is bound
to every single shader pipeline. Then in the shaders I have implemented a `),Q=r("i"),qe=n("debug_print"),je=n(` function which
makes me able to console.log in a compute shader! This is not perfect but much better than nothing that I had
when using webGL.`),ce=f(),M=r("h2"),Ke=n("Why did I switch to using C with webassembly"),de=f(),Z=r("p"),Je=n("Doing integer operations with floats and no static typing was just not fun."),pe=f(),X=r("h2"),Oe=n("A dive into the ray-traced shadows"),me=f(),Y=r("p"),Qe=n("With webGPU, you use the shading language wgsl which I now will show with the shadow tracing compute shader."),ge=f(),F=r("p"),Ve=n(`In the beginning of the shader, I have code to import resources from other shaders. This compute shader takes
the depth information from the previous primary ray compute shader to get the position from where to start tracing.
Therefore, quite a lot of resources are used.`),ye=f(),_=r("pre"),be=f(),L=r("p"),$e=n("In webGPU, resources get bound combined in a group, where every single resource get one binding in that group."),xe=f(),c=r("p"),et=n("The two most important resources that are used in most shaders are "),V=r("em"),tt=n("chunkBuffer"),at=n(" and "),$=r("em"),it=n("accelerationBuffer"),st=n(`.
`),ee=r("em"),nt=n("accelerationBuffer"),ot=n(" is a 3d array with the size of 256x256x256 that has indices to "),te=r("em"),rt=n("chunkBuffer"),lt=n(` which
it itself stores 8x8x8 voxel chunks.`),ve=f(),d=r("p"),ut=n(`An element in the accelerationBuffer array can be other things than indices, however.
The top 2 bits say which type the chunk at that position is. Two top bits of binary `),ae=r("em"),ft=n("00"),ht=n(` means that an
index to a chunk is stored. Two top bits of binary `),ie=r("em"),ct=n("11"),dt=n(` means that the chunk is outside the boundaries.
Finally, two top bits of binary `),se=r("em"),pt=n("10"),mt=n(" means that the type is a special distance field I will talk about later."),we=f(),y=r("p"),gt=n("Almost the same thing applies to chunkBuffer. An element there is a voxel if the two top bits are binary "),ne=r("em"),yt=n("00"),bt=n(`,
and a special distance field if `),oe=r("em"),xt=n("10"),vt=n("."),_e=f(),N=r("p"),wt=n("The main function to do the lighting is pretty simple, and is as follows (with some parts removed):"),Ee=f(),E=r("pre"),Ie=f(),x=r("p"),_t=n(`The interesting part happens in the cast_ray function, but before then we must talk about the distance field I was
talking about earlier.
When the top 2 bits are `),re=r("em"),Et=n("10"),It=n(` in binary, the approximately largest cuboid that can be made in that empty area is stored.
The format is as follows:`),Pe=f(),I=r("pre"),ze=f(),U=r("p"),Pt=n(`This cuboid is then used to accelerate raytracing.
Because in the cast ray function I can skip the whole area that the cuboid stores instead
of needing to iterate over every single voxel which would be really slow.`),ke=f(),A=r("p"),zt=n("Now the cast_ray function is as follows:"),Te=f(),P=r("pre"),De=f(),H=r("p"),kt=n(`Here I add the floating point unit of last place to some float values to make sure that
floating point rounds can not destroy the result, which would happen if removed.`),Be=f(),z=r("pre"),Me=f(),G=r("p"),Tt=n(`The box code is the part that loads the cuboid.
If the cuboid is from a chunk instead of a voxel, then the size must be multiplied by 8 which is what
makes the code complex.`),Ze=f(),C=r("p"),Dt=n("The lighting calculated in this compute shader is then interpolated in another compute shader."),Xe=f(),R=r("h2"),Bt=n("A dive into the biggest empty cuboid generation"),Ye=f(),W=r("p"),Mt=n(`The cuboids must be generated for both the accelerationBuffer and the chunkBuffer, therefore I have 2 functions.
I will show the code that generates the cuboids for the empty chunks in the accelerationBuffer since that
is the simplest, and is very close to the empty voxel cuboid generation aswell.`),Fe=f(),S=r("p"),Zt=n("The functions are written in C using emscripten to convert into webassembly."),Le=f(),k=r("pre"),Ne=f(),q=r("p"),Xt=n(`I use a summed area table to accelerate the empty cuboid generation since it allows for much
fewer memory accesses. In a 2d summed area table, every element stores the area from that element and 0,0.
Then to get the area you would only need 4 memory accesses.
I use a 3d summed area table which is a little bit more complex.`),Ue=f(),T=r("pre"),Ae=f(),j=r("p"),Yt=n("The code for generating the cuboids for the empty voxels is very similar."),this.h()},l(e){m=l(e,"IMG",{src:!0,style:!0}),le=h(e),w=l(e,"LINK",{rel:!0,type:!0,href:!0}),ue=h(e),D=l(e,"P",{});var a=u(D);Ge=o(a,`In the last 2 weeks I have transitioned from webgl to webgpu and added a more performant rendering system.
I have also added ray-traced shadows, rendered at half resolution to not lag on the shitty school laptops.
I also tried out creating all the chunks for the game in C with webassembly, however, I have not yet ported
that chunks load as you move. Right now lots of chunks load the second you load the page.
Additionally, a skybox has been implemented.`),a.forEach(t),fe=h(e),B=l(e,"H2",{});var Nt=u(B);Ce=o(Nt,"Why did I switch to webGPU?"),Nt.forEach(t),he=h(e),g=l(e,"P",{});var K=u(g);Re=o(K,`The reason I went for webGPU is because that I can have compute shaders, which I emulated with fragment
shaders before. However, the best thing to come from switching to webGPU is better debugging which I really
needed. I implemented a buffer and if the `),O=l(K,"I",{});var Ut=u(O);We=o(Ut,"shaderDebugEnabled"),Ut.forEach(t),Se=o(K,` flag is true, then that buffer is bound
to every single shader pipeline. Then in the shaders I have implemented a `),Q=l(K,"I",{});var At=u(Q);qe=o(At,"debug_print"),At.forEach(t),je=o(K,` function which
makes me able to console.log in a compute shader! This is not perfect but much better than nothing that I had
when using webGL.`),K.forEach(t),ce=h(e),M=l(e,"H2",{});var Ht=u(M);Ke=o(Ht,"Why did I switch to using C with webassembly"),Ht.forEach(t),de=h(e),Z=l(e,"P",{});var Gt=u(Z);Je=o(Gt,"Doing integer operations with floats and no static typing was just not fun."),Gt.forEach(t),pe=h(e),X=l(e,"H2",{});var Ct=u(X);Oe=o(Ct,"A dive into the ray-traced shadows"),Ct.forEach(t),me=h(e),Y=l(e,"P",{});var Rt=u(Y);Qe=o(Rt,"With webGPU, you use the shading language wgsl which I now will show with the shadow tracing compute shader."),Rt.forEach(t),ge=h(e),F=l(e,"P",{});var Wt=u(F);Ve=o(Wt,`In the beginning of the shader, I have code to import resources from other shaders. This compute shader takes
the depth information from the previous primary ray compute shader to get the position from where to start tracing.
Therefore, quite a lot of resources are used.`),Wt.forEach(t),ye=h(e),_=l(e,"PRE",{class:!0});var _a=u(_);_a.forEach(t),be=h(e),L=l(e,"P",{});var St=u(L);$e=o(St,"In webGPU, resources get bound combined in a group, where every single resource get one binding in that group."),St.forEach(t),xe=h(e),c=l(e,"P",{});var b=u(c);et=o(b,"The two most important resources that are used in most shaders are "),V=l(b,"EM",{});var qt=u(V);tt=o(qt,"chunkBuffer"),qt.forEach(t),at=o(b," and "),$=l(b,"EM",{});var jt=u($);it=o(jt,"accelerationBuffer"),jt.forEach(t),st=o(b,`.
`),ee=l(b,"EM",{});var Kt=u(ee);nt=o(Kt,"accelerationBuffer"),Kt.forEach(t),ot=o(b," is a 3d array with the size of 256x256x256 that has indices to "),te=l(b,"EM",{});var Jt=u(te);rt=o(Jt,"chunkBuffer"),Jt.forEach(t),lt=o(b,` which
it itself stores 8x8x8 voxel chunks.`),b.forEach(t),ve=h(e),d=l(e,"P",{});var v=u(d);ut=o(v,`An element in the accelerationBuffer array can be other things than indices, however.
The top 2 bits say which type the chunk at that position is. Two top bits of binary `),ae=l(v,"EM",{});var Ot=u(ae);ft=o(Ot,"00"),Ot.forEach(t),ht=o(v,` means that an
index to a chunk is stored. Two top bits of binary `),ie=l(v,"EM",{});var Qt=u(ie);ct=o(Qt,"11"),Qt.forEach(t),dt=o(v,` means that the chunk is outside the boundaries.
Finally, two top bits of binary `),se=l(v,"EM",{});var Vt=u(se);pt=o(Vt,"10"),Vt.forEach(t),mt=o(v," means that the type is a special distance field I will talk about later."),v.forEach(t),we=h(e),y=l(e,"P",{});var J=u(y);gt=o(J,"Almost the same thing applies to chunkBuffer. An element there is a voxel if the two top bits are binary "),ne=l(J,"EM",{});var $t=u(ne);yt=o($t,"00"),$t.forEach(t),bt=o(J,`,
and a special distance field if `),oe=l(J,"EM",{});var ea=u(oe);xt=o(ea,"10"),ea.forEach(t),vt=o(J,"."),J.forEach(t),_e=h(e),N=l(e,"P",{});var ta=u(N);wt=o(ta,"The main function to do the lighting is pretty simple, and is as follows (with some parts removed):"),ta.forEach(t),Ee=h(e),E=l(e,"PRE",{class:!0});var Ea=u(E);Ea.forEach(t),Ie=h(e),x=l(e,"P",{});var He=u(x);_t=o(He,`The interesting part happens in the cast_ray function, but before then we must talk about the distance field I was
talking about earlier.
When the top 2 bits are `),re=l(He,"EM",{});var aa=u(re);Et=o(aa,"10"),aa.forEach(t),It=o(He,` in binary, the approximately largest cuboid that can be made in that empty area is stored.
The format is as follows:`),He.forEach(t),Pe=h(e),I=l(e,"PRE",{class:!0});var Ia=u(I);Ia.forEach(t),ze=h(e),U=l(e,"P",{});var ia=u(U);Pt=o(ia,`This cuboid is then used to accelerate raytracing.
Because in the cast ray function I can skip the whole area that the cuboid stores instead
of needing to iterate over every single voxel which would be really slow.`),ia.forEach(t),ke=h(e),A=l(e,"P",{});var sa=u(A);zt=o(sa,"Now the cast_ray function is as follows:"),sa.forEach(t),Te=h(e),P=l(e,"PRE",{class:!0});var Pa=u(P);Pa.forEach(t),De=h(e),H=l(e,"P",{});var na=u(H);kt=o(na,`Here I add the floating point unit of last place to some float values to make sure that
floating point rounds can not destroy the result, which would happen if removed.`),na.forEach(t),Be=h(e),z=l(e,"PRE",{class:!0});var za=u(z);za.forEach(t),Me=h(e),G=l(e,"P",{});var oa=u(G);Tt=o(oa,`The box code is the part that loads the cuboid.
If the cuboid is from a chunk instead of a voxel, then the size must be multiplied by 8 which is what
makes the code complex.`),oa.forEach(t),Ze=h(e),C=l(e,"P",{});var ra=u(C);Dt=o(ra,"The lighting calculated in this compute shader is then interpolated in another compute shader."),ra.forEach(t),Xe=h(e),R=l(e,"H2",{});var la=u(R);Bt=o(la,"A dive into the biggest empty cuboid generation"),la.forEach(t),Ye=h(e),W=l(e,"P",{});var ua=u(W);Mt=o(ua,`The cuboids must be generated for both the accelerationBuffer and the chunkBuffer, therefore I have 2 functions.
I will show the code that generates the cuboids for the empty chunks in the accelerationBuffer since that
is the simplest, and is very close to the empty voxel cuboid generation aswell.`),ua.forEach(t),Fe=h(e),S=l(e,"P",{});var fa=u(S);Zt=o(fa,"The functions are written in C using emscripten to convert into webassembly."),fa.forEach(t),Le=h(e),k=l(e,"PRE",{class:!0});var ka=u(k);ka.forEach(t),Ne=h(e),q=l(e,"P",{});var ha=u(q);Xt=o(ha,`I use a summed area table to accelerate the empty cuboid generation since it allows for much
fewer memory accesses. In a 2d summed area table, every element stores the area from that element and 0,0.
Then to get the area you would only need 4 memory accesses.
I use a 3d summed area table which is a little bit more complex.`),ha.forEach(t),Ue=h(e),T=l(e,"PRE",{class:!0});var Ta=u(T);Ta.forEach(t),Ae=h(e),j=l(e,"P",{});var ca=u(j);Yt=o(ca,"The code for generating the cuboids for the empty voxels is very similar."),ca.forEach(t),this.h()},h(){Za(m.src,Lt="/rttest.png")||p(m,"src",Lt),da(m,"width","100vw"),da(m,"transform","translate(-25vw, 0)"),p(w,"rel","stylesheet"),p(w,"type","text/css"),p(w,"href","../blog.css"),p(_,"class","language-undefined"),p(E,"class","language-undefined"),p(I,"class","language-undefined"),p(P,"class","language-undefined"),p(z,"class","language-undefined"),p(k,"class","language-undefined"),p(T,"class","language-undefined")},m(e,a){i(e,m,a),i(e,le,a),i(e,w,a),i(e,ue,a),i(e,D,a),s(D,Ge),i(e,fe,a),i(e,B,a),s(B,Ce),i(e,he,a),i(e,g,a),s(g,Re),s(g,O),s(O,We),s(g,Se),s(g,Q),s(Q,qe),s(g,je),i(e,ce,a),i(e,M,a),s(M,Ke),i(e,de,a),i(e,Z,a),s(Z,Je),i(e,pe,a),i(e,X,a),s(X,Oe),i(e,me,a),i(e,Y,a),s(Y,Qe),i(e,ge,a),i(e,F,a),s(F,Ve),i(e,ye,a),i(e,_,a),_.innerHTML=ma,i(e,be,a),i(e,L,a),s(L,$e),i(e,xe,a),i(e,c,a),s(c,et),s(c,V),s(V,tt),s(c,at),s(c,$),s($,it),s(c,st),s(c,ee),s(ee,nt),s(c,ot),s(c,te),s(te,rt),s(c,lt),i(e,ve,a),i(e,d,a),s(d,ut),s(d,ae),s(ae,ft),s(d,ht),s(d,ie),s(ie,ct),s(d,dt),s(d,se),s(se,pt),s(d,mt),i(e,we,a),i(e,y,a),s(y,gt),s(y,ne),s(ne,yt),s(y,bt),s(y,oe),s(oe,xt),s(y,vt),i(e,_e,a),i(e,N,a),s(N,wt),i(e,Ee,a),i(e,E,a),E.innerHTML=ga,i(e,Ie,a),i(e,x,a),s(x,_t),s(x,re),s(re,Et),s(x,It),i(e,Pe,a),i(e,I,a),I.innerHTML=ya,i(e,ze,a),i(e,U,a),s(U,Pt),i(e,ke,a),i(e,A,a),s(A,zt),i(e,Te,a),i(e,P,a),P.innerHTML=ba,i(e,De,a),i(e,H,a),s(H,kt),i(e,Be,a),i(e,z,a),z.innerHTML=xa,i(e,Me,a),i(e,G,a),s(G,Tt),i(e,Ze,a),i(e,C,a),s(C,Dt),i(e,Xe,a),i(e,R,a),s(R,Bt),i(e,Ye,a),i(e,W,a),s(W,Mt),i(e,Fe,a),i(e,S,a),s(S,Zt),i(e,Le,a),i(e,k,a),k.innerHTML=va,i(e,Ne,a),i(e,q,a),s(q,Xt),i(e,Ue,a),i(e,T,a),T.innerHTML=wa,i(e,Ae,a),i(e,j,a),s(j,Yt)},p:Ft,i:Ft,o:Ft,d(e){e&&t(m),e&&t(le),e&&t(w),e&&t(ue),e&&t(D),e&&t(fe),e&&t(B),e&&t(he),e&&t(g),e&&t(ce),e&&t(M),e&&t(de),e&&t(Z),e&&t(pe),e&&t(X),e&&t(me),e&&t(Y),e&&t(ge),e&&t(F),e&&t(ye),e&&t(_),e&&t(be),e&&t(L),e&&t(xe),e&&t(c),e&&t(ve),e&&t(d),e&&t(we),e&&t(y),e&&t(_e),e&&t(N),e&&t(Ee),e&&t(E),e&&t(Ie),e&&t(x),e&&t(Pe),e&&t(I),e&&t(ze),e&&t(U),e&&t(ke),e&&t(A),e&&t(Te),e&&t(P),e&&t(De),e&&t(H),e&&t(Be),e&&t(z),e&&t(Me),e&&t(G),e&&t(Ze),e&&t(C),e&&t(Xe),e&&t(R),e&&t(Ye),e&&t(W),e&&t(Fe),e&&t(S),e&&t(Le),e&&t(k),e&&t(Ne),e&&t(q),e&&t(Ue),e&&t(T),e&&t(Ae),e&&t(j)}}}const Fa={title:"Simple voxel ray-tracing using webgpu and webassembly",date:"2023-05-08T09:30:00.000Z",tags:"final project, graphics"};class La extends Da{constructor(m){super(),Ba(this,m,null,Xa,Ma,{})}}export{La as default,Fa as metadata};
