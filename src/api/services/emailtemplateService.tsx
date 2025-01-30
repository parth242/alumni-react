import {
	EmailTemplateRequest,
	EmailTemplateResponse,
	EmailTemplatesRequest,
	EmailTemplatesResponse,
	TEmailTemplateFormData,
	IEmailTemplate,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getEmailTemplate = ({
	enabled,	
}: EmailTemplateRequest) => {
	return useQuery<EmailTemplateResponse, HTTPError>(
		["emailtemplate"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/emailtemplate`,
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


const createEmailTemplate = async (req: TEmailTemplateFormData) => {
	try {
		return await authClient
			.post(`api/v1/emailtemplate/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};



export {
	getEmailTemplate,
	createEmailTemplate,	
};
