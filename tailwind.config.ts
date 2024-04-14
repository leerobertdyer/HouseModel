import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-sans)', ...fontFamily.sans],
			},
			colors: {
				azureishWhite: '#dfe6f4',
				lightAbsoluteZero: '#b2cbe7',
				absoluteZero: '#0055b2',
				darkAbsoluteZero: '#002b59',
				oxfordBlue: '#001b47',
				richBlack: '#000428',
				richDarkGray: '#4d4f69',
				richLightGray: '#808193',
			},
		},
	},
	plugins: [],
} satisfies Config
