import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader.js";
import WorkflowHeader from "./WorkflowHeader";
import WorkflowSidebarHeader from "./WorkflowSidebarHeader";
import LoadingIndicator from "./LoadingIndicator";
import { WORKFLOW_SIDEBAR_WIDTH_CLASS } from "../workflowLayout";
import {
  createGeneratedProject,
  MODEL_GENERATION_REQUEST_KEY,
  PROJECT_STORAGE_KEY,
} from "../workflowState";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Camera,
  Check,
  CircleHelp,
  Crosshair,
  Eye,
  Gauge,
  Grid3X3,
  Layers3,
  Maximize2,
  MousePointer2,
  RefreshCw,
  Settings,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";

export type ModelingStep = "generate" | "remesh" | "texture";

type OrcPbrTextureSet = {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  metalnessMap: THREE.Texture;
};

const STEPS: Array<{
  id: ModelingStep;
  title: string;
}> = [
  { id: "generate", title: "3D 생성" },
  { id: "remesh", title: "리메시" },
  { id: "texture", title: "텍스처 최적화" },
];

export const getModelingPreviousTarget = (activeStep: ModelingStep): ModelingStep | "turnaround" => {
  const activeIndex = STEPS.findIndex((step) => step.id === activeStep);
  return activeIndex > 0 ? STEPS[activeIndex - 1].id : "turnaround";
};

const SOURCE_IMAGES = [
  "/images/orc/orc_2D_front.png",
  "/images/orc/orc_2D_45.png",
  "/images/orc/orc_2D_side.png",
  "/images/orc/orc_2D_back.png",
  "/images/orc/orc_default_item01.png",
];

type ModuleCategory = {
  id: string;
  label: string;
  itemNumber: string;
  image: string;
};

type ModuleSetInfo = {
  id: string;
  title: string;
};

export const MODULES: ModuleCategory[] = [
  { id: "weapon", label: "무기", itemNumber: "01", image: "/images/orc/orc_default_item03.png" },
  { id: "shoulder", label: "어깨 갑옷", itemNumber: "02", image: "/images/orc/orc_default_item04.png" },
  { id: "leg", label: "다리 보호대", itemNumber: "03", image: "/images/orc/orc_default_item02.png" },
  { id: "belt", label: "벨트 장식", itemNumber: "04", image: "/images/orc/orc_default_item05.png" },
  { id: "arm", label: "팔 보호대", itemNumber: "05", image: "/images/orc/orc_default_item01.png" },
];

const MODULE_SETS: ModuleSetInfo[] = [
  { id: "01", title: "해골 전사 세트" },
  { id: "02", title: "중갑 전투 세트" },
  { id: "03", title: "습격 전투 세트" },
  { id: "04", title: "부족 정찰 세트" },
];

const MODULE_PREVIEW_LABELS = ["정면", "45도", "측면", "후면"];
export const VIEWPORT_MODES = ["PBR", "Textured", "Clay", "Wireframe"];

const getModuleSetItemImage = (setId: string, itemNumber: string) =>
  `/images/orc_3D/orc_${setId}_3d${itemNumber}.png`;

const getModuleSetPreviewImage = (setId: string, viewIndex: number) =>
  `/images/orc_3DF/orc_${setId}_3dF${String(viewIndex + 1).padStart(2, "0")}.png`;


const TEXTURE_MAPS = [
  { id: "body-base", label: "Body BaseColor", color: "#6E8B47", file: "orc_orc_body_BaseColor.1001.tga" },
  { id: "body-normal", label: "Body Normal", color: "#4358B8", file: "orc_body_Normal.1001.tga" },
  { id: "body-rough", label: "Body Roughness", color: "#8E8E8E", file: "orc_body_Roughness.1001.tga" },
  { id: "gear-base", label: "Gear BaseColor", color: "#A8752B", file: "orc_02 - Default_BaseColor.1001.tga" },
  { id: "gear-metal", label: "Gear Metallic", color: "#D8D8D8", file: "orc_02 - Default_Metallic.1001.tga" },
];

const ORC_MODEL_FILE = "orc_20260603.fbx";
const ORC_MODEL_PATH = `/models/orc/${ORC_MODEL_FILE}`;
const ORC_ASSET_VERSION = "orc-model-20260603";
const versionedAsset = (path: string) => `${path}${path.includes("?") ? "&" : "?"}v=${ORC_ASSET_VERSION}`;

function ViewportTools({
  activeTool,
  onToolSelect,
  gridEnabled,
}: {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  gridEnabled: boolean;
}) {
  const tools = [
    ["선택", Crosshair],
    ["회전", RefreshCw],
    ["이동", MousePointer2],
    ["확대", Maximize2],
    ["카메라", Camera],
    ["그리드", Grid3X3],
    ["설정", Settings],
  ];

  return (
    <div className="absolute left-4 top-20 z-20 flex w-[58px] flex-col overflow-hidden rounded-xl border border-[#1F2329] bg-[#080A0D]/90 shadow-2xl backdrop-blur">
      {tools.map(([label, Icon], idx) => (
        <button
          key={label as string}
          onClick={() => onToolSelect(label as string)}
          className={`flex h-[58px] flex-col items-center justify-center gap-1 border-b border-[#1F2329] text-[14px] transition-colors last:border-b-0 ${
            activeTool === label || (label === "그리드" && gridEnabled)
              ? "bg-[#E0A12E]/10 text-[#E0A12E]"
              : "text-neutral-400 hover:bg-[#141518] hover:text-white"
          }`}
          title={label as string}
        >
          <Icon className="h-4 w-4" />
          <span className="max-w-[48px] truncate">{label as string}</span>
        </button>
      ))}
    </div>
  );
}

function addFallbackOrc(scene: THREE.Scene, material: THREE.MeshStandardMaterial) {
  const model = new THREE.Group();
  model.name = "fallback-orc";

  const armor = new THREE.MeshStandardMaterial({ color: 0x2c2a24, roughness: 0.65, metalness: 0.4 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd99b38, roughness: 0.4, metalness: 0.35 });

  const addMesh = (
    mesh: THREE.Mesh,
    position: [number, number, number],
    scale: [number, number, number],
    rotation?: [number, number, number]
  ) => {
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    if (rotation) mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    model.add(mesh);
  };

  addMesh(new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 1.25, 8, 18), material), [0, 1.62, 0], [1, 1.05, 0.78]);
  addMesh(new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), material), [0, 2.78, 0.02], [1.12, 0.9, 1]);
  addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.68, 0.62, 6), armor), [0, 2.08, 0.02], [1.55, 0.7, 0.82]);
  addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.52, 0.7, 7), armor), [0, 1.1, 0.02], [1.1, 0.9, 0.86]);

  for (const side of [-1, 1]) {
    addMesh(new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.5, 4), armor), [side * 0.9, 2.2, 0], [1.2, 0.8, 1], [0, 0, side * 0.55]);
    addMesh(new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.9, 6, 12), material), [side * 0.92, 1.45, 0.05], [1, 1, 1], [0, 0, side * 0.32]);
    addMesh(new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.15, 6, 12), armor), [side * 0.38, 0.32, 0.02], [0.9, 1, 0.9], [0.02, 0, side * 0.08]);
  }

  [[-0.56, 2.5, 0.1], [0.56, 2.5, 0.1], [-0.24, 1.98, 0.52], [0.24, 1.98, 0.52]].forEach((pos, idx) => {
    addMesh(new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.36, 8), gold), pos as [number, number, number], [1, 1, 1], [
      Math.PI / 2.5,
      idx % 2 ? 0.25 : -0.25,
      0,
    ]);
  });

  scene.add(model);
  return model;
}

function ThreeModelPreview({
  activeStep,
  viewMode,
  activeTool,
  cameraResetKey,
  gridEnabled,
}: {
  activeStep: ModelingStep;
  viewMode: string;
  activeTool: string;
  cameraResetKey: number;
  gridEnabled: boolean;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeToolRef = useRef(activeTool);
  const cameraResetKeyRef = useRef(cameraResetKey);
  const gridEnabledRef = useRef(gridEnabled);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "textured" | "fallback">("loading");

  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    cameraResetKeyRef.current = cameraResetKey;
  }, [cameraResetKey]);

  useEffect(() => {
    gridEnabledRef.current = gridEnabled;
  }, [gridEnabled]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    setLoadState("loading");

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 9, 22);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(3.7, 2.2, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = activeStep === "texture" ? 0.92 : 0.88;
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environmentMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environmentMap;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.2;
    controls.maxDistance = 9;
    controls.target.set(0, 1, 0);

    const grid = new THREE.GridHelper(5.2, 20, 0x394150, 0x232833);
    grid.position.y = -0.45;
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.22;
    grid.visible = gridEnabledRef.current;
    scene.add(grid);

    const pbrMode = viewMode === "PBR" || activeStep === "texture";
    const detailedPbrMaps = false;
    const texturedMode = pbrMode || viewMode === "Textured";
    const clay = viewMode === "Clay" || activeStep === "remesh";
    const wire = viewMode === "Wireframe";
    const fallbackMat = new THREE.MeshStandardMaterial({
      color: clay ? 0x777777 : 0x64834a,
      roughness: activeStep === "texture" ? 0.48 : 0.74,
      metalness: 0.04,
      wireframe: wire,
    });
    const fallback = addFallbackOrc(scene, fallbackMat);
    fallback.visible = false;

    const manager = new THREE.LoadingManager();
    const textureLoader = new TGALoader(manager);
    manager.addHandler(/\.tga$/i, textureLoader);
    manager.setURLModifier((url) => {
      const decodedUrl = decodeURIComponent(url);
      const normalized = decodedUrl.replace(/\\/g, "/");
      const fileName = normalized.split("/").pop()?.toLowerCase() ?? "";

      if (fileName === "오크몸.tga") {
        return versionedAsset("/models/orc/orc_texture/orc_orc_body_BaseColor.1001.tga");
      }

      if (fileName === "오크장비.tga") {
        return versionedAsset("/models/orc/orc_texture/orc_02 - Default_BaseColor.1001.tga");
      }

      if (normalized.includes("/models/orc/")) {
        return versionedAsset(url);
      }

      return url;
    });
    const loadedTextures: THREE.Texture[] = [];
    const loadTga = (path: string, colorSpace: THREE.ColorSpace = THREE.NoColorSpace) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          encodeURI(versionedAsset(path)),
          (texture) => {
            texture.colorSpace = colorSpace;
            texture.flipY = false;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.needsUpdate = true;
            loadedTextures.push(texture);
            resolve(texture);
          },
          undefined,
          reject
        );
      });

    const textureSetPromise = Promise.all([
        loadTga("/models/orc/orc_texture/orc_orc_body_BaseColor.1001.tga", THREE.SRGBColorSpace),
        loadTga("/models/orc/orc_texture/orc_body_Normal.1001.tga"),
        loadTga("/models/orc/orc_texture/orc_body_Roughness.1001.tga"),
        loadTga("/models/orc/orc_texture/orc_body_Metallic.1001.tga"),
        loadTga("/models/orc/orc_texture/orc_02 - Default_BaseColor.1001.tga", THREE.SRGBColorSpace),
        loadTga("/models/orc/orc_texture/orc_02 - Default_Normal.1001.tga"),
        loadTga("/models/orc/orc_texture/orc_02 - Default_Roughness.1001.tga"),
        loadTga("/models/orc/orc_texture/orc_02 - Default_Metallic.1001.tga"),
    ])
      .then(([bodyMap, bodyNormalMap, bodyRoughnessMap, bodyMetalnessMap, gearMap, gearNormalMap, gearRoughnessMap, gearMetalnessMap]) => ({
        body: { map: bodyMap, normalMap: bodyNormalMap, roughnessMap: bodyRoughnessMap, metalnessMap: bodyMetalnessMap },
        gear: { map: gearMap, normalMap: gearNormalMap, roughnessMap: gearRoughnessMap, metalnessMap: gearMetalnessMap },
      }))
      .catch(() => null);

    const syncTextureTransform = (
      reference: THREE.Texture | null | undefined,
      targets: Array<THREE.Texture | null | undefined>
    ) => {
      if (!reference) return;
      targets.forEach((target) => {
        if (!target) return;
        target.offset.copy(reference.offset);
        target.repeat.copy(reference.repeat);
        target.center.copy(reference.center);
        target.rotation = reference.rotation;
        target.flipY = reference.flipY;
        target.wrapS = reference.wrapS;
        target.wrapT = reference.wrapT;
        target.needsUpdate = true;
      });
    };

    const prepareTexture = (texture: THREE.Texture | null | undefined, maxAnisotropy: number) => {
      if (!texture) return;
      texture.anisotropy = Math.min(8, maxAnisotropy);
      texture.needsUpdate = true;
    };

    const withPbrMaps = (
      maps: OrcPbrTextureSet | undefined,
      sourceMap: THREE.Texture | null,
      maxAnisotropy: number,
    ) => {
      const baseMap = clay || !texturedMode ? null : sourceMap ?? maps?.map ?? null;
      const pbrMaps = detailedPbrMaps && !clay && !wire && maps ? maps : undefined;

      syncTextureTransform(baseMap ?? maps?.map, [
        maps?.normalMap,
        maps?.roughnessMap,
        maps?.metalnessMap,
      ]);

      [baseMap, pbrMaps?.normalMap, pbrMaps?.roughnessMap, pbrMaps?.metalnessMap].forEach((texture) =>
        prepareTexture(texture, maxAnisotropy)
      );

      return {
        baseMap,
        normalMap: null,
        roughnessMap: pbrMaps?.roughnessMap ?? null,
        metalnessMap: pbrMaps?.metalnessMap ?? null,
      };
    };

    const cloneTextureTransform = (reference: THREE.Texture | null | undefined, target: THREE.Texture | null | undefined) => {
      if (!reference || !target) return;
      target.offset.copy(reference.offset);
      target.repeat.copy(reference.repeat);
      target.center.copy(reference.center);
      target.rotation = reference.rotation;
      target.flipY = reference.flipY;
      target.wrapS = reference.wrapS;
      target.wrapT = reference.wrapT;
      target.needsUpdate = true;
    };

    const createTexturedMaterial = (
      source: THREE.Material | undefined,
      meshName: string,
      textureSet: Awaited<typeof textureSetPromise>
    ) => {
      const sourceName = `${meshName} ${source?.name ?? ""}`.toLowerCase();
      const looksLikeBody =
        sourceName.includes("01 - default") ||
        sourceName.includes("orc_body") ||
        sourceName.includes("body") ||
        sourceName.includes("오크_06-15") ||
        sourceName.includes("오크몸");
      const looksLikeGear =
        !looksLikeBody && (
        sourceName.includes("02 - default") ||
        sourceName.includes("03 - default") ||
        sourceName.includes("07 - default") ||
        sourceName.includes("default") ||
        sourceName.includes("gear") ||
        sourceName.includes("armor") ||
        sourceName.includes("weapon") ||
        sourceName.includes("belt") ||
        sourceName.includes("bracer") ||
        sourceName.includes("벨트") ||
        sourceName.includes("아머") ||
        sourceName.includes("무기") ||
        sourceName.includes("장식") ||
        sourceName.includes("보호대") ||
        sourceName.includes("팔찌")
        );
      const maps = textureSet ? (looksLikeGear ? textureSet.gear : textureSet.body) : undefined;
      const sourceMaterial = source as THREE.MeshStandardMaterial | undefined;
      const sourceMap = sourceMaterial?.map ?? null;
      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
      const { baseMap, normalMap, roughnessMap, metalnessMap } = withPbrMaps(maps, sourceMap, maxAnisotropy);
      cloneTextureTransform(sourceMap, baseMap);

      const material = new THREE.MeshStandardMaterial({
        name: source?.name || "orc_auto_material",
        color: clay ? 0x7d7d7d : baseMap ? 0xffffff : sourceMaterial?.color ?? 0xffffff,
        map: baseMap,
        normalMap,
        normalScale: normalMap ? new THREE.Vector2(looksLikeGear ? 0.42 : 0.34, looksLikeGear ? 0.42 : 0.34) : undefined,
        roughnessMap,
        metalnessMap,
        roughness: clay ? 0.72 : roughnessMap ? 1 : looksLikeGear ? 0.52 : 0.62,
        metalness: clay ? 0.05 : metalnessMap ? 1 : looksLikeGear ? 0.18 : 0.02,
        envMapIntensity: pbrMode ? (looksLikeGear ? 0.42 : 0.26) : 0.18,
        wireframe: wire,
        side: source?.side ?? THREE.FrontSide,
        transparent: source?.transparent ?? false,
        opacity: source?.opacity ?? 1,
      });

      return material;
    };

    const applyAutoMaterials = (fbx: THREE.Group, textureSet: Awaited<typeof textureSetPromise>) => {
      fbx.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((mat) => createTexturedMaterial(mat, mesh.name, textureSet));
        } else {
          mesh.material = createTexturedMaterial(mesh.material, mesh.name, textureSet);
        }
      });
    };

    const loader = new FBXLoader(manager);
    loader.setResourcePath("/models/orc/orc_texture/");
    loader.load(
      versionedAsset(ORC_MODEL_PATH),
      (fbx) => {
        if (disposed) return;

        fbx.name = ORC_MODEL_FILE.replace(".fbx", "");
        applyAutoMaterials(fbx, null);

        const box = new THREE.Box3().setFromObject(fbx);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        const scale = 3.2 / maxAxis;
        fbx.scale.setScalar(scale);
        fbx.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        fbx.updateMatrixWorld(true);
        const groundedBox = new THREE.Box3().setFromObject(fbx);
        fbx.position.y += -0.45 - groundedBox.min.y;

        scene.add(fbx);
        fallback.visible = false;
        setLoadState("loaded");

        textureSetPromise.then((textureSet) => {
          if (disposed || !textureSet) return;
          applyAutoMaterials(fbx, textureSet);
          setLoadState(!clay && !wire ? "textured" : "loaded");
        });
      },
      undefined,
      () => {
        if (disposed) return;
        fallback.visible = true;
        setLoadState("fallback");
      }
    );

    scene.add(new THREE.HemisphereLight(0xf2ead8, 0x17191f, 0.42));
    scene.add(new THREE.AmbientLight(0xffffff, 0.18));
    const keyLight = new THREE.DirectionalLight(0xffefd8, 0.82);
    keyLight.position.set(3.5, 4.2, 3.8);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.26);
    frontLight.position.set(-1.2, 2.8, 4.8);
    scene.add(frontLight);
    const rimLight = new THREE.PointLight(0xffd99a, 0.38, 8);
    rimLight.position.set(-3.4, 2.1, 2.4);
    scene.add(rimLight);
    const blueFill = new THREE.PointLight(0x7f95ff, 0.24, 8);
    blueFill.position.set(2.4, 1.4, -3.2);
    scene.add(blueFill);

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frame = 0;
    let lastCameraResetKey = cameraResetKeyRef.current;
    const applyToolMode = () => {
      const tool = activeToolRef.current;
      const isMove = tool === "이동";
      const isZoom = tool === "확대";
      const isRotate = tool === "회전";

      controls.enableRotate = !isMove && !isZoom;
      controls.enablePan = !isRotate && !isZoom;
      controls.enableZoom = !isRotate && !isMove;
      controls.mouseButtons.LEFT = isMove
        ? THREE.MOUSE.PAN
        : isZoom
          ? THREE.MOUSE.DOLLY
          : THREE.MOUSE.ROTATE;
      controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
      controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
      controls.screenSpacePanning = true;
    };
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (lastCameraResetKey !== cameraResetKeyRef.current) {
        camera.position.set(3.7, 2.2, 5.6);
        controls.target.set(0, 1, 0);
        lastCameraResetKey = cameraResetKeyRef.current;
      }
      grid.visible = gridEnabledRef.current;
      applyToolMode();
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      environmentMap.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      loadedTextures.forEach((texture) => texture.dispose());
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose?.();
      });
    };
  }, [activeStep, viewMode]);



  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
      <div className="group absolute bottom-24 left-5 z-30">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2E36] bg-[#080A0D]/90 text-neutral-400 shadow-lg backdrop-blur transition hover:border-[#E0A12E]/60 hover:text-[#E0A12E]"
          aria-label="뷰포트 조작 안내"
        >
          <CircleHelp className="h-4 w-4" />
        </button>
        <div className="pointer-events-none absolute bottom-0 left-12 w-max max-w-[320px] translate-x-1 rounded-lg border border-[#2A2E36] bg-[#080A0D]/95 px-3 py-2 text-[14px] text-neutral-300 opacity-0 shadow-xl backdrop-blur transition group-hover:translate-x-0 group-hover:opacity-100">
          회전: 드래그 · 확대: 휠 · 이동: 우클릭 드래그
        </div>
      </div>
    </div>
  );
}

function ModuleSetBrowser({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<"sets" | "detail">("sets");
  const [selectedSetId, setSelectedSetId] = useState(MODULE_SETS[0].id);
  const [selectedViewIndex, setSelectedViewIndex] = useState(0);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(MODULES[0].id);

  const selectedSet = MODULE_SETS.find((set) => set.id === selectedSetId) ?? MODULE_SETS[0];
  const selectedEquipment = MODULES.find((module) => module.id === selectedEquipmentId) ?? MODULES[0];

  const goToSets = () => {
    setStage("sets");
    setSelectedViewIndex(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`absolute right-5 top-[132px] z-40 flex max-h-[calc(100%-152px)] flex-col overflow-hidden rounded-xl border border-[#2A2E36] bg-[#080A0D]/97 shadow-[0_24px_70px_rgba(0,0,0,0.75)] backdrop-blur-xl ${
        stage === "sets" ? "w-[620px]" : "w-[900px]"
      } max-w-[calc(100%-112px)]`}
    >
      <div className="flex min-h-[58px] shrink-0 items-center justify-between border-b border-[#1F2329] px-4">
        <div className="flex min-w-0 items-center gap-2 text-[14px] font-medium">
          <button onClick={goToSets} className={stage === "sets" ? "text-white" : "text-neutral-400 transition hover:text-white"}>
            생성 모듈 세트
          </button>
          {stage === "detail" && (
            <>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-600" />
              <span className="truncate text-[#E0A12E]">{selectedSet.title}</span>
            </>
          )}
        </div>
        <button onClick={onClose} className="rounded-md p-1.5 text-neutral-500 transition hover:bg-white/5 hover:text-white" aria-label="모듈 패널 닫기">
          <X className="h-4 w-4" />
        </button>
      </div>

      {stage === "sets" && (
        <div className="min-h-0 overflow-y-auto p-4 custom-scrollbar">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-medium text-white">생성된 모듈 세트</h2>
              <p className="mt-1 text-[14px] text-neutral-500">세트를 선택하면 3D 장비와 캐릭터 4방향을 확인할 수 있어요.</p>
            </div>
            <span className="shrink-0 rounded-full border border-[#2A2E36] bg-[#111317] px-2.5 py-1 text-[14px] text-neutral-400">
              {MODULE_SETS.length}개
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {MODULE_SETS.map((set) => (
              <button
                key={set.id}
                onClick={() => {
                  setSelectedSetId(set.id);
                  setSelectedViewIndex(0);
                  setStage("detail");
                }}
                className="group overflow-hidden rounded-lg border border-[#1F2329] bg-[#111317] text-left transition hover:border-[#E0A12E]/60"
              >
                <div className="aspect-[4/3] bg-[#15171B] p-2">
                  <img
                    src={getModuleSetPreviewImage(set.id, 0)}
                    alt={`${set.title} 정면`}
                    className="h-full w-full object-contain transition duration-200 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="border-t border-[#1F2329] p-3">
                  <p className="truncate text-[15px] font-medium text-white group-hover:text-[#E0A12E]">{set.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === "detail" && (
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] overflow-hidden">
          <section className="flex min-h-0 flex-col border-r border-[#1F2329] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-medium text-white">{selectedSet.title}</h2>
              </div>
              <span className="rounded-md border border-[#E0A12E]/25 bg-[#E0A12E]/10 px-2.5 py-1 text-[14px] text-[#E0A12E]">장비 {MODULES.length}개</span>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-[#1F2329] bg-[#15171B]">
              <img
                src={getModuleSetPreviewImage(selectedSet.id, selectedViewIndex)}
                alt={`${selectedSet.title} ${MODULE_PREVIEW_LABELS[selectedViewIndex]}`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {MODULE_PREVIEW_LABELS.map((label, index) => (
                <button
                  key={label}
                  onClick={() => setSelectedViewIndex(index)}
                  className={`overflow-hidden rounded-lg border text-left transition ${
                    selectedViewIndex === index ? "border-[#E0A12E] bg-[#E0A12E]/8" : "border-[#1F2329] bg-[#111317] hover:border-[#555A64]"
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#15171B]">
                    <img src={getModuleSetPreviewImage(selectedSet.id, index)} alt="" className="h-full w-full object-contain" />
                  </div>
                  <p className={`border-t border-[#1F2329] px-2 py-1.5 text-center text-[14px] ${selectedViewIndex === index ? "text-[#E0A12E]" : "text-neutral-400"}`}>{label}</p>
                </button>
              ))}
            </div>
          </section>

          <aside className="min-h-0 overflow-y-auto p-4 custom-scrollbar">
            <div className="mb-3">
              <h3 className="text-[16px] font-medium text-white">3D 장비 모듈</h3>
              <p className="mt-1 text-[14px] text-neutral-500">장비를 누르면 선택 상태를 확인할 수 있어요.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MODULES.map((module) => {
                const selected = selectedEquipment.id === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => setSelectedEquipmentId(module.id)}
                    className={`overflow-hidden rounded-lg border bg-[#111317] text-left transition ${selected ? "border-[#E0A12E]" : "border-[#1F2329] hover:border-[#555A64]"}`}
                  >
                    <div className="aspect-square bg-[#15171B] p-2">
                      <img src={getModuleSetItemImage(selectedSet.id, module.itemNumber)} alt="" className="h-full w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-[#1F2329] px-2.5 py-2">
                      <span className={`truncate text-[14px] font-medium ${selected ? "text-[#E0A12E]" : "text-neutral-300"}`}>{module.label}</span>
                      {selected && <Check className="h-3.5 w-3.5 shrink-0 text-[#E0A12E]" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 rounded-lg border border-[#1F2329] bg-[#111317] p-3">
              <p className="text-[14px] text-neutral-500">선택한 장비</p>
              <p className="mt-1 text-[15px] font-medium text-white">{selectedEquipment.label}</p>
            </div>
          </aside>
        </div>
      )}
    </motion.div>
  );
}

function ModelViewport({
  activeStep,
  polygonCount,
  moduleSetCount,
  isGeneratingModel,
}: {
  activeStep: ModelingStep;
  polygonCount: number;
  moduleSetCount: number;
  isGeneratingModel: boolean;
}) {
  const [viewMode, setViewMode] = useState("PBR");
  const [activeTool, setActiveTool] = useState("선택");
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [isModuleBrowserOpen, setIsModuleBrowserOpen] = useState(false);
  useEffect(() => {
    setActiveTool("선택");
  }, [activeStep]);

  const handleToolSelect = (tool: string) => {
    if (tool === "카메라") {
      setCameraResetKey((value) => value + 1);
      setActiveTool("선택");
      return;
    }
    if (tool === "그리드") {
      setGridEnabled((value) => !value);
      setActiveTool(tool);
      return;
    }
    setActiveTool(tool);
  };

  return (
    <section className="relative flex min-h-[520px] min-w-0 flex-1 flex-col overflow-hidden border-b border-[#1F2329] bg-[#050505] lg:min-h-0 lg:border-b-0 lg:border-r">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(135deg,rgba(224,161,46,0.08),transparent_30%,rgba(96,165,250,0.04))]" />
      <div className="relative z-10 flex h-[58px] shrink-0 items-center justify-between border-b border-[#1F2329] px-5">
        <div className="flex items-center gap-2">
          {VIEWPORT_MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-md border px-3 py-1.5 text-[14px] font-medium transition-colors ${
                viewMode === mode
                  ? "border-[#E0A12E] bg-[#E0A12E]/10 text-[#E0A12E]"
                  : "border-[#1F2329] bg-[#0A0B0D] text-neutral-400 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {!isGeneratingModel && (
        <ViewportTools activeTool={activeTool} onToolSelect={handleToolSelect} gridEnabled={gridEnabled} />
      )}
      <button
        type="button"
        onClick={() => setIsModuleBrowserOpen((current) => !current)}
        disabled={isGeneratingModel}
        className={`absolute right-5 top-20 z-30 flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[14px] font-medium shadow-xl backdrop-blur transition ${
          isModuleBrowserOpen
            ? "border-[#E0A12E] bg-[#E0A12E]/15 text-[#E0A12E]"
            : "border-[#2A2E36] bg-[#080A0D]/90 text-neutral-300 hover:border-[#E0A12E]/60 hover:text-white"
        }`}
      >
        <Layers3 className="h-4 w-4" />
        모듈 세트
        <span className={isModuleBrowserOpen ? "text-[#E0A12E]" : "text-neutral-500"}>{moduleSetCount}</span>
      </button>

      <AnimatePresence>
        {isModuleBrowserOpen && <ModuleSetBrowser onClose={() => setIsModuleBrowserOpen(false)} />}
      </AnimatePresence>

      <div className="relative z-10 flex flex-1 items-center justify-center overflow-hidden p-8">
        {isGeneratingModel ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E0A12E]/30 bg-[#E0A12E]/10">
              <LoadingIndicator size="md" />
            </div>
            <h2 className="mt-5 text-[20px] font-medium text-white">3D 모델링 생성 중</h2>
            <div className="mt-5 h-1.5 w-56 overflow-hidden rounded-full bg-[#1F2329]">
              <motion.div
                className="h-full rounded-full bg-[#E0A12E]"
                initial={{ width: "8%" }}
                animate={{ width: "92%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <ThreeModelPreview
              activeStep={activeStep}
              viewMode={viewMode}
              activeTool={activeTool}
              cameraResetKey={cameraResetKey}
              gridEnabled={gridEnabled}
            />
          </div>
        )}

        {!isGeneratingModel && <div className="absolute bottom-5 left-5 z-20">
          <p className="text-[14px] text-neutral-500">폴리곤 수</p>
          <p className="mt-1 text-[16px] font-medium text-white">{polygonCount.toLocaleString("ko-KR")}</p>
        </div>}
      </div>
    </section>
  );
}

function SectionTitle({ title, helper }: { title: string; helper?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-1.5 text-[14px] font-medium text-white">
        {title}
        {helper && <CircleHelp className="h-3.5 w-3.5 text-neutral-500" />}
      </h3>
      {helper && <span className="text-[14px] text-neutral-500">{helper}</span>}
    </div>
  );
}

function RightPanel({
  activeStep,
  setActiveStep,
  appliedSteps,
  onApplyStep,
  onBackToWorkflow,
  onRequestSave,
  isGeneratingModel,
}: {
  activeStep: ModelingStep;
  setActiveStep: (step: ModelingStep) => void;
  appliedSteps: Record<ModelingStep, boolean>;
  onApplyStep: (step: ModelingStep, quality: string) => void;
  onBackToWorkflow: () => void;
  onRequestSave: () => void;
  isGeneratingModel: boolean;
}) {
  const [scope, setScope] = useState("selection");
  const [quality, setQuality] = useState("500K");
  const [isProcessing, setIsProcessing] = useState(false);
  const [promptDrafts, setPromptDrafts] = useState<Record<"generate", string>>({
    generate: "",
  });

  const activeIndex = STEPS.findIndex((step) => step.id === activeStep);
  const nextStep = STEPS[activeIndex + 1]?.id;
  const previousTarget = getModelingPreviousTarget(activeStep);

  const panelCopy = useMemo(() => {
    if (activeStep === "generate") {
      return {
        title: "3D 모델 확인",
        prompt: "오크 FBX 모델에서 수정하고 싶은 부분을 자연어로 입력하세요.",
        button: "AI 수정 적용",
      };
    }
    if (activeStep === "remesh") {
      return {
        title: "리메시",
        prompt: "목표 폴리곤과 사용처에 맞춰 메시를 최적화합니다.",
        button: "미리보기 생성",
      };
    }
    return {
      title: "텍스처 최적화",
      prompt: "복사된 TGA 텍스처 맵을 기준으로 PBR 구성을 점검합니다.",
      button: "텍스처 적용",
    };
  }, [activeStep]);

  const runAction = (onComplete?: () => void) => {
    if (isProcessing) return;
    setIsProcessing(true);
    window.setTimeout(() => {
      setIsProcessing(false);
      onApplyStep(activeStep, quality);
      onComplete?.();
    }, 1100);
  };

  return (
    <aside className={`flex shrink-0 flex-col border-t border-[#1F2329] bg-[#050505] lg:h-full lg:border-l lg:border-t-0 ${WORKFLOW_SIDEBAR_WIDTH_CLASS}`}>
      <WorkflowSidebarHeader
        title={panelCopy.title}
        action={
          <span className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[14px] ${
            appliedSteps[activeStep]
              ? "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#4ADE80]"
              : "border-[#1F2329] bg-[#0A0B0D] text-neutral-500"
          }`}>
            {appliedSteps[activeStep] && <Check className="h-3.5 w-3.5" />}
            {appliedSteps[activeStep] ? "적용됨" : "적용 전"}
          </span>
        }
      />

      <div className="max-h-[760px] flex-1 overflow-y-auto p-5 custom-scrollbar lg:max-h-none">
        {activeStep === "generate" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4">
              <SectionTitle title="AI 프롬프트 수정" />
              <textarea
                className="mt-3 h-24 w-full resize-none rounded-lg border border-[#2A2E36] bg-[#111419] p-3 text-[14px] text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-[#E0A12E]"
                placeholder={panelCopy.prompt}
                value={promptDrafts.generate}
                onChange={(event) =>
                  setPromptDrafts((prev) => ({
                    ...prev,
                    generate: event.target.value,
                  }))
                }
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {["어깨 갑옷 더 날카롭게", "무기 스파이크 크게", "허리 벨트 정리", "피부 주름 강조"].map((item) => (
                  <button key={item} className="rounded-md border border-[#1F2329] bg-[#141518] px-2 py-2 text-[14px] text-neutral-400 hover:border-[#E0A12E] hover:text-white">
                    {item}
                  </button>
                ))}
              </div>
              <button
                onClick={() => runAction()}
                disabled={isGeneratingModel}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#E0A12E] py-3 text-[14px] font-medium text-black transition-colors hover:bg-[#F0B43A]"
              >
                {isProcessing ? <LoadingIndicator tone="current" /> : <Sparkles className="h-4 w-4" />}
                {panelCopy.button}
              </button>
            </div>

            <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4">
              <SectionTitle title="수정 범위" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ["all", "전체"],
                  ["selection", "선택 영역"],
                  ["module", "모듈 단위"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setScope(id)}
                    className={`rounded-lg border py-2 text-[14px] font-medium ${
                      scope === id ? "border-[#E0A12E] bg-[#E0A12E]/10 text-[#E0A12E]" : "border-[#1F2329] bg-[#141518] text-neutral-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-6 gap-2">
                {MODULES.map((module, index) => (
                  <button
                    key={module.id}
                    className={`group overflow-hidden rounded-lg border bg-[#111419] ${
                      index === 3 ? "border-[#E0A12E]" : "border-[#1F2329] hover:border-[#555A64]"
                    }`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img src={module.image} alt={module.label} className="h-full w-full object-contain p-1 opacity-85 group-hover:opacity-100" />
                    </div>
                    <span className="block truncate px-1 py-1 text-[14px] text-neutral-400">{module.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4">
              <SectionTitle title="참조 이미지" />
              <div className="mt-3 grid grid-cols-5 gap-2">
                {SOURCE_IMAGES.map((image, index) => (
                  <button key={image} className={`relative overflow-hidden rounded-lg border ${index === 0 ? "border-[#E0A12E]" : "border-[#1F2329]"}`}>
                    <img src={image} alt="" className="aspect-square w-full object-cover" />
                    {index === 0 && <Check className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-[#E0A12E] p-0.5 text-black" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeStep === "remesh" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4">
              <SectionTitle title="최적화 목적 선택" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  ["영상용", "500K", Grid3X3],
                  ["게임용", "80K", Gauge],
                  ["3D 프린트", "700K", Box],
                  ["애니메이션", "150K", Workflow],
                ].map(([label, count, Icon]) => (
                  <button
                    key={label as string}
                    onClick={() => setQuality(count as string)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      quality === count ? "border-[#E0A12E] bg-[#E0A12E]/10" : "border-[#1F2329] bg-[#141518] hover:border-[#555A64]"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${quality === count ? "text-[#E0A12E]" : "text-neutral-400"}`} />
                    <p className="mt-3 text-[14px] font-medium text-white">{label as string}</p>
                    <p className="mt-1 text-[18px] font-semibold text-[#E0A12E]">{count as string}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4">
              <SectionTitle title="리메시 목표" />
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-[14px] text-neutral-400">
                  <span>목표 폴리곤</span>
                  <span className="text-[18px] font-semibold text-white">{quality === "500K" ? "500,000" : quality}</span>
                </div>
                <input type="range" min="1" max="100" defaultValue="48" className="w-full accent-[#E0A12E]" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2 text-[14px] text-neutral-300">
                {["실루엣 유지", "하드 엣지 유지", "UV 경계 유지", "쿼드 기반"].map((item) => (
                  <label key={item} className="flex items-center gap-2 rounded-lg border border-[#1F2329] bg-[#141518] px-3 py-2">
                    <input type="checkbox" defaultChecked className="accent-[#E0A12E]" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeStep === "remesh" && (
          <button
            onClick={() => runAction()}
            disabled={isGeneratingModel}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#E0A12E] py-3 text-[14px] font-medium text-black transition hover:bg-[#F0B43A]"
          >
            {isProcessing ? <LoadingIndicator tone="current" /> : <Workflow className="h-4 w-4" />}
            {isProcessing ? "리메시 처리 중" : "리메시 적용"}
          </button>
        )}

        {activeStep === "texture" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4">
              <SectionTitle title="텍스처 체크" />
              <div className="mt-3 space-y-2">
                {[
                  ["TGA 텍스처 파일 연결됨", "완료"],
                  ["BaseColor / Normal / Roughness 확인", "정상"],
                  ["Metallic / Height 맵 대기", "확인"],
                ].map(([label, level]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-[#1F2329] bg-[#141518] px-3 py-2.5">
                    <span className="flex items-center gap-2 text-[14px] text-neutral-300">
                      <Zap className="h-3.5 w-3.5 text-[#E0A12E]" />
                      {label}
                    </span>
                    <span className="text-[14px] text-[#4ADE80]">{level}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => runAction()} disabled={isGeneratingModel} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#E0A12E] py-2.5 text-[14px] font-medium text-black hover:bg-[#F0B43A] disabled:cursor-not-allowed disabled:opacity-50">
                {isProcessing ? <LoadingIndicator tone="current" /> : <Zap className="h-4 w-4" />}
                {isProcessing ? "텍스처 최적화 중" : "텍스처 최적화"}
              </button>
            </div>

            <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4">
              <SectionTitle title="텍스처 맵" />
              <div className="mt-3 space-y-2">
                {TEXTURE_MAPS.map((map) => (
                  <div key={map.id} className="flex items-center justify-between rounded-lg border border-[#1F2329] bg-[#141518] px-3 py-2">
                    <span className="flex min-w-0 items-center gap-2 text-[14px] text-neutral-300">
                      <span className="h-4 w-4 shrink-0 rounded-sm border border-white/10" style={{ backgroundColor: map.color }} />
                      <span className="truncate">{map.label}</span>
                    </span>
                    <Eye className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-[#1F2329] bg-[#08090B] p-5">

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (previousTarget === "turnaround") {
                onBackToWorkflow();
                return;
              }
              setActiveStep(previousTarget);
            }}
            className="flex w-[32%] items-center justify-center gap-1.5 rounded-xl border border-[#2A2E36] bg-[#0A0B0D] py-3.5 text-[14px] font-medium text-neutral-300 transition hover:bg-[#141518]"
          >
            <ArrowLeft className="h-4 w-4" />
            이전
          </button>
          <button
            disabled={isGeneratingModel || isProcessing}
            onClick={() => {
              if (nextStep) {
                setActiveStep(nextStep);
                return;
              }
              if (appliedSteps[activeStep]) {
                onRequestSave();
                return;
              }
              runAction(onRequestSave);
            }}
            className="flex w-[68%] items-center justify-center gap-2 rounded-xl bg-[#E0A12E] py-3.5 text-[14px] font-medium text-black transition hover:bg-[#F0B43A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextStep
              ? `다음 단계: ${STEPS[activeIndex + 1].title}`
              : isProcessing
                ? "저장 준비 중"
                : "저장하기"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function ModelingGenerationPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeStep, setActiveStep] = useState<ModelingStep>("generate");
  const [polygonCount, setPolygonCount] = useState(500000);
  const moduleSetCount = MODULE_SETS.length;
  const [isGeneratingModel, setIsGeneratingModel] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(MODEL_GENERATION_REQUEST_KEY) !== null;
  });
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("오크 전사 3D 모델링");
  const [appliedSteps, setAppliedSteps] = useState<Record<ModelingStep, boolean>>({
    generate: true,
    remesh: false,
    texture: false,
  });

  const handleApplyStep = (step: ModelingStep, quality: string) => {
    setAppliedSteps((prev) => ({ ...prev, [step]: true }));
    if (step === "remesh") {
      const polygonTargets: Record<string, number> = {
        "80K": 80000,
        "150K": 150000,
        "500K": 500000,
        "700K": 700000,
      };
      setPolygonCount(polygonTargets[quality] ?? 500000);
    }
  };

  const handleBackToWorkflow = () => {
    if (typeof window !== "undefined") {
      let returnTab: "turnaround" | "modular" = "turnaround";
      const rawFlowState = window.sessionStorage.getItem("neopoly:turnaround-flow");

      if (rawFlowState) {
        try {
          const flowState = JSON.parse(rawFlowState) as { isModularSelected?: boolean };
          if (flowState.isModularSelected) returnTab = "modular";
        } catch {
          returnTab = "turnaround";
        }
      }

      window.sessionStorage.setItem("neopoly:return-to-turnaround-tab", returnTab);
    }

    onNavigate?.("turnaround");
  };

  useEffect(() => {
    if (!isGeneratingModel) return;

    const timer = window.setTimeout(() => {
      window.sessionStorage.removeItem(MODEL_GENERATION_REQUEST_KEY);
      setIsGeneratingModel(false);
    }, 1900);

    return () => window.clearTimeout(timer);
  }, [isGeneratingModel]);

  const handleSaveProject = () => {
    if (!projectName.trim()) return;

    const generatedProject = createGeneratedProject(
      projectName,
      moduleSetCount,
      polygonCount,
    );
    let storedProjects: unknown[] = [];

    try {
      const raw = window.localStorage.getItem(PROJECT_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) storedProjects = parsed;
    } catch {
      storedProjects = [];
    }

    window.localStorage.setItem(
      PROJECT_STORAGE_KEY,
      JSON.stringify([generatedProject, ...storedProjects]),
    );
    window.localStorage.setItem(
      "neopoly_selected_project_id",
      String(generatedProject.id),
    );
    setIsSaveModalOpen(false);
    onNavigate?.("projects");
  };

  return (
    <div className="flex h-[calc(100vh-76px)] flex-col overflow-y-auto bg-[#050505] text-white custom-scrollbar lg:flex-row lg:overflow-hidden">
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <WorkflowHeader
          title="3D 모델링 생성"
          section="modeling"
          currentStep={activeStep}
        />
        <ModelViewport
          activeStep={activeStep}
          polygonCount={polygonCount}
          moduleSetCount={moduleSetCount}
          isGeneratingModel={isGeneratingModel}
        />
      </main>
      <RightPanel
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        appliedSteps={appliedSteps}
        onApplyStep={handleApplyStep}
        onBackToWorkflow={handleBackToWorkflow}
        onRequestSave={() => setIsSaveModalOpen(true)}
        isGeneratingModel={isGeneratingModel}
      />

      <AnimatePresence>
        {isSaveModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setIsSaveModalOpen(false)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 p-5 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onMouseDown={(event) => event.stopPropagation()}
              className="w-full max-w-[480px] rounded-xl border border-[#2A2E36] bg-[#0A0B0D] shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
            >
              <div className="flex h-16 items-center justify-between border-b border-[#1F2329] px-5">
                <h2 className="text-[18px] font-medium text-white">프로젝트로 저장</h2>
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/5 hover:text-white"
                  aria-label="저장 팝업 닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5">
                <label htmlFor="generated-project-name" className="text-[14px] font-medium text-neutral-300">
                  프로젝트 이름
                </label>
                <input
                  id="generated-project-name"
                  autoFocus
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSaveProject();
                  }}
                  className="mt-2 h-12 w-full rounded-lg border border-[#2A2E36] bg-[#111317] px-4 text-[15px] text-white outline-none transition focus:border-[#E0A12E]"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#1F2329] p-5">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="h-11 rounded-lg border border-[#2A2E36] px-4 text-[14px] font-medium text-neutral-300 transition hover:bg-white/5"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={!projectName.trim()}
                  onClick={handleSaveProject}
                  className="h-11 rounded-lg bg-[#E0A12E] px-5 text-[14px] font-medium text-black transition hover:bg-[#F0B43A] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  프로젝트 저장
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
