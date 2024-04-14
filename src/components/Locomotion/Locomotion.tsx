import { useXR } from '@react-three/xr'

type PropsDefinition = {
	playerRotation: number
}
export default function Locomotion({ playerRotation }: PropsDefinition) {
	const { player } = useXR()

	player.rotation.y = playerRotation

	return <>{/* Locomotion */}</>
}
