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
import { deleteEducation, useEducations } from "api/services/educationService";
import {
	CustomerType,
	IUser,
	TSelect,
	ICourse,
	BasicProfile,
	IEducation,
	ConfirmPopupDataType,
} from "utils/datatypes";
import { HTTPError } from "ky";
import { InputProfile } from "components/ui/common/InputProfile";
import Select from "components/ui/common/Select";
import Textarea from "components/ui/common/Textarea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "components/layout/loader";
import Icon from "utils/icon";
import ConfirmPopup from "components/ui/ConfirmPopup";
import { Card, Button } from "flowbite-react";

function Education() {
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
	const [userId, setUserId] = useState(0);

	const getUserData = async () => {
		const userDataResponse = (await getMyDetails()) as BasicProfile;
		setUserData(userDataResponse);
	};
	useEffect(() => {
		getUserData();
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setUserId(items.id);
		}
	}, []);

	useEffect(() => {
		reset(userData as BasicProfile);
	}, [userData]);

	const navigate = useNavigate();

	console.log("userId", userId);
	const {
		isLoading,
		data: educationList,
		refetch: fetchEducationList,
		isFetching: isFetchingEducationList,
	} = useEducations({
		enabled: userId > 0,
		filter_user: userId,
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

	return (
		<>
			<SiteNavbar></SiteNavbar>
			<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
				<div className="md:w-56">
					{/* Sidebar */}
					<ProfileSidebar />
				</div>
				<div className="w-full px-4 min-h-screen">
					<h1 className="text-center text-3xl my-7 font-semibold">
						Education Details
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
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
								<ul className="divide-y divide-gray-200 dark:divide-gray-700">
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
															<li className="py-3 sm:py-4 md:bg-gray-100 md:p-5">
																<div className="flex items-center space-x-4">
																	<div className="min-w-0 flex-1">
																		<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
																			{
																				item.university
																			}
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
																			1 ? (
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
																					
																				
																			) : (
																				
																				
																					<Link
																						to={
																							"/profile/education"
																						}>
																						<Icon
																							icon="pencil-square-outline"
																							className="w-6 h-6 cursor-pointer"
																							data-tooltip-id="tooltip"
																							data-tooltip-content="Edit Education"
																						/>
																					</Link>
																					
																					
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
									onClick={() =>
										navigate("/profile/education/add")
									}
									outline
									style={{ backgroundColor: "#440178" }}>
									Add course pursued from other institute
								</Button>
								<Button
									onClick={() =>
										navigate("/profile/education/course")
									}
									outline
									style={{ backgroundColor: "#440178" }}>
									Add course pursued from institute
								</Button>
								<Button.Group>
									<Button
										onClick={() =>
											navigate("/profile/locationcontact")
										}
										outline
										style={{ backgroundColor: "#440178" }}>
										Prev
									</Button>
									<Button
										onClick={() =>
											navigate("/profile/work")
										}
										outline
										style={{ backgroundColor: "#440178" }}>
										Next
									</Button>
								</Button.Group>
							</div>
							<ConfirmPopup
								isDeleteConfirm={isDeleteConfirm}
								setIsDeleteConfirm={setIsDeleteConfirm}
								setIsDeleteCancelled={setIsDeleteCancelled}
								data={ConfirmPopupData}
								setConfirmResult={setConfirmResult}
								cancelBtnTitle={cancelBtnTitle}
								confirmBtnTitle={confirmBtnTitle}
								ConfirmModal={submitDelete}
								itemId={itemId}
							/>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}

export default Education;
