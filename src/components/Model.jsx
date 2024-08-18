import { useFrame } from "@react-three/fiber";
// import { useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import { fragment, vertex } from "./Shader";
import { useAspect, useTexture } from "@react-three/drei";

function Model() {
  const image = useRef();
  const [hovered, setHovered] = useState(false);
  const [factor, setFactor] = useState(0.25);

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth <= 768) {
        setFactor(0.6);
      } else if (window.innerWidth <= 820) {
        setFactor(0.5);
      } else {
        setFactor(0.25);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  // const { amplitude, waveLength } = useControls({
  //   amplitude: { value: 0.25, min: 0, max: 2, step: 0.1 },
  //   waveLength: { value: 5, min: 0, max: 20, step: 0.5 },
  // });

  const amplitude = 0.125;
  const waveLength = 10;

  const texture = useTexture("/g-wagon.jpg");

  const { width, height } = texture.image;

  const scale = useAspect(width, height, factor);

  const uniforms = useRef({
    uTime: { value: 0 },
    uAmplitude: { value: amplitude },
    uWaveLength: { value: waveLength },
    uTexture: { value: texture },
  });

  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  useFrame(() => {
    if (hovered) {
      image.current.material.uniforms.uTime.value += 0.04;
      image.current.material.uniforms.uAmplitude.value = lerp(
        image.current.material.uniforms.uAmplitude.value,
        0.25,
        0.1
      );
      image.current.material.uniforms.uWaveLength.value = lerp(
        image.current.material.uniforms.uWaveLength.value,
        10,
        0.1
      );
    } else {
      image.current.material.uniforms.uTime.value = 0;
      image.current.material.uniforms.uAmplitude.value = lerp(
        image.current.material.uniforms.uAmplitude.value,
        0,
        0.1
      );
      image.current.material.uniforms.uWaveLength.value = lerp(
        image.current.material.uniforms.uWaveLength.value,
        10,
        0.1
      );
    }
  });

  return (
    <mesh
      ref={image}
      scale={scale}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <planeGeometry args={[1, 1, 50, 50]} />
      <shaderMaterial
        wireframe={false}
        fragmentShader={fragment}
        vertexShader={vertex}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}

export default Model;
