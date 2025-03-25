import {
	IGallery,
	GalleryRequest,
	GalleryResponse,
	GallerysRequest,
	GallerysResponse,
	TGalleryFormData,	
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getGallery = ({
	enabled,
	id,
}: GalleryRequest) => {
	return useQuery<GalleryResponse, HTTPError>(
		["gallery"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/gallery/` + id,
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

const useGallerys = ({
	enabled,	
	page_number,
	page_size,	
}: GallerysRequest) => {
	return useQuery<GallerysResponse, HTTPError>(
		["galleryList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/gallery/
						?` +
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

const createGallery = async (req: TGalleryFormData) => {
	try {		
		return await authClient
			.post(`api/v1/gallery/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteGallery = async (id:IGallery) => {
	try {
		return await authClient
			.delete(`api/v1/gallery/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useGallerys,
	getGallery,
	createGallery,
	deleteGallery,	
};
