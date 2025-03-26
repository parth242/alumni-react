import {
	AllowedFilesType,
	FileInvalidType,
	FilesExtType,
	FilesSizeType,
	Menu,
	MenuTooltipType,
	NumberBooleanType,
} from "./datatypes";

export type StringNumberType = {
	[key: string]: number;
};
export type NumberStringType = {
	[key: number]: string;
};
export type StringStringType = {
	[key: string]: string;
};
export type StringBooleanType = {
	[key: string]: boolean;
};
export type StringRegexpType = {
	[key: string]: RegExp;
};

export const pageStartFrom = 1;

export const StatusClass: StringStringType = {
	pending: "text-yellow-500",
	active: "text-green-500",
	inactive: "text-red-500",
};

export const CUserStatusClass: StringStringType = {
	pending: "text-yellow-500",
	active: "text-green-500",
};

export const tooltipClass =
	"!rounded-lg !border !border-gray-300 bg-white !opacity-100 !shadow-[0px_2px_4px_0px_rgb(187,187,187,0.3)] dark:!border-dark3 dark:bg-dark2 dark:text-darkPrimary dark:!shadow-none";

export const patterns: StringRegexpType = {
	URL: /^https:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
	WEBSITE:
		/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
	PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/g,
	EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	TEMPLATE_NAME: /^[a-z0-9_]*$/,
	STORE: /^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/,
	STOREBASE: /^https?\:\/\/[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com\/?/,
	SHOPIFYMATCH: /^https?\:\/\/([a-zA-Z0-9][a-zA-Z0-9\-]*)\.myshopify\.com\/?/,
};

export const CartRecoveryToggle: NumberBooleanType = {
	0: false,
	1: false,
	2: true,
	3: true,
};
export const OrderFulfillmentToggle: NumberBooleanType = {
	0: false,
	1: false,
	2: true,
	3: true,
};
export const CodConfirmationToggle: NumberBooleanType = {
	0: false,
	1: false,
	2: true,
	3: true,
};
export const ShippingStatusToggle: NumberBooleanType = {
	0: false,
	1: false,
	2: true,
	3: true,
};

export const filesExt: FilesExtType = {
	image: ["jpg", "jpeg", "png"],
	video: ["mp4", "3gpp", "3gp"],
	document: ["pdf", "doc", "docx"],
	csv: ["csv"],
	sheet: ["xlsx", "xls", "csv"],
};
export const allowedFiles: AllowedFilesType = {
	image: ["image/jpg,image/jpeg,image/png"],
	video: ["video/mp4,video/3gpp,video/3gp"],
	document: [".pdf", ".doc", ".docx"],
	sheet: [".xlsx", ".xls", ".csv"],
};
export const filesSize: FilesSizeType = {
	image: 2097152,
	video: 16777216,
	document: 2097152,
	sheet: 104857600,
};

export const filesLimit: FileInvalidType = {
	image: "2MB",
	video: "16MB",
	document: "2MB",
	sheet: "100MB",
};

export const fileInvalid: FileInvalidType = {
	image: "Unsupported file. Please upload a non-transparent image in jpg/jpeg/png format.",
	video: "Unsupported file. Please upload an mp4/3gp.",
	document: "Unsupported file. Please upload a pdf.",
	sheet: "Unsupported file. Please upload a spreadsheet.",
};

export enum RoleEnum {
	admin = "admin",
	org_admin = "org_admin",
	agent_admin = "agent_admin",
	agent = "agent",
	billing_admin = "billing_admin",
	all = "all",
}
export enum RouteValidation {
	check_waba,
	check_integrations,
	is_experimental,
}

export const menu: Menu[] = [
	{
		id: 1,
		path: "dashboard",
		forRole: true,
		title: "Dashboard",
		name: "dashboard",
		component: "Dashboard",
		is_visible: true,
		is_locked: true,
		can_access: [RoleEnum.admin, RoleEnum.org_admin],
		icon: "home",
		exclude_validation: [
			RouteValidation.check_integrations,
			RouteValidation.is_experimental,
			RouteValidation.check_waba,
		],
	},
	{
		id: 2,
		path: "users",
		forRole: true,
		title: `Users`,
		name: `users`,
		icon: "users",
		component: "",
		is_visible: true,
		is_locked: true,
		can_access: [RoleEnum.admin, RoleEnum.org_admin],
		exclude_validation: [RouteValidation.check_integrations],
	},
	{
		id: 3,
		path: "departments",
		forRole: true,
		title: `Departments`,
		name: `departments`,
		icon: "truck",
		component: "CTWCampaigns",
		is_visible: true,
		is_locked: true,
		can_access: [RoleEnum.admin, RoleEnum.org_admin],
		exclude_validation: [RouteValidation.check_integrations],
	},
	{
		id: 4,
		path: "roles",
		forRole: true,
		title: `Roles`,
		name: `roles`,
		icon: "user-plus",
		component: "",
		is_visible: true,
		is_locked: true,
		can_access: [RoleEnum.admin, RoleEnum.org_admin],
		exclude_validation: [RouteValidation.check_integrations],
	},
];

export const tooltip: MenuTooltipType = {
	pre_waba: "Setup <b>WABA</b> to unlock this feature.",
	post_waba: "Integrate your storefront to</br>unlock this feature.",
	other: "You don't have access to this resource",
};
export const ContactsType: StringNumberType = {
	indian: 1,
	non_indian: 2,
};
export const IntegrationsType: StringNumberType = {
	LiveAgentChatIntegrationType: 11,
	ShopIntegrationType: 2,
};
export const IntegrationsDatasourceType: StringNumberType = {
	ChatwootDataSource: 20,
	ShopifyDataSource: 1,
	WoocommerceDataSource: 17,
};
export const ChatwootStatus: StringNumberType = {
	NOT_STARTED: 0,
	DISABLE: 1,
	PENDING: 2,
	ENABLE: 3,
};

export const OrderStatusToggle: NumberBooleanType = {
	0: false,
	1: false,
	2: true,
	3: true,
};
export enum toggleEnum {
	DISABLE = 1,
	PENDING = 2,
	ENABLE = 3,
}

export const BusinessCard = [
	{
		id: 1,
		businessName: "IT Consulting",
		website: "https://www.itconsulting.com",
		contactNumber: "1234567890",
		industry: "Engineering & Technology",
		location: "New York, NY",
		email: "info@itconsulting.com",
		description: "IT consulting services.",
		isAlumni: true,
	},
	{
		id: 2,
		businessName: "Digital Marketing",
		website: "https://www.digitalmarketing.com",
		contactNumber: "1234567890",
		industry: "Marketing & Sales",
		location: "San Francisco, CA",
		email: "info@digitalmarketing.com",
		description: "Digital marketing services.",
		isAlumni: true,
	},
	{
		id: 3,
		businessName: "Web Development",
		website: "https://www.webdevelopment.com",
		contactNumber: "1234567890",
		industry: "Software & IT",
		location: "New York, NY",
		email: "info@webdevelopment.com",
		description: "Full-stack development services",
		isAlumni: true,
	},
	{
		id: 4,
		businessName: "Graphic Design",
		website: "https://www.graphicdesign.com",
		contactNumber: "1234567890",
		industry: "Software & IT",
		location: "New York, NY",
		email: "info@graphicdesign.com",
		description: "Creative design for branding",
		isAlumni: true,
	},
	{
		id: 5,
		businessName: "Data Analysis",
		website: "https://www.dataanalysis.com",
		contactNumber: "1234567890",
		industry: "Software & IT",
		location: "New York, NY",
		email: "info@dataanalysis.com",
		description: "Data insights and visualization",
		isAlumni: true,
	},
	{
		id: 6,
		businessName: "Social Media Management",
		website: "https://www.socialmediamanagement.com",
		contactNumber: "1234567890",
		industry: "Marketing & Sales",
		location: "New York, NY",
		email: "info@socialmediamanagement.com",
		description: "Strategy and management ",
		isAlumni: true,
	},
	{
		id: 7,
		businessName: "Project Management",
		website: "https://www.projectmanagement.com",
		contactNumber: "1234567890",
		industry: "Software & IT",
		location: "New York, NY",
		email: "info@projectmanagement.com",
		description: "End-to-end project oversight",
		isAlumni: true,
	},
	{
		id: 8,
		businessName: "Cybersecurity",
		website: "https://www.cybersecurity.com",
		contactNumber: "1234567890",
		industry: "Software & IT",
		location: "New York, NY",
		email: "info@cybersecurity.com",
		description: "Protecting digital assets and data",
		isAlumni: true,
	},
	{
		id: 9,
		businessName: "E-commerce Solutions",
		website: "https://www.ecommercesolutions.com",
		contactNumber: "1234567890",
		industry: "Software & IT",
		location: "New York, NY",
		email: "info@ecommercesolutions.com",
		description: "Custom online store development",
		isAlumni: true,
	},
	{
		id: 10,
		businessName: "Mobile App Development",
		website: "https://www.mobileappdevelopment.com",
		contactNumber: "1234567890",
		industry: "Software & IT",
		location: "New York, NY",
		email: "info@mobileappdevelopment.com",
		description: "iOS and Android app creation",
		isAlumni: true,
	},
	{
		id: 11,
		businessName: "Cloud Solutions",
		website: "https://www.cloudsolutions.com",
		contactNumber: "1234567890",
		industry: "Software & IT",
		location: "New York, NY",
		email: "info@cloudsolutions.com",
		description: "Cloud storage and computing services",
		isAlumni: true,
	},
	{
		id: 12,
		businessName: "Content Creation",
		website: "https://www.contentcreation.com",
		contactNumber: "1234567890",
		industry: "Software & IT",
		location: "New York, NY",
		email: "info@contentcreation.com",
		description: "Writing and media production services",
		isAlumni: true,
	},
	{
		id: 13,
		businessName: "Financial Consulting",
		website: "https://www.financialconsulting.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@financialconsulting.com",
		description: "Financial planning and analysis",
		isAlumni: true,
	},
	{
		id: 14,
		businessName: "Human Resources",
		website: "https://www.humanresources.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@humanresources.com",
		description: "HR solutions and recruitment services",
		isAlumni: true,
	},
	{
		id: 15,
		businessName: "Customer Support",
		website: "https://www.customersupport.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@customersupport.com",
		description: "Dedicated customer support solutions",
		isAlumni: true,
	},
	{
		id: 16,
		businessName: "Sales Training",
		website: "https://www.salestraining.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@salestraining.com",
		description: "Empowering sales teams with best practices",
		isAlumni: true,
	},
	{
		id: 17,
		businessName: "Event Planning",
		website: "https://www.eventplanning.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@eventplanning.com",
		description: "Professional event management services",
		isAlumni: true,
	},
	{
		id: 18,
		businessName: "Legal Services",
		website: "https://www.legalservices.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@legalservices.com",
		description: "Corporate law and compliance",
		isAlumni: true,
	},
	{
		id: 19,
		businessName: "Product Design",
		website: "https://www.productdesign.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@productdesign.com",
		description: "Innovative design and prototyping",
		isAlumni: true,
	},
	{
		id: 20,
		businessName: "Supply Chain Management",
		website: "https://www.supplychainmanagement.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@supplychainmanagement.com",
		description: "Efficient and sustainable supply solutions",
		isAlumni: true,
	},
	{
		id: 21,
		businessName: "Quality Assurance",
		website: "https://www.qualityassurance.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@qualityassurance.com",
		description: "Testing and quality control",
		isAlumni: true,
	},
	{
		id: 22,
		businessName: "Virtual Assistance",
		website: "https://www.virtualassistance.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@virtualassistance.com",
		description: "Remote administrative support",
		isAlumni: true,
	},
	{
		id: 23,
		businessName: "Market Research",
		website: "https://www.marketresearch.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@marketresearch.com",
		description: "Insights into market trends and consumer behavior",
		isAlumni: true,
	},
	{
		id: 24,
		businessName: "Environmental Consulting",
		website: "https://www.environmentalconsulting.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@environmentalconsulting.com",
		description: "Sustainable and eco-friendly practices",
		isAlumni: true,
	},
	{
		id: 25,
		businessName: "Real Estate Services",
		website: "https://www.realestateservices.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@realestateservices.com",
		description: "Buying, selling, and renting properties",
		isAlumni: true,
	},
	{
		id: 26,
		businessName: "Public Relations",
		website: "https://www.publicrelations.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@publicrelations.com",
		description: "Building brand reputation and media relations",
		isAlumni: true,
	},
	{
		id: 27,
		businessName: "Architecture Services",
		website: "https://www.architecture.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@architecture.com",
		description: "Residential and commercial architectural design",
		isAlumni: true,
	},
	{
		id: 28,
		businessName: "Healthcare Consulting",
		website: "https://www.healthcareconsulting.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@healthcareconsulting.com",
		description: "Strategies and support for healthcare providers",
		isAlumni: true,
	},
	{
		id: 29,
		businessName: "Nonprofit Management",
		website: "https://www.nonprofitmanagement.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@nonprofitmanagement.com",
		description: "Services for effective nonprofit operations",
		isAlumni: true,
	},
	{
		id: 30,
		businessName: "Education and Training",
		website: "https://www.educationtraining.com",
		contactNumber: "1234567890",
		industry: "Banking & Finance",
		location: "New York, NY",
		email: "info@educationtraining.com",
		description: "Workshops and courses for skill development",
		isAlumni: true,
	},
];
export const menuData = [
	{
		id: "industries",
		title: "Industries",
		icon: "FactoryIcon",
		items: [
			{ name: "Engineering & Technology", count: 2 },
			{ name: "Software & IT", count: 1 },
			{ name: "Banking & Finance", count: 1 },
		],
	},
	{
		id: "products",
		title: "Products",
		icon: "FactoryIcon",
		items: [
			{ name: "The secret of compounding" },
			{ name: "Personalized retirement planning" },
			{ name: "The type of risk" },
		],
	},
	{
		id: "services",
		title: "Services",
		icon: "VideoSettingsIcon",
		items: [
			{ name: "Web Development" },
			{ name: "Business Consulting" },
			{ name: "Marketing & Sales" },
			{ name: "Accounting & Tax" },
		],
	},
	{
		id: "locations",
		title: "Locations",
		icon: "FactoryIcon",
		items: [{ name: "New York, NY" }, { name: "San Francisco, CA" }],
	},
];
