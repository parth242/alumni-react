import React, { useEffect, useRef, useState } from "react";
import { FieldValues, useForm, useWatch } from "react-hook-form";
import { useMutation } from "react-query";
import Loader from "components/layout/loader";
import { Toaster } from "react-hot-toast";
import { useAppState } from "utils/useAppState";
import Modal from "components/layout/modal";
import { classNames } from "utils";
import { changePassword, SuccessToastMessage } from "api/services/user";
import { useNavigate } from "react-router-dom";
import Icon from "utils/icon";
import { patterns } from "utils/consts";
import { HTTPError } from "ky";
import InfoMessageMultiple from "components/ui/common/InfoMessageMultiple";

type RequestType = {
	openChangePassword: boolean;
	setOpenChangePassword: (fl: boolean) => void;
};

const ChangePassword: React.FC<RequestType> = ({
	openChangePassword,
	setOpenChangePassword,
}) => {
	const cancelButtonRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const {
		control,
		register,
		handleSubmit,
		getValues,
		setValue,
		setFocus,
		formState: { errors },
	} = useForm<FieldValues>({
		mode: "all",
	});
	const [success, setSuccess] = useState<boolean | null>(null);
	const [successMessage, setSuccessMessage] = useState<boolean | null>(null);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [setAppState] = useAppState();
	const navigate = useNavigate();

	const { isLoading, mutate } = useMutation(changePassword, {
		onSuccess: async () => {
			setSuccess(true);
			setLoading(false);
			SuccessToastMessage({
				title: "Password changed successfully please login again.",
				id: "password_change",
			});
			setOpenChangePassword(false);
			setAppState({ user: undefined });
			localStorage.removeItem("customerId");
			setTimeout(() => {
				navigate("/login");
			}, 3000);
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
	useWatch({ control });

	const submitChangePassword = (req: FieldValues) => {
		//delete req.confirm_password;
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			req.user_id = items.id;			
		}
		
		setLoading(true);
		mutate(req);
	};
	useEffect(() => {
		if (openChangePassword) {
			setTimeout(() => {
				setFocus("current_password");
			});
		}
	}, [openChangePassword]);
	useEffect(() => {
		setValue("current_password", "");
		setValue("password", "");
		setValue("confirm_password", "");
	}, []);

	return (
		<div className="text-sm">
			<Toaster
				toastOptions={{ duration: 5000, className: "dark:bg-dark1" }}
			/>
			{loading && <Loader></Loader>}
			<Modal
				openModal={openChangePassword}
				setOpenModal={setOpenChangePassword}
				size={"xs"}>
				<React.Fragment>
					<div className="p-4 text-sm">
						<div className="text-lg font-medium text-gray-900 dark:text-darkPrimary">
							Change Password
							<button
								autoFocus={true}
								type="button"
								className="float-right text-gray-400 hover:text-gray-500"
								data-modal-toggle="defaultModal"
								onClick={() => {
									setOpenChangePassword(false);
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
						onSubmit={handleSubmit((req: FieldValues) =>
							submitChangePassword(req),
						)}
						noValidate
						className="text-sm">
						<div className="flex p-4 text-gray-700 dark:text-darkPrimary">
							<div className="w-full">
								<div className="-space-y-px rounded-md">
									<div className="grid grid-cols-1 gap-0">
										<InfoMessageMultiple
											message={
												"Here’s what makes a good password:"
											}
											isIcon={true}>
											<React.Fragment>
												<li>Minimum 8 characters</li>
												<li>
													1 uppercase, 1 lowercase and
													1 digit
												</li>
											</React.Fragment>
										</InfoMessageMultiple>
										<div className="relative mb-2 mt-6">
											<label
												htmlFor="current_password"
												className="font-medium">
												Current Password
											</label>
											<input
												id="current_password"
												type={
													showCurrentPassword
														? "text"
														: "password"
												}
												required
												className={classNames(
													"relative",
													"mt-1",
													"block",
													"w-full",
													"appearance-none",
													"rounded-md",
													"border",
													"border-gray-300",
													"px-3",
													"py-2",
													"text-gray-900 dark:text-darkPrimary dark:bg-dark1 dark:border-dark3",
													"focus:z-10",
													"focus:border-primary",
													"focus:outline-none",
													"focus:ring-primary",
												)}
												defaultValue=""
												{...register(
													"current_password",
													{
														required:
															"Current Password is required",
														pattern: {
															value: patterns.PASSWORD,
															message:
																"Invalid password, Please check above criteria",
														},
													},
												)}
											/>
											{showCurrentPassword && (
												<Icon
													icon="eye"
													onClick={() =>
														setShowCurrentPassword(
															!showCurrentPassword,
														)
													}
													className="absolute top-11 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
												/>
											)}
											{!showCurrentPassword && (
												<Icon
													icon="eye-slash"
													onClick={() =>
														setShowCurrentPassword(
															!showCurrentPassword,
														)
													}
													className="absolute top-11 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
												/>
											)}
											<span className="text-xs text-red-500">
												{errors.current_password
													?.message &&
													errors.current_password?.message.toString()}
												&nbsp;
											</span>
										</div>
										<div className="relative mb-2">
											<label
												htmlFor="password"
												className="font-medium">
												New Password
											</label>
											<input
												id="password"
												type={
													showPassword
														? "text"
														: "password"
												}
												required
												className={classNames(
													"relative",
													"mt-1",
													"block",
													"w-full",
													"appearance-none",
													"rounded-md",
													"border",
													"border-gray-300",
													"px-3",
													"py-2",
													"text-gray-900 dark:text-darkPrimary dark:bg-dark1 dark:border-dark3",
													"focus:z-10",
													"focus:border-primary",
													"focus:outline-none",
													"focus:ring-primary",
												)}
												defaultValue=""
												{...register("password", {
													required:
														"Password is required",
													pattern: {
														value: patterns.PASSWORD,
														message:
															"Invalid password, Please check above criteria",
													},
												})}
											/>
											{showPassword && (
												<Icon
													icon="eye"
													onClick={() =>
														setShowPassword(
															!showPassword,
														)
													}
													className="absolute top-11 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
												/>
											)}
											{!showPassword && (
												<Icon
													icon="eye-slash"
													onClick={() =>
														setShowPassword(
															!showPassword,
														)
													}
													className="absolute top-11 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
												/>
											)}
											<span className="text-xs text-red-500">
												{errors.password?.message &&
													errors.password?.message.toString()}
												&nbsp;
											</span>
										</div>
										<div className="relative mb-2">
											<label
												htmlFor="confirm_password"
												className="font-medium">
												Confirm Password
											</label>
											<input
												id="confirm_password"
												type={
													showConfirmPassword
														? "text"
														: "password"
												}
												required
												className={classNames(
													"relative",
													"mt-1",
													"block",
													"w-full",
													"appearance-none",
													"rounded-md",
													"border",
													"border-gray-300",
													"px-3",
													"py-2",
													"text-gray-900 dark:text-darkPrimary dark:bg-dark1 dark:border-dark3",
													"focus:z-10",
													"focus:border-primary",
													"focus:outline-none",
													"focus:ring-primary",
												)}
												defaultValue=""
												{...register(
													"confirm_password",
													{
														required:
															"Confirm Password is required",
														validate: {
															notmatch: (
																value: string,
															) => {
																return (
																	getValues(
																		"password",
																	) ===
																		value ||
																	"Confirm password doesn't match"
																);
															},
														},
													},
												)}
											/>
											{showConfirmPassword && (
												<Icon
													icon="eye"
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword,
														)
													}
													className="absolute top-11 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
												/>
											)}
											{!showConfirmPassword && (
												<Icon
													icon="eye-slash"
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword,
														)
													}
													className="absolute top-11 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
												/>
											)}
											<span className="text-xs text-red-500">
												{errors.confirm_password
													?.message &&
													errors.confirm_password?.message.toString()}
												&nbsp;
											</span>
										</div>
									</div>
								</div>
								<div className="relative float-left inline-block w-full">
									<button
										type="submit"
										className={classNames(
											"group",
											"relative",
											"mb-4",
											"flex",
											"w-full",
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
										Change Password
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

export default ChangePassword;
