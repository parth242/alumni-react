import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import { useMutation } from "react-query";
import { logout } from "api";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import ChangePassword from "pages/ChangePassword";
import { Divider } from "@mui/material";
import { IUser } from "utils/datatypes";

export default function SiteNavbar() {
	const path = useLocation().pathname;
	const [{ user }, setAppState] = useAppState();
	const [openChangePassword, setOpenChangePassword] = useState(false);
	const [userImage, setUserImage] = useState<
		string | "/assets/images/profile.png"
	>();
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

	const { mutate } = useMutation(logout, {
		onSuccess: async () => {
			setAppState({ user: undefined });
			localStorage.removeItem("user");
			navigate("/login");
		},
		onError: async () => {
			setTimeout(() => {
				navigate("/login");
			});
		},
	});

	const logoutFn = () => {
		mutate();
	};

	useEffect(() => {
		if (myuser) {
			if (myuser.image != "") {
				setUserImage(
					import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
						myuser.image,
				);
			}
		}
	}, [myuser]);
	return (
		<>
			<div
				style={{ backgroundColor: "#440178" }}
				className={`z-50 mx-auto transition-all py-3 duration-300`}>
				<Navbar
					style={{ backgroundColor: "#440178" }}
					fluid
					rounded
					className={`md:w-10/12 w-full mx-auto `}>
					<Navbar.Brand href="/dashboard">
						<span className="self-center whitespace-nowrap text-3xl font-bold text-white">
							AMS
						</span>
					</Navbar.Brand>
					<div className="flex md:order-2">
						<Dropdown
							arrowIcon={false}
							inline
							label={
								<Avatar
									alt="User settings"
									img={userImage}
									rounded
								/>
							}>
							<Dropdown.Header>
								<span className="block text-sm">
									Signed In as
								</span>
								<span className="block truncate text-sm font-medium">
									{user?.name}
								</span>
							</Dropdown.Header>
							<Dropdown.Item
								onClick={() => setOpenChangePassword(true)}>
								Change Password
							</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item>
								<Link to="/profile/basic">Edit Profile</Link>
							</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item onClick={logoutFn}>
								Sign Out
							</Dropdown.Item>
						</Dropdown>
						<Navbar.Toggle />
					</div>
					<Navbar.Collapse>
						<Navbar.Link
							className="text-white md:text-lg text-sm md:hidden md:bg-transparent lg:block"
							active={path === "/dashboard"}
							as={"div"}>
							<Link
								className={`${
									path === "/dashboard" ? "text-gray-300" : ""
								} hover:text-gray-400`}
								to="/dashboard">
								Dashboard
							</Link>
						</Navbar.Link>
						<Navbar.Link
							className="text-white md:text-lg text-sm md:hidden md:bg-transparent lg:block"
							active={path === "/members"}
							as={"div"}>
							<Link
								className={`${
									path === "/members" ? "text-gray-300" : ""
								} hover:text-gray-400`}
								to="/members">
								Members
							</Link>
						</Navbar.Link>
						<Navbar.Link
							className="text-white md:text-lg text-sm md:hidden md:bg-transparent lg:block"
							active={path === "/jobs"}
							as={"div"}>
							<Link
								className={`${
									path === "/jobs" ? "text-gray-300" : ""
								} hover:text-gray-400`}
								to="/jobs">
								Jobs
							</Link>
						</Navbar.Link>
						<Navbar.Link
							className="text-white md:text-lg text-sm md:hidden md:bg-transparent lg:block"
							active={path === "/business-directory"}
							as={"div"}>
							<Link
								className={`${
									path === "/business-directory"
										? "text-gray-300"
										: ""
								} hover:text-gray-400`}
								to="/business-directory">
								Business Directory
							</Link>
						</Navbar.Link>
						<Navbar.Link
							className="text-white md:text-lg text-sm md:hidden md:bg-transparent lg:block"
							active={path === "/newsroom"}
							as={"div"}>
							<Link
								className={`${
									path === "/newsroom" ? "text-gray-300" : ""
								} hover:text-gray-400`}
								to="/newsroom">
								Newsroom
							</Link>
						</Navbar.Link>
						<Navbar.Link
							className="text-white md:text-lg text-sm md:hidden md:bg-transparent lg:block"
							active={path === "/show-events"}
							as={"div"}>
							<Link
								className={`${
									path === "/show-events"
										? "text-gray-300"
										: ""
								} hover:text-gray-400`}
								to="/show-events">
								Events
							</Link>
						</Navbar.Link>
						<Navbar.Link
							className="text-white md:text-lg text-sm md:hidden md:bg-transparent lg:block"
							active={path === "/my-groups"}
							as={"div"}>
							<Link
								className={`${
									path === "/my-groups" ? "text-gray-300" : ""
								} hover:text-gray-400`}
								to="/my-groups">
								My Groups
							</Link>
						</Navbar.Link>
					</Navbar.Collapse>
				</Navbar>
			</div>
			<Divider />

			{/* Change Password Modal */}
			<ChangePassword
				openChangePassword={openChangePassword}
				setOpenChangePassword={setOpenChangePassword}
			/>
		</>
	);
}
