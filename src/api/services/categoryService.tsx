import {
	CategoryRequest,
	CategoryResponse,
	CategorysRequest,
	CategorysResponse,
	TCategoryFormData,
	ICategory,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getCategory = ({
	enabled,
	id,
}: CategoryRequest) => {
	return useQuery<CategoryResponse, HTTPError>(
		["category"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/category/` + id,
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

const useCategorys = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: CategorysRequest) => {
	return useQuery<CategorysResponse, HTTPError>(
		["categoryList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/category/
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

const createCategory = async (req: TCategoryFormData) => {
	try {
		return await authClient
			.post(`api/v1/category/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteCategory= async (id:ICategory) => {
	try {
		return await authClient
			.delete(`api/v1/category/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusCategory= async (id:ICategory) => {
	try {
		return await authClient
			.get(`api/v1/category/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useCategorys,
	getCategory,
	createCategory,
	deleteCategory,
	statusCategory
};
