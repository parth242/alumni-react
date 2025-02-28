import {
	MessageRequest,
	MessageResponse,
	MessagesRequest,
	MessagesResponse,
	MessagesCountRequest,
	MessagesCountResponse,
	IMessage	
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getMessage = ({
	enabled,
	id,
}: MessageRequest) => {
	return useQuery<MessageResponse, HTTPError>(
		["message"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/alumnimessage/` + id,
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

const useAlumniMessages = ({
	enabled,
	filter_status,	
	page_number,
	page_size,
	filter_name,	
	user_id,
}: MessagesRequest) => {
	return useQuery<MessagesResponse, HTTPError>(
		["messageList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/alumnimessage/
						?` +
						(filter_status != ""
							? "&filter_status=" + filter_status
							: "") +							
						(filter_name ? "&filter_name=" + filter_name : "") +
						`&user_id=${user_id}&page_number=${page_number}
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

const useUnreadMessagesCount = ({
	enabled,		
	user_id,
}: MessagesCountRequest) => {
	return useQuery<MessagesCountResponse, HTTPError>(
		["messageCountList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/alumnimessage/unreadcount
						?` +						
						`&user_id=${user_id}`,
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

const deleteMessage= async (id:IMessage) => {
	try {
		return await authClient
			.delete(`api/v1/alumnimessage/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const updateStatus = async (req: any) => {
	try {
		return await authClient
			.post(`api/v1/alumnimessage/updatestatus`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};



export {
	useAlumniMessages,
	getMessage,	
	deleteMessage,
	updateStatus,
	useUnreadMessagesCount	
};
