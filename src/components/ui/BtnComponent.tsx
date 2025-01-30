import { Button } from "flowbite-react";
import React from "react";

interface JobCardProps {
	justify?: string;
	onClick?: () => void; // You can change the type based on your handler
	value: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset" | undefined;
}

const BtnComponent: React.FC<JobCardProps> = ({
	justify,
	onClick,
	value,
	disabled,
	type = "button",
}) => {
	const buttonType = type || "";
	return (
		<div className={justify}>
			<Button
				type={buttonType}
				style={{ backgroundColor: "#440178" }}
				className="text-center text-white"
				size="md"
				outline
				disabled={disabled}
				onClick={onClick}>
				{value}
			</Button>
		</div>
	);
};

export default BtnComponent;
