import React from "react";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { classNames } from "utils";
import { ShopifyCartDataType } from "utils/types/automation-types";

type DropdownData = {
	label: string;
	value: number;
	id: number;
};
type DropdownType = {
	data: DropdownData[];
	register: UseFormRegister<FieldValues>;
	label: string;
	disabled: boolean;
	defaultValue: ShopifyCartDataType;
};
export type DropdownFormType = {
	value: string;
};
const Dropdown: React.FC<DropdownType> = ({
	data,
	register,
	label,
	disabled,
	defaultValue,
}) => {
	return (
		<select
			disabled={disabled}
			className={classNames(
				"col-span-6",
				"w-full",
				"rounded-md",
				"disabled:opacity-75",
				"border",
				"border-gray-300",
				"bg-white dark:bg-dark1 dark:border-dark3 dark:text-darkPrimary",
				"px-3 py-2",
				"shadow-sm",
				"focus:border-primary",
				"focus:outline-none",
				"focus:ring-primary",
			)}
			placeholder={`Select ${label}`}
			{...register(`${label}`, {
				required: "Value is required",
			})}>
			<option
				defaultValue={
					defaultValue && Object.keys(defaultValue).length !== 0
						? defaultValue.shopify_abandoned_cart_interval / 60
						: data[0].value
				}>
				{defaultValue &&
				Object.keys(defaultValue).length !== 0 &&
				defaultValue.shopify_abandoned_cart_interval !== 60
					? `${defaultValue.shopify_abandoned_cart_interval / 60} hours`
					: data[0].label}
			</option>
			{data && defaultValue && Object.keys(defaultValue).length !== 0
				? data
						.filter(
							word =>
								word.value !==
								defaultValue?.shopify_abandoned_cart_interval / 60,
						)
						.map(data => {
							return (
								<React.Fragment key={data.id}>
									<option value={data.value}>{data.label}</option>
								</React.Fragment>
							);
						})
				: data
						.filter(word => word.value !== 1)
						.map(data => {
							return (
								<React.Fragment key={data.id}>
									<option value={data.value}>{data.label}</option>
								</React.Fragment>
							);
						})}
		</select>
	);
};

export default Dropdown;
