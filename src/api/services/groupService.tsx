import {
	IGroup,
	GroupRequest,
	GroupResponse,
	GroupsRequest,
	GroupsResponse,
	TGroupFormData,	
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getGroup = ({
	enabled,
	id,
}: GroupRequest) => {
	return useQuery<GroupResponse, HTTPError>(
		["group"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/group/` + id,
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

const useGroups = ({
	enabled,
	filter_status,
	filter_name,	
	user_id,
	page_number,
	page_size,	
}: GroupsRequest) => {
	return useQuery<GroupsResponse, HTTPError>(
		["groupList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/group/
						?` +
						(filter_status != ""
							? "&filter_status=" + filter_status
							: "") +							
						(filter_name ? "&filter_name=" + filter_name : "") +
						`user_id=${user_id}&page_number=${page_number}
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

const useNewsGroups = ({
	enabled,
	filter_status,
	filter_name,	
	user_id,
	page_number,
	page_size,	
}: GroupsRequest) => {
	return useQuery<GroupsResponse, HTTPError>(
		["groupList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/group/newsgroup/
						?` +
						(filter_status != ""
							? "&filter_status=" + filter_status
							: "") +							
						(filter_name ? "&filter_name=" + filter_name : "") +
						`user_id=${user_id}&page_number=${page_number}
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

const createGroup = async (req: TGroupFormData) => {
	try {		
		return await authClient
			.post(`api/v1/group/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteGroup = async (id:IGroup) => {
	try {
		return await authClient
			.delete(`api/v1/group/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useGroups,
	getGroup,
	createGroup,
	deleteGroup,
	useNewsGroups,	
};
