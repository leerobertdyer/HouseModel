import { Grid, Plane } from '@react-three/drei'
import { Euler, Vector3 } from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'
import { themeColors } from '~/utils/theme'

type PropsDefinition = {
	positionYOffset: number
}

export default function Floor(props: PropsDefinition) {
	const floorWidth = 100
	const floorHeight = 100
	const floorColor = themeColors.richDarkGray
	const gridColor = themeColors.richLightGray

	return (
		<>
			<group
				position={[
					0,
					props.positionYOffset * -1,
					0,
				]}
			>
				<Plane
					args={[floorWidth, floorHeight]}
					rotation={new Euler(degToRad(-90), 0, 0)}
					receiveShadow
				>
					<meshBasicMaterial color={floorColor} />
				</Plane>
				<Grid
					position={new Vector3(0, 0.001, 0)}
					infiniteGrid
					cellSize={0.5}
					cellThickness={1}
					cellColor={gridColor}
					sectionSize={4}
					sectionThickness={1}
					sectionColor={gridColor}
					fadeDistance={50}
					fadeStrength={4}
				/>
			</group>
		</>
	)
}
