import{S as Na,i as Ua,s as Ha,k as r,a as f,q as n,l,c as h,m as u,r as o,h as t,O as Aa,n as p,p as wa,b as i,G as s,B as Gt}from"./index-e41cafb2.js";function Ga(_a){let m,Ct,fe,w,he,D,Se,ce,B,qe,de,g,je,V,Ke,Oe,$,Je,Qe,pe,M,Ve,me,Z,$e,ge,X,et,ye,Y,tt,be,F,at,xe,_,Ia=`<code class="language-undefined">@group(0) @binding(0) var outputTexture: texture_storage_2d&lt;rgba16float, write&gt;;
@group(0) @binding(1) var&lt;uniform&gt; constants: Constants;
@group(0) @binding(2) var&lt;storage, read&gt; chunkBuffer: array&lt;u32&gt;;
@group(0) @binding(3) var&lt;storage, read&gt; accelerationBuffer: array&lt;u32&gt;;
@group(0) @binding(4) var depthTexture: texture_2d&lt;f32&gt;;
@group(0) @binding(5) var colorTexture: texture_2d&lt;f32&gt;;

@group(1) @binding(0) var&lt;storage, read_write&gt; debugInfo: DebugMsgInfo;</code>`,ve,L,it,we,c,st,ee,nt,ot,te,rt,lt,ae,ut,ft,ie,ht,ct,_e,d,dt,se,pt,mt,ne,gt,yt,oe,bt,xt,Ie,y,vt,re,wt,_t,le,It,Et,Ee,N,Pt,Pe,I,Ea=`<code class="language-undefined">@compute @workgroup_size(8,8) // 64 invocations per workgroup
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
&#125;</code>`,ze,x,zt,ue,kt,Tt,ke,E,Pa=`<code class="language-undefined">from LSB-&gt;MSB
5 bits: distance in negative x direction (from voxel&#39;s position)
5 bits: distance in negative y direction
5 bits: distance in negative z direction
5 bits: distance in positive x direction (from (voxel&#39;s x positition+1))
5 bits: distance in positive y direction
5 bits: distance in positive z direction

top 2 bits: type, should be binary 10</code>`,Te,U,Dt,De,H,Bt,Be,P,za=`<code class="language-undefined">fn cast_ray(pos: vec3&lt;f32&gt;, dir: vec3&lt;f32&gt;) -&gt; bool
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

    //...</code>`,Me,A,Mt,Ze,z,ka=`<code class="language-undefined">    var voxel = 0u;
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
&#125;</code>`,Xe,G,Zt,Ye,C,Xt,Fe,W,Yt,Le,R,Ft,Ne,S,Lt,Ue,k,Ta=`<code class="language-undefined">// inax, inay, inaz is index in accelerationBuffer
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
</code>`,He,q,Nt,Ae,T,Da=`<code class="language-undefined">    for (uint16_t z = 0,satIndex=0; z &lt; 32; z++) &#123;
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
&#125;</code>`,Ge,j,Ut,Ce,K,Ht,We,O,At;return{c(){m=r("img"),fe=f(),w=r("link"),he=f(),D=r("p"),Se=n(`In the last 2 weeks I have transitioned from webgl to webgpu and added a more performant rendering system.
I have also added ray-traced shadows, rendered at half resolution to not lag on the shitty school laptops.
I also tried out creating all the chunks for the game in C with webassembly, however, I have not yet ported
that chunks load as you move. Right now lots of chunks load the second you load the page.
Additionally, a skybox has been implemented.`),ce=f(),B=r("h2"),qe=n("Why did I switch to webGPU?"),de=f(),g=r("p"),je=n(`The reason I went for webGPU is because that I can have compute shaders, which I emulated with fragment
shaders before. However, the best thing to come from switching to webGPU is better debugging which I really
needed. I implemented a buffer and if the `),V=r("i"),Ke=n("shaderDebugEnabled"),Oe=n(` flag is true, then that buffer is bound
to every single shader pipeline. Then in the shaders I have implemented a `),$=r("i"),Je=n("debug_print"),Qe=n(` function which
makes me able to console.log in a compute shader! This is not perfect but much better than nothing that I had
when using webGL.`),pe=f(),M=r("h2"),Ve=n("Why did I switch to using C with webassembly"),me=f(),Z=r("p"),$e=n("Doing integer operations with floats and no static typing was just not fun."),ge=f(),X=r("h2"),et=n("A dive into the ray-traced shadows"),ye=f(),Y=r("p"),tt=n("With webGPU, you use the shading language wgsl which I now will show with the shadow tracing compute shader."),be=f(),F=r("p"),at=n(`In the beginning of the shader, I have code to import resources from other shaders. This compute shader takes
the depth information from the previous primary ray compute shader to get the position from where to start tracing.
Therefore, quite a lot of resources are used.`),xe=f(),_=r("pre"),ve=f(),L=r("p"),it=n("In webGPU, resources get bound combined in a group, where every single resource get one binding in that group."),we=f(),c=r("p"),st=n("The two most important resources that are used in most shaders are "),ee=r("em"),nt=n("chunkBuffer"),ot=n(" and "),te=r("em"),rt=n("accelerationBuffer"),lt=n(`.
`),ae=r("em"),ut=n("accelerationBuffer"),ft=n(" is a 3d array with the size of 256x256x256 that has indices to "),ie=r("em"),ht=n("chunkBuffer"),ct=n(` which
it itself stores 8x8x8 voxel chunks.`),_e=f(),d=r("p"),dt=n(`An element in the accelerationBuffer array can be other things than indices, however.
The top 2 bits say which type the chunk at that position is. Two top bits of binary `),se=r("em"),pt=n("00"),mt=n(` means that an
index to a chunk is stored. Two top bits of binary `),ne=r("em"),gt=n("11"),yt=n(` means that the chunk is outside the boundaries.
Finally, two top bits of binary `),oe=r("em"),bt=n("10"),xt=n(" means that the type is a special distance field I will talk about later."),Ie=f(),y=r("p"),vt=n("Almost the same thing applies to chunkBuffer. An element there is a voxel if the two top bits are binary "),re=r("em"),wt=n("00"),_t=n(`,
and a special distance field if `),le=r("em"),It=n("10"),Et=n("."),Ee=f(),N=r("p"),Pt=n("The main function to do the lighting is pretty simple, and is as follows (with some parts removed):"),Pe=f(),I=r("pre"),ze=f(),x=r("p"),zt=n(`The interesting part happens in the cast_ray function, but before then we must talk about the distance field I was
talking about earlier.
When the top 2 bits are `),ue=r("em"),kt=n("10"),Tt=n(` in binary, the approximately largest cuboid that can be made in that empty area is stored.
The format is as follows:`),ke=f(),E=r("pre"),Te=f(),U=r("p"),Dt=n(`This cuboid is then used to accelerate raytracing.
Because in the cast ray function I can skip the whole area that the cuboid stores instead
of needing to iterate over every single voxel which would be really slow.`),De=f(),H=r("p"),Bt=n("Now the cast_ray function is as follows:"),Be=f(),P=r("pre"),Me=f(),A=r("p"),Mt=n(`Here I add the floating point unit of last place to some float values to make sure that
floating point rounds can not destroy the result, which would happen if removed.`),Ze=f(),z=r("pre"),Xe=f(),G=r("p"),Zt=n(`The box code is the part that loads the cuboid.
If the cuboid is from a chunk instead of a voxel, then the size must be multiplied by 8 which is what
makes the code complex.`),Ye=f(),C=r("p"),Xt=n("The lighting calculated in this compute shader is then interpolated in another compute shader."),Fe=f(),W=r("h2"),Yt=n("A dive into the biggest empty cuboid generation"),Le=f(),R=r("p"),Ft=n(`The cuboids must be generated for both the accelerationBuffer and the chunkBuffer, therefore I have 2 functions.
I will show the code that generates the cuboids for the empty chunks in the accelerationBuffer since that
is the simplest, and is very close to the empty voxel cuboid generation aswell.`),Ne=f(),S=r("p"),Lt=n("The functions are written in C using emscripten to convert into webassembly."),Ue=f(),k=r("pre"),He=f(),q=r("p"),Nt=n(`I use a summed area table to accelerate the empty cuboid generation since it allows for much
fewer memory accesses. In a 2d summed area table, every element stores the area from that element and 0,0.
Then to get the area you would only need 4 memory accesses.
I use a 3d summed area table which is a little bit more complex.`),Ae=f(),T=r("pre"),Ge=f(),j=r("p"),Ut=n("The code for generating the cuboids for the empty voxels is very similar."),Ce=f(),K=r("h2"),Ht=n("Conclusion"),We=f(),O=r("p"),At=n(`With this system I have a simple version of ray-tracing up and running.
It can be improved further but it works for now.`),this.h()},l(e){m=l(e,"IMG",{src:!0,style:!0}),fe=h(e),w=l(e,"LINK",{rel:!0,type:!0,href:!0}),he=h(e),D=l(e,"P",{});var a=u(D);Se=o(a,`In the last 2 weeks I have transitioned from webgl to webgpu and added a more performant rendering system.
I have also added ray-traced shadows, rendered at half resolution to not lag on the shitty school laptops.
I also tried out creating all the chunks for the game in C with webassembly, however, I have not yet ported
that chunks load as you move. Right now lots of chunks load the second you load the page.
Additionally, a skybox has been implemented.`),a.forEach(t),ce=h(e),B=l(e,"H2",{});var Wt=u(B);qe=o(Wt,"Why did I switch to webGPU?"),Wt.forEach(t),de=h(e),g=l(e,"P",{});var J=u(g);je=o(J,`The reason I went for webGPU is because that I can have compute shaders, which I emulated with fragment
shaders before. However, the best thing to come from switching to webGPU is better debugging which I really
needed. I implemented a buffer and if the `),V=l(J,"I",{});var Rt=u(V);Ke=o(Rt,"shaderDebugEnabled"),Rt.forEach(t),Oe=o(J,` flag is true, then that buffer is bound
to every single shader pipeline. Then in the shaders I have implemented a `),$=l(J,"I",{});var St=u($);Je=o(St,"debug_print"),St.forEach(t),Qe=o(J,` function which
makes me able to console.log in a compute shader! This is not perfect but much better than nothing that I had
when using webGL.`),J.forEach(t),pe=h(e),M=l(e,"H2",{});var qt=u(M);Ve=o(qt,"Why did I switch to using C with webassembly"),qt.forEach(t),me=h(e),Z=l(e,"P",{});var jt=u(Z);$e=o(jt,"Doing integer operations with floats and no static typing was just not fun."),jt.forEach(t),ge=h(e),X=l(e,"H2",{});var Kt=u(X);et=o(Kt,"A dive into the ray-traced shadows"),Kt.forEach(t),ye=h(e),Y=l(e,"P",{});var Ot=u(Y);tt=o(Ot,"With webGPU, you use the shading language wgsl which I now will show with the shadow tracing compute shader."),Ot.forEach(t),be=h(e),F=l(e,"P",{});var Jt=u(F);at=o(Jt,`In the beginning of the shader, I have code to import resources from other shaders. This compute shader takes
the depth information from the previous primary ray compute shader to get the position from where to start tracing.
Therefore, quite a lot of resources are used.`),Jt.forEach(t),xe=h(e),_=l(e,"PRE",{class:!0});var Ba=u(_);Ba.forEach(t),ve=h(e),L=l(e,"P",{});var Qt=u(L);it=o(Qt,"In webGPU, resources get bound combined in a group, where every single resource get one binding in that group."),Qt.forEach(t),we=h(e),c=l(e,"P",{});var b=u(c);st=o(b,"The two most important resources that are used in most shaders are "),ee=l(b,"EM",{});var Vt=u(ee);nt=o(Vt,"chunkBuffer"),Vt.forEach(t),ot=o(b," and "),te=l(b,"EM",{});var $t=u(te);rt=o($t,"accelerationBuffer"),$t.forEach(t),lt=o(b,`.
`),ae=l(b,"EM",{});var ea=u(ae);ut=o(ea,"accelerationBuffer"),ea.forEach(t),ft=o(b," is a 3d array with the size of 256x256x256 that has indices to "),ie=l(b,"EM",{});var ta=u(ie);ht=o(ta,"chunkBuffer"),ta.forEach(t),ct=o(b,` which
it itself stores 8x8x8 voxel chunks.`),b.forEach(t),_e=h(e),d=l(e,"P",{});var v=u(d);dt=o(v,`An element in the accelerationBuffer array can be other things than indices, however.
The top 2 bits say which type the chunk at that position is. Two top bits of binary `),se=l(v,"EM",{});var aa=u(se);pt=o(aa,"00"),aa.forEach(t),mt=o(v,` means that an
index to a chunk is stored. Two top bits of binary `),ne=l(v,"EM",{});var ia=u(ne);gt=o(ia,"11"),ia.forEach(t),yt=o(v,` means that the chunk is outside the boundaries.
Finally, two top bits of binary `),oe=l(v,"EM",{});var sa=u(oe);bt=o(sa,"10"),sa.forEach(t),xt=o(v," means that the type is a special distance field I will talk about later."),v.forEach(t),Ie=h(e),y=l(e,"P",{});var Q=u(y);vt=o(Q,"Almost the same thing applies to chunkBuffer. An element there is a voxel if the two top bits are binary "),re=l(Q,"EM",{});var na=u(re);wt=o(na,"00"),na.forEach(t),_t=o(Q,`,
and a special distance field if `),le=l(Q,"EM",{});var oa=u(le);It=o(oa,"10"),oa.forEach(t),Et=o(Q,"."),Q.forEach(t),Ee=h(e),N=l(e,"P",{});var ra=u(N);Pt=o(ra,"The main function to do the lighting is pretty simple, and is as follows (with some parts removed):"),ra.forEach(t),Pe=h(e),I=l(e,"PRE",{class:!0});var Ma=u(I);Ma.forEach(t),ze=h(e),x=l(e,"P",{});var Re=u(x);zt=o(Re,`The interesting part happens in the cast_ray function, but before then we must talk about the distance field I was
talking about earlier.
When the top 2 bits are `),ue=l(Re,"EM",{});var la=u(ue);kt=o(la,"10"),la.forEach(t),Tt=o(Re,` in binary, the approximately largest cuboid that can be made in that empty area is stored.
The format is as follows:`),Re.forEach(t),ke=h(e),E=l(e,"PRE",{class:!0});var Za=u(E);Za.forEach(t),Te=h(e),U=l(e,"P",{});var ua=u(U);Dt=o(ua,`This cuboid is then used to accelerate raytracing.
Because in the cast ray function I can skip the whole area that the cuboid stores instead
of needing to iterate over every single voxel which would be really slow.`),ua.forEach(t),De=h(e),H=l(e,"P",{});var fa=u(H);Bt=o(fa,"Now the cast_ray function is as follows:"),fa.forEach(t),Be=h(e),P=l(e,"PRE",{class:!0});var Xa=u(P);Xa.forEach(t),Me=h(e),A=l(e,"P",{});var ha=u(A);Mt=o(ha,`Here I add the floating point unit of last place to some float values to make sure that
floating point rounds can not destroy the result, which would happen if removed.`),ha.forEach(t),Ze=h(e),z=l(e,"PRE",{class:!0});var Ya=u(z);Ya.forEach(t),Xe=h(e),G=l(e,"P",{});var ca=u(G);Zt=o(ca,`The box code is the part that loads the cuboid.
If the cuboid is from a chunk instead of a voxel, then the size must be multiplied by 8 which is what
makes the code complex.`),ca.forEach(t),Ye=h(e),C=l(e,"P",{});var da=u(C);Xt=o(da,"The lighting calculated in this compute shader is then interpolated in another compute shader."),da.forEach(t),Fe=h(e),W=l(e,"H2",{});var pa=u(W);Yt=o(pa,"A dive into the biggest empty cuboid generation"),pa.forEach(t),Le=h(e),R=l(e,"P",{});var ma=u(R);Ft=o(ma,`The cuboids must be generated for both the accelerationBuffer and the chunkBuffer, therefore I have 2 functions.
I will show the code that generates the cuboids for the empty chunks in the accelerationBuffer since that
is the simplest, and is very close to the empty voxel cuboid generation aswell.`),ma.forEach(t),Ne=h(e),S=l(e,"P",{});var ga=u(S);Lt=o(ga,"The functions are written in C using emscripten to convert into webassembly."),ga.forEach(t),Ue=h(e),k=l(e,"PRE",{class:!0});var Fa=u(k);Fa.forEach(t),He=h(e),q=l(e,"P",{});var ya=u(q);Nt=o(ya,`I use a summed area table to accelerate the empty cuboid generation since it allows for much
fewer memory accesses. In a 2d summed area table, every element stores the area from that element and 0,0.
Then to get the area you would only need 4 memory accesses.
I use a 3d summed area table which is a little bit more complex.`),ya.forEach(t),Ae=h(e),T=l(e,"PRE",{class:!0});var La=u(T);La.forEach(t),Ge=h(e),j=l(e,"P",{});var ba=u(j);Ut=o(ba,"The code for generating the cuboids for the empty voxels is very similar."),ba.forEach(t),Ce=h(e),K=l(e,"H2",{});var xa=u(K);Ht=o(xa,"Conclusion"),xa.forEach(t),We=h(e),O=l(e,"P",{});var va=u(O);At=o(va,`With this system I have a simple version of ray-tracing up and running.
It can be improved further but it works for now.`),va.forEach(t),this.h()},h(){Aa(m.src,Ct="/rttest.png")||p(m,"src",Ct),wa(m,"width","100vw"),wa(m,"transform","translate(-25vw, 0)"),p(w,"rel","stylesheet"),p(w,"type","text/css"),p(w,"href","../blog.css"),p(_,"class","language-undefined"),p(I,"class","language-undefined"),p(E,"class","language-undefined"),p(P,"class","language-undefined"),p(z,"class","language-undefined"),p(k,"class","language-undefined"),p(T,"class","language-undefined")},m(e,a){i(e,m,a),i(e,fe,a),i(e,w,a),i(e,he,a),i(e,D,a),s(D,Se),i(e,ce,a),i(e,B,a),s(B,qe),i(e,de,a),i(e,g,a),s(g,je),s(g,V),s(V,Ke),s(g,Oe),s(g,$),s($,Je),s(g,Qe),i(e,pe,a),i(e,M,a),s(M,Ve),i(e,me,a),i(e,Z,a),s(Z,$e),i(e,ge,a),i(e,X,a),s(X,et),i(e,ye,a),i(e,Y,a),s(Y,tt),i(e,be,a),i(e,F,a),s(F,at),i(e,xe,a),i(e,_,a),_.innerHTML=Ia,i(e,ve,a),i(e,L,a),s(L,it),i(e,we,a),i(e,c,a),s(c,st),s(c,ee),s(ee,nt),s(c,ot),s(c,te),s(te,rt),s(c,lt),s(c,ae),s(ae,ut),s(c,ft),s(c,ie),s(ie,ht),s(c,ct),i(e,_e,a),i(e,d,a),s(d,dt),s(d,se),s(se,pt),s(d,mt),s(d,ne),s(ne,gt),s(d,yt),s(d,oe),s(oe,bt),s(d,xt),i(e,Ie,a),i(e,y,a),s(y,vt),s(y,re),s(re,wt),s(y,_t),s(y,le),s(le,It),s(y,Et),i(e,Ee,a),i(e,N,a),s(N,Pt),i(e,Pe,a),i(e,I,a),I.innerHTML=Ea,i(e,ze,a),i(e,x,a),s(x,zt),s(x,ue),s(ue,kt),s(x,Tt),i(e,ke,a),i(e,E,a),E.innerHTML=Pa,i(e,Te,a),i(e,U,a),s(U,Dt),i(e,De,a),i(e,H,a),s(H,Bt),i(e,Be,a),i(e,P,a),P.innerHTML=za,i(e,Me,a),i(e,A,a),s(A,Mt),i(e,Ze,a),i(e,z,a),z.innerHTML=ka,i(e,Xe,a),i(e,G,a),s(G,Zt),i(e,Ye,a),i(e,C,a),s(C,Xt),i(e,Fe,a),i(e,W,a),s(W,Yt),i(e,Le,a),i(e,R,a),s(R,Ft),i(e,Ne,a),i(e,S,a),s(S,Lt),i(e,Ue,a),i(e,k,a),k.innerHTML=Ta,i(e,He,a),i(e,q,a),s(q,Nt),i(e,Ae,a),i(e,T,a),T.innerHTML=Da,i(e,Ge,a),i(e,j,a),s(j,Ut),i(e,Ce,a),i(e,K,a),s(K,Ht),i(e,We,a),i(e,O,a),s(O,At)},p:Gt,i:Gt,o:Gt,d(e){e&&t(m),e&&t(fe),e&&t(w),e&&t(he),e&&t(D),e&&t(ce),e&&t(B),e&&t(de),e&&t(g),e&&t(pe),e&&t(M),e&&t(me),e&&t(Z),e&&t(ge),e&&t(X),e&&t(ye),e&&t(Y),e&&t(be),e&&t(F),e&&t(xe),e&&t(_),e&&t(ve),e&&t(L),e&&t(we),e&&t(c),e&&t(_e),e&&t(d),e&&t(Ie),e&&t(y),e&&t(Ee),e&&t(N),e&&t(Pe),e&&t(I),e&&t(ze),e&&t(x),e&&t(ke),e&&t(E),e&&t(Te),e&&t(U),e&&t(De),e&&t(H),e&&t(Be),e&&t(P),e&&t(Me),e&&t(A),e&&t(Ze),e&&t(z),e&&t(Xe),e&&t(G),e&&t(Ye),e&&t(C),e&&t(Fe),e&&t(W),e&&t(Le),e&&t(R),e&&t(Ne),e&&t(S),e&&t(Ue),e&&t(k),e&&t(He),e&&t(q),e&&t(Ae),e&&t(T),e&&t(Ge),e&&t(j),e&&t(Ce),e&&t(K),e&&t(We),e&&t(O)}}}const Wa={title:"Simple voxel ray-tracing using webgpu and webassembly",date:"2023-05-08T09:30:00.000Z",tags:"final project, graphics"};class Ra extends Na{constructor(m){super(),Ua(this,m,null,Ga,Ha,{})}}export{Ra as default,Wa as metadata};
