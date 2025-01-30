import {
	EducationRequest,
	EducationResponse,
	EducationsRequest,
	EducationsResponse,
	AdditionalEducation,
	IEducation,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getEducationDetail = ({
	enabled,
	id,
}: EducationRequest) => {
	return useQuery<EducationResponse, HTTPError>(
		["education"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/education/` + id,
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

const deleteEducation= async (id:IEducation) => {
	try {
		return await authClient
			.delete(`api/v1/education/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const useEducations = ({
	enabled,
	filter_user,
}: EducationsRequest) => {
	return useQuery<EducationsResponse, HTTPError>(
		["educationList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/education
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

const AdditionalEducationAdd = async (req: AdditionalEducation) => {
	try {
		return await apiClient
		.post(`api/v1/education/add`, { json: req })
		.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export {
	getEducationDetail,
	deleteEducation,
	AdditionalEducationAdd,
	useEducations
};
