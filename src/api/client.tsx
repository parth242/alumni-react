import ky from "ky";
import toast from "react-hot-toast";

const authClient = ky.extend({
	prefixUrl: import.meta.env.VITE_AUTH_URL,
	hooks: {
		afterResponse: [
			async (request, options, response: any) => {
				const error1 = await response.text();
				if (
					request.url.split("/").pop() != "login" &&
					(response.status === 401 ||
						(response.status === 403 && JSON.parse(error1).force_relogin))
				) {
					localStorage.removeItem("user");
					// window.location.href = "/login";
				}
			},
		],
	},
	timeout: 120000,
	credentials: "include",
});

const isJSON = (data: any) => {
	try {
		JSON.parse(data);
		return true;
	} catch (e) {
		return false;
	}
};
const apiClient = ky.extend({
	prefixUrl: import.meta.env.VITE_BASE_URL,
	credentials: "include",
	hooks: {
		beforeRequest: [
			async (request, data) => {
				const url = new URL(request.url);
				// url.searchParams.set("customer_id", window.globalCustID!);
				if (isJSON(data.body)) {
					data.headers = new Headers({
						"Content-Type": "application/json",
						"Content-Length": JSON.stringify(data.body).length,
					});
				}
				return new Request(url, data);
			},
		],
		afterResponse: [
			async (request, options, response) => {
				if (response.status === 401) {
					localStorage.removeItem("user");
					// window.location.href = "/login";
				}

				const body = await response.json();
				if (response.status === 403 && !response?.url?.includes("/chatwoot?")) {
					toast.error(
						t => (
							<div
								className={`${t.visible ? "animate-enter" : "animate-leave"}`}>
								<div className="grid auto-cols-max grid-cols-12">
									<span className="col-span-11">
										{`Error: ` + body?.detail
											? body?.detail
											: "You don't have access to this resource"}
									</span>
								</div>
							</div>
						),
						{
							id: "generic_403_toast",
							duration: 2000,
							position: "top-right",
							className: "dark:bg-dark3 dark:text-darkPrimary",
						},
					);
				}
			},
		],
	},
	timeout: 180000,
});

export { authClient, apiClient };
