export type TSelect = {
	text: string;
	value: number;
};
export type TSelectJob = {
	text: string;
	value: string;
};

export type TSelectIndu = {
	label: string;
	value: number;
};

export type UserGroupListRequest = {
	enabled: boolean;
	filter_status: string;
	page_number: number;
	page_size: number;
	group_id: number;
};

export type UserEventListRequest = {
	enabled: boolean;
	filter_status: string;
	page_number: number;
	page_size: number;
	event_id: number;
};

export type UserEventListResponse = {
	joinMembers: IUser[];
	maybeMembers: IUser[];
};

export type UserListRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	filter_course: number;
	filter_department: number;
	filter_endyear: number;
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
	dob: string;
	batch_start?: string;
	batch_end?: string;
	country_mobileno_code?: number;
	mobileno?: string;
	country_workno_code?: number;
	work_phone_no?: string;
	department?: { department_name: string };
	role?: { name: string };
	country?: { country_name: string };
	state?: { state_name: string };
	Country2?: { country_name: string };
	State2?: { state_name: string };
	address1?: string;
	city?: string;
	state_id?: number;
	country_id?: number;
	city2?: string;
	state2_id?: number;
	country2_id?: number;
	email_alternate?: string;
	is_admin: number;
	is_alumni: number;
	status: string;
	linkedin_url: string;
	facebook_url: string;
	twitter_url: string;
	instagram_url: string;
	youtube_url: string;
	relationship_status?: string;
	total_experience?: number;
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
	education: Array<string>;
};

export type FormDataType = {
	id?: number;
	first_name: string;
	middle_name?: string;
	last_name: string;
	email: string;
	dob?: Date;
	role_id: number;
	department_id?: number;
	course_id?: number;
	batch_start?: number;
	batch_end?: number;
	end_year: number;
	specialization?: string;
	is_alumni: number;
	gender: string;
	address1?: string;
	city: number;
	state_id: number;
	country_id: number;
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
	state_id: number;
	country_id: number;
	address2?: string;
	city2?: Date;
	state2_id?: number;
	country2_id?: number;
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
	start_year?: number;
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
	department_shortcode: string;
	course_id: number;
	status: string;
};
export type IDepartment = {
	id?: number;
	department_name: string;
	department_shortcode: string;
	course_id: number;
	course?: { course_shortcode: string; course_name: string };
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
	data: IDepartment;
};
export type DepartmentsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TTestimonialFormData = {
	id?: number;
	user_id: number;
	story_description: string;	
	status: string;
};
export type ITestimonial = {
	id?: number;
	user_id: number;
	story_description: string;	
	user?: { first_name: string; last_name: string; professional_headline: string; image: string };
	status: string;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
};
export type TestimonialsResponse = {
	total_records: number;
	data: ITestimonial[];
};
export type TestimonialRequest = {
	enabled: boolean;
	id: number;
};
export type TestimonialResponse = {
	message: string;
	data: ITestimonial;
};
export type TestimonialsRequest = {
	enabled: boolean;
	filter_status: string;	
	page_number: number;
	page_size: number;
};

export type TCategoryFormData = {
	id?: number;
	category_name: string;
	status: string;
};
export type ICategory = {
	id?: number;
	category_name: string;
	status: string;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
};
export type CategorysResponse = {
	total_records: number;
	data: ICategory[];
};
export type CategoryRequest = {
	enabled: boolean;
	id: number;
};
export type CategoryResponse = {
	message: string;
	data: ICategory;
};
export type CategorysRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TCountryFormData = {
	id?: number;
	country_name: string;
	country_short_code?: string;
	country_phone_code: number;
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
	createdAt: Date;
	updatedAt: Date;
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
	is_support_menu: number;
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
	group_id: string;
	status: string;
};
export type IEvent = {
	id?: number;
	event_title: string;
	event_date: string;
	event_time: string;
	event_type: string;
	event_category: string;
	location: string;
	description: string;
	event_image: string;
	join_members: string;
	maybe_members: string;
	decline_members: string;
	group_id: string;
	user_id: number;
	status: string;
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
	data: IEvent;
};
export type EventsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	filter_category: Array<string>;
	filter_date: string;
	page_number: number;
	page_size: number;
	group_id: number;
	user_id: number;
};

export type TEventJoinUserData = {
	id?: number;
	join_members: Array<number>;
	maybe_members: Array<number>;
	decline_members: Array<number>;
};

export type TSlideshowFormData = {
	id?: number;
	slide_title: string;
	slide_image: string;
	status: string;
};
export type ISlideshow = {
	id?: number;
	slide_title: string;
	slide_image: string;
	status: string;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
};
export type SlideshowsResponse = {
	total_records: number;
	data: ISlideshow[];
};
export type SlideshowRequest = {
	enabled: boolean;
	id: number;
};
export type SlideshowResponse = {
	message: string;
	data: ISlideshow;
};
export type SlideshowsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TSettingFormData = {
	id?: number;
	collage_name: string;
	collage_logo: string;
	address: string;
	city: string;
	state: number;
	country: number;
	contact_name: string;
	contact_mobileno: string;
};
export type ISetting = {
	id?: number;
	collage_name: string;
	collage_logo: string;
	address: string;
	city: string;
	state: number;
	country: number;
	contact_name: string;
	contact_mobileno: string;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
};
export type SettingsResponse = {
	total_records: number;
	data: ISetting[];
};
export type SettingRequest = {
	enabled: boolean;
};
export type SettingResponse = {
	message: string;
	data: ISetting;
};
export type SettingsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TEmailTemplateFormData = {
	id?: number;
	alumni_register_mail_admin: any;
	alumni_register_mail: any;
	alumni_confirm_mail: any;
	alumni_reset_password_mail: any;
	new_event_mail: string;
	new_job_mail: string;
	update_job_status: string;
	refer_job_friend: string;
};
export type IEmailTemplate = {
	id?: number;
	alumni_register_mail_admin: string;
	alumni_register_mail: string;
	alumni_confirm_mail: string;
	alumni_reset_password_mail: string;
	new_event_mail: string;
	new_job_mail: string;
	update_job_status: string;
	refer_job_friend: string;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
};
export type EmailTemplatesResponse = {
	total_records: number;
	data: IEmailTemplate[];
};
export type EmailTemplateRequest = {
	enabled: boolean;
};
export type EmailTemplateResponse = {
	message: string;
	data: IEmailTemplate;
};
export type EmailTemplatesRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TNewsFormData = {
	id?: number;
	title: string;
	posted_date: string;
	description: string;
	news_url: string;
	user_id: number;
	status: string;
	group_id: string;
};

export type INews = {
	id?: number;
	title: string;
	posted_date: string;
	description: string;
	news_url: string;
	status: string;
	user_id: number;
	createdAt: string;
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
	group_id: number;
};

export type TGalleryFormData = {
	id?: number;
	gallery_image: string;	
};

export type IGallery = {
	id?: number;
	gallery_image: string;	
	createdAt: string;
	updated_on: Date;
};
export type GallerysResponse = {
	total_records: number;
	data: IGallery[];
	total_data: IGallery[];
};
export type GalleryRequest = {
	enabled: boolean;
	id: number;
};
export type GalleryResponse = {
	message: string;
	data: IGallery;
};
export type GallerysRequest = {
	enabled: boolean;	
	page_number: number;
	page_size: number;	
};

export type TMailFormData = {
	subject: string;
	recipients: string[];
	message: string;
	job_id: number;
	share_url: string;
	user_id: number;
};

export type TFeedFormData = {
	id?: number;
	description: string;
	feed_image: string;
	user_id: number;
	group_id: number;
	category_id: number;
	status: string;
};

export type IFeed = {
	id?: number;
	description: string;
	feed_image: string;
	status: string;
	user_id: number;
	user?: { first_name: string; last_name: string; image: string };
	dashboard_category?: { category_name: string };
	group?: { group_name: string };
	feed_comments?: { id: number };
	createdAt: string;
	updated_on: Date;
};
export type FeedsResponse = {
	total_records: number;
	data: IFeed[];
};
export type FeedRequest = {
	enabled: boolean;
	id: number;
};
export type FeedResponse = {
	message: string;
	data: IFeed;
};
export type FeedsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
	group_id: number;
	user_id: number;
};

export type TCommentFormData = {
	id?: number;
	comment_desc: string;
	user_id: number;
	feed_id: number;
	status: string;
};

export type TReportFormData = {
	id?: number;
	report_reason: string;
	user_id: number;
	feed_id: number;	
};

export type IComment = {
	id?: number;
	comment_desc: string;
	user_id: number;
	feed_id: number;
	status: string;
	user?: { first_name: string; last_name: string; image: string };
	createdAt: string;
	updated_on: Date;
};

export type CommentsResponse = {
	total_records: number;
	data: IComment[];
};
export type CommentRequest = {
	enabled: boolean;
	id: number;
};
export type CommentResponse = {
	message: string;
	data: IComment;
};
export type CommentsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
	feed_id: number;
};

export type TJobFormData = {
	id?: number;
	is_internship: number;
	job_title: string;
	company: string;
	location: string;
	contact_email: string;
	company_website: string;
	salary_package: string;
	experience_from: number;
	experience_to: number;
	duration: string;
	area_name: Array<string>;
	skill_name: Array<string>;
	job_type: string;
	posted_date: string;
	deadline_date: Date | null;
	job_description: string;
	status: string;
	user_id: number;
};
export type IJob = {
	id?: number;
	is_internship: number;
	job_title: string;
	company: string;
	contact_email: string;
	location: string;
	job_type: string;
	posted_date: string;
	deadline_date: Date;
	company_website: string;
	experience_from: number;
	experience_to: number;
	duration: string;
	salary_package: string;
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
	user_id: number;
	page_number: number;
	page_size: number;
	is_internship: number;
};

export type TBusinessDirectoryFormData = {
	id?: number;
	business_name: string;
	business_website: string;
	contact_number: string;
	industry_id: number;
	founded: number;
	number_of_employees: number;
	location: string;
	business_email: string;
	description: number;
	is_member_association: number;
	business_logo?: string;
	status: string;
	user_id: number;
	social_facebook?: string; // Optional Facebook link
	social_instagram?: string; // Optional Instagram link
	social_linkedin?: string; // Optional LinkedIn link
	social_twitter?: string;
	social_youtube?: string;
	member_ids?: string;
	services?: string;
	products?: string;
};
export type IBusinessDirectory = {
	id?: number;
	business_name: string;
	business_website: string;
	contact_number: string;
	industry_id: number;
	founded: number;
	number_of_employees: number;
	industry?: { industry_name: string };
	location: string;
	business_email: string;
	description: number;
	is_member_association: number;
	business_logo?: string;
	status: string;
	user_id: number;
	created_on: Date;
	updated_on: Date;
	social_facebook?: string; // Optional Facebook link
	social_instagram?: string; // Optional Instagram link
	social_linkedin?: string; // Optional LinkedIn link
	social_twitter?: string;
	social_youtube?: string;
	member_ids?: string;
	services?: string;
	products?: string;
};
export type BusinessDirectorysResponse = {
	total_records: number;
	data: IBusinessDirectory[];
	total_data: IBusinessDirectory[];
};
export type BusinessDirectoryRequest = {
	enabled: boolean;
	id: number;
};
export type BusinessDirectoryResponse = {
	message: string;
	data: IBusinessDirectory;
};
export type BusinessDirectorysRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TJobApplicationFormData = {
	id?: number;
	full_name: string;
	email_address: string;
	mobile_number: string;
	current_company: string;
	designation: string;
	total_years_of_experience: number;
	relevant_skills: string[];
	resume: string;
	status: string;
	job_id: number;
	user_id: number;
	note: string;
	apply_type: string;
};

export type IJobApplication = {
	id?: number;
	full_name: string;
	email_address: string;
	mobile_number: string;
	current_company: string;
	designation: string;
	total_years_of_experience: number;
	relevant_skills: string;
	resume: string[];
	job_id: number;
	job?: { job_title: string };
	user_id: number;
	note: string;
	apply_type: string;
	recruiter_name: string;
	recruiter_comment: string;
	status: string;
	createdAt: string;
};
export type JobApplicationsResponse = {
	total_records: number;
	data: IJobApplication[];
	total_data: IJobApplication[];
};
export type JobApplicationRequest = {
	enabled: boolean;
	id: number;
};
export type JobApplicationResponse = {
	message: string;
	jobApplicationData: IJobApplication;
};
export type JobApplicationsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type TGroupFormData = {
	id?: number;
	group_name: string;
};
export type IUserGroup = {
	id?: number;
	group_id: number;
	group?: { group_name: string };
	user_id: number;
	created_on: Date;
	updated_on: Date;
};

export type IGroup = {
	id?: number;
	group_name: string;
	created_on: Date;
	updated_on: Date;
};

export type GroupsResponse = {
	total_records: number;
	data: IUserGroup[];
};
export type GroupRequest = {
	enabled: boolean;
	id: number;
};
export type GroupResponse = {
	message: string;
	data: IGroup;
};
export type GroupsRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	user_id: number;
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
	createdAt: Date;
	updatedAt: Date;
};
export type IndustrysResponse = {
	map(arg0: (industry: any) => { name: any; count: any }): never;
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
	status: string;
};
export type IWorkRole = {
	id?: number;
	workrole_name: string;
	status: string;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
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
	createdAt: Date;
	updatedAt: Date;
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
	createdAt: Date;
	updatedAt: Date;
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
	course_shortcode: string;
	course_level: number;
	status: string;
};
export type ICourse = {
	id?: number;
	course_name: string;
	course_shortcode: string;
	course_level: number;
	status: string;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
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
	data: ICourse;
};
export type CoursesRequest = {
	enabled: boolean;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type INotification = {
	id?: number;
	sender_id: number;
	receiver_id: number;
	message_desc: string;
	notify_url: string;
	is_read: number;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
};
export type NotificationsResponse = {
	total_records: number;
	data: INotification[];
};
export type NotificationRequest = {
	enabled: boolean;
	id: number;
};
export type NotificationResponse = {
	message: string;
	data: INotification;
};
export type NotificationsRequest = {
	enabled: boolean;	
	user_id: number;
};

export type TInstituteFormData = {
	id?: number;
	institute_name: string;
	institute_siteurl: string;
	university_id: number;
	status: string;
};
export type IInstitute = {
	id?: number;
	institute_id: number;
	institute_name: string;
	institute_siteurl: string;
	university_id: number;
	status: string;
	twitter_url: string;
	facebook_url: string;
	instagram_url: string;
	linkedin_url: string;
	contact_number: string;
	contact_email: string;
	site_address: string;
	created_on: Date;
	updated_on: Date;
	createdAt: Date;
	updatedAt: Date;
};
export type InstitutesResponse = {
	total_records: number;
	data: IInstitute[];
};
export type InstituteRequest = {
	enabled: boolean;
	id: number;
};
export type InstituteResponse = {
	message: string;
	data: IInstitute;
};
export type InstitutesRequest = {
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
	start_year?: number;
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

export type IMessage = {
	id?: number;
	sender_id: number;
	receiver_id: number;
	subject: string;
	message_desc: string;
	status: string;
	user?: { first_name: string,  last_name: string};
	created_on: Date;
	updated_on: Date;	
	createdAt: string;
	updatedAt: Date;
};

export type MessagesResponse = {
	total_records: number;
	data: IMessage[];
};
export type MessageRequest = {
	enabled: boolean;
	id: number;
};
export type MessageResponse = {
	message: string;
	data: IMessage;
};
export type MessagesRequest = {
	enabled: boolean;
	user_id: number;
	filter_status: string;
	filter_name: string;
	page_number: number;
	page_size: number;
};

export type MessagesCountRequest = {
	enabled: boolean;
	user_id: number;	
};

export type MessagesCountResponse = {
	total_records: number;	
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

export type JobSkillsResponse = {
	[x: string]: any;
	total_records: number;
	data: IJobSkills[];
};
export type JobSkillsRequest = {
	enabled: boolean;
};
export type JobSkillRequest = {
	enabled: boolean;
	id: number;
};
export type JobSkillResponse = {
	message: string;
	serviceData: IJobSkills;
};

export interface IJobSkills {
	id: string;
	job_id: string;
	skill_name: string;
	created_on?: Date;
	updated_on?: Date;
}

// Interface for Job Application Form Data

export type ServicesResponse = {
	[x: string]: any;
	total_records: number;
	data: IService[];
};
export type ServicesRequest = {
	enabled: boolean;
};
export type ServiceRequest = {
	enabled: boolean;
	id: number;
};
export type ServiceResponse = {
	message: string;
	serviceData: IService;
};
export interface IService {
	id: string;
	service_name: string;
	is_custom: boolean;
	created_on?: Date;
	updated_on?: Date;
}

export type ProductsResponse = {
	[x: string]: any;
	total_records: number;
	data: IProduct[];
};
export type ProductsRequest = {
	enabled: boolean;
};
export type ProductRequest = {
	enabled: boolean;
	id: number;
};
export type ProductResponse = {
	message: string;
	productData: IProduct;
};
export interface IProduct {
	id: string;
	product_name: string;
	is_custom: boolean;
	created_on?: Date;
	updated_on?: Date;
}

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
