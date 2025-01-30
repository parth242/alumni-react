import React from "react";
import {
	FieldValues,
	UseFormHandleSubmit,
	UseFormRegister,
} from "react-hook-form";

type Props = {
	children: JSX.Element;
	register: UseFormRegister<FieldValues>;
	onSubmit: (data: FieldValues) => void;
	handleSubmit: UseFormHandleSubmit<FieldValues>;
	className?: string;
}

export function Form({
	children,
	onSubmit,
	handleSubmit,
	register,
	className,
}: Props) {
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			noValidate
			className={`${className}`}>
			{Array.isArray(children)
				? children.map(child => {
					return child.props.name
						? React.createElement(child.type, {
							...{
								...child.props,
								register,
								key: child.props.name,
							},
						})
						: child;
				})
				: children}
		</form>
	);
}
