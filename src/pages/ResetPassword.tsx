import { resetPassword, useResetPassword } from "api";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Loader from "components/layout/loader";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { useState } from "react";
import LoginSidebar from "components/layout/loginSidebar";
import Icon from "utils/icon";
import { patterns } from "utils/consts";
import HomeHeader from "components/layout/homeheader";
import HomeFooter from "components/layout/homefooter";


function ResetPassword() {
	const { key } = useParams() as {
		key: string;
	};
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm();
	const [isSent, setIsSent] = useState(false);
	const [params] = useSearchParams();
	const { error: resetError } = useResetPassword(params.get("key") || "");

	const { isLoading, mutate } = useMutation(resetPassword, {
		onSuccess: async () => {
			setIsSent(true);
		},
		onError: async () => console.log("error"),
	});

	return (
		<div className="flex flex-col min-h-screen text-sm">
			<HomeHeader></HomeHeader>
			{isLoading && <Loader></Loader>}
			<div className="grid flex-grow xs:grid-cols-12 sm:grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
    			<div className="col-span-12 animate-fade bg-white dark:bg-dark2 dark:text-darkPrimary">							
						{!isSent && !resetError ? (
							<form
								onSubmit={handleSubmit(({ password }) => {
									return mutate({ key: key, password });
								})}
								noValidate
								className="min-h-[500px]">
								<div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
									<div className="w-full max-w-md space-y-8">
										<div>											
											<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-darkPrimary">
												Set your password
											</h2>
											<p className="mt-5 text-center dark:text-darkSecondary">
												Please enter your new password.
											</p>
										</div>
										<div className="-space-y-px rounded-md">
											<div className="relative mb-3">
												<label htmlFor="password" className="sr-only">
													Password
												</label>
												<input
													id="password"
													type={showPassword ? "text" : "password"}
													autoComplete="current-password"
													required
													className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary dark:border-dark3 dark:bg-dark1 dark:text-darkPrimary"
													placeholder="Enter Password"
													defaultValue=""
													{...register("password", {
														required: "Required is required",
														pattern: {
															value: patterns.PASSWORD,
															message:
																"Password must contain atleast 1 each of upper case letters, lower case letters, and digits and must have atleast 8 characters",
														},
													})}
												/>
												{showPassword && (
													<Icon
														icon="eye"
														onClick={() => setShowPassword(!showPassword)}
														className="absolute top-5 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
													/>
												)}
												{!showPassword && (
													<Icon
														icon="eye-slash"
														onClick={() => setShowPassword(!showPassword)}
														className="absolute top-5 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
													/>
												)}
												{errors.password?.message && (
													<span className="text-xs text-red-500">
														{errors.password?.message.toString()}
													</span>
												)}
											</div>
											<div className="relative">
												<label htmlFor="password" className="sr-only">
													Confirm Password
												</label>
												<input
													id="confirmPassword"
													type={showConfirmPassword ? "text" : "password"}
													autoComplete="confirmPassword"
													required
													className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary dark:border-dark3 dark:bg-dark1 dark:text-darkPrimary"
													placeholder="Enter Confirm Password"
													defaultValue=""
													{...register("confirmPassword", {
														required: "Confirm Password is required",
														validate: value => {
															const { password } = getValues();
															return (
																password === value || "Passwords should match!"
															);
														},
													})}
												/>
												{showConfirmPassword && (
													<Icon
														icon="eye"
														onClick={() =>
															setShowConfirmPassword(!showConfirmPassword)
														}
														className="absolute top-5 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
													/>
												)}
												{!showConfirmPassword && (
													<Icon
														icon="eye-slash"
														onClick={() =>
															setShowConfirmPassword(!showConfirmPassword)
														}
														className="absolute top-5 right-3 z-50 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-300"
													/>
												)}
												{errors.confirmPassword?.message && (
													<span className="text-xs text-red-500">
														{errors.confirmPassword?.message.toString()}
													</span>
												)}
											</div>
										</div>

										<div>
											<button
												type="submit"
												className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
												Confirm
											</button>
										</div>
										<hr className="dark:border-dark3" />
										<div className="mt-3 text-center">
											<div className="dark:text-darkPrimary">
												Back to{" "}
												<Link to="/login" className="font-medium text-primary">
													Login
												</Link>
											</div>
										</div>
									</div>
								</div>
							</form>
						) : isSent && !resetError ? (
							<div className="grid min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
								<div className="w-full max-w-md space-y-8">
									<div>										
										<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-darkPrimary">
											Password changed
										</h2>
										<p className="mt-5 text-center dark:text-darkSecondary">
											Please login to continue.
										</p>
									</div>
									<div>
										<Link
											to="/login"
											className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
											Back to Login
										</Link>
									</div>
								</div>
							</div>
						) : (
							<div className="grid min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
								<div className="w-full max-w-md space-y-8">
									<div>
										
										<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-darkPrimary">
											Link expired
										</h2>
										<p className="mt-5 text-center dark:text-darkSecondary">
											This password reset link has expired. You can go back and
											request a new email.
										</p>
									</div>
									<div>
										<Link
											to="/login"
											className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
											Back to Login
										</Link>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			
			<HomeFooter></HomeFooter>
		</div>
	);
}

export default ResetPassword;
