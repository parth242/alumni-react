import { forgotPassword } from "api";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Loader from "components/layout/loader";
import { Link } from "react-router-dom";
import { useState } from "react";
import LoginSidebar from "components/layout/loginSidebar";
import Icon from "utils/icon";
import { patterns } from "utils/consts";

function ForgotPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [resetRequest, setResetRequest] = useState({
		sent: false,
		error: false,
	});
	const { isLoading, mutate } = useMutation(forgotPassword, {
		onSuccess: async () => {
			setResetRequest({ ...resetRequest, sent: true });
		},
		onError: async () => {
			setResetRequest({ ...resetRequest, error: true });
			setTimeout(() => {
				setResetRequest({ ...resetRequest, error: false });
			}, 4000);
		},
	});

	return (
		<div className="text-sm">
			{isLoading && <Loader></Loader>}
			<div className="xs:grid-cols-12 grid h-screen sm:grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12">
				<LoginSidebar />
				<div className="col-span-4 animate-fade bg-white dark:bg-dark2">
					{!resetRequest.sent ? (
						<form
							onSubmit={handleSubmit(({ email, password }) =>
								mutate({ email, password }),
							)}
							noValidate
							className="h-screen">
							<div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
								<div className="w-full max-w-md space-y-6">
									<div>
										<img
											className="mx-auto h-12 w-auto"
											src="/assets/images/logo.png"
											alt="Workflow"
										/>
										<h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-darkPrimary">
											Reset Password
										</h2>
										<p className="mt-5 text-center dark:text-darkSecondary">
											Give us your email and sit back, relax. You will receive
											an email with instructions to reset your password.
										</p>
									</div>
									<div className="-space-y-px rounded-md">
										<div className="mb-3">
											<label
												htmlFor="email-address"
												className="dark:text-darkPrimary">
												Email
											</label>
											<input
												id="email-address"
												type="email"
												autoComplete="email"
												required
												className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary dark:border-dark3 dark:bg-dark1 dark:text-darkPrimary"
												defaultValue=""
												{...register("email", {
													required: "Email is required",
													pattern: {
														value: patterns.EMAIL,
														message: "Invalid email address",
													},
												})}
											/>
											{errors.email?.message && (
												<span className="text-xs text-red-500">
													{errors.email?.message.toString()}
												</span>
											)}
										</div>
									</div>

									<div className="relative float-left mt-2 inline-block w-full">
										<button
											type="submit"
											className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
											Reset Password
										</button>
										{resetRequest.error && (
											<div className="mt-3 text-xs text-red-500">
												Email does not exists.
											</div>
										)}
									</div>
									<div className="float-left w-full text-center">
										<div className="">
											<Link
												to="/login"
												className="font-medium text-primary hover:underline">
												Return to Login
											</Link>
										</div>
									</div>
								</div>
							</div>
						</form>
					) : (
						<div className="grid min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
							<div className="w-full max-w-md space-y-8">
								<div>
									<img
										className="mx-auto h-12 w-auto"
										src="/assets/images/logo.png"
										alt="Workflow"
									/>
									<h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-darkPrimary">
										Email sent!
									</h2>
									<div className="mt-6 flex rounded-md bg-green-50 dark:bg-green-400/5">
										<div className="w-8 p-4 text-center">
											<Icon
												icon="check-circle"
												className="h-5 w-5 text-green-400 dark:text-green-400/75"
											/>
										</div>
										<div className="p-4">
											<div className="mb-1 font-medium text-green-800">
												Success!
											</div>
											<div className="text-green-700">
												Look out for an email from us sent to registered email
												with instructions on how to reset your password!
											</div>
										</div>
									</div>
									<p className="mt-5 font-medium text-gray-800 dark:text-darkPrimary">
										If you are unable to locate the email, peek into your spam
										folder as well.
									</p>
								</div>
								<div>
									<Link
										to="/login"
										className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
										Return to login
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword;
