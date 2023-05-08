---
title: Simple voxel ray-tracing using webgpu and webassembly
date: 2023-05-08T10:30:00.000+01:00
tags: final project, graphics
---

<img src="/rttest.png" style="width: 100vw; transform: translate(-25vw, 0);">

<link rel="stylesheet" type="text/css" href="../blog.css">

In the last 2 weeks I have transitioned from webgl to webgpu and added a more performant rendering system.
I have also added ray-traced shadows, rendered at half resolution to not lag on the shitty school laptops.
I also tried out creating all the chunks for the game in C with webassembly, however, I have not yet ported
that chunks load as you move. Right now lots of chunks load the second you load the page.
Additionally, a skybox has been implemented.

<h2>Why did I switch to webGPU?</h2>

The reason I went for webGPU is because that I can have compute shaders, which I emulated with fragment
shaders before. However, the best thing to come from switching to webGPU is better debugging which I really
needed. I implemented a buffer and if the <i>shaderDebugEnabled</i> flag is true, then that buffer is bound
to every single shader pipeline. Then in the shaders I have implemented a <i>debug_print</i> function which
makes me able to console.log in a compute shader! This is not perfect but much better than nothing that I had
when using webGL.

<h2>Why did I switch to using C with webassembly</h2>

Doing integer operations with floats and no static typing was just not fun.

<h2>A dive into the ray-traced shadows</h2>

With webGPU, you use the shading language wgsl which I now will show with the shadow tracing compute shader.

In the beginning of the shader, I have code to import resources from other shaders. This compute shader takes
the depth information from the previous primary ray compute shader to get the position from where to start tracing.
Therefore, quite a lot of resources are used.
```
@group(0) @binding(0) var outputTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> constants: Constants;
@group(0) @binding(2) var<storage, read> chunkBuffer: array<u32>;
@group(0) @binding(3) var<storage, read> accelerationBuffer: array<u32>;
@group(0) @binding(4) var depthTexture: texture_2d<f32>;
@group(0) @binding(5) var colorTexture: texture_2d<f32>;

@group(1) @binding(0) var<storage, read_write> debugInfo: DebugMsgInfo;
```
In webGPU, resources get bound combined in a group, where every single resource get one binding in that group.

The two most important resources that are used in most shaders are *chunkBuffer* and *accelerationBuffer*.
*accelerationBuffer* is a 3d array with the size of 256x256x256 that has indices to *chunkBuffer* which
it itself stores 8x8x8 voxel chunks.

An element in the accelerationBuffer array can be other things than indices, however.
The top 2 bits say which type the chunk at that position is. Two top bits of binary *00* means that an
index to a chunk is stored. Two top bits of binary *11* means that the chunk is outside the boundaries.
Finally, two top bits of binary *10* means that the type is a special distance field I will talk about later.

Almost the same thing applies to chunkBuffer. An element there is a voxel if the two top bits are binary *00*,
and a special distance field if *10*.

The main function to do the lighting is pretty simple, and is as follows (with some parts removed):
```
@compute @workgroup_size(8,8) // 64 invocations per workgroup
fn main(@builtin(global_invocation_id) globalID: vec3<u32>)
{
    // constants.width is Math.ceil(canvas.width*Math.sqrt(1/2));
    // constants.height is Math.ceil(canvas.height*Math.sqrt(1/2));
    if (globalID.x > constants.width || globalID.y > constants.height) {
        return;
    }
    // code to fetch position, normal and ray from primary ray compute shader's resources
    // ...

    let shininess = 128.0f;
    let specularStrength = 0.5f;

    let lightPos = vec3<f32>(-6612.37984732f, 4207.50836314f, -6210.74118997f);
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
    if (hit) {
        outputLighting += diffuse+specular;
    }
    textureStore(outputTexture, vec2(globalID.xy), vec4(outputLighting, 0f, 0f, 0f));
}
```

The interesting part happens in the cast\_ray function, but before then we must talk about the distance field I was
talking about earlier.
When the top 2 bits are *10* in binary, the approximately largest cuboid that can be made in that empty area is stored.
The format is as follows:

```
from LSB->MSB
5 bits: distance in negative x direction (from voxel's position)
5 bits: distance in negative y direction
5 bits: distance in negative z direction
5 bits: distance in positive x direction (from (voxel's x positition+1))
5 bits: distance in positive y direction
5 bits: distance in positive z direction

top 2 bits: type, should be binary 10
```

This cuboid is then used to accelerate raytracing.
Because in the cast ray function I can skip the whole area that the cuboid stores instead
of needing to iterate over every single voxel which would be really slow.

Now the cast\_ray function is as follows:

```
fn cast_ray(pos: vec3<f32>, dir: vec3<f32>) -> bool
{
	var rayDir = dir;
	if (abs(rayDir.x) < 0.001) {
		rayDir.x = 0.001;
	}
	if (abs(rayDir.y) < 0.001) {
		rayDir.y = 0.001;
	}
	if (abs(rayDir.z) < 0.001) {
		rayDir.z = 0.001;
	}

	var origin = pos;
	var invDir = vec3<f32>(1.0f, 1.0f, 1.0f) / rayDir;
	let sign1or0 = vec3<u32>(u32(rayDir.x>0.0), u32(rayDir.y>0.0), u32(rayDir.z>0.0));
	var gridPos = vec3<u32>(origin);
	
	let addULP = vec3<u32>(
		select(bitcast<u32>(-1), 1u, rayDir.x>0.0),
		select(bitcast<u32>(-1), 1u, rayDir.y>0.0),
		select(bitcast<u32>(-1), 1u, rayDir.z>0.0),
	);
	rayDir.x = bitcast<f32>(bitcast<u32>(rayDir.x)+1u);
	rayDir.y = bitcast<f32>(bitcast<u32>(rayDir.y)+1u);
	rayDir.z = bitcast<f32>(bitcast<u32>(rayDir.z)+1u);
	
	origin.x = bitcast<f32>(bitcast<u32>(origin.x)+addULP.x);
	origin.y = bitcast<f32>(bitcast<u32>(origin.y)+addULP.y);
	origin.z = bitcast<f32>(bitcast<u32>(origin.z)+addULP.z);

    //...
```

Here I add the floating point unit of last place to some float values to make sure that
floating point rounds can not destroy the result, which would happen if removed.

```
    var voxel = 0u;
    var chunkIndex: u32;
    var oldAccelerationIndex: u32 = 0xFFFFFFFFu;
    var i = 0;
    for (; i < 256; i++) {
        let accelerationIndex: u32 = (((gridPos.z >> 3u) << 16u)
            | ((gridPos.y >> 3u) << 8u) | (gridPos.x >> 3u));
        
        if (oldAccelerationIndex != accelerationIndex) {
            chunkIndex = accelerationBuffer[accelerationIndex];
        }
        oldAccelerationIndex = accelerationIndex;
        
        var mask = 0xFFFFFFFFu;
        var shift = 0u;

        if ((chunkIndex & 2147483648u) == 0u) { // iterating over voxel
            let voxelIndex: u32 = chunkIndex
                | ((gridPos.x & 7u))
                | ((gridPos.y & 7u) << 3u)
                | ((gridPos.z & 7u) << 6u);
            voxel = chunkBuffer[voxelIndex];
        } else { // iterating over chunk
            voxel = chunkIndex;
            mask = ~7u;
            shift = 3u;
        }

        // exits if border or non-transparent voxel
        if ((voxel & 3221225472u) != 2147483648u) {
            break;
        }

        // approach: generate furthest plane of the cuboid on each x, y and z plane
        // then try to find the plane that has the smallest distance to the ray.
        // Finally, advance the ray with that smallest distance
        let box = (gridPos & vec3<u32>(mask, mask, mask)) - (
            (((vec3<u32>(voxel, voxel, voxel) >> (vec3<u32>(0u, 5u, 10u)+sign1or0*15u))
            & vec3<u32>(31u, 31u, 31u)) ^ vec3<u32>(-vec3<i32>(sign1or0)))
            << vec3<u32>(shift, shift, shift));
        let t = (vec3<f32>(box) - origin) * invDir;
        
        let tmin = min(min(t.x, t.y), t.z);
        let newTmin = bitcast<f32>(bitcast<u32>(tmin)+1u);
        var newPos = origin+rayDir*newTmin;
        newPos.x = bitcast<f32>(bitcast<u32>(newPos.x)+addULP.x);
        newPos.y = bitcast<f32>(bitcast<u32>(newPos.y)+addULP.y);
        newPos.z = bitcast<f32>(bitcast<u32>(newPos.z)+addULP.z);
        gridPos = vec3<u32>(newPos);
    }
    return (voxel & 3221225472u) != 0u;
}
```
The box code is the part that loads the cuboid.
If the cuboid is from a chunk instead of a voxel, then the size must be multiplied by 8 which is what
makes the code complex.


The lighting calculated in this compute shader is then interpolated in another compute shader.

<h2>A dive into the biggest empty cuboid generation</h2>

The cuboids must be generated for both the accelerationBuffer and the chunkBuffer, therefore I have 2 functions.
I will show the code that generates the cuboids for the empty chunks in the accelerationBuffer since that
is the simplest, and is very close to the empty voxel cuboid generation aswell.

The functions are written in C using emscripten to convert into webassembly.
```
// inax, inay, inaz is index in accelerationBuffer
void acceleration_area_calculate_df(uint16_t inax, uint16_t inay, uint16_t inaz)
{
    // summed area table expanded by 4 voxels in each direction
    uint16_t *sat = malloc(40*40*40*sizeof(uint16_t));
    uint16_t maxDFIterationCount = 31;
    
    // generate summed area table
    for (uint16_t z = 0,satIndex=0; z < 40; z++) {
    for (uint16_t y = 0; y < 40; y++) {
    for (uint16_t x = 0; x < 40; x++,satIndex++) {
    	int accelerationX = inax+x-4;
    	int accelerationY = inay+y-4;
    	int accelerationZ = inaz+z-4;
    	uint32_t accelerationIndex = (accelerationZ<<16)
    		| (accelerationY<<8) | accelerationX;
    	
    	uint16_t sum;
    	if (accelerationX < 0 || accelerationY < 0 || accelerationZ < 0
    			|| accelerationX > 255 || accelerationY > 255
    			|| accelerationZ > 255) {
            // outside map
    		sum = 1;
    	} else {
    		uint32_t voxel = accelerationBufferData[accelerationIndex];
    		switch (voxel & (3u << 30)) {
    		case 0u: // chunk index
    			sum = 1;
    			break;
    		case 3u<<30: // border
    			sum = 1;
    			break;
    		case 2u<<30: // air or empty cuboid field
    			sum = 0;
    			break;
    		default: __builtin_unreachable();
    		}
    	}
    	
    	if (x > 0 && y > 0 && z > 0) {
    		sum += sat_get_element(sat, 40, x-1, y-1, z-1);
    	}
    	if (z > 0) {
    		sum += sat_get_element(sat, 40, x, y, z-1);
    	}
    	if (y > 0) {
    		sum += sat_get_element(sat, 40, x, y-1, z);
    	}
    	if (x > 0) {
    		sum += sat_get_element(sat, 40, x-1, y, z);
    	}
    	if (x > 0 && y > 0) {
    		sum -= sat_get_element(sat, 40, x-1, y-1, z);
    	}
    	if (y > 0 && z > 0) {
    		sum -= sat_get_element(sat, 40, x, y-1, z-1);
    	}
    	if (x > 0 && z > 0) {
    		sum -= sat_get_element(sat, 40, x-1, y, z-1);
    	}
    	
    	sat[satIndex] = sum;
    }}}

    // ...
```

I use a summed area table to accelerate the empty cuboid generation since it allows for much
fewer memory accesses. In a 2d summed area table, every element stores the area from that element and 0,0.
Then to get the area you would only need 4 memory accesses.
I use a 3d summed area table which is a little bit more complex.

```
    for (uint16_t z = 0,satIndex=0; z < 32; z++) {
    for (uint16_t y = 0; y < 32; y++) {
    for (uint16_t x = 0; x < 32; x++,satIndex++) {
        uint16_t accelerationX = inax+x;
        uint16_t accelerationY = inay+y;
        uint16_t accelerationZ = inaz+z;
        
        uint32_t accelerationIndex = (accelerationZ<<16)
            | (accelerationY<<8) | accelerationX;
        uint32_t voxel = accelerationBufferData[accelerationIndex];
        if ((voxel & (3u << 30)) != (2u << 30)) {
            continue;
        }

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
        // 0: can't continue
        uint8_t xNegExpand = 2;
        uint8_t yNegExpand = 2;
        uint8_t zNegExpand = 2;
        uint8_t xPosExpand = 2;
        uint8_t yPosExpand = 2;
        uint8_t zPosExpand = 2;
        
        // approach:
        // try to expand in each direction
        // if can not expand in that direction -> stop trying
        for (uint16_t i = 0; i < maxDFIterationCount; i++) {
            if (x0 < 1) xNegExpand = 0;
            if (y0 < 1) yNegExpand = 0;
            if (z0 < 1) zNegExpand = 0;
            if (x1 > 38) xPosExpand = 0;
            if (y1 > 38) yPosExpand = 0;
            if (z1 > 38) zPosExpand = 0;

            uint16_t targetX0 = x0-(xNegExpand == 2);
            uint16_t targetY0 = y0-(yNegExpand == 2);
            uint16_t targetZ0 = z0-(zNegExpand == 2);
            uint16_t targetX1 = x1+(xPosExpand == 2);
            uint16_t targetY1 = y1+(yPosExpand == 2);
            uint16_t targetZ1 = z1+(zPosExpand == 2);

            if (xNegExpand) {
                if (0 == sat_get_sum(sat, 40,
                            x0-1, targetY0, targetZ0,
                            x0-1, targetY1, targetZ1)) {
                    x0--;
                    targetX0 = x0;
                } else {
                    xNegExpand = 1;
                }
            }
            if (yNegExpand) {
                if (0 == sat_get_sum(sat, 40,
                            targetX0, y0-1, targetZ0,
                            targetX1, y0-1, targetZ1)) {
                    y0--;
                    targetY0 = y0;
                } else {
                    yNegExpand = 1;
                }
            }
            if (zNegExpand) {
                if (0 == sat_get_sum(sat, 40,
                            targetX0, targetY0, z0-1,
                            targetX1, targetY1, z0-1)) {
                    z0--;
                    targetZ0 = z0;
                } else {
                    zNegExpand = 1;
                }
            }
            if (xPosExpand) {
                if (0 == sat_get_sum(sat, 40,
                            x1+1, targetY0, targetZ0,
                            x1+1, targetY1, targetZ1)) {
                    x1++;
                    targetX1 = x1;
                } else {
                    xPosExpand = 1;
                }
            }
            if (yPosExpand) {
                if (0 == sat_get_sum(sat, 40,
                            targetX0, y1+1, targetZ0,
                            targetX1, y1+1, targetZ1)) {
                    y1++;
                    targetY1 = y1;
                } else {
                    yPosExpand = 1;
                }
            }
            if (zPosExpand) {
                if (0 == sat_get_sum(sat, 40,
                            targetX0, targetY0, z1+1,
                            targetX1, targetY1, z1+1)) {
                    z1++;
                    targetZ1 = z1;
                } else {
                    zPosExpand = 1;
                }
            }
        }
        voxel = (1 << 31)
            | (satX-x0) | ((satY-y0) << 5) | ((satZ-z0) << 10)
            | ((x1-satX) << 15) | ((y1-satY) << 20) | ((z1-satZ) << 25);
        accelerationBufferData[accelerationIndex] = voxel;
    }}}
}
```

The code for generating the cuboids for the empty voxels is very similar.
