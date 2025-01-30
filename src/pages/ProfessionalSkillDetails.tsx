import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage } from "api/services/user";
import { getProfessionalskill, createProfessionalskill } from "api/services/professionalskillService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TProfessionalskillFormData } from "utils/datatypes";


function ProfessionalSkillDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [statusList] = useState([
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
		
	]);
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),
		skill_name: yup
			.string()
			.required("Skill Name is required"),	
		status: yup
			.string()
			.required("Status is required").default("active"),
		
	});

	const {
		trigger,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TProfessionalskillFormData>({
		resolver: yupResolver(schema)
		
	});

	let {
		isLoading,
		data: professionalskillDetails,
		refetch: fetchProfessionalSkillDetails,
		isFetching: isFetchingProfessionalSkillDetails,
		remove,
	} = getProfessionalskill({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchProfessionalSkillDetails();
		} else {
			professionalskillDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(professionalskillDetails?.data);
		trigger();
	}, [professionalskillDetails]);

	console.log("professionalskillDetails", errors);

	const { mutate } = useMutation(createProfessionalskill, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "ProfessionalSkill Created Successfully",
				id: "create_professionalskill_success",
			});
			navigate("/admin/professionalskills");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_professionalskill" });
		},
	});
	const onSubmit = (data: TProfessionalskillFormData) => {
		mutate(data);
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	
	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/professionalskills");
	  };
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Input
							placeholder="Enter Skill Name"
							name={"skill_name"}
							label={"Skill Name"}
							error={errors?.skill_name?.message}
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

export default ProfessionalSkillDetails;
