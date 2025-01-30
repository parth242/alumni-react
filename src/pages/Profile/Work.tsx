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
	updateProfessionalHead,
} from "api/services/user";
import {
	deleteWork,
	useWorks,
	getExperience,
} from "api/services/companyService";
import {
	CustomerType,
	IUser,
	TSelect,
	ProHeadlineDataType,
	ICompany,
	ConfirmPopupDataType,
	IExperience,
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
import { Button } from "flowbite-react";
import { Card } from "flowbite-react";
import {
	HiDesktopComputer,
	HiOutlineArrowLeft,
	HiOutlinePencil,
	HiOutlinePlus,
} from "react-icons/hi";

function Work() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<ProHeadlineDataType>();

	const [userData, setUserData] = useState<ProHeadlineDataType | null>();
	const [userId, setUserId] = useState(0);
	const [experienceData, setExperienceData] = useState<IExperience | null>();

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setUserId(items.id);
		
		const userDataResponse = (await getMyDetails()) as ProHeadlineDataType;
		setUserData(userDataResponse);

		const expDataResponse = (await getExperience(items.id)) as IExperience;

		setExperienceData(expDataResponse);
		}
	};
	useEffect(() => {
		getUserData();
		
	}, []);

	useEffect(() => {
		reset(userData as ProHeadlineDataType);
	}, [userData]);

	const navigate = useNavigate();

	console.log("userId", userId);
	const {
		isLoading,
		data: companyList,
		refetch: fetchCompanyList,
		isFetching: isFetchingCompanyList,
	} = useWorks({
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
		title: "Work Experience Delete",
		text: "Are you sure you want to delete Work Experience?",
	};

	const { mutate: deleteItem, isLoading: uploadIsLoading } = useMutation(
		deleteWork,
		{
			onSuccess: async () => {
				SuccessToastMessage({
					title: "Delete Work Company Successfully",
					id: "delete_company_success",
				});
				fetchCompanyList();
			},
			onError: async (e: HTTPError) => {
				// const error = await e.response.text();
				// console.log("error", error);
				ErrorToastMessage({ error: e, id: "delete_company" });
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

	const { mutate, isError, error } = useMutation(updateProfessionalHead, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Professional Headline Updated Successfully",
				id: "update_user_success",
			});
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "update_user" });
		},
	});
	const onSubmit = (data: ProHeadlineDataType) => {
		data.id = userData?.id;
		//console.log('dataprofile',data);
		// return false;
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
						Professional Details
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
							Please update work experience & professional details
							to optimize your search visibility.
						</h2>
					</div>
					<form
						className="flex flex-col gap-4 mt-10"
						onSubmit={handleSubmit(onSubmit)}>
						<div className="flex gap-4">
							<div className="w-full">
								<label className="mb-3 inline-block ">
									Professional Headline
								</label>
								<InputProfile
									placeholder="Eg: Product Engineer at Spori"
									name={"professional_headline"}
									register={register}
									className="w-full text-sm h-11 border-gray-100"
								/>
							</div>
							<div className="w-full mt-8">
								<Button
									style={{ backgroundColor: "#440178" }}
									outline
									type="submit">
									Update Profile
								</Button>
							</div>
							<div className="w-full mt-8">
								<Button.Group>
									<Button
										onClick={() =>
											navigate("/profile/education")
										}
										outline
										style={{ backgroundColor: "#440178" }}>
										Prev
									</Button>
									<Button
										onClick={() =>
											navigate("/profile/achievement")
										}
										outline
										style={{ backgroundColor: "#440178" }}>
										Next
									</Button>
								</Button.Group>
							</div>
						</div>
						<div className="mt-4">
							<Card className="w-full bg-white-200 ">
								<div className="mb-2 flex items-center justify-between ">
									<h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
										Your Overall Experience
									</h5>
								</div>
								<p>
									Please summarize work experience for alumni
									search
								</p>
								<div className="flow-root">
									<ul className="divide-y divide-gray-200 dark:divide-gray-700">
										<li className="py-3 sm:py-4 md:bg-gray-100 md:p-5">
											<div className="flex items-center space-x-4">
												<div className="min-w-0 flex-1">
													<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
														Total years of
														experience :{" "}
														{
															experienceData?.total_experience
														}{" "}
														Years
													</p>
													<p className="mt-5 truncate text-sm font-medium text-gray-900 dark:text-white">
														Roles & Responsibilities
														:{" "}
														{
															experienceData?.workrole_name
														}
													</p>
													<p className="mt-5 truncate text-sm font-medium text-gray-900 dark:text-white">
														Industries worked in :{" "}
														{
															experienceData?.industry_name
														}
													</p>
													<p className=" mt-5 truncate text-sm font-medium text-gray-900 dark:text-white">
														Professional Skills :{" "}
														{
															experienceData?.skill_name
														}
													</p>
												</div>
											</div>
											<Button
												className="mt-5"
												onClick={() =>
													navigate(
														"/profile/work/experience",
													)
												}
												outline
												style={{
													backgroundColor: "#440178",
												}}>
												<HiOutlinePencil className="mr-2 h-5 w-5" />
												Modify
											</Button>
										</li>
									</ul>
								</div>
							</Card>
						</div>
						<div className="mt-4">
							<Card className="w-full bg-white-200">
								<div className="mb-2 flex items-center justify-between ">
									<h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
										Work Experience
									</h5>
								</div>
								<p>
									Companies and Organizations associated with.
								</p>
								<div className="flow-root">
									<ul className="divide-y divide-gray-200 dark:divide-gray-700">
										<>
											{companyList &&
											companyList?.data &&
											companyList?.data?.length
												? companyList?.data?.map(
														(
															item: ICompany,
															i: number,
														) => {
															return (
																<>
																	<li className="py-3 sm:py-4 md:bg-gray-100 md:p-5">
																		<div className="flex items-center space-x-4">
																			<div className="min-w-0 flex-1">
																				<p className="flex truncate text-sm font-medium text-gray-900 dark:text-white">
																					{
																						item.company_name
																					}
																				</p>

																				<p className="mt-2 truncate text-sm text-gray-500 dark:text-gray-400">
																					{item.position +
																						"  " +
																						item.company_start_period +
																						" to " +
																						item.company_end_period}
																				</p>
																			</div>
																			<div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
																				<div className="flex space-x-2">
																					<Link
																						to={
																							"/profile/work/company/" +
																							item.id
																						}>
																						<Icon
																							icon="pencil-square-outline"
																							className="w-6 h-6 cursor-pointer"
																							data-tooltip-id="tooltip"
																							data-tooltip-content="Edit Education"
																						/>
																					</Link>

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
																			</div>
																		</div>
																	</li>
																</>
															);
														},
												  )
												: ""}
										</>
										<Button
											className="mt-5"
											onClick={() =>
												navigate(
													"/profile/work/company",
												)
											}
											outline
											style={{
												backgroundColor: "#440178",
											}}>
											<HiOutlinePlus className="mr-2 h-5 w-5" />
											Add work details
										</Button>
									</ul>
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
					</form>
				</div>
			</div>
		</>
	);
}

export default Work;
