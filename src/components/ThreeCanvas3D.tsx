import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvas3DProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

/**
 * High-performance, elegant 3D live background.
 * Completely free of big bulky shapes or dark circles.
 * Features a silky-smooth, interactive cosmic particle constellation & ambient stardust web.
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

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Subtle fog for infinite depth with light atmospheric tone
    scene.fog = new THREE.FogExp2(0xF8FAFC, 0.025);

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
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 2. Ambient & Responsive Pointer Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2 * intensity);
    scene.add(ambientLight);

    const pointerLight = new THREE.PointLight(0x9333EA, 2.2 * intensity, 22);
    pointerLight.position.set(0, 0, 6);
    scene.add(pointerLight);

    const accentLight = new THREE.PointLight(0x06B6D4, 1.6 * intensity, 20);
    accentLight.position.set(-6, -4, 4);
    scene.add(accentLight);

    // 3. Delicate Constellation Network (Micro-Nodes & Dynamic Connection Lines)
    const nodeCount = 95;
    const nodeCoords: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];
    const nodeColors = [
      new THREE.Color(0x7C3AED), // Brand Purple
      new THREE.Color(0xA855F7), // Lilac
      new THREE.Color(0x3B82F6), // Sky Blue
      new THREE.Color(0x06B6D4), // Cyan
      new THREE.Color(0xF59E0B)  // Warm Amber
    ];

    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColorArray = new Float32Array(nodeCount * 3);

    const spreadX = 28;
    const spreadY = 18;
    const spreadZ = 12;

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * spreadX,
        (Math.random() - 0.5) * spreadY,
        (Math.random() - 0.5) * spreadZ - 2
      );
      nodeCoords.push(pos);
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.004
        )
      );

      nodePositions[i * 3] = pos.x;
      nodePositions[i * 3 + 1] = pos.y;
      nodePositions[i * 3 + 2] = pos.z;

      const c = nodeColors[i % nodeColors.length];
      nodeColorArray[i * 3] = c.r;
      nodeColorArray[i * 3 + 1] = c.g;
      nodeColorArray[i * 3 + 2] = c.b;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColorArray, 3));

    // Canvas texture for smooth circular glowing particles
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.35, 'rgba(192, 132, 252, 0.85)');
        gradient.addColorStop(0.7, 'rgba(124, 58, 237, 0.35)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();

    const nodeMaterial = new THREE.PointsMaterial({
      size: 0.32,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodePoints);

    // Dynamic Line Segments connecting nearby nodes (Plexus effect, max 180 lines)
    const maxLines = 180;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // 4. Ambient Deep Stardust Field (faint, gentle, uniform)
    const dustCount = 260;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 40;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xA855F7,
      size: 0.08,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

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
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      camera.position.x = currentMouseX * 1.8;
      camera.position.y = -currentMouseY * 1.4;
      camera.lookAt(0, 0, 0);

      // Move subtle lights with mouse
      pointerLight.position.x = currentMouseX * 9;
      pointerLight.position.y = -currentMouseY * 7;

      accentLight.position.x = -6 + Math.sin(elapsedTime * 0.5) * 2;
      accentLight.position.y = -4 + Math.cos(elapsedTime * 0.6) * 2;

      // Update node positions with gentle floating movement
      const posAttr = nodeGeometry.getAttribute('position') as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        const p = nodeCoords[i];
        const v = nodeVelocities[i];

        p.x += v.x + Math.sin(elapsedTime * 0.4 + i) * 0.003;
        p.y += v.y + Math.cos(elapsedTime * 0.35 + i) * 0.003;
        p.z += v.z;

        // Bounce back within bounds
        const halfX = spreadX / 2;
        const halfY = spreadY / 2;
        if (p.x > halfX || p.x < -halfX) v.x = -v.x;
        if (p.y > halfY || p.y < -halfY) v.y = -v.y;
        if (p.z > 2 || p.z < -10) v.z = -v.z;

        posArr[i * 3] = p.x;
        posArr[i * 3 + 1] = p.y;
        posArr[i * 3 + 2] = p.z;
      }
      posAttr.needsUpdate = true;

      // Update dynamic connecting lines between close nodes
      let lineIndex = 0;
      const linePosAttr = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
      const lineColorAttr = lineGeometry.getAttribute('color') as THREE.BufferAttribute;
      const lPosArr = linePosAttr.array as Float32Array;
      const lColorArr = lineColorAttr.array as Float32Array;

      const connectionDist = 4.2;

      for (let i = 0; i < nodeCount && lineIndex < maxLines; i++) {
        for (let j = i + 1; j < nodeCount && lineIndex < maxLines; j++) {
          const p1 = nodeCoords[i];
          const p2 = nodeCoords[j];
          const dist = p1.distanceTo(p2);

          if (dist < connectionDist) {
            const alpha = 1.0 - dist / connectionDist;
            
            // Start point
            lPosArr[lineIndex * 6] = p1.x;
            lPosArr[lineIndex * 6 + 1] = p1.y;
            lPosArr[lineIndex * 6 + 2] = p1.z;

            // End point
            lPosArr[lineIndex * 6 + 3] = p2.x;
            lPosArr[lineIndex * 6 + 4] = p2.y;
            lPosArr[lineIndex * 6 + 5] = p2.z;

            // Line color with alpha fade
            const c1 = nodeColors[i % nodeColors.length];
            const c2 = nodeColors[j % nodeColors.length];

            lColorArr[lineIndex * 6] = c1.r * alpha * 0.7;
            lColorArr[lineIndex * 6 + 1] = c1.g * alpha * 0.7;
            lColorArr[lineIndex * 6 + 2] = c1.b * alpha * 0.7;

            lColorArr[lineIndex * 6 + 3] = c2.r * alpha * 0.7;
            lColorArr[lineIndex * 6 + 4] = c2.g * alpha * 0.7;
            lColorArr[lineIndex * 6 + 5] = c2.b * alpha * 0.7;

            lineIndex++;
          }
        }
      }

      // Zero out unused line segments
      for (let k = lineIndex; k < maxLines; k++) {
        lPosArr[k * 6] = 0;
        lPosArr[k * 6 + 1] = 0;
        lPosArr[k * 6 + 2] = 0;
        lPosArr[k * 6 + 3] = 0;
        lPosArr[k * 6 + 4] = 0;
        lPosArr[k * 6 + 5] = 0;
      }

      linePosAttr.needsUpdate = true;
      lineColorAttr.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex * 2);

      // Rotate stardust layer gently
      dustParticles.rotation.y = elapsedTime * 0.02;
      dustParticles.rotation.x = elapsedTime * 0.01;

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
      nodeGeometry.dispose();
      lineGeometry.dispose();
      dustGeometry.dispose();

      // Dispose materials & textures
      nodeMaterial.dispose();
      lineMaterial.dispose();
      dustMaterial.dispose();
      particleTexture.dispose();

      // Dispose renderer
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [intensity, interactive]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
