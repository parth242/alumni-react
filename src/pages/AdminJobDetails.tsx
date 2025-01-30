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
import { getJob,createJob } from "api/services/jobService";
import { useProfessionalskills } from "api/services/professionalskillService";
import { useProfessionalareas } from "api/services/professionalareaService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TJobFormData,IJob, TSelect,TSelectJob,
	IProfessionalskill,
	IProfessionalarea,} from "utils/datatypes";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize } from "utils/consts";



function AdminJobDetails() {
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

	const [statusList] = useState([		
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
	]);
	
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

	const handleSkill = (selectedOptions: any) => {
		setSelectedValuesSkill(selectedOptions);

		const skillNumbers = selectedOptions.map((mn: any) => {
			return mn.value;
		});

		setValue && setValue("skill_name", skillNumbers);
	};

	const handleArea = (selectedOptions: any) => {
		setSelectedValuesArea(selectedOptions);

		const areaNumbers = selectedOptions.map((mn: any) => {
			return mn.value;
		});
		console.log("selectedValuesArea", selectedValuesArea);
		setValue && setValue("area_name", areaNumbers);
	};

	
	
	const schema = yup.object().shape({
		id: yup.string().optional(),

		job_title: yup.string().required("Job Title is required."),

		company: yup.string().required("Company is required."),

		contact_email: yup.string().required("Contact Email is required."),

		area_name: yup
			.array()
			.of(yup.string().required("Job area is required"))
			.min(1, "At least one job area is required") // Minimum 1 element required in the array
			.required("Job area is required"),

		skill_name: yup
			.array()
			.of(yup.string().required("Job Skill is required"))
			.min(1, "At least one job skill is required") // Minimum 1 element required in the array
			.required("Job skill is required"),

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
	} = useForm<TJobFormData>({
		resolver: yupResolver(schema)		
	});

	
	let {
		isLoading,
		data: jobDetails,
		refetch: fetchJobDetails,
		isFetching: isFetchingJobDetails,
		remove,
	} = getJob({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchJobDetails();
		} else {
			jobDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		//setSelectedValuesSkill(jobDetails?.data?.skill_name);
		//setSelectedValuesArea(jobDetails?.data?.area_name);

		const selectedList = areaList.filter(
			item => jobDetails?.data.area_name.includes(item.value), // Check if area_name array includes the value of item
		);

		setSelectedValuesArea(selectedList);

		const selectedSkillList = skillList.filter(
			item => jobDetails?.data.skill_name.includes(item.value), // Check if area_name array includes the value of item
		);

		setSelectedValuesSkill(selectedSkillList);

		reset(jobDetails?.data);

		trigger();
	}, [jobDetails, areaList]);

	console.log("jobDetails", jobDetails);

	const { mutate } = useMutation(createJob, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Job Created Successfully",
				id: "create_job_success",
			});
			navigate("/admin/jobs");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_job" });
		},
	});
	const onSubmit = (data: TJobFormData) => {
		const storedUserData = localStorage.getItem('user');

		if (storedUserData) {
			const userData = JSON.parse(storedUserData);
			var userId = userData.id;
		}
		data.user_id = userId;
		data.job_type = "Full-time";
		
		const currentDate = new Date();
		const formattedDate = currentDate.toISOString().slice(0, 10);
		data.posted_date = formattedDate;
		
			mutate(data);
		
		
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();

	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/jobs");
	  };
	
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>				

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Input
							placeholder="Enter Job Title"
							name={"job_title"}
							label={"Job Title"}
							register={register}
							error={errors?.job_title?.message}
						/>
					</div>	

					<div className="col-span-1">
						<Input
							placeholder="Enter Company"
							name={"company"}
							label={"Company"}
							register={register}
							error={errors?.company?.message}
						/>
					</div>

					<div className="col-span-1">
						<Input
							placeholder="Enter Company Website"
							name={"company_website"}
							label={"Company Website"}
							register={register}							
						/>
					</div>	

					<div className="col-span-1">
							<label
								htmlFor="experience"
								className="block text-sm font-medium text-gray-700">
								Experience (in years)
							</label>
							<div className="flex space-x-4">
								<Input
									type={"number"}
									name={"experience_from"}
									register={register}
									placeholder={"From"}
									
								/>

								<Input
									type={"number"}
									name={"experience_to"}
									register={register}
									placeholder={"To"}
									
								/>
							</div>
						</div>

					<div className="col-span-1">
						<Input
								placeholder="Enter Location"
								name={"location"}
								label={"Job Location"}
								register={register}
								error={errors?.location?.message}
							/>
					</div>

					<div className="col-span-1">
						<Input
								placeholder="Enter Contact Email"
								name={"contact_email"}
								label={"Contact Email"}
								register={register}
								error={errors?.contact_email?.message}
							/>
					</div>	

					<div className="col-span-1">
					<SelectMulti
								name={"area_name"}
								items={areaList}
								label={"Job Area"}
								register={register}
								onChange={handleArea}
								defaultValue={selectedValuesArea}
								setValue={setValue}
								error={errors?.area_name?.message}
								
							/>
					</div>	

					<div className="col-span-1">
					<SelectMulti
								name={"skill_name"}
								items={skillList}
								label={"Skills"}
								register={register}
								onChange={handleSkill}
								defaultValue={selectedValuesSkill}
								setValue={setValue}
								error={errors?.skill_name?.message}
								
							/>
					</div>

					<div className="col-span-1">
					<Input
								name={"salary_package"}
								register={register}
								label={"Salary Package"}
								
							/>
					</div>				
					
					<div className="col-span-1">
						
						<Input
								type="date"
								name={"deadline_date"}
								label={"Application Deadline"}
								register={register}
								error={errors?.deadline_date?.message}								
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
				
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
				<div className="col-span-2">
						<Textarea
								placeholder="Enter Description"
								name={"job_description"}
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

export default AdminJobDetails;
