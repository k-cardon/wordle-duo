import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				yellow: {
					200: '#f6bd60',
				},
				pink: {
					100: '#f5cac3',
					200: '#f28482',
				},
				beige: {
					100: '#f7ede2',
				},
				green: {
					200: '#84a59d',
				},
				black: {
					300: '#414A4C',
				},
			},
		},
	},
	plugins: [],
};
export default config;
