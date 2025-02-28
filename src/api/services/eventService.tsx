import {
	IEvent,
	EventRequest,
	EventResponse,
	EventsRequest,
	EventsResponse,
	TEventFormData,	
	TEventJoinUserData,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getEvent = ({
	enabled,
	id,
}: EventRequest) => {
	return useQuery<EventResponse, HTTPError>(
		["event"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/event/` + id,
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

const useEvents = ({
	enabled,
	filter_status,
	filter_category,
	filter_date,
	page_number,
	page_size,
	filter_name,
	group_id,
	user_id,
}: EventsRequest) => {
	return useQuery<EventsResponse, HTTPError>(
		["eventList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/event/
						?` +
						(filter_status != ""
							? "&filter_status=" + filter_status
							: "") +
							(filter_category ? "&filter_category=" + filter_category : "") +
							(filter_date ? "&filter_date=" + filter_date : "") +
						(filter_name ? "&filter_name=" + filter_name : "") +
						`&group_id=${group_id}&user_id=${user_id}&page_number=${page_number}
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

const createEvent = async (req: TEventFormData) => {
	try {		
		return await authClient
			.post(`api/v1/event/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteEvent = async (id:IEvent) => {
	try {
		return await authClient
			.delete(`api/v1/event/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const updateJoinUser = async (req: TEventJoinUserData) => {
	try {
		return await apiClient
			.post(`api/v1/event/updatejoinmaybeUser`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const statusEvent = async (req: any) => {
	try {
		return await authClient.post(`api/v1/event/status/`, { json: req }).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export {
	useEvents,
	getEvent,
	createEvent,
	deleteEvent,	
	statusEvent,
	updateJoinUser,
};
