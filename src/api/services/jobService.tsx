import {
	IJob,
	JobRequest,
	JobResponse,
	JobsRequest,
	JobsResponse,
	TJobFormData,
	TMailFormData,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getJob = ({ enabled, id }: JobRequest) => {
	
	return useQuery<JobResponse, HTTPError>(
		["job"],
		async () => {
			try {				
				return await apiClient.get(`api/v1/job/` + id).json();
			} catch (error) {
				return Promise.reject(error);
			}
		},
		{
			enabled: enabled,
			refetchOnWindowFocus: true,
			retry: true,
			refetchOnMount: true,
		},
	);
};

const useJobs = ({
	enabled,
	filter_status,
	filter_name,
	user_id,
	page_number,
	page_size,
	is_internship,
}: JobsRequest) => {
	return useQuery<JobsResponse, HTTPError>(
		["jobList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/job/
						?` +
							(filter_status != ""
								? "&filter_status=" + filter_status
								: "") +
							(filter_name ? "&filter_name=" + filter_name : "") +
							`&is_internship=${is_internship}&user_id=${user_id}
						&page_number=${page_number}
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

const createJob = async (req: TJobFormData) => {
	try {
		return await authClient.post(`api/v1/job/create`, { json: req }).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteJob = async (id: IJob) => {
	try {
		return await authClient.delete(`api/v1/job/` + id).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const sendEmail = async (req: TMailFormData) => {
	try {
		return await authClient
			.post(`api/v1/job/send-email`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const statusJob = async (req: any) => {
	try {
		return await authClient.post(`api/v1/job/status/`, { json: req }).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export { useJobs, getJob, createJob, deleteJob, statusJob, sendEmail };
