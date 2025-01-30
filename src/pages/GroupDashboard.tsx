import React,{ useEffect, useState } from "react";
import { Avatar, Card, Image, List, Tabs } from "antd";
import { useMutation } from "react-query";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { HTTPError } from "ky";
import SiteNavbar from "components/layout/sitenavbar";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import BtnComponent from "components/ui/BtnComponent";
import Select from "components/ui/common/Select";
import NewsItem from "components/ui/NewsItem";
import { INews } from "utils/datatypes";
import { useNavigate, useParams } from "react-router-dom";
import { FooterComponent } from "components/layout/Footer";
import { useUserGroupData } from "api/services/user";
import { TFeedFormData, IUser, TSelect, IFeed, ICategory } from "utils/datatypes";
import { Link } from "react-router-dom";
import { pageStartFrom, fileInvalid,
	filesExt,
	filesLimit,
	filesSize, } from "utils/consts";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	useUploadImage,
} from "api/services/user";
import { useNewss } from "api/services/newsService";
import { useEvents } from "api/services/eventService";
import { useCategorys } from "api/services/categoryService";
import { createFeed, getFeed, useFeeds } from "api/services/feedService";
import AlumniDashboardCard from "components/ui/AlumniDashboardCard";
import { getGroup } from "api/services/groupService";
import { Button } from "flowbite-react";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import MyUploadAdapter from "../components/MyUploadAdapter";
import axios, { AxiosResponse } from "axios";
import { Upload, Button as AntdButton } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";

function MyCustomUploadAdapterPlugin(editor: any) {
	editor.plugins.get("FileRepository").createUploadAdapter = (
		loader: any,
	) => {
		return new MyUploadAdapter(loader); // Create an instance of MyUploadAdapter
	};
}

import { UploadOutlined } from "@ant-design/icons";
import Toast from "components/layout/toast";

const { Meta } = Card;
const GroupDashboard = () => {

	const { id } = useParams() as {
		id: string;
	};

	const EmailSchema = yup.object().shape({
		description: yup
			.string()
			.required("Please Enter Content")
			.min(10, "Content must be at least 10 characters"),
	});

	const [editorData, setEditorData] = useState("");

	const [categorys, setCategorys] = useState<TSelect[]>([]);

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [myuser, setMyUser] = useState<IUser | null>();

	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });
	const [activeStatus, setActiveStatus] = useState("active");
	const [searchText, setSearchText] = useState("");
	const [users, setUsers] = useState<IUser[]>([]);
	const [feeds, setFeeds] = useState<IFeed[]>([]);

	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

	const [feedImage, setFeedImage] = useState<File | null>(null);

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	let {		
		data: groupDetails,
		refetch: fetchGroupDetails,
		isFetching: isFetchingGroupDetails,
		remove,
	} = getGroup({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchGroupDetails();
		} else {
			groupDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);

	const {
		data: categoryList,
		refetch: fetchCategoryList,
		isFetching: isFetchingCategoryList,
	} = useCategorys({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,
	}) || [];
	useEffect(() => {
		if (categoryList) {
			const categorysList = categoryList.data.map((item: ICategory) => {
				return { text: item.category_name, value: item.id };
			}) as TSelect[];
			setCategorys([
				{ text: "Post Category", value: 0 },
				...categorysList,
			]);
		} else {
			setCategorys([{ text: "Post Category", value: 0 }]);
		}
	}, [categoryList]);

	const {		
		data: userList,
		refetch: fetchUserList,
		isFetching: isFetchingUserList,
	} = useUserGroupData({
		enabled: true,
		filter_status: activeStatus,
		page_number: pageNumber,
		page_size: pageSize.value,
		group_id: Number(id),
	}) || [];

	


	const {
		data: newsList,
		refetch: fetchNewsList,
		isFetching: isFetchingNewsList,
	} = useNewss({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,
		group_id: Number(id),
	}) || [];

	const {
		data: eventList,
		refetch: fetchEventList,
		isFetching: isFetchingEventList,
	} = useEvents({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		filter_category: selectedCategories,
		filter_date: selectedDateFilter,
		page_number: pageNumber,
		page_size: pageSize.value,
		group_id: Number(id),
	}) || [];

	const {
		data: feedList,
		refetch: fetchFeedList,
		isFetching: isFetchingFeedList,
	} = useFeeds({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,		
		page_number: pageNumber,
		page_size: pageSize.value,
		group_id: Number(id),
	}) || [];


	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchUserList();
			fetchNewsList();
			fetchEventList();
			fetchFeedList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchUserList();
		fetchNewsList();
		fetchEventList();
		fetchFeedList();
	}, [pageNumber]);


	

	useEffect(() => {
		if (userList) {
			if (pageNumber == 1) {
				setUsers([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setUsers(prevUsers => [...prevUsers, ...userList.data]);
			setTotalRecords(userList.total_records);
			setCurrentRecords(
				prevCurrentRecords => prevCurrentRecords + userList.data.length,
			);
		} else {
			setUsers([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [userList]);

	useEffect(() => {
		if (feedList) {
			if (pageNumber == 1) {
				setFeeds([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setFeeds(prevUsers => [...prevUsers, ...feedList.data]);
			setTotalRecords(feedList.total_records);
			setCurrentRecords(
				prevCurrentRecords => prevCurrentRecords + feedList.data.length,
			);
		} else {
			setFeeds([]);			
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [feedList]);

	console.log('users',users);
	console.log('feedList',feedList);


	const {
		trigger,
		register,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<TFeedFormData>({
		resolver: yupResolver(EmailSchema),
	});

	const [imageData, setImageData] = useState<string | null>(null);

	const parseEditorContent = (content: string) => {
		// No need to manipulate the content anymore. Just pass it as it is.
		return content; // Return the raw HTML (including <img> tags)
	};

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [errorFileMessage, setErrorFileMessage] = useState<string | null>(null);

	
	const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
		const latestFile = newFileList[newFileList.length - 1];

          console.log("Latest File:", latestFile);
      // Access the actual file object
      const file = latestFile.originFileObj;
		
		if (file) {
			const ext: string | null = (
				file.name.split(".").pop() || ""
			).toLowerCase();
			
			setErrorFileMessage("");
			setValue("feed_image", "");
			setFeedImage(null);
		
			if (filesExt["image"].indexOf(ext) < 0) {
				setErrorFileMessage(fileInvalid["image"]);
				return true;
			} else if (file.size as number > filesSize["image"]) {
				setErrorFileMessage(
					`File size limit: The image you tried uploading exceeds the maximum file size (${filesLimit["image"]}) `,
				);
			} else {
				setFeedImage(file);
				setFileList(newFileList);
			}
		}
		
	};

	
	const { mutate, isLoading, isError, isSuccess, error } = useMutation(
		createFeed,
		{
			onSuccess: async (res: any) => {
				SuccessToastMessage({
					title: "Feed Posted Successfully",
					id: "feed_user_success",
				});
				reset(); // Reset the form values (React Hook Form)
				setEditorData(""); // Reset CKEditor content
				setFileList([]);
				fetchFeedList();
				//navigate("/dashboard");
			},
			onError: async (e: HTTPError) => {
				ErrorToastMessage({ error: e, id: "feed_user" });
			},
		},
	);

	const saveProfileImage = async () => {
		try {
			let uploadConfig: AxiosResponse | null = null;
			const selectedFile = (feedImage as File) || "";
			console.log("selectedFile", selectedFile);
			if (selectedFile) {
				const response = await axios.get(
					import.meta.env.VITE_BASE_URL +
						"api/v1/upload?type=feed-image&filename=" +
						selectedFile.name,
				);
				if (response.status === 200) {
					console.log("response", response);
					uploadConfig = response.data;
					console.log(
						"uploadConfig?.data?.url",
						uploadConfig?.data?.url,
					);
					const upload = await axios.put(
						uploadConfig?.data?.url,
						selectedFile,
						{
							headers: {
								"Content-Type": selectedFile?.type || "",
							},
							onUploadProgress: progressEvent => {
								const percentCompleted = Math.round(
									(progressEvent.loaded * 100) /
										(progressEvent.total || 1),
								);
								// onProgress(percentCompleted);
								console.log(
									"percentCompleted",
									percentCompleted,
								);
							},
						},
					);
					console.log("uploadConfig", uploadConfig);
					setValue("feed_image", uploadConfig?.data?.key);
				}
			}
		} catch (error) {
			return;
		}
	};

	const onSubmit = async (data: TFeedFormData) => {

		await saveProfileImage();



		// Prepare the payload to submit
		const payload: TFeedFormData = {



			
			user_id: Number(myuser?.id),
			status: "active",
			description: data.description, // Store the HTML content with updated image URLs
			category_id: data.category_id,
			group_id: Number(id),
			feed_image: getValues("feed_image") || "",
		};

		try {
			mutate(payload); // Submit the form with the updated description
		} catch (error) {
			console.error("Error during submission:", error);
		}
	};

	const errorMessage = () => {
		if (isError) {
			if (error instanceof Error) {
				return error.message; // Safely access the error message
			} else {
				return "An unknown error occurred.";
			}
		}
		return null;
	};

	const onPreview = async (file: UploadFile) => {
		let src = file.url as string;
		if (!src) {
			src = await new Promise(resolve => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj as File);
				reader.onload = () => resolve(reader.result as string);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div>
				<div className="w-full">
					<div className="w-11/12 lg:w-10/12 mx-auto py-6 px-4 relative">
						<div className="flex flex-col items-center lg:flex-row lg:justify-between mb-4">
							<h1 className="text-2xl sm:text-3xl text-black font-bold mb-4 lg:mb-0 text-center">
								{groupDetails?.data.group_name}
							</h1>
						</div>
						<div>
							<Tabs defaultActiveKey="1">
								<Tabs.TabPane
									tab={<span>Dashboard</span>}
									key="1">
									<div className="custom-editor-border">
									<form onSubmit={handleSubmit(onSubmit)}>
						<div className="custom-editor-main min-h-[200px] border-2 border-[#440178] rounded-lg p-2.5 shadow-lg">
						<CKEditor
								editor={ClassicEditor as any}
								data={editorData}
								config={{
									extraPlugins: [MyCustomUploadAdapterPlugin],
									placeholder:
										"Type here to start your discussion... Feel free to share your thoughts and ideas!", // Placeholder text
									toolbar: [
										"heading",
										"|",
										"bold",
										"italic",
										"link",
										"bulletedList",
										"numberedList",
										"blockQuote",
										"|",
										"insertTable",
										// "mediaEmbed",
										"undo",
										"redo",
										// "imageUpload",
									],
								}}
								onChange={async (event, editor) => {
									const data = editor.getData();
									const textContent =
										parseEditorContent(data); // No need to strip out images now
									setEditorData(data); // Save full HTML content
									setValue("description", textContent); // Set description to full content
								}}
							/>
							<input type="hidden" {...register("description")} />

							{/* Display error message */}
							{errors.description && (
								<span className="text-xs text-red-500">
									{errors.description.message}
								</span>
							)}
						</div>
						<div className="mt-4">
							<FlexStartEnd>
								<div className="space-x-4 flex">
									<ImgCrop
										rotationSlider
										modalOk="Upload"
										modalCancel="Cancel"
										modalProps={{
											className: "custom-upload-modal", // Add a custom class to the modal
										}}>
										<Upload
											className="bg-white border-2 rounded-lg shadow-lg"
											action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
											fileList={fileList}
											onChange={onChange}
											onPreview={onPreview}
											beforeUpload={() => false}>
											{fileList.length < 1 && (
												<AntdButton
													className="bg-transparent mt-1 border-none"
													icon={<UploadOutlined />}>
													Click to Upload
												</AntdButton>
											)}
										</Upload>
									</ImgCrop>
									<Select
										name={"category_id"}
										items={categorys}
										register={register}
										className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
									
								</div>
							</FlexStartEnd>
						</div>
						<div className="mt-4">
							<BtnComponent
								justify="justify-start"
								type="submit"
								value={isLoading ? "Submitting..." : "Submit"}
								disabled={isLoading}
							/>
						</div>

						{isError && (
							<div className="error-message">
								Error: {errorMessage()}
							</div>
						)}
						{isSuccess && (
							<Toast
								title="Feed Posted Successfully"
								id="feed_user_success"
								position="top-center"
							/>
						)}
					</form>
									</div>
									<div className="mt-4">
									{feeds.length > 0 ? (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{feeds.map(feed => (
											<AlumniDashboardCard feed={feed} fetchFeedList={fetchFeedList} key={feed.id} />
										))}
						
					</div>
					) : (
						<div className="text-center text-gray-500">
							No Feeds found.
						</div>
					)}
					<div className="flex justify-center mt-10">
									{currentRecords < totalRecords && (
										<Button
											className="text-center"
											onClick={() =>
												setPageNumber(pageNumber + 1)
											}
											outline
											style={{
												backgroundColor: "#440178",
											}}>
											{isLoading
												? "Loading..."
												: "Load More"}
										</Button>
									)}
								</div>
									</div>
								</Tabs.TabPane>
								<Tabs.TabPane
									tab={<span>Newsroom</span>}
									key="2">
									<div className="grid grid-cols-1 md:grid-cols-1 gap-6">
										{newsList?.data.map((INews, index) => (
											<NewsItem
												key={index}
												news={{
													...INews,
													createdAt: new Date(
														INews.createdAt,
													).toISOString(),
													updated_on: new Date(
														INews.updated_on,
													),
												}}
											/>
										))}
									</div>
								</Tabs.TabPane>
								<Tabs.TabPane tab={<span>Events</span>} key="3">
									<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
										{eventList?.data.map((event, index) => (
											<Card
												key={index}
												hoverable
												cover={
													<img
														alt="example"
														src={
															import.meta.env
																.VITE_BASE_URL +
															"upload/event/" +
															event.event_image
														}
													/>
												}>
												<Meta
													title={event.event_title}
													description={
														event.description
													}
												/>
												<div className="flex justify-center">
													<Link
														className="mt-3 text-center text-black px-4 py-2 border border-gray-300 rounded-md w-full"
														to={`/events/${event.id}`}>
														Learn More
													</Link>
												</div>
											</Card>
										))}
									</div>
								</Tabs.TabPane>
								<Tabs.TabPane
									tab={<span>Members</span>}
									key="4">
									<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
										<>
										{users.map((member: any, index) => (
										<Card
												key={index}
												hoverable
												cover={
													<img
														alt="example"
														src={
															member?.image
																? import.meta.env.VITE_BASE_URL +
																  "upload/profile/" +
																  member?.image
																: "/assets/images/icon-user.webp"
														}
													/>
												}>
												<Meta
													title={member.first_name+' '+member.last_name}
													description={
														<>
															
															{member?.educationField && (
																<p className="text-sm text-gray-500 ">
																	{member?.educationField?.join(" | ")}
																</p>
															)}
																
														</>
													}
												/>
											</Card>
										))}
										</>
									</div>
								</Tabs.TabPane>
								
							</Tabs>
						</div>
					</div>
				</div>
			</div>
			<FooterComponent />
		</>
	);
};

export default GroupDashboard;
