import {
	StateRequest,
	StateResponse,
	StatesRequest,
	StatesResponse,
	TStateFormData,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getState = ({
	enabled,
	id,
}: StateRequest) => {
	return useQuery<StateResponse, HTTPError>(
		["state"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/state/` + id,
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

const useStates = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: StatesRequest) => {
	return useQuery<StatesResponse, HTTPError>(
		["stateList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/state/
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

const createState = async (req: TStateFormData) => {
	try {
		return await authClient
			.post(`api/v1/state/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export {
	useStates,
	getState,
	createState,
};
