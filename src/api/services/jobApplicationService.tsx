import { TJobApplicationFormData, JobApplicationsRequest, JobApplicationsResponse } from "utils/datatypes";

import { authClient, apiClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const createJobApplication = async (req: TJobApplicationFormData) => {
	try {
		return await authClient
			.post(`api/v1/jobapplication/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const useJobApplications = ({
	enabled,
	filter_status,
	filter_name,	
	page_number,
	page_size,	
}: JobApplicationsRequest) => {
	return useQuery<JobApplicationsResponse, HTTPError>(
		["jobApplicationList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/jobapplication/
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

const updateApplicationStatus = async (req: any) => {
	try {
		return await apiClient
			.post(`api/v1/jobapplication/updatestatus`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export { 
	createJobApplication,
	useJobApplications,
	updateApplicationStatus
};
