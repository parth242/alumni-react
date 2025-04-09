import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import Textarea from "components/ui/common/Textarea";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage, useUploadImage } from "api/services/user";
import { getSlideshow,createSlideshow } from "api/services/slideshowService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TSlideshowFormData,ISlideshow, TSelect} from "utils/datatypes";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize } from "utils/consts";
import Loader from "components/layout/loader";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, UploadFile, UploadProps, Button as AntdButton } from "antd";


function SlideshowDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);	
		

	const [statusList] = useState([
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
	]);
	
	
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),

		slide_title: yup
			.string()
			.required("Slideshow Title is required")
			.max(15, "Story Description cannot exceed 15 characters"),

		slide_description: yup
			.string()				
			.max(200, "Slide Description cannot exceed 200 characters"),

		slide_image: yup.mixed().required("Slideshow Image is required"),	

		
			
		status: yup
			.string()
			.required("Status is required").default("active"),

		
	});

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TSlideshowFormData>({
		resolver: yupResolver(schema)		
	});

	
	let {
		isLoading,
		data: slideshowDetails,
		refetch: fetchSlideshowDetails,
		isFetching: isFetchingSlideshowDetails,
		remove,
	} = getSlideshow({
		enabled: +id > 0,
		id: +id,
	}) || [];
	
	useEffect(() => {
		if(id){
		reset(slideshowDetails?.data);
		trigger();
		setUploadedImage(slideshowDetails?.data?.slide_image as string);
		setOldImage(slideshowDetails?.data?.slide_image as string);
		}
	}, [slideshowDetails]);

	useEffect(() => {
		if (id) {
			fetchSlideshowDetails();
		} else {
			slideshowDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);

	

	console.log("slideshowDetails", slideshowDetails);

	const { mutate } = useMutation(createSlideshow, {
		onSuccess: async () => {
			setFileList([]); // Clears the file list
			setValue("image", "");
			setImage(null);			
			setLoading(false);
			SuccessToastMessage({
				title: "Slideshow Created Successfully",
				id: "create_slideshow_success",
			});
			navigate("/admin/slideshows");
		},
		onError: async (e: HTTPError) => {
			setLoading(false);
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_slideshow" });
		},
	});
	const onSubmit = async (data: TSlideshowFormData) => {
		setLoading(true);
		await saveProfileImage();
		if(getValues("slide_image")==''){
			setErrorMessage(
				`Please upload Slide Image`,
			);
			setLoading(false);
			return false;
		}
		data.slide_image = getValues("slide_image") || "";
		
		mutate(data);
		
		
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();
	const [uploadedImage, setUploadedImage] = useState<string>();
	const [oldImage, setOldImage] = useState<string>();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/slideshows");
	  };

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
	  
		const croppedFile = await cropImage(latestFile.originFileObj, 1920, 1080);

			  
		setErrorMessage("");
		setValue("slide_image", "");
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
						"/api/v1/upload?type=slideshow&filename=" +
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
					setValue("slide_image", uploadConfig?.data?.key);
				}
			} else{
				setValue("slide_image", "");
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
		setValue("slide_image", "");
		setImage(null);
		setSelectedImage("");
	};  

	
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>				

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Input
							placeholder="Enter Slideshow Title"
							name={"slide_title"}
							label={"Slideshow Title"}
							register={register}
							error={errors?.slide_title?.message}
						/>
					</div>

					
					<div className="col-span-1">
					<label htmlFor="slide_image" className="font-medium text-gray-900 dark:text-darkPrimary">Slideshow Image</label>
					<div className="relative">						
					<ImgCrop
							rotationSlider
							modalOk="Upload"
							modalCancel="Cancel"
							aspect={16 / 9} // Enforces 16:9 aspect ratio
  							cropSize={{ width: 1920, height: 1080 }} // Enforces 1920x1080 crop size
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
					
					<div className="col-span-1">					
					{selectedImage || uploadedImage ? (
						<>
					<img
									src={
										selectedImage ||
										import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
											uploadedImage
									}
									className="w-100 h-100"									
								/>
						</>
					) : (
						null
					)}
					</div>

					<div className="col-span-1">						
						<Textarea
								placeholder="Enter Description"
								name={"slide_description"}
								label={"Description"}
								error={errors?.slide_description?.message}
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

export default SlideshowDetails;
