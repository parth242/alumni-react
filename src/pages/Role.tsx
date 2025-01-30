import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TableData from "components/ui/table/tableData";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage } from "api/services/user";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { FormDataType, ISubmenu, Menu, TRoleFormData } from "utils/datatypes";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize, menu } from "utils/consts";
import { createRole, getRole } from "api/services/roleService";
import { useSubmenus } from "api/services/submenuService";
import { apiClient } from "api/client";

function Role() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};
	const [statusList] = useState([
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
	]);

	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),
		name: yup
			.string()
			.required("Role Name is required"),

		status: yup
			.string()
			.required("Status is required"),

		menu: yup
			.array()
			.optional(),
	});

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TRoleFormData>({
		resolver: yupResolver(schema),
		defaultValues: {
		}
	});

	let {
		isLoading,
		data: roleDetails,
		refetch: fetchRole,
		isFetching: isFetchingRole,
		remove,
	} = getRole({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchRole();
		} else {
			roleDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(roleDetails?.data);
		trigger();
	}, [roleDetails]);

	const [searchText, setSearchText] = useState("");
	const [dataSub, setDataSub] = useState([]);
	

	useEffect(() => {
		const fetchData = async () => {
		 
		  
		  const fetchDataForId = async (item) => {
			try {
			  const response = await apiClient
				.get(
					`api/v1/submenu/module_alias=${item}`
				);
				const result = await response.json();
			  
			  return result;
			} catch (error) {
			  console.error(`Error fetching data for ID ${item}: ${error}`);
			}
		  };
		  
		  const userDataResponse = (await useSubmenus() as ISubmenu);
			var submenuall = userDataResponse?.data;
		  
		const originalData = await Promise.all(submenuall.map((mn) => {
			return [mn.module_alias];
		}));
		 

		  const fetchDataForAllIds = async () => {
			const allData = await Promise.all(originalData.map(async (item) => fetchDataForId(item)));
			
			setDataSub(allData);
		  };
	
		  fetchDataForAllIds();
		};
	
		fetchData();
	  }, []); // Empty dependency array means this effect runs once on mount

	 

	const { mutate } = useMutation(createRole, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Role Created Successfully",
				id: "create_role_success",
			});
			navigate("/admin/roles");
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "create_role" });
		},
	});
	const onSubmit = (data: TRoleFormData) => {
		
		mutate(data);
	};
	/*const checkAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setValue("menu", menu.map((m: Menu) => m.name))
		} else {
			setValue("menu", [])
		}
	};*/

	return (
		<div className="">
			<div className="inline-block w-full border-b border-border">
				<span className="mb-2 text-lg font-semibold float-left">
					Personal Information
				</span>
			</div>

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-5">
					<div className="col-span-1">
						<Input
							placeholder="Enter Role Name"
							name={"name"}
							label={"Role Name"}
							error={errors?.name?.message}
							register={register}
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-5">
					<div className="col-span-1">
						<Select
							name={"status"}
							label={"Status"}
							items={statusList}
							error={errors?.status?.message}
							register={register}
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-5">
					<div className="col-span-1">

						<label
							className="font-medium text-gray-900 dark:text-darkPrimary mb-2 block">
							Menu
						</label>

						<div className="grid gap-y-2">
						<div className="flex flex-col">
				<table className="w-full border-separate border-spacing-y-2 text-left">
				<thead className="overflow-hidden">
					<tr className="!font-semibold">
						
							<th
								scope="col"
								className={`p-4`}>
								
							</th>
							<th
								scope="col"
								className={`p-4`}>
								<label htmlFor="viewall">View</label>
								
							</th>
							<th
								scope="col"
								className={`p-4`}>
								<label htmlFor="addall">Add</label>
								
							</th>
							<th
								scope="col"
								className={`p-4`}>
								<label htmlFor="editall">Edit</label>
								
							</th>
							<th
								scope="col"
								className={`p-4`}>
								<label htmlFor="deleteall">Delete</label>
								
							</th>
						
					</tr>
				</thead>
					<tbody className="">
					{dataSub?.map(
										(
											item: ISubmenu,
											i: number,
										) => {
											return (
												<React.Fragment
													key={dataSub[i].data[0].id}>
					<tr	className="overflow-hidden rounded-2xl border border-border bg-white text-gray-500">

														<TableData data={dataSub[i].data[0].moduleshortname} />
														{/* <TableData data={
															item.menu.split(",").map((mitem: string) => menu.filter((mi: Menu) => mi.name == mitem)[0].title).join(", ")
														} /> */}
														<TableData data={
															<>
																<input id={"menu-view-" + i} type="checkbox" {...register("menu")} defaultValue={dataSub[i].data[0].id} className="focus:ring-0 rounded" />
															</>
														} />
														{ (typeof dataSub[i].data[1]!=='undefined') ?
														<TableData data={
															<>
																<input id={"menu-add-" + i} type="checkbox" {...register("menu")}  defaultValue={dataSub[i].data[1].id} className="focus:ring-0 rounded" />
															</>
														} /> : 
														
															<TableData data={
																<>
																		</>
															} />
														}
														{ (typeof dataSub[i].data[2]!=='undefined') ?
														<TableData data={
															<>
																<input id={"menu-edit-" + i} type="checkbox" {...register("menu")} defaultValue={dataSub[i].data[2].id} className="focus:ring-0 rounded" />
															</>
														} /> :
														<TableData data={
															<>
																	</>
														} />
														}
														{ (typeof dataSub[i].data[3]!=='undefined') ?
														<TableData data={
															<>
																<input id={"menu-delete-" + i} type="checkbox" {...register("menu")} defaultValue={dataSub[i].data[3].id} className="focus:ring-0 rounded" />
															</>
														} /> :
														<TableData data={
															<>
																	</>
														} />
														}
													</tr>
													</React.Fragment>
											);
										},
									)}
					</tbody>
				</table>
				</div>
							
						</div>
						
					</div>
				</div>
				<div className="mt-6">
					<Button className="!transition-colors !duration-700 text-lg font-medium text-white shadow-sm hover:!bg-blue-700 focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0">
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}

export default Role;
