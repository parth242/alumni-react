import {
	ProfessionalareaRequest,
	ProfessionalareaResponse,
	ProfessionalareasRequest,
	ProfessionalareasResponse,
	TProfessionalareaFormData,
	IProfessionalarea,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getProfessionalarea = ({
	enabled,
	id,
}: ProfessionalareaRequest) => {
	return useQuery<ProfessionalareaResponse, HTTPError>(
		["professionalarea"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/professionalarea/` + id,
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


const useProfessionalareas = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: ProfessionalareasRequest) => {
	return useQuery<ProfessionalareasResponse, HTTPError>(
		["professionalareaList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/professionalarea/
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

const createProfessionalarea = async (req: TProfessionalareaFormData) => {
	try {
		return await authClient
			.post(`api/v1/professionalarea/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteProfessionalarea= async (id:IProfessionalarea) => {
	try {
		return await authClient
			.delete(`api/v1/professionalskill/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusProfessionalarea= async (id:IProfessionalarea) => {
	try {
		return await authClient
			.get(`api/v1/professionalskill/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};


export {
	useProfessionalareas,
	getProfessionalarea,
	createProfessionalarea,
	deleteProfessionalarea,
	statusProfessionalarea
};
