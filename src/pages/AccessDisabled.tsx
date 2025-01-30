import { classNames } from "utils";
import LoginSidebar from "components/layout/loginSidebar";

function AccessDisabled() {
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
									Access disabled
								</h2>
							</div>

							<div className="-space-y-px rounded-md">
								<p className="grid grid-cols-1 gap-3 text-center text-sm font-normal leading-5">
									Your dashboard access has been temporarily disabled. Please
									contact your account administrator for more details regarding
									this.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AccessDisabled;
