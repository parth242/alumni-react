import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import React, { useEffect, useState, Fragment, useRef } from "react";
import { Tabs, Tab } from "components/ui/common/Tabs";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
	sendMessageAlumni,
	getUserDetails,
} from "api/services/user";
import LoginSidebar from "components/layout/loginSidebar";
import {
	CustomerType,
	IUser,
	TSelect,
	ICourse,
	MessagePopupDataType,
} from "utils/datatypes";
import NotFound from "components/ui/common/NotFound";
import { patterns, pageStartFrom } from "utils/consts";
import Icon from "utils/icon";
import { HTTPError } from "ky";
import { Form } from "components/ui/common/Form";
import { Input } from "components/ui/common/Input";
import Textarea from "components/ui/common/Textarea";
import Select from "components/ui/common/Select";
import SelectMulti from "components/ui/common/SelectMulti";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLogo from "components/layout/AuthLogo";
import { RegisterType } from "utils/types/user-types";
import { classNames } from "utils";
import Loader from "components/layout/loader";
import { useCourses, createUserCourse } from "api/services/courseService";
import MessagePopup from "components/ui/MessagePopup";

function Profile() {
	const { id } = useParams() as {
		id: string;
	};

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

	const navigate = useNavigate();
	const [loginResponse, setLoginResponse] = useState<{ company: string }>();
	const [{ user, selectedCustomer }, setAppState] = useAppState();
	const [loginSuccess, setLoginSuccess] = useState<boolean | null>(false);
	const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);
	const [customersList, setCustomersList] = useState<CustomerType[] | null>();
	const [userData, setUserData] = useState<IUser | null>();

	const cancelButtonRef = useRef(null);
	const [{ isDark }] = useAppState();

	const [courseList, setCourseList] = useState<TSelect[]>([]);

	const perPage = 3;
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(1);

	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });
	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");

	const [isMessageConfirm, setIsMessageConfirm] = useState(false);
	const [IsMessageCancelled, setIsMessageCancelled] = useState(false);
	const [ConfirmResult, setConfirmResult] = useState(false);
	const [cancelBtnTitle, setcancelBtnTitle] = useState("Cancel");
	const [confirmBtnTitle, setconfirmBtnTitle] = useState("Send Message");

	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index,
	);
	const [yearList] = useState(
		years.map(year => ({ text: year, value: year })),
	);

	const expnum = Array.from({ length: 50 }, (_, index) => index);
	const [expList] = useState(
		expnum.map(year => ({ text: year, value: year })),
	);

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
	console.log("userDetails", userDetails);
	const getUserData = async () => {
		const userDataResponse = (await getMyDetails()) as IUser;
		setUserData(userDataResponse);

		console.log("userDataResponse", userDataResponse);
		localStorage.setItem("user", JSON.stringify(userDataResponse));
		setAppState({ user: userDataResponse });
	};
	useEffect(() => {
		getUserData();
	}, []);
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
				setLoginSuccess(false);
				const error = await err.response.text();
				setLoginErrorMsg(JSON.parse(error).message);
			},
		},
	);
	const onSubmit = (data: any) => {
		data.receiver_id = userDetails?.data.id;
		data.sender_id = userData?.id;
		data.status = "active";
		mutate(data);
	};

	const proceedLogin = async () => {
		navigate("/admin/dashboard");
	};

	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (event: any) => {
		setSearchTerm(event.target.value);
	};

	const [activeTab, setActiveTab] = useState(1);

	const changeTab = (tabIndex: any) => {
		setActiveTab(tabIndex);
	};

	const { mutate: messageSend, isLoading: uploadIsLoading } = useMutation(
		sendMessageAlumni,
		{
			onSuccess: async () => {
				SuccessToastMessage({
					title: "Message sent Successfully",
					id: "message_sent_success",
				});
			},
			onError: async (e: HTTPError) => {
				// const error = await e.response.text();
				// console.log("error", error);
				ErrorToastMessage({ error: e, id: "message_sent" });
			},
		},
	);

	const showMessageModal = () => {
		setIsMessageConfirm(true);
	};

	const professionalDetails = {
		company: "Cisco Systems India Private Limited",

		role: "Software Engineer",

		experience: "5 Years",
	};

	const educationDetails = [
		{
			degree: "Master of Technology (Online)",

			institution: "Indian Institute of Science",

			years: "2022-present",
		},

		{
			degree: "BE - Computer Science & Engineering",

			institution: "Sri Jayachamarajendra College of Engineering",

			years: "2019",
		},
	];

	return (
		<>
			<SiteNavbar></SiteNavbar>
			{isLoading && <Loader></Loader>}
			<main className="profile-page">
				<section className="relative block" style={{ height: "500px" }}>
					<div
						className="absolute top-0 w-full h-full bg-center bg-cover"
						style={{
							backgroundImage:
								"url('/assets/images/banner.webp')",
						}}>
						<span
							id="blackOverlay"
							className="w-full h-full absolute opacity-50 bg-black"></span>
					</div>
					<div
						className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
						style={{ height: "70px" }}>
						<svg
							className="absolute bottom-0 overflow-hidden"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="none"
							version="1.1"
							viewBox="0 0 2560 100"
							x="0"
							y="0">
							<polygon
								className="text-gray-300 fill-current"
								points="2560 0 2560 100 0 100"></polygon>
						</svg>
					</div>
				</section>
				<section className="relative py-16 bg-gray-300">
					<div className="container mx-auto px-4">
						<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
							<div className="px-6">
								<div className="flex flex-wrap justify-center">
									<div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
										<div className="relative">
											{userDetails?.data &&
											userDetails?.data?.image ? (
												<img
													style={{
														maxWidth: "150px",
													}}
													alt="user"
													className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
													src={
														import.meta.env
															.VITE_BASE_URL +
														"upload/profile/" +
														userDetails?.data?.image
													}
												/>
											) : (
												<img
													style={{
														maxWidth: "150px",
													}}
													src="/assets/images/profile.png"
													className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
													alt="userImage"
												/>
											)}
										</div>
									</div>
									<div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
										<div className="py-6 px-3 mt-32 sm:mt-0">
											<button
												onClick={() =>
													showMessageModal()
												}
												className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
												type="button"
												style={{
													transition: "all .15s ease",
												}}>
												Send Message
											</button>
										</div>
									</div>
									<div className="w-full lg:w-4/12 px-4 lg:order-1">
										<div className="flex justify-center py-4 lg:pt-4 pt-8">
											<div className="mr-4 p-3 text-center">
												<a
													href={
														userData?.facebook_url
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
											<div className="mr-4 p-3 text-center">
												<a
													href={userData?.twitter_url}
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
											<div className="lg:mr-4 p-3 text-center">
												<a
													href={
														userData?.linkedin_url
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
											<div className="mr-4 p-3 text-center">
												<a
													href={userData?.youtube_url}
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
											<div className="lg:mr-4 p-3 text-center">
												<a
													href={
														userData?.instagram_url
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
										</div>
									</div>
								</div>
								<div className="text-center mt-12">
									<h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
										{userDetails?.data?.first_name +
											" " +
											userDetails?.data?.last_name}
									</h3>
									<div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
										<i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
										{userDetails?.data?.address1 +
											" , " +
											userDetails?.data?.city}
									</div>
									<div className="mb-2 text-gray-700 mt-2">
										<i className="fas fa-briefcase mr-2 text-lg text-gray-500"></i>
										{userDetails?.data?.position +
											" - " +
											userDetails?.data?.company_name}
									</div>
									<div className="mb-2 text-gray-700">
										<i className="fas fa-university mr-2 text-lg text-gray-500"></i>
										University of Computer Science
									</div>
								</div>
								<div className="mt-10 py-10 border-t border-gray-300 text-center">
									<div className="flex flex-wrap justify-center">
										<div className="w-full lg:w-9/12 px-4">
											<p className="mb-4 text-lg leading-relaxed text-gray-800">
												{userDetails?.data?.about_me}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
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
														ref={cancelButtonRef}>
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
													{...register(`subject`, {
														required: true,
													})}
													placeholder="Enter Subject"
													label="Subject"
													register={register}
													error={
														errors?.subject && (
															<p>
																Subject is
																required.
															</p>
														)
													}
												/>

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
			</main>
		</>
	);
}

export default Profile;
