import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/Addons.js'

export default function CarModel() {
	const { scene }: GLTF = useGLTF('./Models/car.glb') as GLTF

	return (
		<group
			scale={0.8}
			position={[
				6.5,
				-2.05,
				-3,
			]}
			rotation={[
				0,
				Math.PI * -1.5,
				0,
			]}
		>
			<primitive object={scene} />
		</group>
	)
}
