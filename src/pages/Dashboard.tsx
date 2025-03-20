/* import { useCustomerRedirect } from "api/services/dashboardService";
import { ErrorToastMessage, trackMixPanel } from "api/services/user";
import Button from "components/ui/common/Button";
import GettingStartedCard from "components/ui/dashboard/gettingStartedCard";
import VideoModal from "components/ui/dashboard/videoModal";
import WabaConfigModal from "components/ui/dashboard/wabaConfigure";
import WabaSetupModal from "components/ui/dashboard/wabaSetupModal";
import { HTTPError } from "ky";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WabaStatus } from "utils/datatypes";
import Icon from "utils/icon";
import { useAppState } from "utils/useAppState"; 

import { useEffect } from "react";*/
import Icon from "utils/icon";

function Dashboard() {
	console.log("Dashboard");

	/* const [openCreate, setOpenCreate] = useState(false);
	const [openConfig, setOpenConfig] = useState(false);
	const [openVideo, setOpenVideo] = useState(false);
	const [{ selectedCustomer, wabaActivationStatus, isDark }] = useAppState();
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const { mutate }: any = useMutation(useCustomerRedirect, {
		onSuccess: async () => {
			if (window.opener) {
				window.open("", "_self", "");
				window.close();
			}
		},
		onError: async (e: HTTPError) => {
			if (window.opener) {
				window.open("", "_self", "");
				window.close();
			}
			ErrorToastMessage({ error: e, id: "redirect_failure" });
		},
	});

	const channels: string = params.get("channels") || "";
	const clientId: string = params.get("client") || "";

	const channelId: string = channels
		?.substring(1, channels.length - 1)
		?.split(",")[0];

	const redirectFn = () => {
		mutate({
			data: {
				channel_id: channelId,
				client_id: params.get("client"),
			},
		});
	};

	useEffect(() => {
		if (channels && channelId && selectedCustomer) {
			redirectFn();
		}
	}, [channels, clientId, selectedCustomer]);

	const videoPlay = () => {
		trackMixPanel("video_play", {
			metadata: {
				title: "Waba Setup",
				description: "Waba Setup",
				video_link: "https://www.youtube.com/watch?v=JxXVx6opxQk",
			},
			page: "dashboard",
		});
	};

	const [{ company_data }] = useAppState(); */
	return (
		<div className="">
			<div className="">
				<h2 className="font-semibold text-2xl">Welcome</h2>
				

				

			</div>

		</div>
	);
}

export default Dashboard;
