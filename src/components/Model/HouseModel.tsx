import {
	Mesh,
	Object3D,
	MeshBasicMaterial,
	MeshStandardMaterial,
	MeshPhysicalMaterial,
	MeshLambertMaterial,
	MeshPhongMaterial,
} from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/Addons.js'
import { useEffect } from 'react'
import { useState } from 'react'
import { house1TeleportMaterialNames } from './houseMaterialNames'

const nextTeleportMeshes: Mesh[] = []
const nextNonTeleportMeshes: Mesh[] = []

export default function HouseModel() {
	const [nonTeleportMeshes, setNonTeleportMeshes] = useState<Mesh[]>([])

	const { scene }: GLTF = useGLTF('./Models/house.glb') as GLTF
	useEffect(() => {
		const materialNames = house1TeleportMaterialNames
		scene.traverse((child: Object3D) => {
			if (child instanceof Mesh) {
				// console.log(child.material)
				if (
					child.material instanceof MeshStandardMaterial ||
					child.material instanceof MeshBasicMaterial ||
					child.material instanceof MeshPhysicalMaterial ||
					child.material instanceof MeshLambertMaterial ||
					child.material instanceof MeshPhongMaterial
				) {
					if (child.material.map) {
						// console.log(child.material.map.name)
						if (materialNames.includes(child.material.map.name)) {
							nextTeleportMeshes.push(child as Mesh)
						} else {
							nextNonTeleportMeshes.push(child as Mesh)
						}
					} else {
						nextNonTeleportMeshes.push(child as Mesh)
					}
				}
			}
		})

		setNonTeleportMeshes(nextNonTeleportMeshes)
	}, [scene])

	return (
		<group
			scale={0.03}
			position={[
				-20,
				-1.35,
				-10,
			]}
			rotation={[
				Math.PI * -0.5,
				0,
				// Math.PI * -2,
				0,
			]}
		>
			{/* <primitive object={scene} /> */}
			{nonTeleportMeshes.map((nonTeleportMesh, index) => (
				<primitive
					key={index}
					object={nonTeleportMesh}
					position={nonTeleportMesh.position}
					rotation={nonTeleportMesh.rotation}
					scale={nonTeleportMesh.scale}
				/>
			))}

			{/* {teleportMeshes.map((teleportMesh, index) => (
				<primitive
					key={index}
					object={teleportMesh}
					position={teleportMesh.position}
					rotation={teleportMesh.rotation}
					scale={teleportMesh.scale}
				/>
			))} */}
		</group>
	)
}
export const getTeleportMeshes = () => nextTeleportMeshes
