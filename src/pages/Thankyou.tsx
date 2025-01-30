import { classNames } from "utils";
import LoginSidebar from "components/layout/loginSidebar";
import { Link, useNavigate } from "react-router-dom";

function Thankyou() {
	return (
		<div>
			<div
				className={classNames(
					"xs:grid-cols-12",
					"grid",
					"h-screen",
					"sm:grid-cols-1",
					"md:grid-cols-12",
					"lg:grid-cols-12",
					"xl:grid-cols-12",
				)}>
				<LoginSidebar />
				<div className="col-span-4 animate-fade bg-white dark:bg-dark2">
					<div
						className={classNames(
							"relative",
							"flex",
							"min-h-full",
							"items-center",
							"justify-center",
							"px-4",
							"py-12",
							"text-gray-700 dark:text-darkSecondary",
							"sm:px-6",
							"lg:px-8",
						)}>
						<div className="w-full max-w-md space-y-6">
							<div className="mb-10">
								<img
									className="mx-auto h-12 w-auto"
									src="/assets/images/logo.png"
									alt="Workflow"
								/>
								<h2
									className={classNames(
										"mt-6",
										"text-center",
										"text-3xl",
										"font-extrabold",
										"tracking-tight",
										"text-gray-900 dark:text-darkPrimary",
									)}>
									Successfully Registered
								</h2>
							</div>

							<div className="-space-y-px rounded-md">
								<p className="grid grid-cols-1 gap-3 text-center text-sm font-normal leading-5">
									Thank you for registering your account in site. Please
									wait till admin approve your request and you get email after approval then you can login in site.
								</p>
							</div>
							<div className="items-center text-center font-medium">
											<div className="">
												
												<Link
													to="/login"
													className="font-medium text-primary hover:underline">
													 Back Home
												</Link>
											</div>
										</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Thankyou;
