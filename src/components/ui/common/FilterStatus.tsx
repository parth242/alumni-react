import React from "react";
import { FiltersType } from "utils/datatypes";
import { StringStringType } from "utils/types/template-types";

type requestType = {
	statusList: StringStringType;
	filters: FiltersType;
	setFilters: (fl: FiltersType) => void;
};
const FilterStatus: React.FC<requestType> = ({
	statusList,
	filters,
	setFilters,
}) => {
	return (
		<span className="float-left w-auto text-gray-600">
			{Object.keys(statusList).map((item: string) => (
				<React.Fragment key={item}>
					{statusList[item] == "draft" && (
						<span className="float-left mx-2 inline-block h-10 border-l-2 text-sm font-medium leading-5 text-gray-600"></span>
					)}
					<span className="float-left inline-block">
						<button
							onClick={() => {
								setFilters({ ...filters, status: statusList[item] });
							}}
							className={`mx-2 rounded-md px-4 py-2 capitalize hover:text-primary ${
								filters.status == statusList[item]
									? "bg-red-100 text-primary"
									: ""
							}`}
							value={statusList[item]}>
							{statusList[item]}
						</button>
					</span>
				</React.Fragment>
			))}
		</span>
	);
};

export default FilterStatus;
