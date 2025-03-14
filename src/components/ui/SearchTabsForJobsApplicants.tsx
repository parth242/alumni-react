import React, { useEffect, useState } from "react";
import SelectForJobApplicants from "./SelectForJobApplicants";
import { Input, Select, Tabs, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { useProfessionalskills } from "api/services/professionalskillService";
const { RangePicker } = DatePicker;

const extraContent = {
	left: (
		<div className="flex items-center pr-2">
			<span className="font-semibold pr-2">Search By </span>
		</div>
	),
};

type SearchCriteria = {
	job: string[];
	company: string[];
	skills: string[];
	job_location: string[];
	name_email: string[];
	all_applicants: string[];
	application_status: string[];
	minExperience: string[];
	maxExperience: string[];
	rangedate: string[];
  };

  
  
  interface SearchTabsForJobsApplicantsProps {
	onSearchChange: (key: keyof SearchCriteria, value: string) => void;
  }

const SearchTabsForJobsApplicants: React.FC<SearchTabsForJobsApplicantsProps> = ({ onSearchChange }) => {
	const today = dayjs();

	const handleChange = (key: keyof SearchCriteria, value: string) => {
		console.log(`Tab: ${key}, selected: ${value}`);
		onSearchChange(key, value);
	  };
	

	const rangePresets: TimeRangePickerProps["presets"] = [
		{ label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
		{ label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
		{ label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
		{ label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
	];

	const { data: jobSkillsData, refetch: fetchJobSkillsData } =
		useProfessionalskills({
			enabled: false,
			filter_status: "",
			page_number: 1,
			page_size: 10,
			filter_name: "",
		});

	// Define tabs as an array of items
	const SearchTabs = [
		{
			key: "1",
			label: "Skills",
			children: (
				<Select
					size="large"
					className="rounded-md border-1 border-gray-500"
					placeholder="Choose Skills"
					mode="tags"
					style={{
						width: "100%",
					}}					
					tokenSeparators={[","]}
					options={jobSkillsData?.data?.map(
						(skill: any) => ({
							value: skill.id,
							label: skill.skill_name,
						}),
					)}
					onChange={value => handleChange("skills", value)}
				/>
				
			),
		},
		{
			key: "2",
			label: "Experience",
			children: (
				<div className="flex items-center">
					<div className="w-2/2 space-y-2">
						<label className="text-sm font-normal ">
							Minimum Experience
						</label>
						<Input
							type="number"
							placeholder="0"
							className="border-1 border-gray-300 rounded-md"
							onChange={e =>
								handleChange("minExperience", e.target.value)
							}
						/>
					</div>
					<div className="w-2/2 pl-4 space-y-2">
						<label className="text-sm font-normal">
							Maximum Experience
						</label>

						<Input
							type="number"
							placeholder="0"
							className="border-1 border-gray-300 rounded-md"
							onChange={e =>
								handleChange("maxExperience", e.target.value)
							}
						/>
					</div>
				</div>
			),
		},
		{
			key: "3",
			label: "Job",
			children: (
				<SelectForJobApplicants
					placeholder="Type job title and press enter"
					onChange={value => handleChange("job", value)}
				/>
			),
		},
		
		{
			key: "6",
			label: "Name / Email",
			children: (
				<SelectForJobApplicants
					placeholder="Type name or email and press enter"
					onChange={value => handleChange("name_email", value)}
				/>
			),
		},
	];

	return (
		<>
			<div>
				<Tabs
					tabBarExtraContent={extraContent}
					defaultActiveKey="1"
					items={SearchTabs}
				/>
			</div>
			<div className="mt-4 flex items-center gap-4">
				<RangePicker
					size="large"
					style={{ width: "100%" }}
					className="border-1 border-gray-300 rounded-md"
					format="YYYY/MM/DD"
					onChange={(value: any) =>
						handleChange("rangedate", value ? value : null)
					}
					presets={[
						{
							label: (
								<span aria-label="Current Time to End of Day">
									Now ~ EOD
								</span>
							),
							value: () => [dayjs(), dayjs().endOf("day")], // 5.8.0+ support function
						},
						...rangePresets,
					]}
				/>				
				<Select
					placeholder="Select Status"
					size="large"
					style={{ width: "100%" }}
					onChange={value =>
						handleChange("application_status", value)
					}
					options={[
						{
							value: "Status to be Updated",
							label: "Status to be Updated",
						},
						{
							label: (
								<span className="text-yellow-500 text-sm">
									In Process
								</span>
							),
							title: "In Process",
							options: [
								{
									label: <span>Applied</span>,
									value: "Applied",
								},
								{
									label: <span>Pending Review</span>,
									value: "Pending Review",
								},
								{
									label: (
										<span>Schedule phone interview</span>
									),
									value: "Schedule phone interview",
								},
								{
									label: (
										<span>Schedule onsite interview</span>
									),
									value: "Schedule onsite interview",
								},
							],
						},
						{
							label: (
								<span className="text-green-500 text-sm">
									On Boarding
								</span>
							),
							title: "On Boarding",
							options: [
								{
									label: <span>Hire(Formulate offer)</span>,
									value: "Hire(Formulate offer)",
								},
								{
									label: <span>Offer Extended</span>,
									value: "Offer Extended",
								},
								{
									label: <span>Offer Accepted</span>,
									value: "Offer Accepted",
								},
								{
									label: <span>Joined</span>,
									value: "Joined",
								},
							],
						},
						{
							label: (
								<span className="text-red-500 text-sm">
									Rejected
								</span>
							),
							title: "Rejected",
							options: [
								{
									label: (
										<span>
											Does not meet basic qualifications
										</span>
									),
									value: "Does not meet basic qualifications",
								},
								{
									label: (
										<span>
											Not best qualified- Interview result
										</span>
									),
									value: "Not best qualified- Interview result",
								},
								{
									label: (
										<span>
											Not best quality- Timing/Position
											filled
										</span>
									),
									value: "Not best quality- Timing/Position filled",
								},
								{
									label: (
										<span>
											Declined - Candidate declined offer
										</span>
									),
									value: "Declined - Candidate declined offer",
								},
								{
									label: <span>Offer Rescinded</span>,
									value: "Offer Rescinded",
								},
							],
						},
					]}
				/>
			</div>
		</>
	);
};

export default SearchTabsForJobsApplicants;
