import Icon from "utils/icon";
import { classNames } from "utils";
import Button from "components/ui/common/Button";
import { Link, useNavigate } from "react-router-dom";
import React, { Fragment,useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { CUserStatusClass, pageStartFrom, tooltipClass } from "utils/consts";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage,deleteUser, useUserData,statusUser } from "api/services/user";
import { HTTPError } from "ky";
import PaginationBar from "components/ui/paginationBar";
import TableHead from "components/ui/table/tableHead";
import { IUser, TableHeadType,ConfirmPopupDataType } from "utils/datatypes";
import TableLoader from "components/layout/tableLoader";
import TableData from "components/ui/table/tableData";
import { endOfDay, format } from "date-fns";
import NotFound from "components/ui/common/NotFound";
import ConfirmPopup from "components/ui/ConfirmPopup";
import { apiClient } from "api/client";
// import { Tooltip } from 'react-tooltip';
import ReactTooltip from "react-tooltip";


function Alumnis() {
	const navigate = useNavigate();

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [itemId, setItemId] = useState(null);
	const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
	const [IsDeleteCancelled, setIsDeleteCancelled] = useState(false);
	const [ConfirmResult, setConfirmResult] = useState(false);
	const [cancelBtnTitle, setcancelBtnTitle] =useState("Cancel");
	const [confirmBtnTitle, setconfirmBtnTitle] =useState("Confirm");

	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [selectedDepartment, setSelectedDepartment] = useState<number>(0);
	const [selectedEndYear, setSelectedEndYear] = useState<number>(0);

	const ConfirmPopupData : ConfirmPopupDataType =
		{ title: "Alumni Delete", text: "Are you sure you want to delete Alumni?" };
	

	const {
		isLoading,
		data: userList,
		refetch: fetchUserList,
		isFetching: isFetchingUserList,
	} = useUserData({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		filter_course: selectedCourse,
		filter_department: selectedDepartment,
		filter_endyear: selectedEndYear,
		page_number: pageNumber,
		page_size: pageSize.value,
		isalumni: 1,
	}) || [];
	console.log("userList", userList);
	console.log("isLoading", isLoading);

	const [isAddAccess, setIsAddAccess] = useState(false);
	const [isEditAccess, setIsEditAccess] = useState(false);
	const [isDeleteAccess, setIsDeleteAccess] = useState(false);

	const [openMenuId, setOpenMenuId] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
		 
		
		  try {

			const storedUserData = localStorage.getItem('user');

			if (storedUserData) {
				const userData = JSON.parse(storedUserData);
				var roleId = userData.role_id;
				}
			
			const response = await apiClient
			  .get(
				  `api/v1/role/role_id=${roleId}`
			  );
			  const result = await response.json();
			  var rolepermid = result?.data;
			  
			
		  } catch (error) {
			console.error(`Error fetching data for ID ${roleId}: ${error}`);
		  }

		  const checkIfIncludes = (value:any) => {
			
			return rolepermid.includes(value);
			
		  };
		 
		  	const addmodule = await apiClient
			  .get(
				  `api/v1/submenu/action=Add&module_alias=alumnilist`
			  );
			  const resultaddmodule = await addmodule.json();
			  var addmoduleid = resultaddmodule?.data?.id;

			  if(checkIfIncludes(addmoduleid)==true){
				var isaddaccess = true;
				} else{
					var isaddaccess = false;
				}
			
				setIsAddAccess(isaddaccess);

			const editmodule = await apiClient
			  .get(
				  `api/v1/submenu/action=Edit&module_alias=alumnilist`
			  );
			  const resulteditmodule = await editmodule.json();
			  var editmoduleid = resulteditmodule?.data?.id;
			  
			  if(checkIfIncludes(editmoduleid)==true){
				var iseditaccess = true;
				} else{
					var iseditaccess = false;
				}
			
				setIsEditAccess(iseditaccess);

				const deletemodule = await apiClient
			  .get(
				  `api/v1/submenu/action=Delete&module_alias=alumnilist`
			  );
			  const resultdeletemodule = await deletemodule.json();
			  var deletemoduleid = resultdeletemodule?.data?.id;
			  
			  if(checkIfIncludes(deletemoduleid)==true){
				var isdeleteaccess = true;
				} else{
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
			name: "User Name",
		},
		{
			id: 2,
			name: "Gender",
		},
		{
			id: 3,
			name: "Batch",
		},			
		{
			id: 4,
			name: "Mobile No.",
		},
		{
			id: 5,
			name: "Registered On",
		},
		{
			id: 6,
			name: "STATUS",
		},
		{
			id: 7,
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
			fetchUserList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchUserList();
	}, [pageNumber]);

	useEffect(() => {
		ReactTooltip.rebuild();
	}, []);

	const { mutate: deleteItem, isLoading: uploadIsLoading } = useMutation(deleteUser, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Delete User Successfully",
				id: "delete_user_success",
			});
			fetchUserList();
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "delete_user" });
		},
	});

	 // Handle the actual deletion of the item
	 const submitDelete = (itemId:any) => {
		deleteItem(itemId);
		setIsDeleteConfirm(false);
	  };
	// Handle the displaying of the modal based on type and id
	const showDeleteModal = (itemId:any) => {
		setItemId(itemId);
		console.log(itemId);
		
		  //setDeleteMessage(`Are you sure you want to delete the vegetable '${vegetables.find((x) => x.id === id).name}'?`);
		
	 
		  setIsDeleteConfirm(true);
	  };


	  const { mutate: statusItem, isLoading: statusIsLoading } = useMutation(statusUser, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Status Changed Successfully",
				id: "status_user_success",
			});
			fetchUserList();
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "status_user" });
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
				<span className="text-lg font-semibold">
					Alumnis
				</span>
				{isAddAccess ? (
				<Link
					to={"/admin/alumni-details"}
					className={`rounded-md border border-transparent bg-primary p-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200`}>
					<Icon icon="plus" className="mr-1 h-5 w-5 text-white" />
					Add Alumni
				</Link>
				) : ("")}
			</div>

			<div className="flex flex-col">
				<table className="w-full border-separate border-spacing-y-2 text-left">
					<TableHead data={TableHeadData} />
					<tbody className="">
						{isLoading || isFetchingUserList ? (
							skeletonCards.map((index: number) => (
								<tr key={index}>
									<td colSpan={TableHeadData.length}>
										<TableLoader />
									</td>
								</tr>
							))
						) : (
							<>
								{userList &&
									userList?.data &&
									userList?.data?.length ? (
									userList?.data?.map(
										(
											item: IUser,
											i: number,
										) => {
											return (
												<React.Fragment
													key={item.id}>
													<tr
														className="overflow-hidden rounded-2xl border border-border bg-white text-gray-500"
														onClick={() => { }}>
														<TableData
															data={
																<div className="flex items-center">
																	<img
																		src="/assets/images/user.svg"
																		alt="User"
																		className="mr-2 h-8 w-8 rounded-md"
																	/>
																	<div>
																		<div>{item.first_name + " " + item.last_name}</div>
																		<div className="text-textSecondary">{item.email}</div>
																	</div>
																</div>
															}
														/>
														<TableData data={item.gender} />
														<TableData data={item?.batch_start + "-" + item?.batch_end} />																											
														<TableData data={item?.mobileno} />
														<TableData
															data={format(new Date(item.createdAt || ""), "do MMMM yyyy, p")}
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
																		Approved 
																	</button>																		
																		</>
																	) : (
																		item?.status === 'inactive' ? (
																			<>
																			<button
																		type="button"
																		className="hover:text-gray-600 focus:outline-none"
																		onClick={() => toggleMenu(item.id)}>
																			Pending 
																		</button>																		
																			</>
																		
																		) : (
																			<>
																		<button
																		type="button"
																		className="text-red-600 hover:text-gray-600 focus:outline-none"
																		onClick={() => toggleMenu(item.id)}>
																			Rejected
																		</button>																		
																		</>
																		
																		)
																	)
																	}
															
															{openMenuId === item.id && (
																<div className="absolute right-0 z-10 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg origin-top-right focus:outline-none">
																<div className="py-1">
																{
																	item?.status === 'active' ? (
																	<>
																	<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={() => changeStatus(item.id,'inactive')}>
																	
																	Pending
																	</button>
																	<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={() => changeStatus(item.id,'rejected')}>
																	
																	Reject
																	</button>
																	</>
																	) : (
																		item?.status === 'inactive' ? (
																			<>
																			<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={() => changeStatus(item.id,'active')}>
																			
																			Approve
																			</button>
																			<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={() => changeStatus(item.id,'rejected')}>
																			
																			Reject
																			</button>
																			</>
																		) : (
																			<>
																			<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={() => changeStatus(item.id,'inactive')}>
																			
																			Pending
																			</button>
																			<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={() => changeStatus(item.id,'active')}>
																			
																			Approve
																			</button>
																			</>
																		)
																	)
																	}
																	
																</div>
																</div>
															)}
															</div>	
																
															</>
														} />
														<TableData data={
															<>
																{isEditAccess ? (
																<Link to={'/admin/alumni-details/' + item.id}>
																	<Icon icon="pencil-square-outline" className="w-6 h-6 cursor-pointer"
																		data-tooltip-id="tooltip" data-tooltip-content="Edit User" />
																</Link>
																) : ("") }
																{isDeleteAccess ? (
																	<Icon icon="trash-outline" className="w-6 h-6 cursor-pointer"
																		data-tooltip-id="tooltip" data-tooltip-content="Delete User" onClick={() => showDeleteModal(item.id)} />
																) : ("") }
															</>
														} />
													</tr>
												</React.Fragment>
											);
										},
									)
								) : (
									<tr>
										<td
											colSpan={
												TableHeadData?.length
											}
											className="text-center text-gray-500">
											<NotFound
												type="users"
												setOpenCreate={(
													value: boolean,
												) => {
													if (value)
														navigate(
															"/admin/user-details",
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
						userList?.total_records ? userList?.total_records : 0
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
			<ConfirmPopup isDeleteConfirm={isDeleteConfirm} setIsDeleteConfirm={setIsDeleteConfirm} setIsDeleteCancelled={setIsDeleteCancelled} data={ConfirmPopupData} setConfirmResult={setConfirmResult} cancelBtnTitle={cancelBtnTitle} confirmBtnTitle={confirmBtnTitle} ConfirmModal={submitDelete} itemId={Number(itemId)}  />
		</div>
	);
}

export default Alumnis;
