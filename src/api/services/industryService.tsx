import {
	IndustryRequest,
	IndustryResponse,
	IndustrysRequest,
	IndustrysResponse,
	TIndustryFormData,
	TUserCompanyFormData,
	IIndustry
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getIndustry = ({
	enabled,
	id,
}: IndustryRequest) => {
	return useQuery<IndustryResponse, HTTPError>(
		["industry"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/industry/` + id,
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


const useIndustrys = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: IndustrysRequest) => {
	return useQuery<IndustrysResponse, HTTPError>(
		["industryList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/industry/
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

const createIndustry = async (req: TIndustryFormData) => {
	try {
		return await authClient
			.post(`api/v1/industry/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const createUserCompany = async (req: TUserCompanyFormData) => {
	try {
		
		return await authClient
			.post(`api/v1/industry/createusercompany`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteIndustry= async (id:IIndustry) => {
	try {
		return await authClient
			.delete(`api/v1/industry/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusIndustry= async (id:IIndustry) => {
	try {
		return await authClient
			.get(`api/v1/industry/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useIndustrys,
	getIndustry,
	createIndustry,
	createUserCompany,
	deleteIndustry,
	statusIndustry
};
