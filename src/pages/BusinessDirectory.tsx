import React, { useEffect, useState } from "react";
import SiteNavbar from "components/layout/sitenavbar";
import { Divider } from "@mui/material";
import List from "@mui/material/List";
import { useMutation } from "react-query";
import { HTTPError } from "ky";
import { Link, useNavigate, useParams } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import FactoryIcon from "@mui/icons-material/Factory";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import BtnComponent from "components/ui/BtnComponent";
import { pageStartFrom } from "utils/consts";
import { HiLocationMarker, HiTrash, HiPencil } from "react-icons/hi";
import {
	allowedFiles,
	fileInvalid,
	filesExt,
	filesLimit,
	filesSize,
} from "utils/consts";
import {
	createBusinessDirectory,
	getBusinessDirectory,
	useBusinessDirectorys,
} from "api/services/businessdirectoryService";
import { useIndustrys } from "api/services/industryService";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	useUploadImage,
} from "api/services/user";
import {
	TBusinessDirectoryFormData,
	IUser,
	IIndustry,
	TSelectIndu,
	IBusinessDirectory,
} from "utils/datatypes";
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
	message,
	Modal,
	Radio,
	Row,
	Select,
	Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

import { BusinessCard } from "utils/consts";
import { FooterComponent } from "components/layout/Footer";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import { useAppState } from "utils/useAppState";
import { getProducts } from "api/services/productsService ";
import { getServices } from "api/services/servicesService ";
import BtnLink from "components/ui/common/BtnLink";

const { TextArea } = Input;

// Sample data for sidebar menu

const iconComponents = {
	FactoryIcon: <FactoryIcon />,
	VideoSettingsIcon: <VideoSettingsIcon />,
};

type MenuItem = {
	name: string;
	count?: number; // `count` is optional, since it's only present for industries
};

type MenuSection = {
	id: "industries" | "products" | "services" | "locations"; // Restricting id to specific values
	title: string;
	icon: keyof typeof iconComponents;
	items: MenuItem[];
};

const BusinessDirectory = () => {
	const [{ user }, setAppState] = useAppState();
	const navigate = useNavigate();
	// const [openSections, setOpenSections] = useState({
	// 	industries: true,
	// 	products: true,
	// 	services: true,
	// 	locations: true,
	// });
	const [addBusinessForm] = Form.useForm();
	const currentYear = new Date().getFullYear();
	const minYear = 1900;
	const [industryList, setIndustryList] = useState<TSelectIndu[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [selectedCard, setSelectedCard] = useState<IBusinessDirectory | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [businessdirectorys, setBusinessdirectorys] = useState<
		IBusinessDirectory[]
	>([]);
	const [allBusinessdirectorys, setAllBusinessdirectorys] = useState<
		IBusinessDirectory[]
	>([]);

	const [selectedIndustry, setSelectedIndustry] = useState<string[]>([]);
	console.log("selectedIndustry", selectedIndustry);
	const [selectedProduct, setSelectedProduct] = useState<string[]>([]);
	const [selectedService, setSelectedService] = useState<string[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<string[]>([]);

	const {
		isLoading,
		data: businessdirectoryList,
		refetch: fetchBusinessdirectoryList,
		isFetching: isFetchingBusinessdirectoryList,
	} = useBusinessDirectorys({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,
	}) || [];
	console.log("businessdirectoryList", businessdirectoryList);
	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchBusinessdirectoryList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchBusinessdirectoryList();
	}, [pageNumber]);
	useEffect(() => {
		if (businessdirectoryList) {
			if (pageNumber == 1) {
				setBusinessdirectorys([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setBusinessdirectorys(prevUsers => [
				...prevUsers,
				...businessdirectoryList.data,
			]);
			setAllBusinessdirectorys(businessdirectoryList.total_data);
			setTotalRecords(businessdirectoryList.total_records);
			setCurrentRecords(
				prevCurrentRecords =>
					prevCurrentRecords + businessdirectoryList.data.length,
			);
		} else {
			setBusinessdirectorys([]);
			setAllBusinessdirectorys([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [businessdirectoryList]);

	const { data: servicesData, refetch: fetchServiceData } = getServices({
		enabled: false,
	});
	const { data: productsData, refetch: fetchProductData } = getProducts({
		enabled: false,
	});
	const {
		data: industries,
		refetch: fetchindustryListData,
		isFetching: isFetchingIndustryListData,
	} = useIndustrys({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];

	useEffect(() => {
		fetchServiceData();
		fetchProductData();
		fetchindustryListData();
		return () => {
			return;
		};
	}, []);

	const [menuData, setMenuData] = useState<MenuSection[]>([]);

	useEffect(() => {
		if (industries) {
			const industriesList = industries.data.map((item: IIndustry) => {
				return { label: item.industry_name, value: item.id };
			}) as TSelectIndu[];
			setIndustryList([...industriesList]);
		} else {
			setIndustryList([]);
		}
	}, [industries]);

	useEffect(() => {
		// Ensure the data is an array before calling .map()
		if (
			Array.isArray(industries?.data) && // Ensure industries.data is an array
			Array.isArray(productsData?.data) && // Ensure productsData.data is an array
			Array.isArray(servicesData?.data) && // Ensure servicesData.data is an array
			Array.isArray(businessdirectoryList?.data) // Ensure businessdirectoryList.data is an array
		) {
			// Extract unique locations from businessdirectoryList
			const locations = [
				...new Set(
					businessdirectoryList.data.map(card => card.location),
				),
			]; // Create an array of unique locations

			setMenuData([
				{
					id: "industries",
					title: "Industries",
					icon: "FactoryIcon",
					items: industries?.data.map(industry => ({
						name: industry.industry_name,
					})),
				},
				{
					id: "products",
					title: "Products",
					icon: "FactoryIcon",
					items: productsData?.data.map(product => ({
						name: product.product_name, // Use product_name instead of name
					})),
				},
				{
					id: "services",
					title: "Services",
					icon: "VideoSettingsIcon",
					items: servicesData?.data.map(service => ({
						name: service.service_name, // Use service_name instead of name
					})),
				},
				{
					id: "locations",
					title: "Locations",
					icon: "FactoryIcon",
					items: locations.map(location => ({
						name: location,
					})),
				},
			]);
		} else {
			console.error("Fetched data is not in the expected format.");
		}
	}, [industries, productsData, servicesData, businessdirectoryList]);

	const [openSections, setOpenSections] = useState({
		industries: true,
		products: true,
		services: true,
		locations: true,
	});

	const handleToggle = (id: keyof typeof openSections) => {
		// Specify the type here
		setOpenSections(prevState => ({
			...prevState,
			[id]: !prevState[id],
		}));
	};

	// const handleItemToggle = (
	// 	sectionId: keyof typeof openSections,
	// 	itemName: string,
	// ) => {
	// 	// Depending on the section, toggle the selected item
	// 	if (sectionId === "industries") {
	// 		setSelectedIndustry(prevState =>
	// 			prevState === itemName ? null : itemName,
	// 		); // Toggle between selected and null
	// 	} else if (sectionId === "products") {
	// 		setSelectedProduct(prevState =>
	// 			prevState === itemName ? null : itemName,
	// 		); // Toggle between selected and null
	// 	} else if (sectionId === "services") {
	// 		setSelectedService(prevState =>
	// 			prevState === itemName ? null : itemName,
	// 		); // Toggle between selected and null
	// 	} else if (sectionId === "locations") {
	// 		setSelectedLocation(prevState =>
	// 			prevState === itemName ? null : itemName,
	// 		); // Toggle between selected and null
	// 	}
	// };

	const handleItemToggle = (
		sectionId: keyof typeof openSections,
		itemName: string,
	) => {
		if (sectionId === "industries") {
			setSelectedIndustry(
				prevState =>
					prevState.includes(itemName)
						? prevState.filter(item => item !== itemName) // Remove if already selected
						: [...prevState, itemName], // Add if not selected
			);
		} else if (sectionId === "products") {
			setSelectedProduct(
				prevState =>
					prevState.includes(itemName)
						? prevState.filter(item => item !== itemName) // Remove if already selected
						: [...prevState, itemName], // Add if not selected
			);
		} else if (sectionId === "services") {
			setSelectedService(
				prevState =>
					prevState.includes(itemName)
						? prevState.filter(item => item !== itemName) // Remove if already selected
						: [...prevState, itemName], // Add if not selected
			);
		} else if (sectionId === "locations") {
			setSelectedLocation(
				prevState =>
					prevState.includes(itemName)
						? prevState.filter(item => item !== itemName) // Remove if already selected
						: [...prevState, itemName], // Add if not selected
			);
		}
	};

	const { mutate, isError, error } = useMutation(createBusinessDirectory, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Business Directory Added Successfully",
				id: "business_directory_user_success",
			});
			navigate("/business-directory");
			fetchBusinessdirectoryList();
			setOpen(false);
			setSelectedCard(null); // Reset selected card on close
			addBusinessForm.resetFields(); // Reset form if adding a new business
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "business_directory_user" });
		},
	});

	const submitAddBusiness = (data: TBusinessDirectoryFormData) => {
		const userString = localStorage.getItem("user");

		if (userString !== null) {
			const items = JSON.parse(userString);
			data.user_id = Number(items?.id);
		}
		if (selectedCard && selectedCard.id) {
			data.id = selectedCard.id; // Add id if you're updating
		}

		data.status = "active";

		const imageFile = (
			document.querySelector('input[type="file"]') as HTMLInputElement
		)?.files?.[0];

		if (imageFile) {
			const formdata = new FormData();
			formdata.append("type", "business_directory");
			formdata.append("file", imageFile);

			useUploadImage({ data: formdata })
				.then((response: any) => {
					//setValue("image", data.files[0].filename);
					if (response.message == "Upload Success") {
						// Update data with the uploaded image file name
						data.business_logo = response.files[0].filename;
					} else {
						console.error("File upload failed:", response.error);
						return; // Stop further processing if upload fails
					}

					// Call mutate once the file has been uploaded

					mutate(data);
				})
				.catch(error => {
					console.error("Error during file upload:", error);
				});
		} else {
			// If no image is uploaded, just call mutate

			mutate(data);
		}
	};

	const showDrawer = (card = null) => {
		setSelectedCard(card); // Set selected card data
		setOpen(true);
		if (card) {
			addBusinessForm.setFieldsValue(card); // Populate form with card data for editing
		} else {
			addBusinessForm.resetFields(); // Reset form if adding a new business
		}
	};

	const onClose = () => {
		setOpen(false);
		setSelectedCard(null); // Reset selected card on close
	};

	const showDeleteConfirm = () => {
		Modal.confirm({
			title: "Are you sure you want to delete this business listing?",
			content: "This action cannot be undone.",
			okText: "Yes, Delete",
			okType: "danger",
			cancelText: "Cancel",
			onOk: () => DeletedBusiness(),
		});
	};

	const DeletedBusiness = () => {
		message.success("Deleted Successfully");
		onClose();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const ext: string | null = (
				file.name.split(".").pop() || ""
			).toLowerCase();
			if (filesExt["image"].indexOf(ext) < 0) {
				setErrorMessage(fileInvalid["image"]);

				return true;
			}

			if (file?.size > filesSize["image"]) {
				setErrorMessage(
					`File size limit: The image you tried uploading exceeds the maximum file size (${filesLimit["image"]}) `,
				);
			}
		}
	};
	// const filteredCards = businessdirectorys.filter(
	// 	card =>
	// 		card.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 		(card.business_name &&
	// 			card.business_name
	// 				.toLowerCase()
	// 				.includes(searchTerm.toLowerCase())) ||
	// 		(selectedIndustry &&
	// 			card.industry?.industry_name
	// 				.toLowerCase()
	// 				.includes(searchTerm.toLowerCase())),
	// );
	console.log("selectedProduct", selectedProduct);
	console.log("selectedService", selectedService);
	// const filteredCards = businessdirectorys.filter(card => {
	// 	const isIndustryMatch = card.industry?.industry_name
	// 		.toLowerCase()
	// 		.includes(searchTerm.toLowerCase());
	// 	const isSearchTermMatch =
	// 		card.business_name &&
	// 		card.business_name.toLowerCase().includes(searchTerm.toLowerCase());

	// 	// If `selectedIndustry` is defined, check if the `industry_name` matches
	// 	const isSelectedIndustryMatch = selectedIndustry
	// 		? card.industry?.industry_name
	// 				.toLowerCase()
	// 				.includes(selectedIndustry.toLowerCase())
	// 		: true; // If no `selectedIndustry`, always return true

	// 	const isLocationMatch = selectedLocation
	// 		? card.location
	// 				.toLowerCase()
	// 				.includes(selectedLocation.toLowerCase())
	// 		: true;

	// 	// Check if the products match the searchTerm
	// 	const isProductsMatch = selectedProduct
	// 		? card.products &&
	// 		  card.products
	// 				.toLowerCase()
	// 				.split(",")
	// 				.some(product =>
	// 					product
	// 						.trim()
	// 						.toLowerCase()
	// 						.includes(selectedProduct.toLowerCase()),
	// 				)
	// 		: true;

	// 	// Check if the services match the searchTerm
	// 	const isServicesMatch = selectedService
	// 		? card.services &&
	// 		  card.services
	// 				.toLowerCase()
	// 				.split(",")
	// 				.some(service =>
	// 					service
	// 						.trim()
	// 						.toLowerCase()
	// 						.includes(selectedService.toLowerCase()),
	// 				)
	// 		: true;

	// 	return (
	// 		(isIndustryMatch || isSearchTermMatch) &&
	// 		isSelectedIndustryMatch &&
	// 		isProductsMatch &&
	// 		isServicesMatch &&
	// 		isLocationMatch
	// 	);
	// });

	// Render the filtered cards based on the selected filters
	const filteredCards = businessdirectorys.filter(card => {
		const isSearchTermMatch =
			card.business_name &&
			card.business_name.toLowerCase().includes(searchTerm.toLowerCase());
		const isIndustryMatch =
			selectedIndustry.length === 0 ||
			selectedIndustry.some(industry =>
				card.industry?.industry_name
					.toLowerCase()
					.includes(industry.toLowerCase()),
			);
		const isProductMatch =
			selectedProduct.length === 0 ||
			selectedProduct.some(product =>
				card.products?.toLowerCase().includes(product.toLowerCase()),
			);
		const isServiceMatch =
			selectedService.length === 0 ||
			selectedService.some(service =>
				card.services?.toLowerCase().includes(service.toLowerCase()),
			);
		const isLocationMatch =
			selectedLocation.length === 0 ||
			selectedLocation.some(location =>
				card.location.toLowerCase().includes(location.toLowerCase()),
			);

		return (
			isIndustryMatch &&
			isProductMatch &&
			isServiceMatch &&
			isLocationMatch &&
			isSearchTermMatch
		);
	});

	console.log("filteredCards", filteredCards);
	/* const currentUserData = JSON.parse(localStorage.getItem("user"));
	const currentUserId = currentUserData ? currentUserData.id : null;
	 */
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
							List your Business for others to find, or search for
							one in the Directory
						</h1>

						{/* Button */}
						<div className="flex justify-center lg:justify-end">
							<BtnLink onClick={() => showDrawer()}>
								Add a Business Listing
							</BtnLink>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 mt-6 gap-6">
						{/* Sidebar Section */}
						<div className="lg:col-span-1 shadow-md hover:animate-jump rounded-xl">
							<List
								sx={{
									width: "100%",
									bgcolor: "background.paper",
									position: "sticky",
									top: 0,
								}}
								component="nav"
								aria-labelledby="nested-list-subheader">
								{/* {menuData.map(section => (
									<React.Fragment key={section.id}>
										<ListItemButton
											onClick={() =>
												handleToggle(section.id)
											}>
											<ListItemIcon>
												{iconComponents[section.icon]}
											</ListItemIcon>
											<ListItemText
												primary={section.title}
											/>
											{openSections[section.id] ? (
												<ExpandLess />
											) : (
												<ExpandMore />
											)}
										</ListItemButton>
										<Divider />
										<Collapse
											style={{
												backgroundColor: "#f4f4f4",
											}}
											in={openSections[section.id]}
											timeout="auto"
											unmountOnExit>
											<List
												component="div"
												disablePadding>
												{section.items.map(
													(item, idx) => (
														<ListItemButton
															sx={{
																pl: 4,
																backgroundColor:
																	section.id ===
																	"industries"
																		? selectedIndustry ===
																		  item.name
																			? "#e0f7fa" // Highlight color if selected
																			: "transparent"
																		: section.id ===
																		  "products"
																		? selectedProduct ===
																		  item.name
																			? "#e0f7fa" // Highlight color if selected
																			: "transparent"
																		: section.id ===
																		  "services"
																		? selectedService ===
																		  item.name
																			? "#e0f7fa" // Highlight color if selected
																			: "transparent"
																		: section.id ===
																		  "locations"
																		? selectedLocation ===
																		  item.name
																			? "#e0f7fa" // Highlight color if selected
																			: "transparent"
																		: "transparent",
															}}
															key={idx}
															onClick={() =>
																handleItemToggle(
																	section.id,
																	item.name,
																)
															}>
															<ListItemText
																primary={
																	item.count
																		? `${item.name} (${item.count})`
																		: item.name
																}
															/>
														</ListItemButton>
													),
												)}
											</List>
										</Collapse>
									</React.Fragment>
								))} */}

								{menuData.map(section => (
									<React.Fragment key={section.id}>
										<ListItemButton
											onClick={() =>
												handleToggle(section.id)
											}>
											<ListItemIcon>
												{iconComponents[section.icon]}
											</ListItemIcon>
											<ListItemText
												primary={section.title}
											/>
											{openSections[section.id] ? (
												<ExpandLess />
											) : (
												<ExpandMore />
											)}
										</ListItemButton>
										<Divider />
										<Collapse
											style={{
												backgroundColor: "#f4f4f4",
											}}
											in={openSections[section.id]}
											timeout="auto"
											unmountOnExit>
											<List
												component="div"
												disablePadding>
												{section.items.map(
													(item, idx) => (
														<ListItemButton
															sx={{
																pl: 4,
																backgroundColor:
																	section.id ===
																	"industries"
																		? selectedIndustry.includes(
																				item.name,
																		  )
																			? "#e0f7fa"
																			: "transparent"
																		: section.id ===
																		  "products"
																		? selectedProduct.includes(
																				item.name,
																		  )
																			? "#e0f7fa"
																			: "transparent"
																		: section.id ===
																		  "services"
																		? selectedService.includes(
																				item.name,
																		  )
																			? "#e0f7fa"
																			: "transparent"
																		: section.id ===
																		  "locations"
																		? selectedLocation.includes(
																				item.name,
																		  )
																			? "#e0f7fa"
																			: "transparent"
																		: "transparent",
															}}
															key={idx}
															onClick={() =>
																handleItemToggle(
																	section.id,
																	item.name,
																)
															}>
															<ListItemText
																primary={
																	item.count
																		? `${item.name} (${item.count})`
																		: item.name
																}
															/>
														</ListItemButton>
													),
												)}
											</List>
										</Collapse>
									</React.Fragment>
								))}
							</List>
						</div>

						{/* Scrollable Business Card Section */}
						<div className="lg:col-span-3 h-[600px] lg:h-auto overflow-y-auto">
							<div className="bg-gray-100 rounded-xl p-4 mb-4">
								<Input
									placeholder="Search for a business by location"
									className="w-full focus:outline-none border-1 border-gray-300 rounded-md"
									value={searchTerm}
									onChange={e =>
										setSearchTerm(e.target.value)
									}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
								{filteredCards.map(card => (
									<div
										key={card.id}
										onClick={() =>
											navigate(
												`/business-directory/${card.id}`,
											)
										}>
										<div className="max-w-sm rounded-2xl overflow-hidden border-2 border-gray-200 hover:bg-neutral-100 flex flex-col hover:cursor-pointer  ">
											<div className="px-6 pt-7 pb-7 flex-grow">
												<div className="flex items-center justify-between">
													<div className="font-bold text-l mb-3 text-black">
														{card.business_name}
													</div>
													<div className="flex items-center justify-between">
														{card.user_id ===
															user?.id && (
															<div className="text-gray-700 text-l mt-1">
																<EditOutlined
																	onClick={e => {
																		e.stopPropagation(); // Prevents card navigation
																		showDrawer(
																			card as any,
																		);
																	}}
																/>{" "}
															</div>
														)}
													</div>
												</div>
												<p className="text-gray-700 text-l mt-1">
													{card.description}
												</p>

												<p className="flex items-center text-gray-700 text-l mt-1">
													<HiLocationMarker className="text-blue-700 text-xl mt-1 mr-1" />
													{card.location}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Drawer
				title={
					<h1 className="md:text-2xl text-xl font-bold">
						{selectedCard ? "Edit" : "Add"}
					</h1>
				}
				width={900}
				onClose={onClose}
				open={open}
				styles={{
					body: {
						paddingBottom: 80,
					},
				}}
				extra={
					<Space>
						<BtnLink onClick={onClose}>Cancel</BtnLink>
						
					</Space>
				}>
				<Form
					form={addBusinessForm as any}
					layout="vertical"
					name="add-business"
					onFinish={submitAddBusiness}>
					<Row gutter={16}>
						<Col xs={24} sm={8}>
							<Form.Item
								name="business_name"
								label={
									<span className="text-l font-semibold">
										Business Name
									</span>
								}
								rules={[
									{
										required: true,
										message: "Business Name is required",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Business Name"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={8}>
							<Form.Item
								name="business_website"
								label={
									<span className="text-l font-semibold">
										Website
									</span>
								}
								rules={[
									{
										required: true,
										message: "Website is required",
									},
									{
										pattern:
											/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/, // Regex for valid URL
										message:
											"Please enter a valid website URL",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Website URL"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={8}>
							<Form.Item
								name="contact_number"
								label={
									<span className="text-l font-semibold">
										Contact Number
									</span>
								}
								rules={[
									{
										required: true,
										pattern: /^\d{10}$/,
										message: "Invalid contact number",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Contact Number"
									maxLength={10}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={8}>
							<Form.Item
								name="number_of_employees"
								label={
									<span className="text-l font-semibold">
										Number of Employees
									</span>
								}
								rules={[
									{
										required: true,
										pattern: /^\d+$/,
										message: "Invalid Number of Employees",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Number of Employees"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={8}>
							<Form.Item
								name="industry_id"
								label={
									<span className="text-l font-semibold">
										Industry
									</span>
								}
								rules={[
									{
										required: true,
										message: "Industry is required",
									},
								]}>
								<Select
									size="large"
									options={industryList}
									placeholder="Select Industry"
									className="rounded-md border-1 border-gray-300"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={8}>
							<Form.Item
								name="founded"
								label={
									<span className="text-l font-semibold">
										Founded
									</span>
								}
								rules={[
									{
										required: true,
										pattern: /^\d{4}$/,
										message: "Invalid founded",
									},
									{
										validator: (_, value) => {
											if (!value)
												return Promise.resolve();
											const year = parseInt(value, 10);
											if (
												year >= minYear &&
												year <= currentYear
											) {
												return Promise.resolve();
											} else {
												return Promise.reject(
													`Year must be between ${minYear} and ${currentYear}`,
												);
											}
										},
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter founded"
									maxLength={4}
									minLength={4}
								/>
							</Form.Item>
						</Col>

						<Col xs={24} sm={8}>
							<Form.Item
								name="location"
								label={
									<span className="text-l font-semibold">
										Location
									</span>
								}
								rules={[
									{
										required: true,
										message: "Location is required",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Location"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={8}>
							<Form.Item
								name="business_email"
								label={
									<span className="text-l font-semibold">
										Email
									</span>
								}
								rules={[
									{
										required: true,
										type: "email",
										pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Invalid email address",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Email"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24}>
							<Form.Item
								name="description"
								label={
									<span className="text-l font-semibold">
										Description
									</span>
								}
								rules={[
									{
										required: true,
										message: "Description is required",
									},
								]}>
								<TextArea
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Description (max 300 characters)"
									rows={3}
									maxLength={300}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								name="is_member_association"
								label={
									<span className="text-l font-semibold">
										Are you a member of the Alumni
										Association?
									</span>
								}
								rules={[
									{
										required: true,
										message: "Please select an option",
									},
								]}>
								<Radio.Group
									value={
										(selectedCard &&
											selectedCard.is_member_association) ||
										0
									}>
									<Radio value={1}>Yes</Radio>
									<Radio value={0}>No</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								name="business_logo"
								label={
									<span className="text-l font-semibold">
										Upload Logo
									</span>
								}>
								<Input
									id="business_logo"
									type="file"
									className="mt-1 block w-full text-sm text-gray-500"
									accept={`${allowedFiles["image"]}`}
									onChange={handleImageChange}
								/>
								<span className="text-xs text-red-500">
									{errorMessage && (
										<>
											<span>{errorMessage}</span>
										</>
									)}
									&nbsp;
								</span>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item>
								<Button
									type="primary"
									size="large"
									variant="outlined"
									style={{ backgroundColor: "#440178" }}
									htmlType="submit">
									{selectedCard ? "Update" : "Add"}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Drawer>
			<FooterComponent />
		</>
	);
};

export default BusinessDirectory;
