import{S as Ya,i as Fa,s as La,k as r,a as f,q as n,l,c as h,m as u,r as o,h as t,N as Na,n as p,p as ba,b as i,G as s,B as Ht}from"./index-d063f04b.js";function Ua(xa){let m,At,ue,w,fe,D,Re,he,B,Se,ce,g,qe,Q,je,Ke,V,Je,Oe,de,M,Qe,pe,Z,Ve,me,X,$e,ge,Y,et,ye,F,tt,be,_,va=`<code class="language-undefined">@group(0) @binding(0) var outputTexture: texture_storage_2d&lt;rgba16float, write&gt;;
@group(0) @binding(1) var&lt;uniform&gt; constants: Constants;
@group(0) @binding(2) var&lt;storage, read&gt; chunkBuffer: array&lt;u32&gt;;
@group(0) @binding(3) var&lt;storage, read&gt; accelerationBuffer: array&lt;u32&gt;;
@group(0) @binding(4) var depthTexture: texture_2d&lt;f32&gt;;
@group(0) @binding(5) var colorTexture: texture_2d&lt;f32&gt;;

@group(1) @binding(0) var&lt;storage, read_write&gt; debugInfo: DebugMsgInfo;</code>`,xe,L,at,ve,c,it,$,st,nt,ee,ot,rt,te,lt,ut,ae,ft,ht,we,d,ct,ie,dt,pt,se,mt,gt,ne,yt,bt,_e,y,xt,oe,vt,wt,re,_t,It,Ie,N,Et,Ee,I,wa=`<code class="language-undefined">@compute @workgroup_size(8,8) // 64 invocations per workgroup
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
&#125;</code>`,Pe,x,Pt,le,zt,kt,ze,E,_a=`<code class="language-undefined">from LSB-&gt;MSB
5 bits: distance in negative x direction (from voxel&#39;s position)
5 bits: distance in negative y direction
5 bits: distance in negative z direction
5 bits: distance in positive x direction (from (voxel&#39;s x positition+1))
5 bits: distance in positive y direction
5 bits: distance in positive z direction

top 2 bits: type, should be binary 10</code>`,ke,U,Tt,Te,H,Dt,De,P,Ia=`<code class="language-undefined">fn cast_ray(pos: vec3&lt;f32&gt;, dir: vec3&lt;f32&gt;) -&gt; bool
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

    //...</code>`,Be,A,Bt,Me,z,Ea=`<code class="language-undefined">    var voxel = 0u;
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
&#125;</code>`,Ze,G,Mt,Xe,C,Zt,Ye,W,Xt,Fe,R,Yt,Le,S,Ft,Ne,k,Pa=`<code class="language-undefined">// inax, inay, inaz is index in accelerationBuffer
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
</code>`,Ue,q,Lt,He,T,za=`<code class="language-undefined">    for (uint16_t z = 0,satIndex=0; z &lt; 32; z++) &#123;
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
&#125;</code>`,Ae,j,Nt,Ge,K,Ut,Ce;return{c(){m=r("img"),ue=f(),w=r("link"),fe=f(),D=r("p"),Re=n(`In the last 2 weeks I have transitioned from webgl to webgpu and added a more performant rendering system.
I have also added ray-traced shadows, rendered at half resolution to not lag on the shitty school laptops.
I also tried out creating all the chunks for the game in C with webassembly, however, I have not yet ported
that chunks load as you move. Right now lots of chunks load the second you load the page.
Additionally, a skybox has been implemented.`),he=f(),B=r("h2"),Se=n("Why did I switch to webGPU?"),ce=f(),g=r("p"),qe=n(`The reason I went for webGPU is because that I can have compute shaders, which I emulated with fragment
shaders before. However, the best thing to come from switching to webGPU is better debugging which I really
needed. I implemented a buffer and if the `),Q=r("i"),je=n("shaderDebugEnabled"),Ke=n(` flag is true, then that buffer is bound
to every single shader pipeline. Then in the shaders I have implemented a `),V=r("i"),Je=n("debug_print"),Oe=n(` function which
makes me able to console.log in a compute shader! This is not perfect but much better than nothing that I had
when using webGL.`),de=f(),M=r("h2"),Qe=n("Why did I switch to using C with webassembly"),pe=f(),Z=r("p"),Ve=n("Doing integer operations with floats and no static typing was just not fun."),me=f(),X=r("h2"),$e=n("A dive into the ray-traced shadows"),ge=f(),Y=r("p"),et=n("With webGPU, you use the shading language wgsl which I now will show with the shadow tracing compute shader."),ye=f(),F=r("p"),tt=n(`In the beginning of the shader, I have code to import resources from other shaders. This compute shader takes
the depth information from the previous primary ray compute shader to get the position from where to start tracing.
Therefore, quite a lot of resources are used.`),be=f(),_=r("pre"),xe=f(),L=r("p"),at=n("In webGPU, resources get bound combined in a group, where every single resource get one binding in that group."),ve=f(),c=r("p"),it=n("The two most important resources that are used in most shaders are "),$=r("em"),st=n("chunkBuffer"),nt=n(" and "),ee=r("em"),ot=n("accelerationBuffer"),rt=n(`.
`),te=r("em"),lt=n("accelerationBuffer"),ut=n(" is a 3d array with the size of 256x256x256 that has indices to "),ae=r("em"),ft=n("chunkBuffer"),ht=n(` which
it itself stores 8x8x8 voxel chunks.`),we=f(),d=r("p"),ct=n(`An element in the accelerationBuffer array can be other things than indices, however.
The top 2 bits say which type the chunk at that position is. Two top bits of binary `),ie=r("em"),dt=n("00"),pt=n(` means that an
index to a chunk is stored. Two top bits of binary `),se=r("em"),mt=n("11"),gt=n(` means that the chunk is outside the boundaries.
Finally, two top bits of binary `),ne=r("em"),yt=n("10"),bt=n(" means that the type is a special distance field I will talk about later."),_e=f(),y=r("p"),xt=n("Almost the same thing applies to chunkBuffer. An element there is a voxel if the two top bits are binary "),oe=r("em"),vt=n("00"),wt=n(`,
and a special distance field if `),re=r("em"),_t=n("10"),It=n("."),Ie=f(),N=r("p"),Et=n("The main function to do the lighting is pretty simple, and is as follows (with some parts removed):"),Ee=f(),I=r("pre"),Pe=f(),x=r("p"),Pt=n(`The interesting part happens in the cast_ray function, but before then we must talk about the distance field I was
talking about earlier.
When the top 2 bits are `),le=r("em"),zt=n("10"),kt=n(` in binary, the approximately largest cuboid that can be made in that empty area is stored.
The format is as follows:`),ze=f(),E=r("pre"),ke=f(),U=r("p"),Tt=n(`This cuboid is then used to accelerate raytracing.
Because in the cast ray function I can skip the whole area that the cuboid stores instead
of needing to iterate over every single voxel which would be really slow.`),Te=f(),H=r("p"),Dt=n("Now the cast_ray function is as follows:"),De=f(),P=r("pre"),Be=f(),A=r("p"),Bt=n(`Here I add the floating point unit of last place to some float values to make sure that
floating point rounds can not destroy the result, which would happen if removed.`),Me=f(),z=r("pre"),Ze=f(),G=r("p"),Mt=n(`The box code is the part that loads the cuboid.
If the cuboid is from a chunk instead of a voxel, then the size must be multiplied by 8 which is what
makes the code complex.`),Xe=f(),C=r("p"),Zt=n("The lighting calculated in this compute shader is then interpolated in another compute shader."),Ye=f(),W=r("h2"),Xt=n("A dive into the biggest empty cuboid generation"),Fe=f(),R=r("p"),Yt=n(`The cuboids must be generated for both the accelerationBuffer and the chunkBuffer, therefore I have 2 functions.
I will show the code that generates the cuboids for the empty chunks in the accelerationBuffer since that
is the simplest, and is very close to the empty voxel cuboid generation aswell.`),Le=f(),S=r("p"),Ft=n("The functions are written in C using emscripten to convert into webassembly."),Ne=f(),k=r("pre"),Ue=f(),q=r("p"),Lt=n(`I use a summed area table to accelerate the empty cuboid generation since it allows for much
fewer memory accesses. In a 2d summed area table, every element stores the area from that element and 0,0.
Then to get the area you would only need 4 memory accesses.
I use a 3d summed area table which is a little bit more complex.`),He=f(),T=r("pre"),Ae=f(),j=r("p"),Nt=n("The code for generating the cuboids for the empty voxels is very similar."),Ge=f(),K=r("h2"),Ut=n("Conclusion"),Ce=n(`
With this system I have a simple version of ray-tracing up and running.
It can be improved further but it works for now.`),this.h()},l(e){m=l(e,"IMG",{src:!0,style:!0}),ue=h(e),w=l(e,"LINK",{rel:!0,type:!0,href:!0}),fe=h(e),D=l(e,"P",{});var a=u(D);Re=o(a,`In the last 2 weeks I have transitioned from webgl to webgpu and added a more performant rendering system.
I have also added ray-traced shadows, rendered at half resolution to not lag on the shitty school laptops.
I also tried out creating all the chunks for the game in C with webassembly, however, I have not yet ported
that chunks load as you move. Right now lots of chunks load the second you load the page.
Additionally, a skybox has been implemented.`),a.forEach(t),he=h(e),B=l(e,"H2",{});var Gt=u(B);Se=o(Gt,"Why did I switch to webGPU?"),Gt.forEach(t),ce=h(e),g=l(e,"P",{});var J=u(g);qe=o(J,`The reason I went for webGPU is because that I can have compute shaders, which I emulated with fragment
shaders before. However, the best thing to come from switching to webGPU is better debugging which I really
needed. I implemented a buffer and if the `),Q=l(J,"I",{});var Ct=u(Q);je=o(Ct,"shaderDebugEnabled"),Ct.forEach(t),Ke=o(J,` flag is true, then that buffer is bound
to every single shader pipeline. Then in the shaders I have implemented a `),V=l(J,"I",{});var Wt=u(V);Je=o(Wt,"debug_print"),Wt.forEach(t),Oe=o(J,` function which
makes me able to console.log in a compute shader! This is not perfect but much better than nothing that I had
when using webGL.`),J.forEach(t),de=h(e),M=l(e,"H2",{});var Rt=u(M);Qe=o(Rt,"Why did I switch to using C with webassembly"),Rt.forEach(t),pe=h(e),Z=l(e,"P",{});var St=u(Z);Ve=o(St,"Doing integer operations with floats and no static typing was just not fun."),St.forEach(t),me=h(e),X=l(e,"H2",{});var qt=u(X);$e=o(qt,"A dive into the ray-traced shadows"),qt.forEach(t),ge=h(e),Y=l(e,"P",{});var jt=u(Y);et=o(jt,"With webGPU, you use the shading language wgsl which I now will show with the shadow tracing compute shader."),jt.forEach(t),ye=h(e),F=l(e,"P",{});var Kt=u(F);tt=o(Kt,`In the beginning of the shader, I have code to import resources from other shaders. This compute shader takes
the depth information from the previous primary ray compute shader to get the position from where to start tracing.
Therefore, quite a lot of resources are used.`),Kt.forEach(t),be=h(e),_=l(e,"PRE",{class:!0});var ka=u(_);ka.forEach(t),xe=h(e),L=l(e,"P",{});var Jt=u(L);at=o(Jt,"In webGPU, resources get bound combined in a group, where every single resource get one binding in that group."),Jt.forEach(t),ve=h(e),c=l(e,"P",{});var b=u(c);it=o(b,"The two most important resources that are used in most shaders are "),$=l(b,"EM",{});var Ot=u($);st=o(Ot,"chunkBuffer"),Ot.forEach(t),nt=o(b," and "),ee=l(b,"EM",{});var Qt=u(ee);ot=o(Qt,"accelerationBuffer"),Qt.forEach(t),rt=o(b,`.
`),te=l(b,"EM",{});var Vt=u(te);lt=o(Vt,"accelerationBuffer"),Vt.forEach(t),ut=o(b," is a 3d array with the size of 256x256x256 that has indices to "),ae=l(b,"EM",{});var $t=u(ae);ft=o($t,"chunkBuffer"),$t.forEach(t),ht=o(b,` which
it itself stores 8x8x8 voxel chunks.`),b.forEach(t),we=h(e),d=l(e,"P",{});var v=u(d);ct=o(v,`An element in the accelerationBuffer array can be other things than indices, however.
The top 2 bits say which type the chunk at that position is. Two top bits of binary `),ie=l(v,"EM",{});var ea=u(ie);dt=o(ea,"00"),ea.forEach(t),pt=o(v,` means that an
index to a chunk is stored. Two top bits of binary `),se=l(v,"EM",{});var ta=u(se);mt=o(ta,"11"),ta.forEach(t),gt=o(v,` means that the chunk is outside the boundaries.
Finally, two top bits of binary `),ne=l(v,"EM",{});var aa=u(ne);yt=o(aa,"10"),aa.forEach(t),bt=o(v," means that the type is a special distance field I will talk about later."),v.forEach(t),_e=h(e),y=l(e,"P",{});var O=u(y);xt=o(O,"Almost the same thing applies to chunkBuffer. An element there is a voxel if the two top bits are binary "),oe=l(O,"EM",{});var ia=u(oe);vt=o(ia,"00"),ia.forEach(t),wt=o(O,`,
and a special distance field if `),re=l(O,"EM",{});var sa=u(re);_t=o(sa,"10"),sa.forEach(t),It=o(O,"."),O.forEach(t),Ie=h(e),N=l(e,"P",{});var na=u(N);Et=o(na,"The main function to do the lighting is pretty simple, and is as follows (with some parts removed):"),na.forEach(t),Ee=h(e),I=l(e,"PRE",{class:!0});var Ta=u(I);Ta.forEach(t),Pe=h(e),x=l(e,"P",{});var We=u(x);Pt=o(We,`The interesting part happens in the cast_ray function, but before then we must talk about the distance field I was
talking about earlier.
When the top 2 bits are `),le=l(We,"EM",{});var oa=u(le);zt=o(oa,"10"),oa.forEach(t),kt=o(We,` in binary, the approximately largest cuboid that can be made in that empty area is stored.
The format is as follows:`),We.forEach(t),ze=h(e),E=l(e,"PRE",{class:!0});var Da=u(E);Da.forEach(t),ke=h(e),U=l(e,"P",{});var ra=u(U);Tt=o(ra,`This cuboid is then used to accelerate raytracing.
Because in the cast ray function I can skip the whole area that the cuboid stores instead
of needing to iterate over every single voxel which would be really slow.`),ra.forEach(t),Te=h(e),H=l(e,"P",{});var la=u(H);Dt=o(la,"Now the cast_ray function is as follows:"),la.forEach(t),De=h(e),P=l(e,"PRE",{class:!0});var Ba=u(P);Ba.forEach(t),Be=h(e),A=l(e,"P",{});var ua=u(A);Bt=o(ua,`Here I add the floating point unit of last place to some float values to make sure that
floating point rounds can not destroy the result, which would happen if removed.`),ua.forEach(t),Me=h(e),z=l(e,"PRE",{class:!0});var Ma=u(z);Ma.forEach(t),Ze=h(e),G=l(e,"P",{});var fa=u(G);Mt=o(fa,`The box code is the part that loads the cuboid.
If the cuboid is from a chunk instead of a voxel, then the size must be multiplied by 8 which is what
makes the code complex.`),fa.forEach(t),Xe=h(e),C=l(e,"P",{});var ha=u(C);Zt=o(ha,"The lighting calculated in this compute shader is then interpolated in another compute shader."),ha.forEach(t),Ye=h(e),W=l(e,"H2",{});var ca=u(W);Xt=o(ca,"A dive into the biggest empty cuboid generation"),ca.forEach(t),Fe=h(e),R=l(e,"P",{});var da=u(R);Yt=o(da,`The cuboids must be generated for both the accelerationBuffer and the chunkBuffer, therefore I have 2 functions.
I will show the code that generates the cuboids for the empty chunks in the accelerationBuffer since that
is the simplest, and is very close to the empty voxel cuboid generation aswell.`),da.forEach(t),Le=h(e),S=l(e,"P",{});var pa=u(S);Ft=o(pa,"The functions are written in C using emscripten to convert into webassembly."),pa.forEach(t),Ne=h(e),k=l(e,"PRE",{class:!0});var Za=u(k);Za.forEach(t),Ue=h(e),q=l(e,"P",{});var ma=u(q);Lt=o(ma,`I use a summed area table to accelerate the empty cuboid generation since it allows for much
fewer memory accesses. In a 2d summed area table, every element stores the area from that element and 0,0.
Then to get the area you would only need 4 memory accesses.
I use a 3d summed area table which is a little bit more complex.`),ma.forEach(t),He=h(e),T=l(e,"PRE",{class:!0});var Xa=u(T);Xa.forEach(t),Ae=h(e),j=l(e,"P",{});var ga=u(j);Nt=o(ga,"The code for generating the cuboids for the empty voxels is very similar."),ga.forEach(t),Ge=h(e),K=l(e,"H2",{});var ya=u(K);Ut=o(ya,"Conclusion"),ya.forEach(t),Ce=o(e,`
With this system I have a simple version of ray-tracing up and running.
It can be improved further but it works for now.`),this.h()},h(){Na(m.src,At="/rttest.png")||p(m,"src",At),ba(m,"width","100vw"),ba(m,"transform","translate(-25vw, 0)"),p(w,"rel","stylesheet"),p(w,"type","text/css"),p(w,"href","../blog.css"),p(_,"class","language-undefined"),p(I,"class","language-undefined"),p(E,"class","language-undefined"),p(P,"class","language-undefined"),p(z,"class","language-undefined"),p(k,"class","language-undefined"),p(T,"class","language-undefined")},m(e,a){i(e,m,a),i(e,ue,a),i(e,w,a),i(e,fe,a),i(e,D,a),s(D,Re),i(e,he,a),i(e,B,a),s(B,Se),i(e,ce,a),i(e,g,a),s(g,qe),s(g,Q),s(Q,je),s(g,Ke),s(g,V),s(V,Je),s(g,Oe),i(e,de,a),i(e,M,a),s(M,Qe),i(e,pe,a),i(e,Z,a),s(Z,Ve),i(e,me,a),i(e,X,a),s(X,$e),i(e,ge,a),i(e,Y,a),s(Y,et),i(e,ye,a),i(e,F,a),s(F,tt),i(e,be,a),i(e,_,a),_.innerHTML=va,i(e,xe,a),i(e,L,a),s(L,at),i(e,ve,a),i(e,c,a),s(c,it),s(c,$),s($,st),s(c,nt),s(c,ee),s(ee,ot),s(c,rt),s(c,te),s(te,lt),s(c,ut),s(c,ae),s(ae,ft),s(c,ht),i(e,we,a),i(e,d,a),s(d,ct),s(d,ie),s(ie,dt),s(d,pt),s(d,se),s(se,mt),s(d,gt),s(d,ne),s(ne,yt),s(d,bt),i(e,_e,a),i(e,y,a),s(y,xt),s(y,oe),s(oe,vt),s(y,wt),s(y,re),s(re,_t),s(y,It),i(e,Ie,a),i(e,N,a),s(N,Et),i(e,Ee,a),i(e,I,a),I.innerHTML=wa,i(e,Pe,a),i(e,x,a),s(x,Pt),s(x,le),s(le,zt),s(x,kt),i(e,ze,a),i(e,E,a),E.innerHTML=_a,i(e,ke,a),i(e,U,a),s(U,Tt),i(e,Te,a),i(e,H,a),s(H,Dt),i(e,De,a),i(e,P,a),P.innerHTML=Ia,i(e,Be,a),i(e,A,a),s(A,Bt),i(e,Me,a),i(e,z,a),z.innerHTML=Ea,i(e,Ze,a),i(e,G,a),s(G,Mt),i(e,Xe,a),i(e,C,a),s(C,Zt),i(e,Ye,a),i(e,W,a),s(W,Xt),i(e,Fe,a),i(e,R,a),s(R,Yt),i(e,Le,a),i(e,S,a),s(S,Ft),i(e,Ne,a),i(e,k,a),k.innerHTML=Pa,i(e,Ue,a),i(e,q,a),s(q,Lt),i(e,He,a),i(e,T,a),T.innerHTML=za,i(e,Ae,a),i(e,j,a),s(j,Nt),i(e,Ge,a),i(e,K,a),s(K,Ut),i(e,Ce,a)},p:Ht,i:Ht,o:Ht,d(e){e&&t(m),e&&t(ue),e&&t(w),e&&t(fe),e&&t(D),e&&t(he),e&&t(B),e&&t(ce),e&&t(g),e&&t(de),e&&t(M),e&&t(pe),e&&t(Z),e&&t(me),e&&t(X),e&&t(ge),e&&t(Y),e&&t(ye),e&&t(F),e&&t(be),e&&t(_),e&&t(xe),e&&t(L),e&&t(ve),e&&t(c),e&&t(we),e&&t(d),e&&t(_e),e&&t(y),e&&t(Ie),e&&t(N),e&&t(Ee),e&&t(I),e&&t(Pe),e&&t(x),e&&t(ze),e&&t(E),e&&t(ke),e&&t(U),e&&t(Te),e&&t(H),e&&t(De),e&&t(P),e&&t(Be),e&&t(A),e&&t(Me),e&&t(z),e&&t(Ze),e&&t(G),e&&t(Xe),e&&t(C),e&&t(Ye),e&&t(W),e&&t(Fe),e&&t(R),e&&t(Le),e&&t(S),e&&t(Ne),e&&t(k),e&&t(Ue),e&&t(q),e&&t(He),e&&t(T),e&&t(Ae),e&&t(j),e&&t(Ge),e&&t(K),e&&t(Ce)}}}const Aa={title:"Simple voxel ray-tracing using webgpu and webassembly",date:"2023-05-08T09:30:00.000Z",tags:"final project, graphics"};class Ga extends Ya{constructor(m){super(),Fa(this,m,null,Ua,La,{})}}export{Ga as default,Aa as metadata};
