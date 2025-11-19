"use client";

import { useEffect, useRef, useState } from "react";
import { MONSTERS, type Monster } from "@/data/monsters";

declare global {
  interface Window {
    THREE: any;
    ThreeGlobe: any;
  }
}

export default function GlobeViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const globeRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkLibraries = setInterval(() => {
      if (window.THREE && window.ThreeGlobe) {
        clearInterval(checkLibraries);
        setIsLoaded(true);
      }
    }, 100);

    return () => clearInterval(checkLibraries);
  }, []);

  useEffect(() => {
    if (!isLoaded || !mountRef.current) return;

    const THREE = window.THREE;
    const ThreeGlobe = window.ThreeGlobe;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;
    camera.position.y = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const globe = new ThreeGlobe()
      .globeImageUrl("https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg")
      .bumpImageUrl("https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png")
      .atmosphereColor("#d4af37")
      .atmosphereAltitude(0.2);

    globeRef.current = globe;

    const pointsData = MONSTERS.map((monster) => ({
      ...monster,
      lat: monster.latitude,
      lng: monster.longitude,
      size: 1.5,
      color: "#d4af37",
      altitude: 0.02,
    }));

    globe
      .pointsData(pointsData)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor("color")
      .pointAltitude("altitude")
      .pointRadius("size");

    globe
      .ringsData(pointsData)
      .ringLat("lat")
      .ringLng("lng")
      .ringColor(() => "#0ea5e9")
      .ringMaxRadius(3)
      .ringPropagationSpeed(2)
      .ringRepeatPeriod(2000);

    scene.add(globe);

    // Debug: Check globe transformation
    console.log('Globe position:', globe.position);
    console.log('Globe rotation:', globe.rotation);
    console.log('Globe scale:', globe.scale);

    // Create invisible clickable spheres for each monster location
    // These spheres make the entire dot area clickable, not just the center
    // Add them as children of the globe so they rotate with it automatically
    const clickableSpheres: any[] = [];
    const sphereGeometry = new THREE.SphereGeometry(15, 16, 16); // Reduced radius for more precise clicking
    const sphereMaterial = new THREE.MeshBasicMaterial({
      visible: false, // Invisible but still clickable
      transparent: true,
      opacity: 0
    });

    MONSTERS.forEach((monster) => {
      // Try to match ThreeGlobe's internal coordinate system
      // ThreeGlobe might use different conventions for lat/lng to 3D conversion
      const lat = monster.latitude;
      const lng = monster.longitude;

      // Try different coordinate conversions to match ThreeGlobe
      // Method 1: Standard spherical coordinates
      const latRad = (lat * Math.PI) / 180;
      const lngRad = (lng * Math.PI) / 180;

      // ThreeGlobe might use different axis orientation
      // Let's try flipping some signs to match
      const globeRadius = 100;
      const altitude = 0.02;
      const radius = globeRadius + (altitude * globeRadius);

      // Try standard with axes swapped: x = r * cos(lat) * sin(lng)
      //                                   y = r * sin(lat)
      //                                   z = r * cos(lat) * cos(lng)
      const x = radius * Math.cos(latRad) * Math.sin(lngRad);
      const y = radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.cos(lngRad);

      // Create clickable sphere at this location
      const clickableSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      clickableSphere.position.set(x, y, z);
      clickableSphere.userData = { monster };
      clickableSphere.name = `clickable-${monster.id}`;

      // Debug Bunyip position - test multiple coordinate systems
      if (monster.id === 'bunyip') {
        console.log('=== BUNYIP POSITION DEBUG ===');
        console.log('Input lat/lng:', monster.latitude, monster.longitude);

        // Test different coordinate systems
        const systems = [
          {
            name: 'Current',
            x: radius * Math.cos(latRad) * Math.sin(lngRad),
            y: radius * Math.sin(latRad),
            z: radius * Math.cos(latRad) * Math.cos(lngRad)
          },
          {
            name: 'Standard XYZ',
            x: radius * Math.cos(latRad) * Math.cos(lngRad),
            y: radius * Math.sin(latRad),
            z: radius * Math.cos(latRad) * Math.sin(lngRad)
          },
          {
            name: 'Y-up system',
            x: radius * Math.sin(latRad) * Math.cos(lngRad),
            y: radius * Math.cos(latRad),
            z: radius * Math.sin(latRad) * Math.sin(lngRad)
          }
        ];

        systems.forEach(system => {
          console.log(`${system.name}: x=${system.x.toFixed(2)}, y=${system.y.toFixed(2)}, z=${system.z.toFixed(2)}`);
        });

        console.log('Using current system:', { x: x.toFixed(2), y: y.toFixed(2), z: z.toFixed(2) });
      }

      // Add as child of globe
      globe.add(clickableSphere);
      clickableSpheres.push(clickableSphere);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 0.4);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3));

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    let isDragging = false;
    let didDrag = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        rotationVelocity.x = deltaY * 0.005;
        rotationVelocity.y = deltaX * 0.005;

        globe.rotation.y += rotationVelocity.y;
        globe.rotation.x += rotationVelocity.x;

        previousMousePosition = { x: e.clientX, y: e.clientY };

        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          didDrag = true;
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      if (didDrag) {
        didDrag = false;
        return;
      }

      isDragging = false;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // Update scene matrices before calculations
      scene.updateMatrixWorld(true);

      // Use raycaster to check intersections with clickable spheres
      // This detects clicks on the invisible spheres around monster locations
      const intersects = raycaster.intersectObjects(clickableSpheres, false);

      let clickedMonster: Monster | null = null;

      if (intersects.length > 0) {
        // Use the first (closest) intersection
        const closestIntersect = intersects[0];
        clickedMonster = closestIntersect.object.userData?.monster as Monster;

        // Debug logging
        console.log('Clicked monster:', clickedMonster?.name, 'at location:', clickedMonster?.latitude, clickedMonster?.longitude);
      }

      if (clickedMonster) {
        setSelectedMonster(clickedMonster);
      } else {
        setSelectedMonster(null);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.1;
      camera.position.z = Math.max(150, Math.min(500, camera.position.z));
    };

    renderer.domElement.addEventListener("wheel", onWheel);
    renderer.domElement.addEventListener("click", onClick);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isDragging) {
        globe.rotation.y += 0.001;
        rotationVelocity.x *= 0.95;
        rotationVelocity.y *= 0.95;
        globe.rotation.x += rotationVelocity.x;
        globe.rotation.y += rotationVelocity.y;
      }

      // Spheres are now children of globe, so they rotate automatically

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("click", onClick);

      // Clean up clickable spheres
      clickableSpheres.forEach((sphere: any) => {
        globe.remove(sphere);
        sphere.geometry.dispose();
        sphere.material.dispose();
      });
      clickableSpheres.length = 0;

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, [isLoaded]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(14, 165, 233, 0.1) 30%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "40px 30px",
          background: "linear-gradient(180deg, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0) 100%)",
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "56px",
            fontWeight: 900,
            color: "#d4af37",
            margin: 0,
            letterSpacing: "8px",
            textShadow: "0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4)",
            textTransform: "uppercase",
          }}
        >
          Monster Hunt
        </h1>
        <div
          style={{
            height: "2px",
            width: "300px",
            background: "linear-gradient(90deg, transparent 0%, #d4af37 50%, transparent 100%)",
            margin: "15px auto",
          }}
        />
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "14px",
            color: "#0ea5e9",
            margin: "12px 0 0 0",
            letterSpacing: "4px",
            textShadow: "0 0 20px rgba(14, 165, 233, 0.6)",
          }}
        >
          A World Tour of Legendary Beasts
        </p>
      </div>

      {selectedMonster && (
        <>
          <div
            onClick={() => setSelectedMonster(null)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(6px)",
              zIndex: 999,
              animation: "fadeIn 0.3s ease-out",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(15, 23, 42, 0.95)",
              padding: "40px",
              borderRadius: "8px",
              border: "2px solid #d4af37",
              boxShadow:
                "0 0 60px rgba(212, 175, 55, 0.4), 0 20px 80px rgba(0, 0, 0, 0.9), inset 0 0 40px rgba(0, 0, 0, 0.6)",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              animation: "popupAppear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                width: "30px",
                height: "30px",
                borderTop: "3px solid #d4af37",
                borderLeft: "3px solid #d4af37",
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "30px",
                height: "30px",
                borderTop: "3px solid #d4af37",
                borderRight: "3px solid #d4af37",
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                width: "30px",
                height: "30px",
                borderBottom: "3px solid #d4af37",
                borderLeft: "3px solid #d4af37",
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "30px",
                height: "30px",
                borderBottom: "3px solid #d4af37",
                borderRight: "3px solid #d4af37",
                opacity: 0.6,
              }}
            />

            <button
              onClick={() => setSelectedMonster(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid #d4af37",
                color: "#d4af37",
                width: "36px",
                height: "36px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "20px",
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
                padding: 0,
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212, 175, 55, 0.3)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(212, 175, 55, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              ×
            </button>

            <div
              style={{
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "12px",
                  color: "#0ea5e9",
                  letterSpacing: "3px",
                  marginBottom: "5px",
                  textTransform: "uppercase",
                }}
              >
                Mission
              </div>
              <div
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: "32px",
                  color: "#d4af37",
                  fontWeight: 700,
                  textShadow: "0 0 20px rgba(212, 175, 55, 0.6)",
                  letterSpacing: "2px",
                }}
              >
                {String(selectedMonster.order).padStart(2, "0")} / 12
              </div>
            </div>

            <div
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent 0%, #d4af37 50%, transparent 100%)",
                marginBottom: "30px",
              }}
            />

            <div
              style={{
                width: "100%",
                height: "280px",
                borderRadius: "4px",
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                marginBottom: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={selectedMonster.image}
                alt={selectedMonster.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextSibling) {
                    (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                  }
                }}
              />
              <div
                style={{
                  display: "none",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "100px",
                  opacity: 0.3,
                }}
              >
                🗺️
              </div>
            </div>

            <h2
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "36px",
                fontWeight: 900,
                color: "#d4af37",
                margin: "0 0 15px 0",
                textShadow: "0 0 30px rgba(212, 175, 55, 0.5)",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              {selectedMonster.name}
            </h2>

            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "16px",
                color: "#0ea5e9",
                margin: "0 0 30px 0",
                letterSpacing: "2px",
                textAlign: "center",
                textShadow: "0 0 10px rgba(14, 165, 233, 0.4)",
              }}
            >
              {selectedMonster.country} • {selectedMonster.continent}
            </p>

            <div
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.5) 50%, transparent 100%)",
                marginBottom: "30px",
              }}
            />

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                padding: "25px",
                borderRadius: "4px",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                marginBottom: "30px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  color: "#e5e7eb",
                  lineHeight: "1.8",
                  margin: 0,
                  letterSpacing: "0.5px",
                }}
              >
                {selectedMonster.shortDescription}
              </p>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes popupAppear {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

