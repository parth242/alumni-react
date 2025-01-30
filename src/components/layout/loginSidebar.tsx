import { useEffect, useState } from "react";
import { classNames } from "utils";
import Icon from "utils/icon";
import { useAppState } from "utils/useAppState";

const LoginSidebar = () => {
	const [{ user }, setAppState] = useAppState();
	const [isDark, setIsDark] = useState<boolean>(false);
	useEffect(() => {
		if (
			localStorage.theme === "dark"
			/* ||
			(!("theme" in localStorage) &&
				window.matchMedia("(prefers-color-scheme: dark)").matches) */
		) {
			document.documentElement.classList.add("dark");
			setIsDark(true);
			setAppState({ isDark: isDark });
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	return (
		<div
			className={classNames(
				`${isDark
					? "bg-[url('/assets/images/logo.png')]"
					: "bg-[url('/assets/images/login_dark.avif')]"
				}`,
				"col-span-8",
				"hidden",
				"md:flex",
				"lg:flex",
				"xl:flex",
				"bg-cover",
				"bg-no-repeat",
				"text-center",
				"flex",
				"items-center	",
				"justify-center",
				"flex-col",
				"gap-4",
				"dark:text-darkSecondary",
			)}>
			<h1 className="font-['Rubik'] text-[40px] font-extrabold leading-[48px] text-gray-900 dark:text-darkPrimary">
				<div className="text-primary">Alumni Management</div>
			</h1>

			<div className="flex flex-col items-center">
				<label className="flex gap-2 text-base font-normal text-gray-800 dark:text-darkPrimary">
				Alumni Management Alumni Management <br /> Alumni Management Alumni
					Management Alumni Management.
				</label>
			</div>
			<div className="h-56">&nbsp;</div>
		</div>
	);
};

export default LoginSidebar;
