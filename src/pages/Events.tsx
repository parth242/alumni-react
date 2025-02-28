import Icon from "utils/icon";
import Button from "components/ui/common/Button";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CUserStatusClass, pageStartFrom, tooltipClass } from "utils/consts";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage } from "api/services/user";
import { useEvents, deleteEvent, statusEvent } from "api/services/eventService";
import { HTTPError } from "ky";
import PaginationBar from "components/ui/paginationBar";
import TableHead from "components/ui/table/tableHead";
import {
	IUser,
	TableHeadType,
	ConfirmPopupDataType,
	IEvent,
} from "utils/datatypes";
import TableLoader from "components/layout/tableLoader";
import TableData from "components/ui/table/tableData";
import { endOfDay, format } from "date-fns";
import NotFound from "components/ui/common/NotFound";
import ConfirmPopup from "components/ui/ConfirmPopup";
import { apiClient } from "api/client";
// import { Tooltip } from 'react-tooltip';
import ReactTooltip from "react-tooltip";

function Events() {
	const navigate = useNavigate();

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

	const [itemId, setItemId] = useState(null);
	const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
	const [IsDeleteCancelled, setIsDeleteCancelled] = useState(false);
	const [ConfirmResult, setConfirmResult] = useState(false);
	const [cancelBtnTitle, setcancelBtnTitle] = useState("Cancel");
	const [confirmBtnTitle, setconfirmBtnTitle] = useState("Confirm");

	const ConfirmPopupData: ConfirmPopupDataType = {
		title: "Event Delete",
		text: "Are you sure you want to delete Event?",
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
		user_id: 0,
	}) || [];
	console.log("eventList", eventList);
	console.log("isLoading", isLoading);

	const [isAddAccess, setIsAddAccess] = useState(false);
	const [isEditAccess, setIsEditAccess] = useState(false);
	const [isDeleteAccess, setIsDeleteAccess] = useState(false);
	const [openMenuId, setOpenMenuId] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const storedUserData = localStorage.getItem("user");

				if (storedUserData) {
					const userData = JSON.parse(storedUserData);
					var roleId = userData.role_id;
				}

				const response = await apiClient.get(
					`api/v1/role/role_id=${roleId}`,
				);
				const result = await response.json();
				var rolepermid = (result as { data: any })?.data;
			} catch (error) {
				console.error(`Error fetching data for ID ${roleId}: ${error}`);
			}

			const checkIfIncludes = (value: any) => {
				return rolepermid.includes(value);
			};

			const addmodule = await apiClient.get(
				`api/v1/submenu/action=Add&module_alias=eventlist`,
			);
			const resultaddmodule = await addmodule.json();
			var addmoduleid = (resultaddmodule as { data: any })?.data?.id;

			if (checkIfIncludes(addmoduleid) == true) {
				var isaddaccess = true;
			} else {
				var isaddaccess = false;
			}

			setIsAddAccess(isaddaccess);

			const editmodule = await apiClient.get(
				`api/v1/submenu/action=Edit&module_alias=eventlist`,
			);
			const resulteditmodule = await editmodule.json();
			var editmoduleid = (resulteditmodule as { data: any })?.data?.id;

			if (checkIfIncludes(editmoduleid) == true) {
				var iseditaccess = true;
			} else {
				var iseditaccess = false;
			}

			setIsEditAccess(iseditaccess);

			const deletemodule = await apiClient.get(
				`api/v1/submenu/action=Delete&module_alias=eventlist`,
			);
			const resultdeletemodule = await deletemodule.json();
			var deletemoduleid = (resultdeletemodule as { data: any })?.data
				?.id;

			if (checkIfIncludes(deletemoduleid) == true) {
				var isdeleteaccess = true;
			} else {
				var isdeleteaccess = false;
			}

			setIsDeleteAccess(isdeleteaccess);
		};

		fetchData();
	}, []); // Empty dependency array means this effect runs once on mount

	const skeletonCards = [...Array(10).keys()];

	const TableHeadData: TableHeadType = [
		{
			id: 1,
			name: "Event Title",
		},
		{
			id: 2,
			name: "Event Category",
		},
		{
			id: 3,
			name: "Event Date",
		},
		{
			id: 4,
			name: "location",
		},
		{
			id: 5,
			name: "Status",
		},
		{
			id: 6,
			name: "ACTION",
		},
	];
	const paginate = (pageNumber: number) => {
		setPageNumber(pageNumber);
	};
	// Change page
	const paginateFront = () => {
		setPageNumber(pageNumber + 1);
	};
	const paginateBack = () => {
		setPageNumber(pageNumber - 1);
	};

	const handlePageSizeChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const { value } = event.target;
		setPageSize({ value: +value });
	};
	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchEventList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchEventList();
	}, [pageNumber]);

	useEffect(() => {
		ReactTooltip.rebuild();
	}, []);

	const { mutate: deleteItem, isLoading: uploadIsLoading } = useMutation(
		deleteEvent,
		{
			onSuccess: async () => {
				SuccessToastMessage({
					title: "Delete Event Successfully",
					id: "delete_event_success",
				});
				fetchEventList();
			},
			onError: async (e: HTTPError) => {
				// const error = await e.response.text();
				// console.log("error", error);
				ErrorToastMessage({ error: e, id: "delete_event" });
			},
		},
	);

	// Handle the actual deletion of the item
	const submitDelete = (itemId: any) => {
		deleteItem(itemId);
		setIsDeleteConfirm(false);
	};
	// Handle the displaying of the modal based on type and id
	const showDeleteModal = (itemId: any) => {
		setItemId(itemId);
		console.log(itemId);

		//setDeleteMessage(`Are you sure you want to delete the vegetable '${vegetables.find((x) => x.id === id).name}'?`);

		setIsDeleteConfirm(true);
	};

	const { mutate: statusItem, isLoading: statusIsLoading } = useMutation(statusEvent, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Status Changed Successfully",
				id: "status_event_success",
			});
			fetchEventList();
			
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "status_event" });
		},
	});

	const changeStatus = (itemId:any,status:string) => {
		interface dataJoin {
			id: number;
			status: string;			
		}
		let data: dataJoin = {
			id: Number(itemId), 			
			status: status			
		};
		statusItem(data as any);
		setOpenMenuId(null);
	  };

	const toggleMenu = (id:any) => {
		setOpenMenuId(openMenuId === id ? null : id);
	  };

	return (
		<div className="">
			<div className="flex justify-between border-b border-border pb-5 items-center">
				<span className="text-lg font-semibold">Events</span>
				{isAddAccess ? (
					<Link
						to={"/admin/event-details"}
						className={`rounded-md border border-transparent bg-primary p-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200`}>
						<Icon icon="plus" className="mr-1 h-5 w-5 text-white" />
						Add Event
					</Link>
				) : (
					""
				)}
			</div>

			<div className="flex flex-col">
				<table className="w-full border-separate border-spacing-y-2 text-left">
					<TableHead data={TableHeadData} />
					<tbody className="">
						{isLoading || isFetchingEventList || statusIsLoading ? (
							skeletonCards.map((index: number) => (
								<tr key={index}>
									<td colSpan={TableHeadData.length}>
										<TableLoader />
									</td>
								</tr>
							))
						) : (
							<>
								{eventList &&
								eventList?.data &&
								eventList?.data?.length ? (
									eventList?.data?.map(
										(item: IEvent, i: number) => {
											return (
												<React.Fragment key={item.id}>
													<tr
														className="overflow-hidden rounded-2xl border border-border bg-white text-gray-500"
														onClick={() => {}}>
														<TableData
															data={
																<div className="flex items-center">
																	{
																		item.event_title
																	}
																</div>
															}
														/>
														<TableData
															data={
																item.event_category
															}
														/>
														<TableData
															data={format(
																new Date(
																	item.event_date ||
																		"",
																),
																"p, do MMMM yyyy",
															)}
														/>

														<TableData
															data={item.location}
														/>
														<TableData data={
															<>
															<div className="absolute">
															
																	{
																	item?.status === 'active' ? (
																		<>
																		<button
																	type="button"
																	className="text-green-600 hover:text-gray-600 focus:outline-none"
																	onClick={() => toggleMenu(item.id)}>
																		Active 
																	</button>																		
																		</>
																	) : (
																		
																			<>
																			<button
																		type="button"
																		className="hover:text-gray-600 focus:outline-none"
																		onClick={() => toggleMenu(item.id)}>
																			Inactive 
																		</button>																		
																			</>
																		
																		
																	)
																	}
															
															{openMenuId === item.id && (
																<div className="absolute right-0 z-10 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg origin-top-right focus:outline-none">
																<div className="py-1">
																{
																	item?.status === 'active' ? (
																	<>
																	<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={() => changeStatus(item.id,'inactive')}>
																	
																	Inactive
																	</button>
																	
																	</>
																	) : (
																		
																			<>
																			<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={() => changeStatus(item.id,'active')}>
																			
																			Active
																			</button>
																			
																			</>
																		
																	)
																	}
																	
																</div>
																</div>
															)}
															</div>	
																
															</>
														} />
														<TableData
															data={
																<>
																	{isEditAccess ? (
																		<Link
																			to={
																				"/admin/event-details/" +
																				item.id
																			}>
																			<Icon
																				icon="pencil-square-outline"
																				className="w-6 h-6 cursor-pointer"
																				data-tooltip-id="tooltip"
																				data-tooltip-content="Edit User"
																			/>
																		</Link>
																	) : (
																		""
																	)}
																	{isDeleteAccess ? (
																		<Icon
																			icon="trash-outline"
																			className="w-6 h-6 cursor-pointer"
																			data-tooltip-id="tooltip"
																			data-tooltip-content="Delete User"
																			onClick={() =>
																				showDeleteModal(
																					item.id,
																				)
																			}
																		/>
																	) : (
																		""
																	)}
																</>
															}
														/>
													</tr>
												</React.Fragment>
											);
										},
									)
								) : (
									<tr>
										<td
											colSpan={TableHeadData?.length}
											className="text-center text-gray-500">
											<NotFound
												type="events"
												setOpenCreate={(
													value: boolean,
												) => {
													if (value)
														navigate(
															"/admin/event-details",
														);
												}}
											/>
										</td>
									</tr>
								)}
							</>
						)}
					</tbody>
				</table>
			</div>
			{/* Start for Pagination */}
			<div>
				<PaginationBar
					campaignsPerPage={pageSize.value}
					totalCampaigns={
						eventList?.total_records ? eventList?.total_records : 0
					}
					paginateBack={paginateBack}
					paginate={paginate}
					paginateFront={paginateFront}
					currentPage={pageNumber}
					handleCampaignperChange={handlePageSizeChange}
				/>
			</div>
			{/* End for Pagination */}

			{/* <Tooltip
				id="my-tooltip"
			/> */}
			<ReactTooltip
				id="tooltip"
				place="right"
				type={"dark"}
				effect="float"
				html={true}
				className={`${tooltipClass}`}
			/>
			<ConfirmPopup
				isDeleteConfirm={isDeleteConfirm}
				setIsDeleteConfirm={setIsDeleteConfirm}
				setIsDeleteCancelled={setIsDeleteCancelled}
				data={ConfirmPopupData}
				setConfirmResult={setConfirmResult}
				cancelBtnTitle={cancelBtnTitle}
				confirmBtnTitle={confirmBtnTitle}
				ConfirmModal={submitDelete}
				itemId={Number(itemId)}
			/>
		</div>
	);
}

export default Events;
