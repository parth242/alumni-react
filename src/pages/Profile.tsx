import SiteNavbar from "components/layout/sitenavbar";
import { Button, Card, Progress } from "flowbite-react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppState } from "utils/useAppState";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getUserDetails,
	sendMessageAlumni,
} from "api/services/user";
import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState, Fragment, useRef } from "react";
import { useMutation } from "react-query";
import { HTTPError } from "ky";
import Icon from "utils/icon";
import { Input } from "components/ui/common/Input";
import Textarea from "components/ui/common/Textarea";
import {
	endDateWithSuffix,
	formatDateWithSuffix,
} from "components/ui/NewsItem";
import { IExperience, IEducation, TResumeFormData } from "utils/datatypes";
import { getExperience } from "api/services/companyService";
import { useEducations } from "api/services/educationService";
import { useResumeAttachments } from "api/services/resumeattachmentService";
import { MdLegendToggle } from "react-icons/md";

function Profiles() {
	const { id } = useParams() as {
		id: string;
	};

	const [experienceData, setExperienceData] = useState<IExperience | null>();
	const [isMessageConfirm, setIsMessageConfirm] = useState(false);
	const [ConfirmResult, setConfirmResult] = useState(false);
	const cancelButtonRef = useRef(null);
	const [{ isDark }] = useAppState();

	const [IsMessageCancelled, setIsMessageCancelled] = useState(false);
	const [cancelBtnTitle, setcancelBtnTitle] = useState("Cancel");
	const [confirmBtnTitle, setconfirmBtnTitle] = useState("Send Message");

	const {
		register,
		control,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			subject: "",
			message_desc: "", // Initial item with empty values
		},
	});

	let {
		data: userDetails,
		refetch: fetchUserDetails,
		isFetching: isFetchingUserDetails,
		remove,
	} = getUserDetails({
		enabled: +id > 0,
		id: +id,
	}) || [];

	const {
		data: educationList,
		refetch: fetchEducationList,
		isFetching: isFetchingEducationList,
	} = useEducations({
		enabled: +id > 0,
		filter_user: +id,
	}) || [];

	const {
		data: attachmentList,
		refetch: fetchAttachmentList,
		isFetching: isFetchingAttachmentList,
	} = useResumeAttachments({
		enabled: +id > 0,
		filter_user: +id,
	}) || [];

	const getUserData = async () => {
		const expDataResponse = (await getExperience(
			Number(id),
		)) as IExperience;

		setExperienceData(expDataResponse);
	};

	useEffect(() => {
		if (id) {
			fetchUserDetails();
			getUserData();
			fetchEducationList();
			fetchAttachmentList();
		}
	}, [id]);

	const { isLoading, mutate, isError, error } = useMutation(
		sendMessageAlumni,
		{
			onSuccess: async (res: any) => {
				SuccessToastMessage({
					title: "Message Sent Successfully",
					id: "message_sent_success",
				});
				setConfirmResult(true);
				setIsMessageConfirm(false);
			},
			onError: async (err: HTTPError) => {
				const error = await err.response.text();
				ErrorToastMessage({ error: err, id: "message_sent" });
			},
		},
	);
	const onSubmit = (data: any) => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			data.sender_id = items.id;
		} else {
			data.sender_id = 0;
		}
		data.receiver_id = userDetails?.data.id;
		data.status = "active";
		mutate(data);
	};

	const showMessageModal = () => {
		setIsMessageConfirm(true);
	};

	console.log("userDetails", userDetails);
	return (
		<>
			<SiteNavbar></SiteNavbar>
			<div className="md:ml-44 md:mr-44">
				<Card className="w-full ">
					<div className="flow-root">
						<ul className="divide-y divide-gray-200 dark:divide-gray-700 ">
							<li className="pr-6 pl-6 sm:py-4">
								<div className="flex items-center space-x-4">
									<div className="min-w-0 flex-1">
										{/* <div className="mt-10">
											<Progress
												progress={80}
												progressLabelPosition="inside"
												textLabel="Profile Completed"
												textLabelPosition="outside"
												size="lg"
												labelProgress
												labelText
											/>
										</div> */}
										<div className="text-center mt-10 shrink-0 mb-5">
											<img
												className="h-150 w-100 object-cover object-center"
												src={
													userDetails?.data?.image
														? import.meta.env
																.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
														   userDetails?.data?.image
														: "/assets/images/profile.png"
												}
												alt="nature image"
											/>
										</div>
										<p className="flex items-center md:text-lg text-lg font-bold text-black dark:text-gray-400">
											{userDetails?.data?.first_name +
												" " +
												userDetails?.data?.last_name}
										</p>
										<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
											{
												userDetails?.data
													?.professional_headline
											}
										</p>
										<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
											{userDetails?.education.join(" | ")}
										</p>

										<div className="flex  lg:pt-4 ">
											{userDetails?.data
												?.facebook_url && (
												<div className="pr-3 align-center text-center">
													<a
														href={
															userDetails?.data
																?.facebook_url
														}
														target="_blank">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="currentColor"
															viewBox="0 0 24 24">
															<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
														</svg>
													</a>
												</div>
											)}
											{userDetails?.data?.twitter_url && (
												<div className="pr-3 align-center text-center">
													<a
														href={
															userDetails?.data
																?.twitter_url
														}
														target="_blank">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="currentColor"
															viewBox="0 0 24 24">
															<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
														</svg>
													</a>
												</div>
											)}
											{userDetails?.data
												?.linkedin_url && (
												<div className="pr-3 align-center text-center">
													<a
														href={
															userDetails?.data
																?.linkedin_url
														}
														target="_blank">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="currentColor"
															viewBox="0 0 24 24">
															<path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
														</svg>
													</a>
												</div>
											)}
											{userDetails?.data?.youtube_url && (
												<div className="pr-3 align-center text-center">
													<a
														href={
															userDetails?.data
																?.youtube_url
														}
														target="_blank">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="currentColor"
															viewBox="0 0 24 24">
															<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
														</svg>
													</a>
												</div>
											)}
											{userDetails?.data
												?.instagram_url && (
												<div className="pr-3 align-center text-center">
													<a
														href={
															userDetails?.data
																?.instagram_url
														}
														target="_blank">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="currentColor"
															viewBox="0 0 24 24">
															<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
														</svg>
													</a>
												</div>
											)}
										</div>
									</div>
									<div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
										<Button
											onClick={() => showMessageModal()}
											style={{
												backgroundColor: "#440178",
											}}
											outline
											type="button">
											Send Message
										</Button>
									</div>
								</div>
							</li>
							<li className="pr-6 pl-6 sm:py-4">
								<div className="flex items-center space-x-4">
									<div className="min-w-0 flex-1">
										<h2 className="mb-1 text-lg font-bold dark:text-white">
											Professional Details
										</h2>
										<p className="text-sm">
											<b>Experience:</b>{" "}
											{userDetails?.data?.total_experience
												? userDetails?.data
														?.total_experience
												: "0"}{" "}
											Year(s)
										</p>
										<p className="text-sm mt-1">
											<b>Roles played:</b>{" "}
											{experienceData?.workrole_name}
										</p>
										<p className="text-sm mt-1">
											<b>Industries:</b>{" "}
											{experienceData?.industry_name}
										</p>
										<p className="text-sm mt-1">
											<b className="text-gray">
												Professional Skills:
											</b>{" "}
											{experienceData?.skill_name}
										</p>
									</div>
								</div>
							</li>
							<li className="pr-6 pl-6 sm:py-4">
								<div className="flex items-center space-x-4">
									<div className="min-w-0 flex-1">
										<h2 className="mb-1 text-lg font-bold dark:text-white">
											Education Details
										</h2>
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
																<p className="text-sm">
																	<b>
																		{
																			item.university
																		}
																		:
																	</b>{" "}
																	{item.is_additional ===
																	1 ? (
																		<>
																			<span>
																				{item.degree +
																					" - " +
																					item.end_year}
																			</span>
																		</>
																	) : (
																		<>
																			<span>
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
																			</span>
																		</>
																	)}
																</p>
															</>
														);
													},
											  )
											: ""}
									</div>
								</div>
							</li>
							<li className="pr-6 pl-6 sm:py-4">
								<div className="flex items-center space-x-4">
									<div className="min-w-0 flex-1">
										<h2 className="mb-1 text-lg font-bold dark:text-white">
											Personal Information
										</h2>
										<p className="text-sm">
											<b>About me: </b>{" "}
											{userDetails?.data?.about_me}
										</p>
										<p className="text-sm mt-1">
											<b>Born On: </b>{" "}
											{userDetails?.data?.dob
												? endDateWithSuffix(
														userDetails?.data
															?.dob as string,
												  )
												: "No Answer"}
										</p>
										<p className="text-sm mt-1">
											<b>Gender: </b>{" "}
											{userDetails?.data?.gender
												? userDetails?.data?.gender
												: "No Answer"}
										</p>
										<p className="text-sm mt-1">
											<b>Relationship Status: </b>{" "}
											{userDetails?.data
												?.relationship_status
												? userDetails?.data
														?.relationship_status
												: "No Answer"}
										</p>
									</div>
								</div>
							</li>
							<li className="pr-6 pl-6 sm:py-4">
								<div className="flex items-center space-x-4">
									<div className="min-w-0 flex-1">
										<h2 className="mb-1 text-lg font-bold dark:text-white">
											Contact Details
										</h2>
										<p className="text-sm">
											<b>Lives in: </b>
											{userDetails?.data?.city
												? userDetails?.data?.city + ","
												: ""}
											{userDetails?.data?.state
												?.state_name
												? userDetails?.data?.state
														?.state_name + ","
												: ""}
											{userDetails?.data?.country
												?.country_name
												? userDetails?.data?.country
														?.country_name
												: ""}
										</p>
										<p className="text-sm mt-1">
											<b>Correspondence address: </b>
											{userDetails?.data?.city2
												? userDetails?.data?.city2 + ","
												: ""}
											{userDetails?.data?.State2
												?.state_name
												? userDetails?.data?.State2
														?.state_name + ","
												: ""}
											{userDetails?.data?.Country2
												?.country_name
												? userDetails?.data?.Country2
														?.country_name
												: ""}
										</p>
										<p className="text-sm mt-1">
											<b>Contact No.: </b>{" "}
											{"+" +
												userDetails?.data
													?.country_mobileno_code +
												"-" +
												userDetails?.data?.mobileno}
										</p>
										<p className="text-sm mt-1">
											<b>Email Address: </b>{" "}
											{userDetails?.data?.email}
											{userDetails?.data?.email_alternate
												? userDetails?.data
														?.email_alternate
												: ""}
										</p>
									</div>
								</div>
							</li>
							<li className="pr-6 pl-6 sm:py-4">
								<div className="flex items-center space-x-4">
									<div className="min-w-0 flex-1">
										<h2 className="mb-1 text-lg font-bold dark:text-white">
											Attachments
										</h2>
										<p className="text-sm">
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
																									.VITE_BASE_URL +
																								"upload/resume/" +
																								item.attachment_file
																							}
																							className="btn btn-xs btn-link underline mr-2"
																							target="_blank">
																							View
																							&
																							Download
																						</Link>
																					</p>
																				</div>
																			</div>
																		</li>
																	</ul>
																</>
															);
														},
												  )
												: ""}
										</p>
									</div>
								</div>
							</li>
							<li className="pr-6 pl-6 sm:py-4">
								<div className="flex items-center space-x-4">
									<div className="min-w-0 flex-1">
										<h2 className="mb-1 text-lg font-bold dark:text-white">
											Achievement
										</h2>
										<p className="text-sm">
											<b>GATE: </b> 500 | March 2022
										</p>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<Transition.Root show={isMessageConfirm} as={Fragment}>
						<Dialog
							as="div"
							className="relative z-40"
							initialFocus={cancelButtonRef}
							onClose={() => {
								setIsMessageConfirm(false);
								if (setIsMessageCancelled)
									setIsMessageCancelled(true);
							}}>
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100"
								leaveTo="opacity-0">
								<div className="fixed inset-0 bg-black/60 transition-opacity" />
							</Transition.Child>
							<form
								className="mt-5"
								onSubmit={handleSubmit(onSubmit)}>
								<div
									className={`${
										isDark ? "dark" : ""
									} fixed inset-0 z-10 overflow-y-auto`}>
									<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
										<Transition.Child
											as={Fragment}
											enter="ease-out duration-300"
											enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
											enterTo="opacity-100 translate-y-0 sm:scale-100"
											leave="ease-in duration-200"
											leaveFrom="opacity-100 translate-y-0 sm:scale-100"
											leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
											<Dialog.Panel className="relative w-10/12 rounded-lg bg-white text-left shadow-xl transition-all dark:bg-dark2 sm:my-8 sm:w-4/12">
												<div className="float-left inline-block w-full  px-6 pt-5 pb-4">
													<div className="text-lg font-medium text-gray-900 dark:text-darkPrimary">
														<div className="float-left w-[calc(100%-50px)] text-lg text-gray-900 dark:text-darkPrimary">
															Send Message
														</div>

														<button
															autoFocus={true}
															type="button"
															className="float-right justify-center text-gray-400 hover:text-gray-500"
															data-modal-toggle="defaultModal"
															onClick={() => {
																setIsMessageConfirm(
																	false,
																);
																if (
																	setIsMessageCancelled
																)
																	setIsMessageCancelled(
																		true,
																	);
															}}
															ref={
																cancelButtonRef
															}>
															<Icon
																icon="x-mark"
																className="h-6 w-6 "
																aria-hidden="true"></Icon>
															<span className="sr-only">
																Close modal
															</span>
														</button>
													</div>
												</div>
												<hr className="float-left inline-block w-full dark:border-dark3" />
												{/* <div className="inline-block"> */}
												<div className="mt-4 px-6 text-sm dark:text-darkPrimary">
													<Input
														{...register(
															`subject`,
															{
																required: true,
															},
														)}
														placeholder="Enter Subject"
														label="Subject"
														register={register}
													/>
													{errors?.subject && (
														<div className="text-red-600">
															<p>
																Subject is
																required.
															</p>
														</div>
													)}

													{/* Message Textarea */}
													<Textarea
														{...register(
															`message_desc`,
															{ required: true },
														)}
														placeholder="Enter Message"
														label="Message"
														register={register}
														error={
															errors?.message_desc && (
																<p>
																	Message is
																	required.
																</p>
															)
														}
													/>
												</div>
												{/* </div> */}
												<div className="mt-6 mb-4 flex flex-col-reverse gap-2 px-6 text-right sm:flex-row sm:justify-end sm:gap-0">
													{/* <button
													type="button"
													className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 dark:border-dark3 dark:bg-dark2 dark:text-darkPrimary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
													onClick={() => {
														setIsMessageConfirm(
															false,
														);
														if (
															setIsMessageCancelled
														)
															setIsMessageCancelled(
																true,
															);
													}}
													ref={cancelButtonRef}>
													{cancelBtnTitle || "Cancel"}
												</button> */}
													<button
														type="submit"
														className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1">
														Submit
														{/* </div> */}
													</button>
												</div>
											</Dialog.Panel>
										</Transition.Child>
									</div>
								</div>
							</form>
						</Dialog>
					</Transition.Root>
				</Card>

				{/* <Banner>
					<div className="flex w-full flex-col justify-between  border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row">
						<div className="mb-4 md:mb-0 md:mr-4">
							<img
								className="h-full w-full object-cover object-center"
								src="/assets/images/profile.png"
								alt="nature image"
							/>
						</div>
						<div className="mb-4 md:mt-8 md:mb-0 md:mr-4">
							<h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
								Soffiyan Khan Pathan
							</h2>
							<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
								BE 2015, Computer Science
							</p>
							<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
								Belgaum, Karnataka
							</p>
						</div>
						<div className="flex shrink-0 items-center">
							<a
								href="#"
								className="mr-3 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-cyan-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
								<FaBookOpen className="mr-2 h-4 w-4" />
								Learn more
							</a>
							<a
								href="#"
								className="mr-2 inline-flex items-center justify-center rounded-lg bg-cyan-700 px-3 py-2 text-xs font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800">
								Get started
								<HiArrowRight className="ml-2 h-4 w-4" />
							</a>
							<Banner.CollapseButton
								color="gray"
								className="border-0 bg-transparent text-gray-500 dark:text-gray-400">
								<HiX className="h-4 w-4" />
							</Banner.CollapseButton>
						</div>
					</div>
				</Banner> */}
			</div>
			{/* <div className="px-10 min-h-screen">
				<h1 className=" text-3xl my-7 font-semibold">Achievements</h1>
				<div className="mb-4 md:mb-0 md:mr-4">
					<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
						Please choose an achievement you wish to add to the
						profile.
					</p>
				</div>
				<div className="grid md:grid-cols-1 mt-10">
					<div className="flex flex-col gap-4 sm:flex-row text-sm">
						<div className="w-full">
							<Link to="/profile/add-achievements">
								<Card className="max-w-sm">
									<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
										Academic Achievements
									</h5>
									<p>Class Topper, University Topper, etc.</p>
								</Card>
							</Link>
						</div>
					</div>
				</div>
			</div> */}
		</>
	);
}

export default Profiles;
