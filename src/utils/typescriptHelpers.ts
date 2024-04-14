// coerce a value into being a particular type definition of your choice
export function coerceTypeDefinition<TypeDefinition>(value: unknown) {
	return value as TypeDefinition
}
