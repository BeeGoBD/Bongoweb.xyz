import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvas3DProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

export default function ThreeCanvas3D({
  className = "fixed inset-0 pointer-events-none -z-10 overflow-hidden",
  intensity = 1.0,
  interactive = true
}: ThreeCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Subtle fog for infinite depth
    scene.fog = new THREE.FogExp2(0xF1F5F9, 0.035);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 14);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 2. Lighting Rig (Studio 3-Point Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4 * intensity);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x9333EA, 2.5 * intensity);
    keyLight.position.set(6, 8, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x3B82F6, 1.8 * intensity);
    fillLight.position.set(-8, -4, 6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xF59E0B, 1.5 * intensity);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

    // Mouse-following point light
    const pointerLight = new THREE.PointLight(0xA855F7, 2.0 * intensity, 25);
    pointerLight.position.set(0, 0, 5);
    scene.add(pointerLight);

    // 3. Floating 3D Geometries with PBR Metallic & Crystal Materials
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Materials
    const purpleCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x7C3AED,
      emissive: 0x4C1D95,
      emissiveIntensity: 0.15,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transmission: 0.15,
      thickness: 1.2
    });

    const goldMetalMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      metalness: 0.9,
      roughness: 0.25
    });

    const cyanGemMat = new THREE.MeshPhysicalMaterial({
      color: 0x06B6D4,
      emissive: 0x0891B2,
      emissiveIntensity: 0.2,
      metalness: 0.75,
      roughness: 0.15,
      clearcoat: 0.9
    });

    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x10B981,
      metalness: 0.8,
      roughness: 0.3
    });

    const violetMat = new THREE.MeshStandardMaterial({
      color: 0xC084FC,
      metalness: 0.6,
      roughness: 0.4
    });

    // Mesh 1: Torus Knot (Center-top-right ambient sculpture)
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.6, 0.42, 100, 16);
    const torusKnot = new THREE.Mesh(torusKnotGeo, purpleCrystalMat);
    torusKnot.position.set(6.5, 3.2, -3);
    torusKnot.scale.set(0.85, 0.85, 0.85);
    objectsGroup.add(torusKnot);

    // Mesh 2: Icosahedron Crystal (Left side)
    const icosaGeo = new THREE.IcosahedronGeometry(1.5, 0);
    const icosa = new THREE.Mesh(icosaGeo, cyanGemMat);
    icosa.position.set(-7, 2, -2);
    objectsGroup.add(icosa);

    // Mesh 3: Beveled Octahedron (Bottom-right)
    const octaGeo = new THREE.OctahedronGeometry(1.4, 0);
    const octa = new THREE.Mesh(octaGeo, goldMetalMat);
    octa.position.set(7.2, -4.2, -2.5);
    objectsGroup.add(octa);

    // Mesh 4: Dodecahedron (Bottom-left)
    const dodecaGeo = new THREE.DodecahedronGeometry(1.3, 0);
    const dodeca = new THREE.Mesh(dodecaGeo, emeraldMat);
    dodeca.position.set(-6.8, -4.0, -3.5);
    objectsGroup.add(dodeca);

    // Mesh 5: Floating Ring (Top-left orbit)
    const ringGeo = new THREE.TorusGeometry(1.8, 0.12, 16, 64);
    const ring = new THREE.Mesh(ringGeo, violetMat);
    ring.position.set(-4.5, 4.5, -4);
    ring.rotation.x = Math.PI / 3;
    objectsGroup.add(ring);

    // Mesh 6: Small floating rounded cubes scattered
    const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const floatingCubes: THREE.Mesh[] = [];
    const cubeCoords = [
      [3.5, -2, -1],
      [-2.8, -3.5, -2],
      [-4.2, 0.5, -2.5],
      [4.2, 1.2, -2]
    ];
    cubeCoords.forEach(([x, y, z], idx) => {
      const mat = idx % 2 === 0 ? purpleCrystalMat : goldMetalMat;
      const c = new THREE.Mesh(cubeGeo, mat);
      c.position.set(x, y, z);
      c.scale.set(0.65, 0.65, 0.65);
      objectsGroup.add(c);
      floatingCubes.push(c);
    });

    // 4. Procedural 3D Star & Particle Dust Field
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 36;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
      particleScales[i] = Math.random() * 0.8 + 0.2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x9333EA,
      size: 0.14,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Smooth Mouse Parallax Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      targetMouseX = (clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 6. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Loop with Clock
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.x = currentMouseX * 1.5;
      camera.position.y = -currentMouseY * 1.2;
      camera.lookAt(0, 0, 0);

      // Move point light with mouse
      pointerLight.position.x = currentMouseX * 8;
      pointerLight.position.y = -currentMouseY * 6;

      // Rotate 3D floating crystals gracefully
      torusKnot.rotation.x = elapsedTime * 0.35;
      torusKnot.rotation.y = elapsedTime * 0.45;
      torusKnot.position.y = 3.2 + Math.sin(elapsedTime * 1.2) * 0.3;

      icosa.rotation.x = elapsedTime * 0.4;
      icosa.rotation.z = elapsedTime * 0.3;
      icosa.position.y = 2.0 + Math.sin(elapsedTime * 1.4 + 1) * 0.25;

      octa.rotation.y = elapsedTime * 0.45;
      octa.rotation.x = elapsedTime * 0.3;
      octa.position.y = -4.2 + Math.cos(elapsedTime * 1.1) * 0.3;

      dodeca.rotation.z = elapsedTime * 0.35;
      dodeca.rotation.y = elapsedTime * 0.4;
      dodeca.position.y = -4.0 + Math.sin(elapsedTime * 1.3 + 2) * 0.25;

      ring.rotation.z = elapsedTime * 0.25;
      ring.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.8) * 0.2;

      floatingCubes.forEach((c, idx) => {
        c.rotation.x = elapsedTime * (0.3 + idx * 0.1);
        c.rotation.y = elapsedTime * (0.4 + idx * 0.1);
        c.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.003;
      });

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      // Dispose geometries
      torusKnotGeo.dispose();
      icosaGeo.dispose();
      octaGeo.dispose();
      dodecaGeo.dispose();
      ringGeo.dispose();
      cubeGeo.dispose();
      particleGeo.dispose();

      // Dispose materials
      purpleCrystalMat.dispose();
      goldMetalMat.dispose();
      cyanGemMat.dispose();
      emeraldMat.dispose();
      violetMat.dispose();
      particleMat.dispose();

      // Dispose renderer
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [intensity, interactive]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
