import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface IntroPageProps {
  onEnterStudio: (user: any) => void;
  isLoggedIn: boolean;
  currentUser: any;
  onSignOut: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onEnterStudio, isLoggedIn, currentUser, onSignOut }) => {
  const crystalContainerRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const footerCanvasRef = useRef<HTMLCanvasElement>(null);

  // Auth States
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Loader state
  const [loaderActive, setLoaderActive] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  // Audio state
  const [audioOn, setAudioOn] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<any[]>([]);

  // Menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Typing prompt states
  const [promptText, setPromptText] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPromptImages, setShowPromptImages] = useState(false);

  // Hypnotic Illusion States
  const [illusionType, setIllusionType] = useState<'vortex' | 'moire' | 'fibonacci' | 'grid'>('vortex');
  const [illusionSpeed, setIllusionSpeed] = useState<number>(1.8);
  const [illusionDensity, setIllusionDensity] = useState<number>(45);
  const [illusionWarp, setIllusionWarp] = useState<number>(5.0);
  const [illusionColor, setIllusionColor] = useState<'cyan' | 'violet' | 'multi' | 'monochrome'>('multi');
  const [glassOverlayType, setGlassOverlayType] = useState<'lens' | 'fullscreen' | 'none'>('lens');
  const [audioSync, setAudioSync] = useState<boolean>(true);
  const [nexusOpen, setNexusOpen] = useState<boolean>(false);
  const [sensorySpikeActive, setSensorySpikeActive] = useState<boolean>(false);

  // Synced refs for Hypnotic Illusion Engine (ensures seamless, continuous, zero-restart rendering)
  const illusionTypeRef = useRef(illusionType);
  const illusionSpeedRef = useRef(illusionSpeed);
  const illusionDensityRef = useRef(illusionDensity);
  const illusionWarpRef = useRef(illusionWarp);
  const illusionColorRef = useRef(illusionColor);
  const audioSyncRef = useRef(audioSync);
  const sensorySpikeActiveRef = useRef(sensorySpikeActive);
  const audioOnRef = useRef(audioOn);

  useEffect(() => { illusionTypeRef.current = illusionType; }, [illusionType]);
  useEffect(() => { illusionSpeedRef.current = illusionSpeed; }, [illusionSpeed]);
  useEffect(() => { illusionDensityRef.current = illusionDensity; }, [illusionDensity]);
  useEffect(() => { illusionWarpRef.current = illusionWarp; }, [illusionWarp]);
  useEffect(() => { illusionColorRef.current = illusionColor; }, [illusionColor]);
  useEffect(() => { audioSyncRef.current = audioSync; }, [audioSync]);
  useEffect(() => { sensorySpikeActiveRef.current = sensorySpikeActive; }, [sensorySpikeActive]);
  useEffect(() => { audioOnRef.current = audioOn; }, [audioOn]);

  const prompts = [
    "Generate a futuristic cyberpunk city with cinematic lighting...",
    "Create a surreal ocean scene with bioluminescent creatures...",
    "Design a luxury perfume bottle floating in zero gravity...",
    "Render an ancient temple overgrown with crystal formations...",
    "Produce a moody noir detective scene with rain reflections..."
  ];

  const promptSeeds = [
    ['cy1', 'cy2', 'cy3'],
    ['oc1', 'oc2', 'oc3'],
    ['pf1', 'pf2', 'pf3'],
    ['tm1', 'tm2', 'tm3'],
    ['nr1', 'nr2', 'nr3']
  ];

  // Loader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderActive(false);
      setContentVisible(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  // Puter Auth Handlers
  const handleStartCreating = async () => {
    if (isLoggedIn) {
      onEnterStudio(currentUser);
      return;
    }

    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);

    try {
      if (!window.puter) {
        throw new Error("Puter.js module is currently offline. Please refresh and try again.");
      }
      
      console.log("[Vayu Engine] Initializing Puter Auth Handshake...");
      const user = await window.puter.auth.signIn();
      
      if (user) {
        console.log("[Vayu Engine] Puter handshake validated successfully:", user.username);
        onEnterStudio(user);
      } else {
        throw new Error("Handshake aborted: No credentials returned.");
      }
    } catch (err: any) {
      console.error("[Vayu Engine] Handshake Exception:", err);
      setAuthError(err.message || "A security disruption occurred during authentication.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Audio synthesizer toggle
  const toggleAudio = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      if (!audioOn) {
        // Start synthesizing deep rich lowpass pads
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filterNode = ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.value = 55; // A1 bass
        osc2.type = 'sine';
        osc2.frequency.value = 82.5; // E2 fifth
        osc3.type = 'sine';
        osc3.frequency.value = 110; // A2 octave

        filterNode.type = 'lowpass';
        filterNode.frequency.value = 120;

        gainNode.gain.setValueAtTime(0.0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 2); // soft fade in

        [osc1, osc2, osc3].forEach(o => o.connect(filterNode));
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);

        [osc1, osc2, osc3].forEach(o => o.start());

        audioNodesRef.current = [osc1, osc2, osc3, filterNode, gainNode];
        setAudioOn(true);
      } else {
        // Fade out & stop
        const nodes = audioNodesRef.current;
        if (nodes && nodes.length > 0) {
          const gainNode = nodes[4];
          if (gainNode && ctx) {
            gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.5);
          }
          setTimeout(() => {
            nodes.forEach(node => {
              try {
                node.stop ? node.stop() : node.disconnect();
              } catch (e) {}
            });
          }, 600);
        }
        audioNodesRef.current = [];
        setAudioOn(false);
      }
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      const nodes = audioNodesRef.current;
      nodes.forEach(node => {
        try {
          node.stop ? node.stop() : node.disconnect();
        } catch (e) {}
      });
    };
  }, []);

  // Typewriter effect for prompt bar
  useEffect(() => {
    if (isProcessing) return;

    const currentPrompt = prompts[currentPromptIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentCharIndex < currentPrompt.length) {
        timeout = setTimeout(() => {
          setPromptText(currentPrompt.substring(0, currentCharIndex + 1));
          setCurrentCharIndex(prev => prev + 1);
        }, 35 + Math.random() * 20);
      } else {
        // Fully typed. Process
        setIsProcessing(true);
        timeout = setTimeout(() => {
          setIsProcessing(false);
          setShowPromptImages(true);
          
          // Show generated blocks for 2 seconds, then delete
          setTimeout(() => {
            setShowPromptImages(false);
            setIsDeleting(true);
          }, 2400);
        }, 800);
      }
    } else {
      if (currentCharIndex > 0) {
        timeout = setTimeout(() => {
          setPromptText(currentPrompt.substring(0, currentCharIndex - 1));
          setCurrentCharIndex(prev => prev - 1);
        }, 12);
      } else {
        setIsDeleting(false);
        setCurrentPromptIndex(prev => (prev + 1) % prompts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentCharIndex, isDeleting, currentPromptIndex, isProcessing]);

  // Three.js Crystal rendering
  useEffect(() => {
    const container = crystalContainerRef.current;
    if (!container) return;

    const w = container.clientWidth || 380;
    const h = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const eS = new THREE.Scene();
    eS.background = new THREE.Color(0x050510);

    const lightParams = [
      [0x4f7cff, 30, 5, 5, 5],
      [0x8b5cf6, 20, -5, -3, 3],
      [0x22d3ee, 14, 0, 5, -5],
      [0xffffff, 3, 0, -5, 5]
    ];
    lightParams.forEach(([color, intensity, x, y, z]) => {
      const l = new THREE.PointLight(color, intensity);
      l.position.set(x, y, z);
      eS.add(l);
    });

    const envMap = pmrem.fromScene(eS, 0, 0.1, 100).texture;
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0x303050, 0.2));
    const kL = new THREE.PointLight(0x4f7cff, 14, 20);
    kL.position.set(3, 3, 4);
    scene.add(kL);

    const fL = new THREE.PointLight(0x8b5cf6, 8, 20);
    fL.position.set(-4, -2, 3);
    scene.add(fL);

    const rL = new THREE.PointLight(0x22d3ee, 6, 20);
    rL.position.set(0, 4, -4);
    scene.add(rL);

    const cGeo = new THREE.IcosahedronGeometry(1.4, 4);
    const origP = new Float32Array(cGeo.attributes.position.array);
    const cMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0a1a,
      metalness: 0.08,
      roughness: 0.02,
      envMap,
      envMapIntensity: 2.5,
      transmission: 0.95,
      thickness: 2,
      ior: 2.4,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      iridescence: 1,
      iridescenceIOR: 2,
      iridescenceThicknessRange: [80, 800],
      specularIntensity: 1,
      specularColor: new THREE.Color(0x4f7cff),
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      sheen: 0.3,
      sheenRoughness: 0.3,
      sheenColor: new THREE.Color(0x8b5cf6)
    });

    const crystal = new THREE.Mesh(cGeo, cMat);
    scene.add(crystal);

    const iM = new THREE.MeshBasicMaterial({ color: 0x4f7cff, transparent: true, opacity: 0.04 });
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 2), iM);
    scene.add(inner);

    const wM = new THREE.MeshBasicMaterial({ color: 0x4f7cff, wireframe: true, transparent: true, opacity: 0.015 });
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 1), wM);
    scene.add(wire);

    const rM1 = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.04 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.003, 12, 80), rM1);
    ring1.rotation.x = Math.PI / 2.5;
    scene.add(ring1);

    const rM2 = rM1.clone();
    rM2.color.set(0x8b5cf6);
    rM2.opacity = 0.025;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.003, 12, 80), rM2);
    ring2.rotation.x = Math.PI / 1.5;
    ring2.rotation.y = 1;
    scene.add(ring2);

    // Particle Cloud inside Crystal Space
    const pC = 150;
    const pGeo = new THREE.BufferGeometry();
    const pP = new Float32Array(pC * 3);
    for (let i = 0; i < pC; i++) {
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 2.5;
      pP[i * 3] = r * Math.sin(p) * Math.cos(t);
      pP[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pP[i * 3 + 2] = r * Math.cos(p);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pP, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x4f7cff,
      size: 0.008,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(pGeo, pointsMaterial);
    scene.add(points);

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let scrollPos = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollPos = window.scrollY / (window.innerHeight || 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      crystal.rotation.x = t * 0.1 + mouseY * 0.3;
      crystal.rotation.y = t * 0.15 + mouseX * 0.3;

      // Morphing geometry vertices
      const posAttr = cGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const ox = origP[i * 3];
        const oy = origP[i * 3 + 1];
        const oz = origP[i * 3 + 2];
        const len = Math.max(0.001, Math.sqrt(ox * ox + oy * oy + oz * oz));
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;
        const m = Math.sin(t * 0.6 + ox * 2) * Math.cos(t * 0.4 + oy * 2) * Math.sin(t * 0.5 + oz * 2);
        const sm = scrollPos * 0.25 * Math.sin(ox * 3 + t * 0.3);
        const d = m * 0.12 + sm;
        posAttr.setXYZ(i, ox + nx * d, oy + ny * d, oz + nz * d);
      }
      posAttr.needsUpdate = true;
      cGeo.computeVertexNormals();

      const scaleVal = 0.4 + Math.sin(t * 1.5) * 0.08;
      inner.scale.set(scaleVal, scaleVal, scaleVal);
      iM.opacity = 0.03 + Math.sin(t * 2) * 0.02;

      wire.rotation.x = -t * 0.03;
      wire.rotation.y = -t * 0.05;
      ring1.rotation.z = t * 0.08;
      ring2.rotation.z = -t * 0.06;

      kL.position.x = 3 + mouseX * 2;
      kL.position.y = 3 + mouseY * 2;
      fL.position.x = -4 + mouseX * 1.2;
      fL.position.y = -2 + mouseY * 1.2;
      rL.position.x = mouseX * 1.5;
      rL.position.y = 4 + mouseY;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w2 = container.clientWidth;
      const h2 = container.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      
      // Cleanup Three resources
      cGeo.dispose();
      cMat.dispose();
      iM.dispose();
      wM.dispose();
      rM1.dispose();
      rM2.dispose();
      pGeo.dispose();
      pointsMaterial.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Background Hypnotic Illusion Engine
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const handleResize = () => {
      if (canvas) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    let mouseX = w / 2;
    let mouseY = h / 2;
    let targetMouseX = w / 2;
    let targetMouseY = h / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    let time = 0;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);

      // Read continuously updated values from synced refs
      const currentType = illusionTypeRef.current;
      const currentSpeed = illusionSpeedRef.current;
      const currentWarp = illusionWarpRef.current;
      const currentDensity = illusionDensityRef.current;
      const currentColor = illusionColorRef.current;
      const currentAudioSync = audioSyncRef.current;
      const currentSensoryActive = sensorySpikeActiveRef.current;
      const currentAudioOn = audioOnRef.current;

      const activeSpeed = currentSensoryActive ? 5.0 : currentSpeed;
      const activeWarp = currentSensoryActive ? 12.0 : currentWarp;
      const activeDensity = currentSensoryActive ? 90 : currentDensity;

      time += 0.01 * activeSpeed;

      // Smooth mouse coordinates
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Clear with slight trail for ghosting persistence
      ctx.fillStyle = 'rgba(5, 5, 5, 0.06)';
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const maxRadius = Math.sqrt(w * w + h * h) / 1.6;

      // Determine colors
      let primaryColor = 'rgba(34, 211, 238, 0.2)'; // cyan
      let secondaryColor = 'rgba(139, 92, 246, 0.2)'; // violet
      let glowColor = 'rgba(79, 124, 255, 0.1)';

      if (currentColor === 'cyan') {
        primaryColor = 'rgba(34, 211, 238, 0.25)';
        secondaryColor = 'rgba(6, 182, 212, 0.1)';
        glowColor = 'rgba(34, 211, 238, 0.05)';
      } else if (currentColor === 'violet') {
        primaryColor = 'rgba(167, 139, 250, 0.25)';
        secondaryColor = 'rgba(124, 58, 237, 0.1)';
        glowColor = 'rgba(139, 92, 246, 0.05)';
      } else if (currentColor === 'monochrome') {
        primaryColor = 'rgba(255, 255, 255, 0.15)';
        secondaryColor = 'rgba(255, 255, 255, 0.05)';
        glowColor = 'rgba(255, 255, 255, 0.02)';
      } else if (currentColor === 'multi') {
        const hue1 = (time * 15) % 360;
        const hue2 = (time * 15 + 120) % 360;
        primaryColor = `hsla(${hue1}, 80%, 65%, 0.18)`;
        secondaryColor = `hsla(${hue2}, 80%, 55%, 0.12)`;
        glowColor = `hsla(${hue1}, 80%, 65%, 0.04)`;
      }

      // If sensory spike, color cycles incredibly fast and gets intensely bright
      if (currentSensoryActive) {
        const hue1 = (time * 120) % 360;
        primaryColor = `hsla(${hue1}, 95%, 70%, 0.4)`;
        secondaryColor = `hsla(${(hue1 + 180) % 360}, 95%, 70%, 0.25)`;
        glowColor = `hsla(${hue1}, 95%, 70%, 0.15)`;
      }

      ctx.lineWidth = currentSensoryActive ? 2.0 : 1.2;
      ctx.lineCap = 'round';

      // Audio reactive synthesis link
      if (currentAudioSync && currentAudioOn && audioNodesRef.current && audioNodesRef.current.length >= 5) {
        const osc1 = audioNodesRef.current[0];
        const osc2 = audioNodesRef.current[1];
        const osc3 = audioNodesRef.current[2];
        const filterNode = audioNodesRef.current[3];
        const audioCtx = audioContextRef.current;

        if (osc1 && osc2 && osc3 && filterNode && audioCtx) {
          const dx = mouseX - w / 2;
          const dy = mouseY - h / 2;
          const distRatio = Math.min(1, Math.sqrt(dx * dx + dy * dy) / (Math.max(w, h) / 2));
          
          const baseCutoff = currentSensoryActive ? 400 : 90 + (activeSpeed * 18);
          const maxCutoff = currentSensoryActive ? 2500 : 420 + (activeWarp * 25);
          const targetCutoff = baseCutoff + (1 - distRatio) * (maxCutoff - baseCutoff) + Math.sin(time * 3) * 25;
          
          filterNode.frequency.setTargetAtTime(targetCutoff, audioCtx.currentTime, 0.1);

          const baseFreq = (currentSensoryActive ? 88 : 55) + (1 - distRatio) * (activeWarp * 1.5) + Math.sin(time * 0.5) * 2;
          osc1.frequency.setTargetAtTime(baseFreq, audioCtx.currentTime, 0.15);
          osc2.frequency.setTargetAtTime(baseFreq * 1.5, audioCtx.currentTime, 0.15);
          osc3.frequency.setTargetAtTime(baseFreq * 2.0, audioCtx.currentTime, 0.15);
        }
      }

      if (currentType === 'vortex') {
        const armCount = currentSensoryActive ? 6 : 4;
        const step = 2;
        const totalPoints = Math.floor(activeDensity * 12);

        for (let a = 0; a < armCount; a++) {
          ctx.beginPath();
          const armPhase = (a * Math.PI * 2) / armCount;

          for (let i = 10; i < totalPoints; i += step) {
            const r = Math.sqrt(i) * (maxRadius / Math.sqrt(totalPoints));
            let theta = Math.sqrt(i) * 0.45 + time + armPhase;

            const dx = Math.cos(theta) * r + centerX - mouseX;
            const dy = Math.sin(theta) * r + centerY - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const warpPower = (1 / (dist * 0.003 + 1)) * activeWarp * 0.35;
            theta += warpPower;

            const px = centerX + Math.cos(theta) * r;
            const py = centerY + Math.sin(theta) * r;

            if (i === 10) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          
          ctx.strokeStyle = a % 2 === 0 ? primaryColor : secondaryColor;
          ctx.shadowBlur = currentSensoryActive ? 8 : 4;
          ctx.shadowColor = glowColor;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

      } else if (currentType === 'moire') {
        const ringStep = Math.max(6, 120 - activeDensity);
        ctx.strokeStyle = primaryColor;
        
        for (let r = ringStep; r < maxRadius; r += ringStep) {
          ctx.beginPath();
          const breath = Math.sin(time + r * 0.005) * 4;
          ctx.arc(centerX, centerY, r + breath, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.strokeStyle = secondaryColor;
        for (let r = ringStep; r < maxRadius; r += ringStep) {
          ctx.beginPath();
          const warpOffsetSpeed = time * 0.5;
          const mx = mouseX + Math.sin(warpOffsetSpeed + r * 0.01) * activeWarp * 3;
          const my = mouseY + Math.cos(warpOffsetSpeed + r * 0.01) * activeWarp * 3;
          ctx.arc(mx, my, r, 0, Math.PI * 2);
          ctx.stroke();
        }

      } else if (currentType === 'fibonacci') {
        const goldenAngle = 137.5 * (Math.PI / 180);
        const dotCount = Math.floor(activeDensity * 7);

        for (let i = 0; i < dotCount; i++) {
          const r = Math.sqrt(i) * (maxRadius / Math.sqrt(dotCount));
          let theta = i * goldenAngle + time * 0.1;

          const dx = Math.cos(theta) * r + centerX - mouseX;
          const dy = Math.sin(theta) * r + centerY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (200 / (dist + 50)) * activeWarp;
          theta += force * 0.02;

          const px = centerX + Math.cos(theta) * r;
          const py = centerY + Math.sin(theta) * r;

          ctx.beginPath();
          ctx.arc(px, py, (currentSensoryActive ? 2.5 : 1.2) + (r * 0.004), 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
          ctx.fill();
        }

      } else if (currentType === 'grid') {
        const gridStep = Math.max(12, 80 - activeDensity * 0.8);
        
        ctx.strokeStyle = primaryColor;
        for (let y = gridStep; y < h; y += gridStep) {
          ctx.beginPath();
          for (let x = 0; x < w; x += 15) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const gravity = (250 / (dist + 50)) * activeWarp * 8;
            const wx = x - (dx / dist) * gravity;
            const wy = y - (dy / dist) * gravity;

            if (x === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
        }

        ctx.strokeStyle = secondaryColor;
        for (let x = gridStep; x < w; x += gridStep) {
          ctx.beginPath();
          for (let y = 0; y < h; y += 15) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const gravity = (250 / (dist + 50)) * activeWarp * 8;
            const wx = x - (dx / dist) * gravity;
            const wy = y - (dy / dist) * gravity;

            if (y === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
        }
      }
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Neural Connection lines inside AGI section
  useEffect(() => {
    const canvas = connectionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = canvas.parentElement?.clientWidth || 800;
    let h = canvas.height = canvas.parentElement?.clientHeight || 450;

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        w = canvas.width = canvas.parentElement.clientWidth;
        h = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const nodes: any[] = [];
    const count = window.innerWidth < 768 ? 15 : 35;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 0.8 + 0.4
      });
    }

    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, w, h);

      nodes.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 124, 255, 0.35)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 124, 255, 0.04)';
        ctx.fill();
      });

      // draw lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 25600) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - Math.sqrt(distSq) / 160)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Footer floating dots
  useEffect(() => {
    const canvas = footerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = canvas.parentElement?.clientWidth || 800;
    let h = canvas.height = canvas.parentElement?.clientHeight || 200;

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        w = canvas.width = canvas.parentElement.clientWidth;
        h = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const dots: any[] = [];
    for (let i = 0; i < 15; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: -Math.random() * 0.15 - 0.04,
        r: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.08 + 0.015
      });
    }

    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, w, h);

      dots.forEach(p => {
        p.y += p.vy;
        if (p.y < -3) {
          p.y = h + 3;
          p.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 124, 255, ${p.opacity})`;
        ctx.fill();
      });
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // IntersectionObserver for staggered animation entrances
  useEffect(() => {
    const animateElements = document.querySelectorAll('.se');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [contentVisible]);

  return (
    <div className="min-h-screen text-zinc-300 relative select-none font-sans" style={{ background: '#050505' }}>
      
      {/* Loader Overlay */}
      {loaderActive && (
        <div id="loader" className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-700">
          <div className="lp w-1.5 h-1.5 rounded-full bg-[#4f7cff] shadow-[0_0_15px_#4f7cff] animate-ping" />
          <div className="mt-6 text-2xl font-black uppercase tracking-[0.2em] bg-gradient-to-r from-sky-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            VAYU AGI
          </div>
          <div className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.5em] mt-3 animate-pulse">
            Synchronizing Neural Matrix...
          </div>
        </div>
      )}

      {/* Floating Blobs */}
      <div className="absolute top-[10%] left-[10%] w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-[45%] right-[5%] w-80 h-80 rounded-full bg-violet-500/5 blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[10%] left-[30%] w-72 h-72 rounded-full bg-cyan-500/4 blur-[90px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Background Star Particles */}
      <canvas ref={particleCanvasRef} className="fixed inset-0 pointer-events-none -z-10 opacity-60" />

      {/* Full-Screen Holographic Matrix Overlay */}
      {glassOverlayType === 'fullscreen' && (
        <div className="fixed inset-0 pointer-events-none z-10 backdrop-blur-[3px] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_2px,transparent_2px,transparent_10px)] mix-blend-screen transition-all duration-700" style={{ maskImage: 'radial-gradient(circle at 50% 50%, black 25%, transparent 75%)' }} />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-5 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 rounded-xl border border-white/5 bg-zinc-950/60 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-lg sm:text-xl tracking-wider bg-gradient-to-r from-sky-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              VAYU
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1.5">
            <a href="#features" className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">Features</a>
            <a href="#gallery" className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">Gallery</a>
            <a href="#capabilities" className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">Capabilities</a>
            <a href="#agi" className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">VAYU AGI</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                  {currentUser?.username || 'Authenticated'}
                </span>
                <button 
                  onClick={onSignOut}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-transparent transition-all"
                >
                  Sign Out
                </button>
                <button 
                  onClick={() => onEnterStudio(currentUser)}
                  className="px-4 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  Enter Studio
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleStartCreating}
                  disabled={isLoggingIn}
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleStartCreating}
                  disabled={isLoggingIn}
                  className="px-4 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  {isLoggingIn ? 'Syncing...' : 'Get Started'}
                </button>
              </>
            )}

            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="md:hidden flex flex-col gap-1 w-5 p-1"
            >
              <span className={`h-0.5 w-full bg-white rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`h-0.5 w-full bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-0.5 w-full bg-white rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-xl font-bold text-slate-300 hover:text-white transition-all">Features</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)} className="text-xl font-bold text-slate-300 hover:text-white transition-all">Gallery</a>
          <a href="#capabilities" onClick={() => setMenuOpen(false)} className="text-xl font-bold text-slate-300 hover:text-white transition-all">Capabilities</a>
          <a href="#agi" onClick={() => setMenuOpen(false)} className="text-xl font-bold text-slate-300 hover:text-white transition-all">VAYU AGI</a>
          <div className="w-full max-w-xs h-[1px] bg-white/10 my-2"></div>
          {isLoggedIn ? (
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-black text-emerald-400">Node: {currentUser?.username}</span>
              <button 
                onClick={() => { setMenuOpen(false); onEnterStudio(currentUser); }} 
                className="w-48 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-black shadow-xl"
              >
                Enter Studio
              </button>
              <button 
                onClick={() => { setMenuOpen(false); onSignOut(); }} 
                className="text-xs font-bold text-red-400 hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setMenuOpen(false); handleStartCreating(); }} 
              className="w-48 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-black shadow-xl"
            >
              Sign In with Puter
            </button>
          )}
        </div>
      )}

      {/* main content container */}
      <main className={`transition-all duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
          
          {/* Concentric Moiré Blur Glass Diffraction Lens */}
          {glassOverlayType === 'lens' && (
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] max-w-[480px] max-h-[480px] rounded-full border border-white/10 bg-white/5 backdrop-blur-[30px] pointer-events-none z-0 overflow-hidden shadow-[0_0_100px_rgba(79,124,255,0.18)] flex items-center justify-center transition-all duration-700">
              <div className="absolute inset-1 rounded-full border border-white/5 bg-[repeating-radial-gradient(circle,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_3px,transparent_3px,transparent_10px)] opacity-60 animate-[spin_45s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-white/5 bg-[repeating-radial-gradient(circle,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_2px,transparent_2px,transparent_8px)] opacity-40 animate-[spin_30s_linear_infinite_reverse]" />
              <div className="absolute inset-16 rounded-full border border-white/5 bg-[repeating-radial-gradient(circle,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_1px,transparent_1px,transparent_6px)] opacity-35 animate-[spin_15s_linear_infinite]" />
              <div className="absolute inset-28 rounded-full border border-white/5 bg-zinc-950/40 backdrop-blur-xl" />
            </div>
          )}

          {/* Glass Crystal Anchor */}
          <div ref={crystalContainerRef} className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] max-w-[420px] max-h-[420px] pointer-events-none z-10" />

          <div className="relative z-20 text-center max-w-4xl mx-auto flex flex-col items-center justify-center">
            
            {/* Powered Badge */}
            <div className="se up mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800/60 bg-zinc-900/40 text-[9px] sm:text-[10px] font-black text-slate-300 backdrop-blur-md tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                </span>
                Creative Intelligence Engine
              </span>
            </div>

            {/* Display Title */}
            <h1 className="se up d1 font-display text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 text-zinc-100">
              Create Beyond<br />
              <span className="inline-block bg-gradient-to-r from-sky-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-pulse" style={{ backgroundSize: '200% auto' }}>
                Imagination.
              </span>
            </h1>

            {/* Paragraph description */}
            <p className="se up d2 text-xs sm:text-sm md:text-base text-slate-400 font-light max-w-xl mx-auto mb-10 leading-relaxed tracking-wider px-4">
              The world's most advanced creative intelligence. Handshake seamlessly with Puter.js to generate cinema-grade videos, photorealistic imagery, and breathtaking designs instantly.
            </p>

            {/* CTA action buttons */}
            <div className="se up d3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 w-full max-w-md px-6">
              <button 
                onClick={handleStartCreating}
                disabled={isLoggingIn}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:shadow-[0_0_40px_rgba(56,189,248,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all"
              >
                {isLoggingIn ? 'Establishing Sync...' : isLoggedIn ? 'Launch Creative Studio' : 'Enter Studio Free'}
              </button>
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs sm:text-sm font-bold bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-compass text-xs text-sky-400"></i> Explore Features
              </a>
            </div>

            {/* Error handling message */}
            {authError && (
              <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-semibold animate-bounce">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i> {authError}
              </div>
            )}

            {/* Simulated Live prompt card */}
            <div className="se up d4 w-full max-w-xl px-4">
              <div className="rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 shimmer-bg opacity-10 pointer-events-none"></div>
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-zinc-950/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/40"></div>
                  <span className="text-[8px] text-zinc-500 ml-2 font-mono tracking-widest">vayu://neural-link</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[7px] text-emerald-400 font-mono">active</span>
                  </div>
                </div>

                <div className="px-5 py-4 min-h-[60px] flex items-start gap-3">
                  <i className="fa-solid fa-brain text-sky-400/50 mt-1 text-sm"></i>
                  <div className="text-left flex-1 min-w-0">
                    <span className="text-xs text-zinc-200 font-medium tracking-wide">
                      {promptText}
                    </span>
                    <span className="inline-block w-[1.5px] h-3.5 bg-sky-400 ml-0.5 animate-pulse" />
                    
                    {isProcessing && (
                      <div className="flex items-center gap-2 mt-2 text-[8px] text-sky-400/70 uppercase tracking-widest font-black">
                        <span className="flex gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '0s' }}></span>
                          <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.12s' }}></span>
                          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.24s' }}></span>
                        </span>
                        Refining Synthesis...
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulated images grid */}
                <div className={`px-4 pb-4 grid grid-cols-3 gap-2 transition-all duration-500 ${showPromptImages ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none h-0 p-0 overflow-hidden'}`}>
                  {promptSeeds[currentPromptIndex].map((seed, index) => (
                    <div key={seed} className="aspect-[4/3] rounded-lg overflow-hidden border border-white/5 shadow-inner">
                      <img 
                        src={`https://picsum.photos/seed/${seed}/280/180`} 
                        className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110" 
                        alt="Simulated synthesis output" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Scroll Indicator */}
          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 se up d5">
            <span className="text-[8px] uppercase tracking-[0.4em] text-slate-500 font-black">Scroll</span>
            <div className="w-3.5 h-6 rounded-full border border-zinc-800 flex items-start justify-center p-0.5 shadow-inner">
              <div className="w-0.5 h-1.5 rounded-full bg-sky-400 animate-bounce"></div>
            </div>
          </div>
        </section>

        {/* Drifting Memory Wall / Gallery Strip */}
        <section className="relative z-20 py-8 overflow-hidden border-t border-b border-white/5 bg-zinc-950/20">
          <div className="overflow-hidden mb-4" style={{ maskImage: 'linear-gradient(90deg,transparent,black 12%,black 88%,transparent)' }}>
            <div className="flex gap-3 w-max animate-[marquee_50s_linear_infinite]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-56 h-36 rounded-xl overflow-hidden opacity-30 hover:opacity-80 hover:scale-[1.03] hover:border-sky-400/30 border border-white/5 transition-all duration-500 flex-shrink-0 cursor-pointer">
                  <img src={`https://picsum.photos/seed/dr-strip-a-${i}/350/220`} className="w-full h-full object-cover" alt="Drifting manifestation preview" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(90deg,transparent,black 12%,black 88%,transparent)' }}>
            <div className="flex gap-3 w-max animate-[marquee_60s_linear_infinite_reverse]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-52 h-32 rounded-xl overflow-hidden opacity-25 hover:opacity-85 hover:scale-[1.03] hover:border-violet-400/30 border border-white/5 transition-all duration-500 flex-shrink-0 cursor-pointer">
                  <img src={`https://picsum.photos/seed/dr-strip-b-${i}/350/220`} className="w-full h-full object-cover" alt="Drifting manifestation preview" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-20 py-24 sm:py-32 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-sky-400 font-bold mb-3 block">Neural Architecture</span>
            <h2 className="se si font-display text-3xl sm:text-5xl font-black tracking-tighter leading-none mb-4 text-zinc-100">
              Intelligence That Creates.
            </h2>
            <p className="se si d1 text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed tracking-wider">
              Every feature is built with VAYU AGI at its core. Not an add-on, but a foundational creative intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Feature 1 */}
            <div className="se up d1 group p-6 sm:p-8 rounded-2xl border border-white/5 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/5 transition-all duration-500 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-sky-500/5 border border-sky-500/10 flex items-center justify-center text-sky-400 shadow-inner group-hover:bg-sky-500/10 transition-colors">
                <i className="fa-solid fa-image-portrait text-base"></i>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-zinc-100 mb-2">Photorealistic Studio</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Synthesize high-fidelity images indistinguishable from professional photography. Micro-textures, dynamic lighting, and flawless lens realism are rendered instantly.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="se up d2 group p-6 sm:p-8 rounded-2xl border border-white/5 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-violet-500/20 hover:shadow-2xl hover:shadow-violet-500/5 transition-all duration-500 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-violet-500/5 border border-violet-500/10 flex items-center justify-center text-violet-400 shadow-inner group-hover:bg-violet-500/10 transition-colors">
                <i className="fa-solid fa-film text-base"></i>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-zinc-100 mb-2">Cinematic Video Motion</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Go beyond static imagery. Choreograph stunning cinema-grade camera movements, complex fluid dynamics, and filmic composition blocks directly from simple natural prompts.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="se up d3 group p-6 sm:p-8 rounded-2xl border border-white/5 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-inner group-hover:bg-cyan-500/10 transition-colors">
                <i className="fa-solid fa-layer-group text-base"></i>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-zinc-100 mb-2">Multimodal Handwriting</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Feed text, existing assets, style seeds, or model configurations. VAYU synthesizes and crosses modalities with extreme precision to keep your brand assets consistent.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="se up d4 group p-6 sm:p-8 rounded-2xl border border-white/5 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/5 transition-all duration-500 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-sky-500/5 border border-sky-500/10 flex items-center justify-center text-sky-400 shadow-inner group-hover:bg-sky-500/10 transition-colors">
                <i className="fa-solid fa-sliders text-base"></i>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-zinc-100 mb-2">Style Transfer Matrix</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Apply complex artistic styles—from classical Renaissance paint to futuristic cyberpunk neon, anime watercolor, or strict product renders—to make every creation distinct.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="se up d5 group p-6 sm:p-8 rounded-2xl border border-white/5 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-violet-500/20 hover:shadow-2xl hover:shadow-violet-500/5 transition-all duration-500 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-violet-500/5 border border-violet-500/10 flex items-center justify-center text-violet-400 shadow-inner group-hover:bg-violet-500/10 transition-colors">
                <i className="fa-solid fa-cube text-base"></i>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-zinc-100 mb-2">3D Depth Modeling</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Inject spatial calculations. Vayu understands geometric bounds, volumetric lighting parameters, and object distances to construct cohesive worlds.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="se up d6 group p-6 sm:p-8 rounded-2xl border border-white/5 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-inner group-hover:bg-cyan-500/10 transition-colors">
                <i className="fa-solid fa-shield-halved text-base"></i>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-zinc-100 mb-2">Brand DNA Intelligence</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Upload your brand guides and design values. VAYU adapts to your internal design parameters to output high-fidelity corporate assets, slides, and packaging concepts.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Gallery Showcase */}
        <section id="gallery" className="relative z-20 py-24 sm:py-32 bg-zinc-950/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-[10px] uppercase tracking-[0.4em] text-violet-400 font-bold mb-3 block">High-Fidelity Archive</span>
              <h2 className="se bi font-display text-3xl sm:text-5xl font-black tracking-tighter leading-none mb-4 text-zinc-100">
                Generated in Seconds.
              </h2>
              <p className="se bi d1 text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed tracking-wider">
                Browse through masterfully synthesised assets generated on the Vayu platform. Absolute precision, straight from prompt.
              </p>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="se up break-inside-avoid group rounded-2xl overflow-hidden border border-white/5 bg-zinc-950 shadow-lg cursor-zoom-in relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/0 to-zinc-950/0 opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none z-10" />
                  <img 
                    src={`https://picsum.photos/seed/showcase-grid-vayu-${i}/500/${[600, 400, 680, 480, 640, 420, 560, 450][i]}`} 
                    className="w-full object-cover transition-transform duration-[6s] group-hover:scale-105" 
                    alt="Synthesis Showcase item" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                    <p className="text-[8px] font-black text-sky-400 uppercase tracking-widest mb-1">VAYU Alpha</p>
                    <p className="text-[10px] font-bold text-white truncate">Photo of a futuristic crystalline city</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities grid */}
        <section id="capabilities" className="relative z-20 py-24 sm:py-32 max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="se si font-display text-3xl sm:text-5xl font-black tracking-tighter leading-none mb-4 text-zinc-100">
              Infinite Capabilities.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm tracking-wider">Multimodal creation optimized for next-gen workflows.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: 'fa-image', label: 'Image Synthesis', color: 'text-sky-400' },
              { icon: 'fa-video', label: 'Cinema Generation', color: 'text-violet-400' },
              { icon: 'fa-feather', label: 'Creative Copywriting', color: 'text-cyan-400' },
              { icon: 'fa-cube', label: '3D World Assets', color: 'text-sky-400' },
              { icon: 'fa-bullhorn', label: 'Creative Advertising', color: 'text-violet-400' },
              { icon: 'fa-palette', label: 'Brand & Corporate ID', color: 'text-cyan-400' },
              { icon: 'fa-pencil', label: 'Vector Sketch Fusion', color: 'text-sky-400' },
              { icon: 'fa-crop', label: 'Auto-Inpainting', color: 'text-violet-400' },
              { icon: 'fa-music', label: 'Sound FX Synthesis', color: 'text-cyan-400' },
              { icon: 'fa-vr-cardboard', label: 'Spatial VR concepts', color: 'text-sky-400' },
              { icon: 'fa-camera', label: 'Cinematic Camera control', color: 'text-violet-400' },
              { icon: 'fa-share-nodes', label: 'Cloud Node distribution', color: 'text-cyan-400' }
            ].map((cap, i) => (
              <div key={i} className="se si p-4 sm:p-6 rounded-xl border border-white/5 bg-zinc-950/30 text-center hover:border-white/10 hover:bg-zinc-950/60 transition-all duration-300">
                <i className={`fa-solid ${cap.icon} ${cap.color} text-xl sm:text-2xl mb-3 block`}></i>
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide block uppercase">{cap.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Steps and workflow */}
        <section id="workflow" className="relative z-20 py-24 sm:py-32 bg-zinc-950/10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="se si font-display text-3xl sm:text-5xl font-black tracking-tighter leading-none mb-4 text-zinc-100">
                Four Steps. Infinite Creation.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm tracking-wider">Go from abstract vision to production-ready design elements.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { step: '01', title: 'Prompt Input', desc: 'Detail your abstract concept. Provide custom style guides or parameters.' },
                { step: '02', title: 'Render Drafts', desc: 'VAYU evaluates multiple models in parallel to synthesize optimal seeds.' },
                { step: '03', title: 'Iterative Refinement', desc: 'Upscale, inpaint, or adjust aspect ratios and styles till perfection.' },
                { step: '04', title: 'Deploy / Export', desc: 'Download lossless high-res file vectors or sync with third-party tools.' }
              ].map((wf, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-zinc-950/50 hover:border-sky-500/10 transition-all duration-300 text-center">
                  <div className="w-11 h-11 rounded-full bg-sky-500/5 border border-sky-500/10 flex items-center justify-center text-sky-400 font-display font-black text-sm mx-auto mb-4">
                    {wf.step}
                  </div>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-zinc-200 mb-2">{wf.title}</h3>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">{wf.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Powered by VAYU AGI connection network */}
        <section id="agi" className="relative z-20 py-28 sm:py-36 overflow-hidden bg-zinc-950/40">
          <canvas ref={connectionCanvasRef} className="absolute inset-0 pointer-events-none opacity-30" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
            <div className="se bi mb-5">
              <span className="inline-block px-3.5 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-[9px] sm:text-[10px] font-black text-sky-300 tracking-[0.2em] uppercase">
                Core Cognitive Framework
              </span>
            </div>
            
            <h2 className="se bi d1 font-display text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 text-zinc-100">
              Powered by<br />
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                VAYU AGI
              </span>
            </h2>

            <p className="se bi d2 text-slate-400 text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto mb-10 leading-relaxed tracking-wider">
              A general artificial intelligence architecture purpose-built for visual cognition. This is not a wrapper. It is a dedicated network designed to synthesize true aesthetic composition, lighting harmony, and high-fidelity motion.
            </p>

            <div className="se bi d3 flex flex-wrap justify-center gap-4 sm:gap-8 text-[10px] sm:text-xs font-black tracking-widest text-slate-400 uppercase">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"></span>
                10B+ Neural parameters
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#8b5cf6]"></span>
                Multimodal Fusion Matrix
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                Real-time synthesis latency
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By / Testimonials */}
        <section className="relative z-20 py-24 sm:py-32 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="se si font-display text-3xl sm:text-5xl font-black tracking-tighter leading-none mb-4 text-zinc-100">
              Trusted by Visionaries.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm tracking-wider">Hear what master digital creators have to say.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="se up d1 p-6 rounded-2xl border border-white/5 bg-zinc-950/30 flex flex-col justify-between hover:border-sky-500/15 transition-all">
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 italic">
                "VAYU doesn't just generate generic AI imagery. It has an intrinsic, structured understanding of artistic composition, depth, and texture that feels genuinely intelligent."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/sarahchen/100/100" className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10" alt="Sarah Chen profile" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-100">Sarah Chen</h4>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-black">Creative Director, Pentagram</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="se up d2 p-6 rounded-2xl border border-white/5 bg-zinc-950/30 flex flex-col justify-between hover:border-violet-500/15 transition-all">
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 italic">
                "The shift from static models to Vayu's cinematic movement engine is a complete generation leap. It has completely optimized our studio pre-visualization process."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/marcusrivera/100/100" className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10" alt="Marcus Rivera profile" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-100">Marcus Rivera</h4>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-black">Head of Design, Spotify</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="se up d3 p-6 rounded-2xl border border-white/5 bg-zinc-950/30 flex flex-col justify-between hover:border-cyan-500/15 transition-all">
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 italic">
                "Volumetric lighting, lens science, focal lengths — VAYU thinks like a cinematographer. An absolute powerhouse of creative freedom."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/yukitanaka/100/100" className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10" alt="Yuki Tanaka profile" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-100">Yuki Tanaka</h4>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-black">Independent Film Director</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Final Call to Action */}
        <section className="relative z-20 py-28 sm:py-36 px-4 text-center border-t border-white/5 bg-gradient-to-b from-zinc-950/0 to-zinc-950/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="se bi font-display text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 text-zinc-100">
              The Future of<br />
              Creation is <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Here.</span>
            </h2>
            <p className="se bi d1 text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-10 leading-relaxed tracking-wider font-light">
              Connect with Puter.js in a single safe click. Unleash your absolute creative node immediately.
            </p>

            <button 
              onClick={handleStartCreating}
              disabled={isLoggingIn}
              className="px-10 py-5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-[0.3em] bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white shadow-2xl hover:brightness-110 hover:shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-all"
            >
              {isLoggingIn ? 'Syncing...' : isLoggedIn ? 'Open Creative Studio' : 'Start Creating Free'}
            </button>
            <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mt-4 block">No credentials or cards required • 100 free cycles</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-20 border-t border-white/5 bg-zinc-950/80 overflow-hidden">
          <canvas ref={footerCanvasRef} className="absolute inset-0 pointer-events-none opacity-20" />
          
          <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <span className="font-display font-black text-lg tracking-wider bg-gradient-to-r from-sky-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  VAYU
                </span>
                <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
                  The world's most advanced cloud-native creative studio. Empowering studios and developers.
                </p>
              </div>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">Product</h4>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                  <li><a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">Legal</h4>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Security Portal</span></li>
                </ul>
              </div>
            </div>

            <div className="h-[1px] bg-white/5 my-6"></div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">&copy; 2026 VAYU Creative Studio. Rudratech Inc.</span>
            </div>
          </div>
        </footer>

      </main>



      {/* Embedded landing styles */}
      <style>{`
        .lp {
          animation: lpA 2.5s ease forwards;
        }
        @keyframes lpA {
          0% { transform: scale(0); opacity: 0; }
          20% { transform: scale(1); opacity: 1; }
          50% { transform: scale(40); opacity: 0.3; }
          100% { transform: scale(120); opacity: 0; }
        }
        
        .shimmer-bg {
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.04) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 5s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .se {
          opacity: 0;
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1), filter 1s ease;
          will-change: opacity, transform, filter;
        }
        .se.up {
          transform: translateY(30px);
          filter: blur(8px);
        }
        .se.si {
          transform: scale(0.96);
          filter: blur(4px);
        }
        .se.bi {
          filter: blur(12px);
        }
        .se.vis {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        .d1 { transition-delay: 0.1s; }
        .d2 { transition-delay: 0.2s; }
        .d3 { transition-delay: 0.3s; }
        .d4 { transition-delay: 0.4s; }
        .d5 { transition-delay: 0.5s; }
        .d6 { transition-delay: 0.6s; }

        @keyframes soundwave-1 {
          0%, 100% { height: 6px; }
          50% { height: 16px; }
        }
        @keyframes soundwave-2 {
          0%, 100% { height: 8px; }
          50% { height: 22px; }
        }
        @keyframes soundwave-3 {
          0%, 100% { height: 5px; }
          50% { height: 14px; }
        }
        .soundwave-bar-1 {
          animation: soundwave-1 0.8s ease-in-out infinite;
        }
        .soundwave-bar-2 {
          animation: soundwave-2 0.7s ease-in-out infinite;
        }
        .soundwave-bar-3 {
          animation: soundwave-3 0.9s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export default IntroPage;
