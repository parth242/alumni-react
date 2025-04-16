import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage } from "api/services/user";
import { getFeed, createFeed } from "api/services/feedService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TFeedFormData, ICourse, TSelect, ICategory, IUserGroup } from "utils/datatypes";
import { useCourses } from "api/services/courseService";
import Textarea from "components/ui/common/Textarea";
import {
	pageStartFrom,
	patterns,
	allowedFiles,
	fileInvalid,
	filesExt,
	filesLimit,
	filesSize,
} from "utils/consts";
import axios, { AxiosResponse } from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImgCrop from "antd-img-crop";
import { Upload, Button as AntdButton } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import MyUploadAdapter from "../components/MyUploadAdapter";
import { useGroups } from "api/services/groupService";
import { useCategorys } from "api/services/categoryService";
import { UploadOutlined } from "@ant-design/icons";

function MyCustomUploadAdapterPlugin(editor: any) {
	editor.plugins.get("FileRepository").createUploadAdapter = (
		loader: any,
	) => {
		return new MyUploadAdapter(loader); // Create an instance of MyUploadAdapter
	};
}


function FeedDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [courseList, setCourseList] = useState<TSelect[]>([]);	
	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [editorData, setEditorData] = useState("");
	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string>();
	const [uploadedImage, setUploadedImage] = useState<string>();
	const [oldImage, setOldImage] = useState<string>();
	const [groups, setGroups] = useState<TSelect[]>([]);
	const [categorys, setCategorys] = useState<TSelect[]>([]);
	const [userIdGroup, setUserIdGroup] = useState(0);
	
	const [statusList] = useState([
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
		
	]);
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),		
		status: yup
			.string()
			.required("Status is required").default("active"),
		
	});

	const {
		data: categoryList,
		refetch: fetchCategoryList,
		isFetching: isFetchingCategoryList,
	} = useCategorys({
		enabled: true,
		filter_status: 'active',
		filter_name: "",
		page_number: 1,
		page_size: 0,
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
		data: groupList,
		refetch: fetchGroupList,
		isFetching: isFetchingGroupList,
	} = useGroups({
		enabled: userIdGroup > 0,
		filter_status: 'active',
		filter_name: "",
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
			
			const seenGroupIds = new Set<number>();

			const groupsList = groupList.data
				.filter((item: IUserGroup) => {
					if (!seenGroupIds.has(item.group_id)) {
						seenGroupIds.add(item.group_id);
						return true;
					}
					return false;
				})
				.map((item: IUserGroup) => ({
					text: item.group?.group_name,
					value: item.group_id,
				})) as TSelect[];
			setGroups([
				{ text: "Visible to All Members", value: 0 },
				...groupsList,
			]);
		} else {
			setGroups([{ text: "Visible to All Members", value: 0 }]);
		}
	}, [groupList]);

	const {
		trigger,
		register,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<TFeedFormData>({
		resolver: yupResolver(schema)
		
	});

	let {
		isLoading,
		data: feedDetails,
		refetch: fetchFeedDetails,
		isFetching: isFetchingFeedDetails,
		remove,
	} = getFeed({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchFeedDetails();
		} else {
			feedDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(feedDetails?.data);
		setUploadedImage(feedDetails?.data?.feed_image as string);
		setOldImage(feedDetails?.data?.feed_image as string);
		setUserIdGroup(Number(feedDetails?.data?.user_id));
		setEditorData(feedDetails?.data?.description || "");
		trigger();
	}, [feedDetails]);

	console.log("feedDetails", errors);

	const parseEditorContent = (content: string) => {
		// No need to manipulate the content anymore. Just pass it as it is.
		return content; // Return the raw HTML (including <img> tags)
	};

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [errorFileMessage, setErrorFileMessage] = useState<string | null>(
		null,
	);

	const [feedImage, setFeedImage] = useState<File | null>(null);

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
			setSelectedImage("");

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
				const reader = new FileReader();
				reader.onload = () => {
				console.log("Cropped Image Data:", reader.result);
				setSelectedImage(reader.result as string);
				};
				reader.readAsDataURL(file);
			}
		}
	};

	const { mutate } = useMutation(createFeed, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Feed Created Successfully",
				id: "create_feed_success",
			});
			setEditorData(""); // Reset CKEditor content
				setFileList([]);				
				setErrorFileMessage("");
				setValue("feed_image", "");
				setFeedImage(null);
			navigate("/admin/feeds");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_feed" });
		},
	});


	const saveProfileImage = async () => {
		try {
			let uploadConfig: AxiosResponse | null = null;
			const selectedFile = (feedImage as File) || "";
			console.log("selectedFile", selectedFile);
			if (selectedFile) {
				if(oldImage!='' && oldImage!=null){
					const responseapi = await axios.get(
						import.meta.env.VITE_BASE_URL +
							"/api/v1/upload/deleteOldImage?key=" +
							oldImage,
					);
	
					if (responseapi.status === 200) {
						setOldImage("");
					}
	
				}
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
		setLoading(true);
		await saveProfileImage();
		data.feed_image = getValues("feed_image") || "";
		if(data.group_id==""){
			data.group_id = 0;
		}

		if(data.category_id==""){
			data.category_id = 0;
		}
		
		mutate(data);
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
		setSelectedImage("");
	};  


	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	
	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/feeds");
	  };
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-2">
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
					</div>
					<div className="col-span-1">
					<label htmlFor="feed_image" className="font-medium text-gray-900 dark:text-darkPrimary">Feed Image</label>
					<div className="relative">						
					<ImgCrop
							rotationSlider
							modalOk="Upload"
							modalCancel="Cancel"
							aspect={16 / 9}							
							showReset
							showGrid
							modalProps={{
								className: "custom-upload-modal",
							}}>
							<Upload
								className="border-2 rounded-lg shadow-lg"
								action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"								
								fileList={fileList}
								onChange={onChange}
								onPreview={onPreview}
								onRemove={handleRemove}
								>
								{fileList.length < 1 && (
								<AntdButton className="bg-transparent mt-1 border-none" icon={<UploadOutlined />}>
									Click to Upload
								</AntdButton>
								)}
							</Upload>
							</ImgCrop>
						<span className="text-xs text-red-500">
						{errorMessage && (
							<>
								<span>{errorMessage}</span>
							</>
						)}
						&nbsp;
					</span>
					</div>
					</div>
					{selectedImage || uploadedImage ? (
						<>
					<div className="col-span-1">
					<img
									src={
										selectedImage ||
										import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
										uploadedImage
									}
									className="w-40 h-40 square-full"								
								/>
					</div>
					</>
					) : (null)}
				
					<div className="col-span-1">
						<Select
							name={"category_id"}
							label={"Category"}
							items={categorys}
							register={register}
							
						/>
					</div>
					<div className="col-span-1">
						<Select
							name={"group_id"}
							label={"User Group"}
							items={groups}
							register={register}
							
						/>
					</div>
					<div className="col-span-1">
						<Select
							name={"status"}
							label={"Status"}
							items={statusList}
							error={errors?.status?.message}
							register={register}
						/>
					</div>
					
				</div>
				
				<div className="mt-6">
					<Button className="!transition-colors !duration-700 text-lg font-medium text-white shadow-sm hover:!bg-blue-700 focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 py-3 px-10">
						Save
					</Button>
					<Button
						type="button"
						onClick={handleCancel}
						className="transition-colors duration-700 text-lg font-medium text-black bg-white border border-black hover:bg-gray-100 focus:outline-none focus:ring-0 py-3 px-10 ml-4"
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}

export default FeedDetails;