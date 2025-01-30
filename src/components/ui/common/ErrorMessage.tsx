import React from "react";
import Icon from "utils/icon";

type requestType = {
	message: string;
	isIcon?: boolean;
};
const ErrorMessage: React.FC<requestType> = ({ message, isIcon }) => {
	return (
		<>
			<div className="flex flex-row  items-center justify-start rounded-md bg-red-50 p-4 dark:bg-red-400/5">
				{isIcon ? (
					<Icon
						icon="x-circle"
						className="h-4 w-4 text-red-400 dark:text-red-400/75"
					/>
				) : (
					""
				)}
				<p className="ml-[14px] text-sm font-normal leading-5 text-red-800">
					{message}
				</p>
			</div>
		</>
	);
};

export default ErrorMessage;
