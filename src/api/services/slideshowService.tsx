import {
	SlideshowRequest,
	SlideshowResponse,
	SlideshowsRequest,
	SlideshowsResponse,
	TSlideshowFormData,
	ISlideshow,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getSlideshow = ({
	enabled,
	id,
}: SlideshowRequest) => {
	return useQuery<SlideshowResponse, HTTPError>(
		["slideshow"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/slideshow/` + id,
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

const useSlideshows = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: SlideshowsRequest) => {
	return useQuery<SlideshowsResponse, HTTPError>(
		["slideshowList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/slideshow/
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

const createSlideshow = async (req: TSlideshowFormData) => {
	try {
		return await authClient
			.post(`api/v1/slideshow/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteSlideshow= async (id:ISlideshow) => {
	try {
		return await authClient
			.delete(`api/v1/slideshow/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusSlideshow= async (id:ISlideshow) => {
	try {
		return await authClient
			.get(`api/v1/slideshow/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useSlideshows,
	getSlideshow,
	createSlideshow,
	deleteSlideshow,
	statusSlideshow
};
