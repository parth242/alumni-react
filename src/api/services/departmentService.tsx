import {
	DepartmentRequest,
	DepartmentResponse,
	DepartmentsRequest,
	DepartmentsResponse,
	TDepartmentFormData,
	IDepartment,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getDepartment = ({
	enabled,
	id,
}: DepartmentRequest) => {
	return useQuery<DepartmentResponse, HTTPError>(
		["department"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/department/` + id,
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

const useDepartments = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: DepartmentsRequest) => {
	return useQuery<DepartmentsResponse, HTTPError>(
		["departmentList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/department/
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

const createDepartment = async (req: TDepartmentFormData) => {
	try {
		return await authClient
			.post(`api/v1/department/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteDepartment= async (id:IDepartment) => {
	try {
		return await authClient
			.delete(`api/v1/department/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusDepartment= async (id:IDepartment) => {
	try {
		return await authClient
			.get(`api/v1/department/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useDepartments,
	getDepartment,
	createDepartment,
	deleteDepartment,
	statusDepartment
};
