import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import ProfileHeader from "components/layout/profileheader";
import ProfileSidebar from "components/layout/profilesidebar";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Banner, Button, Card, Label } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
	useUploadImage,
} from "api/services/user";
import {
	CustomerType,
	IUser,
	TResumeFormData,
	ConfirmPopupDataType,
} from "utils/datatypes";
import ChangePassword from "pages/ChangePassword";

function Account() {
	const navigate = useNavigate();

	const {
		register,
		trigger,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<TResumeFormData>();

	const [openChangePassword, setOpenChangePassword] = useState(false);
	const [userData, setUserData] = useState<TResumeFormData | null>();
	const [myuser, setMyUser] = useState<IUser | null>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [uploadData, setUploadData] = useState<FormData | null>();
	const [userId, setUserId] = useState(0);

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setUserId(items.id);
			setMyUser(items);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	return (
		<>
			<SiteNavbar />
			<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
				<div className="md:w-56">
					{/* Sidebar */}
					<ProfileSidebar />
				</div>
				<div className="w-full px-4 min-h-screen">
					<h1 className="text-3xl my-7 font-semibold">
						Accounts & Password
					</h1>
					<div className="mt-10">
						<Card className="w-full">
							<div className="flow-root">
								<ul className="divide-y divide-gray-200 dark:divide-gray-700">									

									<li className="py-3 sm:py-4">
										<div className="flex items-center space-x-4">
											<div className="min-w-0 flex-1">
												<h2 className="font-bold mb-2">
													Change Password
												</h2>
												<p className="text-sm dark:text-gray-400">
													<Link
														to="javscript:void()"
														onClick={() =>
															setOpenChangePassword(
																true,
															)
														}
														className={`rounded-md border border-transparent text-sm font-medium underline`}>
														Click here
													</Link>{" "}
													to update your login email
													address
												</p>
											</div>
										</div>
									</li>
									<li className="py-3 sm:py-4">
										<div className="flex items-center space-x-4">
											<div className="min-w-0 flex-1">
												<h2 className="font-bold mb-2">
													Delete Account
												</h2>
												<p className="text-sm dark:text-gray-400">
													If you do not wish to
													continue being a member of
													this network, you may
													request the admin to delete
													your account.
													Re-registration and admin
													approval are mandatory to
													re-join the network.
												</p>
												<p className="text-sm mt-5 dark:text-gray-400">
													To delete your account,
													click the button below:
												</p>
												<p className="text-sm mt-5 dark:text-gray-400">
													<Button
														onClick={() =>
															navigate(
																"/profile/account_delete",
															)
														}
														outline
														style={{
															backgroundColor:
																"#440178",
														}}>
														Request to delete my
														account
													</Button>
												</p>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</Card>
						{/* max-w-4xl */}
					</div>
					<ChangePassword
						openChangePassword={openChangePassword}
						setOpenChangePassword={setOpenChangePassword}
					/>
				</div>
			</div>
		</>
	);
}

export default Account;
