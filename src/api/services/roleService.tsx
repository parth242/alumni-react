import {
	IRole,
	RoleRequest,
	RoleResponse,
	RolesRequest,
	RolesResponse,
	TRoleFormData,
	RolePermissionRequest,
	RolePermissionResponse,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getRole = ({
	enabled,
	id,
}: RoleRequest) => {
	return useQuery<RoleResponse, HTTPError>(
		["role"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/role/` + id,
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

const useRoles = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: RolesRequest) => {
	return useQuery<RolesResponse, HTTPError>(
		["roleList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/role/
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

const useRolePermission = ({
	enabled,
	role_id,	
}: RolePermissionRequest) => {
	return useQuery<RolePermissionResponse, HTTPError>(
		["roleList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/role/role_id=${role_id}`,
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

const createRole = async (req: TRoleFormData) => {
	try {		
		return await authClient
			.post(`api/v1/role/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteRole = async (id:IRole) => {
	try {
		return await authClient
			.delete(`api/v1/role/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};


const statusRole= async (id:IRole) => {
	try {
		return await authClient
			.get(`api/v1/role/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useRoles,
	getRole,
	createRole,
	deleteRole,
	useRolePermission,
	statusRole,
};
