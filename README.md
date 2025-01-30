## Getting started

Create an .env file with the following values:

```ini
VITE_BASE_URL=
VITE_AUTH_URL=
VITE_CAMPAIGNS_URL=
VITE_ANALYTICS_URL=
VITE_TEMPLATE_LINK_BASE_URL=
VITE_TEMPLATE_LINK_QUERY_URL=
VITE_360_PARTNER_URL=
VITE_360_MIGRATE_URL=
VITE_MIXPANEL_ENABLED=
```

## Important message

This project uses `vite` and `pnpm`.

Install pnpm using `npm install --global pnpm`, read more about the fast and disk efficient package manager here: https://pnpm.io/

When doing `pnpm i` to install dependencies, ignore the missing peers: `@babel/core`, `react-native-svg`, `@babel/plugin-syntax-flow`. The app builds fine without these dependencies, and they're meant for Babel/React Native/Flowtype users respectively.

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### `pnpm build`

Runs TypeScript's typechecker, then builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### `pnpm preview`

Serves the built app for preview. Run after `pnpm build`.

### `pnpm lint`

Lints the project using eslint and typescript-eslint, with the recommended rules from eslint-config-react-app.

### `pnpm pretty`

Runs prettier on the project and formats all code.

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev).

### Deployment

A netlify.toml is present in this repository, and is deployed to Netlify in two deployments - dev, from dev branch, and production, from master branch.
