export type TSelect = {
	text: string;
	value: number;
};
export type TSelectJob = {
	text: string;
	value: string;
};
export type UserListRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
	isalumni: number;
};
export type IUser = {
	id?: number;
	email: string;
	first_name: string;
	middle_name?: string;
	last_name: string;
	role_id: number;
	department_id: number;
	course_id?: number;
	image: string;
	gender: string;
	batch_start?: string;
	batch_end?: string;
	mobileno?: string;
	department?: { department_name: string };
	role?: { name: string };
	address1?: string;
	city?: number;
	state?: number;
	country?: number;
	is_admin: number;
	is_alumni: number;
	status: string;
	linkedin_url: string;
	facebook_url: string;
	twitter_url: string;
	instagram_url: string;
	youtube_url: string;
	about_me: string;
	created_on: Date;
	updated_on: Date;
	company_name: string;
	position: string;
	createdAt: Date;
	updatedAt: Date;
	professional_headline: string;
};
export type UserListResponse = {
	total_records: number;
	data: IUser[];
};
export type UserDetailsResponse = {
	message: string;
	data: IUser;
};

export type FormDataType = {
	id?: number;
	first_name: string;
	middle_name?: string;
	last_name: string;
	email: string;
	role_id: number;
	department_id: number;
	course_id?: number;
	batch_start: number;
	batch_end: number;
	is_alumni: number;
	gender: string;
	address1?: string;
	city: number;
	state: number;
	country: number;
	country_mobileno_code: number;
	mobileno: string;
	status: string;
	password: string;
	confirm_password: string;
	image?: string;
	linkedin_url?: string;
	facebook_url?: string;
	twitter_url?: string;
	instagram_url?: string;
	youtube_url?: string;
	about_me: string;
};
export type BasicProfile = {
	id?: number;
	first_name: string;
	middle_name?: string;
	last_name: string;
	salutation: string;
	nickname: string;
	gender: string;
	dob: Date;
	relationship_status: string;
	about_me?: string;
};

export type LocationProfile = {
	id?: number;
	email?: string;
	address1: string;
	city: string;
	state: number;
	country: number;
	address2?: string;
	city2?: Date;
	state2?: number;
	country2?: number;
	country_mobileno_code: number;
	mobileno: string;
	country_workno_code?: number;
	work_phone_no?: string;
	email_alternate?: string;
	linkedin_url?: string;
	facebook_url?: string;
	twitter_url?: string;
	instagram_url?: string;
	youtube_url?: string;
};

export type AdditionalEducation = {
	id?: number;
	user_id: number;
	university: string;
	degree?: string;
	course_id?: number;
	department_id?: number;
	specialization?: string;
	start_year: number;
	end_year: number;
	location?: string;
	is_additional: number;
};

export type ProfilePicDataType = {
	id?: number;
	image?: string;
};

export type ProHeadlineDataType = {
	id?: number;
	professional_headline?: string;
};

export type SocialDataType = {
	id?: number;
	linkedin_url?: string;
	facebook_url?: string;
	twitter_url?: string;
	instagram_url?: string;
	youtube_url?: string;
};

export type AlumniMessageDataType = {
	id?: number;
	subject: string;
	message_desc: string;
	sender_id: number;
	receiver_id: number;
	status: string;
	created_on: Date;
	updated_on: Date;
};

export type TUserCourseFormData = {
	id?: number;
	user_id: number;
	coursedata: Array<number>;
};

export type TUserCompanyFormData = {
	id?: number;
	user_id: number;
	company_name: string;
	position: string;
	company_start_period: number;
	company_end_period: number;
	total_experience: number;
	industry_id: Array<number>;
	skill_id: Array<number>;
};

export type TRoleFormData = {
	id?: number;
	name: string;
	status: string;
	menu: Array<number>;
};
export type IRole = {
	id?: number;
	name: string;
	menu: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
};
export type RolesResponse = {
	total_records: number;
	data: IRole[];
};
export type RoleRequest = {
	enabled: boolean;
	id: number;
};
export type RoleResponse = {
	message: string;
	data: IUser;
};
export type RolesRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type IRolePermission = {
	module_id: number;
};

export type RolePermissionRequest = {
	enabled: boolean;
	role_id: number;
};

export type RolePermissionResponse = {
	data: IRolePermission[];
};

export type TDepartmentFormData = {
	id?: number;
	department_name: string;
	status: string;
};
export type IDepartment = {
	id?: number;
	department_name: string;
	status: string;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
};
export type DepartmentsResponse = {
	total_records: number;
	data: IDepartment[];
};
export type DepartmentRequest = {
	enabled: boolean;
	id: number;
};
export type DepartmentResponse = {
	message: string;
	data: IUser;
};
export type DepartmentsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TCountryFormData = {
	id?: number;
	country_name: string;
	status: string;
};
export type ICountry = {
	id?: number;
	country_name: string;
	country_short_code?: string;
	country_phone_code: number;
	status: string;
	created_on: Date;
	updated_on: Date;
};
export type CountrysResponse = {
	total_records: number;
	data: ICountry[];
};
export type CountryRequest = {
	enabled: boolean;
	id: number;
};
export type CountryResponse = {
	message: string;
	data: IUser;
};
export type CountrysRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TStateFormData = {
	id?: number;
	country_id: number;
	state_name: string;
	status: string;
};
export type IState = {
	id?: number;
	country_id: number;
	state_name: string;
	status: string;
	created_on: Date;
	updated_on: Date;
};
export type StatesResponse = {
	total_records: number;
	data: IState[];
};
export type StateRequest = {
	enabled: boolean;
	id: number;
};
export type StateResponse = {
	message: string;
	data: IUser;
};
export type StatesRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type ISubmenu = {
	id?: number;
	moduleshortname: string;
	module_alias: string;
	moduledescription: string;
	mainmodule_id: number;
	action: string;
	page_url: string;
	icon: string;
	menu: number;
	ordering: number;
};

export type SubmenusResponse = {
	total_records: number;
	data: ISubmenu[];
};
export type SubmenuRequest = {
	enabled: boolean;
	id: number;
};
export type SubmenuResponse = {
	message: string;
	data: ISubmenu;
};
export type SubmenusRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
};

export type SubmenuactionResponse = {
	data: ISubmenu[];
};
export type SubmenuactionRequest = {
	enabled: boolean;
	modulealias: string;
};

export type TEventFormData = {
	id?: number;
	event_title: string;
	event_date: Date;
	event_type: string;
	event_category: string;
	location: string;
	description: string;
	event_image: string;
	user_id: number;
};
export type IEvent = {
	id?: number;
	event_title: string;
	event_date: Date;
	event_type: string;
	event_category: string;
	location: string;
	description: string;
	event_image: string;
	user_id: number;
	created_on: Date;
	updated_on: Date;
};
export type EventsResponse = {
	total_records: number;
	data: IEvent[];
};
export type EventRequest = {
	enabled: boolean;
	id: number;
};
export type EventResponse = {
	message: string;
	data: IUser;
};
export type EventsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	filter_category: Array<string>;
	filter_date: string;
	page_number: number;
	page_size: number;
};

export type TNewsFormData = {
	id?: number;
	title: string;
	posted_date: Date;
	description: string;
	news_url: string;
	user_id: number;
	status: string;
};

export type INews = {
	id?: number;
	title: string;
	posted_date: string;
	description: string;
	news_url: string;
	status: string;
	user_id: number;
	created_on: Date;
	updated_on: Date;
};
export type NewssResponse = {
	total_records: number;
	data: INews[];
	total_data: INews[];
};
export type NewsRequest = {
	enabled: boolean;
	id: number;
};
export type NewsResponse = {
	message: string;
	data: INews;
};
export type NewssRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TJobFormData = {
	id?: number;
	job_title: string;
	company: string;
	location: string;
	contact_email: string;
	company_website: string;
	salary_package: string;
	experience_from: number;
	experience_to: number;
	area_name: Array<string>;
	skill_name: Array<string>;
	job_type: string;
	posted_date: string;
	deadline_date: Date;
	job_description: string;
	status: string;
	user_id: number;
};
export type IJob = {
	id?: number;
	job_title: string;
	company: string;
	location: string;
	job_type: string;
	posted_date: string;
	deadline_date: Date;
	job_description: string;
	area_name: Array<string>;
	skill_name: Array<string>;
	status: string;
	user_id: number;
	created_on: Date;
	updated_on: Date;
};
export type JobsResponse = {
	total_records: number;
	data: IJob[];
	total_data: IJob[];
};
export type JobRequest = {
	enabled: boolean;
	id: number;
};
export type JobResponse = {
	message: string;
	data: IJob;
};
export type JobsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TIndustryFormData = {
	id?: number;
	industry_name: string;
	status: string;
};
export type IIndustry = {
	id?: number;
	industry_name: string;
	status: string;
	created_on: Date;
	updated_on: Date;
};
export type IndustrysResponse = {
	total_records: number;
	data: IIndustry[];
};
export type IndustryRequest = {
	enabled: boolean;
	id: number;
};
export type IndustryResponse = {
	message: string;
	data: IUser;
};
export type IndustrysRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type WorkRoleFormData = {
	id?: number;
	workrole_name: string;
};
export type IWorkRole = {
	id?: number;
	workrole_name: string;
	status: string;
	created_on: Date;
	updated_on: Date;
};
export type WorkRolesResponse = {
	total_records: number;
	data: IWorkRole[];
};
export type WorkRoleRequest = {
	enabled: boolean;
	id: number;
};
export type WorkRoleResponse = {
	message: string;
	data: IWorkRole;
};
export type WorkRolesRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TProfessionalskillFormData = {
	id?: number;
	skill_name: string;
	status: string;
};
export type IProfessionalskill = {
	id?: number;
	skill_name: string;
	status: string;
	created_on: Date;
	updated_on: Date;
};
export type ProfessionalskillsResponse = {
	total_records: number;
	data: IProfessionalskill[];
};
export type ProfessionalskillRequest = {
	enabled: boolean;
	id: number;
};
export type ProfessionalskillResponse = {
	message: string;
	data: IUser;
};
export type ProfessionalskillsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TProfessionalareaFormData = {
	id?: number;
	area_name: string;
	status: string;
};
export type IProfessionalarea = {
	id?: number;
	area_name: string;
	status: string;
	created_on: Date;
	updated_on: Date;
};
export type ProfessionalareasResponse = {
	total_records: number;
	data: IProfessionalarea[];
};
export type ProfessionalareaRequest = {
	enabled: boolean;
	id: number;
};
export type ProfessionalareaResponse = {
	message: string;
	data: IProfessionalarea;
};
export type ProfessionalareasRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TCourseFormData = {
	id?: number;
	course_name: string;
	status: string;
};
export type ICourse = {
	id?: number;
	course_name: string;
	status: string;
	created_on: Date;
	updated_on: Date;
};
export type CoursesResponse = {
	total_records: number;
	data: ICourse[];
};
export type CourseRequest = {
	enabled: boolean;
	id: number;
};
export type CourseResponse = {
	message: string;
	data: IUser;
};
export type CoursesRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type IEducation = {
	id?: number;
	user_id: number;
	university: string;
	degree: string;
	course_id: number;
	department_id: number;
	department?: { department_name: string };
	course?: { course_name: string };
	specialization: string;
	start_year: number;
	end_year: number;
	location: string;
	is_additional: number;
};

export type EducationsResponse = {
	total_records: number;
	data: IEducation[];
};
export type EducationRequest = {
	enabled: boolean;
	id: number;
};
export type EducationResponse = {
	message: string;
	data: IEducation;
};
export type EducationsRequest = {
	enabled: boolean;
	filter_user: number;
};

export type TCompanyFormData = {
	id?: number;
	user_id?: number;
	company_name: string;
	position?: string;
	company_start_period?: number;
	company_end_period?: number;
	company_location?: string;
};
export type ICompany = {
	id?: number;
	user_id?: number;
	company_name: string;
	position?: string;
	company_start_period?: number;
	company_end_period?: number;
	company_location?: string;
	created_on: Date;
	updated_on: Date;
};
export type CompaniesResponse = {
	total_records: number;
	data: ICompany[];
};
export type CompanyRequest = {
	enabled: boolean;
	id: number;
};
export type CompanyResponse = {
	message: string;
	data: ICompany;
};
export type CompaniesRequest = {
	enabled: boolean;
	filter_user: number;
};

export type ExperienceFormData = {
	id?: number;
	user_id?: number;
	total_experience: number;
	workrole_id?: number[] | any;
	industry_id?: number[] | any;
	skill_id?: number[] | any;
};

export type IExperience = {
	id?: number;
	user_id?: number;
	total_experience: number;
	workrole_id?: number[] | any;
	industry_id?: number[] | any;
	skill_id?: number[] | any;
	skill_name: string;
	industry_name: string;
	workrole_name: string;
};

export type ExperienceRequest = {
	enabled: boolean;
	id: number;
};

export type ExperienceResponse = {
	message: string;
	data: IExperience;
};

export type TResumeFormData = {
	id?: number;
	user_id?: number;
	resume_title: string;
	attachment_type: string;
	attachment_file: string;
	show_on_profile: string;
};

export type ResumeAttachmentsResponse = {
	total_records: number;
	data: TResumeFormData[];
};
export type ResumeAttachmentRequest = {
	enabled: boolean;
	id: number;
};
export type ResumeAttachmentResponse = {
	message: string;
	data: TResumeFormData;
};
export type ResumeAttachmentsRequest = {
	enabled: boolean;
	filter_user: number;
};

export type TDeleteAccountFormData = {
	id?: number;
	user_id?: number;
	mobile_no: string;
	delete_message: string;
};

export type UploadImageType = {
	data: FormData;
};

export type UserDetailsRequest = {
	enabled: boolean;
	id: number;
};
/* Start Common Type */
export type FiltersPaginationType = {
	page_number: number;
	page_size: number;
};
export type FilterTextType = {
	filters: FiltersType;
	setFilters: (fl: FiltersType) => void;
};
export type NumberBooleanType = {
	[key: number]: boolean;
};
/* End Common Type */

export type SidebarValidateType = {
	[key: string]: boolean;
};

export type Menu = {
	id: number;
	path: string;
	forRole: boolean;
	title: string;
	name: string;
	component: string;
	is_visible: boolean;
	can_access: Array<string>;
	exclude_validation: Array<number>;
	icon: string;
	is_locked: boolean;
	icon_exp?: string;
};

export type MenuTooltipType = {
	pre_waba: string;
	post_waba: string;
	other: string;
};
export type FilesExtType = {
	[key: string]: Array<string>;
};
export type AllowedFilesType = {
	[key: string]: Array<string>;
};
export type CtwCampaignType = {
	id?: string;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string;
	customer_id?: string;
	node_id?: string;
	flow_id?: string;
	label?: string;
	ad_url?: number;
	entities?: Record<string, unknown>[];
	flow?: any;
};
export type AdResponseType = {
	total_records: number;
	data: CtwCampaignType[];
};
export type CampaignListRequestType = {
	enabled: boolean;
	customer_id?: string;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};
export type FilesSizeType = {
	[key: string]: number;
};
export type FileInvalidType = {
	[key: string]: string;
};
export type ConfirmPopupDataType = {
	title: string;
	description?: string;
	text: string;
	contirm_button_text?: string;
};
export type MessagePopupDataType = {
	title: string;
	description?: string;
	contirm_button_text?: string;
};
/* End Common Type */

export type CustomerProfileType = {
	enabled: boolean;
	customer_id?: string;
};
export type CustomerStatusType = {
	enabled: boolean;
	customer_id?: string;
};
export type CustomerProfileRequestType = {
	enabled: boolean;
	customer_id?: string;
	data: object;
};

export type CreateCampaignRequestType = {
	enabled: boolean;
	customer_id?: string;
	event_id?: string;
	data: object;
};
export type TableHeadType = { id: number; name: string; style?: string }[];
export type StatusButtonsType = { id: number; name: string; type: string }[];
export type FailedMessagesType = {
	enabled: boolean;
	customer_id?: string;
	broadcast_id?: string;
	campaign_id?: string;
	start_date?: string;
	end_date?: string;
};

export type FiltersType = {
	text: string;
	status: string;
};

export type LanguagesType = {
	id?: string;
	english_text?: string;
	code?: string;
	native_text: string;
	whatsapp_template_language_code: string;
};

export type TemplateItemType = {
	id?: number;
	name?: string;
	category?: string;
	status?: string;
	language: string;
	selectedLang?: LanguagesType;
};
export type TemplateStatusType = {
	SUBMITTED?: string;
	DRAFT?: string;
};

export type CustomerType = {
	company: string;
	enforce_totp: boolean;
	id: string;
	created: Date;
	experimental_features: string;
	users: IUser[];
};

export type InviteMemberRequestType = {
	customer_id?: string;
	data: InviteMemberDataType;
};
export type InviteMemberDataType = {
	email: string;
	role: string;
	customer_id?: string;
};
export type UpdateRoleRequestType = {
	id: string;
	role: string;
	customer_id?: string;
};
export type MemberListRequestType = {
	enabled: boolean;
	role?: string;
	search_phrase?: string;
	page_number?: number;
	page_size?: number;
	customer_id?: string;
};
export type MemberType = {
	users: MemberIUser[];
	total_records: number;
};
export type MemberIUser = {
	email: string;
	first_name: string;
	last_name: string;
	verified: boolean;
	created: string;
	id: string;
	last_signed_in: string;
	totp_enabled: boolean;
	role: string;
	checked?: boolean;
};
export enum WabaStatus {
	NotActivated,
	Pending,
	Failed,
	Activated,
}

export type EmojiType = {
	emoticons: string[];
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string;
	unified: string;
};

export type FunnelData = {
	count: number;
	label: string;
	originalCount?: number;
};
export type DoughhnutData = {
	labels: string[];
	datasets: [
		{
			label: string;
			data: string[];
			backgroundColor: string[];
			borderWidth: number;
		},
	];
};

export type IsExperimentalEnabledType = {
	feature: string;
	name: string;
	item: Menu;
};

export type NodeSelectionCountType = {
	count: number;
	id: string;
};
export type InviteAgentDataType = {
	email: string;
};
export type ChatwootStatusType = {
	chatwoot_account_api_key: string;
	chatwoot_account_id: number;
	chatwoot_admin_user_id: number;
	chatwoot_inbox_id: number;
	chatwoot_status: number;
};

export type InStatusType = {
	page: {
		name: string;
		url: string;
		status: string;
	};
};

export type downtimeStatusType = {
	is_platform_up: boolean;
	banner_message: string;
};

export type DowntimeType = {
	status: boolean;
	severity: string;
	img_url: string;
	title: string;
	description: string;
};
