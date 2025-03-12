import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import Textarea from "components/ui/common/Textarea";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getUserDetails,
	registerUser,
	useUploadImage,
} from "api/services/user";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import axios, { AxiosResponse } from "axios";
import {
	FormDataType,
	IRole,
	TSelect,
	IDepartment,
	ICountry,
	IState,
	ICourse,
} from "utils/datatypes";
import {
	allowedFiles,
	fileInvalid,
	filesExt,
	filesLimit,
	filesSize,
} from "utils/consts";
import { useRoles } from "api/services/roleService";
import { useDepartments } from "api/services/departmentService";
import { useCountrys } from "api/services/countryService";
import { useStates } from "api/services/stateService";
import TabsComponent from "components/ui/common/TabsComponent";
import { useCourses } from "api/services/courseService";
import Loader from "components/layout/loader";

function AlumniDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [courseList, setCourseList] = useState<TSelect[]>([]);

	const [genderList] = useState([
		{ text: "Male", value: "Male" },
		{ text: "Female", value: "Female" },
		{ text: "Other", value: "Other" },
	]);

	const [statusList] = useState([
		{ text: "Pending", value: "pending" },
		{ text: "Approved", value: "active" },
		{ text: "Inactive", value: "inactive" },
	]);

	const [salutation] = useState([
		{ text: "Mr.", value: "Mr." },
		{ text: "Ms.", value: "Ms." },
		{ text: "Mrs.", value: "Mrs." },
		{ text: "Dr.", value: "Dr." },
		{ text: "Prof.", value: "Prof." },
		{ text: "Other", value: "Other" },
	]);

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

	const [roleList, setRoleList] = useState<TSelect[]>([]);
	const [departmentList, setDepartmentList] = useState<TSelect[]>([]);
	const [countryList, setCountryList] = useState<TSelect[]>([]);
	const [stateList, setStateList] = useState<TSelect[]>([]);

	const [selectedDate, setSelectedDate] = useState("");
	const [coursesWithSpecialization, setCoursesWithSpecialization] = useState<
		number[]
	>([]);

	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [countryPhoneCode, setCountryPhoneCode] = useState<TSelect[]>([]);

	const [selectedCountry, setSelectedCountry] = useState<number>(0);
	const [selectedState, setSelectedState] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const handleDateChange = (event: any) => {
		setSelectedDate(event.target.value);
	};

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

	const handleCourseChange = (selectedCourse: any) => {
		if (selectedCourse.target.value == 3) {
		}
		//setSelectedState(''); // Reset state selection when country changes
		setSelectedCourse(selectedCourse.target.value);
		//fetchstateListData();
	};

	const schema = yup.object().shape({
		id: yup.string().optional(),		

		first_name: yup
			.string()
			.required("FirstName is required")
			.min(3, "Must be more then 3 character")
			.matches(
				/^[A-Za-z ]+$/,
				"First Name is valid only A to Z character",
			),		

		last_name: yup
			.string()
			.required("LastName is required")
			.min(3, "Must be more then 3 character")
			.matches(
				/^[A-Za-z ]+$/,
				"Last Name is valid only A to Z character",
			),

		email: yup
			.string()
			.email("Invalid Email.")
			.required("Email is required")
			.matches(
				/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
				"Email is not in criteria",
			),

		gender: yup.string().required("Gender is required"),
		image: yup.string().optional(),

		address1: yup
			.string()
			.required("Address1 is required")
			.min(3, "Must be more then 3 character"),
			

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

		password: yup
			.string()			
			.when("id", (showEmail, schema) => {
				if (!+showEmail)
					return schema
						.required("Password is required")
						.matches(
							/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
							"Password must contain at least 8 characters, one uppercase, one number and one special case character",
						);
				return schema;
			}),

		confirm_password: yup
			.string()
			// .required("Confirm Password is required")
			.oneOf([yup.ref("password")], "Your passwords do not match."),

		status: yup.string().required("Status is required"),
	});

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormDataType>({
		resolver: yupResolver(schema),
		defaultValues: {
			is_alumni: 1,
		},
	});

	let {
		isLoading,
		data: userDetails,
		refetch: fetchUserDetails,
		isFetching: isFetchingUserDetails,
		remove,
	} = getUserDetails({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchUserDetails();
		} else {
			userDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(userDetails?.data as any);
		trigger();
	}, [userDetails]);

	const {
		data: roles,
		refetch: fetchListData,
		isFetching: isFetchingListData,
	} = useRoles({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (roles) {
			const rolesList = roles.data.map((item: IRole) => {
				return { text: item.name, value: item.id };
			}) as TSelect[];
			setRoleList([...rolesList]);
		} else {
			setRoleList([]);
		}
	}, [roles]);

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
				return { text: item.state_name, value: item.id };
			}) as TSelect[];
			setStateList([...statesList]);
		} else {
			setStateList([]);
		}
	}, [states]);

	useEffect(() => {
		setValue('country_id',Number(userDetails?.data.country_id));
		setValue('country_mobileno_code',Number(userDetails?.data.country_mobileno_code));
		
		if(stateList.length>1){
			setValue('state_id',Number(userDetails?.data.state_id));
		}
		
		
	}, [stateList]);

	console.log("userDetails", userDetails?.data);

	console.log("alumniID", id);

	

	
	

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();

	const [relationshipList] = useState([
		{ text: "No Answer", value: "No Answer" },
		{ text: "Single", value: "Single" },
		{ text: "Married", value: "Married" },
		{ text: "Committed", value: "Committed" },
	]);

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

	const { mutate } = useMutation(registerUser, {
		onSuccess: async () => {
			setLoading(false);
			SuccessToastMessage({
				title: "User Created Successfully",
				id: "create_user_success",
			});
			navigate("/admin/alumnis");
		},
		onError: async (e: HTTPError) => {
			setLoading(false);
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_user" });
		},
	});

	const saveProfileImage = async () => {
		try {
			let uploadConfig: AxiosResponse | null = null;
			const selectedFile = (image as File) || "";
			console.log("selectedFile", selectedFile);
			if (selectedFile) {
				const response = await axios.get(
					import.meta.env.VITE_BASE_URL +
						"/api/v1/upload?type=profile&filename=" +
						selectedFile.name,
				);
				if (response.status === 200) {
					console.log("response", response);
					uploadConfig = response.data;
					console.log(
						"uploadConfig?.data?.url",
						uploadConfig?.data?.url,
					);
					const upload = await axios.put(
						uploadConfig?.data?.url,
						selectedFile,
						{
							headers: {
								"Content-Type": selectedFile?.type || "",
							},
							onUploadProgress: progressEvent => {
								const percentCompleted = Math.round(
									(progressEvent.loaded * 100) /
										(progressEvent.total || 1),
								);
								// onProgress(percentCompleted);
								console.log(
									"percentCompleted",
									percentCompleted,
								);
							},
						},
					);
					console.log("uploadConfig", uploadConfig);
					setValue("image", uploadConfig?.data?.key);
				}
			}
		} catch (error) {
			return;
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const ext: string | null = (
				file.name.split(".").pop() || ""
			).toLowerCase();
			setImage(null);
			setErrorMessage("");
		setValue("image", "");
		setSelectedImage("");

			if (filesExt["image"].indexOf(ext) < 0) {
				setErrorMessage(fileInvalid["image"]);
				return true;
			} else if (file?.size > filesSize["image"]) {
				setErrorMessage(
					`File size limit: The image you tried uploading exceeds the maximum file size (${filesLimit["image"]}) `,
				);
			} else {
				setImage(file);
				const reader = new FileReader();
				reader.onload = () => {
					console.log("reader.result", reader.result);
					setSelectedImage(reader.result as string);
				};
				reader.readAsDataURL(file);
			}
		}
	};

	const onSubmit = async (data: FormDataType) => {
		setLoading(true);
		await saveProfileImage();
		data.image = getValues("image") || "";
		data.is_alumni = 1;
		if(data.state_id==''){
			data.state_id = 0;
		}
		if(data.country_id==''){
			data.country_id = 0;
		}
		if(data.department_id==''){
			data.department_id = 0;
		}
		console.log('alumnidata',data);
		mutate(data);
	};
	console.log("getValues()", getValues("image"));
	return (
		<div className="">
			<div className="inline-block w-full border-b border-border">
				<TabsComponent />
			</div>

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				<div className="w-32 h-32 flex flex-col items-center justify-center relative">
					{selectedImage || getValues("image") ? (
						<img
							src={
								selectedImage ||
								import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
									getValues("image")
							}
							className="w-32 h-32 rounded-full"
							alt="userImage"
						/>
					) : (
						<img
							src="/assets/images/profile.png"
							className="w-32 h-32 rounded-full"
							alt="userImage"
						/>
					)}
					<label htmlFor="profile-image">
						<Icon
							icon="pencil"
							className="h-7 w-7 rounded-full bg-blue-800 text-white  absolute my-0  bottom-2 right-2 cursor-pointer p-1"
						/>
					</label>
					<input
						id="profile-image"
						type="file"
						className="sr-only"
						accept={`${allowedFiles["image"]}`}
						onChange={handleImageChange}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10"></div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6 mt-10">
				<div className="col-span-1">
						<Input
							name={"is_alumni"}
							type={"hidden"}
							defaultValue={"1"}
							register={register}
						/>
						<Select
										name={"salutation"}
										label={"Salutation"}
										items={salutation}
										register={register}
									/>
					</div>
					<div className="col-span-1">
						
						<Input
							placeholder="Enter First Name"
							name={"first_name"}
							label={" First Name"}
							error={errors?.first_name?.message}
							register={register}
						/>
					</div>
					<div className="col-span-1">
						<Input
							placeholder="Enter Middle Name"
							name={"middle_name"}
							label={"Middle Name"}
							register={register}
							error={errors?.middle_name?.message}
						/>
					</div>
					<div className="col-span-1">
						<Input
							placeholder="Enter Last Name"
							name={"last_name"}
							label={"Last Name"}
							error={errors?.last_name?.message}
							register={register}
						/>
					</div>

					<div className="col-span-1">
							<Input
								placeholder="Enter Email"
								name={"email"}
								label={"Email "}
								error={errors?.email?.message}
								register={register}
							/>
						</div>
					
					<div className="col-span-1">
						<Select
							name={"role_id"}
							label={"Role"}
							items={roleList}
							error={errors?.role_id?.message}
							register={register}
						/>
					</div>

					<div className="col-span-1">
						<Input
							placeholder="Enter Nick Name"
							name={"nickname"}
							label={"Nick Name"}							
							register={register}
						/>
					</div>

					<div className="col-span-1">
						<Select
							name={"gender"}
							label={"Gender"}
							items={genderList}
							error={errors?.gender?.message}
							register={register}
						/>
					</div>

					<div className="col-span-1">
					<label className="mb-3 inline-block ">
										DOB
									</label>

								<input
										type="date"
										value={selectedDate}
										{...register(`dob`)}
										onChange={handleDateChange}
										className="p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
									/>
					</div>

					<div className="col-span-1">
						<Select
							name={"relationship_status"}
							label={"Relationship Status"}
							items={relationshipList}							
							register={register}
						/>
					</div>

					{!id && (
					<>
					<div className="col-span-1">
						<Select
							name="course_id"
							label="Course"
							items={courseList}
							register={register}
							error={errors?.course_id?.message}
							onChange={handleCourseChange}
						/>
					</div>
					<div className="col-span-1">
						<Select
							name="department_id"
							label="Department"
							items={departmentList}
							register={register}							
						/>
					</div>
					{/* Specialization */}
					{coursesWithSpecialization.includes(
												Number(selectedCourse),
											) && (
												<div className="col-span-1">
													<Input
														label="Specialization"
														name="specialization"
														register={register}
													/>
												</div>
											)}
					<div className="col-span-1">
							<Select
								name="end_year"
								label="Batch End Year"
								items={yearListEnd}
								register={register}
								error={errors?.end_year?.message}
							/>
					</div>
					</>
					)}
					<div className="col-span-1">
							<Select
								name="country_mobileno_code"
								label="Country Code"
								items={countryPhoneCode}
								error={errors?.country_mobileno_code?.message}
								register={register}
							/>
					</div>

					<div className="col-span-1">
							<Input
								placeholder="Enter Mobile Number"
								name="mobileno"
								label="Mobile Number"
								type="number"
								register={register}
								error={errors?.mobileno?.message?.toString()}
							/>
					</div>

					<div className="col-span-1">
							<Input
								placeholder="Enter Address"
								name={"address1"}
								label={"Address"}
								error={errors?.address1?.message}
								register={register}
							/>
						</div>

					<div className="col-span-1">
							<Select
								name={"country_id"}
								label={"Country"}
								items={countryList}								
								register={register}
								onChange={
									handleCountryChange
								}
							/>
					</div>

					<div className="col-span-1">
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
						<div className="col-span-1">
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
						<div className="col-span-1">
						<Select
							name={"status"}
							label={"Status"}
							items={statusList}
							error={errors?.status?.message}
							register={register}
						/>
					</div>
					
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">				
					
					
					<div className="col-span-2">
						<Textarea
							placeholder="Enter About me"
							name={"about_me"}
							label={"About Me"}
							register={register}
						/>
					</div>
				</div>
				
				{!id && (
					<>
						<div className="inline-block w-full mt-14 border-b border-border mb-5">
							<span className="mb-2 text-lg font-semibold float-left">
								Security
							</span>
						</div>
						<div className="grid grid-cols-4  gap-x-8 gap-y-6">
							<div className="col-span-2">
								<Input
									placeholder="Enter Password "
									name={"password"}
									label={"Password"}
									type={"password"}
									error={errors?.password?.message}
									register={register}
								/>
							</div>
							<div className="col-span-2">
								<Input
									placeholder="Enter Confirm Password"
									name={"confirm_password"}
									label={"Confirm Password"}
									type={"password"}
									error={errors?.confirm_password?.message}
									register={register}
								/>
							</div>
						</div>
					</>
				)}
				{loading && <Loader></Loader>}
				<div className="mt-6">
					<Button className="!transition-colors !duration-700 text-lg font-medium text-white shadow-sm hover:!bg-blue-700 focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 py-3 px-10">
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}

export default AlumniDetails;
