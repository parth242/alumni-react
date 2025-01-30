import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateWithSuffix } from "./NewsItem";
import { IJob } from "utils/datatypes";

interface JobCardProps {
	job: IJob;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const [openReferToFriend, setOpenReferToFriend] = useState(false);
	const [openApplyForJob, setOpenApplyForJob] = useState(false);
	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	const shareLink = `${window.location.origin}${location.pathname}?jobId=${job.id}`;

	const shareOnWhatsApp = () => {
		const url = `https://api.whatsapp.com/send?text=Check out this job: ${job.job_title} at ${job.company}. Apply here: ${shareLink}`;
		window.open(url, "_blank");
	};

	React.useEffect(() => {
		// Extract jobId from the URL
		const searchParams = new URLSearchParams(location.search);
		const jobId = searchParams.get("jobId");

		// Check if the current job matches the jobId in the URL
		if (jobId && job.id?.toString() === jobId) {
			setOpen(true);
		}
	}, [location.search, job.id]);

	return (
		<>
			<div
				key={job.id}
				className="max-w-sm rounded-2xl overflow-hidden shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] hover:bg-neutral-100 flex flex-col hover:cursor-pointer  ">
				<div className="px-6 pt-6 flex-grow">
					<div className="flex items-center justify-between">
						<div className="font-bold text-l mb-3 text-black">
							{job.job_title}
						</div>
					</div>
					<p className="text-gray-700 md:text-l text-sm mt-1">
						Company: {job.company}
					</p>

					<p className="text-gray-700 md:text-l text-sm mt-1">
						Location: {job.location}
					</p>

					<p className="text-gray-700 md:text-l text-sm mt-1">
						Job Area: {job.area_name.map(area => area).join(", ")}
					</p>

					<p className="text-black-700 md:text-l text-sm mt-1">
						{formatDateWithSuffix(job.posted_date)}
					</p>
				</div>
				<div className="px-6 pt-3 mb-3">
					{job.skill_name.map((skill, index) => (
						<span
							key={index}
							className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">
							{skill}
						</span>
					))}
				</div>
				<Button
					onClick={() => navigate(`/job-details/${job.id}`)}
					key={`a-${job.id}`}
					style={{ backgroundColor: "#440178" }}>
					View Detail
				</Button>
			</div>
		</>
	);
};

export default JobCard;
