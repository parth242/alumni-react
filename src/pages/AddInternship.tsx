import React, { useEffect, useState } from "react";
import SiteNavbar from "components/layout/sitenavbar";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppState } from "utils/useAppState";
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
import {
	ErrorToastMessage,
	SuccessToastMessage,
	useUploadImage,
} from "api/services/user";
import { createJob, getJob } from "api/services/jobService";
import { useProfessionalskills } from "api/services/professionalskillService";
import { useProfessionalareas } from "api/services/professionalareaService";
import {
	TJobFormData,
	IUser,
	TSelectJob,
	IProfessionalskill,
	IProfessionalarea,
} from "utils/datatypes";
import FlexStartEnd from "components/ui/common/FlexStartEnd";
import BtnLink from "components/ui/common/BtnLink";
import { FooterComponent } from "components/layout/Footer";

function AddInternship() {
	const navigate = useNavigate();

	const { id } = useParams() as {
		id: string;
	};

	const [myuser, setMyUser] = useState<IUser | null>();

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	const [areaList, setAreaList] = useState<TSelectJob[]>([]);
	const [skillList, setSkillList] = useState<TSelectJob[]>([]);

	const [selectedValuesSkill, setSelectedValuesSkill] = useState<
		TSelectJob[]
	>([]);
	const [selectedValuesArea, setSelectedValuesArea] = useState<TSelectJob[]>(
		[],
	);

	const EmailSchema = yup.object().shape({
		id: yup.string().optional(),

		job_title: yup.string().required("Title is required."),

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
	});

	const [{ user, customers, wabaActivationStatus, selectedCustomer }] =
		useAppState();

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

	const {
		trigger,
		register,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<TJobFormData>({
		resolver: yupResolver(EmailSchema),
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

	const { mutate, isError, error } = useMutation(createJob, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Internship Added Successfully",
				id: "job_user_success",
			});
			navigate("/jobs");
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "job_user" });
		},
	});

	const onSubmit = (data: TJobFormData) => {
		data.user_id = Number(myuser?.id);
		data.job_type = "Full-time";
		data.status = "active";
		data.is_internship = 1;
		data.experience_from = 0;
		data.experience_to = 0;
		const currentDate = new Date();
		const formattedDate = currentDate.toISOString().slice(0, 10);
		data.posted_date = formattedDate;

		mutate(data);
	};

	return (
		<>
			<SiteNavbar />
			<div className="container mx-auto p-6 max-w-7xl">
				<FlexStartEnd>
					<h1 className="md:text-3xl text-xl font-bold text-center mb-4">
						Add Internship
					</h1>
					<BtnLink onClick={() => navigate(-1)}>Go Back</BtnLink>
				</FlexStartEnd>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					{/* Grid container for form inputs */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700">
								Title *
							</label>
							<Input
								name={"job_title"}
								register={register}
								error={errors?.job_title?.message}
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
							/>
						</div>

						<div>
							<label
								htmlFor="companyName"
								className="block text-sm font-medium text-gray-700">
								Company Name *
							</label>
							<Input
								name={"company"}
								register={register}
								error={errors?.company?.message}
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
							/>
						</div>

						<div>
							<label
								htmlFor="companyWebsite"
								className="block text-sm font-medium text-gray-700">
								Company Website
							</label>
							<Input
								name={"company_website"}
								register={register}
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
							/>
						</div>

						<div>
							<label
								htmlFor="duration"
								className="block text-sm font-medium text-gray-700">
								Duration
							</label>

							<Input
								name={"duration"}
								register={register}
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
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
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
							/>
						</div>

						<div>
							<label
								htmlFor="contactEmail"
								className="block text-sm font-medium text-gray-700">
								Contact Email *
							</label>
							<Input
								name={"contact_email"}
								register={register}
								error={errors?.contact_email?.message}
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
							/>
						</div>

						<div>
							<label
								htmlFor="jobArea"
								className="block text-sm font-medium text-gray-700">
								Job Area *
							</label>
							<SelectMulti
								name={"area_name"}
								items={areaList}
								register={register}
								onChange={handleArea}
								defaultValue={selectedValuesArea}
								setValue={setValue}
								error={errors?.area_name?.message}
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
							/>
						</div>

						<div>
							<label
								htmlFor="skills"
								className="block text-sm font-medium text-gray-700">
								Skills *
							</label>
							<SelectMulti
								name={"skill_name"}
								items={skillList}
								register={register}
								onChange={handleSkill}
								defaultValue={selectedValuesSkill}
								setValue={setValue}
								error={errors?.skill_name?.message}
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
							/>
						</div>

						<div>
							<label
								htmlFor="salaryPackage"
								className="block text-sm font-medium text-gray-700">
								Stipend
							</label>
							<Input
								name={"salary_package"}
								register={register}
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
							/>
						</div>

						<div>
							<label
								htmlFor="applicationDeadline"
								className="block text-sm font-medium text-gray-700">
								Application Deadline
							</label>
							<Input
								type="date"
								name={"deadline_date"}
								register={register}
								error={errors?.deadline_date?.message}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div className="col-span-1 md:col-span-3">
							<label
								htmlFor="jobDescription"
								className="block text-sm font-medium text-gray-700">
								Description
							</label>
							<Textarea
								name={"job_description"}
								register={register}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						{/* <div className="col-span-1 md:col-span-3">
							<label
								htmlFor="attachedFile"
								className="block text-sm font-medium text-gray-700">
								Attach File (Resume, etc.)
							</label>
							<input
								type="file"
								name="attachedFile"
								id="attachedFile"
								className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"

							/>
						</div> */}
					</div>

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
			<FooterComponent />
		</>
	);
}

export default AddInternship;
