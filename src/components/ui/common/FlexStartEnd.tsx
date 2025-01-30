import React from "react";

type FlexStartEndProps = {
	children: React.ReactNode;
};

const FlexStartEnd: React.FC<FlexStartEndProps> = ({ children }) => {
	return (
		<div className={`flex items-center justify-between gap-4`}>
			{children}
		</div>
	);
};

export default FlexStartEnd;
