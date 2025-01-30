import TabsComponent from "components/ui/common/TabsComponent";
import { Button, Card } from "flowbite-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "utils/icon";
import { Divider, Modal } from "antd";
import { InputProfile } from "components/ui/common/InputProfile";
import Select from "components/ui/common/Select";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getUserDetails,
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
import ConfirmPopup from "components/ui/ConfirmPopup";
import {
	HiDesktopComputer,
	HiOutlineArrowLeft,
	HiOutlinePencil,
	HiOutlinePlus,
} from "react-icons/hi";


const AlumniWorkDetails = () => {

    const { id } = useParams() as {
		id: string;
	};

	const [openWorkDetails, setOpenWorkDetails] = React.useState(false);

	const openModel = () => {
		setOpenWorkDetails(true);
	};

	const closeModel = () => {
		setOpenWorkDetails(false);
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

	const {
        trigger,
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
	
		setUserId(Number(id));		
		

		const expDataResponse = (await getExperience(Number(id))) as IExperience;
		console.log("expDataResponse",expDataResponse);

		setExperienceData(expDataResponse);
		
	};
	useEffect(() => {
		getUserData();
		
	}, []);



    let {		
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
		reset(userDetails?.data as ProHeadlineDataType);
		trigger();
	}, [userDetails]);

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
		data.id = Number(id);
		//console.log('dataprofile',data);
		// return false;
		mutate(data);
	};
	return (
		<div className="">
			<div className="inline-block w-full border-b border-border">
				<TabsComponent />
			</div>
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
						</div>
                        </form>
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
														"/admin/work-experience/"+id)
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
																						" to " }
																					{item.company_end_period==0 ? ("Present") : (item.company_end_period)}
																						
																				</p>
																			</div>
																			<div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
																				<div className="flex space-x-2">
																					<Link
																						to={
																							"/admin/work-company/"+id+"/"+
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
													"/admin/work-company/"+id)
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
					
			<Modal
				title="Add Work Details"
				open={openWorkDetails}
				// onOk={closeModel}
				footer={null}
				style={{ top: 20 }}
				onCancel={closeModel}>
				<Divider />
				<form>
					<div className="mb-4">
						<label className="mb-3 inline-block">
							Company Name
						</label>
						<InputProfile
							placeholder="Eg : Google, Microsoft"
							name={"companyName"}
							className="w-full text-sm h-11 border-gray-300"
						/>
					</div>
					<div className="mb-4">
						<label className="mb-3 inline-block">Position</label>
						<InputProfile
							placeholder="Eg : Software Developer"
							name={"position"}
							className="w-full text-sm h-11 border-gray-300"
						/>
					</div>

					<div className="mb-4">
						<label className="mb-3 inline-block">Period</label>
						<div className="flex gap-4">
							<div className="flex-1">
								<Select
									className="w-full"
									name={"start_year"}
									items={yearListStart}
								/>
							</div>
							<div className="flex-1">
								<Select
									className="w-full"
									name={"end_year"}
									items={yearListEnd}
								/>
							</div>
						</div>
					</div>
					<div className="mb-4">
						<label className="mb-3 inline-block">Location</label>
						<InputProfile
							placeholder="Eg : Bangalore"
							name={"location"}
							className="w-full text-sm h-11 border-gray-300"
						/>
					</div>
					<div className="mb-4">
						<Button
							onClick={() => {}}
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

export default AlumniWorkDetails;
