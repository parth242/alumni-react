import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";

export function useLoggedInFetch() {
	// authenticatedFetch adds a JWT provided by Shopify as Bearer token
	// backend can verify that this is a legitimate request from inside Shopify Admin
	// do not use on the public routes not inside Shopify Admin

	const app = useAppBridge();
	const fetchFunction = authenticatedFetch(app);

	return async (uri: RequestInfo, options?: RequestInit) => {
		const response = await fetchFunction(uri, options);

		if (
			response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
		) {
			const authUrlHeader = response.headers.get(
				"X-Shopify-API-Request-Failure-Reauthorize-Url",
			);

			const redirect = Redirect.create(app);
			redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
			return null;
		}

		return response;
	};
}
