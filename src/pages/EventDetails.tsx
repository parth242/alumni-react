import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import Textarea from "components/ui/common/Textarea";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage, useUploadImage } from "api/services/user";
import { getEvent,createEvent } from "api/services/eventService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TEventFormData,IEvent, TSelect} from "utils/datatypes";
import axios, { AxiosResponse } from "axios";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize } from "utils/consts";
import Loader from "components/layout/loader";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, UploadFile, UploadProps, Button as AntdButton } from "antd";


function EventDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [oldImage, setOldImage] = useState<string>();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [uploadedImage, setUploadedImage] = useState<string>();

	const [eventCategory] = useState([
		{ text: "Reunions", value: "Reunions" },
		{ text: "Meetups", value: "Meetups" },
		{ text: "Conferences", value: "Conferences" },
		{ text: "Symposiums", value: "Symposiums" },
		{ text: "Workshops", value: "Workshops" },
		{ text: "Community Events", value: "Community Events" },
	]);

	const [statusList] = useState([
		{ text: "Pending", value: "pending" },
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
	]);
	
	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index
	  );
	  const [yearList] =  useState(
		years.map((year) => (
		{ text: year, value: year }
		))
	);
	
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),

		event_title: yup.string().required("Event Title field is required."),

		event_category: yup.string().required("Event Category is required."),

		event_date: yup
			.string()
			.required("Event Date is required"),

		location: yup
			.string()
			.required("Location is required"),

		image: yup.string().optional()

		
	});

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TEventFormData>({
		resolver: yupResolver(schema)		
	});

	
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
		reset(eventDetails?.data);
		setUploadedImage(eventDetails?.data?.event_image as string);
		setOldImage(eventDetails?.data?.event_image as string);
		trigger();
	}, [eventDetails]);

	console.log("eventDetails", eventDetails);

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

	const { mutate } = useMutation(createEvent, {
		onSuccess: async () => {
			setFileList([]); // Clears the file list
			setValue("event_image", "");
			setImage(null);			
			setLoading(false);
			SuccessToastMessage({
				title: "Event Created Successfully",
				id: "create_event_success",
			});
			navigate("/admin/events");
		},
		onError: async (e: HTTPError) => {
			setLoading(false);
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_event" });
		},
	});	

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

	const onSubmit = async (data: TEventFormData) => {
		setLoading(true);
		await saveProfileImage();

		data.event_image = getValues("event_image") || "";

		const storedUserData = localStorage.getItem('user');

		if (storedUserData) {
			const userData = JSON.parse(storedUserData);
			var userId = userData.id;
		}
		data.user_id = userId;
		data.event_type = "Free";
		
		mutate(data);
		
		
	};

	

	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/events");
	  };

	  
	
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>				

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Input
							placeholder="Enter Event Title"
							name={"event_title"}
							label={"Event Title"}
							register={register}
							error={errors?.event_title?.message}
						/>
					</div>

					<div className="col-span-1">
						<Select
							name={"event_category"}
							label={"Event Category"}
							items={eventCategory}
							error={errors?.event_category?.message}
							register={register}
						/>
					</div>
					
					<div className="col-span-1">
						
						<Input
								type="date"
								name={"event_date"}
								label={"Event Date"}
								register={register}
								error={errors?.event_date?.message}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
					</div>
					<div className="col-span-1">
						<Input
								placeholder="Enter Location"
								name={"location"}
								label={"Event Location"}
								register={register}
								error={errors?.location?.message}
							/>
					</div>
					<div className="col-span-1">
					<label htmlFor="event_image" className="font-medium text-gray-900 dark:text-darkPrimary">Event Image</label>
					<div className="relative">						
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
				</div>
				
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
				<div className="col-span-2">
						<Textarea
								placeholder="Enter Description"
								name={"description"}
								label={"Description"}
								register={register}
							/>
				</div>
				</div>
				
				{loading && <Loader></Loader>}
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

export default EventDetails;
