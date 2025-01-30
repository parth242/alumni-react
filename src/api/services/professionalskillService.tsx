import {
	IProfessionalskill,
	ProfessionalskillRequest,
	ProfessionalskillResponse,
	ProfessionalskillsRequest,
	ProfessionalskillsResponse,
	TProfessionalskillFormData,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getProfessionalskill = ({
	enabled,
	id,
}: ProfessionalskillRequest) => {
	return useQuery<ProfessionalskillResponse, HTTPError>(
		["professionalskill"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/professionalskill/` + id,
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


const useProfessionalskills = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: ProfessionalskillsRequest) => {
	return useQuery<ProfessionalskillsResponse, HTTPError>(
		["professionalskillList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/professionalskill/
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

const deleteProfessionalskill= async (id:IProfessionalskill) => {
	try {
		return await authClient
			.delete(`api/v1/professionalskill/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const createProfessionalskill = async (req: TProfessionalskillFormData) => {
	try {
		return await authClient
			.post(`api/v1/professionalskill/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const statusProfessionalskill= async (id:IProfessionalskill) => {
	try {
		return await authClient
			.get(`api/v1/professionalskill/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useProfessionalskills,
	getProfessionalskill,
	createProfessionalskill,
	deleteProfessionalskill,
	statusProfessionalskill
};
