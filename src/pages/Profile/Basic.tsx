import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import ProfileHeader from "components/layout/profileheader";
import ProfileSidebar from "components/layout/profilesidebar";
import React, { useEffect, useState } from "react";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
	BasicProfileUpdate,
} from "api/services/user";
import {
	CustomerType,
	IUser,
	TSelect,
	ICourse,
	BasicProfile,
} from "utils/datatypes";
import { HTTPError } from "ky";
import { InputProfile } from "components/ui/common/InputProfile";
import Select from "components/ui/common/Select";
import Textarea from "components/ui/common/Textarea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "components/layout/loader";
import { Button } from "flowbite-react";

function Basic() {
	const EmailSchema = yup.object().shape({
		first_name: yup.string().required("First name is required"),

		last_name: yup.string().required("Last name is required"),

		gender: yup.string().required("Gender is required"),
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<BasicProfile>({
		resolver: yupResolver(EmailSchema),
	});

	const [userData, setUserData] = useState<BasicProfile | null>();
	const [loading, setLoading] = useState(false);

	const getUserData = async () => {
		const userDataResponse = (await getMyDetails()) as BasicProfile;
		setUserData(userDataResponse);
	};
	useEffect(() => {
		setLoading(true);
		getUserData();
	}, []);

	useEffect(() => {
		reset(userData as BasicProfile);
		setLoading(false);
	}, [userData]);

	const navigate = useNavigate();

	const [selectedDate, setSelectedDate] = useState("");

	const [relationshipList] = useState([
		{ text: "No Answer", value: "No Answer" },
		{ text: "Single", value: "Single" },
		{ text: "Married", value: "Married" },
		{ text: "Committed", value: "Committed" },
	]);

	const [salutation] = useState([
		{ text: "Mr.", value: "Mr." },
		{ text: "Ms.", value: "Ms." },
		{ text: "Mrs.", value: "Mrs." },
		{ text: "Dr.", value: "Dr." },
		{ text: "Prof.", value: "Prof." },
		{ text: "Other", value: "Other" },
	]);

	const [{ user, selectedCustomer }, setAppState] = useAppState();

	const handleDateChange = (event: any) => {
		setSelectedDate(event.target.value);
	};

	const { mutate, isError, error } = useMutation(BasicProfileUpdate, {
		onSuccess: async (res: any) => {
			setLoading(false);
			SuccessToastMessage({
				title: "Basic Profile Updated Successfully",
				id: "update_user_success",
			});
		},
		onError: async (e: HTTPError) => {
			setLoading(false);
			ErrorToastMessage({ error: e, id: "update_user" });
		},
	});
	const onSubmit = (data: BasicProfile) => {
		setLoading(true);
		data.id = userData?.id;
		//console.log('dataprofile',data);
		// return false;
		mutate(data);
	};

	console.log("getvalue", getValues("first_name"));
	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>

			<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
				<div className="md:w-56">
					{/* Sidebar */}
					<ProfileSidebar />
				</div>
				<div className="w-full px-10 min-h-screen">
					<h1 className=" text-3xl my-7 font-semibold">
						Basic Profile
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
							Please update profile details here
						</p>
					</div>
					<div className="mt-10">
						<form
							className="flex flex-col gap-4 mt-10"
							onSubmit={handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Salutation
									</label>
									<Select
										name={"salutation"}
										items={salutation}
										register={register}
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										First Name
									</label>
									<InputProfile
										placeholder="Enter First Name"
										name={"first_name"}
										register={register}
										error={errors?.first_name?.message?.toString()}
										className="w-full text-sm h-11 border-gray-300 "
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Middle Name
									</label>
									<InputProfile
										placeholder="Enter Middle Name"
										name="middle_name"
										register={register}
										className="w-full text-sm h-11 border-gray-300"
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Last Name
									</label>
									<InputProfile
										placeholder="Enter Last Name"
										name="last_name"
										register={register}
										error={errors?.last_name?.message?.toString()}
										className="w-full text-sm h-11 border-gray-300"
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Nickname
									</label>
									<InputProfile
										placeholder="Enter Nickname"
										name="nickname"
										register={register}
										defaultValue={userData?.nickname}
										className="w-full text-sm h-11 border-gray-300"
									/>
									{/* <Textarea
										placeholder="Enter description"
										name={"description"}
										rows={4}
									/> */}
								</div>
							</div>
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
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
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Relationship Status
									</label>
									<Select
										name={"relationship_status"}
										items={relationshipList}
										register={register}
									/>
								</div>
							</div>
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<label className="mb-3 inline-block ">
										About me
									</label>
									<Textarea
										placeholder="Enter About me"
										name={"about_me"}
										register={register}
										rows={4}
									/>
								</div>
							</div>
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<div className="flex space-x-4 mb-6">
										<div className="flex items-center">
											<input
												type="radio"
												id="gender_male"
												value="Male"
												className="form-radio h-5 w-5 text-blue-600"
												{...register(`gender`)}
											/>
											<label
												htmlFor="Male"
												className="text-sm ml-2">
												Male
											</label>
										</div>
										<div className="flex items-center">
											<input
												type="radio"
												id="gender_female"
												value="Female"
												className="form-radio h-5 w-5 text-blue-600"
												{...register(`gender`)}
											/>
											<label
												htmlFor="Female"
												className="text-sm ml-2">
												Female
											</label>
										</div>
										<div className="flex items-center">
											<input
												type="radio"
												id="gender_other"
												value="Other"
												className="form-radio h-5 w-5 text-blue-600"
												{...register(`gender`)}
											/>
											<label
												htmlFor="other"
												className="text-sm ml-2">
												Prefer not to disclose
											</label>
										</div>
										<span className="text-xs text-red-500">
											{errors?.gender && (
												<>
													<span>
														Gender is Required
													</span>
												</>
											)}
											&nbsp;
										</span>
									</div>
								</div>
							</div>
							{loading && <Loader></Loader>}
							<div>
								<div className="flex space-x-4 mb-6">
									<Button
										style={{ backgroundColor: "#440178" }}
										outline
										type="submit">
										Update Profile
									</Button>
									<Button
										style={{ backgroundColor: "#440178" }}
										onClick={() =>
											navigate("/profile/photo")
										}
										outline>
										Next
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default Basic;
