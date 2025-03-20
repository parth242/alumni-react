import {
	INews,
	NewsRequest,
	NewsResponse,
	NewssRequest,
	NewssResponse,
	TNewsFormData,	
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getNews = ({
	enabled,
	id,
}: NewsRequest) => {
	return useQuery<NewsResponse, HTTPError>(
		["news"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/news/` + id,
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

const useNewss = ({
	enabled,
	filter_status,	
	page_number,
	page_size,
	filter_name,
	group_id,
}: NewssRequest) => {
	return useQuery<NewssResponse, HTTPError>(
		["newsList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/news/
						?` +
						(filter_status != ""
							? "&filter_status=" + filter_status
							: "") +							
						(filter_name ? "&filter_name=" + filter_name : "") +
						`&group_id=${group_id}&page_number=${page_number}
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

const createNews = async (req: TNewsFormData) => {
	try {		
		return await authClient
			.post(`api/v1/news/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteNews = async (id:INews) => {
	try {
		return await authClient
			.delete(`api/v1/news/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useNewss,
	getNews,
	createNews,
	deleteNews,	
};
