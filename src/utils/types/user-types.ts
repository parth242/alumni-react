//import { BillingPlansType } from "./admincms-types";

export type ModalSizeType = {
	[key: string]: string;
};
export type LoginType = {
	email?: string;
	password?: string;
	organisation?: string;
};
export type RegisterType = {
	id?: number;
	first_name: string;
	middle_name?: string;
	last_name: string;
	email: string;
	role_id: number;
	course_id: number;
	department_id: number;
	batch_start: number;
	batch_end: number;
	end_year: number;
	specialization: string;
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

export type ChangePasswordType = {
	current_password?: string;
	password?: string;
};

export type TMailFormData = {
	subject: string;
	recipients: string[];
	message: string;
};

export type TApplyJobFormData = {
	job_id: number;
	user_id: number;
	full_name: string;
	email_address: string;
	mobile_number: string;
	current_company: string;
	designation: string;
	total_years_of_experience: number;
	relevant_skills: string[];
	resume_upload?: string;
};

export type shopifyLoggerType = {
	log_type: string;
	message: string;
	service: string;
	context?: Response;
	transaction_id?: string | null;
};

export type RegisterInvitationItemType = {
	password?: string;
	first_name?: string;
	last_name?: string;
	confirm_password?: string;
	org_name?: string;
};
export type RegisterInvitationType = {
	key?: string;
	data?: RegisterInvitationItemType;
};

export type ResetPasswordType = {
	key?: string;
	password?: string;
};
export type IUser = {
	email: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	mobileno: string;
	verified: boolean;
	created: string;
	id: string;
	last_signed_in: string;
	totp_enabled: boolean;
};
export type BillingMetadataType = {
	customer_details?: {
		name: string;
		contact: string;
		email: string;
		gstin: string;
	};
	address?: {
		line1: string;
		line2: string;
		zipcode: string;
		city: string;
		state: string;
		country: string;
	};
	enabled: boolean;
};

/*export type CustomerPlanType = {
	plan: BillingPlansType;
};*/

/*export type CustomerType = {
	company: string;
	enforce_totp: false;
	id: string;
	created: string;
	experimental_features: string | null;
	users: IUser[];
	plan?: BillingPlansType;
	default_plan: BillingPlansType;
	customer_plan: CustomerPlanType;
	billing_metadata?: BillingMetadataType;
};*/

export type DialogProfileType = {
	settings: {
		profile: {
			about: { text: string };
			photo: { link: string };
		};
		business: {
			profile: {
				address: string;
				email: string;
				websites: Array<string>;
			};
		};
	};
};
