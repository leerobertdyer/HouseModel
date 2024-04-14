import { useFrame } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { useState } from 'react'

type PropsDefinition = {
	onLeftStickFlickLeft?: () => void
	onLeftStickFlickRight?: () => void
	onRightStickFlickLeft?: () => void
	onRightStickFlickRight?: () => void
	onRightStickForward?: (active: boolean) => void
}

export default function VrControllers(props: PropsDefinition) {
	const {
		onLeftStickFlickLeft,
		onLeftStickFlickRight,
		onRightStickFlickLeft,
		onRightStickFlickRight,
		onRightStickForward,
	} = props

	const [leftStickActiveX, setLeftStickActiveX] = useState(true)
	const [rightStickActiveX, setRightStickActiveX] = useState(true)
	const { controllers } = useXR()

	function handleFlick(
		isStickActive: boolean,
		joystickAxisValue: number,
		onFlickLeft: () => void,
		onFlickRight: () => void,
		setStickActive: (active: boolean) => void
	): void {
		if (!isStickActive) {
			if (joystickAxisValue < -0.25) {
				onFlickLeft()
			} else if (joystickAxisValue > 0.25) {
				onFlickRight()
			}
		}
		setStickActive(joystickAxisValue !== 0)
	}

	function handleStickMove(
		stick: 'rightHand' | 'leftHand',
		axisDirection: 'horizontal' | 'vertical',
		joystickAxisValue: number
	): void {
		if (axisDirection === 'horizontal') {
			if (stick === 'rightHand' && onRightStickFlickLeft !== undefined && onRightStickFlickRight !== undefined) {
				handleFlick(
					rightStickActiveX,
					joystickAxisValue,
					onRightStickFlickLeft,
					onRightStickFlickRight,
					(active) => setRightStickActiveX(active)
				)
			} else if (
				stick === 'leftHand' &&
				onLeftStickFlickLeft !== undefined &&
				onLeftStickFlickRight !== undefined
			) {
				handleFlick(
					leftStickActiveX,
					joystickAxisValue,
					onLeftStickFlickLeft,
					onLeftStickFlickRight,
					(active) => setLeftStickActiveX(active)
				)
			}
		} else if (axisDirection === 'vertical') {
			if (stick === 'rightHand' && onRightStickForward !== undefined) {
				if (joystickAxisValue > 0.85) {
					onRightStickForward(true)
				}
			}
		}
	}

	useFrame(() => {
		controllers.forEach((controller) => {
			if (controller.inputSource !== null) {
				if (controller.inputSource.gamepad) {
					const joystick = controller.inputSource.gamepad.axes
					const joystickXAxisValue = joystick[2]
					const joystickYAxisValue = joystick[3] ? -joystick[3] : undefined // invert Y axis (forward is negative by default)
					const isLeftHand = controller.inputSource.handedness === 'left'
					const isRightHand = controller.inputSource.handedness === 'right'

					if (isLeftHand) {
						// horizontal
						if (joystickXAxisValue !== undefined) {
							handleStickMove('leftHand', 'horizontal', joystickXAxisValue)
						}
						// vertical
						if (joystickYAxisValue !== undefined) {
							handleStickMove('leftHand', 'vertical', joystickYAxisValue)
						}
					}

					if (isRightHand) {
						// horizontal
						if (joystickXAxisValue !== undefined) {
							handleStickMove('rightHand', 'horizontal', joystickXAxisValue)
						}
						// vertical
						if (joystickYAxisValue !== undefined) {
							handleStickMove('rightHand', 'vertical', joystickYAxisValue)
						} else if (!joystickYAxisValue && onRightStickForward !== undefined) {
							onRightStickForward(false)
						}
					}
				}
			}
		})
	})

	return <></>
}