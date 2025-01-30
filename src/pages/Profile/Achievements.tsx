import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import ProfileHeader from "components/layout/profileheader";
import ProfileSidebar from "components/layout/profilesidebar";
import React, { useEffect, useState } from "react";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
	updateProfessionalHead,
} from "api/services/user";
import { IUser } from "utils/datatypes";
import { Button } from "flowbite-react";

function Achievements() {
	const [userId, setUserId] = useState(0);
	const [userData, setUserData] = useState<IUser | null>();

	const getUserData = async () => {
		const userDataResponse = (await getMyDetails()) as IUser;
		setUserData(userDataResponse);
	};
	useEffect(() => {
		getUserData();
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setUserId(items.id);
		}
	}, []);

	const navigate = useNavigate();

	console.log("userId", userId);

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
								<h2 className="text-xl">Achievements</h2>
								Please choose an achievement you wish to add to
								the profile.
							</div>

							<div className="border-b border-gray-300"></div>

							<div className="flex flex-wrap -mx-2">
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Academic Achievements</h4>
										<small className="text-light">
											Class Topper, University Topper,
											etc.
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Honours & Awards</h4>
										<small className="text-light">
											Add the recognition you received Eg:
											Fields Medal
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Sports Achievements</h4>
										<small className="text-light">
											Eg: National/State/University Level
											Player, Awards
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Publications</h4>
										<small className="text-light">
											Journals, Research Papers Published
											etc...
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Books Authored</h4>
										<small className="text-light">
											Those that you authoured or
											co-authoured
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Papers Presented</h4>
										<small className="text-light">
											Technical / Non-technical papers
											presented
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Patents</h4>
										<small className="text-light">
											Any patents that you have received /
											applied
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Test Scores</h4>
										<small className="text-light">
											GATE, CAT, GRE, GMAT, TOEFL etc.
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Activities</h4>
										<small className="text-light">
											Participation in Student Societies /
											NSS / Alumni / Social
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Extra-curricular Activities</h4>
										<small className="text-light">
											Participation in Inter &
											Intra-College Competitions
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Placement</h4>
										<small className="text-light">
											On-Campus / Off-Campus Placement
										</small>
									</a>
								</div>
								<div className="w-full sm:w-1/2 p-2">
									<a
										className="achievement-btn"
										href="https://www.sjcealumni.org/profile/achievements/add/1.dz">
										<i className="glyphicon glyphicon-plus pull-left"></i>
										<h4>Certifications</h4>
										<small className="text-light">
											Ex: Certified Yoga Instructor
											certificate
										</small>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Achievements;
