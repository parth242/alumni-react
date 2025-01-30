import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import ProfileHeader from "components/layout/profileheader";
import ProfileSidebar from "components/layout/profilesidebar";
import React, { useEffect, useState } from "react";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
} from "api/services/user";
import {
	CustomerType,
	IUser,
	TSelect,
	ICourse,
	AdditionalEducation,
} from "utils/datatypes";
import {
	getEducationDetail,
	AdditionalEducationAdd,
} from "api/services/educationService";
import { HTTPError } from "ky";
import { InputProfile } from "components/ui/common/InputProfile";
import Select from "components/ui/common/Select";
import Textarea from "components/ui/common/Textarea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "components/layout/loader";
import { Button } from "flowbite-react";
import { HiOutlineArrowLeft } from "react-icons/hi";

function EducationAdd() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const EmailSchema = yup.object().shape({
		university: yup.string().required("Institution field is required."),

		degree: yup.string().required("Degree is required."),

		start_year: yup
			.number()
			.typeError("Start Year is required")
			.nullable()
			.required("Start Year is required")
			.test(
				"is-lessar",
				"Start Year must be lessar than End Year",
				function (start_year) {
					const end_year = this.resolve(yup.ref("end_year"));
					// If either value is not a number, don't perform the comparison
					if (start_year == 0 || end_year == 0) {
						return true; // Skip validation
					}
					return Number(end_year) > Number(start_year);
				},
			),

		end_year: yup
			.number()
			.typeError("End Year is required")
			.test(
				"is-greater",
				"End Year must be greater than Start Year",
				function (end_year) {
					const start_year = this.resolve(yup.ref("start_year"));
					// If either value is not a number, don't perform the comparison
					if (end_year == 0) {
						return true;
					}
					return Number(end_year) > Number(start_year);
				},
			),
	});

	const {
		trigger,
		register,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<AdditionalEducation>({
		resolver: yupResolver(EmailSchema),
	});

	const [educationDetail, setEducationDetail] =
		useState<AdditionalEducation | null>();
	const [myuser, setMyUser] = useState<IUser | null>();

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	let {
		isLoading,
		data: educationDetails,
		refetch: fetchEducationDetails,
		isFetching: isFetchingEducationDetails,
		remove,
	} = getEducationDetail({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchEducationDetails();
		} else {
			educationDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(educationDetails?.data);
		trigger();
	}, [educationDetails]);

	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index,
	);

	const [yearListStart] = useState([
		{ text: "Select Start Year", value: 0 }, // Blank option
		...years.map(year => ({ text: year, value: year })),
	]);

	const [yearListEnd] = useState([
		{ text: "Present", value: 0 }, // Blank option
		...years.map(year => ({ text: year, value: year })),
	]);

	const { mutate, isError, error } = useMutation(AdditionalEducationAdd, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Education Updated Successfully",
				id: "education_user_success",
			});
			navigate("/profile/education");
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "education_user" });
		},
	});
	const onSubmit = (data: AdditionalEducation) => {
		data.user_id = Number(myuser?.id);
		data.is_additional = 1;
		mutate(data);
	};

	return (
		<>
			<SiteNavbar></SiteNavbar>
			<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
				<div className="md:w-56">
					{/* Sidebar */}
					<ProfileSidebar />
				</div>
				<div className="w-full px-10 min-h-screen">
					<h1 className="text-center text-3xl my-7 font-semibold">
						Add / Modify Education Details
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
							Please add the courses pursued in other universities
							/ institutions / colleges
						</h2>
					</div>
					<form
						className="flex flex-col gap-4 mt-10"
						onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<label className="mb-3 inline-block ">
									University / Institution / College
								</label>
								<InputProfile
									placeholder="Name of university / institute / college"
									name={"university"}
									register={register}
									error={errors?.university?.message}
									className="w-full text-sm h-11 border-gray-100"
								/>
							</div>
							<div className="w-full">
								<label className="mb-3 inline-block ">
									Program / Degree
								</label>
								<InputProfile
									placeholder="Eg: MBA - Finance"
									name={"degree"}
									register={register}
									error={errors?.degree?.message}
									className="w-full text-sm h-11 border-gray-100"
								/>
							</div>

							<div className="w-full">
								<label className="mb-3 inline-block ">
									Period
								</label>
								<div className="flex gap-4">
									<div>
										<Select
											name={"start_year"}
											items={yearListStart}
											error={errors?.start_year?.message}
											register={register}
										/>
									</div>
									<div>
										<Select
											name={"end_year"}
											items={yearListEnd}
											error={errors?.end_year?.message}
											register={register}
										/>
									</div>
								</div>
							</div>
							<div className="w-full">
								<label className="mb-3 inline-block ">
									location
								</label>
								<InputProfile
									placeholder="City/ Town of the University / Institute / College"
									name={"location"}
									register={register}
									className="w-full text-sm h-11 border-gray-100"
								/>
							</div>
						</div>
						<div>
							<div className="flex space-x-4 mb-6">
								<Button
									style={{ backgroundColor: "#440178" }}
									outline
									type="submit">
									Submit
								</Button>
								<Button
									onClick={() =>
										navigate("/profile/education")
									}
									outline
									gradientDuoTone="tealToLime">
									<HiOutlineArrowLeft className="mr-2 h-5 w-5" />
									Back
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default EducationAdd;
