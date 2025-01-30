import TabsComponent from "components/ui/common/TabsComponent";
import { Link, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Icon from "utils/icon";
import { Button, Card } from "flowbite-react";
import { useMutation } from "react-query";
import React, { useEffect, useState } from "react";
import { HTTPError } from "ky";
import { Divider, Modal } from "antd";
import { InputProfile } from "components/ui/common/InputProfile";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "components/ui/common/Select";
import { useCourses } from "api/services/courseService";
import { useDepartments } from "api/services/departmentService";
import { deleteEducation, useEducations, AdditionalEducationAdd } from "api/services/educationService";
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
	BasicProfile,
	IEducation,
	ConfirmPopupDataType,
    AdditionalEducation,
    IDepartment,
} from "utils/datatypes";

const AlumniEducationDetails = () => {

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

    const EmailCourseSchema = yup.object().shape({
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
		trigger: trigger,
		register: register,
		handleSubmit: handleSubmit,
		reset: reset,
		formState: { errors: errors },
	} = useForm<AdditionalEducation>({
		resolver: yupResolver(EmailSchema),
	});

    
    const {
		trigger: triggerEducation,
		register: registerEducation,
		handleSubmit: handleSubmitEducation,
		reset: resetcourse,
		formState: { errors: errorscourse },
	} = useForm<AdditionalEducation>({
		resolver: yupResolver(EmailCourseSchema),
	});
    

    const {
		isLoading,
		data: educationList,
		refetch: fetchEducationList,
		isFetching: isFetchingEducationList,
	} = useEducations({
		enabled: Number(id) > 0,
		filter_user: Number(id),
	}) || [];


    const [itemId, setItemId] = useState(0);
	const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
	const [IsDeleteCancelled, setIsDeleteCancelled] = useState(false);
	const [ConfirmResult, setConfirmResult] = useState(false);
	const [cancelBtnTitle, setcancelBtnTitle] = useState("Cancel");
	const [confirmBtnTitle, setconfirmBtnTitle] = useState("Confirm");

	const ConfirmPopupData: ConfirmPopupDataType = {
		title: "Education Delete",
		text: "Are you sure you want to delete Additional Education?",
	};

	const { mutate: deleteItem, isLoading: uploadIsLoading } = useMutation(
		deleteEducation,
		{
			onSuccess: async () => {
				SuccessToastMessage({
					title: "Delete Education Successfully",
					id: "delete_education_success",
				});
				fetchEducationList();
			},
			onError: async (e: HTTPError) => {
				// const error = await e.response.text();
				// console.log("error", error);
				ErrorToastMessage({ error: e, id: "delete_education" });
			},
		},
	);

	const submitDelete = (itemId: any) => {
		deleteItem(itemId);
		setIsDeleteConfirm(false);
	};
	// Handle the displaying of the modal based on type and id
	const showDeleteModal = (itemId: any) => {
		setItemId(itemId);

		setIsDeleteConfirm(true);
	};

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
				title: "Education Updated Successfully",
				id: "education_user_success",
			});
			closeModel();
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "education_user" });
		},
	});
	const onSubmit = (data: AdditionalEducation) => {
        data.user_id = Number(id);
        if(openAddCoursePursuedFromOtherInstitute == true){
            data.is_additional = 1;
        } else{
            data.degree = "";
            data.location = "";
            data.is_additional = 0;
            data.start_year = 0;
            data.university = "BLDEA University";
        }		
		
		mutate(data);
	};
	
	const [
		openAddCoursePursuedFromOtherInstitute,
		setOpenAddCoursePursuedFromOtherInstitute,
	] = React.useState(false);

	const [
		openAddCoursePursuedFromInstitute,
		setOpenAddCoursePursuedFromInstitute,
	] = React.useState(false);

	const AddCoursePursuedFromOtherInstitute = () => {
		setOpenAddCoursePursuedFromOtherInstitute(true);
	};

	const AddCoursePursuedFromInstitute = () => {
		setOpenAddCoursePursuedFromInstitute(true);
	};

	const closeModel = () => {
		setOpenAddCoursePursuedFromOtherInstitute(false);
	};

	const closeCourseModal = () => {
		setOpenAddCoursePursuedFromInstitute(false);
	};

	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index,
	);

	const [yearListStart] = React.useState([
		{ text: "Select Start Year", value: 0 }, // Blank option
		...years.map(year => ({ text: year, value: year })),
	]);

	const [yearListEnd] = React.useState([
		{ text: "Present", value: 0 }, // Blank option
		...years.map(year => ({ text: year, value: year })),
	]);

	return (
		<div className="">
			<div className="inline-block w-full border-b border-border">
				<TabsComponent />
			</div>
			<div className="mb-4 md:mb-0 md:mr-4 mt-4">
				<h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
					You can add courses/degrees pursued.
				</h2>
			</div>
			<div className="mt-4">
				<Card className="w-full bg-white-200">
					<div className="mb-2 flex items-center justify-between ">
						<h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
							Qualification
						</h5>
					</div>
					<div className="flow-root">
						<ul>
                        {educationList &&
									educationList?.data &&
									educationList?.data?.length
										? educationList?.data?.map(
												(
													item: IEducation,
													i: number,
												) => {
													return (
														<>
								<li
									key={i}
									className="py-3 mb-3 sm:py-4 md:bg-gray-100 md:p-5">
									<div className="flex items-center space-x-4">
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
												{item.university}
											</p>
											<>
																			{item.is_additional ===
																			1 ? (
																				<p className="truncate text-sm text-gray-500 dark:text-gray-400">
																					{item.degree +
																						" - " +
																						item.end_year}
																				</p>
																			) : (
																				<p className="truncate text-sm text-gray-500 dark:text-gray-400">
																					{item.department
																						? item
																								.course
																								?.course_name +
																						  " - " +
																						  item
																								.department
																								?.department_name +
																						  " - " +
																						  item.end_year
																						: item
																								.course
																								?.course_name +
																						  " - " +
																						  item.end_year}
																				</p>
																			)}
																		</>
										</div>
										<div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        <>
																		<div className="flex space-x-2">
																			{item.is_additional ===
																			1 && (
																				<>
																					<Link
																						to={
																							"/profile/education/edit/" +
																							item.id
																						}>
																						<Icon
																							icon="pencil-square-outline"
																							className="w-6 h-6 cursor-pointer"
																							data-tooltip-id="tooltip"
																							data-tooltip-content="Edit Education"
																						/>
																					</Link>
																				</>
																					
																				
																			)}
																			<Icon
																						icon="trash-outline"
																						className="w-6 h-6 cursor-pointer"
																						data-tooltip-id="tooltip"
																						data-tooltip-content="Delete Education"
																						onClick={() =>
																							showDeleteModal(
																								item.id,
																							)
																						}
																					/>
																					</div>
																		</>
										</div>
									</div>
								</li>
                                </>
										);
									},
								)
							: ""}
						</ul>
					</div>
					<div className="flex gap-2">
						<Button
							onClick={AddCoursePursuedFromOtherInstitute}
							outline
							style={{ backgroundColor: "#440178" }}>
							Add course pursued from other institute
						</Button>
						<Button
							onClick={AddCoursePursuedFromInstitute}
							outline
							style={{ backgroundColor: "#440178" }}>
							Add course pursued from institute
						</Button>
					</div>
				</Card>
			</div>
			<Modal
				title="Add Course Pursued From Other Institute"
				open={openAddCoursePursuedFromOtherInstitute}
				// onOk={closeModel}
				footer={null}
				style={{ top: 20 }}
				onCancel={closeModel}>
				<Divider />
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						<label className="mb-3 inline-block">
							University / Institution / College
						</label>
						<InputProfile
							placeholder="Eg : VTU University Of Engineering"
							name={"university"}
							register={register}
							error={errors?.university?.message}
							className="w-full text-sm h-11 border-gray-300"
						/>
					</div>
					<div className="mb-4">
						<label className="mb-3 inline-block">
							Program / Degree
						</label>
						<InputProfile
							placeholder="Eg : Bachelor of Engineering - Bio Technology"
							name={"degree"}
							register={register}
							error={errors?.degree?.message}
							className="w-full text-sm h-11 border-gray-300"
						/>
					</div>

					<div className="mb-4">
						<label className="mb-3 inline-block">Period</label>
						<div className="flex gap-4">
							<div className="flex-1">
								<Select
									name={"start_year"}
                                    items={yearListStart}
                                    error={errors?.start_year?.message}
                                    register={register}
								/>
							</div>
							<div className="flex-1">
								<Select
									className="w-full"
									name={"end_year"}
									items={yearListEnd}
									error={errors?.end_year?.message}
									register={register}
								/>
							</div>
						</div>
					</div>
					<div className="mb-4">
						<label className="mb-3 inline-block">Location</label>
						<InputProfile
							placeholder="Eg : Bangalore"
							name={"location"}
							register={register}
							className="w-full text-sm h-11 border-gray-300"
						/>
					</div>
					<div className="mb-4">
						<Button
							type="submit"
							style={{
								backgroundColor: "#440178",
								width: "100%",
							}}>
							Submit
						</Button>
					</div>
				</form>
			</Modal>
			<Modal
				title="Add Course Pursued From Institute"
				open={openAddCoursePursuedFromInstitute}
				// onOk={closeModel}
				footer={null}
				style={{ top: 20 }}
				onCancel={closeCourseModal}>
				<Divider />
				<form onSubmit={handleSubmitEducation(onSubmit)}>
					<div className="mb-4">
						<label className="mb-3 inline-block">
							Course / Degree
						</label>
						<Select
                                    className="w-full"
									name={"course_id"}
									items={courseList}
									register={registerEducation}
									error={errorscourse?.course_id?.message}
									onChange={handleCourseChange}
								/>
					</div>
					<div className="mb-4">
						<label className="mb-3 inline-block">Department</label>
						<Select
							className="w-full"
							name={"department_id"}
							items={departmentList}
							register={registerEducation}
						/>
					</div>

					
                    {coursesWithSpecialization.includes(
								Number(selectedCourse),
							) && (
								<div className="mb-4">
									<label className="mb-3 inline-block ">
										Specialization
									</label>
                                   
									<InputProfile
										placeholder="Enter Specialization"
										name={"specialization"}
										register={registerEducation}
										className="w-full text-sm h-11 border-gray-100"
									/>
								</div>
							)}

                            <div className="mb-4">
								<label className="mb-3 inline-block ">
									End Year
								</label>
								<Select
									name={"end_year"}
									items={yearListEnd}
									register={registerEducation}
									error={errorscourse?.end_year?.message}
								/>
							</div>

					<div className="mb-4">
						<Button
							type="submit"
							style={{
								backgroundColor: "#440178",
								width: "100%",
							}}>
							Submit
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default AlumniEducationDetails;
