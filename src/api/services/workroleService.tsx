import {
	WorkRoleRequest,
	WorkRoleResponse,
	WorkRolesRequest,
	WorkRolesResponse,
	WorkRoleFormData,	
	IWorkRole
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getWorkRole = ({
	enabled,
	id,
}: WorkRoleRequest) => {
	return useQuery<WorkRoleResponse, HTTPError>(
		["workrole"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/workrole/` + id,
					)
					.json();
			} catch (error) {
				return Promise.reject(error);
			}
		},
		{
			enabled: enabled,
			refetchOnWindowFocus: false,
			retry: false,
			refetchOnMount: false,
		},
	);
};


const useWorkRoles = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: WorkRolesRequest) => {
	return useQuery<WorkRolesResponse, HTTPError>(
		["workroleList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/workrole/
						?` +
						(filter_status != ""
							? "&filter_status=" + filter_status
							: "") +
						(filter_name ? "&filter_name=" + filter_name : "") +
						`&page_number=${page_number}
						&page_size=${page_size}&flow_types=0&flow_types=1&flow_types=2`,
					)
					.json();
			} catch (error) {
				return Promise.reject(error);
			}
		},
		{
			enabled: enabled,
			refetchOnWindowFocus: false,
			retry: false,
			refetchOnMount: false,
		},
	);
};

const createWorkRole = async (req: WorkRoleFormData) => {
	try {
		return await authClient
			.post(`api/v1/workrole/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};


const deleteWorkRole= async (id:IWorkRole) => {
	try {
		return await authClient
			.delete(`api/v1/workrole/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusWorkRole= async (id:IWorkRole) => {
	try {
		return await authClient
			.get(`api/v1/workrole/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useWorkRoles,
	getWorkRole,
	createWorkRole,	
	deleteWorkRole,
	statusWorkRole
};
