import React from "react";
import Icon from "utils/icon";

type requestType = {
	message: string;
	isIcon?: boolean;
	children: JSX.Element;
	style?: string;
	iconType?: string;
};
const InfoMessageMultiple: React.FC<requestType> = ({
	message,
	isIcon,
	iconType = "exclamation-triangle-solid",
	style,
	children,
}) => {
	return (
		<>
			<div
				className={`${
					style ? style : "mt-6"
				} flex rounded-md bg-yellow-50 dark:bg-yellow-400/5`}>
				{isIcon && (
					<div className="w-8 p-4 text-center">
						<Icon
							icon={iconType}
							className="h-5 w-5 text-yellow-400 dark:text-yellow-400/75"
						/>
					</div>
				)}
				<div className="p-4">
					<div className="mb-1 font-medium text-yellow-800">{message}</div>
					<ul className="ml-4 list-disc text-yellow-700">{children}</ul>
				</div>
			</div>
		</>
	);
};

export default InfoMessageMultiple;
