import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import ProfileHeader from "components/layout/profileheader";
import ProfileSidebar from "components/layout/profilesidebar";
import React, { useEffect, useState } from "react";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
} from "api/services/user";
import {
	CustomerType,
	IUser,
	TSelect,
	ExperienceFormData,
	IIndustry,
	IProfessionalskill,
	IWorkRole,
	IExperience,
} from "utils/datatypes";
import { updateExperience, getExperience } from "api/services/companyService";
import { HTTPError } from "ky";
import { InputProfile } from "components/ui/common/InputProfile";
import Select from "components/ui/common/Select";
import SelectMulti from "components/ui/common/SelectMulti";
import Textarea from "components/ui/common/Textarea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "components/layout/loader";
import { useProfessionalskills } from "api/services/professionalskillService";
import { useWorkRoles } from "api/services/workroleService";
import { useIndustrys } from "api/services/industryService";
import { Button } from "flowbite-react";
import { HiOutlineArrowLeft } from "react-icons/hi";

function WorkExperience() {
	const {
		register,
		trigger,
		setValue,
		handleSubmit,
		reset,
		control,
		formState: { errors },
		getValues,
	} = useForm<ExperienceFormData>();
	const [userData, setUserData] = useState<ExperienceFormData | null>();
	const [myuser, setMyUser] = useState<IUser | null>();

	const [selectedValuesSkill, setSelectedValuesSkill] = useState<TSelect[]>(
		[],
	);
	const [selectedValuesIndustry, setSelectedValuesIndustry] = useState<
		TSelect[]
	>([]);
	const [selectedValuesWorkRole, setSelectedValuesWorkRole] = useState<
		TSelect[]
	>([]);

	const [industryList, setIndustryList] = useState<TSelect[]>([]);
	const [professionalskillList, setProfessionalSkillList] = useState<
		TSelect[]
	>([]);
	const [workroleList, setWorkRoleList] = useState<TSelect[]>([]);

	const getUserData = async () => {
		const userString = localStorage.getItem("user");

		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
		
		const userDataResponse = (await getExperience(items.id)) as ExperienceFormData;
		console.log("userDataResponsenew", userDataResponse);
		setUserData(userDataResponse);
	}
		
	};
	useEffect(() => {
		getUserData();
	}, []);

	useEffect(() => {
		//setSelectedValuesSkill(userData?.skill_id as number[]);
		if (userData) {
			const selectedList = industryList.filter(
				item =>
					userData.industry_id.findIndex(
						(ii: number) => ii === item.value,
					) > -1,
			);

			setSelectedValuesIndustry(selectedList);

			const selectedWorkRoleList = workroleList.filter(
				item =>
					userData.workrole_id.findIndex(
						(ii: number) => ii === item.value,
					) > -1,
			);

			setSelectedValuesWorkRole(selectedWorkRoleList);

			const selectedSkillList = professionalskillList.filter(
				item =>
					userData.skill_id.findIndex(
						(ii: number) => ii === item.value,
					) > -1,
			);

			setSelectedValuesSkill(selectedSkillList);
		}

		reset(userData as ExperienceFormData);
		console.log("userDatareset", userData);
		trigger();
	}, [userData, industryList, workroleList, professionalskillList]);

	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index,
	);

	const [yearListStart] = useState([
		{ text: "Select Start Year", value: 0 }, // Blank option
		...years.map(year => ({ text: year, value: year })),
	]);

	const [yearListEnd] = useState([
		{ text: "Present", value: 0 }, // Blank option
		...years.map(year => ({ text: year, value: year })),
	]);

	const yearexp = Array.from({ length: 65 }, (_, index) => index);

	const [yearexperience] = useState(
		yearexp.map(yeare => ({
			text: yeare !== 0 ? yeare : "-Select-",
			value: yeare,
		})),
	);

	const navigate = useNavigate();

	const {
		data: industrys,
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
		if (industrys) {
			const industryList = industrys.data.map((item: IIndustry) => {
				return { text: item.industry_name, value: item.id };
			}) as TSelect[];
			setIndustryList([...industryList]);
		} else {
			setIndustryList([]);
		}
	}, [industrys]);

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
					return { text: item.skill_name, value: item.id };
				},
			) as TSelect[];
			setProfessionalSkillList([...professionalskillsList]);
		} else {
			setProfessionalSkillList([]);
		}
	}, [professionalskills]);

	const {
		data: workroles,
		refetch: fetchworkroleListData,
		isFetching: isFetchingWorkRoleListData,
	} = useWorkRoles({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (workroles) {
			const workrolesList = workroles.data.map((item: IWorkRole) => {
				return { text: item.workrole_name, value: item.id };
			}) as TSelect[];
			setWorkRoleList([...workrolesList]);
		} else {
			setWorkRoleList([]);
		}
	}, [workroles]);

	const { mutate, isError, error } = useMutation(updateExperience, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Experience Updated Successfully",
				id: "experience_user_success",
			});
			navigate("/profile/work");
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "experience_user" });
		},
	});
	const onSubmit = (data: ExperienceFormData) => {
		data.user_id = Number(myuser?.id);

		mutate(data);
	};

	const handleIndustry = (selectedOptions: any) => {
		setSelectedValuesIndustry(selectedOptions);
		const industryNumbers = selectedOptions.map((mn: any) => {
			return mn.value;
		});

		setValue && setValue("industry_id", industryNumbers);
	};

	const handleWorkRole = (selectedOptions: any) => {
		setSelectedValuesWorkRole(selectedOptions);

		const workroleNumbers = selectedOptions.map((mn: any) => {
			return mn.value;
		});

		setValue && setValue("workrole_id", workroleNumbers);
	};

	const handleSkill = (selectedOptions: any) => {
		setSelectedValuesSkill(selectedOptions);

		const skillNumbers = selectedOptions.map((mn: any) => {
			return mn.value;
		});

		setValue && setValue("skill_id", skillNumbers);
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
						Overall Work Experience
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
							Please add relevant work experience details
						</h2>
					</div>
					<form
						className="flex flex-col gap-4 mt-10"
						onSubmit={handleSubmit(onSubmit)}>
						<div className="text-sm">
							<div className="w-full">
								<Select
									label={
										"Total years of relevant work experience"
									}
									name={"total_experience"}
									items={yearexperience}
									register={register}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full mt-3">
								<SelectMulti
									label={"Role & Responsibilities"}
									name={"workrole_id"}
									items={workroleList}
									register={register}
									onChange={handleWorkRole}
									defaultValue={selectedValuesWorkRole}
									setValue={setValue}
								/>
							</div>

							<div className="w-full mt-3">
								<SelectMulti
									label={"Industries worked in"}
									name={"industry_id"}
									items={industryList}
									register={register}
									onChange={handleIndustry}
									defaultValue={selectedValuesIndustry}
									setValue={setValue}
								/>
							</div>
							<div className="w-full mt-3">
								<SelectMulti
									label={
										"Experienced in (Professional Skills)"
									}
									name={"skill_id"}
									items={professionalskillList}
									register={register}
									onChange={handleSkill}
									defaultValue={selectedValuesSkill}
									setValue={setValue}
								/>
							</div>
						</div>
						<div>
							<div className="flex space-x-4 mb-6">
								<Button
									style={{ backgroundColor: "#440178" }}
									outline
									type="submit">
									Submit
								</Button>
								<Button
									onClick={() => navigate("/profile/work")}
									outline
									gradientDuoTone="tealToLime">
									<HiOutlineArrowLeft className="mr-2 h-5 w-5" />
									Back
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default WorkExperience;
