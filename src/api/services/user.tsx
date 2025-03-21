import {
	ProfilePicDataType,
	SocialDataType,
	FormDataType,
	IUser,
	UploadImageType,
	UserDetailsRequest,
	UserDetailsResponse,
	UserListRequest,
	UserListResponse,
	AlumniMessageDataType,
	BasicProfile,
	LocationProfile,
	ProHeadlineDataType,
	TDeleteAccountFormData,
	UserGroupListRequest,
	UserEventListRequest,
	UserEventListResponse,
} from "utils/datatypes";

import { apiClient, authClient } from "../client";
import {
	ChangePasswordType,
	LoginType,
	RegisterInvitationType,
	RegisterType,
	ResetPasswordType,
	shopifyLoggerType,
	TMailFormData,
} from "utils/types/user-types";
import { HTTPError } from "ky";
import toast, { ToastPosition } from "react-hot-toast";
import Icon from "utils/icon";
import { useQuery } from "react-query";

const pageName: string[] = location?.pathname.split("/");

const SuccessToastMessage = ({
	title,
	id,
	position,
	description,
}: {
	title: string;
	id?: string;
	position?: ToastPosition;
	description?: string;
}) => {
	toast.success(
		t => (
			<div className={`${t.visible ? "animate-enter" : "animate-leave"}`}>
				<div className="grid auto-cols-max grid-cols-12">
					<span className="col-span-11">{title}</span>
					<span
						className="col-span-1 ml-2 cursor-pointer text-gray-500"
						onClick={() => toast.remove()}>
						<Icon
							icon="x-mark"
							className="h-4 w-4"
							aria-hidden="true"></Icon>
					</span>
				</div>
				{description && (
					<div className="grid auto-cols-max grid-cols-12">
						<span className="col-span-11 text-gray-500">
							{description}
						</span>
					</div>
				)}
			</div>
		),
		{
			id: id || "common",
			position: position || "top-right",
			className: "dark:bg-dark3 dark:text-darkPrimary",
		},
	);
};
const ErrorToastMessage = async ({
	error,
	id,
	position,
}: {
	error: HTTPError;
	id?: string;
	position?: ToastPosition;
}) => {
	const error1 = await error.response.text();
	console.log("error1", error1);
	const TxId = error.response.headers.get("transaction-id");
	let copied = false;
	toast.error(
		t => (
			<div className={`${t.visible ? "animate-enter" : "animate-leave"}`}>
				<div className="grid auto-cols-max grid-cols-12">
					<span className="col-span-11">
						{`Error: ` + JSON.parse(error1).message}
					</span>
					<span
						className="col-span-1 ml-2 cursor-pointer text-gray-500"
						onClick={() => toast.remove()}>
						<Icon
							icon="x-mark"
							className="h-4 w-4"
							aria-hidden="true"></Icon>
					</span>
				</div>
				{TxId && import.meta.env.VITE_DEPLOY_TYPE != "production" && (
					<div
						className="mt-2 cursor-pointer text-primary dark:text-darkPrimary"
						onClick={() => {
							navigator.clipboard.writeText(TxId);
							copied = true;
						}}>
						{copied
							? "Copied Transaction ID"
							: "Copy Transaction ID"}
					</div>
				)}
			</div>
		),
		{
			id: id || "common",
			position: position || "top-right",
			className: "dark:bg-dark3 dark:text-darkPrimary",
		},
	);
};

const authUser = async ({ email, password }: LoginType) => {
	try {		
		return await authClient
			.post(`api/v1/user/login`, { json: { email, password } })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};
const logout = async () => {
	try {
		return await authClient.post(`api/v1/user/logout`, { json: {} }).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const getMyDetails = async () => {
	try {
		const result = await authClient.get(`api/v1/user/me`).json();
		return result;
	} catch (error) {
		return Promise.reject(error);
	}
};
const getUserDetails = ({ enabled, id }: UserDetailsRequest) => {
	return useQuery<UserDetailsResponse, HTTPError>(
		["userDetails"],
		async () => {
			try {
				return await apiClient.get(`api/v1/user/` + id).json();
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

const useUserData = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	filter_name,
	filter_course,
	filter_department,
	filter_endyear,
	isalumni,
}: UserListRequest) => {
	return useQuery<UserListResponse, HTTPError>(
		["userList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/user/isalumni=${isalumni}
						?` +
							(filter_status != ""
								? "&filter_status=" + filter_status
								: "") +
							(filter_name ? "&filter_name=" + filter_name : "") +
							(filter_course
								? "&filter_course=" + filter_course
								: "") +
							(filter_department
								? "&filter_department=" + filter_department
								: "") +
							(filter_endyear
								? "&filter_endyear=" + filter_endyear
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

const useUserGroupData = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	group_id,
}: UserGroupListRequest) => {
	return useQuery<UserListResponse, HTTPError>(
		["usergroupList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/user/group_id=${group_id}
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

const useUserHomeData = ({
	enabled,
	page_number,
	page_size,	
}: UserListRequest) => {
	return useQuery<UserListResponse, HTTPError>(
		["userhomeList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/user/homealumnis
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

const useUserEventData = ({
	enabled,
	filter_status,
	page_number,
	page_size,
	event_id,
}: UserEventListRequest) => {
	return useQuery<UserEventListResponse, HTTPError>(
		["usergroupList"],
		async () => {
			try {
				return await apiClient
					.get(
						`api/v1/user/event_id=${event_id}
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

const registerUser = async (req: FormDataType) => {
	try {
		return await authClient
			.post(`api/v1/user/create`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const useUploadImage = async (data: UploadImageType) => {
	try {
		return await apiClient
			.post(`api/v1/user/upload`, {
				body: data.data,
			})
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const profilepicUser = async (req: ProfilePicDataType) => {
	try {
		return await apiClient
			.post(`api/v1/user/profilepic`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const updateProfessionalHead = async (req: ProHeadlineDataType) => {
	try {
		return await apiClient
			.post(`api/v1/user/proheadline`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const SocialUserUpdate = async (req: SocialDataType) => {
	try {
		return await apiClient
			.post(`api/v1/user/socialuser`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const BasicProfileUpdate = async (req: BasicProfile) => {
	try {
		return await apiClient
			.post(`api/v1/user/basicprofileupdate`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const LocationProfileUpdate = async (req: LocationProfile) => {
	try {
		return await apiClient
			.post(`api/v1/user/locationprofileupdate`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const sendMessageAlumni = async (req: AlumniMessageDataType) => {
	try {
		return await apiClient
			.post(`api/v1/user/alumnisendmessage`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const accountDeleteRequest = async (req: TDeleteAccountFormData) => {
	try {
		return await apiClient
			.post(`api/v1/user/accountdeleterequest`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const deleteUser = async (id: IUser) => {
	try {
		return await authClient.delete(`api/v1/user/` + id).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const useRegisterInvitationUser = (key: string) => {
	return useQuery<{ email: string }, HTTPError>(
		["registerInvitationUser"],
		async () => {
			try {
				return await authClient
					.get(`api/v1/register/invitation/${key}`)
					.json();
			} catch (error) {
				return Promise.reject(error);
			}
		},
		{
			enabled: key ? true : false,
			retry: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		},
	);
};
const registerInvitationUser = async (req: RegisterInvitationType) => {
	try {
		return await authClient
			.post(`api/v1/register/invitation/${req.key}`, { json: req.data })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};
const deleteCustomerUser = async (user_ids: string[]) => {
	try {
		return await authClient
			.delete(`api/v1/customer/admin/`, { json: { user_ids } })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};
const useRegisterVerify = (key: string) => {
	return useQuery<{ email: string }, HTTPError>(
		["forgotDetails"],
		async () => {
			try {
				return await authClient
					.get(`api/v1/register/verify/${key}`)
					.json();
			} catch (error) {
				return Promise.reject(error);
			}
		},
		{
			enabled: key ? true : false,
			retry: false,
		},
	);
};

const forgotPassword = async ({ email }: LoginType) => {
	try {
		return await authClient
			.post(`api/v1/user/forgot_password`, { json: { email } })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const useResetPassword = (key: string) => {
	return useQuery(
		["forgotDetails"],
		async () => {
			try {
				return await authClient
					.get(`api/v1/user/reset_password/${key}`)
					.json();
			} catch (error) {
				return Promise.reject(error);
			}
		},
		{
			enabled: key ? true : false,
			retry: false,
		},
	);
};

const resetPassword = async ({ key, password }: ResetPasswordType) => {
	try {
		return await authClient
			.post(`api/v1/user/reset_password/${key}`, { json: { password } })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};
const changePassword = async (req: ChangePasswordType) => {
	try {
		return await authClient
			.post(`api/v1/user/change-password`, { json: req })
			.json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const logShopifyErrors = async (req: shopifyLoggerType) => {
	try {
		return await authClient.post(`api/v1/logging/`, { json: req }).json();
	} catch (error) {
		return Promise.reject(error);
	}
};

const statusUser = async (req: any) => {
	try {
		return await authClient.post(`api/v1/user/status/`, { json: req }).json();
	} catch (error) {
		return Promise.reject(error);
	}
};



export {
	SuccessToastMessage,
	ErrorToastMessage,
	logout,
	authUser,
	forgotPassword,
	useResetPassword,
	resetPassword,
	getMyDetails,
	registerUser,
	useRegisterInvitationUser,
	registerInvitationUser,
	deleteCustomerUser,
	useRegisterVerify,
	changePassword,
	logShopifyErrors,
	useUserData,
	getUserDetails,
	useUploadImage,
	deleteUser,
	statusUser,
	profilepicUser,
	SocialUserUpdate,
	sendMessageAlumni,
	BasicProfileUpdate,
	LocationProfileUpdate,
	updateProfessionalHead,
	accountDeleteRequest,
	useUserGroupData,	
	useUserEventData,
	useUserHomeData,
};
