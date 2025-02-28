import {	
	NotificationsRequest,
	NotificationsResponse,
	TCompanyFormData,
	ICompany,
	ExperienceFormData,	
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";


const useNotifications = ({
	enabled,
	user_id,
}: NotificationsRequest) => {
	return useQuery<NotificationsResponse, HTTPError>(
		["notificationList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/notification/
						?` +
						(user_id ? "&user_id=" + user_id : ""),
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



const deleteNotification= async (id:ICompany) => {
	try {
		return await authClient
			.delete(`api/v1/notification/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const updateNotification = async (req: any) => {
	try {
		return await authClient
			.post(`api/v1/notification/updatenotification`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};



export {
	useNotifications,	
	deleteNotification,
	updateNotification,	
};
