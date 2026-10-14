import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { WebsiteCategory } from '../types';
import { spatialAudio } from '../utils/audio3D';
import { 
  Maximize2, Minimize2, RotateCcw, 
  Layers, Play, Pause, Volume2, VolumeX, Eye
} from 'lucide-react';

interface ThreeCanvasProps {
  currentCategory?: WebsiteCategory;
  isStudioMode?: boolean;
  onToggleStudioMode?: () => void;
  onSelectCategory?: (category: WebsiteCategory) => void;
}

// Reusable math helpers to eliminate GC allocations in render loop
const _tempVec = new THREE.Vector3();
const _targetRot = new THREE.Euler();

export default function ThreeCanvas({
  currentCategory = 'ecommerce',
  isStudioMode = false,
  onToggleStudioMode,
  onSelectCategory
}: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);
  const [activeCategoryState, setActiveCategoryState] = useState<WebsiteCategory>(currentCategory);

  // References to 3D scene objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const laptopGroupRef = useRef<THREE.Group | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Exploded layer groups
  const layerTopRef = useRef<THREE.Group | null>(null);
  const layerMidRef = useRef<THREE.Group | null>(null);
  const layerBtmRef = useRef<THREE.Group | null>(null);
  const laserBeamsRef = useRef<THREE.LineSegments | null>(null);

  // Particles & rings
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const categoryRingsRef = useRef<THREE.Group | null>(null);

  // State refs for animation loop
  const isExplodedRef = useRef(isExploded);
  isExplodedRef.current = isExploded;

  const isAutoRotateRef = useRef(isAutoRotate);
  isAutoRotateRef.current = isAutoRotate;

  const isStudioModeRef = useRef(isStudioMode);
  isStudioModeRef.current = isStudioMode;

  const activeCategoryRef = useRef(activeCategoryState);
  activeCategoryRef.current = activeCategoryState;

  // Mouse & Touch interaction tracking
  const pointerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotX: 0.15,
    rotY: -0.35,
    targetRotX: 0.15,
    targetRotY: -0.35
  });

  // Sync category from props
  useEffect(() => {
    setActiveCategoryState(currentCategory);
  }, [currentCategory]);

  // Update procedural screen texture whenever category changes
  const updateScreenTexture = useCallback((cat: WebsiteCategory) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient based on category
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640);
    if (cat === 'ecommerce') {
      bgGrad.addColorStop(0, '#1E1B4B');
      bgGrad.addColorStop(0.5, '#2E1065');
      bgGrad.addColorStop(1, '#0F172A');
    } else if (cat === 'restaurant') {
      bgGrad.addColorStop(0, '#431407');
      bgGrad.addColorStop(0.5, '#7C2D12');
      bgGrad.addColorStop(1, '#1C1917');
    } else if (cat === 'blogging') {
      bgGrad.addColorStop(0, '#0C4A6E');
      bgGrad.addColorStop(0.5, '#1E3A8A');
      bgGrad.addColorStop(1, '#0F172A');
    } else {
      bgGrad.addColorStop(0, '#064E3B');
      bgGrad.addColorStop(0.5, '#065F46');
      bgGrad.addColorStop(1, '#022C22');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 640);

    // Browser chrome header bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, 0, 1024, 60);

    // Traffic light dots
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(36, 30, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(60, 30, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(84, 30, 8, 0, Math.PI * 2);
    ctx.fill();

    // URL bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.roundRect(120, 12, 600, 36, 18);
    ctx.fill();

    ctx.fillStyle = '#A78BFA';
    ctx.font = 'bold 16px monospace';
    const domainText = cat === 'ecommerce' ? 'https://bongoweb.com/store-2085' :
      cat === 'restaurant' ? 'https://bongoweb.com/cafe-1042' :
      cat === 'blogging' ? 'https://bongoweb.com/media-3091' :
      'https://bongoweb.com/grocery-4150';
    ctx.fillText(`🔒 ${domainText}`, 145, 36);

    // Live Ready Badge
    ctx.fillStyle = '#10B981';
    ctx.roundRect(750, 14, 180, 32, 16);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('⚡ 24h Live Ready', 775, 36);

    // Hero Banner on screen
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.roundRect(40, 85, 944, 210, 16);
    ctx.fill();

    // Hero title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 36px sans-serif';
    const heroTitle = cat === 'ecommerce' ? 'PREMIUM E-COMMERCE STORE #2085' :
      cat === 'restaurant' ? 'RESTAURANT & CAFE PORTAL #1042' :
      cat === 'blogging' ? 'NEWS & MEDIA PORTAL #3091' :
      'EXPRESS GROCERY SUPERMARKET #4150';
    ctx.fillText(heroTitle, 75, 145);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '20px sans-serif';
    const heroSub = cat === 'ecommerce' ? 'Automated bKash/Nagad Checkout & Instant Courier Tracking' :
      cat === 'restaurant' ? 'Digital Food Menu, Table Reservation & Home Delivery' :
      cat === 'blogging' ? 'Fast Google SEO Indexing & Google AdSense Revenue' :
      'Fresh Daily Essentials, Weight Calculator & Express Delivery';
    ctx.fillText(heroSub, 75, 185);

    // CTA Button on screen
    ctx.fillStyle = cat === 'ecommerce' ? '#7C3AED' :
      cat === 'restaurant' ? '#EA580C' :
      cat === 'blogging' ? '#2563EB' : '#059669';
    ctx.roundRect(75, 215, 220, 52, 12);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Order Live Site • ৳১,৯৯০', 95, 248);

    // 3 Product/Feature Mockup Cards
    for (let i = 0; i < 3; i++) {
      const cardX = 40 + i * 320;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.roundRect(cardX, 315, 300, 290, 16);
      ctx.fill();

      // Card image placeholder
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.roundRect(cardX + 16, 330, 268, 150, 12);
      ctx.fill();

      // Feature tags
      ctx.fillStyle = '#A78BFA';
      ctx.font = 'bold 15px sans-serif';
      const featName = cat === 'ecommerce' ? ['bKash Auto', 'Pathao Courier', 'Stock Sync'][i] :
        cat === 'restaurant' ? ['Food Menu', 'Table Booking', 'Cash On Delivery'][i] :
        cat === 'blogging' ? ['AdSense Ready', 'SEO Engine', 'Dark Mode'][i] :
        ['Weight Scale', 'Local Delivery', 'Cart Reorder'][i];
      ctx.fillText(featName, cardX + 20, 515);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px sans-serif';
      ctx.fillText('Included in Complete Package', cardX + 20, 545);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('✓ INSTANT SETUP', cardX + 20, 580);
    }

    if (screenTextureRef.current) {
      screenTextureRef.current.image = canvas;
      screenTextureRef.current.needsUpdate = true;
    } else {
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      screenTextureRef.current = tex;
      if (screenMeshRef.current) {
        const mat = screenMeshRef.current.material as THREE.MeshStandardMaterial;
        mat.map = tex;
        mat.needsUpdate = true;
      }
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 7.5);
    cameraRef.current = camera;

    // 3. High fidelity WebGL Renderer (Skill Directives)
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment Lighting with RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 8, 6);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Rim/Back light for glowing edges
    const rimLight = new THREE.DirectionalLight(0x9F7AEA, 1.8);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Fill Warm Light
    const fillLight = new THREE.PointLight(0x7C3AED, 2.5, 12);
    fillLight.position.set(0, -1, 3);
    scene.add(fillLight);

    // 5. Root Transform Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    // 6. BUILD PROCEDURAL 3D LAPTOP & 3D ARCHITECTURAL LAYERS
    const laptopGroup = new THREE.Group();
    rootGroup.add(laptopGroup);
    laptopGroupRef.current = laptopGroup;

    // Top Layer: Screen & Display
    const layerTop = new THREE.Group();
    laptopGroup.add(layerTop);
    layerTopRef.current = layerTop;

    // Mid Layer: bKash / Payment Gateway & Courier API Circuit Board
    const layerMid = new THREE.Group();
    laptopGroup.add(layerMid);
    layerMidRef.current = layerMid;

    // Bottom Layer: Admin Panel & Cloud Database Server Base
    const layerBtm = new THREE.Group();
    laptopGroup.add(layerBtm);
    layerBtmRef.current = layerBtm;

    // --- BOTTOM BASE / SERVER TRAY (layerBtm) ---
    // Aluminum chassis
    const baseGeo = new THREE.BoxGeometry(3.6, 0.14, 2.5);
    const metalMat = new THREE.MeshPhysicalMaterial({
      color: 0x1E293B,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.3
    });
    const baseMesh = new THREE.Mesh(baseGeo, metalMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    baseMesh.position.set(0, -0.07, 0);
    layerBtm.add(baseMesh);

    // Keyboard tray indentation
    const keyboardGeo = new THREE.BoxGeometry(3.2, 0.02, 1.3);
    const keyboardMat = new THREE.MeshStandardMaterial({
      color: 0x0F172A,
      roughness: 0.6,
      metalness: 0.4
    });
    const keyboardMesh = new THREE.Mesh(keyboardGeo, keyboardMat);
    keyboardMesh.position.set(0, 0.01, -0.4);
    layerBtm.add(keyboardMesh);

    // Glowing trackpad
    const trackpadGeo = new THREE.BoxGeometry(1.2, 0.01, 0.8);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.7
    });
    const trackpadMesh = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpadMesh.position.set(0, 0.01, 0.65);
    layerBtm.add(trackpadMesh);

    // --- MIDDLE LAYER: bKash/Nagad API & Engine Circuit Tray (layerMid) ---
    const circuitGeo = new THREE.BoxGeometry(3.4, 0.08, 2.3);
    const circuitMat = new THREE.MeshPhysicalMaterial({
      color: 0x312E81,
      roughness: 0.2,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85
    });
    const circuitMesh = new THREE.Mesh(circuitGeo, circuitMat);
    circuitMesh.position.set(0, 0.2, 0);
    layerMid.add(circuitMesh);

    // Glowing circuit line accents
    const linesGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const lineMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.01, 0.04),
        new THREE.MeshBasicMaterial({ color: 0xA855F7 })
      );
      lineMesh.position.set(0, 0.25, -0.8 + i * 0.32);
      linesGroup.add(lineMesh);
    }
    layerMid.add(linesGroup);

    // --- TOP LAYER: Display Lid & Screen (layerTop) ---
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.05, -1.25);
    lidGroup.rotation.x = -Math.PI / 12; // Slight ergonomic tilt
    layerTop.add(lidGroup);

    // Aluminum Screen Shell
    const lidShellGeo = new THREE.BoxGeometry(3.6, 2.3, 0.08);
    const lidShell = new THREE.Mesh(lidShellGeo, metalMat);
    lidShell.position.set(0, 1.15, 0);
    lidShell.castShadow = true;
    lidGroup.add(lidShell);

    // Bezel
    const bezelGeo = new THREE.BoxGeometry(3.45, 2.15, 0.02);
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, 1.15, 0.04);
    lidGroup.add(bezelMesh);

    // Procedural Screen Mesh
    const screenGeo = new THREE.PlaneGeometry(3.3, 2.0);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.15, 0.06);
    lidGroup.add(screenMesh);
    screenMeshRef.current = screenMesh;

    // Contact Shadow Ground Plane beneath device
    const shadowGeo = new THREE.PlaneGeometry(6, 4);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.55)');
      grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.6, 0);
    rootGroup.add(shadowMesh);

    // Laser Connector Beams (visible in exploded 3D view)
    const beamGeo = new THREE.BufferGeometry();
    const beamCoords = [
      -1.7, 0, -1.2,  -1.7, 1.8, -1.2,
       1.7, 0, -1.2,   1.7, 1.8, -1.2,
      -1.7, 0,  1.2,  -1.7, 1.8,  1.2,
       1.7, 0,  1.2,   1.7, 1.8,  1.2,
    ];
    beamGeo.setAttribute('position', new THREE.Float32BufferAttribute(beamCoords, 3));
    const beamMat = new THREE.LineBasicMaterial({
      color: 0x7C3AED,
      transparent: true,
      opacity: 0
    });
    const laserBeams = new THREE.LineSegments(beamGeo, beamMat);
    laptopGroup.add(laserBeams);
    laserBeamsRef.current = laserBeams;

    // 7. Ambient Particle Constellation (Floating Stardust & Shards)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArr[i] = (Math.random() - 0.5) * 16;
      posArr[i + 1] = (Math.random() - 0.5) * 10;
      posArr[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x9F7AEA,
      size: 0.05,
      transparent: true,
      opacity: 0.65
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;

    // 8. Orbiting 3D Category Rings
    const ringsGroup = new THREE.Group();
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(3.2 + r * 0.8, 0.015, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r === 0 ? 0x7C3AED : r === 1 ? 0x60A5FA : 0x34D399,
        transparent: true,
        opacity: 0.35 - r * 0.08
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.5 + r * 0.2;
      ringsGroup.add(ringMesh);
    }
    rootGroup.add(ringsGroup);
    categoryRingsRef.current = ringsGroup;

    // Initial Screen Texture update
    updateScreenTexture(activeCategoryRef.current);

    // 9. SILKY SMOOTH ANIMATION LOOP (Skill Directives)
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Gentle floating levitation
      if (rootGroupRef.current) {
        rootGroupRef.current.position.y = Math.sin(time * 1.5) * 0.08;
      }

      // Orbiting rings rotation
      if (categoryRingsRef.current) {
        categoryRingsRef.current.rotation.z += 0.003;
        categoryRingsRef.current.rotation.y += 0.002;
      }

      // Particles gentle drift
      if (particleSystemRef.current) {
        particleSystemRef.current.rotation.y = time * 0.015;
      }

      // Auto rotation when enabled and not dragging
      if (isAutoRotateRef.current && !pointerRef.current.isDragging) {
        pointerRef.current.targetRotY += delta * 0.25;
      }

      // Exponential damping on rotation
      pointerRef.current.rotX = THREE.MathUtils.damp(
        pointerRef.current.rotX,
        pointerRef.current.targetRotX,
        10,
        delta
      );
      pointerRef.current.rotY = THREE.MathUtils.damp(
        pointerRef.current.rotY,
        pointerRef.current.targetRotY,
        10,
        delta
      );

      if (rootGroupRef.current) {
        rootGroupRef.current.rotation.x = pointerRef.current.rotX;
        rootGroupRef.current.rotation.y = pointerRef.current.rotY;
      }

      // 3D Exploded Layer Kinematics
      const targetTopY = isExplodedRef.current ? 1.4 : 0;
      const targetMidY = isExplodedRef.current ? 0.6 : 0;
      const targetBtmY = isExplodedRef.current ? -0.7 : 0;
      const targetBeamOpacity = isExplodedRef.current ? 0.75 : 0;

      if (layerTopRef.current) {
        layerTopRef.current.position.y = THREE.MathUtils.damp(
          layerTopRef.current.position.y,
          targetTopY,
          8,
          delta
        );
      }
      if (layerMidRef.current) {
        layerMidRef.current.position.y = THREE.MathUtils.damp(
          layerMidRef.current.position.y,
          targetMidY,
          8,
          delta
        );
      }
      if (layerBtmRef.current) {
        layerBtmRef.current.position.y = THREE.MathUtils.damp(
          layerBtmRef.current.position.y,
          targetBtmY,
          8,
          delta
        );
      }
      if (laserBeamsRef.current) {
        const mat = laserBeamsRef.current.material as THREE.LineBasicMaterial;
        mat.opacity = THREE.MathUtils.damp(mat.opacity, targetBeamOpacity, 8, delta);
      }

      // Camera position adapts between Studio Mode and Ambient Hybrid Mode
      const targetCamZ = isStudioModeRef.current ? 6.2 : 7.8;
      const targetCamY = isStudioModeRef.current ? 2.0 : 2.6;
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 5, delta);

      renderer.render(scene, camera);
    };

    animate();

    // 10. Pointer Drag and Parallax Handlers
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      pointerRef.current.isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      pointerRef.current.prevX = clientX;
      pointerRef.current.prevY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (pointerRef.current.isDragging) {
        const deltaX = clientX - pointerRef.current.prevX;
        const deltaY = clientY - pointerRef.current.prevY;
        pointerRef.current.targetRotY += deltaX * 0.008;
        pointerRef.current.targetRotX = Math.max(
          -Math.PI / 4,
          Math.min(Math.PI / 3, pointerRef.current.targetRotX + deltaY * 0.008)
        );
        pointerRef.current.prevX = clientX;
        pointerRef.current.prevY = clientY;
      } else {
        // Subtle ambient parallax
        const normX = (clientX / window.innerWidth) * 2 - 1;
        const normY = (clientY / window.innerHeight) * 2 - 1;
        pointerRef.current.targetRotY = THREE.MathUtils.clamp(
          pointerRef.current.targetRotY + normX * 0.0008,
          -Math.PI * 2,
          Math.PI * 2
        );
      }
    };

    const handlePointerUp = () => {
      pointerRef.current.isDragging = false;
    };

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);
    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      // Dispose Three.js objects
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      renderer.dispose();
      if (dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
    };
  }, [updateScreenTexture]);

  // Sync texture when active category changes
  useEffect(() => {
    updateScreenTexture(activeCategoryState);
  }, [activeCategoryState, updateScreenTexture]);

  // Reset 3D camera
  const handleResetCamera = () => {
    spatialAudio.playWhoosh();
    pointerRef.current.targetRotX = 0.15;
    pointerRef.current.targetRotY = -0.35;
  };

  const handleToggleExplode = () => {
    const next = !isExploded;
    setIsExploded(next);
    spatialAudio.playChime(next ? 880 : 520);
  };

  const handleToggleSound = () => {
    const muted = spatialAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className={`relative w-full h-full select-none ${isStudioMode ? 'fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-2xl' : 'pointer-events-auto'}`}>
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none" 
      />

      {/* Exploded Layer Annotations (Visible only in Exploded Mode) */}
      {isExploded && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center gap-16 sm:gap-20 z-10 animate-fadeIn">
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-900/90 border border-purple-400/60 text-white text-[11px] sm:text-xs font-black shadow-lg backdrop-blur-md">
            💎 LAYER 1: রেসপন্সিভ ফ্রন্টএন্ড ও মোবাইল অ্যাপ UI
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-900/90 border border-indigo-400/60 text-white text-[11px] sm:text-xs font-black shadow-lg backdrop-blur-md">
            ⚡ LAYER 2: বিকাশ/নগদ অটো পেমেন্ট ও কুরিয়ার ইঞ্জিন
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-400/60 text-white text-[11px] sm:text-xs font-black shadow-lg backdrop-blur-md">
            🛡️ LAYER 3: সুরক্ষিত ক্লাউড ডাটাবেস ও এডমিন প্যানেল
          </div>
        </div>
      )}

      {/* Collapsible Bottom 3D Control Dock (Skill Directives: Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-3 pointer-events-auto">
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-[0_16px_40px_rgba(107,70,193,0.18)] p-2 sm:p-2.5 transition-all duration-300">
          
          {/* Collapse/Expand Notch */}
          <button
            onClick={() => setIsHudCollapsed(!isHudCollapsed)}
            className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded-t-xl bg-white dark:bg-slate-900 border-t border-x border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-xs cursor-pointer flex items-center gap-1 hover:text-[#7C3AED]"
          >
            <span>{isHudCollapsed ? '▴ ৩ডি কন্ট্রোল দেখান' : '▾ মিনিমাইজ করুন'}</span>
          </button>

          {!isHudCollapsed && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Category Switcher Pills */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                {[
                  { id: 'ecommerce', label: 'ই-কমার্স', emoji: '🛍️' },
                  { id: 'restaurant', label: 'রেস্তোরাঁ', emoji: '🍔' },
                  { id: 'blogging', label: 'ব্লগ ও মিডিয়া', emoji: '📰' },
                  { id: 'grocery', label: 'সুপারশপ', emoji: '🥦' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveCategoryState(item.id as WebsiteCategory);
                      spatialAudio.playHover();
                      if (onSelectCategory) onSelectCategory(item.id as WebsiteCategory);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      activeCategoryState === item.id
                        ? 'bg-[#7C3AED] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons: Exploded View, Spin, Reset, Sound, Fullscreen */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                {/* 3D Exploded Layers Toggle */}
                <button
                  onClick={handleToggleExplode}
                  title="লেয়ার পৃথকীকরণ (Exploded View)"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isExploded
                      ? 'bg-amber-500 text-white shadow-amber-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">লেয়ার পৃথকীকরণ</span>
                </button>

                {/* Auto Rotation */}
                <button
                  onClick={() => setIsAutoRotate(!isAutoRotate)}
                  title={isAutoRotate ? 'রোটেশন থামান' : 'অটো রোটেশন চালু'}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                {/* Reset View */}
                <button
                  onClick={handleResetCamera}
                  title="ভিউ রিসেট করুন"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={handleToggleSound}
                  title={isMuted ? 'সাউন্ড চালু করুন' : 'সাউন্ড বন্ধ করুন'}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#7C3AED]" />}
                </button>

                {/* Studio Mode Fullscreen Toggle */}
                {onToggleStudioMode && (
                  <button
                    onClick={onToggleStudioMode}
                    title={isStudioMode ? 'স্টুডিও বন্ধ করুন' : 'ফুল ৩ডি স্টুডিও'}
                    className="p-2 rounded-xl bg-[#7C3AED] text-white hover:bg-[#6B46C1] transition-colors cursor-pointer shadow-xs"
                  >
                    {isStudioMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
