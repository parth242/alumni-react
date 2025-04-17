import SiteNavbar from "components/layout/sitenavbar";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import BtnComponent from "components/ui/BtnComponent";
import { HTTPError } from "ky";
import axios, { AxiosResponse } from "axios";
import {
	pageStartFrom,
	patterns,
	allowedFiles,
	fileInvalid,
	filesExt,
	filesLimit,
	filesSize,
} from "utils/consts";
import { Button } from "flowbite-react";
import { Avatar, Checkbox, Divider, List } from "antd";

import Select from "components/ui/common/Select";
import { useGroups } from "api/services/groupService";
import { useCategorys } from "api/services/categoryService";
import AlumniDashboardCard from "components/ui/AlumniDashboardCard";
import {
	useUserData,
	ErrorToastMessage,
	SuccessToastMessage,
	useUploadImage,
} from "api/services/user";
import { createFeed, getFeed, useFeeds } from "api/services/feedService";
import {
	TFeedFormData,
	IUser,
	IFeed,
	IUserGroup,
	TSelect,
	ICategory,
} from "utils/datatypes";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import MyUploadAdapter from "../components/MyUploadAdapter";
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
import { FooterComponent } from "components/layout/Footer";
import { UploadOutlined } from "@ant-design/icons";
import Toast from "components/layout/toast";

function AlumniDashboard() {
	const navigate = useNavigate();

	

	const [editorData, setEditorData] = useState("");

	const [myuser, setMyUser] = useState<IUser | null>();
	const [userId, setUserId] = useState(0);
	const [userIdGroup, setUserIdGroup] = useState(0);
	

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [feeds, setFeeds] = useState<IFeed[]>([]);
	const [groups, setGroups] = useState<TSelect[]>([]);
	const [categorys, setCategorys] = useState<TSelect[]>([]);

	const [feedImage, setFeedImage] = useState<File | null>(null);

	const EmailSchema = yup.object().shape({
		description: yup
					.string()
					.when("feed_image", {
					is: (feed_image: string | File | null | undefined) => !feedImage, // If feed_image is not provided
					then: yup
						.string()
						.required("Please Enter Content")
						.min(10, "Content must be at least 10 characters"),
					otherwise: yup.string(), // If feed_image is provided, no validation on description
					}),
					feed_image: yup.mixed(), // feed_image can be optional
	});

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
			setUserIdGroup(Number(items?.id));
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	const {
		data: groupList,
		refetch: fetchGroupList,
		isFetching: isFetchingGroupList,
	} = useGroups({
		enabled: false,
		filter_status: activeStatus,
		filter_name: searchText,
		user_id: userIdGroup,
		page_number: 0,
		page_size: 0,
	}) || [];

	useEffect(() => {
		if(userIdGroup>0){
		fetchGroupList();
		}
	}, [userIdGroup]);
	
	useEffect(() => {
		if (groupList) {
			const groupsList = groupList.data.map((item: IUserGroup) => {
				return { text: item.group?.group_name, value: item.group_id };
			}) as TSelect[];
			setGroups([
				{ text: "Visible to All Members", value: 0 },
				...groupsList,
			]);
		} else {
			setGroups([{ text: "Visible to All Members", value: 0 }]);
		}
	}, [groupList]);

	

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
		data: feedList,
		refetch: fetchFeedList,
		isFetching: isFetchingFeedList,
	} = useFeeds({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,
		group_id: 0,
		user_id: userId,
	}) || [];

	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchFeedList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchFeedList();
	}, [pageNumber]);

	useEffect(() => {
		fetchFeedList();
	}, [userId]);

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

	const {
		data: userList,
		refetch: fetchUserList,
		isFetching: isFetchingUserList,
	} = useUserData({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		filter_course: 0,
		filter_department: 0,
		filter_endyear: 0,
		page_number: pageNumber,
		page_size: pageSize.value,
		isalumni: 1,
	}) || [];

	console.log("feedList", feedList);
	console.log("totalRecords", totalRecords);
	console.log("currentRecords", currentRecords);

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
	const [errorFileMessage, setErrorFileMessage] = useState<string | null>(
		null,
	);

	
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
			} else if ((file.size as number) > filesSize["image"]) {
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
				setErrorFileMessage("");
				setValue("feed_image", "");
				setFeedImage(null);
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
						"/api/v1/upload?type=feed-image&filename=" +
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
			} else{
				setValue("feed_image", "");
				setFeedImage(null);
			}
		} catch (error) {
			return;
		}
	};

	const onSubmit = async (data: TFeedFormData) => {
		await saveProfileImage();

		// Prepare the payload to submit
		if(data.group_id==""){
			data.group_id = 0;
		}

		if(data.category_id==""){
			data.category_id = 0;
		}

		const payload: TFeedFormData = {
			user_id: Number(myuser?.id),
			status: "active",
			description: data.description, // Store the HTML content with updated image URLs
			category_id: data.category_id,
			group_id: data.group_id,
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

	const handleRemove = (file) => {
		
		setFileList([]); // Clears the file list
		setValue("feed_image", "");
		setFeedImage(null);
		
	};  

	
	const [isSelected, setSelection] = useState(false);

	const handlecheck = () => {
		
		if (isSelected==false) {
			setSelection(true);
			setUserId(Number(myuser?.id));
			setPageNumber(pageStartFrom);
		} else{
			setSelection(false);
			setUserId(0);
			setPageNumber(pageStartFrom);
		}
		return null;
	};
	

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full bg-gray-100">
				<div className="md:w-10/12 w-full mx-auto py-6 px-4 relative">
					<h1 className="md:text-2xl text-xl text-black font-bold mb-2">
						Welcome {myuser?.first_name},
					</h1>
					<p className="mb-8 md:text-lg text-sm font-normal">
						Here's everything that's happening on your alumni
						network!
					</p>
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
										aspect={16 / 9}
										aspectSlider
										showReset
										showGrid
										modalProps={{
											className: "custom-upload-modal", // Add a custom class to the modal
										}}>
										<Upload
											className="bg-white border-2 rounded-lg shadow-lg"
											action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
											fileList={fileList}
											onChange={onChange}
											onPreview={onPreview}
											onRemove={handleRemove}
											>
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
									<Select
										name={"group_id"}
										items={groups}
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
								{errorFileMessage}
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
			</div>
			<div className="w-full">
				<div className="md:w-10/12 w-full mx-auto py-6 px-4 relative">
					<div className="grid grid-cols-10 gap-6">
						{/* Left Section: Cards (70%) */}
						<div className="md:col-span-7 col-span-10">
							<div className="flex items-center mb-4">
								<Checkbox
									className="mt-1 "
									checked={isSelected}
									onChange={() => {
										handlecheck();
									}}>
									View only my post
								</Checkbox>
							</div>
							{feeds.length > 0 ? (
								<div className="w-full grid grid-cols-1 gap-6">
									{feeds.map(feed => (
										<AlumniDashboardCard
											feed={feed}
											fetchFeedList={fetchFeedList}
											key={feed.id}
											loggedUserId={userIdGroup}											
										/>
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
										{isLoading ? "Loading..." : "Load More"}
									</Button>
								)}
							</div>
						</div>

						{/* Right Section: Slider (30%) */}
						<div
							className="md:col-span-3 col-span-10"
							style={{
								position: "sticky",
								top: "20px",
								height: "calc(100vh - 40px)",
							}}>
							<div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-full overflow-y-auto">
								<h1 className="text-2xl font-extrabold text-gray-800 mb-4">
									Members
								</h1>
								<List
									itemLayout="horizontal"
									dataSource={userList?.data}
									renderItem={(item: any, index) => (
										<div className="hover:bg-gray-100 transition duration-200 rounded-lg p-2">
											<List.Item>
												<List.Item.Meta
													avatar={
														<Avatar
															src={item?.image
																? import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
																  item?.image
																: "/assets/images/icon-user.webp"}
															size="large"
															className="border border-gray-300"
														/>
													}
													title={
														<a
															href={"/profile/" + item?.id}
															className="text-sm font-semibold text-blue-600 hover:text-blue-800">
															{item?.first_name+" "+item?.last_name}
														</a>
													}
													description={
														<div className="text-gray-600">
															<div className="text-sm font-medium">
																
																	{item?.educationField?.join(" | ")}
																
															</div>
															<div className="text-sm">
															{item?.professional_headline
																? item?.professional_headline
																: ""}{" "}
															</div>
														</div>
													}
												/>
											</List.Item>
										</div>
									)}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<FooterComponent />
		</>
	);
}

export default AlumniDashboard;
