import {
	InstituteRequest,
	InstituteResponse,
	InstitutesRequest,
	InstitutesResponse,
	TInstituteFormData,	
	IInstitute
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getInstitute = ({
	enabled,
	id,
}: InstituteRequest) => {
	return useQuery<InstituteResponse, HTTPError>(
		["institute"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/institute/` + id,
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

const currentInstitute = () => {
	return useQuery<InstituteResponse, HTTPError>(
		["institute"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/institute/current`,
					)
					.json();
			} catch (error) {
				return Promise.reject(error);
			}
		},
		{
			refetchOnWindowFocus: false,
			retry: false,
			refetchOnMount: false,
		},
	);
};

const useInstitutes = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: InstitutesRequest) => {
	return useQuery<InstitutesResponse, HTTPError>(
		["instituteList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/institute/
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

const createInstitute = async (req: TInstituteFormData) => {
	try {
		return await authClient
			.post(`api/v1/institute/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteInstitute= async (id:IInstitute) => {
	try {
		return await authClient
			.delete(`api/v1/institute/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusInstitute= async (id:IInstitute) => {
	try {
		return await authClient
			.get(`api/v1/institute/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const updateInstituteId= async (id:IInstitute) => {
	try {
		return await authClient
			.get(`api/v1/institute/updateInstituteId/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};



export {
	useInstitutes,
	getInstitute,
	currentInstitute,
	createInstitute,	
	statusInstitute,
	deleteInstitute,
	updateInstituteId
};
