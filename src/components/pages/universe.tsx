"use client";

import {useWindowSize} from "@/hooks/useWindowSize";
import React, {useEffect, useRef} from "react";
import * as THREE from 'three';
import {createCamera, createControl, createRender, createScene} from "@/lib/three/utils";

const Universe: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null); // Reference to the container div
    const [width, height] = useWindowSize();
    const texture = new THREE.TextureLoader().load('./galaxy/sprite120.png')

    function gaussianRandom(): number {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
    function gaussian(mean = 0, std = 1) {
        let u = Math.random();
        let v = Math.random();
        return (
            Math.sqrt(-2.0 * Math.log(u)) *
            Math.cos(2.0 * Math.PI * v) * std +
            mean
        );
    }

    function generateGalaxy({
                                count = 20000, //số sao
                                radius = 50, //bán kính
                                numArms = 4, //số cánh tay
                                spin= 5, //độ xoáy
                                thickness= 5 //độ dày thiên hà
                            }) {

        const galaxy = new THREE.Group();
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const colorInside = new THREE.Color(0xfff5c0) // vàng sáng (tâm)
        const colorOutside = new THREE.Color(0x4b6fff) // xanh tím ngoài rìa

        //generate star
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            const branchAngle = ((i % numArms) / numArms) * (Math.PI * 2);
            // const rad = Math.pow(Math.random(), randomnessPower) * parameters.radius;

            let r = radius * Math.pow(Math.random(), 2);
            const arm = Math.floor(Math.random() * numArms); // chọn cánh tay
            let theta = r * 1.5 + (arm * 2 * Math.PI) / numArms; // góc
            // theta += gaussianRandom(); // nhiễu góc
            // r += gaussianRandom();     // nhiễu bán kính

            theta += gaussian(0, 0.3); // nhiễu góc
            r += gaussian(0, 0.2);     // nhiễu bán kính

            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            // const y = gaussianRandom(); // dày thiên hà
            const y = gaussian(0, 0.1); // dày thiên hà

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // Màu: nội -> ngoại theo r / radius, thêm chút nhiễu
            const mix = THREE.MathUtils.clamp((r / radius) + gaussianRandom() * 0.03, 0, 1);
            const c = colorInside.clone().lerp(colorOutside, mix);
            colors[i3] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
        }

        //create geometry
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            map: texture,
        })
        const points = new THREE.Points(geometry, material);
        galaxy.add(points);
        return galaxy;
    }

    // ---------- Galaxy Factory ----------
    function createSpiralGalaxy(
        seed = 42,               // seed cho random (ổn định mỗi lần chạy)
        count = 120000,          // tổng số "sao" (particle)
        arms = 4,                // số cánh tay
        radius = 25,             // bán kính tối đa
        spin = 1.5,              // độ xoắn (rad đo theo mỗi đơn vị bán kính)
        armWidth = 0.35,         // độ rộng cánh (0..1) - càng lớn càng "tơi"
        verticalSpread = 0.1,    // độ dày theo trục Y
        coreRadius = 2.5,        // bán kính lõi "mềm" (giúp tâm dày hơn)
        radialPower = 2.2,       // phân bố mật độ theo bán kính (lớn -> dồn về tâm)
        size = 0.02,             // kích thước mỗi điểm
        opacity = 0.9,           // độ trong suốt
        additive = true) {

        const colorInside = new THREE.Color(0xfff5c0) // vàng sáng (tâm)
        const colorOutside = new THREE.Color(0x4b6fff) // xanh tím ngoài rìa

        // ---- PRNG ổn định theo seed ----
        let _s = seed >>> 0;
        function rand() { // xorshift32
            _s ^= _s << 13; _s ^= _s >>> 17; _s ^= _s << 5;
            return ((_s >>> 0) / 0xFFFFFFFF);
        }
        function randNorm() { // Box-Muller (Gaussian ~ N(0,1))
            const u = Math.max(1e-6, rand()), v = Math.max(1e-6, rand());
            return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        }

        const group = new THREE.Group();

        // ---- Tạo buffer cho vị trí + màu ----
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorIn = colorInside.clone();
        const colorOut = colorOutside.clone();

        const armAngle = (Math.PI * 2) / arms;

        for (let i = 0; i < count; i++) {
            // Mục tiêu: r ~ [0, radius] với phân bố dồn vào tâm
            // Lấy r thô rồi “làm mềm” vùng lõi để đậm hơn
            let t = Math.pow(rand(), radialPower);
            let r = t * radius;

            // Tăng mật độ ở lõi: “kéo” thêm điểm vào gần 0..coreRadius
            const inCore = rand() < 0.25; // 25% cơ hội ưu tiên lõi
            if (inCore) {
                r = Math.pow(rand(), 1.8) * coreRadius + Math.pow(rand(), radialPower) * (radius * 0.25);
            }

            // Chọn cánh tay
            const armIndex = Math.floor(rand() * arms);

            // Góc cơ sở của cánh + góc xoắn theo bán kính
            const baseAngle = armIndex * armAngle;
            const spinAngle = r * spin;

            // Nhiễu làm "tơi" cánh tay theo bán kính (armWidth)
            // càng xa tâm -> cho phép nhiễu lớn hơn một chút
            const radialJitter = (randNorm() * armWidth * (0.3 + 0.7 * (r / radius)));

            // Góc cuối cùng
            const angle = baseAngle + spinAngle + radialJitter;

            // Vị trí mặt phẳng đĩa (XZ) + dày theo Y
            const x = Math.cos(angle) * r + randNorm() * 0.05 * (1 + r / radius);
            const z = Math.sin(angle) * r + randNorm() * 0.05 * (1 + r / radius);
            const y = randNorm() * verticalSpread * (0.2 + 0.8 * (r / radius));

            const i3 = i * 3;
            positions[i3 + 0] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // Màu: nội -> ngoại theo r / radius, thêm chút nhiễu
            const mix = THREE.MathUtils.clamp((r / radius) + randNorm() * 0.03, 0, 1);
            const c = colorIn.clone().lerp(colorOut, mix);
            colors[i3 + 0] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size,
            vertexColors: true,
            transparent: true,
            opacity,
            depthWrite: false,
            blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        group.add(points);

        // ---- “Lõi” sáng bằng Sprite (tuỳ chọn, không cần texture) ----
        const coreMat = new THREE.SpriteMaterial({
            color: colorInside.clone().lerp(new THREE.Color('#ffffff'), 0.5),
            opacity: 0.85,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            map: texture
        });
        const core = new THREE.Sprite(coreMat);
        core.scale.set(coreRadius * 2.0, coreRadius * 2.0, 1);
        core.position.set(0, 0, 0);
        group.add(core);
        return group;
    }



    useEffect(() => {
        if (!mountRef.current || width === 0 || height === 0) return;

        const scene = createScene();
        const camera = createCamera({width, height});
        const renderer = createRender({width, height});

        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(renderer.domElement);
        const controls = createControl({camera, renderer});

        //createGalaxy(scene)
        // createGalaxy(scene)
        const newGalaxy = generateGalaxy({count: 100000, radius: 300, numArms: 5});
        scene.add(newGalaxy);

        // const gr = createSpiralGalaxy(
        //      2025,
        //     150_000,
        //      4,
        //     30,
        //     1.8,
        //     0.35,
        //      1.5,
        //     3,
        //     2.3,
        //     0.02,
        //     0.95,
        //     true
        // );
        // scene.add(gr);

        const animate = () => {
            requestAnimationFrame(animate);

            // galaxyGroup.rotation.z += 0.0001; // quay quanh trục Y, có thể đổi trục
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

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

export default Universe;