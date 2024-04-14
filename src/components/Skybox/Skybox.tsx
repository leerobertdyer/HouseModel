import { GradientTexture, Sphere } from '@react-three/drei'
import { BackSide, SphereGeometry, Vector3 } from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'
import { themeColors } from '~/utils/theme'

type PropsDefinition = {
	positionYOffset: number
}
type SphereArgsDefinition = SphereGeometry['parameters']

export default function Skybox(props: PropsDefinition) {
	const sphereArgs: SphereArgsDefinition = {
		radius: 50,
		widthSegments: 16,
		heightSegments: 8,
		phiStart: 0,
		phiLength: degToRad(360),
		thetaStart: 0,
		thetaLength: degToRad(90),
	}

	return (
		<>
			<Sphere
				args={[
					sphereArgs.radius,
					sphereArgs.widthSegments,
					sphereArgs.heightSegments,
					sphereArgs.phiStart,
					sphereArgs.phiLength,
					sphereArgs.thetaStart,
					sphereArgs.thetaLength,
				]}
				position={new Vector3(0, props.positionYOffset * -1, 0)}
			>
				<meshBasicMaterial
					side={BackSide}
					// wireframe
				>
					<GradientTexture
						stops={[0, 1]}
						colors={[themeColors.absoluteZero, themeColors.azureishWhite]}
					/>
				</meshBasicMaterial>
			</Sphere>
		</>
	)
}
