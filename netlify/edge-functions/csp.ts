import type { Context } from "https://edge.netlify.com";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request: Request, context: Context) => {
	const response = await context.next();
	console.log("response", response);
	const { searchParams } = new URL(request.url);
	const shop = searchParams.get("shop") || "";
	console.log("shop", shop);
	console.log(
		"shop.match",
		shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/) !== null,
	);
	if (
		shop !== null &&
		shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/) !== null
	) {
		response.headers.set(
			"Content-Security-Policy",
			`frame-ancestors https://${shop} https://admin.shopify.com`,
		);
	}
	return response;
};
