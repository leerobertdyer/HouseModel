'use client'
import { Loader, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Controllers, XR, startSession, stopSession } from '@react-three/xr'
import { Suspense, useEffect, useState } from 'react'
import { Euler, Vector3 } from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'
import Button from '~/components/Button/Button'
import Floor from '~/components/Floor/Floor'
import Skybox from '~/components/Skybox/Skybox'
import VrControllers from '~/components/VrControllers/VrControllers'
import TeleportationSurface from '~/components/TeleportationSurface/TeleportationSurface'
import Locomotion from '~/components/Locomotion/Locomotion'
import DebugVR from '~/components/DebugVR/DebugVR'
import { handleFlickLeft, handleFlickRight } from '~/utils/inputHandlers'
import HouseModel from '~/components/Model/HouseModel'
import TeleportSections from '~/components/Model/TeleportSections'
import CarModel from '~/components/Model/CarModel'

export default function RootPage() {
	// the distance between the middlepoint of the glovebox workstation and the floor
	const floorPositionYOffset = 0.925
	const [isInitialLoad, setIsInitialLoad] = useState(true)
	const [isImmersed, setIsImmersed] = useState(false)
	const [isLoadingImmersive, setIsLoadingImmersive] = useState(false)
	const [isXrSupported, setIsXrSupported] = useState(false)
	const [playerRotation, setPlayerRotation] = useState(0)
	const [rightStickForward, setRightstickForward] = useState(false)
	const xrSessionInit: XRSessionInit = {
		requiredFeatures: ['local-floor'],
	}

	// on first load, check if WebXR is supported on this browser
	useEffect(() => {
		checkXrSessionSupport()
	}, [])

	// when 'isImmersed' is changed, either enter or exit immersion
	useEffect(() => {
		// if this is the initial load, don't enter or exit immersion
		if (isInitialLoad) {
			setIsInitialLoad(false)
		}
		// if this is not the initial load, proceed with entering or exiting immersion
		else {
			// if 'isImmersed' has just become true, then we need to enter immersion
			if (isImmersed) {
				enterImmersion().catch((error) => {
					console.error(error)
					throw new Error('Error while entering immersion!')
				})
			}
			// if 'isImmersed' has just become false, then we need to exit immersion
			else {
				exitImmersion().catch((error) => {
					console.error(error)
					throw new Error('Error while exiting immersion!')
				})
			}
		}
	}, [isImmersed])

	// see if this browser supports WebXR
	function checkXrSessionSupport() {
		if ('xr' in navigator) {
			navigator.xr
				?.isSessionSupported('immersive-vr')
				.then((supported) => {
					if (!supported) {
						console.warn('WebXR is not supported on this browser')
					} else {
						console.info('WebXR is supported on this browser')
					}
					setIsXrSupported(supported)
				})
				.catch((error) => {
					console.error('Error while checking for WebXR support on this browser', error)
					setIsXrSupported(false)
				})
		}
	}

	// event handler for clicking the 'Enter VR' button
	function handleEnterVrClicked() {
		// only allow entry into 'immersive' if WebXR is supported
		// and if we're not loading into 'immersive' already
		if (isXrSupported && !isLoadingImmersive) {
			setIsImmersed(true)
		}
	}

	// event handler for clicking the virtual 'Exit VR' button
	function handleExitVrClicked() {
		setIsImmersed(false)
	}

	// event handler for when the user exits immersion some other way
	// (e.g. by pressing the 'menu' button on the motion controller)
	function handleOnSessionEnd() {
		setIsImmersed(false)
	}

	// start the WebXR session
	async function enterImmersion() {
		// turn on the loading state that's specifically about loading into 'immersive'
		setIsLoadingImmersive(true)
		// attempt to establish a WebXR session
		const xrSession = await startSession('immersive-vr', xrSessionInit)
		try {
			// if the xrSession was established successfully
			if (xrSession !== undefined) {
				// turn off the loading state that's specifically about loading into 'immersive'
				setIsLoadingImmersive(false)
			}
		} catch (error) {
			// if the xrSession failed to be established, handle errors
			console.error('error entering immersion', error)
			throw new Error('error entering immersion, see console for info')
		}
	}

	// end the WebXR session
	async function exitImmersion() {
		try {
			await stopSession()
		} catch (error) {
			console.error('error exiting immersion', error)
			throw new Error('error exiting immersion, see console for info')
		}
	}

	return (
		<div
			className={`
				relative
				h-screen
				w-full
			`}
		>
			{/* start 3D scene */}
			<Canvas
				className={`
						h-full
						w-full
						cursor-grab
						bg-black
					`}
			>
				<XR onSessionEnd={() => handleOnSessionEnd()}>
					{/* create a default camera for the OrbitControls to leverage */}
					<PerspectiveCamera
						// force a specific position and rotation to prevent undesirable
						// changes to camera orientation after exiting immersion
						position={new Vector3(0, 1, 2)}
						rotation={new Euler(0, 0, 0)}
						// the field of view (fov) must be set to 100, otherwise the 'fov' seen before
						// entering immersion will look different than the 'fov' seen after exiting immersion
						fov={100}
						aspect={1}
						makeDefault
					/>
					<OrbitControls
						enablePan={false}
						// set the min and max polar angle (vertical height) for the camera
						minPolarAngle={degToRad(0)}
						maxPolarAngle={degToRad(90)}
						// set the min and max zoom distances for the camera
						minDistance={1}
						maxDistance={3}
					/>
					<VrControllers
						onLeftStickFlickLeft={handleFlickLeft({ playerRotation, setPlayerRotation })}
						onLeftStickFlickRight={handleFlickRight({ playerRotation, setPlayerRotation })}
						onRightStickForward={(forward) => setRightstickForward(forward)}
					/>
					<Locomotion playerRotation={playerRotation} />
					<Controllers />
					<ambientLight intensity={2} />

					<Suspense fallback={null}>
						<CarModel />
					</Suspense>

					<Suspense fallback={null}>
						<HouseModel />
					</Suspense>

					<group>
						<Skybox positionYOffset={floorPositionYOffset} />
						<TeleportationSurface rightStickForward={rightStickForward}>
							<TeleportSections />
							<Floor positionYOffset={floorPositionYOffset} />
						</TeleportationSurface>
					</group>
					{/* end 3D space */}

					{/* start 3D user interface */}
					{isImmersed ? (
						<>
							{/* start wrist UI menu */}
							<DebugVR
								isXrSupported={isXrSupported}
								isLoadingImmersive={isLoadingImmersive}
								handleExitVrClicked={handleExitVrClicked}
							/>
							{/* end wrist UI menu */}
						</>
					) : null}

					{/* end 3D user interface */}
				</XR>
			</Canvas>
			{/* end 3D scene */}

			{/* start 2D user interface */}
			<>
				{/* start 'Enter VR' button */}
				<Button
					is3d={false}
					className={`
						fixed
						bottom-4
						left-4
						right-4
						sm:right-auto
					`}
					onClick={() => handleEnterVrClicked()}
					isDisabled={!isXrSupported || isLoadingImmersive}
				>
					{!isXrSupported ? 'VR Not Available' : isLoadingImmersive ? 'Loading...' : 'Enter VR'}
				</Button>
				{/* end 'Enter VR' button */}
			</>
			{/* end 2D user interface */}
		</div>
	)
}
