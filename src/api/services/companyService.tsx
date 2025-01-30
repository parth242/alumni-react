import {
	CompanyRequest,
	CompanyResponse,
	CompaniesRequest,
	CompaniesResponse,
	TCompanyFormData,
	ICompany,
	ExperienceFormData,
	ExperienceRequest,
	ExperienceResponse
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getWork = ({
	enabled,
	id,
}: CompanyRequest) => {
	return useQuery<CompanyResponse, HTTPError>(
		["company"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/company/` + id,
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

const useWorks = ({
	enabled,
	filter_user,
}: CompaniesRequest) => {
	return useQuery<CompaniesResponse, HTTPError>(
		["workList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/company/
						?` +
						(filter_user ? "&filter_user=" + filter_user : ""),
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

const createWork = async (req: TCompanyFormData) => {
	try {
		return await authClient
			.post(`api/v1/company/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteWork= async (id:ICompany) => {
	try {
		return await authClient
			.delete(`api/v1/company/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const updateExperience = async (req: ExperienceFormData) => {
	try {
		return await authClient
			.post(`api/v1/company/updateexperience`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const getExperience = async (id: number) => {
	try {
		const result = await authClient.get(`api/v1/company/experience/`+id).json();
		return result;
	} catch (error) {
		return Promise.reject(error);
	}
};


export {
	useWorks,
	getWork,
	createWork,
	deleteWork,
	updateExperience,
	getExperience
};
