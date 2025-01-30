import { Row, Col, Card, Tag, Tooltip, Typography } from "antd";
import SiteNavbar from "components/layout/sitenavbar";
import {
	GlobalOutlined,
	EnvironmentOutlined,
	CalendarOutlined,
	ArrowRightOutlined,
	BellOutlined,
} from "@ant-design/icons";
import { endDateWithSuffix } from "components/ui/NewsItem";
import BtnLink from "components/ui/common/BtnLink";
import { BsWhatsapp } from "react-icons/bs";
import { getJob, useJobs } from "api/services/jobService";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ApplyForJob from "./ApplyForJob";
import JobReferToFriend from "./JobReferToFriend";
import { IJob } from "utils/datatypes";

const { Title, Text } = Typography;

const JobDetailsPage: React.FC = () => {
	const [openReferToFriend, setOpenReferToFriend] = useState(false);
	const [openApplyForJob, setOpenApplyForJob] = useState(false);
	const { id } = useParams() as {
		id: string;
	};
	const { data: job, isLoading } = getJob({
		id: Number(id),
		enabled: true,
	});

	const shareUrl = window.location.href;

	const shareOnWhatsApp = () => {
		const url = `https://api.whatsapp.com/send?text=Check out this job: ${job?.data?.job_title} at ${job?.data?.company}. Apply here: ${shareUrl}`;
		window.open(url, "_blank");
	};
	console.log(job);
	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full ">
				<div className="md:w-7/12 w-full mx-auto py-6 px-4 relative">
					<h1 className="md:text-2xl text-xl text-black font-bold mb-2 text-center mb-4">
						{job?.data?.job_title +
							" - " +
							job?.data?.area_name.map(area => area).join(", ")}
					</h1>
					<Row gutter={[16, 16]}>
						{/* Company and Website */}
						<Col xs={24} sm={12}>
							<Card>
								<Title level={5}>
									<GlobalOutlined /> Company
								</Title>
								<div className="flex flex-col gap-2">
									<Text>Name: {job?.data?.company}</Text>
									<Text>
										Website:{" "}
										<Tooltip title="Visit the company website">
											<a
												href={
													job?.data?.company_website
												}
												target="_blank"
												rel="noopener noreferrer">
												{job?.data?.company_website}
											</a>
										</Tooltip>
									</Text>
									<Text>Location: {job?.data?.location}</Text>
								</div>
							</Card>
						</Col>
						<Col xs={24} sm={12}>
							<Card>
								<Title level={5}>
									<EnvironmentOutlined /> Area
								</Title>
								<Text>
									{job?.data?.area_name.map((area, index) => (
										<Tag
											style={{ margin: "5px" }}
											key={index}
											color="blue">
											{area}
										</Tag>
									))}
								</Text>
							</Card>
						</Col>

						{/* Area and Dates */}

						<Col xs={24} sm={10}>
							<Card style={{ padding: "5px" }}>
								<Title level={5}>
									{job?.data?.is_internship == 1 ? (
										<>
											<CalendarOutlined /> Internship
											Duration
										</>
									) : (
										<>
											<CalendarOutlined /> Work Experience
										</>
									)}
								</Title>
								<Text>
									{job?.data?.is_internship == 1
										? job?.data?.duration
										: `${job?.data?.experience_from} - ${job?.data?.experience_to} Years`}
								</Text>
							</Card>
						</Col>
						<Col xs={24} sm={14}>
							<Card>
								<Row gutter={[16, 16]} align="middle">
									{/* Job Posted Date */}
									<Col xs={24} md={12}>
										<div className="flex items-center gap-2">
											<div>
												<Title
													level={5}
													className="mb-0">
													<CalendarOutlined /> Posted
													Date
												</Title>
												<Text>
													{endDateWithSuffix(
														job?.data
															?.posted_date || "",
													)}
												</Text>
											</div>
										</div>
									</Col>
									{/* Job Deadline Date */}
									<Col xs={24} md={12}>
										<div className="flex items-center gap-2">
											<div>
												<Title
													level={5}
													className="mb-0">
													<CalendarOutlined /> Job
													Deadline Date
												</Title>
												<Text>
													{endDateWithSuffix(
														job?.data?.deadline_date.toString() ||
															"",
													)}
												</Text>
											</div>
										</div>
									</Col>
								</Row>
							</Card>
						</Col>

						{/* Skills */}
						<Col xs={24}>
							<Card>
								<Title level={5}>Skills</Title>
								<div>
									{job?.data?.skill_name.map(
										(skill, index) => (
											<Tag key={index} color="blue">
												{skill}
											</Tag>
										),
									)}
								</div>
							</Card>
						</Col>
						<Col xs={24}>
							<Card>
								<Title level={5}>Description</Title>
								<div>{job?.data?.job_description}</div>
							</Card>
						</Col>
						<Col xs={24}>
							<Card>
								<div className="flex gap-4">
									{/* <BtnLink
										style={{
											backgroundColor: "#37d773",
											color: "#000",
										}}
										onClick={() => {
											shareOnWhatsApp();
										}}>
										<BsWhatsapp /> Share
									</BtnLink> */}
									<BtnLink
										style={{
											backgroundColor: "#000",
											color: "#fff",
										}}
										onClick={() => {
											setOpenApplyForJob(true);
										}}>
										<ArrowRightOutlined /> Apply for Job
									</BtnLink>
									<BtnLink
										style={{
											backgroundColor: "gray",
											color: "#fff",
										}}
										onClick={() => {
											setOpenReferToFriend(true);
										}}>
										<BellOutlined /> Refer to Friend
									</BtnLink>
								</div>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
			<JobReferToFriend
				openReferToFriend={openReferToFriend}
				setOpenReferToFriend={setOpenReferToFriend}
				job={job?.data as IJob}
			/>
			<ApplyForJob
				openApplyForJob={openApplyForJob}
				setOpenApplyForJob={setOpenApplyForJob}
				job_id={job?.data?.id as number}
			/>
		</>
	);
};

export default JobDetailsPage;
