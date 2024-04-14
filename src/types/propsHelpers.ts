// a custom utility type to help define which optional (non-required) props should have default values
export type MakePropDefaults<PropsDefinition, DefaultPropsDefinition extends keyof PropsDefinition> = Required<
	Pick<PropsDefinition, DefaultPropsDefinition>
>
