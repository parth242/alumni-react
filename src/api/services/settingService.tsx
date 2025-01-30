import {
	SettingRequest,
	SettingResponse,
	SettingsRequest,
	SettingsResponse,
	TSettingFormData,
	ISetting,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getSetting = ({
	enabled,	
}: SettingRequest) => {
	return useQuery<SettingResponse, HTTPError>(
		["setting"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/setting`,
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


const createSetting = async (req: TSettingFormData) => {
	try {
		return await authClient
			.post(`api/v1/setting/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};



export {
	getSetting,
	createSetting,	
};
