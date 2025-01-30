import React from "react";
import {
	Checkbox,
	FormControlLabel,
	Divider,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FilterCheckboxProps {
	label: string;
	options: { value: string; count: number }[];
	selectedFilters: string[];
	handleFilterChange: (value: string) => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
	label,
	options,
	selectedFilters,
	handleFilterChange,
}) => {
	return (
		<>
			<Accordion defaultExpanded={label === "Area"}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls={`${label}-content`}
					id={`${label}-header`}>
					<p className="font-normal text-sm">{label}</p>
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
};

export default FilterCheckbox;
