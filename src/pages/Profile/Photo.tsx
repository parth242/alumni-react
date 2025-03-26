import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import ProfileHeader from "components/layout/profileheader";
import ProfileSidebar from "components/layout/profilesidebar";
import Loader from "components/layout/loader";
import React, { useEffect, useState, ChangeEvent } from "react";
import ImgCrop from "antd-img-crop";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
	useUploadImage,
	profilepicUser,
} from "api/services/user";
import {
	CustomerType,
	IUser,
	TSelect,
	ICourse,
	BasicProfile,
	ProfilePicDataType,
	ConfirmPopupDataType,
} from "utils/datatypes";
import { HTTPError } from "ky";
import {
	patterns,
	allowedFiles,
	fileInvalid,
	filesExt,
	filesLimit,
	filesSize,
} from "utils/consts";
import { Button } from "flowbite-react";
import axios, { AxiosResponse } from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, UploadFile, UploadProps, Button as AntdButton } from "antd";

function Photo() {
	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProfilePicDataType>();

	const [userData, setUserData] = useState<BasicProfile | null>();
	const [userId, setUserId] = useState(0);
	const [loading, setLoading] = useState(false);

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [errorFileMessage, setErrorFileMessage] = useState<string | null>(
		null,
	);

	const navigate = useNavigate();

	console.log("userId", userId);

	const [itemId, setItemId] = useState(0);
	const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

	const ConfirmPopupData: ConfirmPopupDataType = {
		title: "Education Delete",
		text: "Are you sure you want to delete Additional Education?",
	};

	const submitDelete = (itemId: any) => {
		//deleteItem(itemId);
		setIsDeleteConfirm(false);
	};
	// Handle the displaying of the modal based on type and id
	const showDeleteModal = (itemId: any) => {
		setItemId(itemId);

		setIsDeleteConfirm(true);
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();
	const [uploadedImage, setUploadedImage] = useState<string>();
	const [image, setImage] = useState<File | null>(null);

	const handleCroppedImage = (croppedFile) => {
		console.log("Cropped File:", croppedFile);
	  
		if (croppedFile) {
		  const newFile = new File([croppedFile], croppedFile.name, { type: croppedFile.type });
	  
		  setFileList([
			{
			  uid: "-1",
			  name: newFile.name,
			  status: "done",
			  url: URL.createObjectURL(newFile),
			  originFileObj: newFile, // Replace original file with cropped file
			},
		  ]);
	  
		  setImage(newFile); // Store cropped file
		}
	  };
	  
	
	const onChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
		const latestFile = newFileList[newFileList.length - 1];
	  
		if (!latestFile) return;
	  
		console.log("Latest File:", latestFile);
	  
		const croppedFile = latestFile.originFileObj;

			  
		setErrorMessage("");
		setValue("image", "");
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
				const response = await axios.get(
					import.meta.env.VITE_BASE_URL +
						"/api/v1/upload?type=profile&filename=" +
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
					setValue("image", uploadConfig?.data?.key);
				}
			}
		} catch (error) {
			return;
		}
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

	useEffect(() => {
		const fetchData = async () => {
			const userDataResponse = (await getMyDetails()) as ProfilePicDataType;
					
			if (userDataResponse) {
				
				setUploadedImage(userDataResponse.image as string);
			}
		};

		fetchData();
	}, []); // Empty dependency array means this effect runs once on mount

	
	
	const { mutate , isLoading: uploadIsLoading } = useMutation(profilepicUser, {
		onSuccess: async () => {
			const userDataResponse = (await getMyDetails()) as ProfilePicDataType;
					
			if (userDataResponse) {
				const storedUserData = localStorage.getItem("user");
				if (storedUserData) {
					const parsedUserData = JSON.parse(storedUserData);
					parsedUserData.image = userDataResponse.image; // Update only the 'image' field
					localStorage.setItem("user", JSON.stringify(parsedUserData));
				}
				
			}
			setLoading(false);
			SuccessToastMessage({
				title: "Profile Picture uploaded Successfully",
				id: "create_user_success",
			});
			navigate("/profile/photo");
		},
		onError: async (e: HTTPError) => {
			setLoading(false);
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_user" });
		},
	});

	const onSubmit = async (data: ProfilePicDataType) => {
		setLoading(true);
		await saveProfileImage();
		if(getValues("image")==''){
			setErrorMessage(
				`Please upload photo file `,
			);
			return false;
		}
		data.image = getValues("image") || "";
		
		const storedUserData = localStorage.getItem("user");

		if (storedUserData) {
			const userData = JSON.parse(storedUserData);
			var userId = userData.id;
		}
		data.id = userId;
		mutate(data);
	};

	return (
		<>
			<SiteNavbar></SiteNavbar>
			<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
				<div className="md:w-56">
					{/* Sidebar */}
					<ProfileSidebar />
				</div>
				<div className="w-full px-10 min-h-screen">
					<h1 className="text-center text-3xl my-7 font-semibold">
						Profile Picture
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
							You can upload a new profile picture or choose from
							previously uploaded pictures.
						</h2>
					</div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4 mt-10">
						<div className="flex gap-4 ">
							{/* <input
								id="profile-image"
								type="file"
								accept={`${allowedFiles["image"]}`}
								onChange={handleImageChange}
								className="" // Hide the file input visually
							/> */}
						<ImgCrop
							rotationSlider
							modalOk="Upload"
							modalCancel="Cancel"
							cropSize={{ width: 400, height: 400 }} // Fixed crop size
							aspect={1} // Ensures square cropping (400x400)
							showGrid
							modalProps={{
								className: "custom-upload-modal",
							}}
							onModalOk={(croppedFile) => handleCroppedImage(croppedFile)} // Capture cropped image
							>
							<Upload
								className="bg-white border-2 rounded-lg shadow-lg"
								action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
								fileList={fileList}
								onChange={onChange}
								onPreview={onPreview}
								beforeUpload={() => false}>
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
								<img
									src={
										selectedImage ||
										import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL + uploadedImage
									}									
									alt="userImage"
								/>
							) : (
								<img
									src="/assets/images/profile.png"									
									alt="userImage"
								/>
							)}
						</div>
						{loading && <Loader></Loader>}
						<div className="flex space-x-4 mb-6">
							<Button
								outline
								style={{ backgroundColor: "#440178" }}
								type="submit">
								Upload
							</Button>
							<Button.Group>
								<Button
									onClick={() => navigate("/profile/basic")}
									outline
									style={{ backgroundColor: "#440178" }}>
									Prev
								</Button>
								<Button
									onClick={() =>
										navigate("/profile/locationcontact")
									}
									outline
									style={{ backgroundColor: "#440178" }}>
									Next
								</Button>
							</Button.Group>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default Photo;
