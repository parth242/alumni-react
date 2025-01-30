import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate,useParams  } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import ProfileHeader from "components/layout/profileheader";
import ProfileSidebar from "components/layout/profilesidebar";
import React, { useEffect, useState  } from "react";
import {
	ErrorToastMessage, SuccessToastMessage,
	getMyDetails,
} from "api/services/user";
import { CustomerType, IUser, TResumeFormData } from "utils/datatypes";
import { useResumeAttachments, saveResumeAttachment, getResumeAttachment } from "api/services/resumeattachmentService";
import { HTTPError } from "ky";
import { InputProfile } from "components/ui/common/InputProfile";
import Select from "components/ui/common/Select";
import SelectMulti from "components/ui/common/SelectMulti";
import Textarea from "components/ui/common/Textarea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


function ResumeAttachmentUpdate() {

	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const EmailSchema = yup.object().shape({
		
		resume_title: yup.string().required("Title is required.")			
		
	});

	const { register,trigger,setValue, handleSubmit,reset, formState: { errors }, getValues } = useForm<TResumeFormData>({
		resolver: yupResolver(EmailSchema)
	});

	const [userData, setUserData] = useState<TResumeFormData | null>();	
	const [myuser, setMyUser] = useState<IUser | null>();	

	const getUserData = async () => {
				
		const userString = localStorage.getItem('user');
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
		} 
		
		
	};
	useEffect(() => {
		getUserData();
	}, []);

	let {
		isLoading,
		data: workDetails,
		refetch: fetchWorkDetails,
		isFetching: isFetchingWorkDetails,
		remove,
	} = getResumeAttachment({
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
		(_, index) => new Date().getFullYear() - index
	  );

	const [yearListStart] = useState([
		{ text: 'Select Start Year', value: 0 }, // Blank option
		...years.map((year) => ({ text: year, value: year }))
	  ]);

	const [yearListEnd] = useState([
		{ text: 'Present', value: 0 }, // Blank option
		...years.map((year) => ({ text: year, value: year }))
	  ]);

	const yearexp = Array.from(
		{ length: 65 },
		(_, index) => index
	  );

	  const [yearexperience] = useState(
		yearexp.map((yeare) => ({ text: yeare !== 0 ? yeare : "-Select-", value: yeare }))
	  );

	
	const { mutate, isError, error } = useMutation(createWork, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Work Added Successfully",
				id: "work_user_success",
			});
			navigate('/profile/work');
		},
		onError: async (e: HTTPError) => {
			
			ErrorToastMessage({ error: e, id: "work_user" });
		},
	});
	const onSubmit = (data:TCompanyFormData) => {
		
	  	data.user_id = Number(myuser?.id);
		
		
	  	mutate(data);   
		
	};
	
		
	return (
		
			
		<div className="text-sm">
		<SiteNavbar></SiteNavbar>
			<div className="bg-gray-100">		
			<ProfileHeader></ProfileHeader>	
			<div className="flex">	
			<ProfileSidebar></ProfileSidebar>
			<div className="flex-1 p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 mr-20">

				<div className="flex flex-col w-full">

					<div className="space-x-4 mb-6">
						<h2 className="text-xl">Work Details</h2>
						Please mention the company worked in
					</div>
					
					<div className="border-b border-gray-300"></div> 
				
				<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
				<div className="flex space-x-4 mb-6"> {/* Add mb-6 to create margin between the fields */}
					<InputProfile
							placeholder="Enter your Company Name"
							label={`Company Name :`}
							name={"company_name"}						
							register={register}
							error={errors?.company_name?.message}
						/>	
									
				</div>

				<div className="flex space-x-4 mb-6"> {/* Add mb-6 to create margin between the fields */}
					<InputProfile
							placeholder="Enter your Position"
							label={`Position :`}
							name={"position"}						
							register={register}							
						/>	
									
				</div>

				<div className="flex space-x-4 mb-6"> {/* Add mb-6 to create margin between the fields */}
				<div className="mr-4">
							<label htmlFor="period" className="mb-1 font-semibold">
								Period :
							</label>
						</div>
						<Select
								name={"company_start_period"}
								items={yearListStart}
								error={errors?.company_start_period?.message}
								register={register}
							/>
						<Select
								name={"company_end_period"}
								items={yearListEnd}
								error={errors?.company_end_period?.message}
								register={register}
							/>									
				</div>

				<div className="flex space-x-4 mb-6"> {/* Add mb-6 to create margin between the fields */}
					<InputProfile
							placeholder="Enter Location"
							label={`Location :`}
							name={"company_location"}						
							register={register}							
						/>	
									
				</div>
				
				<div className="flex space-x-4 mb-6">
						<button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" type="submit">
							Submit
						</button>
						<Link
							to={"/profile/work"}
							className={`rounded-md border border-transparent p-2 text-sm font-medium underline`}
							>
							Cancel
						</Link>
					</div>
				</form>
				
				
				
			
				</div>
				
				</div>
				</div>
			</div>
		</div>
		
	);
}

export default ResumeAttachmentUpdate;
