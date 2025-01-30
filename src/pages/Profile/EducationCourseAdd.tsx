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
} from "api/services/user";
import {
	CustomerType,
	IUser,
	TSelect,
	ICourse,
	AdditionalEducation,
	IDepartment,
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
import { useCourses } from "api/services/courseService";
import { useDepartments } from "api/services/departmentService";
import { Button } from "flowbite-react";
import { HiOutlineArrowLeft } from "react-icons/hi";

function EducationCourseAdd() {
	const EmailSchema = yup.object().shape({
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
	});

	const {
		trigger,
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm<AdditionalEducation>({
		resolver: yupResolver(EmailSchema),
	});

	const [userData, setUserData] = useState<AdditionalEducation | null>();
	const [myuser, setMyUser] = useState<IUser | null>();

	const getUserData = async () => {
		/*const userDataResponse = (await getMyDetails()) as AdditionalEducation;
		setUserData(userDataResponse);*/

		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	/*useEffect(() => {
		reset(userData as AdditionalEducation);
	}, [userData]);*/

	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index,
	);

	const [yearListStart] = useState([
		{ text: "Select Start Year", value: 0 }, // Blank option
		...years.map(year => ({ text: year, value: year })),
	]);

	const [yearListEnd] = useState([
		{ text: "Select Year", value: "" }, // Blank option
		...years.map(year => ({ text: year, value: year })),
	]);

	const navigate = useNavigate();

	const [courseList, setCourseList] = useState<TSelect[]>([]);
	const [departmentList, setDepartmentList] = useState<TSelect[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [coursesWithSpecialization, setCoursesWithSpecialization] = useState<
		number[]
	>([]);

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
		const defaultOption = { text: "Select Course", value: 0 };
		if (courses) {
			const courseList = courses.data.map((item: ICourse) => {
				if (item.course_level == 3) {
					setCoursesWithSpecialization([Number(item.id)]);
				}
				return { text: item.course_name, value: item.id };
			}) as TSelect[];
			setCourseList([defaultOption, ...courseList]);
		} else {
			setCourseList([defaultOption]);
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
		const defaultOption = { text: "Select Department", value: 0 };

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
				setDepartmentList([defaultOption, ...departmentList]);
			} else {
				// Return empty text and value
				setDepartmentList([defaultOption]);
			}
		} else {
			setDepartmentList([defaultOption]);
		}
	}, [departments, selectedCourse]);

	const handleCourseChange = (selectedCourse: any) => {
		if (selectedCourse.target.value == 3) {
		}
		//setSelectedState(''); // Reset state selection when country changes
		setSelectedCourse(selectedCourse.target.value);
		//fetchstateListData();
	};

	const { mutate, isError, error } = useMutation(AdditionalEducationAdd, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Education Added Successfully",
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
		data.degree = "";
		data.location = "";
		data.is_additional = 0;
		data.start_year = 0;
		data.university = "BLDEA University";

		mutate(data);
	};
	console.log("CoursesWithSpecialization", coursesWithSpecialization);
	console.log("selectedCourse", selectedCourse);
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
							Please add course(s) pursued in this institute.
						</h2>
					</div>
					<form
						className="flex flex-col gap-4 mt-10"
						onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<label className="mb-3 inline-block ">
									Course / Degree
								</label>
								<Select
									name={"course_id"}
									items={courseList}
									register={register}
									error={errors?.course_id?.message}
									onChange={handleCourseChange}
								/>
							</div>
							<div className="w-full">
								<label className="mb-3 inline-block ">
									Department
								</label>
								<Select
									name={"department_id"}
									items={departmentList}
									register={register}
								/>
							</div>
							{coursesWithSpecialization.includes(
								Number(selectedCourse),
							) && (
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Specialization
									</label>
									<InputProfile
										placeholder="Enter Specialization"
										name={"specialization"}
										register={register}
										className="w-full text-sm h-11 border-gray-100"
									/>
								</div>
							)}
							<div className="w-full">
								<label className="mb-3 inline-block ">
									End Year
								</label>
								<Select
									name={"end_year"}
									items={yearListEnd}
									register={register}
									error={errors?.end_year?.message}
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

export default EducationCourseAdd;
