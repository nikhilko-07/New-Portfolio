import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const containerRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold everything
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Create a circular glowing texture for particles using HTML5 canvas
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(0.6, "rgba(6, 182, 212, 0.4)"); // Cyan tint
        gradient.addColorStop(1, "rgba(6, 182, 212, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createCircleTexture();

    // 2. Outer Particle Sphere
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = [];

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.6 + Math.random() * 0.3; // slightly varied radius

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions.push({ x, y, z, phi, theta, speed: 0.1 + Math.random() * 0.5 });
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x06b6d4, // Cyan
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);

    // 3. Inner Wireframe Sphere (Icosahedron for sci-fi look)
    const wireGeometry = new THREE.IcosahedronGeometry(1.2, 2);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x4f46e5, // Indigo
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    mainGroup.add(wireMesh);

    // 4. Central Core Orb
    const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x818cf8, // Light Indigo
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Normalize coordinates (-1 to 1)
      targetX = (x / rect.width) * 2 - 1;
      targetY = -(y / rect.height) * 2 + 1;
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Animation variables
    let clock = new THREE.Clock();

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse tracking tilt
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      mainGroup.rotation.y = elapsedTime * 0.15 + mouseX * 0.6;
      mainGroup.rotation.x = mouseY * 0.6;

      // Animate core pulsing size
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Animate wireframe rotating on a different offset
      wireMesh.rotation.y = elapsedTime * -0.05;
      wireMesh.rotation.x = elapsedTime * 0.02;

      // Animate particles moving/breathing
      const positionsArray = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const orig = originalPositions[i];
        // breathing offset
        const offset = Math.sin(elapsedTime * orig.speed + i) * 0.05;
        const scale = 1 + offset;

        positionsArray[i * 3] = orig.x * scale;
        positionsArray[i * 3 + 1] = orig.y * scale;
        positionsArray[i * 3 + 2] = orig.z * scale;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      container.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose geometries & materials
      particleGeometry.dispose();
      particleMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "280px",
        position: "relative",
        cursor: "grab",
      }}
    />
  );
}
