import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Textarea from "components/ui/common/Textarea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage, useUserHomeData } from "api/services/user";
import { getTestimonial, createTestimonial } from "api/services/testimonialService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TTestimonialFormData, IUser, TSelect } from "utils/datatypes";


function TestimonialDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [alumniList, setAlumniList] = useState<TSelect[]>([]);	
	const [selectedCourse, setSelectedCourse] = useState<number>(0);

	const [statusList] = useState([
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
		
	]);
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),
		user_id: yup
			.number()
			.typeError("Alumni is required")
			.nullable()
			.required("Alumni is required."),
		story_description: yup
			.string()
			.required("Story Description is required"),			
		status: yup
			.string()
			.required("Status is required").default("active"),
		
	});

	const {
		data: users,
		refetch: fetchUserList,
		isFetching: isFetchingUserList,
	} = useUserHomeData({
		enabled: true,		
		page_number: 1,
		page_size: 0,		
	}) || [];
	useEffect(() => {
		
		if (users) {
			const userList = users.data.map((item: IUser) => {				
				return { text: item.first_name+' '+item.last_name, value: item.id };
			}) as TSelect[];
			setAlumniList(userList);
		} 
	}, [users]);

	const {
		trigger,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TTestimonialFormData>({
		resolver: yupResolver(schema)
		
	});

	let {
		isLoading,
		data: testimonialDetails,
		refetch: fetchTestimonialDetails,
		isFetching: isFetchingTestimonialDetails,
		remove,
	} = getTestimonial({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchTestimonialDetails();
		} else {
			testimonialDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(testimonialDetails?.data);
		trigger();
	}, [testimonialDetails]);

	console.log("testimonialDetails", errors);

	const { mutate } = useMutation(createTestimonial, {
		onSuccess: async () => {
			reset();
			SuccessToastMessage({
				title: "Story Created Successfully",
				id: "create_testimonial_success",
			});
			navigate("/admin/testimonials");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_testimonial" });
		},
	});
	const onSubmit = (data: TTestimonialFormData) => {
		mutate(data);
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	
	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/testimonials");
	  };
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Select
							name={"user_id"}
							label={"Alumnis"}
							items={alumniList}
							error={errors?.user_id?.message}
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
					<div className="col-span-2">
						<Textarea
								placeholder="Enter Description"
								name={"story_description"}
								label={"Story Description"}
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

export default TestimonialDetails;
