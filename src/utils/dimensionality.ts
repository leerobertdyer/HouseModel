// create a 'base' type that is agnostic to whether the props' 'dimensionality' is 2D or 3D
export type BaseDimensionalityPropsDefinition = {
	is3d: boolean
}
// create an opinionated type that is specifically used to identify props whose dimensionality is 3D
export type BaseProps3dDefinition = {
	is3d: true
}

// create a 'type guard' to determine if the prop structure is 2D or 3D
export function isUsing3dProps<
	PropsDefinition extends BaseDimensionalityPropsDefinition,
	Props3dDefinition extends PropsDefinition & BaseProps3dDefinition
>(props: PropsDefinition): props is Props3dDefinition {
	return props.is3d
}
