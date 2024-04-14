import { Dispatch, SetStateAction } from 'react'
import { degToRad } from 'three/src/math/MathUtils.js'

const rotationSnapAngle = degToRad(60)

export type HandleFlicks = {
	playerRotation: number
	setPlayerRotation: Dispatch<SetStateAction<number>>
}

export const handleFlickLeft =
	({ playerRotation, setPlayerRotation }: HandleFlicks) =>
	() =>
		setPlayerRotation(playerRotation + rotationSnapAngle)

export const handleFlickRight =
	({ playerRotation, setPlayerRotation }: HandleFlicks) =>
	() =>
		setPlayerRotation(playerRotation - rotationSnapAngle)
