import React, { useState, useEffect } from "react";
import { Spinner } from "@material-tailwind/react";
import { Box, FormGroup } from "@mui/material";
import SiteNavbar from "components/layout/sitenavbar";
import { pageStartFrom } from "utils/consts";
import { useAppState } from "utils/useAppState";
import SearchBox from "components/ui/SearchBox";
import { useAlumniMessages, updateStatus } from "api/services/messageService";
import { IMessage, IUser } from "utils/datatypes";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import BtnLink from "components/ui/common/BtnLink";
import { FooterComponent } from "components/layout/Footer";
import BtnComponent from "components/ui/BtnComponent";
import { HTTPError } from "ky";
import {
	ErrorToastMessage,	
} from "api/services/user";
import { formatDateWithSuffix } from "components/ui/NewsItem";

function AlumniMessages() {
	const navigate = useNavigate();
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });
	const [{ user, customers, wabaActivationStatus, selectedCustomer }] =
		useAppState();

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [alumniMessages, setAlumniMessages] = useState<IMessage[]>([]);
	const [allAlumniMessages, setAllAlumniMessages] = useState<IMessage[]>([]);
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
		data: messageList,
		refetch: fetchMessageList,
		isFetching: isFetchingMessageList,
	} = useAlumniMessages({
		enabled: false,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,		
		user_id: userId
	}) || [];

	useEffect(() => {
		if (userId > 0) {
			setPageNumber(pageStartFrom);
			setTimeout(() => {
				fetchMessageList();
			}, 200);
		}
	}, [activeStatus, pageSize]);

	useEffect(() => {
		if (userId > 0) {
			fetchMessageList();
		}
	}, [userId,pageNumber]);

	console.log('messageList',messageList);

	useEffect(() => {
		if (messageList) {
			if (pageNumber == 1) {
				setAlumniMessages([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setAlumniMessages(prevUsers => [...prevUsers, ...messageList.data]);			
			setTotalRecords(messageList.total_records);
			setCurrentRecords(
				prevCurrentRecords => prevCurrentRecords + messageList.data.length,
			);
		} else {
			setAlumniMessages([]);
			setAllAlumniMessages([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [messageList]);

	

	const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

	// Apply search and filters
	useEffect(() => {
		let filtered = allAlumniMessages;

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				message =>
					message.user?.first_name.toLowerCase().includes(query) ||
					message.subject.toLowerCase().includes(query),
			);
		}

		if (filtered.length > 0) {
			setAlumniMessages(filtered);
		}
	}, [searchQuery]);

	function capitalizeFirstLetter(string: any) {
		if (!string) return ''; // Handle empty or undefined strings
		return string.charAt(0).toUpperCase() + string.slice(1);
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

	  const { mutate } = useMutation(
		updateStatus,
		{
			onSuccess: async (res: any) => {
				
				navigate(
					`/view-message/${res.data.id}`,
				)
			},
			onError: async (e: HTTPError) => {
				ErrorToastMessage({ error: e, id: "view_message" });
			},
		},
	);

	  const handleViewMessage = (messageId: number) =>{
		const data = {
			id: messageId,
			status: 'inactive'		
		};
		
		mutate(data);
	}

	 

	return (
		<>
			<SiteNavbar />
			<div className="container mx-auto p-4 max-w-7xl">
				<FlexStartEnd>
					<h1 className="md:text-3xl text-xl font-bold text-center mb-4">
						Messages
					</h1>
					<BtnLink onClick={() => navigate(-1)}>Go Back</BtnLink>
				</FlexStartEnd>
				{/* <h1 className="text-2xl font-bold text-center mb-8">AlumniMessages</h1> */}

				

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
						{/* AlumniMessages List Section */}
						<div className="lg:col-span-4">
							{alumniMessages.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm text-left text-gray-500">
										<thead className="text-xs text-gray-700 uppercase bg-gray-50">
											<tr>
												<th
													scope="col"
													className="px-6 py-3">
													Sender Name
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Subject
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													DateTime
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Action
												</th>
											</tr>
										</thead>
										<tbody>
											{alumniMessages.map(message => (
												<tr
													key={message.id}
													className={`border-b ${
														message.status === "active" ? "bg-yellow-100" : "bg-white"
													  }`}>
													<th
														scope="row"
														className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
														{message.user?.first_name}
													</th>													
													<td className="px-6 py-4">
														{message.subject}
													</td>
													<td className="px-6 py-4">
														{message.createdAt
															? formatTimeRange(
																	message.createdAt as string,
															  )
															: "No Answer"}{" "}
														
													</td>
													
													<td className="px-6 py-4">
														<BtnComponent
															value="View"
															onClick={() => handleViewMessage(Number(message.id))}															
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
									No Messages found.
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

export default AlumniMessages;
