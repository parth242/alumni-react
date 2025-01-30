import {
	IFeed,
	FeedRequest,
	FeedResponse,
	FeedsRequest,
	FeedsResponse,
	TFeedFormData,	
	TCommentFormData,
	CommentsRequest,
	CommentsResponse,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getFeed = ({
	enabled,
	id,
}: FeedRequest) => {
	return useQuery<FeedResponse, HTTPError>(
		["feed"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/feed/` + id,
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

const useFeeds = ({
	enabled,
	filter_status,	
	page_number,
	page_size,
	filter_name,
	group_id,
	user_id,
}: FeedsRequest) => {
	return useQuery<FeedsResponse, HTTPError>(
		["feedList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/feed/
						?` +
						(filter_status != ""
							? "&filter_status=" + filter_status
							: "") +							
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

const createFeed = async (req: TFeedFormData) => {
	try {		
		return await authClient
			.post(`api/v1/feed/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteFeed = async (id:IFeed) => {
	try {
		return await authClient
			.delete(`api/v1/feed/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};



const createComment = async (req: TCommentFormData) => {
	try {		
		return await authClient
			.post(`api/v1/feed/createcomment`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const useFeedComments = ({
	enabled,
	filter_status,	
	page_number,
	page_size,
	filter_name,
	feed_id,
}: CommentsRequest) => {
	return useQuery<CommentsResponse, HTTPError>(
		["commentList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/feed/feedcomments
						?` +
						(filter_status != ""
							? "&filter_status=" + filter_status
							: "") +							
						(filter_name ? "&filter_name=" + filter_name : "") +
						`&feed_id=${feed_id}&page_number=${page_number}
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

const statusFeed = async (req: any) => {
	try {
		return await authClient.post(`api/v1/feed/status/`, { json: req }).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export {
	useFeeds,
	getFeed,
	createFeed,
	deleteFeed,	
	createComment,
	useFeedComments,
	statusFeed,
};
