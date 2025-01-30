import { JobSkillsRequest, JobSkillsResponse } from "utils/datatypes"; // Import the ServicesResponse type
import { apiClient, authClient } from "../client"; // Import your API client
import { HTTPError } from "ky";
import { useQuery } from "react-query";

// Define the function to fetch services data
const getJobSkills = ({ enabled }: JobSkillsRequest) => {
	return useQuery<JobSkillsResponse, HTTPError>(
		["jobSkillsData"],
		async () => {
			try {
				return await apiClient.get(`api/v1/jobskills`).json();
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

export { getJobSkills };
