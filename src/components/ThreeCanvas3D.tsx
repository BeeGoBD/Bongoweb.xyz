import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvas3DProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

/**
 * Simple, elegant, and calming 3D live background.
 * No bulky shapes, no dark rings, no chaotic lines or spiderweb plexus.
 * Just a graceful, hypnotic 3D wave field of soft luminous micro-points with smooth mouse/touch parallax.
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

    // 1. Scene & Depth Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xF8F5FC, 0.038); // Fades seamlessly into light background

    // 2. Camera Setup (Tilted viewing angle for 3D depth)
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 4.5, 12);
    camera.lookAt(0, 0, 0);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.setClearColor(0xF8F5FC, 0);

    container.appendChild(renderer.domElement);

    // 3. Ambient & Mouse Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2 * intensity);
    scene.add(ambientLight);

    const pointerLight = new THREE.PointLight(0xA855F7, 2.0 * intensity, 18);
    pointerLight.position.set(0, 2, 5);
    scene.add(pointerLight);

    // 4. Soft Feathered Circular Particle Texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(168, 85, 247, 0.85)');
        gradient.addColorStop(0.65, 'rgba(124, 58, 237, 0.35)');
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createCircleTexture();

    // 5. Harmonious 3D Wave Grid (Clean, Simple, Architectural)
    const cols = 42;
    const rows = 32;
    const totalPoints = cols * rows;

    const wavePositions = new Float32Array(totalPoints * 3);
    const waveColors = new Float32Array(totalPoints * 3);

    const spacingX = 0.65;
    const spacingZ = 0.65;
    const offsetX = (cols * spacingX) / 2;
    const offsetZ = (rows * spacingZ) / 2;

    const colorPurple = new THREE.Color(0x7C3AED);
    const colorLilac = new THREE.Color(0xA855F7);
    const colorSky = new THREE.Color(0x60A5FA);

    for (let iz = 0; iz < rows; iz++) {
      for (let ix = 0; ix < cols; ix++) {
        const index = iz * cols + ix;
        const x = ix * spacingX - offsetX;
        const z = iz * spacingZ - offsetZ;
        const y = 0;

        wavePositions[index * 3] = x;
        wavePositions[index * 3 + 1] = y;
        wavePositions[index * 3 + 2] = z;

        // Subtle gradient: purple in center, lilac/sky at edges
        const distFromCenter = Math.sqrt((x * x) / (offsetX * offsetX) + (z * z) / (offsetZ * offsetZ));
        const color = distFromCenter < 0.5 ? colorPurple : distFromCenter < 0.85 ? colorLilac : colorSky;

        waveColors[index * 3] = color.r;
        waveColors[index * 3 + 1] = color.g;
        waveColors[index * 3 + 2] = color.b;
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
      opacity: 0.55,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
    wavePoints.position.set(0, -2.8, -1.5);
    wavePoints.rotation.x = 0.22; // subtle upward tilt towards camera
    scene.add(wavePoints);

    // 6. Gentle Ambient Floating Motes (Subtle, slow dust motes in space)
    const moteCount = 50;
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePositions[i * 3] = (Math.random() - 0.5) * 22;
      motePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      motePositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const moteGeometry = new THREE.BufferGeometry();
    moteGeometry.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
    const moteMaterial = new THREE.PointsMaterial({
      color: 0xC084FC,
      size: 0.12,
      map: particleTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const motePoints = new THREE.Points(moteGeometry, moteMaterial);
    scene.add(motePoints);

    // 7. Smooth Mouse / Touch Parallax Tracking
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

    // 8. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      camera.position.x = currentMouseX * 1.2;
      camera.position.y = 4.5 - currentMouseY * 0.8;
      camera.lookAt(0, -0.5, 0);

      // Light moves smoothly with pointer
      pointerLight.position.x = currentMouseX * 7;
      pointerLight.position.y = 2 - currentMouseY * 4;

      // Gentle, harmonic undulating wave motion
      const posAttr = waveGeometry.getAttribute('position') as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let iz = 0; iz < rows; iz++) {
        for (let ix = 0; ix < cols; ix++) {
          const index = iz * cols + ix;
          const x = ix * spacingX - offsetX;
          const z = iz * spacingZ - offsetZ;

          // Harmonic calm ripple
          const wave1 = Math.sin(x * 0.35 + elapsedTime * 0.75) * 0.45;
          const wave2 = Math.cos(z * 0.38 + elapsedTime * 0.65) * 0.35;
          const wave3 = Math.sin((x + z) * 0.25 + elapsedTime * 0.5) * 0.2;

          // Subtle interactive mouse elevation
          const mouseWorldX = currentMouseX * 6;
          const mouseDist = Math.sqrt((x - mouseWorldX) ** 2 + z ** 2);
          const mouseLift = Math.max(0, 1 - mouseDist / 6) * 0.35;

          posArr[index * 3 + 1] = wave1 + wave2 + wave3 + mouseLift;
        }
      }
      posAttr.needsUpdate = true;

      // Slow drift of floating motes
      motePoints.rotation.y = elapsedTime * 0.015;
      motePoints.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean Cleanup & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      waveGeometry.dispose();
      moteGeometry.dispose();
      waveMaterial.dispose();
      moteMaterial.dispose();
      particleTexture.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [intensity, interactive]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
