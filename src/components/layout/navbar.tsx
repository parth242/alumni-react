import React, { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useAppState } from "utils/useAppState";
import { useMutation } from "react-query";
import { logout } from "api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	ErrorToastMessage,
} from "api/services/user";
import { WabaStatus } from "utils/datatypes";
import Loader from "./loader";
import ChangePassword from "pages/ChangePassword";
import Icon from "utils/icon";
import { classNames } from "utils";
import { HTTPError } from "ky";
import { StringStringType } from "utils/consts";

export default function Navbar() {
	const [{ showSidebar, pageName, isDark, company_data }, setAppState] =
		useAppState();
	const [{ user, customers, wabaActivationStatus, selectedCustomer }] =
		useAppState();
	const pageNames: StringStringType = {
		dashboard: `Welcome, ${user?.first_name}!`,
		users: `Users`,
		settings: `College Profile`,
		testimonials: `Success Stories`,
		workroles: `Job Roles`,
		["user-details"]: `User Details`,
	};
	console.log("user", user);
	console.log("pageName", pageName);

	const getCookie = (cookieName: any) => {
		const cookies = document.cookie.split("; "); // Split into individual cookies
		for (let cookie of cookies) {
			const [name, value] = cookie.split("="); // Split name and value
			if (name === cookieName) {
				return decodeURIComponent(value); // Decode and return the cookie value
			}
		}
		return null; // Return null if the cookie is not found
	};
	
	// Usage
	const instituteName = getCookie("institute_name");
	
	const [openConfig, setOpenConfig] = useState(false);
	const [openChangePassword, setOpenChangePassword] = useState(false);
	const [darkmode, setDarkmode] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	const setThemeMode = (isDark: boolean) => {
		const isdarkmode: boolean =
			company_data?.experimental_features?.includes("dark_mode");
		if (
			!("theme" in localStorage) &&
			isdarkmode &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			document.documentElement.classList.add("dark");
			isDark = true;
		}

		setAppState({ isDark: isDark });
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};
	useEffect(() => {
		let pageName: string[] = location.pathname.replace("/admin/", "").split("/");
		if(pageName[0]=='testimonial-details'){
			setAppState({
				pageName: 'Success Story-Details',
			});
		} else if(pageName[0]=='workrole-details'){
			setAppState({
				pageName: 'Job Role-Details',
			});
		} else{
			setAppState({
				pageName: pageName[0],
			});
		}
		
	}, [location.pathname]);

	const { mutate, isLoading: logoutLoading } = useMutation(logout, {
		onSuccess: async () => {
			setAppState({ user: undefined });
			localStorage.removeItem("user");
			navigate("/login");
		},
		onError: async () => {
			setTimeout(() => {
				navigate("/login");
			});
		},
	});
	const logoutFn = () => {
		mutate();
	};
	/* 

	const handleActiveCustomer = async (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const customerId = e.target.value;
		if (
			user.role.toString().toLowerCase() !== "admin" &&
			user.role.toString().toLowerCase() !== "billing_admin"
		) {
			const customer: any = await refreshCustomerToken(customerId);
			if (customer) {
				if (customer?.role == "agent") {
					getSsoLinkMutate();
				} else {
					user.role = customer?.role;
					setAppState({ user: user });
				}
			}
		}
		window.globalCustID = customerId;
		setAppState({ selectedCustomer: customerId });
		localStorage.setItem("customerId", customerId);
	};

	const {
		data: customerData,
		refetch: fetchCustomerData,
		error: customerDataError,
	} = useCustomerProfile({
		enabled:
			!!selectedCustomer &&
			user?.role != undefined &&
			user?.role != "agent_admin" &&
			user?.role != "agent" &&
			user?.role != "billing_admin",
	}) || [];

	const {
		data: adminCompany,
		refetch: fetchAdminCompany,
		error: adminCompanyError,
	} = useAdminCompany({
		enabled: false,
		customer_id: selectedCustomer,
	}) || [];
	const {
		data: companyData,
		refetch: fetchCompanyData,
		error: companyDataError,
	} = useCustomerCompany({
		enabled: false,
	}) || [];

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
	useEffect(() => {
		if (selectedCustomer) {
			if (user?.role !== "agent_admin") {
				if (
					user?.role === "org_admin" &&
					localStorage.getItem("shopifyStoreURL") &&
					localStorage.getItem("shopifyStoreURL")!.length > 0
				) {
					fetchCustomerData();
					navigate("/admin/integrations?storeConnect=true");
				}
				if (user?.role !== "agent" && user?.role != "billing_admin") {
					fetchCustomerData();
				}
			} else {
				navigate("/admin/agent-dashboard");
			}
		}
	}, [selectedCustomer]);

	useEffect(() => {
		if (selectedCustomer) {
			if (user?.role !== "admin") {
				if (user?.role !== "agent") {
					fetchCompanyData();
				}
			} else {
				fetchAdminCompany();
			}
		}
	}, [selectedCustomer]);
	useEffect(() => {
		setAppState({ company_data: companyData });
	}, [companyData]);

	useEffect(() => {
		setAppState({ company_data: adminCompany });
	}, [adminCompany]);

	useEffect(() => {
		const isdarkmode: boolean =
			company_data?.experimental_features?.includes("dark_mode");
		setDarkmode(isdarkmode);
		if (isdarkmode) {
			if (localStorage.theme === "dark") {
				setThemeMode(true);
			}
			if (
				window.matchMedia("(prefers-color-scheme: dark)").matches &&
				localStorage?.theme === undefined
			) {
				setThemeMode(true);
			}
		} else {
			setThemeMode(false);
		}
	}, [company_data]);


	const {
		data: chatwootStatusData,
		refetch: refetchChatwootStatus,
		isError,
	} = useGetChatwootStatus({
		enabled: !!selectedCustomer && user?.role !== "billing_admin",
	}) || [];
	useEffect(() => {
		if (user?.role && user?.role !== "billing_admin") {
			refetchChatwootStatus();
		}
	}, [selectedCustomer]);
	useEffect(() => {
		setAppState({ chatwootStatusItem: isError ? {} : chatwootStatusData });
	}, [chatwootStatusData, isError]);

	const { data: categoryList } = useTemplateTypeList(!!selectedCustomer) || [];
	useEffect(() => {
		setAppState({
			flowList: categoryList && categoryList.length > 0 ? categoryList : [],
		});
	}, [categoryList, selectedCustomer]);

	const {
		data: magicLinkFlowId,
		refetch: refetchMagicLinkFlowId,
		isError: isErrorMagicLinkFlowId,
		error: errorMagicLinkFlowId,
	} = useGetMagicLinkByFlowID({
		enabled:
			!!selectedCustomer &&
			!!categoryList?.length &&
			(categoryList.find(item => item.type == categoryType.HUMAN_AGENT)?.id
				? true
				: false),
		flow_id:
			categoryList && categoryList.length
				? categoryList.find(item => item.type == categoryType.HUMAN_AGENT)
					?.id || ""
				: "",
	}) || [];
	useEffect(() => {
		refetchMagicLinkFlowId();
	}, [selectedCustomer]);
	useEffect(() => {
		if (errorMagicLinkFlowId) {
			setAppState({ agentFlowStatus: 0 });
		} else {
			setAppState({ agentFlowStatus: 1 });
		}
	}, [isErrorMagicLinkFlowId, magicLinkFlowId]); */

	return (
		<>
			{/* {logoutLoading && <Loader />} */}
			<Disclosure
				as="nav"
				className={`right-0 top-0 z-30 float-right transition-[width] duration-300 dark:text-darkPrimary ${showSidebar
					? "w-[calc(100%)] sm:w-[calc(100%-220px)]"
					: "w-[calc(100%)] sm:w-[calc(100%-55px)]"
					}`}>
				{({ open }) => (
					<>
						<div className="flex w-full px-2 lg:pl-0 lg:pr-8">
							<div className="flex h-24 items-center justify-between">
								<Disclosure.Button
									className="m-auto rounded-md p-2 text-2xl hover:text-primary focus:outline-none"
									onClick={() => setAppState({ showSidebar: !showSidebar })}>
									<span className="sr-only">Open main menu</span>
									{open ? (
										<Icon
											icon="bars-3"
											className="block h-6 w-6"
											aria-hidden="true"
										/>
									) : (
										<Icon
											icon="bars-3"
											className="block h-6 w-6"
											aria-hidden="true"
										/>
									)}
								</Disclosure.Button>
							</div>
							<div
								className={`flex h-24 w-[calc(100%-40px)] items-center justify-between sm:w-screen`}>
								<div className="flex-1 items-center justify-start overflow-hidden text-ellipsis text-2xl sm:flex sm:items-stretch sm:justify-start">
									<div className="flex shrink-0 items-center whitespace-nowrap pl-3 text-2xl font-semibold  capitalize leading-8 text-gray-900 dark:text-darkPrimary">
										{pageNames[pageName] || pageName}
									</div>
									{user?.is_admin==2 && (
									<div className="flex shrink-0 items-center whitespace-nowrap pl-3 text-2xl font-semibold  capitalize leading-8 text-gray-900 dark:text-darkPrimary">
										{instituteName}
									</div>
									)}
								</div>
								<div className="flex justify-center">
									{user?.is_admin==2 && (
									<Link
													to="/admin/institutes"
													className="font-medium text-primary hover:underline">
													Change Institute
												</Link>
												)}
									{darkmode && (
										<div className="mt-1">
											{/* <a
												className="cursor-pointer"
												onClick={() => {
													localStorage.setItem("theme", (!isDark).toString());
													setThemeMode(!isDark);
												}}>
												{!isDark ? (
													<Icon
														icon={"moon"}
														className="h-6 w-6 text-slate-600"
														aria-hidden="true"></Icon>
												) : (
													<Icon
														icon={"sun"}
														className="h-6 w-6 text-yellow-400"
														aria-hidden="true"></Icon>
												)}
											</a> */}
											<Menu as="div" className="relative">
												<div>
													<Menu.Button className="rounded-full p-1.5 dark:bg-dark3">
														{!isDark ? (
															<Icon
																icon={"sun"}
																className={classNames(
																	`h-6 w-6`,
																	"theme" in localStorage ? "text-primary" : "",
																)}
																aria-hidden="true"></Icon>
														) : (
															<Icon
																icon={"moon"}
																className={classNames(
																	`h-6 w-6`,
																	"theme" in localStorage ? "text-primary" : "",
																)}
																aria-hidden="true"></Icon>
														)}
													</Menu.Button>
												</div>
												<Transition
													as={Fragment}
													enter="transition ease-out duration-100"
													enterFrom="transform opacity-0 scale-95"
													enterTo="transform opacity-100 scale-100"
													leave="transition ease-in duration-75"
													leaveFrom="transform opacity-100 scale-100"
													leaveTo="transform opacity-0 scale-95">
													<Menu.Items
														className={classNames(
															"absolute",
															"right-0",
															"mt-2",
															"w-32",
															"origin-top-right",
															"rounded-md",
															"bg-white",
															"dark:bg-dark1 dark:border-dark3 dark:border dark:text-darkPrimary text-gray-700",
															"py-1",
															"shadow-lg",
															"ring-1",
															"ring-black",
															"ring-opacity-5",
															"focus:outline-none",
														)}>
														<Menu.Item>
															{({ active }) => (
																<a
																	href="#"
																	className={classNames(
																		localStorage.theme === "light"
																			? "bg-gray-100 dark:bg-dark2 text-primary"
																			: "",
																		"block px-4 py-2 text-sm ",
																		"dark:hover:bg-dark2",
																	)}
																	onClick={() => {
																		localStorage.setItem("theme", "light");
																		setThemeMode(false);
																	}}>
																	<Icon
																		icon="sun"
																		className="float-left mr-3 h-5 w-5"
																		aria-hidden="true"
																	/>
																	Light
																</a>
															)}
														</Menu.Item>
														<Menu.Item>
															{({ active }) => (
																<a
																	href="#"
																	className={classNames(
																		localStorage.theme === "dark"
																			? "bg-gray-100 dark:bg-dark2 text-primary"
																			: "",
																		"block px-4 py-2 text-sm ",
																		"dark:hover:bg-dark2 hover:bg-gray-100",
																	)}
																	onClick={() => {
																		localStorage.setItem("theme", "dark");
																		setThemeMode(true);
																	}}>
																	<Icon
																		icon="moon"
																		className="float-left mr-3 h-5 w-5"
																		aria-hidden="true"
																	/>
																	Dark
																</a>
															)}
														</Menu.Item>
														<Menu.Item>
															{({ active }) => (
																<a
																	href="#"
																	className={classNames(
																		!("theme" in localStorage)
																			? "bg-gray-100 dark:bg-dark2 text-primary"
																			: "",
																		"block px-4 py-2 text-sm ",
																		"dark:hover:bg-dark2 hover:bg-gray-100",
																	)}
																	onClick={() => {
																		localStorage.removeItem("theme");
																		setThemeMode(false);
																	}}>
																	<Icon
																		icon="computer-desktop"
																		className="float-left mr-3 h-5 w-5"
																		aria-hidden="true"
																	/>
																	System
																</a>
															)}
														</Menu.Item>
													</Menu.Items>
												</Transition>
											</Menu>
										</div>
									)}
									<div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
										{/* Profile dropdown */}
										<Menu as="div" className="relative mr-3">
											<div>
												<Menu.Button
													className={classNames(
														"float-left",
														"flex",
														"rounded-full",
														"bg-gray-800",
														"text-sm",
														"focus:outline-none",
														"focus:ring-2",
														"focus:ring-white",
														"focus:ring-offset-2",
														"focus:ring-offset-gray-800",
													)}>
													<span className="sr-only">Open user menu</span>
													<img
														className="h-8 w-8 rounded-full bg-white dark:bg-dark1"
														src={user?.image ? import.meta.env.VITE_BASE_URL + "upload/profile/" + user?.image : "/assets/images/user.svg"}
														alt=""
													/>
												</Menu.Button>
												<Menu.Button className="hidden pt-1.5 pl-2 sm:block">
													{user?.first_name}
												</Menu.Button>
											</div>
											<Transition
												as={Fragment}
												enter="transition ease-out duration-100"
												enterFrom="transform opacity-0 scale-95"
												enterTo="transform opacity-100 scale-100"
												leave="transition ease-in duration-75"
												leaveFrom="transform opacity-100 scale-100"
												leaveTo="transform opacity-0 scale-95">
												<Menu.Items
													className={classNames(
														"absolute",
														"right-0",
														"mt-2",
														"w-52",
														"origin-top-right",
														"rounded-md",
														"bg-white",
														"dark:bg-dark1 dark:border-dark3 dark:border dark:text-darkPrimary text-gray-700",
														"py-1",
														"shadow-lg",
														"ring-1",
														"ring-black",
														"ring-opacity-5",
														"focus:outline-none",
													)}>
													<div className="border-b px-4 py-2 text-sm dark:border-dark3">
														<div className="font-normal">Signed in as</div>
														<div className="truncate" title={user?.email}>
															{user?.email}
														</div>
													</div>
													<Menu.Item>
														{({ active }) => (
															<a
																href="#"
																className={classNames(
																	active ? "bg-gray-100 dark:bg-dark2" : "",
																	"block px-4 py-2 text-sm ",
																	"dark:hover:bg-dark3 dark:hover:text-darkPrimary",
																)}
																onClick={() => setOpenChangePassword(true)}>
																<Icon
																	icon="lock-closed"
																	className="float-left mr-3 h-5 w-5"
																	aria-hidden="true"
																/>
																Change Password
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<Link
																to="#"
																className={classNames(
																	active ? "bg-gray-100 dark:bg-dark2" : "",
																	"block px-4 py-2 text-sm",
																	"dark:hover:bg-dark3 dark:hover:text-darkPrimary",
																)}
																onClick={logoutFn}
															>
																<Icon
																	icon="arrow-right-on-rectangle"
																	className="float-left mr-3 h-5 w-5 rotate-180"
																	aria-hidden="true"
																/>
																Sign out
															</Link>
														)}
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
								</div>
							</div>
						</div>
						{/* <WabaConfigModal
							openCreate={openConfig}
							setOpenCreate={setOpenConfig}
						/> */}
					</>
				)}
			</Disclosure>
			<ChangePassword
				openChangePassword={openChangePassword}
				setOpenChangePassword={setOpenChangePassword}
			/>
		</>
	);
}
