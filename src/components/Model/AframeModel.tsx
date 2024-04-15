
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/Addons.js'

export default function AframeModel() {

	const { scene }: GLTF = useGLTF('./Models/aframe.glb') as GLTF

    return (
        <primitive object={scene} scale={1} position={[0, -1.5, -18]} rotation={[0, Math.PI * .5, 0]}/>
    );

}
