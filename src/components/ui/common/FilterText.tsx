import React from "react";
import Icon from "utils/icon";
import { FiltersType } from "utils/datatypes";

type requestType = {
	filters?: FiltersType;
	searchText?: string;
	setFilters?: (fl: FiltersType) => void;
	api: boolean;
	setSearchTextChanged?: (f1: boolean) => void;
	setSearchText?: (f1: string) => void;
	placeholder?: string;
};
const FilterText: React.FC<requestType> = ({
	filters,
	setFilters,
	searchText,
	setSearchText,
	setSearchTextChanged,
	api,
	placeholder,
}) => {
	return (
		<div className="relative float-right mb-3 sm:mb-0">
			<span className="absolute p-2 text-gray-500">
				<Icon icon="magnifying-glass" className="h-4 w-4" aria-hidden="true" />
			</span>
			<input
				type="text"
				name="company-website"
				id="company-website"
				className="block w-40 flex-1 rounded-md border border-gray-300 p-2 pl-8 focus:border-primary focus:ring-1 focus:ring-primary dark:border-dark3 dark:bg-dark1 dark:text-darkPrimary sm:w-64 sm:text-sm"
				placeholder={placeholder || "Search"}
				value={filters ? filters?.text : searchText}
				onChange={e => {
					if (!api && setFilters && filters) {
						setFilters({ ...filters, text: e.target.value });
					} else if (api && setSearchText && setSearchTextChanged) {
						setSearchTextChanged(true);
						setSearchText(e.target.value);
					}
				}}
			/>
		</div>
	);
};

export default FilterText;
