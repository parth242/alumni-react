import {
	CountryRequest,
	CountryResponse,
	CountrysRequest,
	CountrysResponse,
	TCountryFormData,
	ICountry,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getCountry = ({
	enabled,
	id,
}: CountryRequest) => {
	return useQuery<CountryResponse, HTTPError>(
		["country"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/country/` + id,
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


const useCountrys = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: CountrysRequest) => {
	return useQuery<CountrysResponse, HTTPError>(
		["countryList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/country/
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

const createCountry = async (req: TCountryFormData) => {
	try {
		return await authClient
			.post(`api/v1/country/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteCountry= async (id:ICountry) => {
	try {
		return await authClient
			.delete(`api/v1/country/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusCountry= async (id:ICountry) => {
	try {
		return await authClient
			.get(`api/v1/country/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useCountrys,
	getCountry,
	createCountry,
	deleteCountry,
	statusCountry
};
