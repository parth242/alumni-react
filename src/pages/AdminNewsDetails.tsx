import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import Textarea from "components/ui/common/Textarea";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage, useUploadImage } from "api/services/user";
import { getNews,createNews } from "api/services/newsService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TNewsFormData,INews, TSelect,IGroup} from "utils/datatypes";
import { useGroups } from "api/services/groupService";
import SelectMulti from "components/ui/common/SelectMulti";


function AdminNewsDetails() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const [userId, setUserId] = useState(0);

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(0);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [groups, setGroups] = useState<TSelect[]>([]);
	const [selectedValuesGroup, setSelectedValuesGroup] = useState<
		TSelect[]
	>([]);
	
	const [statusList] = useState([
		{ text: "Active", value: "active" },
		{ text: "Inactive", value: "inactive" },
	]);
	
		
	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);			
			setUserId(items.id);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	const {
		data: groupList,
		refetch: fetchGroupList,
		isFetching: isFetchingGroupList,
	} = useGroups({
		enabled: userId>0,
		filter_status: activeStatus,
		filter_name: searchText,	
		user_id: userId,
		page_number: pageNumber,
		page_size: pageSize.value,
	}) || [];
	useEffect(() => {
		if (groupList) {
			const groupsList = groupList.data.map(
				(item: IGroup) => {
					return { text: item.group?.group_name, value: item.id };
				},
			) as TSelect[];
			setGroups([...groupsList]);
		} else {
			setGroups([]);
		}
	}, [groupList]);

	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),

		title: yup
			.string()
			.required("News Title is required")
			.min(3, "Must be more then 3 character"),			
		

		posted_date: yup
			.string()
			.required("Posted Date is required"),

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
	} = useForm<TNewsFormData>({
		resolver: yupResolver(schema)		
	});

	
	let {
		isLoading,
		data: newsDetails,
		refetch: fetchAdminNewsDetails,
		isFetching: isFetchingAdminNewsDetails,
		remove,
	} = getNews({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchAdminNewsDetails();
		} else {
			newsDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(newsDetails?.data);
		trigger();
	}, [newsDetails]);

	console.log("newsDetails", newsDetails);

	const { mutate } = useMutation(createNews, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "News Created Successfully",
				id: "create_news_success",
			});
			navigate("/admin/news");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_news" });
		},
	});
	const onSubmit = (data: TNewsFormData) => {
		const storedUserData = localStorage.getItem('user');

		if (storedUserData) {
			const userData = JSON.parse(storedUserData);
			var userId = userData.id;
		}
		data.user_id = userId;
		data.news_url = '';
		data.group_id = JSON.stringify(data.group_id);
			mutate(data);
		
	};

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();

	const handleGroup = (selectedOptions: any) => {
		setSelectedValuesGroup(selectedOptions);

		const groupNumbers = selectedOptions.map((mn: any) => {
			return mn.value;
		});

		setValue && setValue("group_id", groupNumbers);
	};

	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/news");
	  };
	
	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>				

				<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-10">
					<div className="col-span-1">
						<Input
							placeholder="Enter News Title"
							name={"title"}
							label={"News Title"}
							register={register}
							error={errors?.title?.message}
						/>
					</div>

										
					<div className="col-span-1">
						
						<Input
								type="date"
								name={"posted_date"}
								label={"Posted Date"}
								register={register}
								error={errors?.posted_date?.message}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
					</div>

					<div className="col-span-1">
						<label
							htmlFor="group"
							className="block text-sm font-medium text-gray-700">
							Groups
						</label>
						<SelectMulti
							name={"group_id"}
							items={groups}							
							register={register}
							onChange={handleGroup}
							defaultValue={selectedValuesGroup}
							setValue={setValue}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

export default AdminNewsDetails;
