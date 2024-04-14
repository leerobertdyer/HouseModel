import { useEffect } from 'react'

// enforce a naming convention for CSS variables that requires
// the name of the relevant 'component' for the first 'string',
// and the name of the relevant 'states' for the second 'string'
// NOTE: dashes must be used instead of underscores because
// Tailwind's compiler will interpret underscores as spaces,
// breaking any CSS variables that are written with underscores
type ComponentDefinition = string
type VariantsDefinition = string
type CssVariableNameDefinition = `--${ComponentDefinition}-${VariantsDefinition}`

// force the 'useCssVariable()' hook to only return a 'string' or 'number'
export type CssVariableValueDefinition = string | number

// set a CSS variable and optionally access it in JavaScript using a 'const'
// example usage with accessor (for when you need a JS-friendly 'const' value):
//     const defaultColor = useCssVariable('--component--default-color', '#000000')
// example usage without accessor (for when you already have a JS-friendly version of the value, such as a 'prop'):
//     useCssVariable('--component--default-font-size', props.fontSize)
// example usage in 'className()' (or anywhere else that Tailwind classes are accepted):
//     className={`bg-[color:var(--component-slotName-affectedStyle-state)]`}
// example usage with numerical values that need to be translated to 'px' units (or another absolute unit type):
//     className={`w-[length:calc(var(--component-slotName-affectedStyle-state)*1px)]`}
export default function useCssVariable<ValueTypeDefinition extends CssVariableValueDefinition>(
	key: CssVariableNameDefinition,
	value: ValueTypeDefinition
): CssVariableValueDefinition {
	useEffect(() => {
		// create a variable to hold the eventual 'string' version of whatever our CSS variable's value is
		let stringifiedValue: string
		// if the value is a 'number', convert it to a 'string' so that it can be used as a valid CSS variable
		if (typeof value === 'number') {
			stringifiedValue = value.toString()
		}
		// if the value is a 'string', use it as is
		else {
			stringifiedValue = value
		}
		// set the CSS variable using the "stringified" version of the 'value'
		document.documentElement.style.setProperty(key, stringifiedValue)
	}, [key, value])

	return value
}
