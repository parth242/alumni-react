import React from "react";
import Icon from "utils/icon";

type requestType = {
	message: string;
	isIcon?: boolean;
	children: JSX.Element;
};
const ErrorMessageMultiple: React.FC<requestType> = ({
	message,
	isIcon,
	children,
}) => {
	return (
		<>
			<div className="mt-6 flex rounded-md bg-red-50 dark:bg-red-400/5">
				{isIcon && (
					<div className="w-8 p-4 text-center">
						<Icon
							icon="exclamation-circle"
							className="h-5 w-5 text-red-400 dark:text-red-400/75"
						/>
					</div>
				)}
				<div className="p-4">
					<div className="mb-1 font-medium text-red-800">{message}</div>
					<ul className="ml-4 list-disc text-red-700">{children}</ul>
				</div>
			</div>
		</>
	);
};

export default ErrorMessageMultiple;
