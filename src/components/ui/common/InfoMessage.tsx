import React from "react";
import Icon from "utils/icon";

type requestType = {
	message: string;
	isIcon?: boolean;
};
const InfoMessage: React.FC<requestType> = ({ message, isIcon }) => {
	return (
		<>
			<div className="mt-2 flex items-start rounded-md bg-yellow-50 dark:bg-yellow-400/10">
				{isIcon ? (
					<Icon
						icon="exclamation-triangle-solid"
						className="m-3 mr-0 h-5 w-5 text-yellow-400 dark:text-yellow-400/75"
					/>
				) : (
					""
				)}
				<p
					className="px-4 py-3 text-sm font-normal leading-5 text-yellow-800 dark:text-yellow-600"
					dangerouslySetInnerHTML={{ __html: message }}></p>
			</div>
		</>
	);
};

export default InfoMessage;
