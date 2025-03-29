import App from "pages/App";
import AppSite from "pages/AppSite";
import Dashboard from "pages/Dashboard";
import ForgotPassword from "pages/ForgotPassword";
import Home from "pages/Home";
import Login from "pages/Login";
import Register from "pages/Register";
import ResetPassword from "pages/ResetPassword";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StateProvider, useAppState } from "utils/useAppState";
import AccessDisabled from "pages/AccessDisabled";
import Users from "pages/Users";
import UserDetails from "pages/UserDetails";
import Roles from "pages/Roles";
import Role from "pages/Role";
import Alumnis from "pages/Alumnis";
import AlumniDetails from "pages/AlumniDetails";
import Events from "pages/Events";
import EventDetails from "pages/EventDetails";
import Company from "pages/Company";
import Courses from "pages/Courses";
import Thankyou from "pages/Thankyou";
import ProfilePhoto from "pages/ProfilePhoto";
import Contact from "pages/Contact";
import AlumniDashboard from "pages/AlumniDashboard";
import Members from "pages/Members";
import Profile from "pages/Profile";
import Basic from "pages/Profile/Basic";
import LocationContact from "pages/Profile/LocationContact";
import Education from "pages/Profile/Education";
import EducationAdd from "pages/Profile/EducationAdd";
import EducationCourseAdd from "pages/Profile/EducationCourseAdd";
import Work from "pages/Profile/Work";

import WorkExperience from "pages/Profile/WorkExperience";
import WorkCompany from "pages/Profile/WorkCompany";
import Photo from "pages/Profile/Photo";
import ResumeAttachments from "pages/Profile/ResumeAttachments";
import Account from "pages/Profile/Account";
import AccountDelete from "pages/Profile/AccountDelete";
import Achievement from "pages/Profile/Achievement";
import AcademicAchievementAdd from "pages/Profile/AcademicAchievementAdd";
import HonoursAwards from "pages/Profile/HonoursAwards";
import Sports from "pages/Profile/Sports";
import Publications from "pages/Profile/Publications";
import Books from "pages/Profile/Books";
import Papers from "pages/Profile/Papers";
import Patents from "pages/Profile/Patents";
import TestScore from "pages/Profile/TestScore";
import Activities from "pages/Profile/Activities";
import CurricularActivities from "pages/Profile/CurricularActivities";
import Placement from "pages/Profile/Placement";
import Certifications from "pages/Profile/Certifications";
import Achievements from "pages/Profile/Achievements";
import Profiles from "pages/Profiles";
import ShowEvents from "pages/Profile/ShowEvents";
import AddEvent from "pages/AddEvent";
import ShowNewsRoom from "pages/NewsRoom";
import NewsDetail from "pages/NewsDetail";
import Jobs from "pages/Jobs";
import AddJob from "pages/AddJob";
import AddInternship from "pages/AddInternship";
import News from "pages/News";
import AdminNewsDetails from "pages/AdminNewsDetails";
import AdminJobs from "pages/AdminJobs";
import AdminJobDetails from "pages/AdminJobDetails";
import ManageJobPosting from "pages/ManageJobPosting";
import AdminCourses from "pages/AdminCourses";
import AdminCourseDetails from "pages/AdminCourseDetails";
import Departments from "pages/Departments";
import DepartmentDetails from "pages/DepartmentDetails";
import ProfessionalSkills from "pages/ProfessionalSkills";
import ProfessionalAreas from "pages/ProfessionalAreas";
import ProfessionalAreaDetails from "pages/ProfessionalAreaDetails";
import ProfessionalSkillDetails from "pages/ProfessionalSkillDetails";
import Industries from "pages/Industries";
import IndustryDetails from "pages/IndustryDetails";
import WorkRoles from "pages/WorkRoles";
import WorkRoleDetails from "pages/WorkRoleDetails";
import Slideshows from "pages/Slideshows";
import SlideshowDetails from "pages/SlideshowDetails";
import Settings from "pages/Settings";
import Countries from "pages/Countries";
import CountryDetails from "pages/CountryDetails";
import BusinessDirectory from "pages/BusinessDirectory";
import MyGroups from "pages/MyGroups";
import GroupDashboard from "pages/GroupDashboard";
import BusinessDirectoryDetailPage from "pages/BusinessDirectoryDetailPage";
import AppUser from "pages/AppUser";
import ViewFeedInfo from "pages/ViewFeedInfo";
import JobsApplicants from "pages/JobsApplicants";
import EventsDetailPage from "pages/EventsDetailPage";
import EmailTemplates from "pages/EmailTemplates";
import Feeds from "pages/Feeds";
import JobDetailsPage from "pages/JobDetailsPage";
import Institutes from "pages/Institutes";
import AlumniLocation from "pages/AlumniLocation";
import AlumniEducationDetails from "pages/AlumniEducationDetails";
import AlumniWorkDetails from "pages/AlumniWorkDetails";
import AlumniWorkExperience from "pages/AlumniWorkExperience";
import AlumniWorkCompany from "pages/AlumniWorkCompany";
import ManageEvents from "pages/ManageEvents";
import AlumniMessages from "pages/AlumniMessages";
import AlumniMessageDetail from "pages/AlumniMessageDetail";
import Gallery from "pages/Gallery";
import Testimonials from "pages/Testimonials";
import TestimonialDetails from "pages/TestimonialDetails";

const queryClient = new QueryClient();

const initialState = {
	user: null,
};

const reducer = (state: any, action = {}) => {
	return {
		...state,
		...action,
	};
};

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
	console.log("protect");

	const user = localStorage.getItem("user");
	if (!user) {
		return <Navigate to="/login" />;
	}
	return children;
};
const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
	const user = localStorage.getItem("user");
	
	if(user){
		const items = JSON.parse(user);
		if(items?.is_admin==1 && location.pathname != "/access_disabled" && location.pathname != "/"){
			return <Navigate to="/admin/dashboard" />;
		} else if (items?.is_alumni==1 && location.pathname != "/access_disabled" && location.pathname != "/") {
			return <Navigate to="/dashboard" />;
		}
	}	
	return children;
};

const createRoutes = () => (
	<BrowserRouter>
		<StateProvider initialState={initialState} reducer={reducer}>
			<QueryClientProvider client={queryClient}>
				<Routes>
				<Route
						path="/"
						element={
							<PublicRoute>
								<Home />
							</PublicRoute>
						}
					/>
					<Route
						path="login"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route
						path="access_disabled"
						element={
							<PublicRoute>
								<AccessDisabled />
							</PublicRoute>
						}
					/>
					<Route path="forgot" element={<ForgotPassword />} />
					<Route
						path="password_reset/:key"
						element={
							<PublicRoute>
								<ResetPassword />
							</PublicRoute>
						}
					/>

					<Route
						path="register"
						element={
							<PublicRoute>
								<Register />
							</PublicRoute>
						}
					/>

					<Route
						path="thankyou"
						element={
							<PublicRoute>
								<Thankyou />
							</PublicRoute>
						}
					/>

					<Route
						path="company"
						element={
							<ProtectedRoute>
								<Company />
							</ProtectedRoute>
						}
					/>

					<Route
						path="course"
						element={
							<ProtectedRoute>
								<Courses />
							</ProtectedRoute>
						}
					/>

					<Route
						path="profilephoto"
						element={
							<ProtectedRoute>
								<ProfilePhoto />
							</ProtectedRoute>
						}
					/>

					<Route
						path="contact"
						element={
							<ProtectedRoute>
								<Contact />
							</ProtectedRoute>
						}
					/>

					<Route
						path="dashboard"
						element={
							<ProtectedRoute>
								<AlumniDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="members"
						element={
							<ProtectedRoute>
								<Members />
							</ProtectedRoute>
						}
					/>
					<Route
						path="show-events"
						element={
							<ProtectedRoute>
								<ShowEvents />
							</ProtectedRoute>
						}
					/>
					<Route
						path="manage-events"
						element={
							<ProtectedRoute>
								<ManageEvents />
							</ProtectedRoute>
						}
					/>
					<Route
						path="events/:id"
						element={
							<ProtectedRoute>
								<EventsDetailPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="add-events"
						element={
							<ProtectedRoute>
								<AddEvent />
							</ProtectedRoute>
						}
					/>
					<Route
						path="edit-event/:id"
						element={
							<ProtectedRoute>
								<AddEvent />
							</ProtectedRoute>
						}
					/>
					<Route
						path="newsroom"
						element={
							<ProtectedRoute>
								<ShowNewsRoom />
							</ProtectedRoute>
						}
					/>
					<Route
						path="newsroom/:id"
						element={
							<ProtectedRoute>
								<NewsDetail />
							</ProtectedRoute>
						}
					/>
					<Route
						path="alumni-messages"
						element={
							<ProtectedRoute>
								<AlumniMessages />
							</ProtectedRoute>
						}
					/>
					<Route
						path="view-message/:id"
						element={
							<ProtectedRoute>
								<AlumniMessageDetail />
							</ProtectedRoute>
						}
					/>
					<Route
						path="jobs"
						element={
							<ProtectedRoute>
								<Jobs />
							</ProtectedRoute>
						}
					/>
					<Route
						path="job-details/:id"
						element={
							<ProtectedRoute>
								<JobDetailsPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="add-job"
						element={
							<ProtectedRoute>
								<AddJob />
							</ProtectedRoute>
						}
					/>
					<Route
						path="edit-job/:id"
						element={
							<ProtectedRoute>
								<AddJob />
							</ProtectedRoute>
						}
					/>
					<Route
						path="view-feedback/:id"
						element={
							<ProtectedRoute>
								<ViewFeedInfo />
							</ProtectedRoute>
						}
					/>
					<Route
						path="jobs-applicants"
						element={
							<ProtectedRoute>
								<JobsApplicants />
							</ProtectedRoute>
						}
					/>
					<Route
						path="add-internship"
						element={
							<ProtectedRoute>
								<AddInternship />
							</ProtectedRoute>
						}
					/>
					<Route
						path="edit-internship/:id"
						element={
							<ProtectedRoute>
								<AddInternship />
							</ProtectedRoute>
						}
					/>
					<Route path="/" element={<AppUser />}>
						<Route
							path="business-directory"
							element={
								<ProtectedRoute>
									<BusinessDirectory />
								</ProtectedRoute>
							}
						/>
						<Route
							path="business-directory/:id"
							element={
								<ProtectedRoute>
									<BusinessDirectoryDetailPage />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route
						path="my-groups"
						element={
							<ProtectedRoute>
								<MyGroups />
							</ProtectedRoute>
						}
					/>
					<Route
						path="my-groups/:id"
						element={
							<ProtectedRoute>
								<GroupDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="manage-job-posting"
						element={
							<ProtectedRoute>
								<ManageJobPosting />
							</ProtectedRoute>
						}
					/>

					<Route
						path="profiles"
						element={
							<ProtectedRoute>
								<Profiles />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/:id"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/basic"
						element={
							<ProtectedRoute>
								<Basic />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/locationcontact"
						element={
							<ProtectedRoute>
								<LocationContact />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/education"
						element={
							<ProtectedRoute>
								<Education />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/education/add"
						element={
							<ProtectedRoute>
								<EducationAdd />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/education/course"
						element={
							<ProtectedRoute>
								<EducationCourseAdd />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/education/edit/:id"
						element={
							<ProtectedRoute>
								<EducationAdd />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/work"
						element={
							<ProtectedRoute>
								<Work />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/work/experience"
						element={
							<ProtectedRoute>
								<WorkExperience />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/work/company"
						element={
							<ProtectedRoute>
								<WorkCompany />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/work/company/:id"
						element={
							<ProtectedRoute>
								<WorkCompany />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/photo"
						element={
							<ProtectedRoute>
								<Photo />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/resume"
						element={
							<ProtectedRoute>
								<ResumeAttachments />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/achievement"
						element={
							<ProtectedRoute>
								<Achievement />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-achievements"
						element={
							<ProtectedRoute>
								<AcademicAchievementAdd />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-honours-awards"
						element={
							<ProtectedRoute>
								<HonoursAwards />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-sports"
						element={
							<ProtectedRoute>
								<Sports />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-publications"
						element={
							<ProtectedRoute>
								<Publications />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-books"
						element={
							<ProtectedRoute>
								<Books />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-papers"
						element={
							<ProtectedRoute>
								<Papers />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-patents"
						element={
							<ProtectedRoute>
								<Patents />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-test-scores"
						element={
							<ProtectedRoute>
								<TestScore />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-activities"
						element={
							<ProtectedRoute>
								<Activities />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-extra-curricular-activities"
						element={
							<ProtectedRoute>
								<CurricularActivities />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-placement"
						element={
							<ProtectedRoute>
								<Placement />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/add-certifications"
						element={
							<ProtectedRoute>
								<Certifications />
							</ProtectedRoute>
						}
					/>

					<Route
						path="profile/account"
						element={
							<ProtectedRoute>
								<Account />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/account_delete"
						element={
							<ProtectedRoute>
								<AccountDelete />
							</ProtectedRoute>
						}
					/>
					<Route
						path="profile/achievements"
						element={
							<ProtectedRoute>
								<Achievements />
							</ProtectedRoute>
						}
					/>
					<Route path="admin" element={<App />}>
						<Route
							path="dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="users"
							element={
								<ProtectedRoute>
									<Users />
								</ProtectedRoute>
							}
						/>
						<Route
							path="user-details"
							element={
								<ProtectedRoute>
									<UserDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="user-details/:id"
							element={
								<ProtectedRoute>
									<UserDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="alumnis"
							element={
								<ProtectedRoute>
									<Alumnis />
								</ProtectedRoute>
							}
						/>
						<Route
							path="alumni-details"
							element={
								<ProtectedRoute>
									<AlumniDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="alumni-details/:id"
							element={
								<ProtectedRoute>
									<AlumniDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="alumni-location"
							element={
								<ProtectedRoute>
									<AlumniLocation />
								</ProtectedRoute>
							}
						/>
						<Route
							path="alumni-location/:id"
							element={
								<ProtectedRoute>
									<AlumniLocation />
								</ProtectedRoute>
							}
						/>
						<Route
							path="alumni-education"
							element={
								<ProtectedRoute>
									<AlumniEducationDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="alumni-education/:id"
							element={
								<ProtectedRoute>
									<AlumniEducationDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="work-details"
							element={
								<ProtectedRoute>
									<AlumniWorkDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="work-details/:id"
							element={
								<ProtectedRoute>
									<AlumniWorkDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="work-experience/:id"
							element={
								<ProtectedRoute>
									<AlumniWorkExperience />
								</ProtectedRoute>
							}
						/>
						<Route
							path="work-company/:userid"
							element={
								<ProtectedRoute>
									<AlumniWorkCompany />
								</ProtectedRoute>
							}
						/>
						<Route
							path="work-company/:userid/:id"
							element={
								<ProtectedRoute>
									<AlumniWorkCompany />
								</ProtectedRoute>
							}
						/>
						<Route
							path="courses"
							element={
								<ProtectedRoute>
									<AdminCourses />
								</ProtectedRoute>
							}
						/>
						<Route
							path="course-details"
							element={
								<ProtectedRoute>
									<AdminCourseDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="course-details/:id"
							element={
								<ProtectedRoute>
									<AdminCourseDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="departments"
							element={
								<ProtectedRoute>
									<Departments />
								</ProtectedRoute>
							}
						/>
						<Route
							path="department-details"
							element={
								<ProtectedRoute>
									<DepartmentDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="department-details/:id"
							element={
								<ProtectedRoute>
									<DepartmentDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="testimonials"
							element={
								<ProtectedRoute>
									<Testimonials />
								</ProtectedRoute>
							}
						/>
						<Route
							path="testimonial-details"
							element={
								<ProtectedRoute>
									<TestimonialDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="testimonial-details/:id"
							element={
								<ProtectedRoute>
									<TestimonialDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="professionalskills"
							element={
								<ProtectedRoute>
									<ProfessionalSkills />
								</ProtectedRoute>
							}
						/>
						<Route
							path="professionalskill-details"
							element={
								<ProtectedRoute>
									<ProfessionalSkillDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="professionalskill-details/:id"
							element={
								<ProtectedRoute>
									<ProfessionalSkillDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="professionalareas"
							element={
								<ProtectedRoute>
									<ProfessionalAreas />
								</ProtectedRoute>
							}
						/>
						<Route
							path="professionalarea-details"
							element={
								<ProtectedRoute>
									<ProfessionalAreaDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="professionalarea-details/:id"
							element={
								<ProtectedRoute>
									<ProfessionalAreaDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="industries"
							element={
								<ProtectedRoute>
									<Industries />
								</ProtectedRoute>
							}
						/>
						<Route
							path="industry-details"
							element={
								<ProtectedRoute>
									<IndustryDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="industry-details/:id"
							element={
								<ProtectedRoute>
									<IndustryDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="workroles"
							element={
								<ProtectedRoute>
									<WorkRoles />
								</ProtectedRoute>
							}
						/>
						<Route
							path="workrole-details"
							element={
								<ProtectedRoute>
									<WorkRoleDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="workrole-details/:id"
							element={
								<ProtectedRoute>
									<WorkRoleDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="slideshows"
							element={
								<ProtectedRoute>
									<Slideshows />
								</ProtectedRoute>
							}
						/>
						<Route
							path="slideshow-details"
							element={
								<ProtectedRoute>
									<SlideshowDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="slideshow-details/:id"
							element={
								<ProtectedRoute>
									<SlideshowDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="gallery"
							element={
								<ProtectedRoute>
									<Gallery />
								</ProtectedRoute>
							}
						/>
						
						<Route
							path="countries"
							element={
								<ProtectedRoute>
									<Countries />
								</ProtectedRoute>
							}
						/>
						<Route
							path="country-details"
							element={
								<ProtectedRoute>
									<CountryDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="country-details/:id"
							element={
								<ProtectedRoute>
									<CountryDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="settings"
							element={
								<ProtectedRoute>
									<Settings />
								</ProtectedRoute>
							}
						/>
						<Route
							path="emailtemplates"
							element={
								<ProtectedRoute>
									<EmailTemplates />
								</ProtectedRoute>
							}
						/>
						<Route
							path="roles"
							element={
								<ProtectedRoute>
									<Roles />
								</ProtectedRoute>
							}
						/>
						<Route
							path="role"
							element={
								<ProtectedRoute>
									<Role />
								</ProtectedRoute>
							}
						/>
						<Route
							path="role/:id"
							element={
								<ProtectedRoute>
									<Role />
								</ProtectedRoute>
							}
						/>
						<Route
							path="events"
							element={
								<ProtectedRoute>
									<Events />
								</ProtectedRoute>
							}
						/>
						<Route
							path="event-details"
							element={
								<ProtectedRoute>
									<EventDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="event-details/:id"
							element={
								<ProtectedRoute>
									<EventDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="news"
							element={
								<ProtectedRoute>
									<News />
								</ProtectedRoute>
							}
						/>
						<Route
							path="news-details"
							element={
								<ProtectedRoute>
									<AdminNewsDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="news-details/:id"
							element={
								<ProtectedRoute>
									<AdminNewsDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="jobs"
							element={
								<ProtectedRoute>
									<AdminJobs />
								</ProtectedRoute>
							}
						/>
						<Route
							path="job-details"
							element={
								<ProtectedRoute>
									<AdminJobDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="job-details/:id"
							element={
								<ProtectedRoute>
									<AdminJobDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="feeds"
							element={
								<ProtectedRoute>
									<Feeds />
								</ProtectedRoute>
							}
						/>
						{/* <Route
							path="event-details"
							element={
								<ProtectedRoute>
									<EventDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="event-details/:id"
							element={
								<ProtectedRoute>
									<EventDetails />
								</ProtectedRoute>
							}
						/> */}

						<Route
							path="institutes"
							element={
								<ProtectedRoute>
									<Institutes />
								</ProtectedRoute>
							}
						/>
						{/* <Route
							path="institute-details"
							element={
								<ProtectedRoute>
									<AdminJobDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="institute-details/:id"
							element={
								<ProtectedRoute>
									<AdminJobDetails />
								</ProtectedRoute>
							}
						/> */}
					</Route>

					<Route path="*" element={<Navigate to="/login" />} />
				</Routes>
				{/* <ReactQueryDevtools
					initialIsOpen={false}
					position="bottom-right"></ReactQueryDevtools> */}
			</QueryClientProvider>
		</StateProvider>
	</BrowserRouter>
);

export default createRoutes;
