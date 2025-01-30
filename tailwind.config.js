/** @type {import('tailwindcss').Config} */

module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/react-tailwindcss-select/dist/index.esm.js",
		"node_modules/flowbite-react/lib/esm/**/*.js",
	],
	darkMode: "class",
	theme: {
		extend: {
			transitionProperty: {
				height: "height",
			},
			colors: {
				"custom-purple": "#440178",
				"text": {
					DEFAULT: "#111827",
					dark: "#111827",
				},
				"textSecondary": {
					DEFAULT: "#808080",
					dark: "#808080",
				},
				"border": {
					DEFAULT: "#E0E7FE",
					dark: "#E0E7FE",
				},
				"primary": "#E95D57",
				"secondary": "#FFBBB8",
				"tertiary": "#FFC581",
				"cyanblue": "#F9FAFB",
				"chineseblack": "#121212",
				"salmon": "#FF736D",
				// dark1: "#1C1F25",
				// dark2: "#1F2129",
				// dark3: "#2D2D30",
				// darkPrimary: "#95a3b8",
				// darkSecondary: "#626F83",
				"dark1": "#28292C", // foreground
				"dark2": "#1F2023", // background
				"dark3": "#323337", // border color (opacity: 10%, stroke width: 0.75)
				"darkPrimary": "#F3F4F6", // primary text color
				"darkSecondary": "#D1D5DB", // secondary text color
			},
			keyframes: {
				jump: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-20px)" }, // Controls the jump height
				},
				fadeIn: {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				fadeUp: {
					"0%": { transform: "translateY(1rem)" },
					"100%": { transform: "translateY(0rem)" },
				},
			},
			animation: {
				bounce200: "bounce 1s infinite 200ms",
				bounce400: "bounce 1s infinite 400ms",
				fade: "fadeIn ease 1s, fadeUp ease .5s",
				jump: "jump 1s ease-in-out",
			},
			boxShadow: {
				"3xl": "0 35px 60px -15px rgba(0, 0, 0, 1)",
				"nav": "0px 4px 16px rgba(209, 213, 219, 0.3)",
			},
		},
	},
	plugins: [
		// require("@tailwindcss/forms"),
		// require("@tailwindcss/line-clamp"),
		// require("@tailwindcss/aspect-ratio"),
		require("flowbite/plugin"),
	],
};
