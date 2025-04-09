import {
	SubmenuRequest,
	SubmenuResponse,
	SubmenusRequest,
	SubmenusResponse,
	SubmenuactionRequest,
	SubmenuactionResponse	
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getSubmenu = ({
	enabled,
	id,
}: SubmenuRequest) => {
	return useQuery<SubmenuResponse, HTTPError>(
		["submenu"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/submenu/` + id,
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

const useSubmenus = async () => {
	try {
		const result = await authClient.get(`api/v1/submenu`).json();
		return result;
	} catch (error) {
		return Promise.reject(error);
	}
};

const useHeadermenus = async () => {
	try {
		const result = await authClient.get(`api/v1/submenu/headermenu`).json();
		return result;
	} catch (error) {
		return Promise.reject(error);
	}
};

const useHeaderSubmenus = async (menuId: number) => {
	try {
		const result = await authClient.get(`api/v1/submenu/mainmodule_id=${menuId}`).json();
		return result;
	} catch (error) {
		return Promise.reject(error);
	}
};

const useFootermenus = async () => {
	try {
		const result = await authClient.get(`api/v1/submenu/footermenu`).json();
		return result;
	} catch (error) {
		return Promise.reject(error);
	}
};



const useSubmenusAction = ({
	enabled,
	modulealias,	
}: SubmenuactionRequest) => {
	return useQuery<SubmenuactionResponse, HTTPError>(
		["submenuAction"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/submenu/module_alias=` + modulealias
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


export {
	useSubmenus,
	getSubmenu,
	useSubmenusAction,
	useHeadermenus,
	useHeaderSubmenus,
	useFootermenus
};
