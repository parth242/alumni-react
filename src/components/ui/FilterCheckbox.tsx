import React from "react";
import {
	Checkbox,
	FormControlLabel,
	Divider,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Icon from "utils/icon";

interface FilterCheckboxProps {
	label: string;
	options: { value: string; count: number }[];
	selectedFilters: string[];
	handleFilterChange: (value: string) => void;
	clearFilter: () => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
	label,
	options,
	selectedFilters,
	handleFilterChange,
	clearFilter,
}) => (
	<>
		<Accordion defaultExpanded={label === "Company"}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls={`${label}-content`}
				id={`${label}-header`}>
				<div className="flex w-full items-center justify-between">
					<p className="font-normal text-sm">{label}</p>
					{selectedFilters.length > 0 && (
						<button
							onClick={() => clearFilter()}
							className="bg-gray-200 rounded-full px-2 py-[3px] text-[13px] font-semibold text-gray-700 transition-all hover:bg-gray-300">
							Clear
							<Icon
								icon={"x-mark"}
								className="bg-secondary-blue ml-2 rounded-full cursor-pointer"
								size={17}
							/>
						</button>
					)}
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<div className="max-h-[150px] overflow-y-scroll scrollCustom">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}>
						{options.map(option => (
							<FormControlLabel
								control={
									<Checkbox
										checked={selectedFilters.includes(
											option.value,
										)}
										onChange={() =>
											handleFilterChange(option.value)
										}
										size="small"
									/>
								}
								label={
									<span className="text-xs">
										{option.value} ({option.count})
									</span>
								}
								key={option.value}
							/>
						))}
					</div>
				</div>
			</AccordionDetails>
		</Accordion>
	</>
);

export default FilterCheckbox;
