import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Loader from "components/layout/loader";
import { Toaster } from "react-hot-toast";
import { useAppState } from "utils/useAppState";
import Modal from "components/layout/modal";
import { classNames } from "utils";
import { SuccessToastMessage, useUserData } from "api/services/user";
import { useNavigate } from "react-router-dom";
import Icon from "utils/icon";
import {
	allowedFiles,
	fileInvalid,
	filesExt,
	filesLimit,
	filesSize,
	pageStartFrom,
} from "utils/consts";
import { HTTPError } from "ky";
import InputCustom from "components/ui/common/InputCustom";
import { Select } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IUser, TApplyJobFormData } from "utils/types/user-types";
import { useProfessionalskills } from "api/services/professionalskillService";
import { createJobApplication } from "api/services/jobApplicationService";
import { TJobApplicationFormData } from "utils/datatypes";
import axios, { AxiosResponse } from "axios";
import { useResumeAttachments } from "api/services/resumeattachmentService";

type RequestType = {
	openApplyForJob: boolean;
	setOpenApplyForJob: (fl: boolean) => void;
	job_id: number;
};

const JobReferToFriend: React.FC<RequestType> = ({
	openApplyForJob,
	setOpenApplyForJob,
	job_id,
}) => {
	if (!job_id) {
		console.error("Job ID is missing!");
		return null;
	}
	const [myuser, setMyUser] = useState<IUser | null>();
	const cancelButtonRef = useRef(null);
	const [selectedSkills, setSelectedSkills] = useState<
		{ id: number; name: string }[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<boolean | null>(null);
	const [successMessage, setSuccessMessage] = useState<boolean | null>(null);
	const [selectedResume, setSelectedResume] = useState<string>("");
	const [resumeOption, setResumeOption] = useState<string>("select");
	const schema = yup.object().shape({
		full_name: yup
			.string()
			.required("Full Name is required")
			.min(3, "Full Name must be at least 3 characters"),
		email_address: yup
			.string()
			.email("Invalid email format")
			.required("Email Address is required"),
		mobile_number: yup
			.string()
			.matches(/^\d{10}$/, "Mobile Number must be 10 digits")
			.required("Mobile Number is required"),
		current_company: yup.string().required("Current Company is required"),
		designation: yup.string().required("Designation is required"),
		total_years_of_experience: yup
			.number()
			.positive("Experience must be a positive number")
			.required("Total Years of Experience is required")
			.min(1, "Experience must be at least 1 year")
			.max(100, "Experience cannot exceed 100 years"),
		relevant_skills: yup
			.array()
			.of(yup.string())
			.min(1, "At least one skill must be selected")
			.required("Relevant skills are required"),
		resume: yup.string().required("Resume are required"),
	});

	const {
		register,
		handleSubmit,
		trigger,
		setValue,
		getValues,
		reset,
		formState: { errors },
	} = useForm<TJobApplicationFormData>({
		resolver: yupResolver(schema),
		defaultValues: {
			full_name: myuser
				? `${myuser.first_name} ${myuser.middle_name} ${myuser.last_name}`
				: "",
			email_address: myuser ? myuser.email : "",
			mobile_number: myuser ? myuser.mobileno : "",
		},
	});
	const { data: jobSkillsData, refetch: fetchJobSkillsData } =
		useProfessionalskills({
			enabled: false,
			filter_status: "",
			page_number: 1,
			page_size: 10,
			filter_name: "",
		});
	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);

			setValue(
				"full_name",
				`${items.first_name} ${items.middle_name} ${items.last_name}`,
			);
			setValue("email_address", items.email);
			setValue("mobile_number", items.mobileno);
		}
	};

	useEffect(() => {
		
			getUserData();
			fetchJobSkillsData();
					
	}, []);

	useEffect(() => {
		if (openApplyForJob) {
			
			fetchJobSkillsData();
			fetchAttachmentList();
		}
	}, [openApplyForJob]);

	const {
		isLoading: isatttachmentLoading,
		data: attachmentList,
		refetch: fetchAttachmentList,
		isFetching: isFetchingAttachmentList,
	} = useResumeAttachments({
		enabled: Number(myuser?.id) > 0,
		filter_user: Number(myuser?.id),
	}) || [];

	

	useEffect(() => {
		fetchJobSkillsData();
		return () => {
			return;
		};
	}, []);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [image, setImage] = useState<File | null>(null);

	const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setValue("resume", file.name);
			trigger("resume");
			const ext: string | null = (
				file.name.split(".").pop() || ""
			).toLowerCase();
			setImage(null);
			if (filesExt["document"].indexOf(ext) < 0) {
				setErrorMessage(fileInvalid["document"]);
				return true;
			} else if (file?.size > filesSize["document"]) {
				setErrorMessage(
					`File size limit: The image you tried uploading exceeds the maximum file size (${filesLimit["document"]}) `,
				);
			} else {
				setImage(file);
			}
		}
	};

	const saveResume = async () => {
		try {
			if (resumeOption === "upload" && image) {
				let uploadConfig: AxiosResponse | null = null;
				const selectedFile = (image as File) || "";
				if (selectedFile) {
					const response = await axios.get(
						import.meta.env.VITE_BASE_URL +
							"api/v1/upload?type=resume&filename=" +
							selectedFile.name,
					);
					if (response.status === 200) {
						uploadConfig = response.data;
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
								},
							},
						);
						setValue("resume", uploadConfig?.data?.key);
					}
				}
			} else if (resumeOption === "select" && selectedResume) {
				// Handle the "select" option
				setValue("resume", selectedResume); // Save to the database only
			}
		} catch (error) {
			return;
		}
	};

	const { isLoading, mutate } = useMutation(createJobApplication, {
		onSuccess: async () => {
			setSuccess(true);
			setLoading(false);
			// setValue("full_name", "");
			// setValue("email_address", "");
			// setValue("mobile_number", "");
			setValue("current_company", "");
			setValue("designation", "");
			setValue("total_years_of_experience", 0);
			setValue("relevant_skills", []);
			setValue("note", "");
			reset();

			SuccessToastMessage({
				title: "Job Application Save successfully.",
				id: "job_application",
			});
			setOpenApplyForJob(false);
		},
		onError: async (err: HTTPError) => {
			setLoading(false);
			const error = await err.response.text();
			if (err.response.status === 401 || err.response.status === 400) {
				setSuccessMessage(JSON.parse(error).message);
				setTimeout(() => {
					setSuccessMessage(null);
				}, 4000);
			}
			setSuccess(false);
		},
	});

	const applyJobSubmit = async (data: TJobApplicationFormData) => {
		await saveResume();
		const skillNames = selectedSkills.map(skill => skill.name);

		const submissionData = {
			...data,
			relevant_skills: skillNames,
			resume: getValues("resume") || "",
			apply_type: "Applied",
			job_id,
			user_id: myuser?.id ? Number(myuser.id) : -1,
		};
		setLoading(true);
		mutate(submissionData);
	};

	return (
		<div className="text-sm">
			<Toaster
				toastOptions={{ duration: 5000, className: "dark:bg-dark1" }}
			/>
			
			<Modal
				openModal={openApplyForJob}
				setOpenModal={setOpenApplyForJob}
				size={"md"}>
				<React.Fragment>
					<div className="p-4 text-sm">
						<div className="text-lg font-medium text-gray-900 dark:text-darkPrimary">
							Apply For Job
							<button
								autoFocus={true}
								type="button"
								className="float-right text-gray-400 hover:text-gray-500"
								data-modal-toggle="defaultModal"
								onClick={() => {
									reset();
									setSelectedResume("");
									setImage(null);
									setOpenApplyForJob(false);
								}}
								ref={cancelButtonRef}>
								<Icon
									icon="x-mark"
									className="h-6 w-6 "
									aria-hidden="true"></Icon>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
					</div>
					<hr className="dark:border-dark3" />
					{loading && <Loader></Loader>}
					<form
						onSubmit={handleSubmit(
							(data: TJobApplicationFormData) => {
								applyJobSubmit(data);
							},
						)}
						noValidate
						className="text-sm">
						<div className="flex p-4 text-gray-700 dark:text-darkPrimary">
							<div className="w-full">
								<div className="-space-y-px rounded-md">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
										<div className="relative mb-2">
											<InputCustom
												label="* Full Name"
												name="full_name"
												placeholder="Full Name"
												className="py-0"
												register={register}
												trigger={trigger}
												error={
													errors.full_name?.message
												}
											/>
										</div>
										<div className="relative mb-2">
											<InputCustom
												label="* Email Address"
												name="email_address"
												placeholder="Email Address"
												register={register}
												trigger={trigger}
												error={
													errors.email_address
														?.message
												}
											/>
										</div>
										<div className="relative mb-2">
											<InputCustom
												label="* Mobile Number"
												name="mobile_number"
												placeholder="Mobile Number"
												register={register}
												trigger={trigger}
												error={
													errors.mobile_number
														?.message
												}
											/>
										</div>
										<div className="relative mb-2">
											<InputCustom
												label="* Current Company"
												name="current_company"
												placeholder="Current Company"
												register={register}
												trigger={trigger}
												error={
													errors.current_company
														?.message
												}
											/>
										</div>
										<div className="relative mb-2">
											<InputCustom
												label="* Designation"
												name="designation"
												placeholder="Designation"
												register={register}
												trigger={trigger}
												error={
													errors.designation?.message
												}
											/>
										</div>
										<div className="relative mb-2">
											<InputCustom
												type="number"
												label="* Total Years of Experience"
												name="total_years_of_experience"
												placeholder="Total Years of Experience"
												register={register}
												trigger={trigger}
												error={
													errors
														.total_years_of_experience
														?.message
												}
											/>
										</div>
										<div className="relative mb-2 md:col-span-2">
											<label
												htmlFor="relevant_skills"
												className="block text-sm font-medium leading-6 mb-2">
												<span className="text-red-500">
													*
												</span>{" "}
												Relevant Skills
											</label>
											<Select
												showSearch
												mode="tags"
												size="large"
												placeholder="Select Skills"
												optionFilterProp="label"
												filterSort={(
													optionA,
													optionB,
												) =>
													(optionA?.label ?? "")
														.toLowerCase()
														.localeCompare(
															(
																optionB?.label ??
																""
															).toLowerCase(),
														)
												}
												onChange={value => {
													// Capture the selected skills (both from the dropdown and new ones)
													const selectedSkillDetails =
														value
															.map(
																(
																	skillId: string,
																) => {
																	const skillFromData =
																		jobSkillsData?.data?.find(
																			(
																				skill: any,
																			) =>
																				skill.id ===
																				skillId,
																		);

																	if (
																		skillFromData
																	) {
																		return {
																			id: skillFromData.id,
																			name: skillFromData.skill_name,
																		};
																	} else {
																		// Handle new skills (entered manually)
																		return {
																			id: skillId, // You can choose to generate a unique id if needed
																			name: skillId,
																		};
																	}
																},
															)
															.filter(
																(skill: any) =>
																	skill.name !==
																	"",
															);

													// Update the selected skills and form value for relevant_skills
													setSelectedSkills(
														selectedSkillDetails,
													);
													setValue(
														"relevant_skills",
														selectedSkillDetails.map(
															(skill: any) =>
																skill.name,
														),
													);

													// Trigger validation for relevant_skills
													trigger("relevant_skills");
												}}
												options={jobSkillsData?.data?.map(
													(skill: any) => ({
														value: skill.id,
														label: skill.skill_name,
													}),
												)}
												className="rounded-md border-2 border-gray-300"
												style={{ width: "100%" }}
											/>

											{errors.relevant_skills && (
												<p className="text-red-500 text-sm">
													{
														errors.relevant_skills
															.message
													}
												</p>
											)}
										</div>
										<div className="relative my-2 md:col-span-2">
											<label className="block text-sm font-medium leading-6 mb-2">
												<span className="text-red-500">
													*
												</span>{" "}
												Resume
											</label>
											<div className="flex items-center cursor-pointer space-x-4">
												<div>
													<input
														type="radio"
														id="uploadResume"
														name="resumeOption"
														value="upload"
														checked={
															resumeOption ===
															"upload"
														}
														onChange={() => {
															setResumeOption(
																"upload",
															);
															setSelectedResume(
																"",
															);
															setValue(
																"resume",
																"",
															);
														}}
													/>
													<label
														htmlFor="uploadResume"
														className="ml-2">
														Upload New Resume
													</label>
												</div>
												<div>
													<input
														type="radio"
														id="selectResume"
														name="resumeOption"
														value="select"
														checked={
															resumeOption ===
															"select"
														}
														onChange={() => {
															setResumeOption(
																"select",
															);
															setSelectedResume(
																"",
															);
															setValue(
																"resume",
																"",
															);
														}}
													/>
													<label
														htmlFor="selectResume"
														className="ml-2">
														Select Existing Resume
													</label>
												</div>
											</div>
											{resumeOption === "upload" && (
												<div className="max-w-[50%]">
													<input
														id="resume"
														type="file"
														className="mt-1 block w-full text-sm text-gray-500"
														accept={`${allowedFiles["document"]}`}
														onChange={
															handleResumeChange
														}
													/>
												</div>
											)}
											{resumeOption === "select" && (
												<div className="mt-2">
													<label
														htmlFor="existingResume"
														className="block text-sm font-medium mb-1">
														Select a Resume:
													</label>
													<select
														id="existingResume"
														className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
														value={selectedResume}
														onChange={e => {
															setSelectedResume(
																e.target.value,
															);
															setValue(
																"resume",
																e.target.value,
															);
															trigger("resume");
														}}>
														<option value="">
															-- Select a Resume
															--
														</option>
														{attachmentList?.data.map(
															resume => (
																<option
																	key={
																		resume.id
																	}
																	value={
																		resume.attachment_file
																	}>
																	{
																		resume.resume_title
																	}
																</option>
															),
														)}
													</select>
													{selectedResume && (
														<p className="mt-2 text-sm text-gray-600">
															Selected Resume:{" "}
															{selectedResume}
														</p>
													)}
												</div>
											)}
										</div>
										<div className="relative my-2 md:col-span-2">
											<label
												htmlFor="note"
												className="block text-sm font-medium leading-6 mb-2">
												<span className="text-red-500">
													*
												</span>{" "}
												Note
											</label>
											<textarea
												{...register("note")}
												rows={5}
												className="block py-1.5 shadow-sm ring-inset ring-gray-300 focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:leading-6 dark:bg-slate-800 px-3 w-full p-2 rounded-lg border ring-0 border-gray-300 dark:border-border-dark outline-none text-gray-900 placeholder:text-gray-400 sm:text-sm dark:ring-border-dark dark:bg-transparent dark:text-white"
												defaultValue={""}
											/>
										</div>
									</div>
								</div>
								<div className="relative flex justify-end gap-5 inline-block w-full">
									<button
										onClick={() => {
											reset();
											setSelectedResume("");
											setImage(null);
											setOpenApplyForJob(false);
										}}
										className={classNames(
											"group",
											"relative",
											"flex",
											"mt-2",
											"justify-center",
											"rounded-md",
											"border",
											"border-transparent",
											"bg-primary",
											"px-4",
											"py-2",
											"font-medium",
											"text-white",
											"hover:bg-primary",
											"focus:outline-none",
											"focus:ring-2",
											"focus:ring-primary",
											"focus:ring-offset-2",
										)}>
										Cancel
									</button>
									<button
										type="submit"
										className={classNames(
											"group",
											"relative",
											"flex",
											"mt-2",
											"justify-center",
											"rounded-md",
											"border",
											"border-transparent",
											"bg-primary",
											"px-4",
											"py-2",
											"font-medium",
											"text-white",
											"hover:bg-primary",
											"focus:outline-none",
											"focus:ring-2",
											"focus:ring-primary",
											"focus:ring-offset-2",
										)}>
										Upload Resume
									</button>
									{success === false && successMessage && (
										<span className="mt-8 text-primary">
											{successMessage}
										</span>
									)}
								</div>
							</div>
						</div>
					</form>
				</React.Fragment>
			</Modal>
		</div>
	);
};

export default JobReferToFriend;
