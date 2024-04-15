import { Mesh } from 'three'
import { getTeleportMeshes } from './HouseModel'
import { useEffect } from 'react'
import { useState } from 'react'

export default function TeleportSections() {
	const [sections, setSections] = useState<Mesh[]>([])

	useEffect(() => {
		setSections(getTeleportMeshes())
		console.log('teleport meshes: ', getTeleportMeshes())
	}, [])

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
				0,
			]}
		>
			{sections.map((section, index) => (
				<primitive
					key={index}
					object={section}
				/>
			))}
		</group>
	)
}
