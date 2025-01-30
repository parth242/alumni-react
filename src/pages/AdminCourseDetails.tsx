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
import { getCourse, createCourse } from "api/services/courseService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TCourseFormData } from "utils/datatypes";


function AdminCourseDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [statusList] = useState([
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
		
	]);

	const [levelList] = useState([
		{ text: "Under Graduation", value: "1" },
		{ text: "Post Graduation", value: "2" },
		{ text: "Doctoral", value: "3" },
	]);
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),
		course_name: yup
			.string()
			.required("Course Name is required"),	
		course_shortcode: yup
			.string()
			.required("Course Name is required"),
		course_level: yup
			.string()
			.required("Course Level is required"),		
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
	} = useForm<TCourseFormData>({
		resolver: yupResolver(schema)
		
	});

	let {
		isLoading,
		data: courseDetails,
		refetch: fetchAdminCourseDetails,
		isFetching: isFetchingAdminCourseDetails,
		remove,
	} = getCourse({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchAdminCourseDetails();
		} else {
			courseDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(courseDetails?.data);
		trigger();
	}, [courseDetails]);

	console.log("courseDetails", errors);

	const { mutate } = useMutation(createCourse, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Course Created Successfully",
				id: "create_course_success",
			});
			navigate("/admin/courses");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_course" });
		},
	});
	const onSubmit = (data: TCourseFormData) => {
		mutate(data);
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	
	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/courses");
	  };

	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Input
							placeholder="Enter Course Name"
							name={"course_name"}
							label={"Course Name"}
							error={errors?.course_name?.message}
							register={register}							
						/>
					</div>
					<div className="col-span-1">
						<Input
							placeholder="Enter Course Short Code"
							name={"course_shortcode"}
							label={"Course Short Code"}
							error={errors?.course_shortcode?.message}
							register={register}							
						/>
					</div>
					<div className="col-span-1">
						<Select
							name={"course_level"}
							label={"Course Level"}
							items={levelList}
							error={errors?.course_level?.message}
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

export default AdminCourseDetails;
