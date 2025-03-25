import Button from "components/ui/common/Button";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage, useUploadImage } from "api/services/user";
import { createGallery, useGallerys, deleteGallery } from "api/services/galleryService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TGalleryFormData,IGallery, TSelect, ConfirmPopupDataType} from "utils/datatypes";
import axios, { AxiosResponse } from "axios";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize, pageStartFrom } from "utils/consts";
import Loader from "components/layout/loader";
import ConfirmPopup from "components/ui/ConfirmPopup";


function Gallery() {
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [itemId, setItemId] = useState(null);
	const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
	const [IsDeleteCancelled, setIsDeleteCancelled] = useState(false);
	const [ConfirmResult, setConfirmResult] = useState(false);
	const [cancelBtnTitle, setcancelBtnTitle] =useState("Cancel");
	const [confirmBtnTitle, setconfirmBtnTitle] =useState("Confirm");

	const ConfirmPopupData : ConfirmPopupDataType =
		{ title: "Gallery Delete", text: "Are you sure you want to delete Gallery?" };
	
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),

		
		
	});

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TGalleryFormData>({
		resolver: yupResolver(schema)		
	});

	const {
		isLoading,
		data: galleryList,
		refetch: fetchGalleryList,
		isFetching: isFetchingGalleryList,
	} = useGallerys({
		enabled: true,		
		page_number: pageNumber,
		page_size: pageSize.value		
	}) || [];
	

	const { mutate: deleteItem, isLoading: uploadIsLoading } = useMutation(deleteGallery, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Delete Gallery Successfully",
				id: "delete_gallery_success",
			});
			fetchGalleryList();
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "delete_gallery" });
		},
	});

	// Handle the actual deletion of the item
	const submitDelete = (itemId: any) => {
		deleteItem(itemId);
		setIsDeleteConfirm(false);
	  };
	// Handle the displaying of the modal based on type and id
	const showDeleteModal = (itemId: any) => {
		setItemId(itemId);
		console.log(itemId);
		
		  //setDeleteMessage(`Are you sure you want to delete the vegetable '${vegetables.find((x) => x.id === id).name}'?`);
		
	 
		  setIsDeleteConfirm(true);
	  };

	const { mutate } = useMutation(createGallery, {
		onSuccess: async () => {
			setLoading(false);
			reset();
			SuccessToastMessage({
				title: "Gallery Created Successfully",
				id: "create_gallery_success",
			});
			fetchGalleryList();
		},
		onError: async (e: HTTPError) => {
			setLoading(false);
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_gallery" });
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
						"/api/v1/upload?type=gallery&filename=" +
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
					setValue("gallery_image", uploadConfig?.data?.key);
				}
			}
		} catch (error) {
			return;
		}
	};

	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/gallery");
	  };

	  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const ext: string | null = (
				file.name.split(".").pop() || ""
			).toLowerCase();
			setImage(null);
			setErrorMessage("");
		setValue("gallery_image", "");
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

	const onSubmit = async (data: TGalleryFormData) => {
		setLoading(true);
		await saveProfileImage();
		data.gallery_image = getValues("gallery_image") || "";
		
		console.log('gallerydata',data);
		mutate(data);
		
		
	};
	
	return (
		<div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Gallery</h2>

			<form className="mt-5 mb-4" onSubmit={handleSubmit(onSubmit)}>				

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					
					
					<div className="col-span-1">
					<label htmlFor="gallery_image" className="font-medium text-gray-900 dark:text-darkPrimary">Gallery Image</label>
					<div className="relative">						
						<input
							id="gallery_image"
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
			{/* Image Gallery */}
			<div className="grid grid-cols-3 gap-4 mt-10">			
			{galleryList &&
				galleryList?.data &&
				galleryList?.data?.length ? (				
				galleryList?.data?.map((item: IGallery, i: number) => item?.gallery_image && (
				
							<div key={item.id} className="relative">
							<img src={import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
                    item?.gallery_image} alt="Uploaded" className="w-full h-40 object-cover rounded shadow" />
							<button
							  onClick={() => showDeleteModal(item.id)}
							  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded"
							>
							  Delete
							</button>
						  </div>
						  
          
		 ))
		 ) : ("No image found")
		 }
      </div>
	  <ConfirmPopup isDeleteConfirm={isDeleteConfirm} setIsDeleteConfirm={setIsDeleteConfirm} setIsDeleteCancelled={setIsDeleteCancelled} data={ConfirmPopupData} setConfirmResult={setConfirmResult} cancelBtnTitle={cancelBtnTitle} confirmBtnTitle={confirmBtnTitle} ConfirmModal={submitDelete} itemId={Number(itemId)}  />
		</div>
	);
}

export default Gallery;
