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

export default function ProfileHeader() {
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

	const [openConfig, setOpenConfig] = useState(false);
	const [openChangePassword, setOpenChangePassword] = useState(false);
	const [darkmode, setDarkmode] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	const setThemeMode = (isDark: boolean) => {
		const isdarkmode: boolean =
			company_data?.experimental_features?.includes("dark_mode");
		if (
			!("theme" in localStorage) &&
			isdarkmode &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			document.documentElement.classList.add("dark");
			isDark = true;
		}

		setAppState({ isDark: isDark });
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};
	useEffect(() => {
		let pageName: string[] = location.pathname.replace("/admin/", "").split("/");
		setAppState({
			pageName: pageName[0],
		});
	}, [location.pathname]);

	const { mutate, isLoading: logoutLoading } = useMutation(logout, {
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
	

	return (
		<>
			<div className="bg-gray-100 shadow-md rounded-lg p-6 flex items-center justify-center">
				<img src="/assets/images/profile.png" className="w-32 h-32 rounded-full mb-4 mr-4" />

				<div className="flex-grow">
					<h2 className="text-2xl font-bold mb-1">Parth ABC</h2>
					<p className="text-gray-500 mb-2">BE 2008</p>
					<p className="text-gray-800 mb-4">parth@gmail.com</p>
				</div>

				<button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
					View Profile
				</button>
			</div>
		</>
	);
}
