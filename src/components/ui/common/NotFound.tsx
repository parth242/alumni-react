import React from "react";
import { classNames } from "utils";

type requestType = {
	type: string;
	setOpenCreate: (state: boolean) => void;
};
const NotFound: React.FC<requestType> = ({ type, setOpenCreate }) => {
	return (
		<div className="inline-flex h-[calc(100vh-400px)] w-[100%] items-center justify-center">
			<div className="flex flex-row gap-6">
				{/* <img className="h-24 w-24" src="/assets/img/open-folder.svg" /> */}
				<div
					className={classNames(
						"flex flex-col font-normal",
						type == "agent" || type == "members" ? "mt-5" : "",
					)}>
					<h1 className="text-start text-2xl font-semibold leading-8 text-gray-800 dark:text-darkPrimary">
						It’s empty in here..
					</h1>
					{type == "agent" || type == "members" ? (
						<ul className="mt-2">
							<li className="cursor-pointer text-start text-sm font-normal text-gray-800 dark:text-darkPrimary">
								<span
									className="text-sm font-normal text-red-500 underline"
									onClick={() => {
										setOpenCreate(true);
									}}>
									{type == "agent"
										? "Add your first agent"
										: "Add a member"}
								</span>
							</li>
						</ul>
					) : (
						<>
							<p className="text-start text-sm font-normal text-gray-800 dark:text-darkPrimary">
								We couldn’t find any {type} data 😕 <br />
								You could try these:
							</p>
							<ul className="list-disc pl-5">
								<li className="text-start text-sm font-normal text-gray-800 dark:text-darkPrimary">
									Adjust your filters
								</li>
								{type && (
									<li className="cursor-pointer text-start text-sm font-normal text-gray-800 dark:text-darkPrimary">
										<span
											className="text-sm font-normal text-red-500 underline"
											onClick={() => {
												setOpenCreate(true);
											}}>
											Create a new {type}
										</span>
									</li>
								)}
							</ul>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default NotFound;
