// the game world, including the cake, syrup, players, and items
/// <reference types="vite-plugin-svgr/client" />
import Platform from "./objects/platform";
import { useState, Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GameState } from "../logic_v2/types";
import { PlacableIngredient } from '../logic_v2/cakeTypes';
import Cake from './objects/cake';
import { Physics, RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import PlayingUI from "../components/staticUI/states/playing";
import TutorialUI from "../components/staticUI/states/tutorial";
import Camera from "./objects/camera";

export default function Game({ game }: { game: GameState }) {


    // the cake objects
    const [cakes, setCakes] = useState<any[]>([]);

    // the topmost layer
    const [newLayer, setNewLayer] = useState<JSX.Element[]>([]);

    // selected ingredient
    const [selectedIngredient, setSelectedIngredient] = useState<PlacableIngredient[]>([]);

    const handleDrop = () => {
        if (selectedIngredient.length === 0) {
            // nothing is selected
            return;
        } else {
            // push the action to rune
            Rune.actions.placeIngredient({ ingredient: selectedIngredient[0] });
            // console.log(cakes)
            // const cakeCount = cakes.length
            // setCakes([...cakes, <Cake position={new Vector3(0, 1 + cakes.length * 0.5, 0)} texture={"eggs"} key={cakeCount} />]);
        }
    }

    useEffect(() => {
        // whenever the new layer changes, update the rendered cakes
        const gameStateLayerLength = game.newLayer.length;
        const currentLayerLength = newLayer.length;
        console.log(gameStateLayerLength + " vs " + currentLayerLength)
        // has something new been added?
        if (gameStateLayerLength > currentLayerLength) {
            // something new has been added
            // create more blocks in the new layer
            let additionalBlocks: JSX.Element[] = [];
            // TODO: instead, can we iterate through each and only spawn in new blocks?
            for (let i = currentLayerLength; i < gameStateLayerLength; i++) {
                // create more blocks
                console.log("new block added")
                additionalBlocks.push(
                    <Cake position={new Vector3(0, 1 + cakes.length * 0.5, 0)} texture={"eggs"} key={i} />
                )
            }
            // now add it into the state
            // TODO: will this create some sort of collision type of race condition?
            setNewLayer([...newLayer, ...additionalBlocks])
        } else if (gameStateLayerLength < currentLayerLength) {
            // I'm gonna assume that only top layers are removed
            if (gameStateLayerLength === 0) {
                // wipe it
                setNewLayer([]);
            } else {
                // slice it
                setNewLayer(newLayer.slice(0, gameStateLayerLength));
            }
        } else {
            // should be the same thing
        }
    }, [game.newLayer]);

    useEffect(() => {
        // handle putting new things into the cake
        // generally this happens when the goal happens
        // const totalLength = game.newLayer.length + game.cake.length;

        // we need to process any cake updates after a collision happened... rip
    }, [game.cake]);

    // add or remove the timer depending on the game state
    let gameTimerHTML;

    // for now, just show the layers as a bunch of text. This will be fixed later, when we are able to map cake layer types to actual three.js blocks
    let layers = "";

    for (const layer of game.cake) {
        layers += layer + ", ";
    }
    // now add in the new layer that is not finalized
    let newLayers = "";
    if (game.newLayer.length !== 0) {
        newLayers += "[";
        for (const layer of game.newLayer) {
            newLayers += layer + ", ";
        }
        newLayers += "]";
    }
    layers += newLayers;
    if (layers.length === 0) {
        layers = "empty cake!";
    }

    switch (game.phase) {
        case "tutorial":
            gameTimerHTML = <TutorialUI />;
            break;
        case "playing":
            gameTimerHTML = <PlayingUI game={game} selectedIngredient={selectedIngredient} setSelectedIngredient={setSelectedIngredient} />
            break;
        case "loss":
            // gameTimerHTML =
            //     <div className="time-left">
            //         Game Over
            //     </div>
            break;
    }

    return (
        <>
            {gameTimerHTML}
            <Canvas
                // camera={{ position: [1, 0, 1] }}
                onClick={handleDrop}>
                <Camera cakes={cakes} />
                <Suspense>
                    <Physics gravity={[0, -15, 0]} colliders="hull">
                        {...cakes}
                        {...newLayer}
                        <RigidBody type="fixed">
                            <Platform />
                        </RigidBody>
                        <ambientLight args={[0x000000]} />
                        <directionalLight position={[10, 10, 10]} />
                    </Physics>
                </Suspense>
            </Canvas>
        </>
    )
}