import { authUser } from "api";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import React, { useEffect, useState } from "react";
import { ErrorToastMessage, getMyDetails } from "api/services/user";
import LoginSidebar from "components/layout/loginSidebar";
import { CustomerType, IUser } from "utils/datatypes";
import { patterns } from "utils/consts";
import { HTTPError } from "ky";
import { Form } from "components/ui/common/Form";
import { Input } from "components/ui/common/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLogo from "components/layout/AuthLogo";
import { LoginType } from "utils/types/user-types";
import { classNames } from "utils";
import Loader from "components/layout/loader";
import HomeHeader from "components/layout/homeheader";
import HomeFooter from "components/layout/homefooter";

const EmailSchema = yup.object().shape({
	email: yup
		.string()
		.required("Email is required")
		.matches(patterns.EMAIL, "Invalid email address"),
	password: yup.string().required("Password is required"),
	organisation: yup.string().optional(),
});

function Login() {
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<LoginType>({ resolver: yupResolver(EmailSchema) });

	const navigate = useNavigate();
	const [loginResponse, setLoginResponse] = useState<{ company: string }>();
	const [{ user, selectedCustomer }, setAppState] = useAppState();
	const [loginSuccess, setLoginSuccess] = useState<boolean | null>(false);
	const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);
	const [customersList, setCustomersList] = useState<CustomerType[] | null>();
	const [userData, setUserData] = useState<IUser | null>();

	/* useEffect(() => {
		// Extract the query param from the URL
		const params = new URLSearchParams(window.location.search);
		const queryParamValue = params.get("store");
		// If query param is present, add it to local storage and remove it from the URL
		if (queryParamValue) {
			localStorage.setItem("shopifyStoreURL", queryParamValue);
			const newUrl =
				window.location.protocol +
				"//" +
				window.location.host +
				window.location.pathname;
			window.history.replaceState({ path: newUrl }, "", newUrl);
		}
	}, []); */

	let isSelectedCustomer = false;
	/*
	if (user) {
		if (user?.role != "agent") {
			if (user?.role == "agent_admin") {
				navigate("user/agent-dashboard");
			} else if (
				localStorage.getItem("shopifyStoreURL") &&
				user?.role == "org_admin"
			) {
				navigate("user/integrations");
			} else {
				navigate("user/dashboard");
			}
		}
	} */

	/* const {
		isLoading: getSsoLinkLoading,
		mutate: getSsoLinkMutate,
		isError: isErrorLink,
		error: errorLink,
	} = useMutation(useGetSsoLink, {
		onSuccess: (data: any) => {
			if (data.url) {
				window.location.href = data.url;
			}
		},
		onError: async (err: HTTPError) => {
			ErrorToastMessage({
				error: err,
				id: "sso_link_error1",
			});
		},
	}); */

	/* const { data: adminCompany, refetch: fetchAdminCompany } =
		useAdminCompany({
			enabled: false,
			customer_id: selectedCustomer,
		}) || [];

	const { data: companyData, refetch: fetchCompanyData } =
		useCustomerCompany({
			enabled: false,
		}) || [];

	useEffect(() => {
		setAppState({ company_data: companyData });
	}, [companyData]);

	useEffect(() => {
		setAppState({ company_data: adminCompany });
	}, [adminCompany]); */

	const getUserData = async () => {
		const userDataResponse = (await getMyDetails()) as IUser;
		setUserData(userDataResponse);

		console.log("userDataResponse", userDataResponse);
		localStorage.setItem("user", JSON.stringify(userDataResponse));
		setAppState({ user: userDataResponse });
		if (userDataResponse.is_admin === 2) {

			navigate("/admin/institutes");

		} else if (userDataResponse.is_admin === 1) {

			navigate("/admin/dashboard");
			
		} else if (userDataResponse.is_alumni == 1) {
			if (
				userDataResponse.image == "" ||
				userDataResponse.image == null
			) {
				navigate("/profile/basic");
			} else {
				navigate("/dashboard");
			}
		} else {
			navigate("/dashboard");
		}
	};
	const { isLoading, mutate, isError, error } = useMutation(authUser, {
		onSuccess: async (res: any) => {
			setLoginSuccess(true);
			setLoginResponse(res);
			getUserData();
		},
		onError: async (err: HTTPError) => {
			setLoginSuccess(false);
			const error = await err.response.text();
			setLoginErrorMsg(JSON.parse(error).message);
		},
	});
	const onSubmit = (data: LoginType) => {
		// navigate("/admin/dashboard");
		// navigate("/admin/dashboard");

		mutate({ email: data.email, password: data.password });
	};
	/* const getAgentUserData = async () => {
		const userDataResponse = (await getMyDetails()) as IUser;
		setUserData(userDataResponse);
		let customers: CustomerType[] = [];
		if (
			userDataResponse?.role?.toString().toLowerCase() == "admin" ||
			userDataResponse?.role?.toString().toLowerCase() == "billing_admin"
		) {
			customers = await getAllCustomers();
		} else {
			customers = userDataResponse.customers;
		}
		setCustomersList([...customers]);

		if (isSelectedCustomer || customers?.length < 2) {
			if (user?.role == "agent") {
				try {
					const chatwootStatusData =
						(await getChatwootStatus()) as ChatwootStatusType;
					if (chatwootStatusData?.chatwoot_status == ChatwootStatus.ENABLE) {
						getSsoLinkMutate();
					} else {
						navigate("/access_disabled");
					}
				} catch (error) {
					navigate("/access_disabled");
				}
			} else {
				identifyMixPanel(userDataResponse.id);
				setProfileMixPanel(
					userDataResponse.first_name + " " + userDataResponse.last_name,
					userDataResponse.userId ? userDataResponse.userId : "",
					userDataResponse.email,
					userDataResponse.customer_id,
				);
				trackMixPanel("login", {
					metadata: {
						company: loginResponse?.company,
						email: getValues("email"),
					},
					page: "login",
				});
				localStorage.setItem("user", JSON.stringify(userDataResponse));
				setAppState({ user: userDataResponse });

				if (
					userDataResponse?.role?.toString().toLowerCase() !== "agent_admin"
				) {
					const integrationsDataResponse =
						(await getIntegrationsDetails()) as Array<string>;
					setAppState({ integrations: integrationsDataResponse });
				}
			}
		}
	}; */
	/*

	useEffect(() => {
		if (loginSuccess != null && loginSuccess) {
			// getUserData();
		}
	}, [loginSuccess]);


	 */
	const proceedLogin = async () => {
		navigate("/admin/dashboard");
	};

	return (
		<div className="text-sm">
			<HomeHeader></HomeHeader>
			{isLoading && <Loader></Loader>}
			<div className="xs:grid-cols-12 grid h-screen sm:grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
				<div className="col-span-12 animate-fade bg-white dark:bg-dark2 rounded-lg shadow-md">
					<Form
						register={register}
						onSubmit={onSubmit}
						handleSubmit={handleSubmit}
						className={"h-screen"}>
						<div className="flex min-h-full items-center justify-center px-4 py-12 text-gray-700 dark:text-darkSecondary sm:px-6 lg:px-8">
							<div className="w-full max-w-md space-y-6">
								{customersList &&
								customersList?.length > 1 &&
								(userData?.role?.toString().toLowerCase() ==
									"agent" ||
									userData?.role?.toString().toLowerCase() ==
										"agent_admin" ||
									(userData?.role?.toString().toLowerCase() ==
										"org_admin" &&
										localStorage.getItem(
											"shopifyStoreURL",
										) &&
										localStorage.getItem("shopifyStoreURL")!
											.length > 0)) ? (
									<>
										<AuthLogo
											message={"Choose an organisation"}
										/>
										<div className="text-center font-medium text-gray-800 dark:text-darkPrimary">
											Your account is part of multiple
											organisations. Proceed to access
											dashboard with the selected
											organisation.
										</div>
										<div className="-space-y-px rounded-md">
											<div className="relative mb-5">
												<select
													className={classNames(
														"col-span-6",
														"w-full",
														"rounded-md",
														"disabled:opacity-75",
														"border",
														"border-gray-300",
														"bg-white dark:bg-dark1 dark:border-dark3 dark:text-darkPrimary",
														"px-3 py-2",
														"shadow-sm",
														"focus:border-primary",
														"focus:outline-none",
														"focus:ring-primary",
													)}
													placeholder={`Choose an option`}
													{...register(
														`organisation`,
														{
															required:
																"Value is required",
														},
													)}>
													{customersList &&
														customersList?.length &&
														customersList.map(
															data => {
																return (
																	<React.Fragment
																		key={
																			data.id
																		}>
																		<option
																			value={
																				data.id
																			}>
																			{
																				data.company
																			}
																		</option>
																	</React.Fragment>
																);
															},
														)}
												</select>
											</div>
										</div>
										<div className="relative">
											<button
												type="button"
												onClick={() => proceedLogin()}
												className="group relative mb-3 flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
												Proceed
											</button>
										</div>
										<div className="items-center text-center font-medium">
											<div className="">
												<button
													className="font-medium text-primary"
													onClick={() => {
														setCustomersList(null);
														isSelectedCustomer =
															false;
													}}>
													Return to Login
												</button>
											</div>
										</div>
									</>
								) : (
									<>
										<AuthLogo
											message={"Login to your account"}
										/>
										<input
											type="hidden"
											name="remember"
											defaultValue="true"
										/>
										<div className="-space-y-px rounded-md">
											<div className="relative mb-5">
												<Input
													name="email"
													label="Email address"
													register={register}
													error={errors?.email?.message?.toString()}
												/>
											</div>
											<div className="relative">
												<Input
													type="password"
													name="password"
													label="Password"
													register={register}
													error={errors?.password?.message?.toString()}
												/>
											</div>
										</div>

										<div className="flex flex-row-reverse items-center justify-between">
											<div className="">
												<Link
													to="/forgot"
													className="font-medium text-primary hover:underline">
													Forgot your password?
												</Link>
											</div>
										</div>

										<div className="relative">
											<button
												type="submit"
												className="group relative mb-3 flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
												Login
											</button>
											{loginSuccess === false && (
												<span className="mt-8 text-xs text-primary">
													{loginErrorMsg}
												</span>
											)}
										</div>
										<div className="items-center text-center font-medium">
											<div className="">
												Don’t have an account yet?{" "}
												<Link
													to="/register"
													className="font-medium text-primary hover:underline">
													Sign Up
												</Link>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</Form>
				</div>
			</div>
			<HomeFooter></HomeFooter>
		</div>
	);
}

export default Login;
