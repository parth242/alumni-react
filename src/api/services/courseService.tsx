import {
	CourseRequest,
	CourseResponse,
	CoursesRequest,
	CoursesResponse,
	TCourseFormData,
	TUserCourseFormData,
	ICourse
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import { HTTPError } from "ky";
import { useQuery } from "react-query";

const getCourse = ({
	enabled,
	id,
}: CourseRequest) => {
	return useQuery<CourseResponse, HTTPError>(
		["course"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/course/` + id,
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


const useCourses = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
}: CoursesRequest) => {
	return useQuery<CoursesResponse, HTTPError>(
		["courseList"],
		async () => {
			try {
				return await authClient
					.get(
						`api/v1/course/
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

const createCourse = async (req: TCourseFormData) => {
	try {
		return await authClient
			.post(`api/v1/course/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteCourse= async (id:ICourse) => {
	try {
		return await authClient
			.delete(`api/v1/course/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const statusCourse= async (id:ICourse) => {
	try {
		return await authClient
			.get(`api/v1/course/status/`+id)
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
	
};

const createUserCourse = async (req: TUserCourseFormData) => {
	try {
		
		return await authClient
			.post(`api/v1/course/createusercourse`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

export {
	useCourses,
	getCourse,
	createCourse,
	createUserCourse,
	statusCourse,
	deleteCourse
};
