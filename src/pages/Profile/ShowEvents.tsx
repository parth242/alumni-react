import React, { useState, useEffect } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	Typography,
} from "@material-tailwind/react";
import { Button } from "flowbite-react";
import SiteNavbar from "components/layout/sitenavbar";
import { Spinner } from "flowbite-react"; // For Loader Spinner
import { useNavigate } from "react-router-dom";
import { pageStartFrom } from "utils/consts";
import { useEvents } from "api/services/eventService";
import { IEvent } from "utils/datatypes";
import ReactTooltip from "react-tooltip";
import { FooterComponent } from "components/layout/Footer";
import LinkCommon from "components/ui/common/LinkCommon";
import { formatDateWithSuffix } from "components/ui/NewsItem";

const categories = ["Reunions", "Meetups", "Conferences", "Symposiums"];
const dateFilters = ["Future", "Present", "Past"];

function ShowEvents() {
	const navigate = useNavigate();
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

	const [activeStatus, setActiveStatus] = useState("active");
	const [searchText, setSearchText] = useState("");

	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [events, setEvents] = useState<IEvent[]>([]);

	const handleCategoryChange = (category: string) => {
		setSelectedCategories(prev =>
			prev.includes(category)
				? prev.filter(c => c !== category)
				: [...prev, category],
		);
	};

	const handleDateFilterChange = (filter: string) => {
		setSelectedCategories([]);
		setSelectedDateFilter(filter);
	};

	const {
		isLoading,
		data: eventList,
		refetch: fetchEventList,
		isFetching: isFetchingEventList,
	} = useEvents({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		filter_category: selectedCategories,
		filter_date: selectedDateFilter,
		page_number: pageNumber,
		page_size: pageSize.value,
		group_id: 0,
		user_id: 0
	}) || [];

	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchEventList();
		}, 200);
	}, [activeStatus, pageSize, selectedCategories, selectedDateFilter]);

	useEffect(() => {
		fetchEventList();
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
				prevCurrentRecords =>
					prevCurrentRecords + eventList.data.length,
			);
		} else {
			setEvents([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [eventList]);

	useEffect(() => {
		ReactTooltip.rebuild();
	}, []);

	const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full ">
				<div className="md:w-10/12 w-full mx-auto py-6 px-4 relative">
					<h1 className="md:text-3xl text-xl text-black font-bold mb-2 text-center mb-4">
						Events
					</h1>

					{/* Loader */}
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner size="xl" />
						</div>
					) : (
						<>
							{/* Filter Section */}
							<div className="flex flex-wrap md:justify-center gap-6 mb-6">
								<Button
									style={{ backgroundColor: "#440178" }}
									className="text-center text-white"
									outline
									onClick={() => navigate("/add-events")}
									size="md">
									Add Event
								</Button>
								<Button
									style={{ backgroundColor: "#440178" }}
									className="text-center text-white"
									outline
									onClick={() => navigate("/manage-events")}
									size="md">
									Manage Events
								</Button>
								{/* Category Filters */}
								<div className="flex flex-wrap gap-4 md:justify-center items-center">
									<label>
										<input
											type="checkbox"
											checked={
												selectedCategories.length === 0
											}
											className="text-purple-900"
											onChange={() => {
												setSelectedCategories([]);
												setSelectedDateFilter("");
											}}
										/>
										<span className="ml-2 text-black font-semibold">
											All Categories
										</span>
									</label>
									{categories.map(category => (
										<label key={category}>
											<input
												type="checkbox"
												checked={selectedCategories.includes(
													category,
												)}
												className="text-purple-900"
												onChange={() =>
													handleCategoryChange(
														category,
													)
												}
											/>
											<span className="ml-2 text-black font-semibold">
												{category}
											</span>
										</label>
									))}
								</div>

								{/* Date Filters */}
								<div className="flex flex-wrap gap-4 justify-center items-center">
									{dateFilters.map(filter => (
										<label key={filter}>
											<input
												type="radio"
												name="date-filter"
												className="text-purple-900"
												checked={
													selectedDateFilter ===
													filter
												}
												onChange={() =>
													handleDateFilterChange(
														filter,
													)
												}
											/>
											<span className="ml-2 text-black font-semibold">
												{filter}
											</span>
										</label>
									))}
								</div>
							</div>

							{/* Event Cards */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
								{events && events.length ? (
									events.map(event => (
										<Card
											key={event.id}
											className="flex flex-col w-full h-auto bg-white shadow-md transition-opacity duration-500 opacity-0 animate-fade-in">
											<CardHeader
												shadow={false}
												floated={false}
												className="m-0 w-full h-[14rem] overflow-hidden">
												<img
													src={
														import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
														"upload/event/" +
														event.event_image
													}
													alt={`${event.event_title} image`}
													className="h-full w-full object-cover"
												/>
											</CardHeader>
											<CardBody className="flex-1 flex flex-col justify-between p-4">
												<div>
													<Typography
														style={{
															backgroundColor:
																"#440178",
														}}
														variant="h6"
														color="white"
														className="mb-2 text-sm px-2 py-1 rounded-md inline-block">
														{event.event_category}
													</Typography>
													<Typography
														variant="h6"
														color="blue-gray"
														className="mb-2">
														{event.event_title}
													</Typography>
													<Typography
														color="gray"
														className="font-normal">
														{event.location}
													</Typography>
													<Typography
														color="gray"
														className="mb-4 font-normal">
														{event.event_date
															? formatDateWithSuffix(
																	event.event_date as string,
															  )
															: "No Answer"}{" "}
														{event.event_time}
													</Typography>
												</div>
												<LinkCommon
													to={`/events/${event.id}`}>
													Learn More
												</LinkCommon>
												{/* <Button
													style={{
														backgroundColor:
															"#440178",
													}}
													className="text-center text-white"
													outline
													onClick={() =>
														handleLearnMore(event)
													}>
													Learn More
												</Button> */}
											</CardBody>
										</Card>
									))
								) : (
									<Typography className="text-center">
										No events found
									</Typography>
								)}
							</div>
							<div className="flex justify-center mt-10">
								{currentRecords < totalRecords && (
									<Button
										style={{ backgroundColor: "#440178" }}
										outline
										className="text-center"
										onClick={() =>
											setPageNumber(pageNumber + 1)
										}>
										{isLoading ? "Loading..." : "Load More"}
									</Button>
								)}
							</div>
						</>
					)}
				</div>
			</div>
			<FooterComponent />
		</>
	);
}

export default ShowEvents;
