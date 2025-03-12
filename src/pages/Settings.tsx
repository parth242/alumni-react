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
import { getSetting,createSetting } from "api/services/settingService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TSettingFormData,ISetting, TSelect} from "utils/datatypes";
import axios, { AxiosResponse } from "axios";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize } from "utils/consts";
import Loader from "components/layout/loader";



function Settings() {
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),

		collage_name: yup
			.string()
			.required("College Name is required")
			.min(3, "Must be more then 3 character"),		
		
	});

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TSettingFormData>({
		resolver: yupResolver(schema)		
	});

	
	let {
		isLoading,
		data: settingDetails,
		refetch: fetchSettings,
		isFetching: isFetchingSettings,
		remove,
	} = getSetting({
		enabled: true,		
	}) || [];
	
	useEffect(() => {		
		reset(settingDetails?.data);
		trigger();		
	}, [settingDetails?.data]);

	useEffect(() => {		
		fetchSettings();
	}, []);

	console.log("settingDetails", settingDetails);

	const { mutate } = useMutation(createSetting, {
		onSuccess: async () => {
			setLoading(false);
			SuccessToastMessage({
				title: "Setting Created Successfully",
				id: "create_setting_success",
			});
			navigate("/admin/settings");
		},
		onError: async (e: HTTPError) => {
			setLoading(false);
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_setting" });
		},
	});
	const saveProfileImage = async () => {
		try {
			let uploadConfig: AxiosResponse | null = null;
			const selectedFile = (image as File) || "";
			console.log("selectedFile", selectedFile);
			if (selectedFile) {
				const response = await axios.get(
					import.meta.env.VITE_BASE_URL +
						"/api/v1/upload?type=setting&filename=" +
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
					setValue("collage_logo", uploadConfig?.data?.key);
				}
			}
		} catch (error) {
			return;
		}
	};

	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/settings");
	  };

	  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const ext: string | null = (
				file.name.split(".").pop() || ""
			).toLowerCase();
			setImage(null);
			setErrorMessage("");
		setValue("collage_logo", "");
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
				const reader = new FileReader();
				reader.onload = () => {
					console.log("reader.result", reader.result);
					setSelectedImage(reader.result as string);
				};
				reader.readAsDataURL(file);
			}
		}
	};

	const onSubmit = async (data: TSettingFormData) => {
		setLoading(true);
		await saveProfileImage();
		data.collage_logo = getValues("collage_logo") || "";
		
		console.log('settingdata',data);
		mutate(data);
		
		
	};
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>				

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Input
							placeholder="Enter College Name"
							name={"collage_name"}
							label={"College Name"}
							register={register}
							error={errors?.collage_name?.message}
						/>
					</div>

					<div className="col-span-1">
						<Input
							placeholder="Enter Contact Person"
							name={"contact_name"}
							label={"Contact Person"}
							register={register}
							error={errors?.contact_name?.message}
						/>
					</div>

					<div className="col-span-1">
						<Input
							type="number"
							placeholder="Enter Contact No"
							name={"contact_mobileno"}
							label={"Contact No."}
							register={register}
							error={errors?.contact_mobileno?.message}
						/>
					</div>
					
					<div className="col-span-1">
					<label htmlFor="collage_logo" className="font-medium text-gray-900 dark:text-darkPrimary">College Logo</label>
					<div className="relative">						
						<input
							id="collage_logo"
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
					</div>
					</div>
					
					<div className="col-span-1">
					{settingDetails?.data && settingDetails?.data.collage_logo && (
						<>
					<img
									src={
										import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
											settingDetails?.data.collage_logo
									}
									className="w-100 h-100"
									alt="userImage"
								/>
						</>
					)}
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

export default Settings;
