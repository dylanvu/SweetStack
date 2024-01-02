// cake object and any logic associated with it

// contains cake object and cake logic
import React, { useState, KeyboardEvent, useRef, Suspense  } from "react";
import {Vector3} from "three";
import { RoundedBox, useTexture } from '@react-three/drei';
import { Physics, RigidBody} from "@react-three/rapier";
import { Canvas, useLoader } from '@react-three/fiber'

import { PlacableIngredient } from "../../logic_v2/cakeTypes";

export default function Cake({texture, position}: {texture: PlacableIngredient, position: Vector3} ) {
    var colorMap = undefined;
    if (texture === "eggs"){
        colorMap = useTexture("/src/assets/wheatBlockTest.svg")}
    return(
        <RoundedBox position={position}
            args={[.7, 0.3, 0.7]} >
            <meshStandardMaterial map={colorMap}/>
        </RoundedBox >
    )
}

export function cakeDrop() { 
return(
        <Cake texture="eggs" position={new Vector3(0, 2.1, 0)}/>
    )
}