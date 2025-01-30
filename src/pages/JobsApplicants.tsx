import SiteNavbar from "components/layout/sitenavbar";
import SearchTabsForJobsApplicants from "components/ui/SearchTabsForJobsApplicants";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { pageStartFrom } from "utils/consts";
import { HTTPError } from "ky";
import {
	Button,
	Descriptions,
	Divider,
	Form,
	Input,
	Modal,
	Select,
} from "antd";
import type { DescriptionsProps, FormProps } from "antd";
import BtnComponent from "components/ui/BtnComponent";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
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

	const [currentApplication, setCurrentApplication] =
		useState<IJobApplication>();
	const [jobApplicationId, setJobApplicationId] = useState(0);
	const [recruiterName, setRecruiterName] = useState("");
	const [recruiterComment, setRecruiterComment] = useState("");
	const [applicationStatus, setApplicationStatus] = useState("");

	

	const [form] = Form.useForm();

	

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
	
	  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
		job: [],
		company: [],
		skills: [],
		job_location: [],
		name_email: [],
		all_applicants: [],
		application_status: [],
		minExperience: [],
		maxExperience: [],
		rangedate: [],
	  });
	
	  const handleSearchChange = (key: keyof SearchCriteria, value: string) => {
		setSearchCriteria((prevCriteria) => {
		  const updatedKeyValues = prevCriteria[key].includes(value)
			? prevCriteria[key].filter((item) => item !== value) // Remove value if it exists
			: [...prevCriteria[key], value]; // Add value if it doesn't exist
	
		  return {
			...prevCriteria,
			[key]: updatedKeyValues,
		  };
		});
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
			setTotalRecords(jobApplicationList.total_records);
			setCurrentRecords(
				prevCurrentRecords =>
					prevCurrentRecords + jobApplicationList.data.length,
			);
		} else {
			setJobApplications([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [jobApplicationList]);

	const [filteredApplications, setFilteredApplications] = useState(jobApplications); // To store filtered jobs

	useEffect(() => {
		let filteredApplications = jobApplications;

			// Apply each selected filter

		if (searchCriteria.job.length > 0) {
			filteredApplications = filteredApplications.filter(jobapplication =>
				searchCriteria.job.map(jobtitle => 
					jobapplication.job?.job_title.toLowerCase().includes(jobtitle)
					)
				
				
			);
		}

		
		if (searchCriteria.company.length > 0) {
			filteredApplications = filteredApplications.filter(jobapplication =>
				searchCriteria.company.includes(jobapplication.current_company),
				
			);
		}

		if (searchCriteria.skills.length > 0) {
			filteredApplications = filteredApplications.filter(jobapplication =>
				searchCriteria.skills.includes(jobapplication.relevant_skills),
				
			);
		}

		console.log('filteredApplications',filteredApplications);		

		if (filteredApplications.length > 0) {
			setJobApplications(filteredApplications);
		}
	}, [searchCriteria]);

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
						<SearchTabsForJobsApplicants onSearchChange={handleSearchChange} />
						<h2 className="flex justify-end text-xl text-black font-semibold mb-2">
							<span className="mr-2">{currentRecords}</span>{" "}
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
