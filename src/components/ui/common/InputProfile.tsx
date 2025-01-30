import { useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import Icon from "utils/icon";

type Props = {
	name: string;
	label?: string;
	placeholder?: string;
	error?: string;
	errorIcon?: boolean;
	register?: UseFormRegister<any>;
	className?: string;
	id?: string;
	type?: string;
	defaultValue?: string | number;
	showErrorPlace?: boolean;
	disabled?: boolean;
	required?: boolean;
}

export function InputProfile({
	name,
	label,
	error,
	errorIcon,
	register,
	required,
	placeholder,
	disabled,
	className,
	id,
	type = "text",
	defaultValue,
	showErrorPlace,
	...rest
}: Props): JSX.Element {
	// const methods = useFormContext();
	const inputType = type || "";
	const [showPassword, setShowPassword] = useState(false);

	return (
		<>
		
			{label && (
				<div className="mr-4">
				<label
					htmlFor={name}
					className="mb-1 font-semibold">
					{label}
				</label>
				</div>
			)}
			<div className="relative">
				<input
					type={inputType == "password" && showPassword ? "text" : inputType}
					id={id || name}
					disabled={disabled}
					required={required}
					placeholder={placeholder}
					defaultValue={defaultValue}
					{...(register && register(name))}
					{...rest}
					className={`p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary ${className}`}
				/>
				{inputType == "password" && (
					<Icon
						icon={showPassword ? "eye" : "eye-slash"}
						onClick={() => setShowPassword(!showPassword)}
						className="absolute top-6 right-3 z-10 h-5 w-5 -translate-y-1/2 cursor-pointer dark:text-darkPrimary text-gray-500"
					/>
				)}
				{(showErrorPlace || error) && (
					<span className="text-xs text-red-500">
						{error && (
							<>
								{errorIcon && (
									<Icon
										icon="exclamation-circle"
										className={`absolute top-2 right-2 z-10 h-6 w-6`}
									/>
								)}
								<span>{error}</span>
							</>
						)}
						&nbsp;
					</span>
				)}
				</div>
		</>
	);
}
