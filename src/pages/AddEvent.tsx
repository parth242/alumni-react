import SiteNavbar from "components/layout/sitenavbar";
import { useForm, useFieldArray } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "components/layout/loader";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import SelectMulti from "components/ui/common/SelectMulti";
import Textarea from "components/ui/common/Textarea";
import {
	allowedFiles,
	fileInvalid,
	filesExt,
	filesLimit,
	filesSize,
} from "utils/consts";
import { Button } from "flowbite-react";
import { HTTPError } from "ky";
import { useGroups } from "api/services/groupService";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	useUploadImage,
} from "api/services/user";
import { createEvent, getEvent } from "api/services/eventService";
import { TEventFormData, IUser, TSelect, IGroup } from "utils/datatypes";
import { pageStartFrom } from "utils/consts";
import axios, { AxiosResponse } from "axios";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import BtnLink from "components/ui/common/BtnLink";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, UploadFile, UploadProps, Button as AntdButton } from "antd";


function AddEvent() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const EmailSchema = yup.object().shape({
		event_title: yup.string().required("Event Title field is required."),

		event_category: yup.string().required("Event Category is required."),

		location: yup.string().required("Event Location is required."),

		event_date: yup.string().required("Event Date is required."),
		event_image: yup.string().optional().nullable(),
	});

	const {
		trigger,
		register,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
		setValue,
	} = useForm<TEventFormData>({
		resolver: yupResolver(EmailSchema),
	});

	const [myuser, setMyUser] = useState<IUser | null>();
	const [userId, setUserId] = useState(0);

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [loading, setLoading] = useState(false);

	const [groups, setGroups] = useState<TSelect[]>([]);
	const [selectedValuesGroup, setSelectedValuesGroup] = useState<TSelect[]>(
		[],
	);

	const [selectedImage, setSelectedImage] = useState<string>();
	const [uploadedImage, setUploadedImage] = useState<string>();
	const [oldImage, setOldImage] = useState<string>();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
			setUserId(items.id);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	const [eventCategory] = useState([
		{ text: "Select Category", value: "" }, // Blank option
		{ text: "Reunions", value: "Reunions" },
		{ text: "Meetups", value: "Meetups" },
		{ text: "Conferences", value: "Conferences" },
		{ text: "Symposiums", value: "Symposiums" },
		{ text: "Workshops", value: "Workshops" },
		{ text: "Community Events", value: "Community Events" },
	]);

	const {
		data: groupList,
		refetch: fetchGroupList,
		isFetching: isFetchingGroupList,
	} = useGroups({
		enabled: userId > 0,
		filter_status: activeStatus,
		filter_name: searchText,
		user_id: userId,
		page_number: pageNumber,
		page_size: pageSize.value,
	}) || [];
	useEffect(() => {
		if (groupList) {
			
			const groupsList = groupList.data.map((item: any) => {
				return { text: item.group?.group_name, value: item.group?.id };
			}) as TSelect[];
			setGroups([...groupsList]);
		} else {
			setGroups([]);
		}
	}, [groupList]);

	let {
		isLoading,
		data: eventDetails,
		refetch: fetchEventDetails,
		isFetching: isFetchingEventDetails,
		remove,
	} = getEvent({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchEventDetails();
		} else {
			eventDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);

	useEffect(() => {
		
	
		
		if(eventDetails){
		reset(eventDetails?.data as any);	
		
		const groupjson = JSON.parse(eventDetails?.data?.group_id);
		
		console.log('groups',groups);
			const defaultValues = groups.filter(group => groupjson.includes(group.value));
			
			setSelectedValuesGroup(defaultValues as any);

			setUploadedImage(eventDetails?.data?.event_image as string);
			setOldImage(eventDetails?.data?.event_image as string);

		trigger();
		}
	}, [eventDetails,groups]);

	

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [image, setImage] = useState<File | null>(null);

	const getSrcFromFile = (file) => {
		return new Promise((resolve) => {
		  const reader = new FileReader();
		  reader.readAsDataURL(file.originFileObj);
		  reader.onload = () => resolve(reader.result);
		});
	  };

	  const cropImage = (file: File, width: number, height: number) => {
		return new Promise<File>((resolve) => {
		  const reader = new FileReader();
		  reader.readAsDataURL(file);
		  reader.onload = (event) => {
			const img = new Image();
			img.src = event.target?.result as string;
			img.onload = () => {
			  const canvas = document.createElement("canvas");
			  const ctx = canvas.getContext("2d");
	  
			  // Set canvas size
			  canvas.width = width;
			  canvas.height = height;
	  
			  // Draw cropped image on canvas
			  ctx?.drawImage(img, 0, 0, width, height);
	  
			  // Convert canvas to Blob and then to File
			  canvas.toBlob((blob) => {
				if (blob) {
				  const croppedFile = new File([blob], file.name, {
					type: "image/jpeg",
					lastModified: Date.now(),
				  });
				  resolve(croppedFile);
				}
			  }, "image/jpeg");
			};
		  };
		});
	  };
	  
	
	const onChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
		const latestFile = newFileList[newFileList.length - 1];
	  
		if (!latestFile) return;
	  
		console.log("Latest File:", latestFile);
	  
		const croppedFile = await cropImage(latestFile.originFileObj, 1024, 768);

			  
		setErrorMessage("");
		setValue("event_image", "");
		setImage(null);
		setSelectedImage("");
	  
		const ext: string | null = (
			croppedFile.name.split(".").pop() || ""
		).toLowerCase();

		if (filesExt["image"].indexOf(ext) < 0) {
		  setErrorMessage(fileInvalid["image"]);
		  return;
		} else if ((croppedFile.size as number) > filesSize["image"]) {
		  setErrorMessage(`File size limit: The image exceeds ${filesLimit["image"]}`);
		  return;
		}
	  
		setImage(croppedFile); // Store cropped image
		setFileList(newFileList);
	  
		const reader = new FileReader();
		reader.onload = () => {
		  console.log("Cropped Image Data:", reader.result);
		  setSelectedImage(reader.result as string);
		};
		reader.readAsDataURL(croppedFile);
	  };

	
	const saveProfileImage = async () => {
		try {
			let uploadConfig: AxiosResponse | null = null;
			const selectedFile = (image as File) || "";
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
						"/api/v1/upload?type=events&filename=" +
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
					setValue("event_image", uploadConfig?.data?.key);
				}
			} else{
				setValue("event_image", "");
				setImage(null);
			}
		} catch (error) {
			return;
		}
	};

	const onPreview = async (file) => {
		const src = file.url || (await getSrcFromFile(file));
		const imgWindow = window.open(src);
	
		if (imgWindow) {
		  const image = new Image();
		  image.src = src;
		  imgWindow.document.write(image.outerHTML);
		} else {
		  window.location.href = src;
		}
	  };

	const handleRemove = (file) => {
		
		setFileList([]); // Clears the file list
		setValue("event_image", "");
		setImage(null);
		setSelectedImage("");
	};  

	const handleGroup = (selectedOptions: any) => {
		console.log('selectedOptions',selectedOptions);
		setSelectedValuesGroup(selectedOptions);

		const groupNumbers = selectedOptions.map((mn: any) => {
			return mn.value;
		});

		setValue && setValue("group_id", groupNumbers);
	};

	const { mutate, isError, error } = useMutation(createEvent, {
		onSuccess: async (res: any) => {
			setFileList([]); // Clears the file list
			setValue("event_image", "");
			setImage(null);			
			setLoading(false);
			SuccessToastMessage({
				title: "Event Added Successfully",
				id: "event_user_success",
			});
			navigate("/show-events");
		},
		onError: async (e: HTTPError) => {
			setLoading(false);
			ErrorToastMessage({ error: e, id: "event_user" });
		},
	});

	const onSubmit = async (data: TEventFormData) => {
		setLoading(true);
		await saveProfileImage();
		
		data.event_image = getValues("event_image") || "";
		console.log("data.event_image", data.event_image);
		data.user_id = Number(myuser?.id);
		data.event_type = "Free";
		data.status = "inactive";		
		
		if (data.group_id && (Array.isArray(data.group_id) ? data.group_id.length > 0 : data.group_id.trim() !== '')) {
			// group_id exists, is not empty, and is either a non-empty array or non-empty string
			data.group_id = JSON.stringify(data.group_id);
		  } else {
			data.group_id = "";
		  }
		

		/* const imageFile = (
			document.querySelector('input[type="file"]') as HTMLInputElement
		)?.files?.[0];

		if (imageFile) {
			const formdata = new FormData();
			formdata.append("type", "event");
			formdata.append("file", imageFile);

			useUploadImage({ data: formdata })
				.then((response: any) => {
					//setValue("image", data.files[0].filename);
					if (response.message == "Upload Success") {
						// Update data with the uploaded image file name
						data.event_image = response.files[0].filename;
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
		} else { */

		// If no image is uploaded, just call mutate
		mutate(data);
		/* } */
	};

	return (
		<>
			<SiteNavbar />
			<div className="container mx-auto p-6 max-w-7xl">
			<FlexStartEnd>
			<h1 className="md:text-3xl text-xl font-bold text-center mb-4">
					Add Event
				</h1>
				<BtnLink onClick={() => navigate(-1)}>Go Back</BtnLink>
				</FlexStartEnd>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700">
							Title
						</label>
						<Input
							name={"event_title"}
							register={register}
							error={errors?.event_title?.message}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="category"
							className="block text-sm font-medium text-gray-700">
							Category
						</label>
						<Select
							name={"event_category"}
							items={eventCategory}
							error={errors?.event_category?.message}
							register={register}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="group"
							className="block text-sm font-medium text-gray-700">
							Groups
						</label>
						<SelectMulti
							name={"group_id"}
							items={groups}
							register={register}
							onChange={handleGroup}
							defaultValue={selectedValuesGroup}
							setValue={setValue}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="location"
							className="block text-sm font-medium text-gray-700">
							Location
						</label>
						<Input
							name={"location"}
							register={register}
							error={errors?.location?.message}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="date"
							className="block text-sm font-medium text-gray-700">
							Date
						</label>
						<Input
							type="date"
							name={"event_date"}
							register={register}
							error={errors?.event_date?.message}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700">
							Description
						</label>
						<Textarea
							name={"description"}
							register={register}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="image"
							className="block text-sm font-medium text-gray-700">
							Image
						</label>
						<ImgCrop
							rotationSlider
							modalOk="Upload"
							modalCancel="Cancel"
							aspect={4 / 3}  							
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
						{selectedImage || uploadedImage ? (
							<>
								<img
									src={
										selectedImage ||
										import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL + uploadedImage
									}
									className="mt-4 w-40 h-40 square-full"									
								/>
							</>
							) : (null)}
					</div>
					{loading && <Loader></Loader>}
					<div className="group flex items-center justify-center">
						<Button
							style={{ backgroundColor: "#440178" }}
							outline
							type="submit">
							Submit
						</Button>
					</div>
				</form>
			</div>
		</>
	);
}

export default AddEvent;
