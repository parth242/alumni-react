import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import SiteNavbar from "components/layout/sitenavbar";
import React, { useEffect, useState } from "react";
import { useUserData } from "api/services/user";
import { IUser, TSelect, ICourse, IDepartment } from "utils/datatypes";
import NotFound from "components/ui/common/NotFound";
import { pageStartFrom } from "utils/consts";
import { useCourses } from "api/services/courseService";
import {
	HiOutlineLibrary,
	HiOutlinePencil,
	HiUserCircle,
	HiOutlineCalendar,
	HiOutlineLocationMarker,
	HiSearch,
} from "react-icons/hi";
import { Button, Tabs, TextInput } from "flowbite-react";
import { FooterComponent } from "components/layout/Footer";
import CardUI from "components/ui/common/Card";
import { AiOutlineLoading } from "react-icons/ai";
import Select from "components/ui/common/Select";
import { useDepartments } from "api/services/departmentService";

function Members() {
	const {
		register,
		control,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			items: [{ course_id: "", end_date: "" }], // Initial item with empty values
		},
	});

	const navigate = useNavigate();
	const location = useLocation(); // Get location using useLocation hook

	const [courseList, setCourseList] = useState<TSelect[]>([]);
	const [departmentList, setDepartmentList] = useState<TSelect[]>([]);

	const perPage = 3;
	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });
	const [activeStatus, setActiveStatus] = useState("active");
	const [searchText, setSearchText] = useState("");

	const [users, setUsers] = useState<IUser[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<number>(0);
	const [selectedDepartment, setSelectedDepartment] = useState<number>(0);
	const [selectedEndYear, setSelectedEndYear] = useState<number>(0);
	const [isSearch, setIsSearch] = useState<number>(0);

	const [searchClearText, setSearchClearText] = useState("");
	const [selectedCourseText, setSelectedCourseText] = useState("");
	const [selectedDepartmentText, setSelectedDepartmentText] = useState("");
	const [selectedClearEndYear, setSelectedClearEndYear] = useState<number>(0);
	const [selectedCourseClearText, setSelectedCourseClearText] = useState("");
	const [selectedDepartmentClearText, setSelectedDepartmentClearText] = useState("");

	const handleSearchClick = () => {
		//console.log("Name Search:", searchInput);
		setPageNumber(pageStartFrom);

		// Perform search operation with searchInput value
	};

	const handleInputChange = (event: any) => {
		setSearchText(event.target.value);
	};

	const handleCourseChange = (e: any) => {
		//setSelectedState(''); // Reset state selection when country changes
		setSelectedCourse(e.target.value);
		if(e.target.value>0){
			setSelectedCourseText(e.target.options[e.target.selectedIndex].text);
		} else{
			setSelectedCourseText("");
		}
		
	};

	const handleDepartmentChange = (e: any) => {
		//setSelectedState(''); // Reset state selection when country changes
		setSelectedDepartment(e.target.value);
		if(e.target.value>0){
			setSelectedDepartmentText(e.target.options[e.target.selectedIndex].text);
		} else{
			setSelectedDepartmentText("");
		}
		
		//fetchstateListData();
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		//setSelectedState(''); // Reset state selection when country changes
		setSelectedEndYear(Number(e.target.value));
		//fetchstateListData();
	};

	const searchmembers = () => {
		
		setSearchClearText(searchText);
		setSelectedClearEndYear(selectedEndYear);		
		setSelectedCourseClearText(selectedCourseText);
		setSelectedDepartmentClearText(selectedDepartmentText);
		fetchUserList();
	};

	const years = Array.from(
		{ length: 50 },
		(_, index) => new Date().getFullYear() - index,
	);

	const [yearListEnd] = useState([
		{ text: "Select End Year", value: 0 }, // Blank option
		...years.map(year => ({ text: year, value: year })),
	]);

	const {
		isLoading,
		data: userList,
		refetch: fetchUserList,
		isFetching: isFetchingUserList,
	} = useUserData({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		filter_course: selectedCourse,
		filter_department: selectedDepartment,
		filter_endyear: selectedEndYear,
		page_number: pageNumber,
		page_size: pageSize.value,
		isalumni: 1,
	}) || [];

	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchUserList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchUserList();
	}, [pageNumber]);

	useEffect(() => {
		fetchUserList();
	}, [searchClearText,selectedClearEndYear,selectedCourseClearText,selectedDepartmentClearText]);

	const isAnyFilterCleared =
    searchClearText ||
    selectedCourseClearText ||
    selectedDepartmentClearText ||
    selectedClearEndYear > 0;

	const clearAllFilters = () => {
		setSearchClearText("");
		setSearchText("");
		setSelectedCourseClearText("");
		setSelectedCourseText("");
		setSelectedCourse(0);
		setSelectedDepartmentClearText("");
		setSelectedDepartmentText("");
		setSelectedDepartment(0);
		setSelectedClearEndYear(0);
		setSelectedEndYear(0);
	  };
	

	useEffect(() => {
		if (userList) {
			if (pageNumber == 1) {
				setUsers([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setUsers(prevUsers => [...prevUsers, ...userList.data]);
			setTotalRecords(userList.total_records);
			setCurrentRecords(
				prevCurrentRecords => prevCurrentRecords + userList.data.length,
			);
		} else {
			setUsers([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [userList]);

	console.log("userList", userList);

	
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
		const defaultOption = { text: "Select Course", value: 0 };
		if (courses) {
			const courseList = courses.data.map((item: ICourse) => {
				return { text: item.course_name, value: item.id };
			}) as TSelect[];
			setCourseList([defaultOption, ...courseList]);
		} else {
			setCourseList([defaultOption]);
		}
	}, [courses]);

	const {
		data: departments,
		refetch: fetchdepartmentListData,
		isFetching: isFetchingDepartmentListData,
	} = useDepartments({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		const defaultOption = {
			text: "Select Department",
			value: 0,
		};

		if (departments) {
			console.log("departments", departments.data);
			const departmentList = departments.data
				.map((item: IDepartment) => {
					if (selectedCourse && selectedCourse > 0) {
						if (Number(item.course_id) === Number(selectedCourse)) {
							return {
								text: item.department_name,
								value: item.id,
							};
						}
					} else{
						return {
							text: item.department_name,
							value: item.id,
						};
					}
				})
				.filter(Boolean) as TSelect[];

			if (departmentList.length > 0) {
				setDepartmentList([defaultOption, ...departmentList]);
			} else {
				// Return empty text and value
				setDepartmentList([defaultOption]);
			}
		} else {
			setDepartmentList([defaultOption]);
		}
	}, [departments, selectedCourse]);

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			{/* {isLoading && <Loader></Loader>} */}
			<div className="w-full mx-auto bg-gray-100 ">
				<div className="md:w-10/12 w-full mx-auto">
					<div className="relative overflow-x-auto py-6">
						<div className="w-full mx-auto rounded-lg px-3 ">
							<h1 className="md:text-3xl text-xl text-black font-bold mb-2">
								Members
							</h1>
							<p className="mb-8 md:text-lg text-sm font-semibold">
								Search and connect with friends, batchmates and
								other alumni or browse members by
							</p>
							<div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 items-center justify-center w-full">
								<div className="flex items-center rounded-md w-full max-w-xs p-2 ">
									<TextInput
										type="text"
										name="nameSearch"
										placeholder="Search by name"
										className="bg-transparent w-full border-0 focus:ring-0 outline-none"
										value={searchText}
										onChange={handleInputChange}
										icon={HiSearch}
									/>
								</div>

								<div className="flex items-center rounded-md w-full max-w-xs p-2 ">
									<Select
										name={"course_id"}
										items={courseList}
										register={register}
										onChange={handleCourseChange}
										className="bg-transparent w-full border-0 focus:ring-0 outline-none"
									/>
								</div>

								<div className="flex items-center rounded-md w-full max-w-xs p-2">
									<Select
										name={"department_id"}
										items={departmentList}
										register={register}
										onChange={handleDepartmentChange}
										className="bg-transparent w-full border-0 focus:ring-0 outline-none"
									/>
								</div>

								<div className="flex items-center rounded-md w-full max-w-xs p-2 ">
									<Select
									   defaultValue={selectedEndYear}
										name={"end_year"}
										items={yearListEnd}
										register={register}
										onChange={(e) => handleYearChange(e)}										
										className="bg-transparent w-full border-0 focus:ring-0 outline-none"
									/>
								</div>

								<div className="flex items-center rounded-md w-full max-w-xs p-2 ">
									<Button
										style={{ backgroundColor: "#440178" }}
										className="text-center text-white w-full"
										size="md"
										outline
										onClick={() => 
											searchmembers()  // First, set search to 1											
										  }>
										Search
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full mt-10">
				<div className="md:w-10/12 w-full mx-auto py-6 px-4 relative">
					<div className="flex flex-col md:flex-row justify-between  mb-8">
						<div className="flex flex-wrap items-center space-x-2">
						{searchClearText && (
							<button
								onClick={() => {
								setSearchClearText("");
								setSearchText("");
								}}
								className="text-sm text-gray-600 hover:text-gray-800"
							>
								{searchClearText} <span className="text-xs">✕</span>
							</button>
							)}
							{selectedCourseClearText && (
							<button
								onClick={() => {
								setSelectedCourseClearText("");
								setSelectedCourseText("");
								setSelectedCourse(0);
								}}
								className="text-sm text-gray-600 hover:text-gray-800"
							>
								{selectedCourseClearText} <span className="text-xs">✕</span>
							</button>
							)}
							{selectedDepartmentClearText && (
							<button
								onClick={() => {
								setSelectedDepartmentClearText("");
								setSelectedDepartmentText("");
								setSelectedDepartment(0);
								}}
								className="text-sm text-gray-600 hover:text-gray-800"
							>
								{selectedDepartmentClearText} <span className="text-xs">✕</span>
							</button>
							)}
							{selectedClearEndYear > 0 && (
							<button
								onClick={() => {
								setSelectedClearEndYear(0);
								setSelectedEndYear(0);
								}}
								className="text-sm text-gray-600 hover:text-gray-800"
							>
								{selectedClearEndYear} <span className="text-xs">✕</span>
							</button>
							)}
						</div>
						<span className="font-semibold md:text-lg text-sm">
							{totalRecords} Member(s) Found
						</span>
						{isAnyFilterCleared && (
							<div className="mt-2">
							<button
								onClick={clearAllFilters}
								className="text-sm text-red-600 hover:text-red-800 font-semibold"
							>
								Clear All <span className="text-xs">✕</span>
							</button>
							</div>
						)}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						<>
							{users && users.length ? (
								users.map((item: IUser, i: number) => {
									return (
										<div key={i}>
											<CardUI item={item} />
										</div>
									);
								})
							) : (
								<span>No any Records</span>
							)}
						</>
					</div>
					<div className="flex justify-center mt-10">
						{currentRecords < totalRecords && (
							<Button
								style={{ backgroundColor: "#440178" }}
								className="text-center text-white"
								size="md"
								outline
								isProcessing
								processingSpinner={
									<AiOutlineLoading className="h-6 w-6 animate-spin" />
								}
								onClick={() => setPageNumber(pageNumber + 1)}>
								Load More
							</Button>
						)}
					</div>
				</div>
			</div>
			<FooterComponent />
		</>
	);
}

export default Members;
