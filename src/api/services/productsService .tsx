import { IProduct, ProductsRequest, ProductsResponse } from "utils/datatypes"; // Import the ServicesResponse type
import { apiClient, authClient } from "../client"; // Import your API client
import { HTTPError } from "ky";
import { useQuery } from "react-query";

// Define the function to fetch services data
const getProducts = ({ enabled }: ProductsRequest) => {
	return useQuery<ProductsResponse, HTTPError>(
		["productsData"],
		async () => {
			try {
				return await apiClient.get(`api/v1/products`).json();
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

const createProducts = async (req: IProduct) => {
	console.log("Hiiiiii");
	try {
		return await authClient
			.post(`api/v1/products/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export { getProducts, createProducts };
