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
import { getFeed, createFeed } from "api/services/feedService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TFeedFormData, ICourse, TSelect } from "utils/datatypes";
import { useCourses } from "api/services/courseService";
import Textarea from "components/ui/common/Textarea";


function FeedDetails() {
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
	} = useForm<TFeedFormData>({
		resolver: yupResolver(schema)
		
	});

	let {
		isLoading,
		data: feedDetails,
		refetch: fetchFeedDetails,
		isFetching: isFetchingFeedDetails,
		remove,
	} = getFeed({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchFeedDetails();
		} else {
			feedDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(feedDetails?.data);
		trigger();
	}, [feedDetails]);

	console.log("feedDetails", errors);

	const { mutate } = useMutation(createFeed, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "Feed Created Successfully",
				id: "create_feed_success",
			});
			navigate("/admin/feeds");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_feed" });
		},
	});
	const onSubmit = (data: TFeedFormData) => {
		mutate(data);
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	
	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/feeds");
	  };
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
					<Textarea
										placeholder="Enter Content"
										label={"Content"}
										name={"description"}
										register={register}
										rows={4}
									/>
					</div>
					<div className="col-span-1">
						<Input
							name={"feed_name"}
							label={"Feed Name"}
							
							register={register}							
						/>
					</div>
					<div className="col-span-1">
						<Input
							placeholder="Enter Feed Short Code"
							name={"feed_shortcode"}
							label={"Feed Short Code"}
							error={errors?.feed_shortcode?.message}
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

export default FeedDetails;
