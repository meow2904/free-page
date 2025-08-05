import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {WebGLRenderer} from "three";

export const createScene = () => {
    const scene = new THREE.Scene();
    scene.background = null; // nếu bạn muốn nền trong suốt
    scene.fog = new THREE.FogExp2(0xEBE2DB, 0.00003);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Màu trắng, cường độ 0.5
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10); // Đặt vị trí ánh sáng
    scene.add(directionalLight);

    const axesHelper = new THREE.AxesHelper(10); // Tham số 5 là chiều dài mỗi trục
    scene.add(axesHelper);
    return scene;
};

export const createCamera = ({width, height}: {width: number, height:number}) => {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // Đặt camera nhìn theo góc 45 độ xuống dưới
    camera.position.set(0, -100, 100); // Đặt vị trí camera
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Hướng camera về trung tâm của scene (0, 0, 0)
    camera.updateProjectionMatrix(); // Cập nhật lại projection matrix
    return camera;
};

export const createRender = ({width, height}: {width: number, height:number}) => {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance', // Sử dụng GPU mạnh nhất có thể
        logarithmicDepthBuffer: true, // Sử dụng logarithmic depth buffer cho hiệu suất tốt hơn với các đối tượng xa

    });
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width, height); // Cập nhật kích thước của renderer theo kích thước cửa sổ
    renderer.domElement.style.position = 'absolute'; // Đảm bảo canvas không vượt ra ngoài div
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    // renderer.toneMappingExposure = 0.5;
    return renderer;
};

export const createControl = ({camera, renderer}
                              : {camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
                                renderer: WebGLRenderer}) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;       // Giúp quay mượt hơn
    controls.dampingFactor = 0.05;       // Mức độ giảm tốc khi xoay
    controls.autoRotate = false;         // Nếu muốn camera tự động quay quanh
    controls.target.set(0, 0, 0);
    controls.minDistance = 50;    // Không cho zoom gần hơn 5 đơn vị
    controls.maxDistance = 700;   // Không cho zoom xa hơn 20 đơn vị// Camera sẽ luôn nhìn vào điểm này (thường là giữa scene, tức vị trí của bánh)
    controls.update();
    return controls;
};
