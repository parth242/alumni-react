import SiteNavbar from "components/layout/sitenavbar";
import {
	EnvironmentOutlined,
	CalendarOutlined,
	ClockCircleOutlined,
} from "@ant-design/icons";

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FooterComponent } from "components/layout/Footer";
import { getEvent, updateJoinUser } from "api/services/eventService";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	useUserEventData,
} from "api/services/user";
import { HTTPError } from "ky";
import { pageStartFrom } from "utils/consts";
import { IUser, TSelect } from "utils/datatypes";
import { HiPencil, HiPlus } from "react-icons/hi";
import { useMutation } from "react-query";
import {
	endDateWithSuffix,
	formatDateWithSuffix,
} from "components/ui/NewsItem";
import BtnLink from "components/ui/common/BtnLink";

const EventsDetailPage: React.FC = () => {
	const { id } = useParams() as {
		id: string;
	};

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });
	const [activeStatus, setActiveStatus] = useState("active");
	const [searchText, setSearchText] = useState("");
	const [users, setUsers] = useState<IUser[]>([]);
	const [maybeUsers, setMaybeUsers] = useState<IUser[]>([]);
	const [myuser, setMyUser] = useState<IUser | null>();
	const [userId, setUserId] = useState(0);

	const [joinedUser, setJoinedUser] = useState(false);
	const [maybeUser, setMaybeUser] = useState(false);
	const [declinedUser, setDeclinedUser] = useState(false);

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
			setUserId(items.id);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	let {
		isLoading,
		data: eventDetails,
		refetch: fetchEventDetails,
		isFetching: isFetchingEventDetails,
		remove,
	} = getEvent({
		enabled: true,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchEventDetails();
		} else {
			eventDetails = undefined;
		}
	}, [id]);

	const {
		data: userList,
		refetch: fetchUserList,
		isFetching: isFetchingUserList,
	} = useUserEventData({
		enabled: true,
		filter_status: activeStatus,
		page_number: pageNumber,
		page_size: pageSize.value,
		event_id: Number(id),
	}) || [];

	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchUserList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchUserList();
	}, [pageNumber]);

	useEffect(() => {
		if (userList) {
			if (pageNumber == 1) {
				setUsers([]);
				setMaybeUsers([]);
			}
			setUsers(userList.joinMembers);
			setMaybeUsers(userList.maybeMembers);
		} else {
			setUsers([]);
			setMaybeUsers([]);
		}
		const userIdToCheck = userId; // The user ID to check

		// Parse the string into an array
		const joinmemberids = eventDetails?.data.join_members;
		const userIdArray = joinmemberids ? JSON.parse(joinmemberids) : [];
		// Check if the user ID exists
		if (Array.isArray(userIdArray) && userIdArray.includes(userIdToCheck)) {
			setJoinedUser(true);
		} else {
			setJoinedUser(false);
		}

		const maybememberids = eventDetails?.data.maybe_members;
		const maybeIdArray = maybememberids ? JSON.parse(maybememberids) : [];
		// Check if the user ID exists
		if (
			Array.isArray(maybeIdArray) &&
			maybeIdArray.includes(userIdToCheck)
		) {
			setMaybeUser(true);
		} else {
			setMaybeUser(false);
		}

		const declinedmemberids = eventDetails?.data.decline_members;
		const declineIdArray = declinedmemberids
			? JSON.parse(declinedmemberids)
			: [];
		// Check if the user ID exists
		if (
			Array.isArray(declineIdArray) &&
			declineIdArray.includes(userIdToCheck)
		) {
			setDeclinedUser(true);
		} else {
			setDeclinedUser(false);
		}
	}, [userList]);

	const { mutate: updateJoinMaybeUser, isLoading: statusIsLoading } =
		useMutation(updateJoinUser, {
			onSuccess: async () => {
				SuccessToastMessage({
					title: "Updated Successfully",
					id: "join_user_success",
				});
				fetchEventDetails();
				fetchUserList();
			},
			onError: async (e: HTTPError) => {
				// const error = await e.response.text();
				// console.log("error", error);
				ErrorToastMessage({ error: e, id: "join_user" });
			},
		});

	const updateJoinMember = (type: any) => {
		interface dataJoin {
			id: number;
			join_members: string;
			maybe_members: string;
			decline_members: string;
		}

		let joinmember;
		let maybemember;
		let declinemember;

		const joinmemberids = eventDetails?.data.join_members;
		const maybememberids = eventDetails?.data.maybe_members;
		const declinememberids = eventDetails?.data.decline_members;

		const parsedJoinMembers = joinmemberids
			? JSON.parse(joinmemberids)
			: [];

		const parsedMaybeMembers = maybememberids
			? JSON.parse(maybememberids)
			: [];

		const parsedDeclineMembers = declinememberids
			? JSON.parse(declinememberids)
			: [];

		if (type == "join") {
			setJoinedUser(true);

			if (userId > 0) {
				try {
					// Ensure it's an array and add the userId
					if (Array.isArray(parsedJoinMembers)) {
						if (!parsedJoinMembers.includes(userId)) {
							parsedJoinMembers.push(userId); // Add userId if not already present
						}
					}

					const indexmay = parsedMaybeMembers.indexOf(userId); // Find the index of userId
					if (indexmay !== -1) {
						// If userId is not present, add it
						parsedMaybeMembers.splice(indexmay, 1);
					}

					const indexdec = parsedDeclineMembers.indexOf(userId); // Find the index of userId
					if (indexdec !== -1) {
						// If userId is not present, add it
						parsedDeclineMembers.splice(indexdec, 1);
					}

					// Update the joinmember variable
					joinmember = parsedJoinMembers;
					maybemember = parsedMaybeMembers;
					declinemember = parsedDeclineMembers;

					// Optional: Re-encode to JSON string if needed
					// eventDetails.data.join_members = JSON.stringify(parsedJoinMembers);
				} catch (error) {
					console.error("Error parsing join_members:", error);
				}
			}
		}

		if (type == "maybe") {
			setMaybeUser(true);

			if (userId > 0) {
				try {
					// Parse the JSON string into an array

					// Ensure it's an array and add the userId
					if (Array.isArray(parsedMaybeMembers)) {
						if (!parsedMaybeMembers.includes(userId)) {
							parsedMaybeMembers.push(userId); // Add userId if not already present
						}
					}

					const index = parsedJoinMembers.indexOf(userId); // Find the index of userId
					if (index !== -1) {
						// If userId is not present, add it
						parsedJoinMembers.splice(index, 1);
					}

					const indexdec = parsedDeclineMembers.indexOf(userId); // Find the index of userId
					if (indexdec !== -1) {
						// If userId is not present, add it
						parsedDeclineMembers.splice(indexdec, 1);
					}
					// Update the joinmember variable
					joinmember = parsedJoinMembers;
					maybemember = parsedMaybeMembers;
					declinemember = parsedDeclineMembers;

					// Optional: Re-encode to JSON string if needed
					// eventDetails.data.join_members = JSON.stringify(parsedJoinMembers);
				} catch (error) {
					console.error("Error parsing maybe_members:", error);
				}
			}
		}

		if (type == "decline") {
			setDeclinedUser(true);

			if (userId > 0) {
				try {
					// Parse the JSON string into an array

					// Ensure it's an array and add the userId
					if (Array.isArray(parsedDeclineMembers)) {
						if (!parsedDeclineMembers.includes(userId)) {
							parsedDeclineMembers.push(userId); // Add userId if not already present
						}
					}

					const index = parsedJoinMembers.indexOf(userId); // Find the index of userId
					if (index !== -1) {
						// If userId is not present, add it
						parsedJoinMembers.splice(index, 1);
					}

					const indexmay = parsedMaybeMembers.indexOf(userId); // Find the index of userId
					if (indexmay !== -1) {
						// If userId is not present, add it
						parsedMaybeMembers.splice(indexmay, 1);
					}

					joinmember = parsedJoinMembers;
					maybemember = parsedMaybeMembers;
					declinemember = parsedDeclineMembers;

					// Optional: Re-encode to JSON string if needed
					// eventDetails.data.join_members = JSON.stringify(parsedJoinMembers);
				} catch (error) {
					console.error("Error parsing decline_members:", error);
				}
			}
		}

		let data: dataJoin = {
			id: Number(id),
			join_members: JSON.stringify(joinmember),
			maybe_members: JSON.stringify(maybemember),
			decline_members: JSON.stringify(declinemember),
		};

		updateJoinMaybeUser(data as any);
	};

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full ">
				<div className="md:w-10/12 w-full mx-auto py-6 px-4 relative">
					<main className="flex-1 container mx-auto">
						<div className="bg-white shadow rounded-lg overflow-hidden">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								{eventDetails?.data.event_title}
							</h2>
							{/* Event Image */}
							<img
								src={									
									eventDetails?.data?.event_image
										? import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
										   eventDetails.data.event_image
										: "https://via.placeholder.com/1200x400"
								}
								alt="Event"
								className="w-full h-64 object-cover"
							/>

							<div className="md:p-6 p-2">
								{/* Event Description */}
								<p className="mb-4 text-base sm:text-lg">
									{eventDetails?.data.description}
								</p>

								{/* Date, Time, and Location */}
								<div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
									<div className="flex flex-col">
										<p className="flex items-center gap-2 mb-2 text-gray-700">
											<CalendarOutlined className="text-blue-500" />
											<span className="font-semibold">
												Date:
											</span>
											{eventDetails?.data.event_date
												? formatDateWithSuffix(
														eventDetails?.data
															.event_date as string,
												  )
												: "No Answer"}
										</p>
										<p className="flex items-center gap-2 mb-2 text-gray-700">
											<ClockCircleOutlined className="text-blue-500" />
											<span className="font-semibold">
												Time:
											</span>
											{eventDetails?.data.event_time}
										</p>
										<p className="flex items-center gap-2 text-gray-700">
											<EnvironmentOutlined className="text-blue-500" />
											<span className="font-semibold">
												Location:
											</span>
											{eventDetails?.data.location}
											<a
												href={`https://www.google.com/maps?q=${encodeURIComponent(
													eventDetails?.data
														.location as string,
												)}`}
												target="_blank"
												className="underline text-blue-600 hover:text-blue-800"
												rel="noopener noreferrer">
												View on Map
											</a>
										</p>
									</div>

									{/* Right Side: Buttons */}

									<div className="flex flex-wrap gap-2">
										{joinedUser && (
											<BtnLink
												className="px-4 py-2 w-full md:w-auto bg-green-500 text-white rounded hover:bg-blue-600"
												onClick={() =>
													setJoinedUser(false)
												}>
												<HiPencil /> You are Going
											</BtnLink>
										)}
										{maybeUser && (
											<BtnLink
												className="px-4 py-2 w-full md:w-auto bg-blue-500 text-white rounded hover:bg-green-600"
												onClick={() =>
													setMaybeUser(false)
												}>
												<HiPencil /> You May Go
											</BtnLink>
										)}
										{declinedUser && (
											<BtnLink
												className="px-4 py-2 w-full md:w-auto bg-red-500 text-white rounded hover:bg-red-600"
												onClick={() =>
													setDeclinedUser(false)
												}>
												<HiPencil /> Declined
											</BtnLink>
										)}

										{!joinedUser &&
											!maybeUser &&
											!declinedUser && (
												<div className="flex flex-wrap gap-2">
													<BtnLink
														// className="px-4 py-2 w-full md:w-auto bg-green-500 text-white rounded hover:bg-blue-600"
														onClick={() =>
															updateJoinMember(
																"join",
															)
														}>
														I will Join
													</BtnLink>
													<BtnLink
														className="bg-green-500 text-white"
														onClick={() =>
															updateJoinMember(
																"maybe",
															)
														}>
														May Be
													</BtnLink>
													<BtnLink
														className="bg-red-500 text-white"
														onClick={() =>
															updateJoinMember(
																"decline",
															)
														}>
														Decline
													</BtnLink>
												</div>
											)}
									</div>
								</div>

								{/* Tags */}
								<div className="flex flex-wrap gap-2 mb-6">
									<span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
										#{eventDetails?.data.event_category}
									</span>
								</div>
							</div>

							<h2 className="text-xl font-semibold mb-4 p-6">
								Going ({users.length > 0 ? users.length : "0"})
							</h2>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6">
								{users.length > 0
									? users.map((attendee: any, index) => (
											<div
												key={index}
												className="text-center">
												{/* Conditional image rendering */}

												<img
													src={
														attendee?.image
															? import.meta.env
																	.VITE_BASE_URL +
															  "upload/profile/" +
															  attendee?.image
															: "/assets/images/icon-user.webp"
													}
													alt={
														attendee.first_name +
														" " +
														attendee.last_name
													}
													className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
												/>

												<p className="text-sm font-medium">
													{attendee.first_name +
														" " +
														attendee.last_name}
												</p>
												<p className="text-xs text-gray-500">
													{attendee?.educationField && (
														<p className="text-sm text-gray-500 ">
															{attendee?.educationField?.join(
																" | ",
															)}
														</p>
													)}
												</p>
											</div>
									  ))
									: "No any Records"}
							</div>
							<h2 className="text-xl font-semibold mb-4 p-6">
								May Be (
								{maybeUsers.length > 0
									? maybeUsers.length
									: "0"}
								)
							</h2>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6">
								{maybeUsers.length > 0
									? maybeUsers.map(
											(maybeattendee: any, index) => (
												<div
													key={index}
													className="text-center">
													{/* Conditional image rendering */}

													<img
														src={
															maybeattendee?.image
																? import.meta
																		.env
																		.VITE_BASE_URL +
																  "upload/profile/" +
																  maybeattendee?.image
																: "/assets/images/icon-user.webp"
														}
														alt={
															maybeattendee.first_name +
															" " +
															maybeattendee.last_name
														}
														className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
													/>

													<p className="text-sm font-medium">
														{maybeattendee.first_name +
															" " +
															maybeattendee.last_name}
													</p>
													<p className="text-xs text-gray-500">
														{maybeattendee?.educationField && (
															<p className="text-sm text-gray-500 ">
																{maybeattendee?.educationField?.join(
																	" | ",
																)}
															</p>
														)}
													</p>
												</div>
											),
									  )
									: "No any Records"}
							</div>
						</div>
					</main>
				</div>
			</div>
			<FooterComponent />
		</>
	);
};

export default EventsDetailPage;
