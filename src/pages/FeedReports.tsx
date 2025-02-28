import Icon from "utils/icon";
import Button from "components/ui/common/Button";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CUserStatusClass, pageStartFrom, tooltipClass } from "utils/consts";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage } from "api/services/user";
import { useFeedReportReports } from "api/services/feedReportService";
import { HTTPError } from "ky";
import PaginationBar from "components/ui/paginationBar";
import TableHead from "components/ui/table/tableHead";
import {
	IUser,
	TableHeadType,
	ConfirmPopupDataType,
	IFeedReport, 
} from "utils/datatypes";
import TableLoader from "components/layout/tableLoader";
import TableData from "components/ui/table/tableData";
import { endOfDay, format } from "date-fns";
import NotFound from "components/ui/common/NotFound";
import ConfirmPopup from "components/ui/ConfirmPopup";
import { apiClient } from "api/client";
// import { Tooltip } from 'react-tooltip';
import ReactTooltip from "react-tooltip";

function FeedReportReports() {
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
		title: "FeedReport Delete",
		text: "Are you sure you want to delete FeedReport?",
	};

	const {
		isLoading,
		data: feedReportList,
		refetch: fetchFeedReportList,
		isFetching: isFetchingFeedReportList,
	} = useFeedReportReports({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,
		group_id: 0,
		user_id: 0,
	}) || [];
	console.log("feedReportList", feedReportList);
	

	const [isAddAccess, setIsAddAccess] = useState(false);
	const [isEditAccess, setIsEditAccess] = useState(false);
	const [isDeleteAccess, setIsDeleteAccess] = useState(false);

	

	const skeletonCards = [...Array(10).keys()];

	const TableHeadData: TableHeadType = [
		{
			id: 1,
			name: "Content",
		},
		{
			id: 2,
			name: "Category",
		},		
		{
			id: 3,
			name: "Posted Date",
		},
		{
			id: 4,
			name: "Status",
		},
		{
			id: 5,
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

	const limitWords = (text: string, limit: number) => {
		const words = text.split(" ");
		if (words.length > limit) {
			return words.slice(0, limit).join(" ") + "...";
		}
		return text;
	};

	const handlePageSizeChange = (
		feedReport: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const { value } = feedReport.target;
		setPageSize({ value: +value });
	};
	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchFeedReportList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchFeedReportList();
	}, [pageNumber]);

	useEffect(() => {
		ReactTooltip.rebuild();
	}, []);

	

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

	  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id:any) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

	return (
		<div className="">
			<div className="flex justify-between border-b border-border pb-5 items-center">
				<span className="text-lg font-semibold">Feed Reports</span>
				
			</div>

			<div className="flex flex-col">
				<table className="w-full border-separate border-spacing-y-2 text-left">
					<TableHead data={TableHeadData} />
					<tbody className="">
						{isLoading || isFetchingFeedReportList ? (
							skeletonCards.map((index: number) => (
								<tr key={index}>
									<td colSpan={TableHeadData.length}>
										<TableLoader />
									</td>
								</tr>
							))
						) : (
							<>
								{feedReportList &&
								feedReportList?.data &&
								feedReportList?.data?.length ? (
									feedReportList?.data?.map(
										(item: IFeedReport, i: number) => {
											return (
												<React.Fragment key={item.id}>
													<tr
														className="overflow-hidden rounded-2xl border border-border bg-white text-gray-500"
														onClick={() => {}}>
														<TableData
															data={
																<div className="flex items-center">
																	{
																		limitWords(item.description, 5)
																	}
																</div>
															}
														/>
														<TableData
															data={
																item.dashboard_category?.category_name != null ? (
																	item.dashboard_category?.category_name
																) : ("-")
															}
														/>

														
														
														<TableData
															data={format(
																new Date(
																	item.createdAt ||
																		"",
																),
																"p, do MMMM yyyy",
															)}
														/>
														
														<TableData
															data={
																<div>
																{item.status}
																<>
																<div className="absolute">
																<button
																	type="button"
																	className="text-green-600 hover:text-gray-600 focus:outline-none"
																	onClick={() => toggleMenu(item.id)}>
																		Change Status 
																	</button>																		
																		
																	
															
															</div>
															</>
															</div>
															}
														/>

														<TableData
															data={
																<>
																	{isEditAccess ? (
																		<Link
																			to={
																				"/admin/feedReport-details/" +
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
												type="feedReports"
												setOpenCreate={(
													value: boolean,
												) => {
													if (value)
														navigate(
															"/admin/feedReport-details",
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
						feedReportList?.total_records ? feedReportList?.total_records : 0
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

export default FeedReportReports;
