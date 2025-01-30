import React, { useState, useEffect } from "react";
import { Spinner } from "@material-tailwind/react";
import { Box, FormGroup } from "@mui/material";
import SiteNavbar from "components/layout/sitenavbar";
import FilterCheckbox from "components/ui/FilterCheckbox";
import JobCard from "components/ui/JobCard";
import { pageStartFrom } from "utils/consts";
import { useAppState } from "utils/useAppState";
import SearchBox from "components/ui/SearchBox";
import { useJobs } from "api/services/jobService";
import { IJob, IUser } from "utils/datatypes";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import BtnLink from "components/ui/common/BtnLink";
import { FooterComponent } from "components/layout/Footer";
import BtnComponent from "components/ui/BtnComponent";

function ManageJobPosting() {
	const navigate = useNavigate();
	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });
	const [{ user, customers, wabaActivationStatus, selectedCustomer }] =
		useAppState();

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [jobs, setJobs] = useState<IJob[]>([]);
	const [allJobs, setAllJobs] = useState<IJob[]>([]);
	const [userId, setUserId] = useState(0);

	const [myuser, setMyUser] = useState<IUser | null>();

	useEffect(() => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
			setUserId(items.id);
		}
	}, []);

	const {
		isLoading,
		data: jobList,
		refetch: fetchJobList,
		isFetching: isFetchingJobList,
	} = useJobs({
		enabled: userId > 0,
		filter_status: activeStatus,
		filter_name: searchText,
		user_id: userId,
		page_number: pageNumber,
		page_size: pageSize.value,
		is_internship: 0,
	}) || [];

	useEffect(() => {
		if (userId > 0) {
			setPageNumber(pageStartFrom);
			setTimeout(() => {
				fetchJobList();
			}, 200);
		}
	}, [activeStatus, pageSize]);

	useEffect(() => {
		if (userId > 0) {
			fetchJobList();
		}
	}, [pageNumber]);

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

		if (filtered.length > 0) {
			setJobs(filtered);
		}
	}, [searchQuery, selectedFilters]);

	return (
		<>
			<SiteNavbar />
			<div className="container mx-auto p-4 max-w-7xl">
				<FlexStartEnd>
					<h1 className="md:text-3xl text-xl font-bold text-center mb-4">
						Jobs
					</h1>
					<BtnLink onClick={() => navigate(-1)}>Go Back</BtnLink>
				</FlexStartEnd>
				{/* <h1 className="text-2xl font-bold text-center mb-8">Jobs</h1> */}

				<div className="flex justify-start gap-4 mb-4">
					<BtnComponent
						value="Add Job"
						onClick={() => navigate("/add-job")}
						justify="flex-start"
					/>
					<BtnComponent
						value="Jobs"
						onClick={() => navigate("/jobs")}
						justify="flex-start"
					/>
				</div>

				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Spinner />
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						<SearchBox
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
						/>
						{/* Jobs List Section */}
						<div className="lg:col-span-4">
							{jobs.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm text-left text-gray-500">
										<thead className="text-xs text-gray-700 uppercase bg-gray-50">
											<tr>
												<th
													scope="col"
													className="px-6 py-3">
													Job Title
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Company
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Location
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Job Type
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Posted Date
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Action
												</th>
											</tr>
										</thead>
										<tbody>
											{jobs.map(job => (
												<tr
													key={job.id}
													className="bg-white border-b hover:bg-gray-50">
													<th
														scope="row"
														className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
														{job.job_title}
													</th>
													<td className="px-6 py-4">
														{job.company}
													</td>
													<td className="px-6 py-4">
														{job.location}
													</td>
													<td className="px-6 py-4">
														{job.job_type}
													</td>
													<td className="px-6 py-4">
														{new Date(
															job.posted_date,
														).toLocaleDateString()}
													</td>
													<td className="px-6 py-4">
														<BtnComponent
															value="Edit"
															onClick={() =>
																navigate(
																	`/edit-job/${job.id}`,
																)
															}
															justify="flex-end"
														/>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<div className="text-center text-gray-500">
									No jobs found.
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
										style={{ backgroundColor: "#440178" }}>
										{isLoading ? "Loading..." : "Load More"}
									</Button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			<FooterComponent />
		</>
	);
}

export default ManageJobPosting;
