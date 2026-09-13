import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type HellScenePhase = 'wake' | 'arrival' | 'choice' | 'portal' | 'guide' | 'launch';

type Props = {
  phase: HellScenePhase;
  reducedMotion: boolean;
  onBeat?: (beat: string) => void;
};

type DemonRig = {
  root: THREE.Group;
  head: THREE.Group;
  upperJaw: THREE.Group;
  lowerJaw: THREE.Group;
  eyes: THREE.Mesh[];
  body: THREE.Group;
  portal: THREE.Mesh;
};

const material = (
  color: number,
  metalness = 0.1,
  roughness = 0.8,
  emissive = 0,
  emissiveIntensity = 0,
) =>
  new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    emissive,
    emissiveIntensity,
  });

function createPythosura(scale = 1): DemonRig {
  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const body = new THREE.Group();
  const skin = material(0x0d0a0f, 0.28, 0.68, 0x21050a, 0.22);

  for (let i = 0; i < 9; i += 1) {
    const segment = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.62, 1.12, 6, 12),
      skin,
    );
    segment.position.set(
      Math.sin(i * 0.62) * 0.62,
      1.22 + i * 0.5,
      -2.45 - i * 0.42,
    );
    segment.rotation.x = Math.PI / 2;
    segment.rotation.z = -Math.sin(i * 0.7) * 0.08;
    body.add(segment);
  }

  root.add(body);

  const head = new THREE.Group();
  head.position.set(0, 5.65, -6.25);

  const skull = new THREE.Mesh(
    new THREE.SphereGeometry(1.52, 32, 20),
    skin,
  );
  skull.scale.set(1.2, 1, 1.16);
  head.add(skull);

  const eyeMaterial = material(0xff432b, 0.1, 0.32, 0xff1c00, 7);
  const eyeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 12),
    eyeMaterial,
  );
  eyeL.position.set(-0.6, 0.15, 1.4);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.6;
  head.add(eyeL, eyeR);

  const hornMaterial = material(0x32242a, 0.25, 0.55, 0x13050b, 0.2);
  const hornL = new THREE.Mesh(
    new THREE.ConeGeometry(0.33, 1.55, 12),
    hornMaterial,
  );
  hornL.position.set(-1.02, 1.3, 0.04);
  hornL.rotation.z = -0.48;
  const hornR = hornL.clone();
  hornR.position.x = 1.02;
  hornR.rotation.z = 0.48;
  head.add(hornL, hornR);

  const upperJaw = new THREE.Group();
  upperJaw.position.set(0, -0.16, 1.04);
  const upper = new THREE.Mesh(
    new THREE.BoxGeometry(2.02, 0.48, 1.12),
    skin,
  );
  upper.position.z = 0.12;
  upperJaw.add(upper);

  const lowerJaw = new THREE.Group();
  lowerJaw.position.set(0, -0.84, 0.98);
  const lower = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.4, 1.05),
    skin,
  );
  lower.position.z = 0.12;
  lowerJaw.add(lower);

  const fangMaterial = material(0xd3c9c5, 0.05, 0.36, 0x2a1414, 0.1);
  for (const x of [-0.72, -0.36, 0, 0.36, 0.72]) {
    const fang = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.5, 8),
      fangMaterial,
    );
    fang.position.set(x, -0.5, 1.02);
    fang.rotation.x = Math.PI;
    upperJaw.add(fang);
  }

  head.add(upperJaw, lowerJaw);

  const portal = new THREE.Mesh(
    new THREE.CircleGeometry(1.28, 64),
    material(0x19000d, 0.1, 0.3, 0xff2400, 5),
  );
  portal.position.set(0, -0.48, 1.44);
  head.add(portal);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.065, 10, 48),
    material(0x8c1820, 0.2, 0.4, 0xff1d00, 8),
  );
  rim.position.set(0, -0.48, 1.46);
  head.add(rim);

  root.add(head);

  return {
    root,
    head,
    upperJaw,
    lowerJaw,
    eyes: [eyeL, eyeR],
    body,
    portal,
  };
}

function createEnvironment(scene: THREE.Scene) {
  const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
  const rockMaterial = material(0x171219, 0.15, 0.96, 0x21060a, 0.1);
  const rocks = new THREE.InstancedMesh(rockGeometry, rockMaterial, 38);
  const rockTransform = new THREE.Object3D();

  for (let i = 0; i < 38; i += 1) {
    const size = 0.3 + Math.random() * 1.5;
    rockTransform.position.set(
      (Math.random() - 0.5) * 30,
      size * 0.35,
      -3 - Math.random() * 34,
    );
    rockTransform.rotation.set(
      Math.random() * 2,
      Math.random() * 2,
      Math.random() * 2,
    );
    rockTransform.scale.setScalar(size);
    rockTransform.updateMatrix();
    rocks.setMatrixAt(i, rockTransform.matrix);
  }

  rocks.instanceMatrix.needsUpdate = true;
  scene.add(rocks);

  const torchStickGeometry = new THREE.CylinderGeometry(0.07, 0.1, 1.2, 8);
  const torchStickMaterial = material(0x2c1c18, 0.05, 0.95);
  const torchSticks = new THREE.InstancedMesh(
    torchStickGeometry,
    torchStickMaterial,
    9,
  );

  const torchFlameGeometry = new THREE.ConeGeometry(0.18, 0.56, 8);
  const torchFlameMaterial = material(
    0xff4b25,
    0.05,
    0.35,
    0xff1f00,
    7,
  );
  const torchFlames = new THREE.InstancedMesh(
    torchFlameGeometry,
    torchFlameMaterial,
    9,
  );

  const torchTransform = new THREE.Object3D();

  for (let i = 0; i < 9; i += 1) {
    const x = (i % 2 ? -1 : 1) * (3.5 + Math.random() * 2.8);
    const z = -5 - i * 3.8;

    torchTransform.position.set(x, 0.6, z);
    torchTransform.rotation.set(0, 0, 0);
    torchTransform.scale.setScalar(1);
    torchTransform.updateMatrix();
    torchSticks.setMatrixAt(i, torchTransform.matrix);

    torchTransform.position.set(x, 1.42, z);
    torchTransform.updateMatrix();
    torchFlames.setMatrixAt(i, torchTransform.matrix);
  }

  torchSticks.instanceMatrix.needsUpdate = true;
  torchFlames.instanceMatrix.needsUpdate = true;
  scene.add(torchSticks, torchFlames);

  embers(scene);
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();

      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }

    if (object instanceof THREE.Points) {
      object.geometry.dispose();
      const material = object.material;
      if (Array.isArray(material)) {
        material.forEach((item) => item.dispose());
      } else {
        material.dispose();
      }
    }
  });
}

function riseFromGround(time: number) {
  const progress = Math.min(1, (time % 3.3) / 2.15);
  return -5.6 + progress ** 0.6 * 7;
}

function jawOpenAmount(time: number) {
  return 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(time * 1.5));
}

export function HellWorld3D({
  phase,
  reducedMotion,
  onBeat,
}: Props) {
  const host = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef(phase);
  const onBeatRef = useRef(onBeat);
  phaseRef.current = phase;
  onBeatRef.current = onBeat;

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020105);
    scene.fog = new THREE.FogExp2(0x08040a, 0.045);

    const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 100);
    camera.position.set(0, 1.1, 4.2);
    camera.lookAt(0, 1.6, -9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    element.appendChild(renderer.domElement);

    scene.add(
      new THREE.HemisphereLight(0x2b172d, 0x030106, 0.55),
    );

    const red = new THREE.PointLight(0xff291b, 4.2, 26, 2);
    red.position.set(-3, 6, -10);
    scene.add(red);

    const orange = new THREE.PointLight(0xff7a3c, 3.4, 18, 2);
    orange.position.set(6, 2, -18);
    scene.add(orange);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(70, 70),
      material(0x08070b, 0.05, 0.98, 0x150207, 0.12),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.03;
    floor.position.z = -11;
    scene.add(floor);

    const lava = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 9),
      material(0x50130c, 0.05, 1, 0xff2909, 1.2),
    );
    lava.rotation.x = -Math.PI / 2;
    lava.position.set(0, 0.01, -24);
    scene.add(lava);

    createEnvironment(scene);

    const pyth = createPythosura();
    pyth.root.visible = false;
    scene.add(pyth.root);

    const mini = createPythosura(0.2);
    mini.root.visible = false;
    scene.add(mini.root);

    const distant = new THREE.Group();
    for (let i = 0; i < 7; i += 1) {
      const demon = createPythosura(0.12);
      demon.root.position.set(
        (Math.random() - 0.5) * 18,
        0.15,
        -15 - Math.random() * 17,
      );
      demon.root.rotation.y = Math.random() * Math.PI;
      distant.add(demon.root);
    }
    scene.add(distant);

    let raf = 0;
    let last = performance.now();
    let lastBeat = '';

    const resize = () => {
      const width = Math.max(1, element.clientWidth);
      const height = Math.max(1, element.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const emitBeat = (value: string) => {
      if (value === lastBeat) return;
      lastBeat = value;
      onBeatRef.current?.(value);
    };

    const loop = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = now / 1000;
      const currentPhase = phaseRef.current;

      pyth.root.visible =
        currentPhase === 'arrival' ||
        currentPhase === 'choice' ||
        currentPhase === 'portal';
      mini.root.visible = currentPhase === 'guide';

      if (currentPhase === 'wake') {
        camera.position.lerp(
          new THREE.Vector3(0, 0.82, 3.6),
          0.035,
        );
        camera.lookAt(0, 1.2, -10);
        red.intensity = 2.1;
        emitBeat('wake');
      }

      if (
        currentPhase === 'arrival' ||
        currentPhase === 'choice'
      ) {
        pyth.root.visible = true;
        pyth.root.position.z = -0.8;
        pyth.root.position.y = reducedMotion
          ? 1.35
          : riseFromGround(time);
        pyth.root.rotation.y = Math.sin(time * 0.35) * 0.09;
        pyth.head.rotation.y = Math.sin(time * 0.55) * 0.14;

        camera.position.x = reducedMotion
          ? 0
          : Math.sin(time * 17) * 0.04;
        camera.position.y =
          1.25 +
          (reducedMotion ? 0 : Math.sin(time * 10) * 0.018);
        camera.lookAt(0, 3.05, -5);

        if (
          currentPhase === 'arrival' &&
          pyth.root.position.y > 0.9
        ) {
          emitBeat('emerge');
        }
      }

      if (currentPhase === 'portal') {
        pyth.root.visible = true;
        pyth.root.position.set(0, 1.15, -1.1);

        const open = jawOpenAmount(time);
        pyth.upperJaw.rotation.x = -0.18 - open * 0.13;
        pyth.lowerJaw.rotation.x = 0.25 + open * 0.4;
        pyth.portal.scale.setScalar(0.65 + open * 0.42);

        camera.position.lerp(
          new THREE.Vector3(0, 1.32, 2.45),
          0.025,
        );
        camera.lookAt(0, 3.1, -4.7);
        emitBeat('portal');
      }

      if (currentPhase === 'guide') {
        mini.root.visible = true;
        mini.root.position.set(1.25, 0.75, -2.2);
        mini.root.rotation.y =
          -0.55 + Math.sin(time * 1.8) * 0.08;
        mini.root.rotation.z = Math.sin(time * 2) * 0.05;

        camera.position.lerp(
          new THREE.Vector3(0.14, 1.3, 2.75),
          0.03,
        );
        camera.lookAt(0.2, 1.45, -4);
        emitBeat('guide');
      }

      if (currentPhase === 'launch') {
        pyth.root.visible = false;
        mini.root.visible = false;

        camera.position.lerp(
          new THREE.Vector3(0, 1.55, -3.3),
          0.025,
        );
        camera.lookAt(0, 1.55, -10);
        emitBeat('launch');
      }

      distant.children.forEach((demon, index) => {
        demon.position.y = Math.sin(time * 0.45 + index) * 0.04;
        demon.rotation.y += delta * 0.035;
      });

      if (!reducedMotion) {
        camera.position.x += Math.sin(time * 0.73) * 0.002;
        camera.position.y += Math.sin(time * 0.81) * 0.0012;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      disposeScene(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return <div ref={host} className="hell-world-3d" aria-hidden="true" />;
}
