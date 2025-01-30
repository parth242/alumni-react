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
import { getDepartment, createDepartment } from "api/services/departmentService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TDepartmentFormData, ICourse, TSelect } from "utils/datatypes";
import { useCourses } from "api/services/courseService";


function DepartmentDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [courseList, setCourseList] = useState<TSelect[]>([]);	
	const [selectedCourse, setSelectedCourse] = useState<number>(0);

	const [statusList] = useState([
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
		
	]);
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),
		course_id: yup
			.number()
			.typeError("Course is required")
			.nullable()
			.required("Course is required."),
		department_name: yup
			.string()
			.required("Department Name is required"),	
		department_shortcode: yup
			.string()
			.required("Department Name is required"),
		status: yup
			.string()
			.required("Status is required").default("active"),
		
	});

	const {
		data: courses,
		refetch: fetchcourseListData,
		isFetching: isFetchingCourseListData,
	} = useCourses({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		
		if (courses) {
			const courseList = courses.data.map((item: ICourse) => {				
				return { text: item.course_name, value: item.id };
			}) as TSelect[];
			setCourseList(courseList);
		} 
	}, [courses]);

	const {
		trigger,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TDepartmentFormData>({
		resolver: yupResolver(schema)
		
	});

	let {
		isLoading,
		data: departmentDetails,
		refetch: fetchDepartmentDetails,
		isFetching: isFetchingDepartmentDetails,
		remove,
	} = getDepartment({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchDepartmentDetails();
		} else {
			departmentDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(departmentDetails?.data);
		trigger();
	}, [departmentDetails]);

	console.log("departmentDetails", errors);

	const { mutate } = useMutation(createDepartment, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Department Created Successfully",
				id: "create_department_success",
			});
			navigate("/admin/departments");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_department" });
		},
	});
	const onSubmit = (data: TDepartmentFormData) => {
		mutate(data);
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	
	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/departments");
	  };
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Select
							name={"course_id"}
							label={"Course"}
							items={courseList}
							error={errors?.course_id?.message}
							register={register}
						/>
					</div>
					<div className="col-span-1">
						<Input
							placeholder="Enter Department Name"
							name={"department_name"}
							label={"Department Name"}
							error={errors?.department_name?.message}
							register={register}							
						/>
					</div>
					<div className="col-span-1">
						<Input
							placeholder="Enter Department Short Code"
							name={"department_shortcode"}
							label={"Department Short Code"}
							error={errors?.department_shortcode?.message}
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

export default DepartmentDetails;
