import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "components/layout/navbar";
import { useAppState } from "utils/useAppState";
import { useEffect } from "react";
import {
	ErrorToastMessage,
	getMyDetails,
} from "api/services/user";
import { CustomerType, IUser, WabaStatus } from "utils/datatypes";
import { NIL } from "uuid";
import { useMutation } from "react-query";
import { HTTPError } from "ky";
import Icon from "utils/icon";
import DowntimeBanner from "components/ui/common/DowntimeBanner";

function AppSite() {
	const [
		{
			user,
			showSidebar,
			
		},
		setAppState,
	] = useAppState();

	/* const { data: customerStatus, refetch: fetchCustomerStatus } =
		useCustomerWabaStatus({
			enabled: !!selectedCustomer && user?.role !== "billing_admin",
			customer_id: selectedCustomer,
		}) || [];
	useEffect(() => {
		setAppState({
			wabaActivationStatus: customerStatus?.status,
		});
	}, [customerStatus]);
	useEffect(() => {
		if (selectedCustomer) {
			if (
				user?.role !== "agent_admin" &&
				user?.role !== "agent" &&
				user?.role !== "billing_admin"
			) {
				fetchCustomerStatus();
				getIntegration();
			}
		}
	}, [selectedCustomer]);
	const navigate = useNavigate();

	const getDowntimeStatus = async () => {
		try {
			const response = await fetch(
				import.meta.env.VITE_DOWNTIME_STATUS_URL +
					"downtime/platform_status.json",
				{
					method: "GET",
				},
			);
			if (response.status == 200) {
				const data = await response.json();
				setAppState({ downtimeStatus: data });
			}
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getDowntimeStatus();
	}, []);

	useEffect(() => {
		if (pageName != "admincms" && user?.role == "billing_admin") {
			navigate("/admin/admincms");
		} else if (pageName == "access_disabled") {
			console.log("pageName", pageName);
		} else if (user?.role != "agent_admin") {
			if (
				(pageName == "admincms" && user?.role !== "admin") ||
				(pageName == "flow" && user?.role !== "admin") ||
				(pageName == "customers" && user?.role !== "admin") ||
				(company_data?.experimental_features !== undefined &&
					((wabaActivationStatus > -1 &&
						wabaActivationStatus !== WabaStatus.Activated &&
						pageName != "members" &&
						pageName != "integrations" &&
						pageName == "admincms" &&
						pageName == "flow" &&
						company_data?.id == NIL) ||
						(!company_data?.experimental_features?.includes("automation") &&
							pageName == "automation") ||
						(!company_data?.experimental_features?.includes("leadinlinks") &&
							pageName == "leadinlinks") ||
						(!company_data?.experimental_features?.includes("agentdashboard") &&
							pageName == "agent-dashboard") ||
						(!company_data?.experimental_features?.includes("ctw") &&
							pageName == "ctwcampaigns"))) ||
				(wabaActivationStatus > -1 &&
					wabaActivationStatus !== WabaStatus.Activated &&
					pageName != "members" &&
					pageName != "integrations" &&
					pageName != "admincms" &&
					pageName != "customers" &&
					pageName != "flow")
			) {
				if (pageName != "customers" && user?.role !== "billing_admin") {
					navigate("/admin/dashboard");
				}
			}
		} else {
			navigate("/admin/agent-dashboard");
		}
	}, [wabaActivationStatus, pageName, company_data]);

	const { mutate: getSsoLinkMutate } = useMutation(useGetSsoLink, {
		onSuccess: (data: any) => {
			if (data.url) {
				localStorage.removeItem("customerId");
				localStorage.removeItem("user");
				setAppState({ user: undefined });
				window.location.href = data.url;
			}
		},
		onError: async (err: HTTPError) => {
			ErrorToastMessage({
				error: err,
				id: "sso_link_error",
			});
		},
	});
	const getIntegration = async () => {
		const integrationsDataResponse =
			(await getIntegrationsDetails()) as Array<string>;
		setAppState({ integrations: integrationsDataResponse });
	}; */
	const getUserData = async () => {
		const userDataResponse = (await getMyDetails()) as IUser;
		localStorage.setItem("user", JSON.stringify(userDataResponse));
		setAppState({ user: userDataResponse });
	};
	useEffect(() => {
		getUserData();
	}, []);
	return (
		<div
			className={`main-wrapper float-left inline-block h-full w-full text-sm`}>
			<Navbar></Navbar>
			
			<div
				id="contentDiv"
				className={`px-8 py-5 mb-10 mr-5 border border-border rounded-3xl float-right inline-block min-h-[calc(100vh-136px)] transition-[width] duration-300 dark:bg-dark2 dark:text-darkPrimary ${showSidebar
					? "w-[calc(100%)] sm:w-[calc(100%-240px)]"
					: "w-[calc(100%)] sm:w-[calc(100%-75px)]"
					} `}>


				{/* {pageName &&
					pageName.trim() != "ctwcampaign" &&
					pageName.trim() != "Campaigns" ? (
					<DowntimeBanner />
				) : (
					<></>
				)} */}
				<Outlet />
			</div>
		</div>
	);
}

export default AppSite;
