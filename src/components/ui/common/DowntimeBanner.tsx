import React from "react";
import { classNames } from "utils";
import { useAppState } from "utils/useAppState";

const DowntimeBanner: React.FC<any> = () => {
	const [{ downtimeStatus, pageName }] = useAppState();
	return (
		<>
			{downtimeStatus && downtimeStatus.status && (
				<div
					className={classNames(
						"w-full",
						pageName &&
							pageName.trim() != "ctwcampaign" &&
							pageName.trim() != "Campaigns"
							? "-mb-2 px-6 md:px-12 mt-4"
							: "mb-4 -mt-2 pr-4",
					)}>
					<div
						className={classNames(
							"flex flex-row items-start justify-start gap-3 rounded-md p-4",
							downtimeStatus.severity == "warning"
								? "bg-yellow-50 dark:bg-yellow-400/10"
								: "bg-red-50 dark:bg-red-400/10",
						)}>
						<img
							src={"/assets/img/" + downtimeStatus.img_url}
							className="h-10 w-11"
						/>
						<p className="text-sm font-medium leading-5">
							<div
								className={classNames(
									"mb-1",
									downtimeStatus.severity == "warning"
										? "text-orange-800 dark:text-orange-600"
										: "text-red-800 dark:text-red-600",
								)}>
								{downtimeStatus.title}
							</div>
							<div
								className={classNames(
									"text-sm font-normal leading-5",
									downtimeStatus.severity == "warning"
										? "text-yellow-700 dark:text-yellow-500"
										: "text-red-700 dark:text-red-600",
								)}>
								{downtimeStatus.description}
							</div>
						</p>
					</div>
				</div>
			)}
		</>
	);
};

export default DowntimeBanner;
