import { IService, ServicesRequest, ServicesResponse } from "utils/datatypes"; // Import the ServicesResponse type
import { apiClient, authClient } from "../client"; // Import your API client
import { HTTPError } from "ky";
import { useQuery } from "react-query";

// Define the function to fetch services data
const getServices = ({ enabled }: ServicesRequest) => {
	return useQuery<ServicesResponse, HTTPError>(
		["servicesData"],
		async () => {
			try {
				return await apiClient.get(`api/v1/services`).json();
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

/* const createService = async (req: IService) => {
	console.log("Hiiiiii");
	try {
		return await authClient
			.post(`api/v1/services/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
}; */

export { getServices /* createService */ };
