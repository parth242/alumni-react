import { InputProfile } from "components/ui/common/InputProfile";
import Select from "components/ui/common/Select";
import TabsComponent from "components/ui/common/TabsComponent";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
	LocationProfileUpdate,
	getUserDetails,
} from "api/services/user";
import { TSelect, ICountry, IState, LocationProfile } from "utils/datatypes";
import { useCountrys } from "api/services/countryService";
import { useStates } from "api/services/stateService";
import { HTTPError } from "ky";

const AlumniLocation = () => {
	const { id } = useParams() as {
		id: string;
	};

	const EmailSchema = yup.object().shape({
		address1: yup
			.string()
			.required("Address1 is required"),
		country_mobileno_code: yup
			.string()
			.required("Country Code is required"),
		mobileno: yup
			.string()
			.required("Mobile number is required")
			.matches(/^[0-9]+$/, "Mobile number must contain only digits")
			.min(10, "Mobile number must be at least 10 digits")
			.max(12, "Mobile number can't be more than 12 digits"),
	});

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },		
	} = useForm<LocationProfile>({
		resolver: yupResolver(EmailSchema),
	});	

	const [userData, setUserData] = useState<LocationProfile | null>();
	const [selectedDate, setSelectedDate] = useState("");
	const [countryList, setCountryList] = useState<TSelect[]>([]);
	const [countryPhoneCode, setCountryPhoneCode] = useState<TSelect[]>([]);
	const [stateList, setStateList] = useState<TSelect[]>([]);
	const [selectedCountry, setSelectedCountry] = useState<number>(0);
	const [selectedState, setSelectedState] = useState<number>(0);
	const [selectedCountrySecond, setSelectedCountrySecond] =
		useState<number>(0);
	const [selectedStateSecond, setSelectedStateSecond] = useState<number>(0);
	const [stateSecondList, setStateSecondList] = useState<TSelect[]>([]);

	const navigate = useNavigate();
	

	let {
		isLoading,
		data: userDetails,
		refetch: fetchUserDetails,
		isFetching: isFetchingUserDetails,
		remove,
	} = getUserDetails({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchUserDetails();
		} else {
			userDetails = undefined;
			setTimeout(() => {
				reset();
			});
		}
	}, [id]);
	useEffect(() => {
		reset(userDetails?.data as LocationProfile);
		trigger();
	}, [userDetails]);


	const {
		data: countrys,
		refetch: fetchcountryListData,
		isFetching: isFetchingCountryListData,
	} = useCountrys({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		const defaultOption = { text: "Select Country", value: 0 };
		const defaultOptionCode = { text: "Select Country Code", value: 0 };
		if (countrys) {
			const countryList = countrys.data.map((item: ICountry) => {
				return { text: item.country_name, value: item.id };
			}) as TSelect[];

			setCountryList([defaultOption, ...countryList]);

			const countryPhoneCode = countrys.data
				.map((item: ICountry) => {
					if (item?.country_phone_code > 0) {
						return {
							text:
								item.country_name +
								" (+" +
								item.country_phone_code +
								")",
							value: item.country_phone_code,
						};
					}
				})
				.filter(Boolean) as TSelect[];
			if (countryPhoneCode.length > 0) {
				setCountryPhoneCode([defaultOptionCode, ...countryPhoneCode]);
			} else {
				// Return empty text and value
				setCountryPhoneCode([defaultOptionCode]);
			}
		} else {
			setCountryList([defaultOption]);
			setCountryPhoneCode([defaultOptionCode]);
		}
	}, [countrys]);

	

	const {
		data: states,
		refetch: fetchstateListData,
		isFetching: isFetchingStateListData,
	} = useStates({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		const defaultOption = { text: "Select State", value: 0 };
		if (states) {
			const statesList = states.data
				.map((item: IState) => {
					if (selectedCountry && selectedCountry > 0) {
						if (
							Number(item.country_id) === Number(selectedCountry)
						) {
							return { text: item.state_name, value: item.id };
						}
					}
				})
				.filter(Boolean) as TSelect[];

			if (statesList.length > 0) {
				setStateList([defaultOption, ...statesList]);
				console.log('stateList',statesList.length);
				
				
			} else {
				// Return empty text and value
				setStateList([defaultOption]);
			}
			
		} else {
			setStateList([defaultOption]);
		}
		
           
		
	}, [states, selectedCountry]);

	const {
		data: statesecond,
		refetch: fetchstatesecondListData,
		isFetching: isFetchingStateSecondListData,
	} = useStates({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		const defaultOption = { text: "Select State", value: 0 };
		if (statesecond) {
			const statesecondList = statesecond.data
				.map((item: IState) => {
					if (selectedCountrySecond && selectedCountrySecond > 0) {
						if (
							Number(item.country_id) ===
							Number(selectedCountrySecond)
						) {
							return { text: item.state_name, value: item.id };
						}
					}
				})
				.filter(Boolean) as TSelect[];

			if (statesecondList.length > 0) {
				setStateSecondList([defaultOption, ...statesecondList]);
			} else {
				// Return empty text and value
				setStateSecondList([defaultOption]);
			}
		} else {
			setStateSecondList([defaultOption]);
		}
		
		
	}, [statesecond, selectedCountrySecond]);


	useEffect(() => {
		setSelectedCountry(Number(userDetails?.data?.country_id));
		setSelectedCountrySecond(Number(userDetails?.data?.country2_id));
		setSelectedState(Number(userDetails?.data?.state_id));
		setSelectedStateSecond(Number(userDetails?.data?.state2_id));
		
		
	}, [userDetails?.data]);

	
	useEffect(() => {
		setValue('country_id',Number(userDetails?.data.country_id));
		setValue('country_mobileno_code',Number(userDetails?.data.country_mobileno_code));
		setValue('country_workno_code',Number(userDetails?.data.country_workno_code));
		if(stateList.length>1){
			setValue('state_id',Number(userDetails?.data.state_id));
		}
		
		
	}, [stateList]);

	useEffect(() => {
		setValue('country2_id',Number(userDetails?.data.country2_id));
		if(stateSecondList.length>1){
			setValue('state2_id',Number(userDetails?.data.state2_id));
		}
		
		
	}, [stateSecondList]);
	

	const [relationshipList] = useState([
		{ text: "No Answer", value: "No Answer" },
		{ text: "Single", value: "Single" },
		{ text: "Married", value: "Married" },
		{ text: "Committed", value: "Committed" },
	]);	

	const handleDateChange = (event: any) => {
		setSelectedDate(event.target.value);
	};

	const handleCountryChange = (selectedCountry: any) => {
		console.log("countrytest");
		//setSelectedState(''); // Reset state selection when country changes
		setSelectedCountry(selectedCountry.target.value);
		
		//fetchstateListData();
	};

	// Event handler for state selection change
	const handleStateChange = (selectedState: any) => {
		setSelectedState(selectedState.target.value);
	};

	const handleCountrySecondChange = (selectedCountrySecond: any) => {
		setSelectedCountrySecond(selectedCountrySecond.target.value);
	};

	// Event handler for state selection change
	const handleStateSecondChange = (selectedStateSecond: any) => {
		setSelectedStateSecond(selectedStateSecond.target.value);
	};

	const { mutate, isError, error } = useMutation(LocationProfileUpdate, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Location and Contact Profile Updated Successfully",
				id: "update_user_success",
			});
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "update_user" });
		},
	});
	const onSubmit = (data: LocationProfile) => {
		data.id = Number(id);
		//console.log('dataprofile',data);
		// return false;
		mutate(data);
	};

	return (
		<div className="">
			<div className="inline-block w-full border-b border-border">
				<TabsComponent />
			</div>
			<form className="flex flex-col gap-4 mt-10" onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4 sm:flex-row text-sm">
					<div className="w-full">
						<label className="mb-3 inline-block ">Address</label>
						<InputProfile
							placeholder="H.No, Building Name, Street"
							name={"address1"}
							register={register}
							className="w-full text-sm h-11 border-gray-100"
						/>
					</div>
					<div className="w-full">
						<label className="mb-3 inline-block ">Country</label>

						<Select
							name={"country_id"}
							items={countryList}
							register={register}
							onChange={handleCountryChange}
						/>
					</div>
					<div className="w-full">
						<label className="mb-3 inline-block ">State</label>
						<Select
							name={"state_id"}
							items={stateList}
							register={register}
							onChange={handleStateChange}
							
						/>
					</div>
					<div className="w-full">
						<label className="mb-3 inline-block ">City</label>
						<InputProfile
							placeholder="Enter City"
							name={"city"}
							register={register}
							className="w-full text-sm h-11 border-gray-100"
						/>
					</div>
				</div>
				<div>
					<h2 className="font-bold mb-2">
						Address For Correspondence
					</h2>
					<hr />
				</div>
				<div className="flex flex-col gap-4 sm:flex-row text-sm">
					<div className="w-full">
						<label className="mb-3 inline-block ">Address</label>
						<InputProfile
							placeholder="H.No, Building Name, Street"
							name={"address2"}
							register={register}
							className="w-full text-sm h-11 border-gray-100"
						/>
					</div>
					<div className="w-full">
						<label className="mb-3 inline-block ">Country</label>

						<Select
							name={"country2_id"}
							items={countryList}
							register={register}
							onChange={handleCountrySecondChange}
						/>
					</div>
					<div className="w-full">
						<label className="mb-3 inline-block ">State</label>
						<Select
							name={"state2_id"}
							items={stateSecondList}
							register={register}
							onChange={handleStateSecondChange}
							defaultValues={selectedStateSecond}
						/>
					</div>

					<div className="w-full">
						<label className="mb-3 inline-block ">City</label>
						<InputProfile
							placeholder="Enter City"
							name={"city2"}
							register={register}
							className="text-sm w-full  h-11 border-gray-100"
						/>
					</div>
				</div>
				<div>
					<h2 className="font-bold mb-2">Contact Details</h2>
					<hr />
				</div>
				<div className="flex flex-col gap-4 sm:flex-row text-sm">
					<div className="w-full">
						<label className="mb-3 inline-block ">
							Personal Phone No
						</label>
						<div className="flex gap-4">
							<div>
								<Select
									name={"country_mobileno_code"}
									items={countryPhoneCode}
									register={register}
								/>
							</div>
							<div>
								<InputProfile
									placeholder="Enter Mobile Number"
									name={"mobileno"}
									type={"number"}
									register={register}
									className="text-sm h-11 border-gray-100"
								/>
							</div>
						</div>
					</div>
					<div className="w-full">
						<label className="mb-3 inline-block ">
							Work Phone No
						</label>
						<div className="flex gap-4">
							<div>
								<Select
									name={"country_workno_code"}
									items={countryPhoneCode}
									register={register}
								/>
							</div>
							<div>
								<InputProfile
									placeholder="Enter Work Phone Number"
									name={"work_phone_no"}
									type={"number"}
									register={register}
									className="text-sm h-11 border-gray-100"
								/>
							</div>
						</div>
					</div>
				</div>
				<div>
					<h2 className="font-bold mb-2">Social Profile</h2>
					<hr />
				</div>
				<div className="flex flex-col gap-4 sm:flex-row text-sm">
					<div className="w-full">
						<label className="mb-3 inline-block ">
							Linkedin URL
						</label>
						<InputProfile
							placeholder="Enter LinkedIn URL"
							name={"linkedin_url"}
							register={register}
							className="w-full text-sm h-11 border-gray-100"
						/>
					</div>
					<div className="w-full">
						<label className="mb-3 inline-block ">
							Facebook URL
						</label>
						<InputProfile
							placeholder="Enter Facebook URL"
							name={"facebook_url"}
							register={register}
							className="w-full text-sm h-11 border-gray-100"
						/>
					</div>
					<div className="w-full">
						<label className="mb-3 inline-block">
							Instagram URL
						</label>
						<InputProfile
							placeholder="Enter Instagram URL"
							name={"instagram_url"}
							register={register}
							className="w-full text-sm h-11 border-gray-100"
						/>
					</div>
					<div className="w-full">
						<label className="mb-3 inline-block">Youtube URL</label>
						<InputProfile
							placeholder="Enter Youtube URL"
							name={"youtube_url"}
							register={register}
							className="w-full text-sm h-11 border-gray-100"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row text-sm">
					<div className="w-full">
						<label className="mb-3 inline-block ">
							Twitter URL
						</label>
						<InputProfile
							placeholder="Enter Twitter URL"
							name={"twitter_url"}
							register={register}
							className="w-full text-sm h-11 border-gray-100"
						/>
					</div>
				</div>
				<div>
							<h2 className="font-bold mb-2">Login Details</h2>
							<hr />
						</div>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<label className="mb-3 inline-block ">
									Login Email ID : <b>{userDetails?.data?.email}</b>{" "}
									{/* <Link
										to="/email_change"
										className="font-medium hover:underline underline">
										Click here
									</Link>{" "}
									to update login email address */}
								</label>

								<InputProfile
									label="Alternate Email ID"
									placeholder="Enter Alternate Email Id"
									name={"email_alternate"}
									register={register}
									className="mt-2 w-full text-sm h-11 border-gray-100"
								/>
							</div>
						</div>
				<Button
					type="submit"
					style={{
						backgroundColor: "#440178",
						width: "100%",
					}}>
					Submit
				</Button>
			</form>
		</div>
	);
};

export default AlumniLocation;
