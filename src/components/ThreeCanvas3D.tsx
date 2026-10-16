import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvas3DProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

/**
 * 21st.dev Premium Dark Atmosphere 3D Live Background.
 * Deep near-black background (#09090b) with soft royal blue (#3b5bff) and stardust wave points.
 * Subtle, calming, architecturally clean, zero bulky shapes.
 */
export default function ThreeCanvas3D({
  className = "fixed inset-0 pointer-events-none -z-10 overflow-hidden",
  intensity = 1.0,
  interactive = true
}: ThreeCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Deep Near-Black Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.045); // Seamless blend into 21st.dev #09090b

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 4.2, 12);
    camera.lookAt(0, 0, 0);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 3. Ambient & Pointer Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8 * intensity);
    scene.add(ambientLight);

    const pointerLight = new THREE.PointLight(0x3b5bff, 2.5 * intensity, 18);
    pointerLight.position.set(0, 2, 5);
    scene.add(pointerLight);

    // 4. Soft Feathered Circular Particle Texture (Royal Blue & White core)
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.25, 'rgba(59, 91, 255, 0.9)');
        gradient.addColorStop(0.65, 'rgba(59, 91, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createCircleTexture();

    // 5. Harmonious 3D Wave Grid (Clean, Simple, 21st.dev Geometry)
    const cols = 42;
    const rows = 32;
    const totalPoints = cols * rows;

    const wavePositions = new Float32Array(totalPoints * 3);
    const waveColors = new Float32Array(totalPoints * 3);

    const spacingX = 0.65;
    const spacingZ = 0.65;
    const offsetX = (cols * spacingX) / 2;
    const offsetZ = (rows * spacingZ) / 2;

    const colorBlue = new THREE.Color(0x3b5bff);
    const colorIndigo = new THREE.Color(0x6366f1);
    const colorLavender = new THREE.Color(0xa1a1b0);

    for (let iz = 0; iz < rows; iz++) {
      for (let ix = 0; ix < cols; ix++) {
        const index = iz * cols + ix;
        const x = ix * spacingX - offsetX;
        const z = iz * spacingZ - offsetZ;
        const y = 0;

        wavePositions[index * 3] = x;
        wavePositions[index * 3 + 1] = y;
        wavePositions[index * 3 + 2] = z;

        const ratio = (ix / cols + iz / rows) * 0.5;
        const c = colorBlue.clone().lerp(colorIndigo, Math.sin(ratio * Math.PI)).lerp(colorLavender, 0.15);

        waveColors[index * 3] = c.r;
        waveColors[index * 3 + 1] = c.g;
        waveColors[index * 3 + 2] = c.b;
      }
    }

    const waveGeometry = new THREE.BufferGeometry();
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

    const waveMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.45 * intensity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
    wavePoints.rotation.x = 0.18;
    scene.add(wavePoints);

    // 6. Subtle Atmospheric Floating Stardust
    const ambientCount = 36;
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientSpeeds = new Float32Array(ambientCount);

    for (let i = 0; i < ambientCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 22;
      ambientPositions[i * 3 + 1] = Math.random() * 6 - 1;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      ambientSpeeds[i] = 0.002 + Math.random() * 0.004;
    }

    const ambientGeometry = new THREE.BufferGeometry();
    ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));

    const ambientMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      color: 0x3b5bff,
      transparent: true,
      opacity: 0.28 * intensity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const ambientPoints = new THREE.Points(ambientGeometry, ambientMaterial);
    scene.add(ambientPoints);

    // Mouse Tracking Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Smooth Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Gentle camera sway
      camera.position.x = currentMouseX * 1.2;
      camera.position.y = 4.2 + currentMouseY * 0.8;
      camera.lookAt(0, 0, 0);

      pointerLight.position.x = currentMouseX * 6;
      pointerLight.position.y = 2 + currentMouseY * 4;

      // Update Wave Grid Heights
      const posAttr = waveGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let iz = 0; iz < rows; iz++) {
        for (let ix = 0; ix < cols; ix++) {
          const index = (iz * cols + ix) * 3;
          const x = ix * spacingX - offsetX;
          const z = iz * spacingZ - offsetZ;

          const distFromMouse = Math.hypot(x - currentMouseX * 4, z - currentMouseY * 2);
          const mouseRipple = Math.sin(distFromMouse * 1.5 - elapsedTime * 2.0) * 0.12 * Math.exp(-distFromMouse * 0.25);

          const wave1 = Math.sin(x * 0.45 + elapsedTime * 0.9) * 0.35;
          const wave2 = Math.cos(z * 0.35 + elapsedTime * 0.75) * 0.28;
          const wave3 = Math.sin((x + z) * 0.25 + elapsedTime * 1.1) * 0.18;

          posArray[index + 1] = wave1 + wave2 + wave3 + mouseRipple;
        }
      }
      posAttr.needsUpdate = true;

      // Update Ambient Motes
      const ambAttr = ambientGeometry.attributes.position as THREE.BufferAttribute;
      const ambArray = ambAttr.array as Float32Array;
      for (let i = 0; i < ambientCount; i++) {
        ambArray[i * 3 + 1] += ambientSpeeds[i];
        if (ambArray[i * 3 + 1] > 6) {
          ambArray[i * 3 + 1] = -1;
        }
      }
      ambAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      waveGeometry.dispose();
      waveMaterial.dispose();
      ambientGeometry.dispose();
      ambientMaterial.dispose();
      particleTexture.dispose();
    };
  }, [intensity, interactive]);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      aria-hidden="true" 
      style={{ background: '#09090b' }}
    />
  );
}
