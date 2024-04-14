import { Box, Text } from '@react-three/drei'
import { Interactive } from '@react-three/xr'
import { useEffect, useState } from 'react'
import { Vector3 } from 'three'
import { millimeters } from '~/utils/sizing'
import useCssVariable from '~/hooks/useCssVariable'
import {
	defaultVariants,
	variants,
	VariantsDefinition,
	VariantVariablesDefinition,
	VariantEmphasisDefinition,
	VariantStateDefinition,
} from './buttonVariants'
import { themeColors } from '~/utils/theme'
import { MakePropDefaults } from '~/types/propsHelpers'
import { isUsing3dProps } from '~/utils/dimensionality'

// define a 'base' set of props
type BasePropsDefinition = VariantsDefinition & {
	is3d: boolean
	fontSize?: number
	onClick: () => void
	onHover?: () => void
	onActive?: () => void
	onBlur?: () => void
	children: string
}

// DIMENSIONALITY PROPS
// define the props that are unique to '2d'
type Props2dDefinition = BasePropsDefinition & {
	is3d: false
	className?: string
	position?: never
	width?: never
	height?: never
	depth?: never
}
// define the props that are unique to '3d'
type Props3dDefinition = BasePropsDefinition & {
	is3d: true
	className?: never
	position?: Vector3
	width: number
	height: number
	depth: number
}
// define a union type that will correctly support either '2d' or '3d' props
type DimensionalityPropsDefinition = Props2dDefinition | Props3dDefinition

// define the type for all possible props (not taking into account default values for optional props)
type AllPropsDefinition = DimensionalityPropsDefinition

// define which optional props need to be given default values
type PropDefaultsDefinition = MakePropDefaults<AllPropsDefinition, 'fontSize' | 'emphasis' | 'isDisabled'>

export default function Button(allProps: AllPropsDefinition) {
	// define default values for optional props
	const propDefaults: PropDefaultsDefinition = {
		fontSize: allProps.fontSize ?? 20,
		emphasis: allProps.emphasis ?? defaultVariants.emphasis,
		isDisabled: allProps.isDisabled ?? defaultVariants.isDisabled,
	}

	// define the final props object
	const props = {
		...allProps,
		...propDefaults,
	}

	// CSS variant variables
	const variantVariables: VariantVariablesDefinition = {
		color: {
			background: {
				emphasis: {
					high: {
						default: useCssVariable('--button-backgroundColor-highEmphasis-default', themeColors.richBlack),
						hover: useCssVariable(
							'--button-backgroundColor-highEmphasis-hover',
							themeColors.darkAbsoluteZero
						),
						active: useCssVariable(
							'--button-backgroundColor-highEmphasis-active',
							themeColors.absoluteZero
						),
						disabled: useCssVariable(
							'--button-backgroundColor-highEmphasis-disabled',
							themeColors.richDarkGray
						),
					},
					low: {
						default: useCssVariable('--button-backgroundColor-lowEmphasis-default', 'transparent'),
						hover: useCssVariable('--button-backgroundColor-lowEmphasis-hover', themeColors.richLightGray),
						active: useCssVariable(
							'--button-backgroundColor-lowEmphasis-active',
							themeColors.lightAbsoluteZero
						),
						disabled: useCssVariable('--button-backgroundColor-lowEmphasis-disabled', 'transparent'),
					},
				},
			},
			text: {
				emphasis: {
					high: {
						default: useCssVariable('--button-textColor-highEmphasis-default', themeColors.azureishWhite),
						hover: useCssVariable('--button-textColor-highEmphasis-hover', themeColors.azureishWhite),
						active: useCssVariable('--button-textColor-highEmphasis-active', themeColors.azureishWhite),
						disabled: useCssVariable('--button-textColor-highEmphasis-disabled', themeColors.richLightGray),
					},
					low: {
						default: useCssVariable('--button-textColor-lowEmphasis-default', themeColors.richBlack),
						hover: useCssVariable('--button-textColor-lowEmphasis-hover', themeColors.darkAbsoluteZero),
						active: useCssVariable('--button-textColor-lowEmphasis-active', themeColors.absoluteZero),
						disabled: useCssVariable('--button-textColor-lowEmphasis-disabled', themeColors.richDarkGray),
					},
				},
			},
		},
		font: {
			// opt to get 'fontSize' from props in order to test how
			// prop-based CSS variable assignment should work (now that variants
			// are stored in a separate file from this one)
			size: useCssVariable('--button-fontSize', props.fontSize),
		},
	}

	// define 'variants' for each variant 'slot'
	const { background: backgroundSlotVariants, text: textSlotVariants } = variants({
		emphasis: props.emphasis,
		isDisabled: props.isDisabled,
	})

	// define color states
	const [backgroundColor, setbackgroundColor] = useState(
		variantVariables.color.background.emphasis[props.emphasis].default
	)
	const [textColor, setTextColor] = useState(variantVariables.color.text.emphasis[props.emphasis].default)

	// when the state of 'isDisabled' changes, update the 'text' and 'background' colors accordingly
	useEffect(() => {
		// if the button is disabled, set the background and text colors to their 'disabled' variants
		if (props.isDisabled) {
			updateColors(props.emphasis, 'disabled')
		}
		// if the button is not disabled, set the background and text colors to their 'default' variants
		else {
			updateColors(props.emphasis, 'default')
		}
	}, [props.isDisabled])

	// set the 'background' and 'text' colors based on the variant values
	function updateColors(emphasis: VariantEmphasisDefinition, state: VariantStateDefinition) {
		setbackgroundColor(variantVariables.color.background.emphasis[emphasis][state])
		setTextColor(variantVariables.color.text.emphasis[emphasis][state])
	}

	// handle the 'click' (pressed) state
	function handleOnClick() {
		// only allow the button to be clicked if it's not disabled
		if (!props.isDisabled) {
			updateColors(props.emphasis, 'default')

			// call the 'onClick()' prop function
			props.onClick()
		}
	}

	// handle the 'hover' state
	function handleOnHover() {
		// only allow the button to be hovered if it's not disabled
		if (!props.isDisabled) {
			updateColors(props.emphasis, 'hover')

			// if there's a 'onHover' prop function, call it
			if (props.onHover !== undefined) {
				props.onHover()
			}
		}
	}

	// handle the 'active' (actively being pressed) state
	function handleOnActive() {
		// only allow the button to be active if it's not disabled
		if (!props.isDisabled) {
			updateColors(props.emphasis, 'active')

			// if there's a 'onActive' prop function, call it
			if (props.onActive !== undefined) {
				props.onActive()
			}
		}
	}

	// handle the 'onBlur' event
	function handleOnBlur() {
		// only allow the button to be blurred if it's not disabled
		if (!props.isDisabled) {
			updateColors(props.emphasis, 'default')

			// if there's a 'onHover' prop function, call it
			if (props.onBlur !== undefined) {
				props.onBlur()
			}
		}
	}

	function _2d() {
		// if the prop structure is '3d' instead of '2d', bail
		if (isUsing3dProps<DimensionalityPropsDefinition, Props3dDefinition>(props)) {
			return null
		}

		return (
			<button
				// apply styles from the 'background' slot variants,
				// as well as any 'classNames' passed in via the 'props'
				className={`
					${backgroundSlotVariants()}
					${props.className}
				`}
				disabled={props.isDisabled}
				onClick={() => handleOnClick()}
			>
				<span className={textSlotVariants()}>{props.children}</span>
			</button>
		)
	}

	function _3d() {
		// if the prop structure is '2d' instead of '3d', bail
		if (!isUsing3dProps<DimensionalityPropsDefinition, Props3dDefinition>(props)) {
			return null
		}

		// set a 'depth' for the text to make it appear in front of the background
		const textDepthOffset = millimeters(2)
		const textDepth = props.depth * 0.5 + textDepthOffset

		return (
			<>
				<group position={props.position}>
					<Interactive
						onSelectStart={() => handleOnActive()}
						onSelectEnd={() => handleOnClick()}
						onHover={() => handleOnHover()}
						onBlur={() => handleOnBlur()}
					>
						{/* start button background */}
						<Box
							args={[
								props.width,
								props.height,
								props.depth,
							]}
						>
							<meshBasicMaterial
								color={backgroundColor}
								// enable or disable the capacity for transparency
								transparent={backgroundColor === 'transparent'}
								// actually set the transparency amount
								opacity={backgroundColor === 'transparent' ? 0 : 1}
							/>

							{/* start button text */}
							<Text
								color={textColor}
								fontSize={millimeters(props.fontSize)}
								anchorX="center"
								anchorY="middle"
								position={new Vector3(0, 0, textDepth)}
							>
								{props.children}
							</Text>
							{/* end button text */}
						</Box>
						{/* end button background */}
					</Interactive>
				</group>
			</>
		)
	}

	return <>{props.is3d ? _3d() : _2d()}</>
}
