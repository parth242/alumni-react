import { authUser } from "api";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import SiteNavbar from "components/layout/sitenavbar";
import ProfileHeader from "components/layout/profileheader";
import ProfileSidebar from "components/layout/profilesidebar";
import React, { useEffect, useState } from "react";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
	accountDeleteRequest,
} from "api/services/user";
import { IUser, TDeleteAccountFormData } from "utils/datatypes";
import { getWork, createWork } from "api/services/companyService";
import { HTTPError } from "ky";
import { InputProfile } from "components/ui/common/InputProfile";
import Textarea from "components/ui/common/Textarea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "flowbite-react";

function AccountDelete() {
	const navigate = useNavigate();
	const { id } = useParams() as {
		id: string;
	};

	const EmailSchema = yup.object().shape({
		mobile_no: yup
			.string()
			.required("Contact number is required")
			.matches(/^[0-9]+$/, "Contact number must contain only digits")
			.min(10, "Contact number must be at least 10 digits")
			.max(12, "Contact number can't be more than 12 digits"),

		delete_message: yup.string().required("Message is required."),
	});

	const {
		register,
		trigger,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<TDeleteAccountFormData>({
		resolver: yupResolver(EmailSchema),
	});

	const [myuser, setMyUser] = useState<IUser | null>();

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setMyUser(items);
			setValue("mobile_no", items.mobileno);
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	const { mutate, isError, error } = useMutation(accountDeleteRequest, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Account Delete Request sent Successfully",
				id: "account_delete_success",
			});
			navigate("/profile/account");
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "account_delete" });
		},
	});
	const onSubmit = (data: TDeleteAccountFormData) => {
		data.user_id = Number(myuser?.id);
		data.mobile_no = getValues("mobile_no");
		mutate(data);
	};

	return (
		<>
			<SiteNavbar />
			<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
				<div className="md:w-56">
					{/* Sidebar */}
					<ProfileSidebar />
				</div>
				<div className="w-full px-10 min-h-screen">
					<h1 className=" text-3xl my-7 font-semibold">
						Account Delete Request
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
							If you do not wish to continue being a member of
							this network, you may request the admin to delete
							your account. Re-registration and admin approval are
							mandatory to re-join the network. Please submit a
							request to admin with the form below:
						</p>
					</div>
					<div className="mt-10">
						<form
							className="flex flex-col gap-4 mt-10"
							onSubmit={handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Name
									</label>
									<InputProfile
										disabled
										defaultValue={myuser?.first_name}
										name={"first_name"}
										className="w-full text-sm h-11 border-gray-100  bg-gray-100"
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Personal Email ID
									</label>
									<InputProfile
										disabled
										defaultValue={myuser?.email}
										name={"email"}
										className="w-full text-sm h-11 border-gray-100 bg-gray-100"
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Date
									</label>
									<InputProfile
										name={"mobile_no"}
										register={register}
										error={errors?.mobile_no?.message}
										className="w-full text-sm h-11 border-gray-100"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Description
									</label>
									<Textarea
										rows={4}
										name={"delete_message"}
										register={register}
										error={errors?.delete_message?.message}
									/>
								</div>
							</div>
							<div>
								<div className="flex space-x-4 mb-6">
									<Button
										style={{ backgroundColor: "#440178" }}
										outline
										type="submit">
										Save
									</Button>

									<Button
										onClick={() =>
											navigate("/profile/account")
										}
										outline
										style={{ backgroundColor: "#440178" }}>
										Cancel
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default AccountDelete;
