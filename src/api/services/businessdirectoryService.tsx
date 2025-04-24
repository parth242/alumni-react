import {
	IBusinessDirectory,
	BusinessDirectoryRequest,
	BusinessDirectoryResponse,
	BusinessDirectorysRequest,
	BusinessDirectorysResponse,
	TBusinessDirectoryFormData,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getBusinessDirectory = ({ enabled, id }: BusinessDirectoryRequest) => {
	return useQuery<BusinessDirectoryResponse, HTTPError>(
		["businessdirectory"],
		async () => {
			try {
				return await apiClient
					.get(`api/v1/businessdirectory/` + id)
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

const useBusinessDirectorys = ({
	enabled,
	filter_status,
	filter_name,
	page_number,
	page_size,
}: BusinessDirectorysRequest) => {
	return useQuery<BusinessDirectorysResponse, HTTPError>(
		["businessdirectoryList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/businessdirectory/
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

const createBusinessDirectory = async (req: TBusinessDirectoryFormData) => {	
	try {
		return await authClient
			.post(`api/v1/businessdirectory/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

// API call to update services in the business directory
const updateBusinessDirectoryServices = async (req: {
	id: number;
	services: string;
}) => {
	try {
		return await authClient
			.patch("api/v1/businessdirectory/update-services", { json: req }) // Using PATCH method
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

// API call to update services in the business directory
const updateBusinessDirectoryMembers = async (req: {
	id: number;
	members: any;
}) => {
	try {
		return await authClient
			.patch("api/v1/businessdirectory/update-members", { json: req }) // Using PATCH method
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

// API call to update products in the business directory
const updateBusinessDirectoryProducts = async (req: {
	id: number;
	products: string;
}) => {
	try {
		return await authClient
			.patch("api/v1/businessdirectory/update-products", { json: req }) // Using PATCH method
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteBusinessDirectory = async (id: IBusinessDirectory) => {
	try {
		return await authClient.delete(`api/v1/businessdirectory/` + id).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const statusBusinessDirectory = async (req: any) => {
	try {
		return await authClient.post(`api/v1/businessdirectory/status/`, { json: req }).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export {
	useBusinessDirectorys,
	getBusinessDirectory,
	createBusinessDirectory,
	deleteBusinessDirectory,
	updateBusinessDirectoryServices,
	updateBusinessDirectoryProducts,
	updateBusinessDirectoryMembers,
	statusBusinessDirectory,
};
