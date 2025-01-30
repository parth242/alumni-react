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

export function Input({
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
	const classnamenew = className || "relative mt-1 block w-full appearance-none rounded-md border border-border bg-white px-3 py-3 leading-tight text-gray-900 placeholder:text-gray-400 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary disabled:opacity-75 dark:border-dark3 dark:bg-dark1 dark:text-darkPrimary";
	const [showPassword, setShowPassword] = useState(false);

	return (
		<>
			{label && (
				<label
					htmlFor={name}
					className="font-medium text-gray-900 dark:text-darkPrimary">
					{label}
				</label>
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
					className={classnamenew}
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
