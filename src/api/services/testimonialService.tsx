import {
	TestimonialRequest,
	TestimonialResponse,
	TestimonialsRequest,
	TestimonialsResponse,
	TTestimonialFormData,
	ITestimonial,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getTestimonial = ({
	enabled,
	id,
}: TestimonialRequest) => {
	return useQuery<TestimonialResponse, HTTPError>(
		["testimonial"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/testimonial/` + id,
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

const useTestimonials = ({
	enabled,
	filter_status,
	page_number,
	page_size,	
}: TestimonialsRequest) => {
	return useQuery<TestimonialsResponse, HTTPError>(
		["testimonialList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/testimonial/
						?` +
						(filter_status != ""
							? "&filter_status=" + filter_status
							: "") +						
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

const createTestimonial = async (req: TTestimonialFormData) => {
	try {
		return await authClient
			.post(`api/v1/testimonial/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteTestimonial= async (id:ITestimonial) => {
	try {
		return await authClient
			.delete(`api/v1/testimonial/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusTestimonial= async (id:ITestimonial) => {
	try {
		return await authClient
			.get(`api/v1/testimonial/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

export {
	useTestimonials,
	getTestimonial,
	createTestimonial,
	deleteTestimonial,
	statusTestimonial
};
