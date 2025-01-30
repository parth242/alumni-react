import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import ProfileHeader from "components/layout/profileheader";
import ProfileSidebar from "components/layout/profilesidebar";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
	useUploadImage,
} from "api/services/user";
import {
	CustomerType,
	IUser,
	TResumeFormData,
	ConfirmPopupDataType,
} from "utils/datatypes";
import {
	useResumeAttachments,
	saveResumeAttachment,
	deleteResumeAttachment,
} from "api/services/resumeattachmentService";
import {
	patterns,
	allowedFiles,
	fileInvalid,
	filesExt,
	filesLimit,
	filesSize,
} from "utils/consts";
import { HTTPError } from "ky";
import { InputProfile } from "components/ui/common/InputProfile";
import Select from "components/ui/common/Select";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ConfirmPopup from "components/ui/ConfirmPopup";
import { EditResume } from "components/ui/EditResume";
import { Button, Card } from "flowbite-react";
import axios, { AxiosResponse } from "axios";

function ResumeAttachments() {
	const navigate = useNavigate();

	const EmailSchema = yup.object().shape({
		resume_title: yup.string().required("Title is required."),
		attachment_type: yup.string().required("Please Select Attachment Type"),
		attachment_file: yup.string().required("Please upload attachment file"),
	});

	const {
		register,
		trigger,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<TResumeFormData>({
		resolver: yupResolver(EmailSchema),
	});

	const [userData, setUserData] = useState<TResumeFormData | null>();
	const [myuser, setMyUser] = useState<IUser | null>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [uploadData, setUploadData] = useState<FormData | null>();
	const [userId, setUserId] = useState(0);

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setUserId(items.id);
			setMyUser(items);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	const {
		isLoading,
		data: attachmentList,
		refetch: fetchAttachmentList,
		isFetching: isFetchingAttachmentList,
	} = useResumeAttachments({
		enabled: userId > 0,
		filter_user: userId,
	}) || [];

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

	const yearexp = Array.from({ length: 65 }, (_, index) => index);

	const [yearexperience] = useState(
		yearexp.map(yeare => ({
			text: yeare !== 0 ? yeare : "-Select-",
			value: yeare,
		})),
	);

	const [attachmentType] = useState([
		{ text: "Resume", value: "Resume" },
		{ text: "Matrimony Profile", value: "Matrimony Profile" },
		{ text: "Published Work", value: "Published Work" },
	]);

	const [image, setImage] = useState<File | null>(null);

	const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const ext = (file.name.split(".").pop() || "").toLowerCase();
			setErrorMessage(""); // Clear previous errors
			if (!filesExt["document"].includes(ext)) {
				setErrorMessage(fileInvalid["document"]);
				return;
			} else if (file.size > filesSize["document"]) {
				setErrorMessage(
					`File exceeds size limit of ${filesLimit["document"]}`,
				);
				return;
			}
			setImage(file);
			setValue("attachment_file", file.name); // Update the form value
		}
	};

	const saveResume = async () => {
		try {
			let uploadConfig: AxiosResponse | null = null;
			const selectedFile = (image as File) || "";
			console.log("selectedFile", selectedFile);
			if (selectedFile) {
				const response = await axios.get(
					import.meta.env.VITE_BASE_URL +
						"api/v1/upload?type=resume&filename=" +
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
					setValue("attachment_file", uploadConfig?.data?.key);
				}
			}
		} catch (error) {
			return;
		}
	};

	const onSubmit = async (data: TResumeFormData) => {
		await saveResume();
		// try {
		// Call uploadFile and wait for it to finish
		// const newData = uploadFile({ data: uploadData });

		// Once upload is done, set the user_id
		data.user_id = Number(myuser?.id);

		// setTimeout(() => {
		data.attachment_file = getValues("attachment_file");
		mutate(data);
		// }, 500);
		// Now mutate the data
		// } catch (error) {
		// console.error("Error during file upload:", error);
		// Handle error appropriately
		// }
	};

	// Assuming useUploadImage is a function to handle image upload
	const { mutate: uploadFile, isLoading: uploadIsLoading } = useMutation(
		useUploadImage,
		{
			onSuccess: async (data: any) => {
				console.log("data.files", data);
				setValue("attachment_file", data.files[0].filename);
				setErrorMessage("");
			},
			onError: async (e: HTTPError) => {
				setValue("attachment_file", "");
				setErrorMessage(
					"File upload failed. Please check your internet connection and try again.",
				);
			},
		},
	);

	const { mutate, isError, error } = useMutation(saveResumeAttachment, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Resume/Attachment Added Successfully",
				id: "resume_user_success",
			});

			reset();
			fetchAttachmentList();
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "resume_user" });
		},
	});
	const [isOpen, setIsOpen] = useState(false);
	const [itemId, setItemId] = useState(0);
	const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
	const [IsDeleteCancelled, setIsDeleteCancelled] = useState(false);
	const [ConfirmResult, setConfirmResult] = useState(false);
	const [cancelBtnTitle, setcancelBtnTitle] = useState("Cancel");
	const [confirmBtnTitle, setconfirmBtnTitle] = useState("Confirm");

	const ConfirmPopupData: ConfirmPopupDataType = {
		title: "Resume/Attachment Delete",
		text: "Are you sure you want to delete Resume/Attachment?",
	};

	const { mutate: deleteItem } = useMutation(deleteResumeAttachment, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Delete Resume/Attachment Successfully",
				id: "delete_resume_success",
			});
			fetchAttachmentList();
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "delete_resume" });
		},
	});

	const submitDelete = (itemId: any) => {
		deleteItem(itemId);
		setIsDeleteConfirm(false);
	};
	// Handle the displaying of the modal based on type and id
	const showDeleteModal = (itemId: any) => {
		setItemId(itemId);

		setIsDeleteConfirm(true);
	};

	interface ItemVisibility {
		[key: number]: boolean;
	}

	const [itemVisibility, setItemVisibility] = useState<ItemVisibility>({});

	// Function to toggle visibility of an item by its ID
	const toggleItemVisibility = (itemId: any) => {
		setItemId(itemId);

		setIsOpen(true);
	};

	return (
		<>
			<SiteNavbar />
			<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
				<div className="md:w-56">
					{/* Sidebar */}
					<ProfileSidebar />
				</div>
				<div className="w-full px-10 min-h-screen">
					<h1 className=" text-3xl my-7 font-semibold">
						Upload Attachments
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
							Resume, Matrimony Profile, Published Works and other
							attachments can be uploaded. Maximum of 5
							attachments are allowed
						</p>
					</div>
					<div className="mt-10">
						<form
							className="flex flex-col gap-4 mt-10"
							onSubmit={handleSubmit((data: TResumeFormData) =>
								onSubmit(data),
							)}>
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Title
									</label>
									<InputProfile
										placeholder="Enter Title"
										name={"resume_title"}
										register={register}
										error={errors?.resume_title?.message}
										className="w-full text-sm h-11 border-gray-100"
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Attachment Type
									</label>
									<Select
										name={"attachment_type"}
										items={attachmentType}
										error={errors?.attachment_type?.message}
										register={register}
										className="w-full text-sm h-11 border-gray-100"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<input
										id="attachment_file"
										type="file"
										onChange={handleResumeChange}
										accept={`${allowedFiles["document"]}`}
									/>
									<p className="text-sm mt-4">
										*(Allowed file types: doc, docx, pdf)
									</p>
									<p className="text-sm">
										*File size should be less than 2mb
									</p>
									{errorMessage && (
										<div className="error-message text-red-500">
											{errorMessage}
										</div>
									)}
									{errors?.attachment_file && (
										<div className="error-message text-red-500">
											{errors?.attachment_file?.message}
										</div>
									)}
								</div>
								<div className="w-full flex space-x-4">
									<div className="mr-4">
										<label
											htmlFor="period"
											className="mb-1 font-semibold">
											Show on profile? :
										</label>
										<p className="text-sm">
											(Only to members)
										</p>
									</div>
									<div className="flex ">
										<input
											type="radio"
											id="show_on_profile1"
											value="Yes"
											className="form-radio h-5 w-5 text-blue-600"
											checked
											{...register(`show_on_profile`)}
										/>
										<label
											htmlFor="show_on_profile1"
											className="ml-2">
											Yes
										</label>
									</div>
									<div className="flex ">
										<input
											type="radio"
											id="show_on_profile2"
											value="No"
											className="form-radio h-5 w-5 text-blue-600"
											{...register(`show_on_profile`)}
										/>
										<label
											htmlFor="show_on_profile2"
											className="ml-2">
											No
										</label>
									</div>
								</div>
							</div>
							<div>
								<div className="flex space-x-4 mb-6">
									<Button
										style={{ backgroundColor: "#440178" }}
										outline
										type="submit">
										Upload
									</Button>
								</div>
							</div>
						</form>
						<div className="space-x-4 mb-6">
							<h2 className="text-xl">Resumes</h2>
						</div>

						<Card className="w-full mb-10">
							<div className="flow-root">
								<>
									{attachmentList &&
									attachmentList?.data &&
									attachmentList?.data?.length
										? attachmentList?.data?.map(
												(
													item: TResumeFormData,
													i: number,
												) => {
													return (
														<>
															<ul className="divide-y divide-gray-200 dark:divide-gray-700">
																<li
																	key={
																		item.id
																	}
																	className="py-3 sm:py-4">
																	<div className="flex items-center space-x-4">
																		<div className="min-w-0 flex-1">
																			<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
																				{
																					item.resume_title
																				}

																				:{" "}
																				<Link
																					to={
																						import.meta
																							.env
																							.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
																						item.attachment_file
																					}
																					className="btn btn-xs btn-link underline mr-2"
																					target="_blank">
																					View
																				</Link>
																			</p>
																		</div>
																		<div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
																			<Button.Group>
																				<Button
																					onClick={() =>
																						toggleItemVisibility(
																							item.id,
																						)
																					}
																					outline
																					style={{
																						backgroundColor:
																							"#440178",
																					}}>
																					Edit
																				</Button>
																				<Button
																					onClick={() =>
																						showDeleteModal(
																							item.id,
																						)
																					}
																					outline
																					style={{
																						backgroundColor:
																							"#440178",
																					}}>
																					Delete
																				</Button>
																			</Button.Group>
																		</div>
																	</div>
																</li>
															</ul>
															{isOpen &&
																itemId ===
																	item.id && (
																	<>
																		<EditResume
																			resume={
																				item
																			}
																			isOpen={
																				isOpen
																			}
																			setIsOpen={
																				setIsOpen
																			}
																		/>
																	</>
																)}
														</>
													);
												},
										  )
										: ""}
								</>
							</div>
						</Card>
						<div>
							<div className="flex space-x-4 mb-6">
								<Button.Group>
									<Button
										onClick={() =>
											navigate("/profile/achievement")
										}
										outline
										style={{
											backgroundColor: "#440178",
										}}>
										Prev
									</Button>
									<Button
										onClick={() =>
											navigate("/profile/account")
										}
										outline
										style={{
											backgroundColor: "#440178",
										}}>
										Next
									</Button>
								</Button.Group>
							</div>
						</div>
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
				</div>
			</div>
		</>
	);
}

export default ResumeAttachments;
