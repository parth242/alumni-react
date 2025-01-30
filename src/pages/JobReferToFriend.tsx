import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Loader from "components/layout/loader";
import { Toaster } from "react-hot-toast";
import { useAppState } from "utils/useAppState";
import Modal from "components/layout/modal";
import { classNames } from "utils";
import { SuccessToastMessage, useUserData } from "api/services/user";
import { sendEmail } from "api/services/jobService";
import { useNavigate } from "react-router-dom";
import Icon from "utils/icon";
import { pageStartFrom } from "utils/consts";
import { HTTPError } from "ky";
import InputCustom from "components/ui/common/InputCustom";
import { Select } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IJob, TMailFormData } from "utils/datatypes";

type RequestType = {
	openReferToFriend: boolean;
	setOpenReferToFriend: (fl: boolean) => void;
	job: IJob;
};

const JobReferToFriend: React.FC<RequestType> = ({
	openReferToFriend,
	setOpenReferToFriend,
	job,
}) => {
	const cancelButtonRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<boolean | null>(null);
	const [successMessage, setSuccessMessage] = useState<boolean | null>(null);
	const navigate = useNavigate();
	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [selectedDepartment, setSelectedDepartment] = useState<number>(0);
	const [selectedEndYear, setSelectedEndYear] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 11 });
	const schema = yup.object().shape({
		recipients: yup
			.array()
			.of(yup.string().email("Invalid email address"))
			.min(1, "Please select at least one recipient")
			.required("Recipients are required"),
		subject: yup
			.string()
			/* .test("not-default-value", "Subject is required", value => {
				if (!value || value.trim() === `${job?.job_title} :`) {
					return false;
				}
				return true;
			}) */
			.required("Subject is required"),
		message: yup.string().required("Message is required"),
	});

	const {
		register,
		handleSubmit,
		trigger,
		setValue,
		getValues,
		reset,
		formState: { errors },
	} = useForm<TMailFormData>({
		resolver: yupResolver(schema),
	});

	const {
		isLoading: isUserLoading,
		data: userList,
		refetch: fetchUserList,
		isFetching: isFetchingUserList,
	} = useUserData({
		enabled: true,
		filter_status: "",
		filter_name: "",
		filter_course: 0,
		filter_department: 0,
		filter_endyear: 0,
		page_number: 1,
		page_size: 1000,
		isalumni: 1,
	});

	useEffect(() => {
		if (openReferToFriend) {
			fetchUserList();
		}
	}, [openReferToFriend]);

	useEffect(() => {
		if (openReferToFriend) {
			setValue("subject", `${job?.job_title} :`);
		}
	}, [openReferToFriend, job?.job_title, setValue]);

	const { isLoading, mutate } = useMutation(sendEmail, {
		onSuccess: async () => {
			setSuccess(true);
			setLoading(false);
			reset();
			SuccessToastMessage({
				title: "Email send successfully.",
				id: "email_send",
			});
			setOpenReferToFriend(false);
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

	const shareUrl = window.location.href;
	const submitEmail = (data: TMailFormData) => {
		setLoading(true);
		data.job_id = Number(job.id);
		data.share_url = shareUrl;
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			data.user_id = Number(items.id);
		}
		mutate(data);
	};

	
	const recipients = getValues("recipients");
	return (
		<div className="text-sm">
			<Toaster
				toastOptions={{ duration: 5000, className: "dark:bg-dark1" }}
			/>
			
			<Modal
				openModal={openReferToFriend}
				setOpenModal={setOpenReferToFriend}
				size={"xs"}>
				<React.Fragment>
					<div className="p-4 text-sm">
						<div className="text-lg font-medium text-gray-900 dark:text-darkPrimary">
							Refer to Friend
							<button
								autoFocus={true}
								type="button"
								className="float-right text-gray-400 hover:text-gray-500"
								data-modal-toggle="defaultModal"
								onClick={() => {
									setOpenReferToFriend(false);
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
					<form
						onSubmit={handleSubmit((data: TMailFormData) =>
							submitEmail(data),
						)}
						noValidate
						className="text-sm">
						<div className="flex p-4 text-gray-700 dark:text-darkPrimary">
							<div className="w-full">
								<div className="-space-y-px rounded-md">
									<div className="grid grid-cols-1 gap-0">
										<div className="relative mb-2">
											<label
												htmlFor="recipients"
												className="block text-sm font-medium leading-6 mb-2">
												<span className="text-red-500">
													*
												</span>{" "}
												To
											</label>
											<Select
												showSearch
												mode="multiple"
												size="large"
												placeholder="Please select"
												style={{ width: "100%" }}
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
													setValue(
														"recipients",
														value,
													);
												}}
												options={userList?.data.map(
													(user: any) => ({
														value: user.email,
														label: user.first_name+' '+user?.last_name,
													}),
												)}
											/>
											{errors.recipients && (
												<p className="text-red-500 text-sm">
													{errors.recipients.message}
												</p>
											)}
										</div>
										<div className="relative mb-2">
											<InputCustom
												label="* Subject"
												name="subject"
												type="text"
												placeholder="Enter subject"
												register={register}
												trigger={trigger}
												error={errors.subject?.message}
											/>
										</div>
										<div className="relative mb-2">
											<label
												htmlFor="message"
												className="block text-sm font-medium leading-6 mb-2">
												<span className="text-red-500">
													*
												</span>{" "}
												Your Message
											</label>
											<textarea
												{...register("message")}
												rows={5}
												className="block py-1.5 shadow-sm ring-inset ring-gray-300 focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:leading-6 dark:bg-slate-800 px-3 w-full p-2 rounded-lg border ring-0 border-gray-300 dark:border-border-dark outline-none text-gray-900 placeholder:text-gray-400 sm:text-sm dark:ring-border-dark dark:bg-transparent dark:text-white"
												defaultValue={""}
											/>
											{errors.message && (
												<p className="text-red-500 text-sm">
													{errors.message.message}
												</p>
											)}
										</div>
									</div>
								</div>
								{loading && <Loader></Loader>}
								<div className="relative flex justify-end gap-5 inline-block w-full">
									<button
										onClick={() => {
											reset();
											setOpenReferToFriend(false);
										}}
										className={classNames(
											"group",
											"relative",
											"flex",
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
										Send Email
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
