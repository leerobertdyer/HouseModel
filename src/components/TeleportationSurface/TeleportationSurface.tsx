import { QuadraticBezierLine } from '@react-three/drei'
import { Interactive, XRController, XRInteractionEvent, useXR } from '@react-three/xr'
import { useEffect, useRef, useState } from 'react'
import { Group, Mesh, Vector3 } from 'three'

type PropsDefinition = Partial<JSX.IntrinsicElements['group']> & {
	teleportationDistance?: number
	rightStickForward?: boolean
	teleportBoundary?: number
}

type BeamCurveDefinition = {
	startPosition: Vector3
	endPosition: Vector3
}

const defaultBeamCurveDefinition: BeamCurveDefinition = {
	startPosition: new Vector3(0),
	endPosition: new Vector3(0),
}

const defaultTeleportationDistance = 10
const defaultTeleportationBoundary = 50
const playerHeight = 1

export default function TeleportationSurface({
	teleportationDistance = defaultTeleportationDistance,
	rightStickForward = false,
	teleportBoundary = defaultTeleportationBoundary,
	children,
}: PropsDefinition & { children: React.ReactNode }) {
	const [beamCurvePosition, setBeamCurvePosition] = useState(defaultBeamCurveDefinition)
	const [vrController, setVrController] = useState<XRController>()
	const [teleportationActive, setTeleportationActive] = useState(false)

	const beamCurveOffset = 0.01
	const markerRadius = 0.25

	useEffect(() => {
		if (teleportationActive && !rightStickForward && teleportRef.current !== undefined) {
			if (teleportCircleRef.current.visible) {
				if (
					Math.abs(teleportRef.current.x) < teleportBoundary &&
					Math.abs(teleportRef.current.z) < teleportBoundary
				) {
					console.log(teleportRef.current)

					teleport(teleportRef.current)
				}
			}
		}
		setTeleportationActive(rightStickForward)
	}, [rightStickForward])

	function handleTeleportMarkerVisibility(intersection: XRInteractionEvent['intersection']) {
		if (vrController !== undefined && intersection !== undefined) {
			const distanceFromController = intersection.point.distanceTo(
				player.position.clone().add(vrController.grip.position)
			)
			if (distanceFromController !== undefined && teleportCircleRef.current && teleportLineRef.current) {
				if (rightStickForward) {
					teleportCircleRef.current.visible = distanceFromController <= teleportationDistance
					teleportLineRef.current.visible = distanceFromController <= teleportationDistance
					if (teleportCircleRef.current.visible) {
						vrController.inputSource?.gamepad?.vibrationActuator
							?.playEffect('dual-rumble', {
								startDelay: 0,
								duration: 200,
								weakMagnitude: 1.0,
								strongMagnitude: 1.0,
							})
							.catch((e) => console.log(e))
					}
				} else {
					teleportLineRef.current.visible = false
					teleportCircleRef.current.visible = false
				}
			}
		}
	}

	function setTeleportIntersectionPoint(intersection: XRInteractionEvent['intersection']) {
		if (intersection !== undefined) {
			const adjustedPointForPlayerHeight = new Vector3(
				intersection.point.x,
				intersection.point.y + playerHeight,
				intersection.point.z
			)
			teleportRef.current = adjustedPointForPlayerHeight
			const adjustedTeleportCirclePosition = new Vector3(
				teleportRef.current.x,
				teleportRef.current.y + beamCurveOffset - playerHeight,
				teleportRef.current.z
			)
			teleportCircleRef.current.position.copy(adjustedTeleportCirclePosition)
		}
	}

	const teleportCircleRef = useRef<Mesh>(null!)
	const teleportLineRef = useRef<Group>(null)
	const teleportRef = useRef<Vector3>()

	const { player, controllers } = useXR()

	function teleport(target: Vector3) {
		player.position.set(target.x, target.y, target.z)
		console.log('player z ', target.z)
	}

	function handleOnMove(intersection: XRInteractionEvent['intersection'], handedness: XRHandedness | undefined) {
		if (handedness !== 'right' || intersection === undefined) return
		controllers.forEach((controller) => {
			//hide default laser:
			if (controller.children[0]) {
				controller.children[0].visible = false
			}
			if (controller.inputSource?.handedness === 'right') {
				setVrController(controller)
			}
		})

		if (vrController !== undefined) {
			// Calculate the transformed controller position
			const controllerPosition = vrController.grip.position.clone()
			controllerPosition.applyMatrix4(player.matrixWorld)

			// Set line position
			setBeamCurvePosition({
				startPosition: controllerPosition,
				endPosition: new Vector3(
					intersection.point.x,
					intersection.point.y - beamCurveOffset,
					intersection.point.z
				),
			})

			// Show or hide marker
			handleTeleportMarkerVisibility(intersection)

			//Set Teleportation intersection point
			setTeleportIntersectionPoint(intersection)
		}
	}

	return (
		<group>
			<mesh
				ref={teleportCircleRef}
				visible={false}
				rotation-x={-Math.PI / 2}
			>
				<circleGeometry args={[markerRadius, 32]} />
				<meshBasicMaterial color="orange" />
			</mesh>

			<group
				ref={teleportLineRef}
				visible={false}
			>
				{/* Beam Curve */}
				<QuadraticBezierLine
					start={beamCurvePosition.startPosition ? beamCurvePosition.startPosition : new Vector3(0)}
					end={beamCurvePosition.endPosition ? beamCurvePosition.endPosition : new Vector3(0)}
					linewidth={3}
					color={'blue'}
				/>
			</group>

			<Interactive
				onMove={(event: XRInteractionEvent) =>
					handleOnMove(event.intersection, event.target.inputSource?.handedness)
				}
				onBlur={() => {
					if (teleportLineRef.current && teleportCircleRef.current) {
						teleportCircleRef.current.visible = false
						teleportLineRef.current.visible = false
					}
				}}
			>
				{children}
			</Interactive>
		</group>
	)
}
