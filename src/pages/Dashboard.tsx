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
import { useAppState } from "utils/useAppState"; */

import { useEffect } from "react";
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
				<div className="grid grid-cols-4 gap-6 mt-2">
					<div className="rounded-3xl bg-white text-sm border border-border">
						<div className="flex grid-cols-5 items-center">
							<div className="overflow-hidden items-center col-span-2 m-8">
								<Icon
									icon="user-group"
									className="h-10 w-10 rounded-lg p-2 text-primary bg-primary/10"
								/>
							</div>
							<div className="col-span-3">
								<p>Today's Users</p>
								<h3 className="font-semibold text-2xl">159</h3>
							</div>
						</div>
					</div>
					<div className="rounded-3xl bg-white text-sm border border-border">
						<div className="flex grid-cols-5 items-center">
							<div className="overflow-hidden items-center col-span-2 m-8">
								<Icon
									icon="user-group"
									className="h-10 w-10 rounded-lg p-2 text-primary bg-primary/10"
								/>
							</div>
							<div className="col-span-3">
								<p>Our Users</p>
								<h3 className="font-semibold text-2xl">18</h3>
							</div>
						</div>
					</div>
					<div className="rounded-3xl bg-white text-sm border border-border">
						<div className="flex grid-cols-5 items-center">
							<div className="overflow-hidden items-center col-span-2 m-8">
								<Icon
									icon="user-group"
									className="h-10 w-10 rounded-lg p-2 text-primary bg-primary/10"
								/>
							</div>
							<div className="col-span-3">
								<p>Our Beds</p>
								<h3 className="font-semibold text-2xl">18</h3>
							</div>
						</div>
					</div>
					<div className="rounded-3xl bg-white text-sm border border-border">
						<div className="flex grid-cols-5 items-center">
							<div className="overflow-hidden items-center col-span-2 m-8">
								<Icon
									icon="user-group"
									className="h-10 w-10 rounded-lg p-2 text-primary bg-primary/10"
								/>
							</div>
							<div className="col-span-3">
								<p>Today's Operation</p>
								<h3 className="font-semibold text-2xl">10</h3>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-7 gap-x-10 mt-10">
					<div className="col-span-5">
						<div className="flex col-span-7 font-semibold text-2xl mb-2">
							<h2>User History</h2>
						</div>
						<div className="rounded-3xl bg-white border border-border p-5">
							<div className="flex justify-end items-center text-gray-500 font-semibold">
								<div className="ml-8">New User</div>
								<div className="ml-8">Old User</div>
								<select className="ml-5">
									<option>Daily</option>
									<option>Monthly</option>
									<option>Yearly</option>
								</select>
							</div>
							<canvas
								className="p-5 w-full max-w-full"
								id="UserHistoryChart"
								style={{ width: "100%", height: "265px" }}></canvas>
						</div>
					</div>

					<div className="col-span-2">
						<div className="flex col-span-7 font-semibold text-2xl mb-2">
							<h2>Top Diseases</h2>
						</div>
						<div className="bg-white rounded-3xl border border-border">
							<div className="p-5">
								<canvas
									className="mt-5"
									id="DiseasesChart"
									style={{ width: "69%", height: "69%" }}></canvas>
								<div className="flex">
									<ul className="grid grid-cols-3 m-2 justify-center ">
										<li data-name="Stroke" className="flex items-center mt-2">
											<span className="w-3 h-3 rounded-full bg-stroke mr-2"></span>{" "}
											Stroke
										</li>
										<li data-name="Diabetes" className="flex items-center mt-2">
											<span className="w-3 h-3 rounded-full bg-diabetes mr-2"></span>{" "}
											Diabetes
										</li>
										<li data-name="Cirrhosis" className="flex items-center mt-2">
											<span className="w-3 h-3 rounded-full bg-cirrhosis mr-2"></span>{" "}
											Cirrhosis
										</li>
										<li data-name="Tuberculosis" className="flex items-center mt-2">
											<span className="w-3 h-3 rounded-full bg-tuberculosis mr-2"></span>{" "}
											Tuberculosis
										</li>
										<li data-name="LungCancers" className="flex mt-2">
											<span className="w-3 h-3 rounded-full bg-cancers mr-2"></span>{" "}
											Lung Cancers
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-12 gap-x-10 my-10">
					<div className="col-span-7">
						<div className="section-header">
							<div className="flex col-span-7 font-semibold text-2xl mb-2">
								<h2>Total User Per Day</h2>
							</div>
						</div>
						<div className="rounded-3xl bg-white border border-border p-5">
							<div className="inline-block w-full">
								<div className="stats">
									<ul className="flex gap-x-2 place-content-end">
										<li data-name="Admitted">
											<span className="bulet admitted"></span> Admitted
										</li>
										<li data-name="Discharged">
											<span className="bulet discharged"></span> Discharged
										</li>
									</ul>
								</div>
								<canvas
									className="w-full max-w-full"
									id="TotalUser"
									style={{ width: "100%", height: "228px" }}></canvas>
							</div>
						</div>
					</div>
					<div className="col-span-5">
						<div className="flex col-span-7 font-semibold text-2xl mb-2">
							<h2>Total User Per Day</h2>
						</div>
						<div className="p-5 bg-white rounded-3xl border border-border">
							<div className="grid divide-y">
								<div className="py-5 flex justify-between">
									<div className="">
										<div className="flex gap-x-3">
											<a href="#">
												<img
													src="/assets/images/user.svg"
													alt="user1"
													className="w-10"
												/>
											</a>
											<div className="">
												<div className="font-semibold">
													<a href="#">Charlotte</a>
												</div>
												<p className="">
													Gynecologist
												</p>
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="flex text-yellow-500">
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star-outline" className="w-5 h-5"></Icon>
										</div>
										<div className="mt-1">315 reviews</div>
									</div>
								</div>
								<div className="py-5 flex justify-between">
									<div className="">
										<div className="flex gap-x-3">
											<a href="#">
												<img
													src="/assets/images/user.svg"
													alt="user1"
													className="w-10"
												/>
											</a>
											<div className="">
												<div className="font-semibold">
													<a href="#">Charlotte</a>
												</div>
												<p className="">
													Gynecologist
												</p>
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="flex text-yellow-500">
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star-outline" className="w-5 h-5"></Icon>
										</div>
										<div className="mt-1">315 reviews</div>
									</div>
								</div>
								<div className="py-5 flex justify-between">
									<div className="">
										<div className="flex gap-x-3">
											<a href="#">
												<img
													src="/assets/images/user.svg"
													alt="user1"
													className="w-10"
												/>
											</a>
											<div className="">
												<div className="font-semibold">
													<a href="#">Charlotte</a>
												</div>
												<p className="">
													Gynecologist
												</p>
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="flex text-yellow-500">
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star" className="w-5 h-5"></Icon>
											<Icon icon="star-outline" className="w-5 h-5"></Icon>
										</div>
										<div className="mt-1">315 reviews</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-12 gap-x-10 mb-10">
					<div className="col-span-6">
						<div className="flex col-span-7 font-semibold text-2xl mb-2">
							<h2>Recent User Activity</h2>
						</div>
						<div className="p-5 bg-white rounded-3xl border border-border">
							<div className="grid divide-y">
								<div className="py-5 flex justify-between items-center">
									<div className="">
										<div className="flex gap-x-3">
											<a href="#">
												<img
													src="/assets/images/user.svg"
													alt="user1"
													className="w-10"
												/>
											</a>
											<div className="">
												<div className="font-semibold">
													<a href="#">Roby Romio</a>
												</div>
												<p className="">
													Los Angeles, USA
												</p>
											</div>
										</div>
									</div>
									<div>Insomnia</div>
									<div className="text-right">
										New User
									</div>
								</div>
								<div className="py-5 flex justify-between items-center">
									<div className="">
										<div className="flex gap-x-3">
											<a href="#">
												<img
													src="/assets/images/user.svg"
													alt="user1"
													className="w-10"
												/>
											</a>
											<div className="">
												<div className="font-semibold">
													<a href="#">Roby Romio</a>
												</div>
												<p className="">
													Los Angeles, USA
												</p>
											</div>
										</div>
									</div>
									<div>Insomnia</div>
									<div className="text-right">
										New User
									</div>
								</div>
								<div className="py-5 flex justify-between items-center">
									<div className="">
										<div className="flex gap-x-3">
											<a href="#">
												<img
													src="/assets/images/user.svg"
													alt="user1"
													className="w-10"
												/>
											</a>
											<div className="">
												<div className="font-semibold">
													<a href="#">Roby Romio</a>
												</div>
												<p className="">
													Los Angeles, USA
												</p>
											</div>
										</div>
									</div>
									<div>Insomnia</div>
									<div className="text-right">
										New User
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-span-6">
						<div className="section-header">
							<div className="flex col-span-7 font-semibold text-2xl mb-2">
								<h2>Revenue</h2>
							</div>
						</div>
						<div className="rounded-3xl bg-white border border-border p-5">
							<div className="revenue-chart">
								<div className="stats">
									<ul className="flex gap-x-2 place-content-end">
										<li data-name="Income" className="flex">
											<img src="assets/images/income.png" alt="income" />{" "}
											Income
										</li>
										<li data-name="Diabetes" className="flex">
											<img src="assets/images/expense.png" alt="income" />{" "}
											Expense
										</li>
									</ul>
								</div>
								<canvas
									className="max-w-full"
									id="revenueChart"
									style={{ width: "100%", height: "226px" }}></canvas>
							</div>
						</div>
					</div>
				</div>

			</div>

		</div>
	);
}

export default Dashboard;
