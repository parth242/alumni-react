import "tailwindcss/tailwind.css";
import { createRoot } from "react-dom/client";
import createRoutes from "routes";
import "./main.css";

declare global {
	interface Window {
		globalCustID?: string | null;
	}
	interface Request {
		duplex: string;
	}
}

// Extract the query param from the URL
const params = new URLSearchParams(window.location.search);
const queryParamValue = params.get("store");
// If query param is present, add it to local storage and remove it from the URL
if (queryParamValue) {
	localStorage.setItem("shopifyStoreURL", queryParamValue);
}

let container: HTMLDivElement;
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-var
window.globalCustID = "";
const routes = createRoutes();
document.addEventListener("DOMContentLoaded", function () {
	if (!container) {
		container = document.getElementById("root") as HTMLDivElement;
		const root = createRoot(container);
		root.render(routes);
	}
});
