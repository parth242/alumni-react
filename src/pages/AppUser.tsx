import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "components/layout/navbar";
import Sidebar from "components/layout/sidebar";
import { useAppState } from "utils/useAppState";
import { useEffect } from "react";
import { ErrorToastMessage, getMyDetails } from "api/services/user";
import { CustomerType, IUser, WabaStatus } from "utils/datatypes";
import { NIL } from "uuid";
import { useMutation } from "react-query";
import { HTTPError } from "ky";
import Icon from "utils/icon";
import DowntimeBanner from "components/ui/common/DowntimeBanner";

function AppUser() {
	const [
		{
			user,
			showSidebar,
			selectedCustomer,
			wabaActivationStatus,
			pageName,
			company_data,
		},
		setAppState,
	] = useAppState();
	const navigate = useNavigate();

	const getUserData = async () => {
		const userDataResponse = (await getMyDetails()) as IUser;

		localStorage.setItem("user", JSON.stringify(userDataResponse));
		setAppState({ user: userDataResponse });
		if (userDataResponse.is_admin === 1) {
			navigate("/admin/dashboard");
		}
	};
	useEffect(() => {
		getUserData();
	}, []);
	return (
		<div className={``}>
			<Outlet />
		</div>
	);
}

export default AppUser;
