import React, { useState, useEffect } from "react";
import { Spinner } from "@material-tailwind/react";
import { Box, Divider, FormGroup } from "@mui/material";
import SiteNavbar from "components/layout/sitenavbar";
import FilterCheckbox from "components/ui/FilterCheckbox";
import JobCard from "components/ui/JobCard";
import { pageStartFrom } from "utils/consts";
import SearchBox from "components/ui/SearchBox";
import { useJobs } from "api/services/jobService";
import { IJob } from "utils/datatypes";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import LinkCommon from "components/ui/common/LinkCommon";
import { HiPencil, HiPlus } from "react-icons/hi";
import { FooterComponent } from "components/layout/Footer";
import BtnLink from "components/ui/common/BtnLink";

function Jobs() {
	const navigate = useNavigate();
	const [activeStatus, setActiveStatus] = useState("active");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [internship, setInternship] = useState(0);
	const [internshipJob, setInternshipJob] = useState("Jobs");

	const [jobs, setJobs] = useState<IJob[]>([]);
	const [allJobs, setAllJobs] = useState<IJob[]>([]);

	const {
		isLoading,
		data: jobList,
		refetch: fetchJobList,
		isFetching: isFetchingJobList,
	} = useJobs({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		user_id: 0,
		page_number: pageNumber,
		page_size: pageSize.value,
		is_internship: internship,
	}) || [];

	console.log("jobList", jobList);

	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchJobList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchJobList();
	}, [pageNumber]);

	useEffect(() => {
		fetchJobList();
	}, [internship]);

	useEffect(() => {
		if (jobList) {
			if (pageNumber == 1) {
				setJobs([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setJobs(prevUsers => [...prevUsers, ...jobList.data]);
			setAllJobs(jobList.total_data);
			setTotalRecords(jobList.total_records);
			setCurrentRecords(
				prevCurrentRecords => prevCurrentRecords + jobList.data.length,
			);
		} else {
			setJobs([]);
			setAllJobs([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [jobList]);

	const [selectedFilterType, setSelectedFilterType] = useState<string | null>(
		null,
	);

	// Click handler for filters
	const handleFilterClick = (filter: string) => {
		setSelectedFilterType(filter);
		if (filter == "Internship") {
			setInternship(1);
			setInternshipJob("Internships");
		} else {
			setInternship(0);
			setInternshipJob("Jobs");
		}
		// You can also call a function here to fetch/filter jobs
		//console.log(`Selected filter: ${filter}`);
	};

	const [selectedFilters, setSelectedFilters] = useState({
		areas: [] as string[],
		companies: [] as string[],
		skills: [] as string[],
		jobTypes: [] as string[],
		locations: [] as string[],
	});
	// Handle filter change dynamically
	const handleFilterChange = (
		filterKey: keyof typeof selectedFilters,
		value: string,
	) => {
		setSelectedFilters(prev => ({
			...prev,
			[filterKey]: prev[filterKey].includes(value)
				? prev[filterKey].filter(item => item !== value)
				: [...prev[filterKey], value],
		}));
	};

	const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

	const [filteredJobs, setFilteredJobs] = useState(allJobs); // To store filtered jobs
	console.log('selectedFilters',selectedFilters);
	// Apply search and filters
	useEffect(() => {
		let filtered = allJobs;

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				job =>
					job.job_title.toLowerCase().includes(query) ||
					job.company.toLowerCase().includes(query) ||
					job.area_name.some(area =>
						area.toLowerCase().includes(query),
					) ||
					job.location.toLowerCase().includes(query) ||
					job.skill_name.some(skill =>
						skill.toLowerCase().includes(query),
					) ||
					job.job_type.toLowerCase().includes(query),
			);
		}

		// Apply each selected filter

		if (selectedFilters.areas.length > 0) {
			filtered = filtered.filter(job =>
				job.area_name.some(area =>
					selectedFilters.areas.includes(area),
				),
			);
		}

		if (selectedFilters.companies.length > 0) {
			filtered = filtered.filter(job =>
				selectedFilters.companies.includes(job.company),
			);
		}

		if (selectedFilters.skills.length > 0) {
			filtered = filtered.filter(job =>
				job.skill_name.some(skill =>
					selectedFilters.skills.includes(skill),
				),
			);
		}

		if (selectedFilters.jobTypes.length > 0) {
			filtered = filtered.filter(job =>
				selectedFilters.jobTypes.includes(job.job_type),
			);
		}

		if (selectedFilters.locations.length > 0) {
			filtered = filtered.filter(job =>
				selectedFilters.locations.includes(job.location),
			);
		}

		// Update filteredJobs state
		console.log("filterednew", filtered);
		console.log("jobsnew", jobs);
		if (filtered.length > 0) {
			setJobs(filtered);
		}
	}, [searchQuery, selectedFilters]);

	// Get filter options and their counts
	const getFilterOptions = (key: keyof typeof allJobs[0]) => {
		return [...new Set(allJobs.map(job => job[key] as string))].map(
			option => ({
				value: option,
				count: allJobs.filter(job => job[key] === option).length,
			}),
		);
	};
	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full ">
				<div className="md:w-10/12 w-full mx-auto py-6 px-4 relative">
					<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
						{/* Title Section */}
						<h1 className="text-xl md:text-3xl text-black font-bold mb-4 md:mb-0">
							{internshipJob}
						</h1>

						{/* Buttons Section */}
						<div className="flex flex-wrap gap-1 md:justify-center md:justify-end">
							<BtnLink to={`/add-job`}>
								<HiPlus /> Post Job
							</BtnLink>
							<BtnLink to={`/add-internship`}>
								<HiPlus /> Post Internship
							</BtnLink>
							<BtnLink to={`/manage-job-posting`}>
								<HiPencil /> Manage Jobs
							</BtnLink>
							<BtnLink to={`/jobs-applicants`}>
								Job Applicants
							</BtnLink>
						</div>
					</div>

					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner />
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
							{/* Sidebar Section */}
							<div className="lg:col-span-1 shadow-[0_0_16px_5px_rgba(0,0,0,0.1)]  rounded-xl max-h-[600px] overflow-y-scroll">
								<Box
									sx={{
										p: 2,
										border: "1px solid #e0e0e0",
										borderRadius: 2,
									}}>
									<SearchBox
										searchQuery={searchQuery}
										setSearchQuery={setSearchQuery}
									/>
									<div className="mt-4 ml-2">
										<p
											className={`mb-2 mt-2 text-sm cursor-pointer ${
												selectedFilterType ===
												"Jobs For You"
													? "font-bold text-blue-500"
													: ""
											}`}
											onClick={() =>
												handleFilterClick(
													"Jobs For You",
												)
											}>
											Jobs For You
										</p>
										<Divider />
										<p
											className={`mb-2 mt-2 text-sm cursor-pointer ${
												selectedFilterType === "Jobs"
													? "font-bold text-blue-500"
													: ""
											}`}
											onClick={() =>
												handleFilterClick("Jobs")
											}>
											Jobs
										</p>
										<Divider />

										<Divider />
										<p
											className={`mb-2 mt-2 text-sm cursor-pointer ${
												selectedFilterType ===
												"Internship"
													? "font-bold text-blue-500"
													: ""
											}`}
											onClick={() =>
												handleFilterClick("Internship")
											}>
											Internship
										</p>
										<Divider />
									</div>
									<FormGroup className="mt-4">
										<FilterCheckbox
											label="Area"
											options={[
												...new Set(
													allJobs.flatMap(
														job => job.area_name,
													),
												),
											].map(area => ({
												value: area,
												count: allJobs.filter(job =>
													job.area_name.includes(
														area,
													),
												).length,
											}))}
											selectedFilters={
												selectedFilters.areas
											}
											handleFilterChange={value =>
												handleFilterChange(
													"areas",
													value,
												)
											}
										/>

										<FilterCheckbox
											label="Company"
											options={getFilterOptions(
												"company",
											)}
											selectedFilters={
												selectedFilters.companies
											}
											handleFilterChange={value =>
												handleFilterChange(
													"companies",
													value,
												)
											}
										/>

										<FilterCheckbox
											label="Skills"
											options={[
												...new Set(
													allJobs.flatMap(
														job => job.skill_name,
													),
												),
											].map(skill => ({
												value: skill,
												count: allJobs.filter(job =>
													job.skill_name.includes(
														skill,
													),
												).length,
											}))}
											selectedFilters={
												selectedFilters.skills
											}
											handleFilterChange={value =>
												handleFilterChange(
													"skills",
													value,
												)
											}
										/>

										<FilterCheckbox
											label="Job Type"
											options={getFilterOptions(
												"job_type",
											)}
											selectedFilters={
												selectedFilters.jobTypes
											}
											handleFilterChange={value =>
												handleFilterChange(
													"jobTypes",
													value,
												)
											}
										/>

										<FilterCheckbox
											label="Location"
											options={getFilterOptions(
												"location",
											)}
											selectedFilters={
												selectedFilters.locations
											}
											handleFilterChange={value =>
												handleFilterChange(
													"locations",
													value,
												)
											}
										/>
									</FormGroup>
								</Box>
							</div>

							{/* Jobs List Section */}
							<div className="lg:col-span-3">
								{jobs.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										{jobs.map(job => (
											<JobCard job={job} key={job.id} />
										))}
									</div>
								) : (
									<div className="text-center text-gray-500">
										No {internshipJob} found.
									</div>
								)}
								<div className="flex justify-center mt-10">
									{currentRecords < totalRecords && (
										<Button
											className="text-center"
											onClick={() =>
												setPageNumber(pageNumber + 1)
											}
											outline
											style={{
												backgroundColor: "#440178",
											}}>
											{isLoading
												? "Loading..."
												: "Load More"}
										</Button>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<FooterComponent />
		</>
	);
}

export default Jobs;
