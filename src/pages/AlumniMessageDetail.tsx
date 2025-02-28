import SiteNavbar from "components/layout/sitenavbar";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getMessage } from "api/services/messageService";
import { Button } from "flowbite-react";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import BtnLink from "components/ui/common/BtnLink";
import { Divider } from "antd";

function AlumniMessageDetail() {
	const { id } = useParams() as {
		id: string;
	};

	const navigate = useNavigate();

	let {
		isLoading,
		data: AlumniMessageDetails,
		refetch: fetchAlumniMessageDetails,
		isFetching: isFetchingAlumniMessageDetails,
		remove,
	} = getMessage({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchAlumniMessageDetails();
		} else {
			AlumniMessageDetails = undefined;
		}
	}, [id]);

	const alumnimessages = AlumniMessageDetails?.data;

	if (!alumnimessages) {
		return (
			<div className="container mx-auto p-4">
				<h2>Message not found</h2>
				<Link to="/alumni-messages" className="text-blue-500 hover:underline">
					Go back to Messages
				</Link>
			</div>
		);
	}

	const formatTimeRange = (dateTimeString: string): string => {

		const date = new Date(dateTimeString);
	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();

	// Add ordinal suffix to day
	const suffix = (day: number) => {
		if (day > 3 && day < 21) return "th"; // covers 11th, 12th, 13th, etc.
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

			  
		// Format options for time
		const timeFormatOptions: Intl.DateTimeFormatOptions = {
		  hour: "numeric",
		  minute: "numeric",
		  hour12: true,
		};
	  
		// Format the time from the provided datetime
		const formattedTime = date.toLocaleTimeString("en-US", timeFormatOptions);
	  		
	  
		return `${day}${suffix(day)} ${month}, ${year} ${formattedTime}`;
	  };

	// Split description into paragraphs
	const paragraphs = alumnimessages.message_desc
		.split("\n\n")
		.map((para: string, index: number) => (
			<p key={index} className="mb-4">
				{para}
			</p>
		));

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full ">
				<div className="md:w-10/12 w-full mx-auto py-6 px-4 relative">
				<FlexStartEnd>
					<h1 className="md:text-3xl text-xl text-black font-bold mb-2 text-center mb-4">
						{alumnimessages.subject}
					</h1>
					<BtnLink onClick={() => navigate(-1)}>Go Back</BtnLink>
					</FlexStartEnd>
					<Divider />
					{paragraphs}
					<div>
							<p className="font-semibold text-sm">
							<Link to={"/profile/" + alumnimessages.sender_id}>
								{alumnimessages.user?.first_name +
									" " +
									alumnimessages.user?.last_name}
							</Link>
							</p>
							<p className="text-sm text-gray-500">
							{alumnimessages.createdAt
															? formatTimeRange(
																alumnimessages.createdAt as string,
															  )
															: "No Answer"}{" "}
								
							</p>
						</div>
					
				</div>
			</div>
		</>
	);
}

export default AlumniMessageDetail;
