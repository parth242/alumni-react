import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import Navbar from "components/layout/navbar";
import React, { useEffect, useState  } from "react";
import {
	ErrorToastMessage, SuccessToastMessage,
	getMyDetails,
} from "api/services/user";
import LoginSidebar from "components/layout/loginSidebar";
import { CustomerType, IUser, TSelect, ICourse } from "utils/datatypes";
import { patterns } from "utils/consts";
import { HTTPError } from "ky";
import { Form } from "components/ui/common/Form";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import SelectMulti from "components/ui/common/SelectMulti";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLogo from "components/layout/AuthLogo";
import { RegisterType } from "utils/types/user-types";
import { classNames } from "utils";
import Loader from "components/layout/loader";
import { useCourses,createUserCourse } from "api/services/courseService";


function Courses() {
	const {
		register,
		control,
		handleSubmit,
		getValues,
		formState: { errors },
	} =  useForm({
		defaultValues: {
		  items: [{ course_id: '', end_date: '' }], // Initial item with empty values
		},
	  });

	  const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	  });

	const navigate = useNavigate();
	const [loginResponse, setLoginResponse] = useState<{ company: string }>();
	const [{ user, selectedCustomer }, setAppState] = useAppState();
	const [loginSuccess, setLoginSuccess] = useState<boolean | null>(false);
	const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);
	const [customersList, setCustomersList] = useState<CustomerType[] | null>();
	const [userData, setUserData] = useState<IUser | null>();

	

	const [courseList, setCourseList] = useState<TSelect[]>([]);
	
	
	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index
	  );
	  const [yearList] =  useState(
		years.map((year) => (
		{ text: year, value: year }
		))
	);

	const expnum = Array.from(
		{ length: 50 },
		(_, index) => index
	  );
	  const [expList] =  useState(
		expnum.map((year) => (
		{ text: year, value: year }
		))
	);

	

	
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
			const courseList = courses.data.map((item: ICourse) => { return { text: item.course_name, value: item.id } }) as TSelect[];
			setCourseList([...courseList]);
		} else {
			setCourseList([]);
		}
	}, [courses]);

	

	
	
  
  

	const getUserData = async () => {
		const userDataResponse = (await getMyDetails()) as IUser;
		setUserData(userDataResponse);

		console.log("userDataResponse", userDataResponse);
		localStorage.setItem("user", JSON.stringify(userDataResponse));
		setAppState({ user: userDataResponse });
		

	};
	useEffect(() => {
		getUserData();
	}, []);
	const { isLoading, mutate, isError, error } = useMutation(createUserCourse, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Course Added Successfully",
				id: "create_user_success",
			});
			navigate("/company");
		},
		onError: async (err: HTTPError) => {
			setLoginSuccess(false);
			const error = await err.response.text();
			setLoginErrorMsg(JSON.parse(error).message);
		},
	});
	const onSubmit = (data:any) => {
		const isValid = data.items.every((item:any) => item.course_id && item.end_date);
    if (isValid) {
      console.log(data); // Submit your data here
	  const storedUserData = localStorage.getItem('user');

			if (storedUserData) {
				const userData = JSON.parse(storedUserData);
				var userId = userData.id;
				}
	  data.user_id = userId;
	  data.coursedata = data.items;
	  mutate(data);
    } else {
      console.log('Please select values for all selection boxes.');
	  return false;
    }
		
	};
	
	const proceedLogin = async () => {
		navigate("/admin/dashboard");


	};

	return (
		
			
		<div className="text-sm">
		<Navbar></Navbar>
			{isLoading && <Loader></Loader>}
			<div className="">
				
				<div className="col-span-12 animate-fade bg-white dark:bg-dark2">
					<Form
						register={register}
						onSubmit={onSubmit}
						handleSubmit={handleSubmit}						
						className={"h-screen"}>
					<div className="profile-completion-container">

<h1><b>Complete your profile</b></h1>
<p>Quick four steps to complete your profile!</p>

<div className="profile-completion-steps">

  <div className="profile-completion-step-ind completed"><div className="profile-completion-step completed">1</div><span>Photograph</span></div>

  <div className="profile-completion-step-ind current"><div className="profile-completion-step current">2</div><span>Additional Education</span></div>

  <div className="profile-completion-step-ind"><div className="profile-completion-step">3</div><span>Contact Details</span></div>

  <div className="profile-completion-step-ind"><div className="profile-completion-step">4</div><span>Company Details</span></div>

</div>
						<div className="flex min-h-full items-center justify-center text-gray-700 dark:text-darkSecondary sm:px-6 lg:px-8">
							<div className="w-full max-w-md space-y-6">

							<h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-darkPrimary">Additional Educational Details</h2>
							<button type="button" onClick={() => append({ course_id: '', end_date: '' })}>Add New</button>
										<input type="hidden" name="remember" defaultValue="true" />
										<div className="-space-y-px rounded-md">
										
										{fields.map((item, index) => (
        <div key={item.id}>
         <div className="relative mb-5">
										<Select
												{...register(`items.${index}.course_id`, { required: true })}
												label={"Course Degree"}
												items={courseList}
												defaultValue={item.course_id}
												register={register}		
												error={errors?.items?.[index]?.course_id && <p>This field is required.</p>}										
											/>
											
								</div>
										<div className="relative mb-5">
										<Select
												{...register(`items.${index}.end_date`, { required: true })}
												label={"End Date (left / will leave in)"}
												items={yearList}
												defaultValue={item.end_date}
												register={register}
												error={errors?.items?.[index]?.end_date && <p>This field is required.</p>}	
											/>
											
										</div>
          
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
     
											
										</div>

										

										<div className="relative">
										<Link to={'/profilephoto'}>Back</Link>
											<button												
												type="submit"
												className="group relative mb-3 flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
												Submit & Continue
											</button>
											<Link to={'/contact'}>Skip & Go to Next Step</Link>
										</div>
										
									
							</div>
						</div>
						</div>
					</Form>
				</div>
			</div>
		</div>
		
	);
}

export default Courses;
