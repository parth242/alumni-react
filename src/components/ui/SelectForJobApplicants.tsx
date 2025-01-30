import React from "react";
import { Select } from "antd";

interface SelectForJobApplicantsProps {
	onChange: (value: string) => void;
	placeholder?: string;
}

const SelectForJobApplicants: React.FC<SelectForJobApplicantsProps> = ({
	onChange,
	placeholder,
}) => {
	return (
		<Select
			size="large"
			className="rounded-md border-1 border-gray-500"
			placeholder={placeholder}
			mode="tags"
			style={{
				width: "100%",
			}}
			onChange={onChange}
			tokenSeparators={[","]}
			options={[]}
		/>
	);
};

export default SelectForJobApplicants;
