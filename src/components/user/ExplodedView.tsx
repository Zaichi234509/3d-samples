import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MODELS, type ExplodedModel, type ModelPart } from "../../data/exploded";

function Part({ part, explode, hovered, onHover }: {
  part: ModelPart;
  explode: number;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const mesh = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    const target = part.y + part.dy * explode;
    mesh.current.position.y += (target - mesh.current.position.y) * Math.min(1, dt * 7);
  });

  const args: [number, number, number] = [part.size[0], part.size[1] ?? 1, part.size[2] ?? 1];
  const geometry = useMemo(() => {
    switch (part.shape) {
      case "cylinder":
        return <cylinderGeometry args={[args[0], args[1], args[2], 48]} />;
      case "cone":
        return <coneGeometry args={[args[0], args[2], 48]} />;
      case "box":
        return <boxGeometry args={[args[0], args[1], args[2]]} />;
      case "sphere":
        return <sphereGeometry args={[args[0], 32, 24]} />;
      case "torus":
        return <torusGeometry args={[args[0], part.size[1] ?? 0.05, 20, 64]} />;
      case "disc":
        return <cylinderGeometry args={[args[0], part.size[1] ?? args[0], part.size[2] ?? 0.02, 48]} />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part.shape, part.size.join(",")]);

  return (
    <group ref={mesh} position={[0, part.y, 0]}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHover(part.id); }}
        onPointerOut={() => onHover(null)}
      >
        {geometry}
        <meshStandardMaterial
          color={part.color}
          transparent={part.transparent || hovered}
          opacity={hovered ? 0.92 : (part.opacity ?? 1)}
          metalness={part.metalness ?? 0.08}
          roughness={part.roughness ?? 0.62}
          emissive={hovered ? new THREE.Color(part.color) : new THREE.Color("#000000")}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>
    </group>
  );
}

function Scene({ model, explode, hovered, onHover }: {
  model: ExplodedModel;
  explode: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.12;
    // gentle float
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
  });

  return (
    <>
      <color attach="background" args={["#17090c"]} />
      <fog attach="fog" args={["#17090c", 6, 12]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 4]} intensity={1.25} color="#ffe9c9" />
      <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#c9a06a" />
      <pointLight position={[0, -2, 3]} intensity={0.6} color="#6b1e2e" />
      <group ref={group} position={[0, -0.15, 0]}>
        {model.parts.map((p) => (
          <Part key={p.id} part={p} explode={explode} hovered={hovered === p.id} onHover={onHover} />
        ))}
      </group>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={2.6}
        maxDistance={7}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 1.6}
      />
    </>
  );
}

export default function ExplodedView() {
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [explode, setExplode] = useState(0.62);
  const [hovered, setHovered] = useState<string | null>(null);
  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];

  return (
    <div>
      <div className="model-tabs" role="tablist" aria-label="Choose item to explode">
        {MODELS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={m.id === modelId}
            className={"model-tab" + (m.id === modelId ? " active" : "")}
            onClick={() => { setModelId(m.id); setHovered(null); }}
          >
            {m.emoji} {m.name}
          </button>
        ))}
      </div>

      <div className="studio-layout">
        <div>
          <div className="canvas-wrap">
            <Canvas camera={{ position: [2.6, 1.6, 3.4], fov: 42 }} dpr={[1, 2]}>
              <Scene model={model} explode={explode} hovered={hovered} onHover={setHovered} />
            </Canvas>
          </div>
          <div className="explode-control">
            <label htmlFor="explode-range">Explode view</label>
            <input
              id="explode-range"
              type="range"
              min={0}
              max={100}
              value={Math.round(explode * 100)}
              onChange={(e) => setExplode(Number(e.target.value) / 100)}
              aria-label="Explode amount"
            />
            <button className="btn btn-gold btn-sm" onClick={() => setExplode(explode > 0.2 ? 0 : 1)}>
              {explode > 0.2 ? "Assemble" : "Explode"}
            </button>
          </div>
          <p style={{ color: "rgba(250,244,234,0.55)", fontSize: "0.88rem", marginTop: "0.9rem" }}>
            {model.caption} · Drag to orbit · Scroll to zoom · Hover a part to highlight it.
          </p>
        </div>

        <div className="parts-legend" aria-label="Parts list">
          {model.parts.map((p, i) => (
            <div
              key={p.id}
              className="part-row"
              style={{
                borderColor: hovered === p.id ? "rgba(201,160,106,0.8)" : undefined,
                background: hovered === p.id ? "rgba(201,160,106,0.14)" : undefined,
              }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="swatch" style={{ background: p.color }} />
              <div>
                <b>{i + 1}. {p.label}</b>
                <span>{p.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
