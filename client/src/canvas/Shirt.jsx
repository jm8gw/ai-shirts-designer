import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";

import state from "../store";

const Shirt = () => {
  const snap = useSnapshot(state);
  // get the shirt model
  const { nodes, materials } = useGLTF("/shirt_baked.glb");

  // apply the textures to the shirt
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

	// apply the color smoothy
	useFrame((state, delta) =>  easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));

	// shirt sometimes doesn't update, fix that by providing a key to the group
	const stateString = JSON.stringify(snap); // tracks state changes

  // display that shirt model
  return (
    <group
			key={stateString} // react will render the model whenever the state changes
		>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

				{snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]} // these values are based on what fits the model best
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
						anisotropy={16} // change quality of texture
						depthTest={false}
						depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
