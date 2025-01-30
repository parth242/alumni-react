import TabsComponent from "components/ui/common/TabsComponent";
import { Button, Card } from "flowbite-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "utils/icon";
import { Divider, Modal } from "antd";
import { InputProfile } from "components/ui/common/InputProfile";
import Select from "components/ui/common/Select";
import SelectMulti from "components/ui/common/SelectMulti";
import {
	ErrorToastMessage,
	SuccessToastMessage,	
} from "api/services/user";
import {	
	IUser,	
	TCompanyFormData,
	ICompany,
} from "utils/datatypes";
import { getWork, createWork } from "api/services/companyService";
import { HTTPError } from "ky";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ConfirmPopup from "components/ui/ConfirmPopup";
import {
	HiDesktopComputer,
	HiOutlineArrowLeft,
	HiOutlinePencil,
	HiOutlinePlus,
} from "react-icons/hi";
import { useProfessionalskills } from "api/services/professionalskillService";
import { useWorkRoles } from "api/services/workroleService";
import { useIndustrys } from "api/services/industryService";


const AlumniWorkCompany = () => {

    const navigate = useNavigate();
	const { userid, id } = useParams() as {
		userid: string;
		id: string;
	};

	const EmailSchema = yup.object().shape({
		company_name: yup.string().required("Company Name is required."),

		company_start_period: yup
			.number()
			.typeError("Start Year is required")
			.nullable()
			.required("Start Year is required")
			.test(
				"is-lessar",
				"Start Year must be lessar than End Year",
				function (company_start_period) {
					const company_end_period = this.resolve(
						yup.ref("company_end_period"),
					);
					// If either value is not a number, don't perform the comparison
					if (
						company_start_period == 0 ||
						company_end_period == 0
					) {
						return true; // Skip validation
					}
					return (
						Number(company_end_period) >
						Number(company_start_period)
					);
				},
			),

		company_end_period: yup
			.number()
			.typeError("End Year is required")
			.test(
				"is-greater",
				"End Year must be greater than Start Year",
				function (company_end_period) {
					const company_start_period = this.resolve(
						yup.ref("company_start_period"),
					);
					// If either value is not a number, don't perform the comparison
					if (company_end_period == 0) {
						return true;
					}
					return (
						Number(company_end_period) >
						Number(company_start_period)
					);
				},
			),
	});

	const {
		register,
		trigger,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<TCompanyFormData>({
		resolver: yupResolver(EmailSchema),
	});

	const [userData, setUserData] = useState<ICompany | null>();
	const [myuser, setMyUser] = useState<IUser | null>();

	

	let {
		isLoading,
		data: workDetails,
		refetch: fetchWorkDetails,
		isFetching: isFetchingWorkDetails,
		remove,
	} = getWork({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchWorkDetails();
		} else {
			workDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(workDetails?.data);
		trigger();
	}, [workDetails]);

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

	const { mutate, isError, error } = useMutation(createWork, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Work Added Successfully",
				id: "work_user_success",
			});
			navigate("/admin/work-details/"+id);
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "work_user" });
		},
	});
	const onSubmit = (data: TCompanyFormData) => {
		data.user_id = Number(userid);

		mutate(data);
	};
	return (
		<div className="">
			<div className="inline-block w-full border-b border-border">
				<TabsComponent />
			</div>
            <div className="mb-4 md:mb-0 md:mr-4">
						<h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
							Please mention the company worked in
						</h2>
					</div>
                    <form
						className="flex flex-col gap-4 mt-10"
						onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<label className="mb-3 inline-block ">
									Company Name
								</label>
								<InputProfile
									placeholder="Enter your Company Name"
									name={"company_name"}
									register={register}
									error={errors?.company_name?.message}
									className="w-full text-sm h-11 border-gray-100"
								/>
							</div>
							<div className="w-full">
								<label className="mb-3 inline-block ">
									Position
								</label>
								<InputProfile
									placeholder="Enter your Position"
									name={"position"}
									register={register}
									className="w-full text-sm h-11 border-gray-100"
								/>
							</div>

							<div className="w-full">
								<label className="mb-3 inline-block ">
									Period
								</label>
								<div className="flex gap-4">
									<div>
										<Select
											name={"company_start_period"}
											items={yearListStart}
											error={
												errors?.company_start_period
													?.message
											}
											register={register}
										/>
									</div>
									<div>
										<Select
											name={"company_end_period"}
											items={yearListEnd}
											error={
												errors?.company_end_period
													?.message
											}
											register={register}
										/>
									</div>
								</div>
							</div>
							<div className="w-full">
								<label className="mb-3 inline-block ">
									Location
								</label>
								<InputProfile
									placeholder="Enter Location"
									name={"company_location"}
									register={register}
									className="w-full text-sm h-11 border-gray-100"
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
									onClick={() => navigate("/admin/work-details/"+userid)}
									outline
									gradientDuoTone="tealToLime">
									<HiOutlineArrowLeft className="mr-2 h-5 w-5" />
									Back
								</Button>
							</div>
						</div>
					</form>				
			
		</div>
	);
};

export default AlumniWorkCompany;
