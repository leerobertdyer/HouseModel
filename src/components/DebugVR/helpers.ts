import { XRController } from '@react-three/xr'
import { Euler, Group, Object3DEventMap, Quaternion, Vector3 } from 'three'
import { Dispatch, RefObject, SetStateAction } from 'react'

export function showDebug(controllers: XRController[], setOpenPanel: Dispatch<SetStateAction<boolean>>) {
	controllers.forEach((controller) => {
		if (controller.inputSource?.handedness === 'left') {
			const rotationQuaternion = controller.grip.quaternion
			const euler = new Euler().setFromQuaternion(rotationQuaternion, 'YXZ')
			const rotationX = euler.x
			const rotatedEnough = rotationX > -1.7 && rotationX < -0.6
			setOpenPanel(rotatedEnough)
		}
	})
}

export function updateDebugPosition(
	groupRef: RefObject<Group<Object3DEventMap>>,
	controllers: XRController[],
	player: Group<Object3DEventMap>
) {
	if (groupRef.current !== null) {
		if (controllers.length > 1 && controllers[0] !== undefined) {
			// Get controller's current rotation
			const worldQuaternion = new Quaternion()
			controllers[0].grip.getWorldQuaternion(worldQuaternion)

			// Allow rotation and push debug panel closer to user
			const offset = new Vector3(-0.05, 0.04, 0.07)
			offset.applyQuaternion(worldQuaternion)

			// Transform the controller's grip position from local to world space
			const gripWorldPosition = controllers[0].grip.position.clone().applyMatrix4(player.matrixWorld)

			// Calculate the debug panel position in world space
			const debugPosition = gripWorldPosition.clone().add(offset)
			groupRef.current.position.set(debugPosition.x, debugPosition.y, debugPosition.z)
			groupRef.current.quaternion.copy(worldQuaternion)
		}
	}
}
