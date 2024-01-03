// contains cake object and cake logic
import { useState } from "react";
import { Vector3 } from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

import { PlacableIngredient } from "../../logic_v2/cakeTypes";

export default function Cake({ texture, position }: { texture: PlacableIngredient, position: Vector3 }) {

    // make this layer movable by default
    const [dynamic, setDynamic] = useState<boolean>(true);

    var colorMap = undefined;
    if (texture === "eggs") {
        colorMap = useTexture("/src/assets/wheatBlockTest.svg")
    }
    return (
        <RigidBody type={dynamic ? "dynamic" : "fixed"} onCollisionEnter={() => {
            // stop gravity
            setDynamic(false);
        }}>
            <RoundedBox position={position}
                args={[.7, 0.3, 0.7]} >
                <meshStandardMaterial map={colorMap} />
            </RoundedBox >
        </RigidBody>
    )
}
