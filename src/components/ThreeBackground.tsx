import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 18);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x9f7aea, 2.2);
    dirLight1.position.set(10, 12, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight2.position.set(-10, -8, 8);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xf59e0b, 1.8, 30);
    pointLight.position.set(0, 4, 6);
    scene.add(pointLight);

    // Geometries & Materials
    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.OctahedronGeometry(1.0, 0),
      new THREE.TorusGeometry(1.3, 0.25, 16, 32),
      new THREE.TetrahedronGeometry(1.1, 0),
      new THREE.TorusGeometry(0.9, 0.18, 16, 28)
    ];

    const materials = [
      new THREE.MeshPhysicalMaterial({
        color: 0x7c3aed,
        metalness: 0.85,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.45
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,
        metalness: 0.75,
        roughness: 0.25,
        clearcoat: 0.8,
        transparent: true,
        opacity: 0.4
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        metalness: 0.65,
        roughness: 0.2,
        clearcoat: 0.9,
        transparent: true,
        opacity: 0.35
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.42
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0xec4899,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.9,
        transparent: true,
        opacity: 0.38
      })
    ];

    // Create 3D floating crystal elements
    const crystalGroup = new THREE.Group();
    const meshCount = 10;
    const meshItems: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      speedX: number;
      speedY: number;
      rotSpeedX: number;
      rotSpeedY: number;
      amplitude: number;
    }[] = [];

    for (let i = 0; i < meshCount; i++) {
      const geom = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geom, mat);

      // Distribute in a comfortable halo around viewport edges so center text remains readable
      const angle = (i / meshCount) * Math.PI * 2;
      const radius = 8 + (Math.random() - 0.5) * 4;
      const x = Math.cos(angle) * radius * 1.5;
      const y = Math.sin(angle) * (radius * 0.9);
      const z = (Math.random() - 0.5) * 6 - 2;

      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      const scale = 0.55 + Math.random() * 0.45;
      mesh.scale.set(scale, scale, scale);

      crystalGroup.add(mesh);

      meshItems.push({
        mesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedX: 0.3 + Math.random() * 0.4,
        speedY: 0.25 + Math.random() * 0.35,
        rotSpeedX: (Math.random() - 0.5) * 0.8,
        rotSpeedY: (Math.random() - 0.5) * 0.9,
        amplitude: 0.6 + Math.random() * 0.5
      });
    }
    scene.add(crystalGroup);

    // Ambient floating 3D particle dust
    const particleCount = 70;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x7c3aed),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0x10b981)
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse tracking with silky exponential damping
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Window resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop with frame-rate independent delta
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Exponential damping for camera & cursor parallax
      currentMouseX = THREE.MathUtils.damp(currentMouseX, targetMouseX, 2.5, delta);
      currentMouseY = THREE.MathUtils.damp(currentMouseY, targetMouseY, 2.5, delta);

      camera.position.x = currentMouseX * 1.5;
      camera.position.y = currentMouseY * 1.2;
      camera.lookAt(0, 0, 0);

      // Rotate particles slowly
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      // Animate 3D floating crystals
      for (let i = 0; i < meshItems.length; i++) {
        const item = meshItems[i];
        item.mesh.rotation.x += item.rotSpeedX * delta;
        item.mesh.rotation.y += item.rotSpeedY * delta;

        // Floating sine drift
        item.mesh.position.y = item.baseY + Math.sin(elapsedTime * item.speedY + i) * item.amplitude;
        item.mesh.position.x = item.baseX + Math.cos(elapsedTime * item.speedX + i) * (item.amplitude * 0.5);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      // Dispose geometries
      geometries.forEach(g => g.dispose());
      particleGeometry.dispose();

      // Dispose materials
      materials.forEach(m => m.dispose());
      particleMaterial.dispose();

      // Dispose renderer
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 opacity-60"
    />
  );
}
