import SiteNavbar from "components/layout/sitenavbar";
import SearchTabsForJobsApplicants from "components/ui/SearchTabsForJobsApplicants";
import SelectForJobApplicants from "components/ui/SelectForJobApplicants";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { pageStartFrom } from "utils/consts";
import { HTTPError } from "ky";
import dayjs from "dayjs";
import {
	Button,
	Descriptions,
	Divider,
	Form,
	Input,
	Modal,
	Select,
	Tabs,
	DatePicker,
	TimeRangePickerProps
} from "antd";
const { RangePicker } = DatePicker;
import BtnComponent from "components/ui/BtnComponent";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import { useProfessionalskills } from "api/services/professionalskillService";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	useUploadImage,
} from "api/services/user";
import {
	useJobApplications,
	updateApplicationStatus,
} from "api/services/jobApplicationService";
import { IJobApplication, TSelect } from "utils/datatypes";
import { FooterComponent } from "components/layout/Footer";


const JobsApplicants: React.FC = () => {
	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);
	const [jobApplications, setJobApplications] = useState<IJobApplication[]>(
		[],
	);
	const [allJobApplications, setAllJobApplications] = useState<IJobApplication[]>(
		[],
	);
	

	const [currentApplication, setCurrentApplication] =
		useState<IJobApplication>();
	const [jobApplicationId, setJobApplicationId] = useState(0);
	const [recruiterName, setRecruiterName] = useState("");
	const [recruiterComment, setRecruiterComment] = useState("");
	const [applicationStatus, setApplicationStatus] = useState("");

	

	const [form] = Form.useForm();

	const extraContent = {
		left: (
			<div className="flex items-center pr-2">
				<span className="font-semibold pr-2">Search By </span>
			</div>
		),
	};
	

	  

	const {
		data: jobApplicationList,
		refetch: fetchJobApplicationList,
		isFetching: isFetchingJobApplicationList,
	} = useJobApplications({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,		 
	}) || [];

	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchJobApplicationList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchJobApplicationList();
	}, [pageNumber]);

	useEffect(() => {
		if (jobApplicationList) {
			if (pageNumber == 1) {
				setJobApplications([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setJobApplications(prevUsers => [
				...prevUsers,
				...jobApplicationList.data,
			]);
			setAllJobApplications(jobApplicationList.total_data);
			setTotalRecords(jobApplicationList.total_records);
			setCurrentRecords(
				prevCurrentRecords =>
					prevCurrentRecords + jobApplicationList.data.length,
			);
		} else {
			setJobApplications([]);
			setAllJobApplications([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [jobApplicationList]);

	const [searchCriteria, setSearchCriteria] = useState({
		job: [] as string[],
		company: [] as string[],
		skills: [] as string[],
		job_location: [] as string[],
		name_email: [] as string[],
		all_applicants: [] as string[],
		application_status: "" as string,
		minExperience: [] as string[],
		maxExperience: [] as string[],
		rangedate: [] as string[],
	});
	
	const handleSearchChange = (key: keyof typeof searchCriteria, value: string | string[]) => {
		setSearchCriteria(prev => ({
		  ...prev,
		  [key]: Array.isArray(value)
			? value // In case of multi-select (like skills), just use the array
			: prev[key].includes(value)
			? prev[key].filter(item => item !== value) // Toggle single value if already present
			: [...prev[key], value], // Add new value if it's not already in the list
		}));
	  };

	const [filteredApplications, setFilteredApplications] = useState(allJobApplications); // To store filtered jobs
	console.log('jobApplicationsnew',allJobApplications);
	useEffect(() => {
		let filtered = allJobApplications;
	  
		// Apply each selected filter
		if (searchCriteria.job.length > 0) {
		  filtered = filtered.filter(jobapplication =>
			searchCriteria.job.some(jobtitle => 
			  jobapplication.job?.job_title.toLowerCase().includes(jobtitle.toLowerCase())
			)
		  );
		}
	  
		if (searchCriteria.company.length > 0) {
		  filtered = filtered.filter(jobapplication =>
			searchCriteria.company.includes(jobapplication.current_company),
		  );
		}
	  
		if (searchCriteria.skills.length > 0) {
		  filtered = filtered.filter(jobapplication =>
			jobapplication.relevant_skills.split(',').some(skill =>
			  searchCriteria.skills.includes(skill.trim())
			),
		  );
		}
	  
		if (searchCriteria.application_status.length > 0) {
		  filtered = filtered.filter(jobapplication =>
			searchCriteria.application_status.includes(jobapplication.status),
		  );
		}
	  
		if (searchCriteria.name_email.length > 0) {
		  filtered = filtered.filter(jobapplication =>
			searchCriteria.name_email.some(value =>
			  jobapplication.email_address.includes(value) || jobapplication.name.includes(value)
			)
		  );
		}
	  
		
	  
		if (filtered.length > 0) {
		  setJobApplications(filtered); // Use setFilteredApplications to store the filtered results
		} else {
			setJobApplications([]); // Clear the results if no match
		}
	  }, [searchCriteria]);
	  console.log('filteredApplications', filteredApplications);
	console.log('searchCriteriaupdate',searchCriteria);

	const rangePresets: TimeRangePickerProps["presets"] = [
		{ label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
		{ label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
		{ label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
		{ label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
	];

	const { data: jobSkillsData,refetch: fetchJobSkillsData,
		isFetching: isFetchJobSkillsData } =
		useProfessionalskills({
			enabled: true,
			filter_status: "",
			page_number: 1,
			page_size: 10,
			filter_name: "",
		});

		useEffect(() => {		
			
			fetchJobSkillsData();
					
	}, []);

	// Apply search and filters
	
	console.log('searchCriteria',searchCriteria);
	const [showModal, setShowModal] = useState(false);

	const handleShowModal = (currentApply: IJobApplication) => {
		//setJobApplicationId(applicationId);
		setCurrentApplication(currentApply);
		form.setFieldsValue({
			recruiter_name: currentApply.recruiter_name || "",
			recruiter_comment: currentApply?.recruiter_comment || "",
			status: currentApply?.status || "",
		});
		setShowModal(true);
	};
	const handleOk = () => {
		setShowModal(false);
	};

	const handleCancel = () => {
		setCurrentApplication(undefined);
		setShowModal(false);
	};

	const { mutate, isLoading, isError, isSuccess, error } = useMutation(
		updateApplicationStatus,
		{
			onSuccess: async (res: any) => {
				SuccessToastMessage({
					title: "Status Updated Successfully",
					id: "status_update_success",
				});

				setCurrentApplication(undefined);
				form.resetFields();
				setShowModal(false);

				fetchJobApplicationList();
				//navigate("/dashboard");
			},
			onError: async (e: HTTPError) => {
				setCurrentApplication(undefined);
				ErrorToastMessage({ error: e, id: "comment_user" });
			},
		},
	);

	const onSubmit = (data: any) => {
		data.id = currentApplication?.id;
		mutate(data);
	};

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
					options={jobSkillsData?.data?.map((skill: any) => ({
						value: skill.skill_name,
						label: skill.skill_name,
					}))}
					value={searchCriteria.skills} // Bind the value correctly to the state
					onChange={value => handleSearchChange("skills", value)} // Pass value as an array
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
								handleSearchChange("minExperience", e.target.value)
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
								handleSearchChange("maxExperience", e.target.value)
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
					onChange={value => handleSearchChange("job", value)}
				/>
			),
		},
		
		{
			key: "6",
			label: "Name / Email",
			children: (
				<SelectForJobApplicants
					placeholder="Type name or email and press enter"
					onChange={value => handleSearchChange("name_email", value)}
				/>
			),
		},
	];

	

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full">
				<div className="w-10/12 mx-auto py-6 px-4 relative">
					<div>
						<h1 className="text-3xl text-black font-bold mb-2 text-center mb-4">
							Job Applicants
						</h1>
					</div>
					<div className="bg-gray-100 shadow-md  rounded-md p-4">
						{/* <SearchTabsForJobsApplicants onSearchChange={handleSearchChange} /> */}
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
						handleSearchChange("rangedate", value ? value : null)
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
						handleSearchChange("application_status", value)
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
						<h2 className="flex justify-end text-xl text-black font-semibold mb-2">
							<span className="mr-2">{jobApplications.length}</span>{" "}
							Applications Found
						</h2>
						<Divider />
						{jobApplications.length > 0 ? (
							<>
								{jobApplications.map(jobApplication => (
									<>
										<div className="mt-10">
											<Descriptions
												extra={
													<FlexStartEnd>
														<BtnComponent
															type="button"
															value="Download CV"
															onClick={() => {
																const link =
																	document.createElement(
																		"a",
																	);
																link.href =
																	import.meta
																		.env
																		.VITE_BASE_URL +
																	"upload/resume/" +
																	jobApplication.resume;
																link.download =
																	import.meta
																		.env
																		.VITE_BASE_URL +
																	"upload/resume/" +
																	jobApplication.resume; // Specify file name
																link.target =
																	"_blank";
																link.click();
															}}
														/>
														<BtnComponent
															onClick={() =>
																handleShowModal(
																	jobApplication,
																)
															}
															type="button"
															value="Update Status"
														/>
													</FlexStartEnd>
												}
												title={`${jobApplication.apply_type} | ${jobApplication.job?.job_title}`}
												items={Object.entries({
													"Name":
														jobApplication.full_name ||
														"N/A",
													"Email":
														jobApplication.email_address ||
														"N/A",
													"Key Skills":
														jobApplication.relevant_skills ||
														"N/A",
													"Telephone":
														jobApplication.mobile_number ||
														"N/A",
													"Applicant's Message":
														jobApplication.note ||
														"N/A",
													"Recruiter's Name":
														jobApplication.recruiter_name ||
														"N/A",
													"Recruiter's Comment":
														jobApplication.recruiter_comment ||
														"N/A",
													"Status":
														jobApplication.status ||
														"N/A",
												}).map(
													(
														[label, value],
														index,
													) => ({
														key: index.toString(),
														label,
														children: value,
													}),
												)}
											/>
										</div>
										<Divider className="border-t-2 border-gray-300" />
									</>
								))}
							</>
						) : (
							<div className="text-center text-gray-500">
								No any Job Applicants found.
							</div>
						)}
					</div>
				</div>
			</div>
			<Modal
				key={currentApplication?.id}
				title={
					<span className="text-xl font-semibold text-black">
						Update Applicant Status
					</span>
				}
				open={showModal}
				footer={null}
				onCancel={handleCancel}>
				<Form
					form={form}
					className="mt-6"
					layout="vertical"
					onFinish={onSubmit}>
					<Form.Item
						label="Recruiter's Name"
						name="recruiter_name"
						rules={[
							{
								required: true,
								message: "Please Enter Recruiter's Name",
							},
						]}>
						<Input
							placeholder="Enter Recruiter's Name"
							size="large"
							className="border-2 border-gray-300 rounded-md"
						/>
					</Form.Item>
					<Form.Item
						label="Status"
						name="status"
						rules={[
							{
								required: true,
								message: "Please select a status",
							},
						]}>
						<Select
							placeholder="Select Status"
							size="large"
							style={{ width: "100%" }}
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
												<span>
													Schedule phone interview
												</span>
											),
											value: "Schedule phone interview",
										},
										{
											label: (
												<span>
													Schedule onsite interview
												</span>
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
											label: (
												<span>
													Hire(Formulate offer)
												</span>
											),
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
													Does not meet basic
													qualifications
												</span>
											),
											value: "Does not meet basic qualifications",
										},
										{
											label: (
												<span>
													Not best qualified-
													Interview result
												</span>
											),
											value: "Not best qualified- Interview result",
										},
										{
											label: (
												<span>
													Not best quality-
													Timing/Position filled
												</span>
											),
											value: "Not best quality- Timing/Position filled",
										},
										{
											label: (
												<span>
													Declined - Candidate
													declined offer
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
					</Form.Item>
					<Form.Item
						label="Recruiter's Comment"
						name="recruiter_comment"
						rules={[
							{
								required: true,
								message: "Please enter a comment",
							},
						]}>
						<Input.TextArea
							placeholder="Enter Recruiter's Comment"
							size="large"
							className="border-2 border-gray-300 rounded-md"
						/>
					</Form.Item>
					<Form.Item>
						<BtnComponent type="submit" value="Update Details" />
					</Form.Item>
				</Form>
			</Modal>
			<FooterComponent />
		</>
	);
};

export default JobsApplicants;
