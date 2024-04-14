// a custom utility type to manufacture a 'required' Class Variance Authority variant
export type MakeRequiredVariantDefinition<
	VariantDefinition extends string,
	AllVariantsDefinition extends Record<string, unknown>
> = {
	[Key in VariantDefinition]: NonNullable<AllVariantsDefinition[Key]>
}

// a custom utility type to manufacture an 'optional' Class Variance Authority variant
export type MakeOptionalVariantDefinition<
	VariantDefinition extends string,
	AllVariantsDefinition extends Record<string, unknown>
> = {
	[Key in VariantDefinition]?: AllVariantsDefinition[Key]
}
