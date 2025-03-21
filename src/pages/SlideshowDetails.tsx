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
			.min(3, "Must be more then 3 character"),

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
		data.slide_image = getValues("slide_image") || "";
		
		mutate(data);
		
		
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();

	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/slideshows");
	  };

	  const saveProfileImage = async () => {
		try {
			let uploadConfig: AxiosResponse | null = null;
			const selectedFile = (image as File) || "";
			console.log("selectedFile", selectedFile);
			if (selectedFile) {
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
			}
		} catch (error) {
			return;
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const ext: string | null = (
				file.name.split(".").pop() || ""
			).toLowerCase();

			setImage(null);
			setErrorMessage("");
			setValue("slide_image", "");
			setSelectedImage("");

			if (filesExt["image"].indexOf(ext) < 0) {
				setErrorMessage(fileInvalid["image"]);
				return true;
			} else if (file?.size > filesSize["image"]) {
				setErrorMessage(
					`File size limit: The image you tried uploading exceeds the maximum file size (${filesLimit["image"]}) `,
				);
			} else {
				setImage(file);
				
			}
		}
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
						<input
							id="slide_image"
							type="file"
							className="mt-1 block w-full text-sm text-gray-500"
							accept={`${allowedFiles["image"]}`}
							{...register("slide_image")}
							onChange={handleImageChange}							
						/>
						<span className="text-xs text-red-500">
						{errors.slide_image && (
							<>
       						 <span>{errors.slide_image.message}</span>
							</>
      					)}
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
					{id && slideshowDetails?.data.slide_image && (
						<>
					<img
									src={
										import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
											slideshowDetails?.data.slide_image
									}
									className="w-100 h-100"
									alt="userImage"
								/>
						</>
					)}
					</div>

					<div className="col-span-1">
						<Textarea
								placeholder="Enter Slide Description"
								name={"slide_description"}
								label={"Description"}
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
