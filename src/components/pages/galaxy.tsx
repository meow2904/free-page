"use client";
import * as THREE from 'three';
import React, {useEffect, useRef} from "react";
import {useWindowSize} from "@/hooks/useWindowSize";
import {createCamera, createControl, createRender, createScene} from "@/lib/three/utils";
import {
    ARM_X_DIST,
    ARM_X_MEAN,
    ARM_Y_DIST,
    ARM_Y_MEAN,
    ARMS, CORE_X_DIST, CORE_Y_DIST, GALAXY_THICKNESS, HAZE_OPACITY,
    NUM_STARS, OUTER_CORE_X_DIST, OUTER_CORE_Y_DIST, BLOOM_LAYER,
    SPIRAL,
    starTypes, HAZE_MAX, HAZE_MIN, HAZE_RATIO, BLOOM_PARAMS
} from "@/lib/galaxy/galaxy-config";
import {clamp, gaussianRandom, spiral} from "@/lib/galaxy/utils";
import {EffectComposer, RenderPass, ShaderPass, UnrealBloomPass} from "three-stdlib";
import { CompositionShader } from '@/lib/galaxy/CompositionShader';

const texture = new THREE.TextureLoader().load('./galaxy/sprite120.png')
const materials = starTypes.color.map((color) => new THREE.SpriteMaterial({map: texture, color: color}))

const hazeTexture = new THREE.TextureLoader().load('../galaxy/feathered60.png')
const hazeSprite = new THREE.SpriteMaterial({map: hazeTexture, color: 0x0082ff, opacity: HAZE_OPACITY, depthTest: false, depthWrite: false })


const Galaxy: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null); // Reference to the container div
    const [width, height] = useWindowSize();
    function addStar(scene: any, position: any) {
        const starType = generateStarType();
        let sprite = new THREE.Sprite(
            materials[starType],
        )
        sprite.scale.multiplyScalar(starTypes.size[starType])
        sprite.position.copy(position)
        scene.add(sprite);
    }

    function addHaze(scene : any, position : any) {
        let sprite = new THREE.Sprite(hazeSprite)
        sprite.position.copy(position)
        // const dist = Math.random() / 250
        // const a = clamp(HAZE_OPACITY * Math.pow(dist / 2.5, 2), 0, HAZE_OPACITY)
        // console.log({a})
        // sprite.material.opacity = clamp(HAZE_OPACITY * Math.pow(dist / 2.5, 2), 0, HAZE_OPACITY)
        // varying size of dust clouds
        sprite.scale.multiplyScalar(clamp(HAZE_MAX * Math.random(), HAZE_MIN, HAZE_MAX))
        // scene.add(sprite)

        scene.add(sprite);
    }

    function generateStarType() {
        let num = Math.random() * 100.0
        let pct = starTypes.percentage
        for (let i = 0; i < pct.length; i++) {
            num -= pct[i]
            if (num < 0) {
                return i
            }
        }
        return 0
    }

    useEffect(() => {
        if (!mountRef.current || width === 0 || height === 0) return;

        const scene = createScene();
        const camera = createCamera({width, height});
        const renderer = createRender({width, height});

        const galaxyGroup = new THREE.Group();
        scene.add(galaxyGroup); // add vào scene như 1 node tổng

        // const renderScene = new RenderPass( scene, camera )
        // const bloomPass = new UnrealBloomPass(new THREE.Vector2( width, height), 1.5, 0.4, 0.85 );
        // bloomPass.threshold = BLOOM_PARAMS.bloomThreshold;
        // bloomPass.strength = BLOOM_PARAMS.bloomStrength;
        // bloomPass.radius = BLOOM_PARAMS.bloomRadius;
        //
        // const bloomComposer = new EffectComposer(renderer)
        // bloomComposer.renderToScreen = false
        // bloomComposer.addPass(renderScene)
        // bloomComposer.addPass(bloomPass)
        //
        // // overlay composer
        // const overlayComposer = new EffectComposer(renderer)
        // overlayComposer.renderToScreen = false
        // overlayComposer.addPass(renderScene)
        //
        // // Shader pass to combine base layer, bloom, and overlay layers
        // const finalPass = new ShaderPass(
        //     new THREE.ShaderMaterial( {
        //         uniforms: {
        //             baseTexture: { value: null },
        //             bloomTexture: { value: bloomComposer.renderTarget2.texture },
        //             overlayTexture: { value: overlayComposer.renderTarget2.texture }
        //         },
        //         vertexShader: CompositionShader.vertex,
        //         fragmentShader: CompositionShader.fragment,
        //         defines: {}
        //     } ), 'baseTexture'
        // );
        // finalPass.needsSwap = true;
        //
        // // base layer composer
        // const baseComposer = new EffectComposer( renderer )
        // baseComposer.addPass( renderScene )
        // baseComposer.addPass(finalPass)


        // Clear previous content and reset star arrays
        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(renderer.domElement);
        const controls = createControl({camera, renderer});


        for ( let i = 0; i < NUM_STARS / 4; i++){
            let pos = new THREE.Vector3(gaussianRandom(0, CORE_X_DIST), gaussianRandom(0, CORE_Y_DIST), gaussianRandom(0, GALAXY_THICKNESS))
            addStar(galaxyGroup, pos)
            // addHaze(scene, pos)
        }

        for ( let i = 0; i < NUM_STARS / 4; i++){
            let pos = new THREE.Vector3(gaussianRandom(0, OUTER_CORE_X_DIST), gaussianRandom(0, OUTER_CORE_Y_DIST), gaussianRandom(0, GALAXY_THICKNESS))
            addStar(galaxyGroup, pos)
            // addHaze(scene, pos)
        }

        for (let j = 0; j < ARMS; j++) {
            for ( let i = 0; i < NUM_STARS / 4; i++){
                let pos = spiral(gaussianRandom(ARM_X_MEAN, ARM_X_DIST), gaussianRandom(ARM_Y_MEAN, ARM_Y_DIST), gaussianRandom(0, GALAXY_THICKNESS), j * 2 * Math.PI / ARMS)
                addStar(galaxyGroup, pos) // Pass arm index
                // addHaze(scene, pos)
            }
        }

        //////// haze /////////////
        for ( let i = 0; i < (NUM_STARS * HAZE_RATIO) / 4; i++){
            let pos = new THREE.Vector3(gaussianRandom(0, CORE_X_DIST), gaussianRandom(0, CORE_Y_DIST), gaussianRandom(0, GALAXY_THICKNESS))
            addHaze(galaxyGroup, pos)
        }

        for ( let i = 0; i <  (NUM_STARS * HAZE_RATIO) / 4; i++){
            let pos = new THREE.Vector3(gaussianRandom(0, OUTER_CORE_X_DIST), gaussianRandom(0, OUTER_CORE_Y_DIST), gaussianRandom(0, GALAXY_THICKNESS))
            addHaze(galaxyGroup, pos)
        }

        for (let j = 0; j < ARMS; j++) {
            for ( let i = 0; i <  (NUM_STARS * HAZE_RATIO) / 4; i++){
                let pos = spiral(gaussianRandom(ARM_X_MEAN, ARM_X_DIST), gaussianRandom(ARM_Y_MEAN, ARM_Y_DIST), gaussianRandom(0, GALAXY_THICKNESS), j * 2 * Math.PI / ARMS)
                addHaze(galaxyGroup, pos)
            }
        }

        // Animation loop with star rotation
        const animate = () => {
            requestAnimationFrame(animate);

            galaxyGroup.rotation.z += 0.0001; // quay quanh trục Y, có thể đổi trục
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup function
        return () => {
            if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            controls.dispose();
        };
    }, [height, width]);

    return (
        <div ref={mountRef} className="h-screen bg-gray-400">
        </div>
    )
}
export default Galaxy;