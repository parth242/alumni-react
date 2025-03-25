import Icon from "utils/icon";
import Button from "components/ui/common/Button";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CUserStatusClass, pageStartFrom, tooltipClass } from "utils/consts";
import { useDepartments,deleteDepartment,statusDepartment } from "api/services/departmentService";
import { ErrorToastMessage, SuccessToastMessage } from "api/services/user";
import { useMutation } from "react-query";
import { HTTPError } from "ky";
import PaginationBar from "components/ui/paginationBar";
import TableHead from "components/ui/table/tableHead";
import { IDepartment, TableHeadType,ConfirmPopupDataType } from "utils/datatypes";
import TableLoader from "components/layout/tableLoader";
import TableData from "components/ui/table/tableData";
import { endOfDay, format } from "date-fns";
import NotFound from "components/ui/common/NotFound";
import ConfirmPopup from "components/ui/ConfirmPopup";
import { apiClient } from "api/client";
// import { Tooltip } from 'react-tooltip';
import ReactTooltip from "react-tooltip";


function Departments() {
	
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

	const ConfirmPopupData : ConfirmPopupDataType =
		{ title: "Department Delete", text: "Are you sure you want to delete Department?" };

	const {
		isLoading,
		data: departmentList,
		refetch: fetchDepartmentList,
		isFetching: isFetchingDepartmentList,
	} = useDepartments({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,
	}) || [];
	console.log("departmentList", departmentList);
	console.log("isLoading", isLoading);

	const [isAddAccess, setIsAddAccess] = useState(false);
	const [isEditAccess, setIsEditAccess] = useState(false);
	const [isDeleteAccess, setIsDeleteAccess] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
		 
			interface ApiResponse {
				data: any; // or a more specific type based on the structure of the data
			  }
		
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
			  const result: ApiResponse = await response.json();
			  var rolepermid = result?.data;
			  
			
		  } catch (error) {
			console.error(`Error fetching data for ID ${roleId}: ${error}`);
		  }

		  const checkIfIncludes = (value: number) => {
			
			return rolepermid.includes(value);
			
		  };
		 
		  	const addmodule = await apiClient
			  .get(
				  `api/v1/submenu/action=Add&module_alias=departmentlist`
			  );
			  const resultaddmodule: ApiResponse = await addmodule.json();
			  var addmoduleid = resultaddmodule?.data?.id;

			  if(checkIfIncludes(addmoduleid)==true){
				var isaddaccess = true;
				} else{
					var isaddaccess = false;
				}
			
				setIsAddAccess(isaddaccess);

			const editmodule = await apiClient
			  .get(
				  `api/v1/submenu/action=Edit&module_alias=departmentlist`
			  );
			  const resulteditmodule: ApiResponse = await editmodule.json();
			  var editmoduleid = resulteditmodule?.data?.id;
			  
			  if(checkIfIncludes(editmoduleid)==true){
				var iseditaccess = true;
				} else{
					var iseditaccess = false;
				}
			
				setIsEditAccess(iseditaccess);

				const deletemodule = await apiClient
			  .get(
				  `api/v1/submenu/action=Delete&module_alias=departmentlist`
			  );
			  const resultdeletemodule: ApiResponse = await deletemodule.json();
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
			name: "Department Name",
		},	
		{
			id: 2,
			name: "Course",
		},		
		{
			id: 3,
			name: "Created On",
		},
		{
			id: 4,
			name: "STATUS",
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

	const handlePageSizeChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const { value } = event.target;
		setPageSize({ value: +value });
	};
	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchDepartmentList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchDepartmentList();
	}, [pageNumber]);

	useEffect(() => {
		ReactTooltip.rebuild();
	}, []);

	const { mutate: deleteItem, isLoading: uploadIsLoading } = useMutation(deleteDepartment, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Delete Department Successfully",
				id: "delete_department_success",
			});
			fetchDepartmentList();
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "delete_department" });
		},
	});

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

	const { mutate: statusItem, isLoading: statusIsLoading } = useMutation(statusDepartment, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Status Changed Successfully",
				id: "status_department_success",
			});
			fetchDepartmentList();
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "status_department" });
		},
	});

	const changeStatus = (itemId: any) => {
		
		statusItem(itemId);
		
	  };

	return (
		<div className="">
			<div className="flex justify-between border-b border-border pb-5 items-center">
				<span className="text-lg font-semibold">
					Departments
				</span>
				{isAddAccess ? (
							
				<Link
					to={"/admin/department-details"}
					className={`rounded-md border border-transparent bg-primary p-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200`}>
					<Icon icon="plus" className="mr-1 h-5 w-5 text-white" />
					Add Department
				</Link>
				) : ("")}
			</div>

			<div className="flex flex-col">
				<table className="w-full border-separate border-spacing-y-2 text-left">
					<TableHead data={TableHeadData} />
					<tbody className="">
						{isLoading || isFetchingDepartmentList ? (
							skeletonCards.map((index: number) => (
								<tr key={index}>
									<td colSpan={TableHeadData.length}>
										<TableLoader />
									</td>
								</tr>
							))
						) : (
							<>
								{departmentList &&
									departmentList?.data &&
									departmentList?.data?.length ? (
									departmentList?.data?.map(
										(
											item: IDepartment,
											i: number,
										) => {
											return (
												<React.Fragment
													key={item.id}>
													<tr
														className="overflow-hidden rounded-2xl border border-border bg-white text-gray-500"
														onClick={() => { }}>														
														<TableData data={item.department_name} />
														<TableData data={item.course?.course_shortcode} />
														<TableData
															data={item.createdAt ? format(new Date(item.createdAt), "do MMMM yyyy, p") : "-"}
															/>
														<TableData data={
															<>
																<Link to={'javascript:void(0)'} onClick={() => changeStatus(item.id)}><span className={`${CUserStatusClass[item?.status]}`} >{item?.status}</span></Link>
															</>
														} />
														<TableData data={
															<>
																{isEditAccess ? (
																<Link to={'/admin/department-details/' + item.id}>
																	<Icon icon="pencil-square-outline" className="w-6 h-6 cursor-pointer"
																		data-tooltip-id="tooltip" data-tooltip-content="Edit Department" />
																</Link>
																) : ("") }
																{isDeleteAccess ? (
																<Icon icon="trash-outline" className="w-6 h-6 cursor-pointer"
																		data-tooltip-id="tooltip" data-tooltip-content="Delete Department" onClick={() => showDeleteModal(item.id)} />
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
												type="departments"
												setOpenCreate={(
													value: boolean,
												) => {
													if (value)
														navigate(
															"/admin/department-details",
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
						departmentList?.total_records ? departmentList?.total_records : 0
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

export default Departments;
