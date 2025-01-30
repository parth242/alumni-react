import {
	DoubleLeftOutlined,
	PlusOutlined,
	MinusCircleOutlined,
	SaveOutlined,
	FacebookOutlined,
	InstagramOutlined,
	LinkedinOutlined,
	TwitterOutlined,
	YoutubeOutlined,
} from "@ant-design/icons";
import {
	createBusinessDirectory,
	deleteBusinessDirectory,
	getBusinessDirectory,
	updateBusinessDirectoryMembers,
	updateBusinessDirectoryProducts,
	updateBusinessDirectoryServices,
} from "api/services/businessdirectoryService";
import {
	Button,
	Col,
	Divider,
	Form,
	Input,
	message,
	Modal,
	Popconfirm,
	Row,
	Tag,
} from "antd";
import { Select } from "antd";
const { Option } = Select;
import SiteNavbar from "components/layout/sitenavbar";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import LinkCommon from "components/ui/common/LinkCommon";
import React, { useEffect, useState } from "react";
import { FooterComponent } from "components/layout/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { SelectProps } from "antd";
import {
	IBusinessDirectory,
	IProduct,
	IService,
	TBusinessDirectoryFormData,
} from "utils/datatypes";
import { useMutation, useQueryClient } from "react-query";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	useUserData,
} from "api/services/user";
import { HTTPError } from "ky";
import { getServices } from "api/services/servicesService ";
import { createProducts, getProducts } from "api/services/productsService ";
import { useAppState } from "utils/useAppState";
import InputCustom from "components/ui/common/InputCustom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { pageStartFrom } from "utils/consts";
import BtnLink from "components/ui/common/BtnLink";
const OPTIONS = ["Soffiyan", "Aazib", "Naveen", "Parth", "Sandhya"];

const BusinessDirectoryDetailPage: React.FC = () => {
	const [{ user }, setAppState] = useAppState();
	const { id } = useParams<{ id: string }>();
	const businessId = Number(id);
	const navigate = useNavigate();
	const [ProductForm] = Form.useForm();
	const [ServiceForm] = Form.useForm();

	const [open, setOpen] = useState(false);

	const [selectedItems, setSelectedItems] = useState<string[]>([]);

	const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));

	const [selectedServices, setSelectedServices] = useState<string[]>([]);
	const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

	const schema = yup.object().shape({
		social_facebook: yup
			.string()
			.nullable()
			.notRequired()
			.test(
				"is-valid-facebook-url",
				"Invalid Facebook URL format",
				value => {
					if (!value || value.trim() === "") return true; // Skip validation if empty
					const facebookRegex =
						/^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9._-]+(\/.*)?$/;
					return facebookRegex.test(value); // Validate only if a value exists
				},
			)
			.url("Please enter a valid Facebook URL"),

		social_instagram: yup
			.string()
			.nullable()
			.notRequired()
			.test(
				"is-valid-instagram-url",
				"Invalid Instagram URL format",
				value => {
					if (!value || value.trim() === "") return true; // Skip validation if empty
					const instagramRegex =
						/^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._-]+(\/.*)?$/;
					return instagramRegex.test(value); // Validate only if a value exists
				},
			)
			.url("Please enter a valid instagram URL"),

		social_linkedin: yup
			.string()
			.nullable()
			.notRequired()
			.test(
				"is-valid-linkedin-url",
				"Invalid linkedin URL format",
				value => {
					if (!value || value.trim() === "") return true; // Skip validation if empty
					const linkedinRegex =
						/^(https?:\/\/)?(www\.)?linkedin\.com\/[a-zA-Z0-9._-]+(\/.*)?$/;
					return linkedinRegex.test(value); // Validate only if a value exists
				},
			)
			.url("Please enter a valid linkedin URL"),

		social_twitter: yup
			.string()
			.nullable()
			.notRequired()
			.test(
				"is-valid-twitter-url",
				"Invalid twitter URL format",
				value => {
					if (!value || value.trim() === "") return true; // Skip validation if empty
					const twitterRegex =
						/^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9._-]+(\/.*)?$/;
					return twitterRegex.test(value); // Validate only if a value exists
				},
			)
			.url("Please enter a valid twitter URL"),

		social_youtube: yup
			.string()
			.nullable()
			.notRequired()
			.test(
				"is-valid-youtube-url",
				"Invalid youtube URL format",
				value => {
					if (!value || value.trim() === "") return true; // Skip validation if empty
					const youtubeRegex =
						/^(https?:\/\/)?(www\.)?youtube\.com\/[a-zA-Z0-9._?=-]+(\/.*)?$/;
					return youtubeRegex.test(value); // Validate only if a value exists
				},
			),
	});

	const {
		register,
		handleSubmit,
		trigger,
		setValue,
		formState: { errors },
	} = useForm<TBusinessDirectoryFormData>({
		resolver: yupResolver(schema),
	});

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [selectedDepartment, setSelectedDepartment] = useState<number>(0);
	const [selectedEndYear, setSelectedEndYear] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 11 });
	const {
		isLoading: isUserLoading,
		data: userList,
		refetch: fetchUserList,
		isFetching: isFetchingUserList,
	} = useUserData({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		filter_course: selectedCourse,
		filter_department: selectedDepartment,
		filter_endyear: selectedEndYear,
		page_number: pageNumber,
		page_size: pageSize.value,
		isalumni: 1,
	});

	const { data: servicesData, refetch: fetchServiceData } = getServices({
		enabled: false,
	});

	const { data: productsData, refetch: fetchProductData } = getProducts({
		enabled: false,
	});

	useEffect(() => {
		fetchServiceData();
		fetchProductData();
		fetchUserList();
		return () => {
			return;
		};
	}, []);

	const {
		data,
		refetch: fetchBusinessDetails,
		error,
		isLoading,
	} = getBusinessDirectory({
		enabled: false,
		id: businessId,
	});

	useEffect(() => {
		if (
			!isNaN(businessId) &&
			!!(
				servicesData?.total_records && servicesData?.total_records >= 0
			) &&
			!!(
				productsData?.total_records && productsData?.total_records >= 0
			) &&
			!!(userList?.total_records && userList?.total_records >= 0)
		) {
			fetchBusinessDetails();
		}

		return () => {
			return;
		};
	}, [businessId, servicesData, productsData, userList]);

	useEffect(() => {
		if (data?.data.member_ids) {
			const memberIds = data?.data?.member_ids.split(",").map(Number);
			const selected: any = memberIds
				.map(id => {
					const user = userList?.data?.find(user => user.id === id);
					return user ? { value: id, label: user.first_name } : null;
				})
				.filter(Boolean); // Remove null entries if a user ID doesn't exist
			setSelectedMembers(selected); // Store the mapped array
		} else {
			setSelectedMembers([]);
		}
	}, [data]);

	useEffect(() => {
		setSelectedServices([]);
		if (data?.data.services) {
			const services = data?.data?.services.split(",");
			setSelectedServices(services);

			services.forEach(service => {
				const filtered = servicesData?.data?.filter(
					item => item.service_name === service,
				);
				if (filtered?.length) {
					selectedServices.push(filtered[0].service_name);
				}
			});
		}
	}, [data]);

	useEffect(() => {
		setSelectedProducts([]);
		if (data?.data?.products) {
			const products = data?.data?.products.split(",");
			setSelectedProducts(products);

			products.forEach(products => {
				const filtered = productsData?.data?.filter(
					item => item.product_name === products,
				);
				if (filtered?.length) {
					selectedProducts.push(filtered[0].product_name);
				}
			});
		}
	}, [data]);

	interface DescriptionItemProps {
		title: string;
		content: React.ReactNode;
	}

	const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
		<div className="custom-site-description-item-profile-wrapper">
			<p className="custom-site-description-item-profile-p-label">
				{title}:
			</p>
			{content}
		</div>
	);

	const [socialLinks, setSocialLinks] = useState({
		social_facebook: "",
		social_instagram: "",
		social_linkedin: "",
		social_twitter: "",
		social_youtube: "",
	});

	useEffect(() => {
		if (data?.data) {
			const updatedLinks = {
				social_facebook: data?.data.social_facebook || "",
				social_instagram: data?.data.social_instagram || "",
				social_linkedin: data?.data.social_linkedin || "",
				social_twitter: data?.data.social_twitter || "",
				social_youtube: data?.data.social_youtube || "",
			};

			setSocialLinks(updatedLinks);

			setValue("social_facebook", updatedLinks.social_facebook);
			setValue("social_instagram", updatedLinks.social_instagram);
			setValue("social_linkedin", updatedLinks.social_linkedin);
			setValue("social_twitter", updatedLinks.social_twitter);
			setValue("social_youtube", updatedLinks.social_youtube);
		}
	}, [data, setValue]);

	const handleInputChange = (name: string, value: string) => {
		setSocialLinks(prev => {
			const updatedLinks = { ...prev, [name]: value };
			return updatedLinks;
		});
	};

	React.useEffect(() => {
		ProductForm.setFieldsValue({ products: [] });
		ServiceForm.setFieldsValue({ services: [] });
	}, [ProductForm, ServiceForm]);

	const [addBusinessForm] = Form.useForm();

	const { mutate: mutateBusinessDirectory, isError } = useMutation(
		createBusinessDirectory,
		{
			onSuccess: async (res: any) => {
				SuccessToastMessage({
					title: "Business Directory Added Successfully",
					id: "business_directory_user_success",
				});
				fetchBusinessDetails();
				addBusinessForm.resetFields();
			},
			onError: async (e: HTTPError) => {
				ErrorToastMessage({ error: e, id: "business_directory_user" });
			},
		},
	);

	const submitAddBusiness = (data: TBusinessDirectoryFormData) => {
		data.id = businessId;
		mutateBusinessDirectory(data);
	};

	const handleSaveMember = async () => {
		const members: any = [];
		selectedMembers.forEach(value => {
			if (value) {
				members.push({ id: value });
			} else {
				const member = userList?.data?.find(
					item => item.id === Number(value),
				);
				if (member) {
					members.push({
						name: member.first_name,
						isCustom: false,
					});
				}
			}
		});
		const businessDirectoryData = {
			id: businessId,
			members: members,
		};
		mutateAddMemberInBusinessDirectory(businessDirectoryData, {
			onSuccess: () => {
				setSelectedMembers(members.map((member: any) => member.id));
			},
		});
	};

	const handleSaveServices = async () => {
		const services: any = [];
		selectedServices.forEach(value => {
			if (isNaN(Number(value))) {
				services.push({ name: value, isCustom: true });
			} else {
				const service = servicesData?.data?.find(
					item => item.id === value,
				);
				if (service) {
					services.push({
						name: service.service_name,
						isCustom: false,
					});
				}
			}
		});

		const businessDirectoryData = {
			id: businessId,
			services: services,
		};

		// Mutate and update UI state optimistically
		mutateAddServicesInBusinessDirectory(businessDirectoryData, {
			onSuccess: () => {
				setSelectedServices(
					services.map((service: any) => service.name),
				); // Update state after save
			},
		});
	};

	const handleSaveProducts = async () => {
		const products: any = [];
		selectedProducts.filter(value => {
			if (isNaN(Number(value))) {
				products.push({ name: value, isCustom: true });
			} else {
				const product = productsData?.data?.findIndex(
					(item: IProduct) => item.id === value,
				);
				if (product !== undefined && product >= 0) {
					products.push({
						name: productsData?.data[product].product_name,
						isCustom: false,
					});
				}
			}
		});

		const businessDirectoryData = {
			id: businessId,
			products: products,
		};
		// Mutate and update UI state optimistically
		mutateAddProductInBusinessDirectory(businessDirectoryData, {
			onSuccess: () => {
				setSelectedProducts(
					products.map((product: any) => product.name),
				); // Update state after save
			},
		});
	};
	const queryClient = useQueryClient();

	const {
		mutate: mutateAddMemberInBusinessDirectory,
		isLoading: isMemberBusinessDirectoryLoading,
		isError: isMemberBusinessDirectoryError,
	} = useMutation(updateBusinessDirectoryMembers, {
		onSuccess: async (res: any) => {
			queryClient.invalidateQueries("members");
			await fetchBusinessDetails();
			SuccessToastMessage({
				title: "Members Added Successfully",
				id: "member_added_success",
			});
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({
				error: e,
				id: "members_added_error",
			});
		},
	});

	const {
		mutate: mutateAddServicesInBusinessDirectory,
		isLoading: isServiceBusinessDirectoryLoading,
		isError: isServiceBusinessDirectoryError,
	} = useMutation(updateBusinessDirectoryServices, {
		onSuccess: async (res: any) => {
			queryClient.invalidateQueries("services");
			SuccessToastMessage({
				title: "Service Added Successfully",
				id: "service_added_success",
			});
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({
				error: e,
				id: "service_added_error",
			});
		},
	});

	const {
		mutate: mutateAddProductInBusinessDirectory,
		isLoading: isProductBusinessDirectoryLoading,
		isError: isProductBusinessDirectoryError,
	} = useMutation(updateBusinessDirectoryProducts, {
		onSuccess: async (res: any) => {
			queryClient.invalidateQueries("products");
			SuccessToastMessage({
				title: "Product Added Successfully",
				id: "product_added_success",
			});
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({
				error: e,
				id: "product_added_error",
			});
		},
	});

	const {
		mutate: mutateDeleteBusinessDirectory,
		isLoading: isDeleteBusinessDirectoryLoading,
		isError: isDeleteBusinessDirectoryError,
	} = useMutation(deleteBusinessDirectory, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Business Detail Delete Successfully",
				id: "business_detail_delete_success",
			});
			navigate("/business-directory");
			setOpen(false);
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({
				error: e,
				id: "usiness_detail_delete_error",
			});
		},
	});
	const showDeleteConfirm = (id: any) => {
		Modal.confirm({
			title: "Are you sure you want to delete this business listing?",
			content: "This action cannot be undone.",
			okText: "Yes, Delete",
			okType: "danger",
			cancelText: "Cancel",
			onOk: () => hendleDeleteBusinessDetail(id),
		});
	};

	const hendleDeleteBusinessDetail = (id: any) => {
		mutateDeleteBusinessDirectory(id);
	};

	if (!data || !data.data) {
		return <div></div>;
	}
	type TagRender = SelectProps["tagRender"];
	const serviceTagRender: TagRender = (props: any) => {
		const { label, closable, onClose } = props;
		const onPreventMouseDown = (
			event: React.MouseEvent<HTMLSpanElement>,
		) => {
			event.preventDefault();
			event.stopPropagation();
		};
		return (
			<Tag
				color="blue"
				onMouseDown={onPreventMouseDown}
				closable={closable}
				onClose={onClose}
				style={{ marginInlineEnd: 6 }}>
				{label}
			</Tag>
		);
	};

	const productTagRender: TagRender = (props: any) => {
		const { label, closable, onClose } = props;
		const onPreventMouseDown = (
			event: React.MouseEvent<HTMLSpanElement>,
		) => {
			event.preventDefault();
			event.stopPropagation();
		};
		return (
			<Tag
				color="purple"
				onMouseDown={onPreventMouseDown}
				closable={closable}
				onClose={onClose}
				style={{ marginInlineEnd: 6 }}>
				{label}
			</Tag>
		);
	};

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full">
				<div className="w-full md:w-10/12 mx-auto py-6 px-4 relative">
					<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
						{/* Heading */}
						<h1 className="text-lg sm:text-xl lg:text-3xl text-black font-bold text-center lg:text-left">
							{data.data.business_name}
						</h1>

						{/* Button */}
						<div className="flex justify-center gap-4 lg:justify-end">
							<BtnLink to={`/business-directory`}>
								Back to directory
							</BtnLink>
							{data.data.user_id === user.id && (
								<BtnLink
									style={{ backgroundColor: "red" }}
									onClick={() =>
										showDeleteConfirm(businessId)
									}>
									Delete
								</BtnLink>
							)}
						</div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-4 mt-6 gap-6">
						<div>
							{data.data.user_id === user.id && (
								<div className="lg:col-span-1 border-2 border-gray-200 shadow-md rounded-xl px-4 ">
									{/* <div className="mt-5 mb-5">
										<h2 className="text-l font-semibold text-gray-700">
											Add Team Members
										</h2>
										<div className="mt-4">
											<Select
												size="large"
												mode="multiple"
												style={{ width: "100%" }}
												placeholder="Select Team Members"
												className="rounded-md border-1 border-gray-300"
												value={selectedMembers}
												onChange={value =>
													setSelectedMembers(value)
												}
												options={userList?.data.map(
													(user: any) => ({
														value: user.id,
														label: user.first_name,
													}),
												)}
											/>

											<div className="flex justify-center mt-5">
												<Button
													icon={<SaveOutlined />}
													type="primary"
													size="large"
													className="border-1 border-gray-300"
													style={{
														backgroundColor: "#fff",
														color: "#440178",
													}}
													onClick={handleSaveMember}>
													Save
												</Button>
											</div>
										</div>
									</div> */}

									<h2 className="text-l font-semibold text-gray-700">
										Add Products
									</h2>
									<div className="mt-4">
										{data?.data ? (
											<div
												className="mt-4"
												style={{ maxWidth: 600 }}>
												<Select
													mode="tags"
													size="large"
													placeholder="Select Products"
													value={selectedProducts}
													onChange={value =>
														setSelectedProducts(
															value,
														)
													}
													options={productsData?.data?.map(
														(product: any) => ({
															value: product.product_name,
															label: product.product_name,
														}),
													)}
													className="rounded-md border-2 border-gray-300"
													style={{ width: "100%" }}
													tagRender={productTagRender}
												/>

												{/* Save Button */}
												<div className="flex justify-center mt-5">
													<Button
														icon={<SaveOutlined />}
														type="primary"
														size="large"
														className="border-1 border-gray-300"
														style={{
															backgroundColor:
																"#fff",
															color: "#440178",
														}}
														onClick={
															handleSaveProducts
														}>
														Save
													</Button>
												</div>
											</div>
										) : (
											<></>
										)}

										<Divider className="border-2 border-gray-100" />
										<h2 className="text-l font-semibold text-gray-700">
											Add Services
										</h2>
										{data?.data ? (
											<div
												className="mt-10"
												style={{ maxWidth: 600 }}>
												<Select
													mode="tags"
													size="large"
													placeholder="Select Services"
													value={selectedServices}
													onChange={value =>
														setSelectedServices(
															value,
														)
													}
													options={servicesData?.data?.map(
														(service: any) => ({
															value: service.service_name,
															label: service.service_name,
														}),
													)}
													className="rounded-md border-2 border-gray-300"
													style={{ width: "100%" }}
													tagRender={serviceTagRender}
												/>

												{/* Save Button */}
												<div className="flex justify-center mt-5">
													<Button
														icon={<SaveOutlined />}
														type="primary"
														size="large"
														className="border-1 border-gray-300"
														style={{
															backgroundColor:
																"#fff",
															color: "#440178",
														}}
														onClick={
															handleSaveServices
														}>
														Save
													</Button>
												</div>
											</div>
										) : (
											<></>
										)}
										<Divider className="border-2 border-gray-100" />
									</div>
								</div>
							)}
						</div>
						<div className="lg:col-span-2 h-auto lg:h-auto border-2 border-gray-200 shadow-md p-4 sm:p-6 overflow-y-auto">
							<p className="text-lg sm:text-xl mb-3 font-semibold">
								{data?.data.business_name}
							</p>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<DescriptionItem
									title="Industry"
									content={data?.data.industry?.industry_name}
								/>
								<DescriptionItem
									title="Location"
									content={data?.data.location}
								/>
								<DescriptionItem
									title="Website"
									content={data?.data.business_website}
								/>
								<DescriptionItem
									title="Number of Employees"
									content={data?.data.number_of_employees}
								/>
								<DescriptionItem
									title="Founded"
									content={data?.data.founded}
								/>
								<DescriptionItem
									title="Products"
									content={
										selectedProducts.length
											? selectedProducts.join(", ")
											: "No products selected"
									}
								/>
								<DescriptionItem
									title="Services"
									content={
										selectedServices.length
											? selectedServices.join(", ")
											: "No services selected"
									}
								/>
								<DescriptionItem
									title="Member of Alumni Association"
									content={
										data?.data.is_member_association === 1
											? "Yes"
											: "No"
									}
								/>
							</div>

							{/* <hr className="my-4" />
							<p className="text-md sm:text-lg font-semibold mb-3">
								Team
							</p>
							<DescriptionItem
								title="Members"
								content={
									data?.data.member_ids &&
									data?.data.member_ids
										.split(",")
										.map(id => {
											const user = userList?.data?.find(
												user => user.id === Number(id),
											);
											return user
												? user.first_name
												: `Unknown (${id})`;
										})
										.join(", ")
								}
							/> */}

							<hr className="my-4" />
							<p className="text-md sm:text-lg font-semibold mb-3">
								Socials & Contacts
							</p>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<DescriptionItem
									title="Email"
									content={data?.data.business_email}
								/>
								<DescriptionItem
									title="Phone Number"
									content={`+${data?.data.contact_number}`}
								/>
								<DescriptionItem
									title="Facebook"
									content={
										<Link
											className="text-blue-500 hover:text-blue-700 underline"
											to={`http://facebook.com/${socialLinks.social_facebook}`}
											target="_blank"
											rel="noopener noreferrer">
											View on Facebook
										</Link>
									}
								/>
								<DescriptionItem
									title="Instagram"
									content={
										<Link
											className="text-blue-500 hover:text-blue-700 underline"
											to={`http://instagram.com/${socialLinks.social_instagram}`}
											target="_blank"
											rel="noopener noreferrer">
											View on Instagram
										</Link>
									}
								/>
								<DescriptionItem
									title="LinkedIn"
									content={
										<Link
											className="text-blue-500 hover:text-blue-700 underline"
											to={`http://linkedin.com/${socialLinks.social_linkedin}`}
											target="_blank"
											rel="noopener noreferrer">
											View on LinkedIn
										</Link>
									}
								/>
								<DescriptionItem
									title="Twitter"
									content={
										<Link
											className="text-blue-500 hover:text-blue-700 underline"
											to={`http://twitter.com/${socialLinks.social_twitter}`}
											target="_blank"
											rel="noopener noreferrer">
											View on Twitter
										</Link>
									}
								/>
								<DescriptionItem
									title="Youtube"
									content={
										<Link
											className="text-blue-500 hover:text-blue-700 underline"
											to={`${socialLinks.social_youtube}`}
											target="_blank"
											rel="noopener noreferrer">
											View on Youtube
										</Link>
									}
								/>
							</div>
						</div>

						<div>
							{data.data.user_id === user.id && (
								<div>
									{data.data.user_id === user.id && (
										<div className="lg:col-span-1 border-2 border-gray-200 shadow-md rounded-xl px-4">
											<div className="mt-5 mb-3">
												<p className="text-lg font-semibold mb-3">
													Add Socials Media
												</p>
											</div>

											<form
												onSubmit={handleSubmit(
													submitAddBusiness,
												)}>
												<InputCustom
													label="Facebook"
													name="social_facebook"
													placeholder="Facebook"
													preIcon={
														<FacebookOutlined className="text-blue-500" />
													}
													onChange={handleInputChange}
													register={register}
													trigger={trigger}
													error={
														errors.social_facebook
															?.message
													}
												/>

												<InputCustom
													label="Instagram"
													name="social_instagram"
													placeholder="Instagram"
													preIcon={
														<InstagramOutlined className="text-pink-500" />
													}
													register={register}
													trigger={trigger}
													error={
														errors.social_instagram
															?.message
													}
													onChange={handleInputChange}
												/>

												<InputCustom
													label="LinkedIn"
													name="social_linkedin"
													placeholder="LinkedIn"
													preIcon={
														<LinkedinOutlined className="text-blue-500" />
													}
													register={register}
													trigger={trigger}
													error={
														errors.social_linkedin
															?.message
													}
													onChange={handleInputChange}
												/>

												<InputCustom
													label="Twitter"
													name="social_twitter"
													placeholder="Twitter"
													preIcon={
														<TwitterOutlined className="text-blue-500" />
													}
													register={register}
													trigger={trigger}
													error={
														errors.social_twitter
															?.message
													}
													onChange={handleInputChange}
												/>
												<InputCustom
													label="Youtube"
													name="social_youtube"
													placeholder="Youtube"
													preIcon={
														<YoutubeOutlined className="text-blue-500" />
													}
													register={register}
													trigger={trigger}
													error={
														errors.social_youtube
															?.message
													}
													onChange={handleInputChange}
												/>
												<Button
													className="mb-5 mt-3"
													type="primary"
													size="large"
													variant="outlined"
													// onClick={handleSubmit(
													// 	submitAddBusiness,
													// )}
													style={{
														backgroundColor:
															"#440178",
													}}
													htmlType="submit">
													Save
												</Button>
											</form>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<FooterComponent />
		</>
	);
};

export default BusinessDirectoryDetailPage;
