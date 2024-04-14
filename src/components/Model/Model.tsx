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

const nextTeleportMeshes: Mesh[] = []
const nextNonTeleportMeshes: Mesh[] = []

export default function HouseModel() {
	const [nonTeleportMeshes, setNonTeleportMeshes] = useState<Mesh[]>([])

	const { scene }: GLTF = useGLTF('./House/House.glb') as GLTF
	useEffect(() => {
		if (!scene?.children?.[0]?.children[0]?.children) return
		const materialNames = [
			// 'Reconstituted_Stone_baseColor',
			// 'Industrial_Brick_Flemish_baseColor',
			// 'Brushed_Dark_Steel_baseColor',
			// 'Corrugated_Dark_Matte_Powder_Coated_Metal_baseColor',
			// 'Charred_Timber_baseColor',
			// 'Charred_Timber_2_baseColor',
			// 'White_Painted_Stone_Tall_Deep_Blue_baseColor',
			// 'White_Painted_Stone_Tall_baseColor',
			// 'Terrazzo-Diamond_baseColor',
			// 'Calacatta_Marble_baseColor',
			// 'Calacatta_Marble_13_baseColor',
			// 'Inverna_Terrazzo_baseColor',
			// 'Polished_Concrete_Old_baseColor',
			// 'Concrete_Stack_baseColor',
			// 'Brushed_Dark_Steel_1_baseColor',
			// 'Reconstituted-Stone-Stack-Victorian-01_baseColor',
			// 'Polished_Concrete_Old_12_baseColor',
			// 'Art_Deco_Tile_06b_baseColor',
			// 'Art_Deco_Mosaic_baseColor',
			'sehpa_mermer__marble_baseColor',
			'Concrete_Stack_baseColor',
			'Concrete_Stack',
			'148_dark_parquet_flooring_texture-seamless_baseColor',
			'148_dark_parquet_flooring_texture-seamless_0_baseColor',
			'Grass_baseColor',
			'Brick2_baseColor',
			'Persian_Rug_blue_baseColor',
			'30_grey_carpeting_texture-seamless_baseColor',
			'Camel___Ivory_Rug_-_Nina_Takesh_Marion_baseColor',
			'Pale_lancelot_oak_PBR_baseColor',
			'Douglas_Fir_Staggered_baseColor',
			'Western_Red_Cedar_Stack_baseColor',
			'Cedar_PBR_baseColor',
		]
		scene.children[0]?.children[0]?.children.forEach((child: Object3D) => {
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
