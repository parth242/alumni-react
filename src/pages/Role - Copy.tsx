import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage } from "api/services/user";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { FormDataType, Menu, TRoleFormData } from "utils/datatypes";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize, menu } from "utils/consts";
import { createRole, getRole } from "api/services/roleService";


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

		menu: yup.array().min(1, "At least 1 menu is required").optional(),
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
	const checkAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setValue("menu", menu.map((m: Menu) => m.name))
		} else {
			setValue("menu", [])
		}
	};

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
							<div>
								<div className="flex gap-x-2 border-b my-2 pb-2">
									<input id={"menuAll"} type="checkbox" className="focus:ring-0 rounded" onChange={(e) => checkAll(e)} />
									<label htmlFor={"menuAll"}>Check All</label>
								</div>
							</div>
							{menu.map(
								(
									item: Menu,
									i: number,
								) => {
									return (
										<React.Fragment
											key={"menuCheck" + item.id}>
											<div className="flex gap-x-2">
												<input id={"menu-" + i} type="checkbox"  defaultValue={item.name} className="focus:ring-0 rounded" />
												<label htmlFor={"menu-" + i}>{item.title}</label>
											</div>
										</React.Fragment>
									)
								})}
						</div>
						{(errors?.menu?.message) && (
							<span className="text-red-500 mt-1 block">
								<span>{errors?.menu?.message}</span>
								&nbsp;
							</span>
						)}
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
