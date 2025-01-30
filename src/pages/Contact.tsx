import { authUser } from "api";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import React, { useEffect, useState } from "react";
import {
	ErrorToastMessage, SuccessToastMessage,
	getMyDetails,
} from "api/services/user";
import Navbar from "components/layout/navbar";
import LoginSidebar from "components/layout/loginSidebar";
import { CustomerType, IUser, TSelect, ICountry, IState, IIndustry, IProfessionalskill,SocialDataType } from "utils/datatypes";
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
import { SocialUserUpdate } from "api/services/user";



function Contact() {

	const [isDivVisible, setIsDivVisible] = useState(true);
	

	const toggleDivVisibility = () => {
		setIsDivVisible(!isDivVisible);
	  };


	

	const {
		register,		
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();
	const [loginResponse, setLoginResponse] = useState<{ company: string }>();
	const [{ user, selectedCustomer }, setAppState] = useAppState();
	const [loginSuccess, setLoginSuccess] = useState<boolean | null>(false);
	const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);
	const [customersList, setCustomersList] = useState<CustomerType[] | null>();
	const [userData, setUserData] = useState<IUser | null>();

	

	const [industryList, setIndustryList] = useState<TSelect[]>([]);
	const [professionalskillList, setProfessionalSkillList] = useState<TSelect[]>([]);

	
	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index
	  );
	  const [yearList] =  useState(
		years.map((year) => (
		{ text: year, value: year }
		))
	);

	const [fromyearList] = useState([
		{ text: 'From Year', value: '' }, // Blank option
		...years.map((year) => ({ text: year, value: year }))
	  ]);

	const [toyearList] = useState([
		{ text: 'Present', value: '' }, // Blank option
		...years.map((year) => ({ text: year, value: year }))
	  ]);

	const expnum = Array.from(
		{ length: 50 },
		(_, index) => index+1
	  );
	  
	const [expList] = useState([
		{ text: 'Select', value: '' }, // Blank option
		...expnum.map((year) => ({ text: year, value: year }))
	  ]);
	
	

	
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

	const [selectedValuesIndustry, setSelectedValuesIndustry] = useState([]);

	  const handleIndustry = (selectedOptions:any) => {
		
		const industryNumbers = selectedOptions.map((mn:any) => {
            return mn.value;
        });
		setSelectedValuesIndustry(industryNumbers);
		
	  };

	const [selectedValuesSkill, setSelectedValuesSkill] = useState([]);

	  const handleSkill = (selectedOptions:any) => {

		const skillNumbers = selectedOptions.map((mn:any) => {
            return mn.value;
        });
		setSelectedValuesSkill(skillNumbers);
		
	  };

	const { isLoading, mutate, isError, error } = useMutation(SocialUserUpdate, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Contact Added Successfully",
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
	const onSubmit = (data: SocialDataType) => {
		const storedUserData = localStorage.getItem('user');

			if (storedUserData) {
				const userData = JSON.parse(storedUserData);
				var userId = userData.id;
				}
	  	data.id = userId;
		mutate(data);
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

  <div className="profile-completion-step-ind completed"><div className="profile-completion-step completed">2</div><span>Additional Education</span></div>

  <div className="profile-completion-step-ind current"><div className="profile-completion-step current">3</div><span>Contact Details</span></div>

  <div className="profile-completion-step-ind"><div className="profile-completion-step">4</div><span>Company Details</span></div>

</div>
						<div className="flex min-h-full items-center justify-center text-gray-700 dark:text-darkSecondary sm:px-6 lg:px-8">
							<div className="w-full max-w-md space-y-6">
								
									<>
									<h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-darkPrimary">Contact Information</h2>
										<input type="hidden" name="remember" defaultValue="true" />
										
       <p>Please enter your social contact details</p>

	 
	  <div className="relative mb-5">
	  					<Input
							placeholder="Enter LinkedIn Profile"
							name={"linkedin_url"}
							label={"LinkedIn Profile"}
							register={register}
						/>									
															
										</div>
										
										<div className="relative mb-5">
										<Input
											placeholder="Enter Facebook URL"
											name={"facebook_url"}
											label={"Facebook URL"}
											register={register}
										/>
										</div>
										
										<div className="relative mb-5">
										<Input
											placeholder="Enter Twitter URL"
											name={"twitter_url"}
											label={"Twitter URL"}
											register={register}
										/>
										</div>

										<div className="relative mb-5">
										<Input
											placeholder="Enter Instagram URL"
											name={"instagram_url"}
											label={"Instagram URL"}
											register={register}
										/>
										</div>

										<div className="relative mb-5">
										<Input
											placeholder="Enter Youtube URL"
											name={"youtube_url"}
											label={"Youtube URL"}
											register={register}
										/>
										</div>
										
										<div className="relative">
										<Link to={'/course'}>Back</Link>
											<button
												type="submit"
												className="group relative mb-3 flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
												Submit & Continue
											</button>
											<Link to={'/company'}>Skip & Go to Next Step</Link>
										</div>
										
									</>
							
							</div>
						</div>
						</div>
						
					</Form>
				</div>
			</div>
		</div>
	);
}

export default Contact;
