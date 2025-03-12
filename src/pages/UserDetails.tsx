import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import Textarea from "components/ui/common/Textarea";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage, getUserDetails, registerUser, useUploadImage } from "api/services/user";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { FormDataType, IRole, TSelect, IDepartment, ICountry, IState } from "utils/datatypes";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize } from "utils/consts";
import { useRoles } from "api/services/roleService";
import { useDepartments } from "api/services/departmentService";
import { useCountrys } from "api/services/countryService";
import { useStates } from "api/services/stateService";


function UserDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [genderList] = useState([
		{ text: "Male", value: "Male" },
		{ text: "Female", value: "Female" },
		{ text: "Other", value: "Other" },
	]);

	const [statusList] = useState([
		{ text: "Pending", value: "pending" },
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
	]);
	
	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index
	  );
	  const [yearList] =  useState(
		years.map((year) => (
		{ text: year, value: year }
		))
	);
	
	const [roleList, setRoleList] = useState<TSelect[]>([]);
	const [departmentList, setDepartmentList] = useState<TSelect[]>([]);
	const [countryList, setCountryList] = useState<TSelect[]>([]);
	const [stateList, setStateList] = useState<TSelect[]>([]);
	const [countryPhoneCode, setCountryPhoneCode] = useState<TSelect[]>([]);

	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),
		role_id: yup
			.number()
			.typeError('Role is required')
			.nullable().required("Role is required"),

		
		first_name: yup
			.string()
			.required("FirstName is required")
			.min(3, "Must be more then 3 character")
			.matches(/^[A-Za-z ]+$/, "First Name is valid only A to Z character"),

		middle_name: yup.string().optional(),

		last_name: yup
			.string()
			.required("LastName is required")
			.min(3, "Must be more then 3 character")
			.matches(/^[A-Za-z ]+$/, "Last Name is valid only A to Z character"),

		email: yup
			.string()
			.email("Invalid Email.")
			.required("Email is required")
			.matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email is not in criteria"),

		gender: yup.string().required("Gender is required"),
		
		address1: yup
			.string()
			.required("Address1 is required")
			.min(3, "Must be more then 3 character")
			.matches(/^[A-Za-z ]+$/, "Address1 is valid only A to Z character"),

		country_mobileno_code: yup.string().required("Country Code is required"),

		mobileno: yup
				.string()
				.required("Mobile number is required")
				.matches(/^[0-9]+$/, "Mobile number must contain only digits")
				.min(10, "Mobile number must be at least 10 digits")
				.max(12, "Mobile number can't be more than 12 digits"),

		password: yup
			.string()
			// .required("Password is required")
			/* .matches(
				/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
				"Password must contain at least 8 characters, one uppercase, one number and one special case character",
			) */
			/* .when("id", {
				is: +id < 1,
				then: yup.string().required("Confirm Password is required").matches(
					/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
					"Password must contain at least 8 characters, one uppercase, one number and one special case character",
				)
			}), */
			.when("id", (showEmail, schema) => {
				if (!(+showEmail))
					return schema.required("Password is required").matches(
						/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
						"Password must contain at least 8 characters, one uppercase, one number and one special case character",
					)
				return schema
			}),

		confirm_password: yup
			.string()
			// .required("Confirm Password is required")
			.oneOf([yup.ref("password")], "Your passwords do not match."),
			
		status: yup
			.string()
			.required("Status is required")
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
			is_alumni: 0,
		}
	});

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
			const rolesList = roles.data.map((item: IRole) => { return { text: item.name, value: item.id } }) as TSelect[];
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
			const departmentsList = departments.data.map((item: IDepartment) => { return { text: item.department_name, value: item.id } }) as TSelect[];
			setDepartmentList([...departmentsList]);
		} else {
			setDepartmentList([]);
		}
	}, [departments]);

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
			const statesList = states.data.map((item: IState) => { return { text: item.state_name, value: item.id } }) as TSelect[];
			setStateList([...statesList]);
		} else {
			setStateList([]);
		}
	}, [states]);

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
		reset(userDetails?.data);
		trigger();
	}, [userDetails]);

	useEffect(() => {
		if(Number(userDetails?.data.country_id) > 0){
			setValue('country_id',Number(userDetails?.data.country_id));
		} else{
			setValue('country_id',"");
		}
		if(Number(userDetails?.data.country_mobileno_code) > 0){
		setValue('country_mobileno_code',Number(userDetails?.data.country_mobileno_code));
		} else{
			setValue('country_mobileno_code',"");
		}
		if(Number(userDetails?.data.state_id) > 0){
			setValue('state_id',Number(userDetails?.data.state_id));
		} else{
			setValue('state_id',"");
		}
		
		
	}, [stateList]);


	console.log("userDetails", errors);

	const { mutate } = useMutation(registerUser, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "User Created Successfully",
				id: "create_user_success",
			});
			navigate("/admin/users");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_user" });
		},
	});
	const onSubmit = (data: FormDataType) => {
		data.is_alumni = 0;
		data.department_id = 0;
		data.batch_start = 0;
		data.batch_end = 0;
		data.image = "";
		data.course_id = 0;
		if(data.state_id==''){
			data.state_id = 0;
		}
		if(data.country_id==''){
			data.country_id = 0;
		}
		
		mutate(data);
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();



	const uploadImage = async (e: ChangeEvent) => {
		const target = e.target as HTMLInputElement;
		const files: FileList | null = target.files;
		setErrorMessage("");
		setValue("image", "");
		setSelectedImage("");

		if (files && files[0]) {
			setFileChanged(true);
			const ext: string | null = (
				files[0].name.split(".").pop() || ""
			).toLowerCase();
			if (filesExt["image"].indexOf(ext) < 0) {
				setFileControl(null);
				setErrorMessage(fileInvalid["image"]);
				setFileChanged(true);
				setValue("image", "");
				return true;
			}

			if (files[0]?.size < filesSize["image"]) {
				const data = new FormData();
				data.append("type", "profile");
				data.append("file", files[0]);
				setFileControl(files);
				const reader = new FileReader();
				reader.onload = () => {
					console.log("reader.result", reader.result);
					setSelectedImage(reader.result as string);
				};
				reader.readAsDataURL(files[0]);
				uploadFile({ data: data });

			} else {
				setFileControl(null);
				setFileChanged(true);
				setValue("image", "");
				setErrorMessage(
					`File size limit: The image you tried uploading exceeds the maximum file size (${filesLimit["image"]
					}) `,
				);
			}
		} else {
			setValue(`image`, "");
			setFileControl(null);
		}
	};

	const { mutate: uploadFile, isLoading: uploadIsLoading } = useMutation(
		useUploadImage,
		{
			onSuccess: async (data: any) => {
				console.log("data.files", data);
				setValue("image", data.files[0].filename);
				trigger("image");
				setFileChanged(true);
				setErrorMessage("");
			},
			onError: async (e: HTTPError) => {
				setFileControl(null);
				setFileChanged(true);
				setValue("image", "");
				setErrorMessage(
					"File upload failed. Please check your internet connection and try again.",
				);
			},
		},
	);
	console.log("getValues()", getValues("image"));
	return (
		<div className="">
			<div className="inline-block w-full border-b border-border">
				<span className="mb-2 text-lg font-semibold float-left">
					Personal Information
				</span>
			</div>

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
					<Input
							name={"is_alumni"}
							type={"hidden"}
							defaultValue={"0"}
							register={register}
						/>
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
						<Select
							name={"role_id"}
							label={"Role"}
							items={roleList}
							error={errors?.role_id?.message}
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
						<Select
							name={"status"}
							label={"Status"}
							items={statusList}
							error={errors?.status?.message}
							register={register}
						/>
					</div>
					
				</div>
				
				<>
						<div className="inline-block w-full mt-14 border-b border-border mb-5">
							<span className="mb-2 text-lg font-semibold float-left">
								Contact Information
							</span>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
									
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
									name={"mobileno"}
									label={" Mobile Number"}
									type={"number"}
									error={errors?.mobileno?.message}
									register={register}
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
							error={errors?.country_id?.message}
							register={register}
						/>
					</div>
					<div className="col-span-1">
						<Select
							name={"state_id"}
							label={"State"}
							items={stateList}
							error={errors?.state_id?.message}
							register={register}
						/>
					</div>
					<div className="col-span-1">
						<Input
							placeholder="Enter City"
							name={"city"}
							label={"City"}
							error={errors?.city?.message}
							register={register}
						/>
					</div>
				</div>
				
					</>
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
									label={" Confirm Password"}
									type={"password"}
									error={errors?.confirm_password?.message}
									register={register}
								/>
							</div>
						</div>
					</>
				)}
				<div className="mt-6">
					<Button className="!transition-colors !duration-700 text-lg font-medium text-white shadow-sm hover:!bg-blue-700 focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 py-3 px-10">
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}

export default UserDetails;
