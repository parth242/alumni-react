import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import { useMutation } from "react-query";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { logout } from "api";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import ChangePassword from "pages/ChangePassword";
import { Divider } from "@mui/material";
import { INotification, IUser } from "utils/datatypes";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { HTTPError } from "ky";
import { useNotifications, updateNotification } from "api/services/notificationService";
import { useUnreadMessagesCount } from "api/services/messageService";


export default function SiteNavbar() {
	const path = useLocation().pathname;
	const [{ user }, setAppState] = useAppState();
	const [openChangePassword, setOpenChangePassword] = useState(false);
	const [userImage, setUserImage] = useState<
		string | "/assets/images/profile.png"
	>();
	const navigate = useNavigate();

	const [myuser, setMyUser] = useState<IUser | null>();	
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [notificationCount, setNotificationCount] = useState(0);
	const [messageCount, setMessageCount] = useState(0);
	const [userId, setUserId] = useState(0);

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
			setUserId(items.id);
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

	const {		
		data: notificationList,
		refetch: fetchNotificationList,
		isFetching: isFetchingNotificationList,
	} = useNotifications({
		enabled: false,		
		user_id: userId		
	}) || [];

	
	useEffect(() => {
		if (userId > 0) {
		  fetchNotificationList();
		}
	  }, [userId, fetchNotificationList]);

	  useEffect(() => {
		if (notificationList?.data) {
			setNotificationCount(notificationList?.data.length);
			setNotifications(notificationList?.data);
			
		} else{
			setNotifications([]);
		}
		
	  }, [notificationList]);

	  const {		
		data: messageCountList,
		refetch: fetchMessageCountList,
		isFetching: isFetchingMessageCountList,
	} = useUnreadMessagesCount({
		enabled: false,		
		user_id: userId		
	}) || [];

	
	useEffect(() => {
		if (userId > 0) {
			fetchMessageCountList();
		}
	  }, [userId, fetchMessageCountList]);

	  useEffect(() => {
		if (messageCountList?.total_records) {
			setMessageCount(messageCountList?.total_records);			
			
		} 
		
	  }, [messageCountList]);

	const [anchorEl, setAnchorEl] = useState(null);

	
	  // Handle click to open popover
	  const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	  };
	
	  // Handle closing of popover
	  const handleClose = () => {
		setAnchorEl(null);
	  };

	  const { mutate: notificationMutate } = useMutation(updateNotification, {
		onSuccess: async () => {			
			fetchNotificationList();			
		},
		onError: async (err: HTTPError) => {
			
		},
	});

	  const handleNotificationClick = (id: number, link: string) => {
		// Update notification read status
		const data = {id: id, is_read:1};
		notificationMutate(data as any);
	
		// Redirect to the notification link
		navigate("/"+link);
	
		// Close the notification popover
		handleClose();
	  };

	  const handleIconClick = () => {
		navigate("/alumni-messages"); // Replace "/messages" with your desired route
	  };
	
	  const open = Boolean(anchorEl);
	  const id = open ? 'notification-popover' : undefined;

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
						<div>
					<IconButton color="inherit" onClick={handleClick}>
					<Badge
						badgeContent={notificationCount}
						color="error"
						>
							<NotificationsIcon sx={{ color: 'white' }} />
						</Badge>
						</IconButton>
						<Popover
							id={id}
							open={open}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
							}}
							transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
							}}
						>
							<Typography sx={{ p: 2, fontWeight: 'bold' }}>Notifications</Typography>
							<Divider />
							<List sx={{ minWidth: 250 }}>
							{notifications && notifications.length > 0 ? (
            					notifications.map((item, i) => (
										
										<ListItem key={item.id} component="button" onClick={() => handleNotificationClick(Number(item.id), item.notify_url)}
                sx={{
                  backgroundColor: item.is_read ? 'inherit' : '#e3f2fd', // Highlight unread notifications
                }}>
										<ListItemText primary={item.message_desc} />
										</ListItem>
										
									)
									)
								) : (
									<>
									<ListItem>
										<ListItemText primary="No new notifications" />
									</ListItem>
									</>
								)}
							</List>
						</Popover>
						<IconButton color="inherit" onClick={handleIconClick}>
						<Badge
						badgeContent={messageCount}
						color="error"
						>
							<MailOutlineIcon sx={{ color: "white" }} />
							</Badge>
						</IconButton>
						</div>
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
