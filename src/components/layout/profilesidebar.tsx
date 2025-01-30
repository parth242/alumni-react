import React, { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useAppState } from "utils/useAppState";
import { useMutation } from "react-query";
import { logout } from "api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "utils/icon";
import { classNames } from "utils";
import { HTTPError } from "ky";
import { StringStringType } from "utils/consts";
import { Sidebar } from "flowbite-react";
import { IUser } from "utils/datatypes";
import {
	HiUser,
	HiDocumentText,
	HiOutlineLocationMarker,
	HiPhotograph,
	HiBookOpen,
	HiBriefcase,
	HiThumbUp,
	HiOutlinePaperClip,
	HiLogin,
} from "react-icons/hi";

export default function ProfileSidebar() {
	const [{ showSidebar, pageName, isDark, company_data }, setAppState] =
		useAppState();
	const [{ user, customers, wabaActivationStatus, selectedCustomer }] =
		useAppState();
	const pageNames: StringStringType = {
		dashboard: `Welcome, ${user?.first_name}!👋`,
		users: `Users`,
		["user-details"]: `User Details`,
	};
	console.log("user", user);
	console.log("pageName", pageName);

	const location = useLocation();
	const navigate = useNavigate();

	const [myuser, setMyUser] = useState<IUser | null>();

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	useEffect(() => {
		let pageName: string[] = location.pathname
			.replace("/admin/", "")
			.split("/");
		setAppState({
			pageName: pageName[0],
		});
	}, [location.pathname]);

	return (
		<>
			<Sidebar className="w-full md:w-56">
				{/* <Sidebar.Logo
					href="#"
					img={
						myuser?.image
							? import.meta.env.VITE_BASE_URL +
							  "upload/profile/" +
							  myuser?.image
							: "/assets/images/user.svg"
					}
					imgAlt="Update Profile">
					Profile
				</Sidebar.Logo> */}
				<Sidebar.Items>
					<Sidebar.ItemGroup className="flex flex-col gap-1">
						<Link to="/profile/basic">
							<Sidebar.Item
								active={location.pathname === "/profile/basic"}
								icon={HiUser}
								labelColor="dark"
								as="div">
								Profile
							</Sidebar.Item>
						</Link>
						<Link to="/profile/photo">
							<Sidebar.Item
								active={location.pathname === "/profile/photo"}
								icon={HiPhotograph}
								labelColor="dark"
								as="div">
								Picture
							</Sidebar.Item>
						</Link>
						<Link to="/profile/locationcontact">
							<Sidebar.Item
								active={
									location.pathname ===
									"/profile/locationcontact"
								}
								icon={HiOutlineLocationMarker}
								labelColor="dark"
								as="div">
								Location
							</Sidebar.Item>
						</Link>
						<Link to="/profile/education">
							<Sidebar.Item
								active={
									location.pathname === "/profile/education"
								}
								icon={HiBookOpen}
								labelColor="dark"
								as="div">
								Education Details
							</Sidebar.Item>
						</Link>
						<Link to="/profile/work">
							<Sidebar.Item
								active={location.pathname === "/profile/work"}
								icon={HiBriefcase}
								labelColor="dark"
								as="div">
								Work Details
							</Sidebar.Item>
						</Link>
						<Link to="/profile/achievement">
							<Sidebar.Item
								active={
									location.pathname === "/profile/achievement"
								}
								icon={HiThumbUp}
								labelColor="dark"
								as="div">
								Achievements
							</Sidebar.Item>
						</Link>
						<Link to="/profile/resume">
							<Sidebar.Item
								active={location.pathname === "/profile/resume"}
								icon={HiDocumentText}
								labelColor="dark"
								as="div">
								Resume
							</Sidebar.Item>
						</Link>
						<Link to="/profile/account">
							<Sidebar.Item
								active={
									location.pathname === "/profile/account"
								}
								icon={HiLogin}
								labelColor="dark"
								as="div">
								Account
							</Sidebar.Item>
						</Link>
					</Sidebar.ItemGroup>
				</Sidebar.Items>
			</Sidebar>
		</>
	);
}
