import React, { useState, useEffect } from "react";
import { Spinner } from "@material-tailwind/react";
import { Box, FormGroup } from "@mui/material";
import SiteNavbar from "components/layout/sitenavbar";
import { pageStartFrom } from "utils/consts";
import { useAppState } from "utils/useAppState";
import SearchBox from "components/ui/SearchBox";
import { useEvents } from "api/services/eventService";
import { IEvent, IUser } from "utils/datatypes";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import BtnLink from "components/ui/common/BtnLink";
import { FooterComponent } from "components/layout/Footer";
import BtnComponent from "components/ui/BtnComponent";
import { formatDateWithSuffix } from "components/ui/NewsItem";

function ManageEvents() {
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

	const [events, setEvents] = useState<IEvent[]>([]);
	const [allEvents, setAllEvents] = useState<IEvent[]>([]);
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
		data: eventList,
		refetch: fetchEventList,
		isFetching: isFetchingEventList,
	} = useEvents({
		enabled: userId > 0,
		filter_status: activeStatus,
		filter_name: searchText,
		filter_category: selectedCategories,
		filter_date: selectedDateFilter,
		page_number: pageNumber,
		page_size: pageSize.value,
		group_id: 0,
		user_id: userId
	}) || [];

	useEffect(() => {
		if (userId > 0) {
			setPageNumber(pageStartFrom);
			setTimeout(() => {
				fetchEventList();
			}, 200);
		}
	}, [activeStatus, pageSize]);

	useEffect(() => {
		if (userId > 0) {
			fetchEventList();
		}
	}, [pageNumber]);

	useEffect(() => {
		if (eventList) {
			if (pageNumber == 1) {
				setEvents([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setEvents(prevUsers => [...prevUsers, ...eventList.data]);			
			setTotalRecords(eventList.total_records);
			setCurrentRecords(
				prevCurrentRecords => prevCurrentRecords + eventList.data.length,
			);
		} else {
			setEvents([]);
			setAllEvents([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [eventList]);

	

	const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

	// Apply search and filters
	useEffect(() => {
		let filtered = allEvents;

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				event =>
					event.event_title.toLowerCase().includes(query) ||
					event.event_category.toLowerCase().includes(query) ||
					event.location.toLowerCase().includes(query) ||
					event.event_type.toLowerCase().includes(query),
			);
		}

		if (filtered.length > 0) {
			setEvents(filtered);
		}
	}, [searchQuery]);

	function capitalizeFirstLetter(string: any) {
		if (!string) return ''; // Handle empty or undefined strings
		return string.charAt(0).toUpperCase() + string.slice(1);
	  }

	return (
		<>
			<SiteNavbar />
			<div className="container mx-auto p-4 max-w-7xl">
				<FlexStartEnd>
					<h1 className="md:text-3xl text-xl font-bold text-center mb-4">
						Events
					</h1>
					<BtnLink onClick={() => navigate(-1)}>Go Back</BtnLink>
				</FlexStartEnd>
				{/* <h1 className="text-2xl font-bold text-center mb-8">Events</h1> */}

				<div className="flex justify-start gap-4 mb-4">
					<BtnComponent
						value="Add Event"
						onClick={() => navigate("/add-event")}
						justify="flex-start"
					/>
					<BtnComponent
						value="Events"
						onClick={() => navigate("/show-events")}
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
						{/* Events List Section */}
						<div className="lg:col-span-4">
							{events.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm text-left text-gray-500">
										<thead className="text-xs text-gray-700 uppercase bg-gray-50">
											<tr>
												<th
													scope="col"
													className="px-6 py-3">
													Event Title
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Category
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Location
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Event DateTime
												</th>												
												<th
													scope="col"
													className="px-6 py-3">
													Status
												</th>
												<th
													scope="col"
													className="px-6 py-3">
													Action
												</th>
											</tr>
										</thead>
										<tbody>
											{events.map(event => (
												<tr
													key={event.id}
													className="bg-white border-b hover:bg-gray-50">
													<th
														scope="row"
														className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
														{event.event_title}
													</th>
													<td className="px-6 py-4">
														{event.event_category}
													</td>
													<td className="px-6 py-4">
														{event.location}
													</td>
													<td className="px-6 py-4">
														{event.event_date
															? formatDateWithSuffix(
																	event.event_date as string,
															  )
															: "No Answer"}{" "}
														{event.event_time}
													</td>
													<td className="px-6 py-4">
														{capitalizeFirstLetter(event.status)}
													</td>
													<td className="px-6 py-4">
														<BtnComponent
															value="Edit"
															onClick={() =>
																navigate(
																	`/edit-event/${event.id}`,
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
									No events found.
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

export default ManageEvents;
