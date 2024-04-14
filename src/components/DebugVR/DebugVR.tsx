import { useFrame } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { useRef, useState } from 'react'
import { DoubleSide, Group } from 'three'
import { showDebug, updateDebugPosition } from './helpers'
import Button from '~/components/Button/Button'
import { millimeters } from '../../utils/sizing'

type PropsDefinition = {
	isXrSupported: boolean
	isLoadingImmersive: boolean
	handleExitVrClicked: () => void
}

export default function DebugVR(props: PropsDefinition) {
	const { isXrSupported, isLoadingImmersive, handleExitVrClicked } = props

	const [openPanel, setOpenPanel] = useState(true)

	const { player, controllers } = useXR()

	const groupRef = useRef<Group>(null)

	useFrame(() => {
		showDebug(controllers, setOpenPanel)
		updateDebugPosition(groupRef, controllers, player)
	})

	return (
		<group
			ref={groupRef}
			visible={openPanel}
		>
			<group
				rotation={[
					-1,
					-1,
					3,
				]}
			>
				<mesh scale={0.1}>
					<circleGeometry />
					<meshBasicMaterial
						transparent
						opacity={0.8}
						side={DoubleSide}
						color={'#5000aa'}
					/>
				</mesh>
				<Button
					is3d={true}
					fontSize={20}
					onClick={() => handleExitVrClicked()}
					isDisabled={!isXrSupported || isLoadingImmersive}
					position={player.getWorldPosition(player.position)}
					width={millimeters(100)}
					height={millimeters(50)}
					depth={millimeters(10)}
				>
					Exit VR
				</Button>
			</group>
		</group>
	)
}
