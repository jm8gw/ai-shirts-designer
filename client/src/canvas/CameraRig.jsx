import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useRef } from "react";

import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef(); // used to update the state
  const snap = useSnapshot(state); // get the state

  // allows you to execute code on every rendered frame
  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth < 1260;
    const isMobile = window.innerWidth < 600;

    // set the initial position of the model (based on the screen size)
    let targetPostion = [-0.4, 0, 2];
    if (snap.intro) {
      if (isBreakpoint) targetPostion = [0, 0, 2];
      if (isMobile) targetPostion = [0, 0.2, 2.5];
    } else {
      if (isMobile) targetPostion = [0, 0, 2.5];
      else targetPostion = [0, 0, 2];
    }

    // set model camera position
    easing.dampE(state.camera.position, targetPostion, 0.25, delta);

    // set the model rotation smoothly
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
