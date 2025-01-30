import {
	ResumeAttachmentRequest,
	ResumeAttachmentResponse,
	ResumeAttachmentsRequest,
	ResumeAttachmentsResponse,
	TResumeFormData
	
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getResumeAttachment = ({
	enabled,
	id,
}: ResumeAttachmentRequest) => {
	return useQuery<ResumeAttachmentResponse, HTTPError>(
		["industry"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/resume/` + id,
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


const useResumeAttachments = ({
	enabled,
	filter_user,	
}: ResumeAttachmentsRequest) => {
	return useQuery<ResumeAttachmentsResponse, HTTPError>(
		["resumeList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/resume/
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

const saveResumeAttachment = async (req: TResumeFormData) => {
	try {
		return await authClient
			.post(`api/v1/resume/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteResumeAttachment= async (id:TResumeFormData) => {
	try {
		return await authClient
			.delete(`api/v1/resume/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	getResumeAttachment,
	useResumeAttachments,
	saveResumeAttachment,
	deleteResumeAttachment
};
