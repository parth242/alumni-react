import { authUser,registerUser } from "api";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import React, { useEffect, useState } from "react";
import {
	ErrorToastMessage,
	getMyDetails,
} from "api/services/user";
import LoginSidebar from "components/layout/loginSidebar";
import { CustomerType, IUser, TSelect, ICountry, IState } from "utils/datatypes";
import { patterns } from "utils/consts";
import { HTTPError } from "ky";
import { Form } from "components/ui/common/Form";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLogo from "components/layout/AuthLogo";
import { RegisterType } from "utils/types/user-types";
import { classNames } from "utils";
import Loader from "components/layout/loader";
import { useCountrys } from "api/services/countryService";
import { useStates } from "api/services/stateService";

const EmailSchema = yup.object().shape({
	email: yup
		.string()
		.required("Email is required")
		.matches(patterns.EMAIL, "Invalid email address"),
	password: yup.string().required("Password is required"),
	first_name: yup.string().required("First Name is required"),
	address1: yup
			.string()
			.required("Address1 is required")
			.min(3, "Must be more then 3 character")
			.matches(/^[A-Za-z ]+$/, "Address1 is valid only A to Z character"),
	mobileno: yup.string()
			.required("Mobile number is required")
			.matches(/^[0-9]+$/, "Mobile number must contain only digits")
			.min(10, "Mobile number must be at least 10 digits")
			.max(12, "Mobile number can't be more than 12 digits"),
});

function Register() {
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<RegisterType>({ resolver: yupResolver(EmailSchema) });

	const navigate = useNavigate();
	const [loginResponse, setLoginResponse] = useState<{ company: string }>();
	const [{ user, selectedCustomer }, setAppState] = useAppState();
	const [loginSuccess, setLoginSuccess] = useState<boolean | null>(false);
	const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);
	const [customersList, setCustomersList] = useState<CustomerType[] | null>();
	const [userData, setUserData] = useState<IUser | null>();

	const [countryList, setCountryList] = useState<TSelect[]>([]);
	const [stateList, setStateList] = useState<TSelect[]>([]);
	

	const [selectedCountry, setSelectedCountry] = useState<number>(0);
  	const [selectedState, setSelectedState] = useState('');

	 

	const {
		data: countrys,
		refetch: fetchcountryListData,
		isFetching: isFetchingCountryListData,
	} = useCountrys({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (countrys) {
			const countryList = countrys.data.map((item: ICountry) => { return { text: item.country_name, value: item.id } }) as TSelect[];
			setCountryList([...countryList]);
		} else {
			setCountryList([]);
		}
	}, [countrys]);

	const {
		data: states,
		refetch: fetchstateListData,
		isFetching: isFetchingStateListData,
	} = useStates({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (states) {
			const statesList = states.data.map((item: IState) => { 
				
				if (selectedCountry && selectedCountry > 0) {
					
					if (Number(item.country_id) === Number(selectedCountry)) {
						
					  return { text: item.state_name, value: item.id };
					}
				  } 
				}).filter(Boolean) as TSelect[];
			if (statesList.length > 0) {
				setStateList([...statesList]);
			  } else {
				// Return empty text and value
				setStateList([]);
			  }
			
		} else {
			setStateList([]);
		}
	}, [states, selectedCountry]);
	
//console.log('states',stateList);
	let isSelectedCustomer = false;

	const getUserData = async () => {
		const userDataResponse = (await getMyDetails()) as IUser;
		setUserData(userDataResponse);

		console.log("userDataResponse", userDataResponse);
		localStorage.setItem("user", JSON.stringify(userDataResponse));
		setAppState({ user: userDataResponse });
		navigate("/admin/dashboard");

	};

	

	const onSubmit = (data: RegisterType) => {
		// navigate("/course");
		// navigate("/admin/dashboard");
		
		data.is_alumni = 1;
		data.status = 'inactive';
		data.department_id = 0;
		data.batch_start = 0;
		data.batch_end = 0;
		data.role_id = 0;
		data.gender = '';
		
		mutate(data);
		
		
	};

	const { isLoading, mutate, isError, error } = useMutation(registerUser, {
		onSuccess: async (res: any) => {
			console.log('res',res.data);
			
			//return false;
			const userDataResponse = (await authUser({email:res.data.email, password:getValues("password")})) as IUser;
			setUserData(userDataResponse);

			console.log("userDataResponse", userDataResponse);
			localStorage.setItem("user", JSON.stringify(userDataResponse));
			setAppState({ user: userDataResponse });
			setLoginSuccess(true);
			setLoginResponse(res);
			navigate("/course");
		},
		onError: async (err: HTTPError) => {
			setLoginSuccess(false);
			const error = await err.response.text();
			setLoginErrorMsg(JSON.parse(error).message);
		},
	});
	
	
	
	const proceedLogin = async () => {
		navigate("/admin/dashboard");


	};

	
	
	  const handleCountryChange = (selectedCountry: any) => {
		
		console.log('countrytest');
		//setSelectedState(''); // Reset state selection when country changes
		setSelectedCountry(selectedCountry.target.value);
		fetchstateListData();
		
	  };

	  // Event handler for state selection change
	  const handleStateChange = (e:any) => {
		setSelectedState(e.target.value);
	  };

	return (
		
		<div className="text-sm">
			{isLoading && <Loader></Loader>}
			<div className="xs:grid-cols-12 grid h-screen sm:grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
				
				<div className="col-span-12 animate-fade bg-white dark:bg-dark2">
					<Form
						register={register}
						onSubmit={onSubmit}
						handleSubmit={handleSubmit}
						className={"h-screen"}>
						<div className="flex min-h-full items-center justify-center px-4 py-12 text-gray-700 dark:text-darkSecondary sm:px-6 lg:px-8">
							<div className="w-full max-w-md space-y-6">
								{customersList && customersList?.length > 1 &&
									(userData?.role?.toString().toLowerCase() == "agent" ||
										userData?.role?.toString().toLowerCase() == "agent_admin" ||
										(userData?.role?.toString().toLowerCase() == "org_admin" &&
											localStorage.getItem("shopifyStoreURL") &&
											localStorage.getItem("shopifyStoreURL")!.length > 0)) ? (
									<>
										<AuthLogo message={"Choose an organisation"} />
										<div className="text-center font-medium text-gray-800 dark:text-darkPrimary">
											Your account is part of multiple organisations. Proceed to
											access dashboard with the selected organisation.
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
													{...register(`organisation`, {
														required: "Value is required",
													})}>
													{customersList &&
														customersList?.length &&
														customersList.map(data => {
															return (
																<React.Fragment key={data.id}>
																	<option value={data.id}>
																		{data.company}
																	</option>
																</React.Fragment>
															);
														})}
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
														isSelectedCustomer = false;
													}}>
													Return to Login
												</button>
											</div>
										</div>
									</>
								) : (
									<>
										<AuthLogo message={"Registration Form"} />
										<input type="hidden" name="remember" defaultValue="true" />
										<div className="-space-y-px rounded-md">
										<div className="relative mb-5">
												<Input
													name="first_name"
													label="First Name"
													register={register}
													error={errors?.first_name?.message?.toString()}
												/>
											</div>
											
											<div className="relative mb-5">
												<Input
													name="last_name"
													label="Last Name"
													register={register}													
												/>
											</div>
											<div className="relative mb-5">
												<Input
													name="email"
													label="Email address"
													register={register}
													error={errors?.email?.message?.toString()}
												/>
											</div>
											<div className="relative mb-5">
												<Input
													placeholder="Enter Mobile Number"
													name={"mobileno"}
													label={" Mobile Number"}
													type={"number"}
													register={register}
													error={errors?.mobileno?.message?.toString()}	
												/>
												
											</div>
											<div className="relative mb-5">
												<Input
													placeholder="Enter Address"
													name={"address1"}
													label={"Address"}
													error={errors?.address1?.message}
													register={register}
												/>
											</div>
											<div className="relative mb-5">
												<Select
													name={"country"}
													label={"Country"}
													items={countryList}													
													error={errors?.country?.message}
													register={register}
													onChange={handleCountryChange}
												/>
											</div>
											<div className="relative mb-5">
												<Select
													name={"state"}
													label={"State"}
													items={stateList}
													onChange={handleStateChange}
													error={errors?.state?.message}
													register={register}
												/>
											</div>
											<div className="relative mb-5">
												<Input
													placeholder="Enter City"
													name={"city"}
													label={"City"}
													error={errors?.city?.message}
													register={register}
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

										

										<div className="relative">
											<button
												type="submit"
												className="group relative mb-3 flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
												Register
											</button>
											{loginSuccess === false && (
												<span className="mt-8 text-xs text-primary">
													{loginErrorMsg}
												</span>
											)}
										</div>
										<div className="items-center text-center font-medium">
											<div className="">
												Already have an account?{" "}
												<Link
													to="/login"
													className="font-medium text-primary hover:underline">
													Login
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
		</div>
	);
}

export default Register;
