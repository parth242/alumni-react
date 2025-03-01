import { authUser, registerUser } from "api";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import React, { useEffect, useState } from "react";
import { ErrorToastMessage, getMyDetails } from "api/services/user";
import LoginSidebar from "components/layout/loginSidebar";
import {
	CustomerType,
	IUser,
	TSelect,
	ICountry,
	IState,
	IDepartment,
	ICourse,
} from "utils/datatypes";
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
import { useDepartments } from "api/services/departmentService";
import { useCourses, createUserCourse } from "api/services/courseService";

const EmailSchema = yup.object().shape({
	email: yup
		.string()
		.required("Email is required")
		.matches(patterns.EMAIL, "Invalid email address"),
	password: yup
			  .string()
			  .required("Password is required")
			  .matches(
				/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
				"Password must contain at least 8 characters, one uppercase, one number and one special case character",
			),
	first_name: yup.string().required("First Name is required"),
	address1: yup.string().required("Address1 is required"),
	gender: yup.string().required("Gender is required"),
	course_id: yup
		.number()
		.typeError("Course is required")
		.nullable()
		.required("Course is required."),
	end_year: yup
		.number()
		.typeError("End Year is required")
		.nullable()
		.required("End Year is required."),
	country_mobileno_code: yup.string().required("Country Code is required"),
	mobileno: yup
		.string()
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

	const [countryPhoneCode, setCountryPhoneCode] = useState<TSelect[]>([]);
	const [countryList, setCountryList] = useState<TSelect[]>([]);
	const [stateList, setStateList] = useState<TSelect[]>([]);

	const [selectedCountry, setSelectedCountry] = useState<number>(0);
	const [selectedState, setSelectedState] = useState("");

	const [courseList, setCourseList] = useState<TSelect[]>([]);
	const [departmentList, setDepartmentList] = useState<TSelect[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [coursesWithSpecialization, setCoursesWithSpecialization] = useState<
		number[]
	>([]);

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
			const countryList = countrys.data.map((item: ICountry) => {
				return { text: item.country_name, value: item.id };
			}) as TSelect[];
			setCountryList([...countryList]);

			const countryPhoneCode = countrys.data
				.map((item: ICountry) => {
					if (item?.country_phone_code > 0) {
						return {
							text:
								item.country_name +
								" (+" +
								item.country_phone_code +
								")",
							value: item.country_phone_code,
						};
					}
				})
				.filter(Boolean) as TSelect[];
			if (countryPhoneCode.length > 0) {
				setCountryPhoneCode([...countryPhoneCode]);
			} else {
				// Return empty text and value
				setCountryPhoneCode([]);
			}
		} else {
			setCountryList([]);
			setCountryPhoneCode([]);
		}
	}, [countrys]);

	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index,
	);
	const [yearList] = useState(
		years.map(year => ({ text: year, value: year })),
	);

	const [yearListEnd] = useState(
		years.map(year => ({ text: year, value: year })),
	);

	const [genderList] = useState([
		{ text: "Male", value: "Male" },
		{ text: "Female", value: "Female" },
		{ text: "Other", value: "Other" },
	]);

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
			const statesList = states.data
				.map((item: IState) => {
					if (selectedCountry && selectedCountry > 0) {
						if (
							Number(item.country_id) === Number(selectedCountry)
						) {
							return { text: item.state_name, value: item.id };
						}
					}
				})
				.filter(Boolean) as TSelect[];
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

	const {
		data: courses,
		refetch: fetchcourseListData,
		isFetching: isFetchingCourseListData,
	} = useCourses({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (courses) {
			const courseList = courses.data.map((item: ICourse) => {
				if (item.course_level == 3) {
					setCoursesWithSpecialization([Number(item.id)]);
				}
				return { text: item.course_name, value: item.id };
			}) as TSelect[];
			setCourseList(courseList);
		}
	}, [courses]);

	const {
		data: departments,
		refetch: fetchdepartmentListData,
		isFetching: isFetchingDepartmentListData,
	} = useDepartments({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (departments) {
			console.log("departments", departments.data);
			const departmentList = departments.data
				.map((item: IDepartment) => {
					if (selectedCourse && selectedCourse > 0) {
						if (Number(item.course_id) === Number(selectedCourse)) {
							return {
								text: item.department_name,
								value: item.id,
							};
						}
					}
				})
				.filter(Boolean) as TSelect[];

			if (departmentList.length > 0) {
				setDepartmentList(departmentList);
			} else {
				// Return empty text and value
				setDepartmentList([]);
			}
		}
	}, [departments, selectedCourse]);

	const handleCourseChange = (selectedCourse: any) => {
		if (selectedCourse.target.value == 3) {
		}
		//setSelectedState(''); // Reset state selection when country changes
		setSelectedCourse(selectedCourse.target.value);
		//fetchstateListData();
	};

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
		if(data.state_id==''){
			data.state_id = 0;
		}
		if(data.country_id==''){
			data.country_id = 0;
		}
		data.is_alumni = 1;
		data.status = "inactive";
		data.role_id = 0;

		mutate(data);
	};

	const { isLoading, mutate, isError, error } = useMutation(registerUser, {
		onSuccess: async (res: any) => {
			navigate("/thankyou");
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
		console.log("countrytest");
		//setSelectedState(''); // Reset state selection when country changes
		setSelectedCountry(selectedCountry.target.value);
		//fetchstateListData();
	};

	// Event handler for state selection change
	const handleStateChange = (e: any) => {
		setSelectedState(e.target.value);
	};

	return (
		<div className="text-sm">
			{isLoading && <Loader></Loader>}
			<div className="xs:grid-cols-12 grid h-screen sm:grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
				<div className="col-span-12 animate-fade bg-white dark:bg-dark2">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className={"h-screen"}>
						<div className="flex min-h-full items-center justify-center px-4 py-12 text-gray-700 dark:text-darkSecondary sm:px-6 lg:px-8">
							{/* max-w-md */}
							<div className="md:w-3/5 w-full space-y-6">
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
										<div className="mb-1">
											<h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-darkPrimary">
												Create Your Account and Get
												Started
											</h2>
										</div>
										<input
											type="hidden"
											name="remember"
											defaultValue="true"
										/>
										<div className="space-y-6 bg-white p-6 rounded-md shadow-lg">
											{/* First Name and Last Name in One Row */}
											<div className="flex space-x-4">
												<div className="flex-1">
													<Input
														name="first_name"
														label="First Name"
														register={register}
														error={errors?.first_name?.message?.toString()}
													/>
												</div>
												<div className="flex-1">
													<Input
														name="last_name"
														label="Last Name"
														register={register}
													/>
												</div>
											</div>

											{/* Email and Gender in One Row */}
											<div className="flex space-x-4">
												<div className="flex-1">
													<Input
														name="email"
														label="Email Address"
														register={register}
														error={errors?.email?.message?.toString()}
													/>
												</div>
												<div className="flex-1">
													<Select
														name="gender"
														label="Gender"
														items={genderList}
														error={
															errors?.gender
																?.message
														}
														register={register}
													/>
												</div>
											</div>

											{/* Course and Department in One Row */}
											<div className="flex space-x-4">
												<div className="flex-1">
													<Select
														name="course_id"
														label="Course"
														items={courseList}
														register={register}
														error={
															errors?.course_id
																?.message
														}
														onChange={
															handleCourseChange
														}
													/>
												</div>
												<div className="flex-1">
													<Select
														name="department_id"
														label="Department"
														items={departmentList}
														register={register}
													/>
												</div>
											</div>

											{/* Specialization */}
											{coursesWithSpecialization.includes(
												Number(selectedCourse),
											) && (
												<div>
													<Input
														label="Specialization"
														name="specialization"
														register={register}
													/>
												</div>
											)}

											{/* End Year and Country Code in One Row */}
											<div className="flex space-x-4">
												<div className="flex-1">
													<Select
														name="end_year"
														label="Batch End Year"
														items={yearListEnd}
														register={register}
														error={
															errors?.end_year
																?.message
														}
													/>
												</div>
												<div className="flex-1">
													<Select
														name="country_mobileno_code"
														label="Country Code"
														items={countryPhoneCode}
														error={
															errors
																?.country_mobileno_code
																?.message
														}
														register={register}
													/>
												</div>
											</div>

											{/* Mobile Number and Address in One Row */}
											<div className="flex space-x-4">
												<div className="flex-1">
													<Input
														placeholder="Enter Mobile Number"
														name="mobileno"
														label="Mobile Number"
														type="number"
														register={register}
														error={errors?.mobileno?.message?.toString()}
													/>
												</div>
												<div className="flex-1">
													<Input
														placeholder="Enter Address"
														name="address1"
														label="Address"
														error={
															errors?.address1
																?.message
														}
														register={register}
													/>
												</div>
											</div>

											{/* Country and State in One Row */}
											<div className="flex space-x-4">
												<div className="flex-1">
													<Select
														name="country_id"
														label="Country"
														items={countryList}
														register={register}
														onChange={
															handleCountryChange
														}
													/>
												</div>
												<div className="flex-1">
													<Select
														name="state_id"
														label="State"
														items={stateList}
														onChange={
															handleStateChange
														}
														register={register}
													/>
												</div>
											</div>

											{/* City and Password in One Row */}
											<div className="flex space-x-4">
												<div className="flex-1">
													<Input
														placeholder="Enter City"
														name="city"
														label="City"
														error={
															errors?.city
																?.message
														}
														register={register}
													/>
												</div>
												<div className="flex-1">
													<Input
														type="password"
														name="password"
														label="Password"
														register={register}
														error={errors?.password?.message?.toString()}
													/>
												</div>
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
					</form>
				</div>
			</div>
		</div>
	);
}

export default Register;
