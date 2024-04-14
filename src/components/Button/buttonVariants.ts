import { VariantProps, tv } from 'tailwind-variants'
import { MakeOptionalVariantDefinition } from '~/types/variants'
import { coerceTypeDefinition } from '../../utils/typescriptHelpers'
import { CssVariableValueDefinition } from '~/hooks/useCssVariable'

type AllVariantsDefinition = VariantProps<typeof variants>
type EmphasisDefinition = MakeOptionalVariantDefinition<'emphasis', AllVariantsDefinition>
type isDisabledDefinition = MakeOptionalVariantDefinition<'isDisabled', AllVariantsDefinition>
export type VariantsDefinition = EmphasisDefinition & isDisabledDefinition

export type VariantSlotDefinition = keyof typeof variants.slots
export type VariantEmphasisDefinition = keyof typeof variants.variants.emphasis
export type VariantStateDefinition = 'default' | 'hover' | 'active' | 'disabled'
export type VariantVariablesDefinition = {
	color: {
		[SlotKeyDefinition in VariantSlotDefinition]: {
			emphasis: {
				[EmphasisKeyDefinition in VariantEmphasisDefinition]: {
					[StateKeyDefinition in VariantStateDefinition]: CssVariableValueDefinition
				}
			}
		}
	}
	font: {
		size: CssVariableValueDefinition
	}
}

export const variants = tv({
	slots: {
		// the 'background' is the content behind the 'text'
		background: `
			min-w-16
			px-4
			py-2
		`,
		// the 'text' is one of the two possible child types for the button
		text: `
			text-[length:calc(var(--button-fontSize)*1px)]
		`,
	},
	variants: {
		emphasis: {
			high: {
				background: ``,
				text: ``,
			},
			low: {
				background: ``,
				text: ``,
			},
		},
		isDisabled: {
			true: {
				background: `
					disabled:cursor-auto
				`,
				text: `
					disabled:cursor-auto
				`,
			},
			false: {
				background: `
					cursor-pointer
				`,
				text: `
					cursor-pointer
				`,
			},
		},
	},
	compoundVariants: [
		// high emphasis, enabled
		{
			emphasis: 'high',
			isDisabled: false,
			className: {
				background: `
					bg-[color:var(--button-backgroundColor-highEmphasis-default)]
					hover:bg-[color:var(--button-backgroundColor-highEmphasis-hover)]
					active:bg-[color:var(--button-backgroundColor-highEmphasis-active)]
				`,
				text: `
					text-[color:var(--button-textColor-highEmphasis-default)]
					hover:text-[color:var(--button-textColor-highEmphasis-hover)]
					active:text-[color:var(--button-textColor-highEmphasis-active)]
				`,
			},
		},
		// high emphasis, disabled
		{
			emphasis: 'high',
			isDisabled: true,
			className: {
				background: `
					disabled:bg-[color:var(--button-backgroundColor-highEmphasis-disabled)]
				`,
				text: `
					disabled:text-[color:var(--button-textColor-highEmphasis-disabled)]
				`,
			},
		},
		// low emphasis, enabled
		{
			emphasis: 'low',
			isDisabled: false,
			className: {
				background: `
					bg-[color:var(--button-backgroundColor-lowEmphasis-default)]
					hover:bg-[color:var(--button-backgroundColor-lowEmphasis-hover)]
					active:bg-[color:var(--button-backgroundColor-lowEmphasis-active)]
				`,
				text: `
					text-[color:var(--button-textColor-lowEmphasis-default)]
					hover:text-[color:var(--button-textColor-lowEmphasis-hover)]
					active:text-[color:var(--button-textColor-lowEmphasis-active)]
				`,
			},
		},
		// low emphasis, disabled
		{
			emphasis: 'low',
			isDisabled: true,
			className: {
				background: `
					disabled:bg-[color:var(--button-backgroundColor-lowEmphasis-disabled)]
				`,
				text: `
					disabled:text-[color:var(--button-textColor-lowEmphasis-disabled)]
				`,
			},
		},
	],
	defaultVariants: {
		emphasis: 'high',
		isDisabled: false,
	},
})

export const defaultVariants = coerceTypeDefinition<Required<VariantsDefinition>>(variants.defaultVariants)
