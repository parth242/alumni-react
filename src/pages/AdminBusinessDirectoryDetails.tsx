import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import SelectMulti from "components/ui/common/SelectMulti";
import Textarea from "components/ui/common/Textarea";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage, useUploadImage } from "api/services/user";
import { getBusinessDirectory,createBusinessDirectory } from "api/services/businessdirectoryService";
import { useProfessionalskills } from "api/services/professionalskillService";
import { useProfessionalareas } from "api/services/professionalareaService";
import { getServices } from "api/services/servicesService ";
import { createProducts, getProducts } from "api/services/productsService ";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TBusinessDirectoryFormData,IBusinessDirectory, TSelect,TSelectJob,
	IProfessionalskill,
	IProfessionalarea, IIndustry,
	TSelectIndu,} from "utils/datatypes";
import { useIndustrys } from "api/services/industryService";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize, patterns } from "utils/consts";
import axios, { AxiosResponse } from "axios";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, UploadFile, UploadProps, Button as AntdButton } from "antd";


function AdminBusinessDirectoryDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [areaList, setAreaList] = useState<TSelectJob[]>([]);
	const [skillList, setSkillList] = useState<TSelectJob[]>([]);

	const [selectedValuesSkill, setSelectedValuesSkill] = useState<
		TSelectJob[]
	>([]);
	const [selectedValuesArea, setSelectedValuesArea] = useState<TSelectJob[]>(
		[],
	);

	const [industryList, setIndustryList] = useState<TSelect[]>([]);
	const [serviceList, setServiceList] = useState<any[]>([]);
	const [productList, setProductList] = useState<any[]>([]);
	
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [oldImage, setOldImage] = useState<string>();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [uploadedImage, setUploadedImage] = useState<string>();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();

	const { data: servicesData, refetch: fetchServiceData } = getServices({
		enabled: false,
	});

	const { data: productsData, refetch: fetchProductData } = getProducts({
		enabled: false,
	});

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
		setValue("business_logo", "");
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
						"/api/v1/upload?type=business_directory&filename=" +
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
					setValue("business_logo", uploadConfig?.data?.key);
				}
			} else{
				setValue("business_logo", "");
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
		setValue("business_logo", "");
		setImage(null);
		setSelectedImage("");
	};  

	const [statusList] = useState([		
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
	]);

	const {
		data: industries,
		refetch: fetchindustryListData,
		isFetching: isFetchingIndustryListData,
	} = useIndustrys({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];

	useEffect(() => {
		
		fetchindustryListData();
		return () => {
			return;
		};
	}, []);

	useEffect(() => {
		if (industries) {
			const industriesList = industries.data.map((item: IIndustry) => {
				return { text: item.industry_name, value: item.id };
			}) as TSelect[];
			setIndustryList([...industriesList]);
		} else {
			setIndustryList([]);
		}
	}, [industries]);

	useEffect(() => {
		if (servicesData) {
			const servicesList = servicesData.data.map((item: any) => {
				return { text: item.service_name, value: item.service_name };
			}) as any[];
			setServiceList([...servicesList]);
		} else {
			setServiceList([]);
		}
	}, [servicesData]);

	useEffect(() => {
		if (productsData) {
			const productsList = productsData.data.map((item: any) => {
				return { text: item.product_name, value: item.product_name };
			}) as any[];
			setProductList([...productsList]);
		} else {
			setProductList([]);
		}
	}, [productsData]);
	
	const {
		data: professionalskills,
		refetch: fetchprofessionalskillListData,
		isFetching: isFetchingProfessionalskillListData,
	} = useProfessionalskills({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (professionalskills) {
			const professionalskillsList = professionalskills.data.map(
				(item: IProfessionalskill) => {
					return { text: item.skill_name, value: item.skill_name };
				},
			) as TSelectJob[];
			setSkillList([...professionalskillsList]);
		} else {
			setSkillList([]);
		}
	}, [professionalskills]);

	const {
		data: professionalareas,
		refetch: fetchprofessionalareaListData,
		isFetching: isFetchingProfessionalareaListData,
	} = useProfessionalareas({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (professionalareas) {
			const professionalareasList = professionalareas.data.map(
				(item: IProfessionalarea) => {
					return { text: item.area_name, value: item.area_name };
				},
			) as TSelectJob[];
			setAreaList([...professionalareasList]);
		} else {
			setAreaList([]);
		}
	}, [professionalareas]);

	
	
	
	const schema = yup.object().shape({
		id: yup.string().optional(),

		business_name: yup.string().required("Business Directory Name is required."),

		business_website: yup.string()
		.required("Website is required")
		.matches(patterns.WEBSITE, "Please enter a valid website URL"),

		business_email: yup.string()
		.required("Email is required")
		.matches(patterns.EMAIL, "Invalid email address"),

		contact_number: yup.string().required("Contact Number is required.")
		.matches(/^[0-9]+$/, "Contact number must contain only digits"),

		number_of_employees: yup.string().required("Number Of Employee is required.")
		.matches(/^\d+$/, "Invalid Number of Employees"),

		industry_id: yup
			.string()
			.required("Industry is required"),

		founded: yup.string().required("Number Of Employee is required.")
			.matches(/^\d{4}$/, "Invalid founded"),

		location: yup.string().required("Location is required."),		

		status: yup
			.string()
			.required("Status is required")
		
	});

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TBusinessDirectoryFormData>({
		resolver: yupResolver(schema)		
	});

	
	let {
		isLoading,
		data: businessdirectoryDetails,
		refetch: fetchBusinessDirectoryDetails,
		isFetching: isFetchingBusinessDirectoryDetails,
		remove,
	} = getBusinessDirectory({
		enabled: +id > 0,
		id: +id,
	}) || [];
	
	useEffect(() => {
		if (id) {
			fetchBusinessDirectoryDetails();
		} else {
			businessdirectoryDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		

		reset(businessdirectoryDetails?.data);
		setUploadedImage(businessdirectoryDetails?.data?.business_logo as string);
		setOldImage(businessdirectoryDetails?.data?.business_logo as string);
		trigger();
	}, [businessdirectoryDetails]);

	console.log("businessdirectoryDetails", businessdirectoryDetails);

	const { mutate } = useMutation(createBusinessDirectory, {
		onSuccess: async () => {
			setFileList([]); // Clears the file list
			setValue("business_logo", "");
			setImage(null);			
			setLoading(false);
			SuccessToastMessage({
				title: "BusinessDirectory Created Successfully",
				id: "create_businessdirectory_success",
			});
			navigate("/admin/businessdirectories");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_businessdirectory" });
		},
	});
	const onSubmit = async (data: TBusinessDirectoryFormData) => {
		setLoading(true);
		await saveProfileImage();
  
		data.business_logo = getValues("business_logo") || "";
		const storedUserData = localStorage.getItem('user');

		if (storedUserData) {
			const userData = JSON.parse(storedUserData);
			var userId = userData.id;
		}
		data.user_id = userId;
		
		
		
			mutate(data);
		
		
	};



	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/businessdirectories");
	  };
	
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>				

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Input
							placeholder="Enter Directory Name"
							name={"business_name"}
							label={"Directory Name"}
							register={register}
							error={errors?.business_name?.message}
						/>
					</div>	

					<div className="col-span-1">
						<Input
							placeholder="Enter Business Website Url"
							name={"business_website"}
							label={"Website Url"}
							register={register}
							error={errors?.business_website?.message}
						/>
					</div>

					<div className="col-span-1">
						<Input
							placeholder="Enter Company Number"
							name={"contact_number"}
							label={"Contact Number"}
							register={register}							
						/>
					</div>	

					<div className="col-span-1">
						<Input
								placeholder="Enter Number of Employees"
								name={"number_of_employees"}
								label={"Number of Employees"}
								register={register}
								error={errors?.number_of_employees?.message}
							/>
					</div>	

					<div className="col-span-1">
						<Select
							name={"industry_id"}
							label={"Industry"}
							items={industryList}
							error={errors?.industry_id?.message}
							register={register}
						/>
					</div>

					<div className="col-span-1">
						<Input
								placeholder="Enter Founded"
								name={"founded"}
								label={"Founded"}
								register={register}
								error={errors?.founded?.message}
							/>
					</div>

					<div className="col-span-1">
						<Input
								placeholder="Enter Location"
								name={"location"}
								label={"Location"}
								register={register}
								error={errors?.location?.message}
							/>
					</div>

					<div className="col-span-1">
						<Input
								type={"email"}
								placeholder="Enter Email"
								name={"business_email"}
								label={"Email"}
								register={register}
								error={errors?.business_email?.message}
							/>
					</div>	

					<div className="col-span-1">
						<Select
							name={"services"}
							label={"Services"}
							items={serviceList}							
							register={register}
						/>
					</div>

					<div className="col-span-1">
						<Select
							name={"products"}
							label={"Products"}
							items={productList}							
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

					<div className="col-span-1">
					<label htmlFor="business_logo" className="font-medium text-gray-900 dark:text-darkPrimary">Business Logo</label>
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

export default AdminBusinessDirectoryDetails;
