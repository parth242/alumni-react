import { useRef } from "react";
import Select from "react-select";
import { ShopifyFiltersOptionType } from "utils/types/campaign-types";

const OptionSelect = (props: any) => {
	const { isMulti, type, loadOptions } = props;
	const selectRef: any = useRef();

	const clearValue = () => {
		setTimeout(() => {
			selectRef?.current?.clearValue();
		}, 2000);
	};

	return (
		<div>
			<Select
				ref={selectRef}
				getOptionLabel={(option: ShopifyFiltersOptionType) =>
					type == "customer_cities"
						? option.name + " (" + option.code + ")"
						: option.name
				}
				getOptionValue={(option: ShopifyFiltersOptionType) => option.code}
				{...props}
				controlShouldRenderValue={!isMulti}
				name={type}
				// onChange={handleChange}
				onInputChange={e => loadOptions(type, e)}
				loadOptions={() => loadOptions(type)}
				classNames={{
					control: state => {
						return "dark:bg-dark1 dark:text-darkPrimary dark:hover:border-dark3 !dark:border-dark3 ring-none !shadow-none";
					},
				}}
				className="!focus-visible:border-primary react-select-container"
				classNamePrefix="react-select"
				clearable={false}
				onMenuClose={() => {
					clearValue();
				}}

				/* theme={theme => {
					return {
						...theme,
						borderRadius: 4,
						colors: {
							...theme.colors,
							primary25: "#E95D57",
						},
					};
				}} */
				/* styles={{
					option: (baseStyles, state) => {
						return {
							...baseStyles,
							color: "#95a3b8",
							msTouchSelect: "#fff",
						};
					},
				}} */
			/>
		</div>
	);
};

export default OptionSelect;
