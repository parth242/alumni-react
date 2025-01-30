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
import { CustomerType, IUser, TSelect, ICountry, IState, IIndustry, IProfessionalskill } from "utils/datatypes";
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
import { useProfessionalskills } from "api/services/professionalskillService";
import { useIndustrys,createUserCompany } from "api/services/industryService";






function Company() {

	const [isDivVisible, setIsDivVisible] = useState(true);
	

	const toggleDivVisibility = () => {
		setIsDivVisible(!isDivVisible);
	  };


	const schema = yup.object().shape({
		
		company_name: isDivVisible
				? yup.string().required("Company Name is required")
				: yup.string(),

		position: isDivVisible
				? yup.string().required("Position is required")
				: yup.string(),	

		company_start_period: isDivVisible
        		? yup.string().test('is-lessar', 'Period Start must be lessar than Period End', function (company_start_period) {
            const company_end_period = this.resolve(yup.ref('company_end_period'));
            // If either value is not a number, don't perform the comparison
            if (isNaN(company_start_period) || isNaN(company_end_period) || company_end_period === '') {
                return true; // Skip validation
            }
            return company_end_period > company_start_period;
        })
		: yup.string(),

    	company_end_period: isDivVisible
        		? yup.string().test('is-greater', 'Period End must be greater than Period Start', function (company_end_period) {
            const company_start_period = this.resolve(yup.ref('company_start_period'));
            // If either value is not a number, don't perform the comparison
            if (company_end_period === '') {
                return true; // Skip validation
            } else {
                return company_end_period > company_start_period;
            }
			})
			: yup.string(),
	});

	

	const {
		register,		
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema)		
	});
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
	

	
	const {
		data: industrys,
		refetch: fetchindustryListData,
		isFetching: isFetchingIndustryListData,
	} = useIndustrys({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (industrys) {
			const industryList = industrys.data.map((item: IIndustry) => { return { text: item.industry_name, value: item.id } }) as TSelect[];
			setIndustryList([...industryList]);
		} else {
			setIndustryList([]);
		}
	}, [industrys]);

	const {
		data: professionalskills,
		refetch: fetchprofessionalskillListData,
		isFetching: isFetchingProfessionalskillListData,
	} = useProfessionalskills({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (professionalskills) {
			const professionalskillsList = professionalskills.data.map((item: IProfessionalskill) => { return { text: item.skill_name, value: item.id } }) as TSelect[];
			setProfessionalSkillList([...professionalskillsList]);
		} else {
			setProfessionalSkillList([]);
		}
	}, [professionalskills]);

	
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

	const { isLoading, mutate, isError, error } = useMutation(createUserCompany, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Company Added Successfully",
				id: "create_user_success",
			});
			navigate("/admin/dashboard");
		},
		onError: async (err: HTTPError) => {
			setLoginSuccess(false);
			const error = await err.response.text();
			setLoginErrorMsg(JSON.parse(error).message);
		},
	});
	const onSubmit = (data: any) => {
		if (isDivVisible) {
			// If inputs are visible, validate them as required
			schema.validate({ company_name: companyName })
      .then(() => {
        console.log("Validation succeeded");
        // Proceed with your logic
      })
      .catch((err) => {
        console.error("Validation failed:", err.errors);
        // Handle validation errors
      });
		  }
		  const storedUserData = localStorage.getItem('user');

			if (storedUserData) {
				const userData = JSON.parse(storedUserData);
				var userId = userData.id;
				}
	  	  data.user_id = userId;
		  data.industry_id = selectedValuesIndustry;
		  data.skill_id = selectedValuesSkill;
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

  <div className="profile-completion-step-ind completed"><div className="profile-completion-step completed">3</div><span>Contact Details</span></div>

  <div className="profile-completion-step-ind current"><div className="profile-completion-step current">4</div><span>Company Details</span></div>

</div>
						<div className="flex min-h-full items-center justify-center text-gray-700 dark:text-darkSecondary sm:px-6 lg:px-8">
							<div className="w-full max-w-md space-y-6">
								
									<>
									<h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-darkPrimary">Company Details</h2>
										<input type="hidden" name="remember" defaultValue="true" />
										<div className="-space-y-px rounded-md">
										

											<div>
      <h3>Current / Latest Work Details</h3>
	  <p>Please enter your Current Work details & Work Experience details</p>

	  <div className="relative mb-5">
		<input id={"working"} type="checkbox" defaultValue="1" className="focus:ring-0 rounded" onChange={toggleDivVisibility} />
		<label> I am not working anywhere</label>	
	  </div>
	  {isDivVisible && (
	  <div className="companydiv">
	  <div className="relative mb-5">
											<Input
												{...register('company_name')}												
												label="Company Name"
												register={register}													
												error={errors?.company_name?.message}												
											/>										
															
										</div>
										
										<div className="relative mb-5">
											<Input
												{...register('position')}
												name="position"
												label="Position"
												register={register}													
												error={errors?.position?.message}										
											/>
										</div>
										
										<div className="relative mb-5">
										<label
										htmlFor="username"
										className="block text-sm font-medium leading-6 text-gray-900 dark:text-white  ">
										Time Period
									</label>
										<Select
												name={"company_start_period"}
												items={fromyearList}
												register={register}
												error={errors?.company_start_period?.message}
											/>

										<Select
												name={"company_end_period"}
												items={toyearList}
												register={register}
												error={errors?.company_end_period?.message}
											/>
											
										</div>
										</div>
										 )}
										<div className="relative mb-5">
											<div className="row">
												<div className="col-6">
										<label
											htmlFor="username"
											className="block text-sm font-medium leading-6 text-gray-900 dark:text-white  ">
											Total years of relevant experience
										</label>
										<Select
												name={"total_experience"}
												items={expList}													
												register={register}
											/>
											</div>
											<div className="col-6">
											Years
											</div>
											
										</div>
										</div>
										<div className="relative mb-5">
											<SelectMulti
												{...register('industry_id')}
												name={"industry_id"}
												label={"Industry"}
												items={industryList}
												register={register}
												onChange={handleIndustry}
											/>
										</div>
										<div className="relative mb-5">
											<SelectMulti
											   {...register('skill_id')}
												name={"skill_id"}
												label={"Professional Skill"}
												items={professionalskillList}
												register={register}
												onChange={handleSkill}
											/>
										</div>
    </div>
											
										</div>

										

										<div className="relative">
										<Link to={'/contact'}>Back</Link>
											<button
												type="submit"
												className="group relative mb-3 flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
												Submit for Approval
											</button>
											<Link to={'/admin/dashboard'}>Skip & Go to Next Step</Link>
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

export default Company;
