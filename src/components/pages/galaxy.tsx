"use client";
import * as THREE from 'three';
import React, {useEffect, useRef} from "react";
import {useWindowSize} from "@/hooks/useWindowSize";
import {createCamera, createControl, createRender, createScene} from "@/lib/three/utils";

const Galaxy: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null); // Reference to the container div
    const [width, height] = useWindowSize();

    useEffect(() => {
        if (!mountRef.current || width === 0 || height === 0) return;

        const scene = createScene();
        const camera = createCamera({width, height});
        const renderer = createRender({width, height});

        // Clear previous content
        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(renderer.domElement);
        const controls = createControl({camera, renderer});

        const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Màu trắng, cường độ 0.5
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10); // Đặt vị trí ánh sáng
        scene.add(directionalLight);

        const sizeBase =  9
        const baseGeometry = new THREE.BoxGeometry(sizeBase, 0.1, sizeBase); // Chiều rộng, độ dày, chiều sâu
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xe6e6e6 }); // Màu nâu nhạt (giống đế gỗ)
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.05; // Nếu bánh cao 1 đơn vị thì đế đặt thấp hơn
        scene.add(base);


        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
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