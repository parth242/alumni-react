import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { Link, useNavigate,useParams } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import Navbar from "components/layout/navbar";
import React, { ChangeEvent,useEffect, useState  } from "react";
import {
	ErrorToastMessage, SuccessToastMessage,
	getMyDetails,useUploadImage,profilepicUser
} from "api/services/user";

import { ProfilePicDataType} from "utils/datatypes";
import { patterns,allowedFiles, fileInvalid, filesExt, filesLimit, filesSize } from "utils/consts";
import { HTTPError } from "ky";
import { Form } from "components/ui/common/Form";
import "./ProfileCompletion.css";


function ProfilePhoto() {

	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} =  useForm<ProfilePicDataType>();

 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileChanged, setFileChanged] = useState<boolean>(false);
  const [fileControl, setFileControl] = useState<FileList | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [uploadedImage, setUploadedImage] = useState<string>();

  const uploadImage = async (e: ChangeEvent) => {
	const target = e.target as HTMLInputElement;
	const files: FileList | null = target.files;
	
	setErrorMessage("");
	setValue("image", "");
	setSelectedImage("");

	if (files && files[0]) {
		setFileChanged(true);
		const ext: string | null = (
			files[0].name.split(".").pop() || ""
		).toLowerCase();
		if (filesExt["image"].indexOf(ext) < 0) {
			setFileControl(null);
			setErrorMessage(fileInvalid["image"]);
			setFileChanged(true);
			setValue("image", "");
			return true;
		}
		
		if (files[0]?.size < filesSize["image"]) {
			const data = new FormData();
			data.append("type", "profile");
			data.append("file", files[0]);
			setFileControl(files);
			const reader = new FileReader();
			reader.onload = () => {
				console.log("reader.result", reader.result);
				setSelectedImage(reader.result as string);
			};
			reader.readAsDataURL(files[0]);
			uploadFile({ data: data });

		} else {
			setFileControl(null);
			setFileChanged(true);
			setValue("image", "");
			setErrorMessage(
				`File size limit: The image you tried uploading exceeds the maximum file size (2 MB) `,
			);
		}
	} else {
		setValue(`image`, "");
		setFileControl(null);
	}
};










useEffect(() => {
	const fetchData = async () => {	 
		const storedUserData = localStorage.getItem('user');

		if (storedUserData) {
			const userData = JSON.parse(storedUserData);			
			setUploadedImage(userData.image as string);
			}
			  
	};
	
	fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

const { mutate: uploadFile, isLoading: uploadIsLoading } = useMutation(
	useUploadImage,
	{
		onSuccess: async (data: any) => {
			console.log("data.files", data);
			setValue("image", data.files[0].filename);
			trigger("image");
			setFileChanged(true);
			setErrorMessage("");
		},
		onError: async (e: HTTPError) => {
			setFileControl(null);
			setFileChanged(true);
			setValue("image", "");
			setErrorMessage(
				"File upload failed. Please check your internet connection and try again.",
			);
		},
	},
);

const { mutate } = useMutation(profilepicUser, {
	onSuccess: async () => {
		SuccessToastMessage({
			title: "Profile Picture uploaded Successfully",
			id: "create_user_success",
		});
		navigate("/course");
	},
	onError: async (e: HTTPError) => {
		// const error = await e.response.text();
		// console.log("error", error);
		ErrorToastMessage({ error: e, id: "create_user" });
	},
});

const onSubmit = (data: ProfilePicDataType) => {
	const storedUserData = localStorage.getItem('user');

			if (storedUserData) {
				const userData = JSON.parse(storedUserData);
				var userId = userData.id;
				}
	  	  data.id = userId;
	mutate(data);
};
console.log("getValues()", uploadedImage);
  return (
	
	<div className="text-sm">
	<Navbar></Navbar>
	<div className="">
				
				<div className="col-span-12 animate-fade bg-white dark:bg-dark2">
				<Form
						register={register}
						onSubmit={onSubmit}
						handleSubmit={handleSubmit}						
						className={"h-screen"}>
				<div className="profile-completion-container">

<h1><b>Complete your profile</b></h1>
<p>Quick four steps to complete your profile!</p>

<div className="profile-completion-steps">

  <div className="profile-completion-step-ind current"><div className="profile-completion-step current">1</div><span>Photograph</span></div>

  <div className="profile-completion-step-ind"><div className="profile-completion-step">2</div><span>Additional Education</span></div>

  <div className="profile-completion-step-ind"><div className="profile-completion-step">3</div><span>Contact Details</span></div>

  <div className="profile-completion-step-ind"><div className="profile-completion-step">4</div><span>Company Details</span></div>

</div>
      
      <div className="profile-completion-content">

        <div className="profile-completion-section">

          <h2>Profile Photograph</h2>

          <p>

            Please upload a profile picture. You will be able to crop the picture

            and adjust the thumbnail in 'Edit Profile' section after login.

          </p>
		  <div className="profile-picture-upload">
		  <div className="w-32 h-32 flex flex-col items-center justify-center relative">
					{selectedImage || uploadedImage ? (
						<img
							src={selectedImage || (import.meta.env.VITE_BASE_URL + "upload/profile/" + uploadedImage)}
							className="w-32 h-32 rounded-full"
							alt="userImage"
						/>
					) : (
						<img
							src="/assets/images/profile.png"
							className="w-32 h-32 rounded-full"
							alt="userImage"
						/>
					)}
					<label htmlFor="profile-image">
						<Icon
							icon="pencil"
							className="h-7 w-7 rounded-full bg-blue-800 text-white  absolute my-0  bottom-2 right-2 cursor-pointer p-1"
						/>
					</label>
					<input
						
						id="profile-image"
						type="file"
						className="sr-only"
						accept={`${allowedFiles["image"]}`}
						onChange={(e: ChangeEvent) => uploadImage(e)}						
					/>
					
				</div>
				{errorMessage && (
    <div className="error-message">{errorMessage}</div>
)}
		<p> Only PNG, JPEG, JPG allowed. Max file size of 2MB.</p>
		

          </div>
		
        
		</div>
		<div className="relative">

       
        <button type="submit" className="group relative mb-3 flex justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Save and Continue</button>
		<Link to={'/course'}>Skip & Go to Next Step</Link>
      </div>
    </div>
	
	</div>
	</Form>
	</div>
	</div>
	</div>
  );
}


export default ProfilePhoto;