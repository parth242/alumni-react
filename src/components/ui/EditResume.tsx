import React, { useEffect, Fragment, useState, ChangeEvent } from "react";
import { useMutation } from "react-query";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
	CustomerType,
	IUser,
	TResumeFormData,
	ConfirmPopupDataType,
} from "utils/datatypes";
import { InputProfile } from "components/ui/common/InputProfile";
import {
	useResumeAttachments,
	saveResumeAttachment,
	deleteResumeAttachment,
} from "api/services/resumeattachmentService";
import { HTTPError } from "ky";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	getMyDetails,
	useUploadImage,
} from "api/services/user";

import {
	FieldValues,
	UseFormHandleSubmit,
	UseFormRegister,
} from "react-hook-form";

type Props = {
	resume: TResumeFormData;
	isOpen: boolean;
	setIsOpen: (fl: boolean) => void;
};

export function EditResume({ resume, isOpen, setIsOpen }: Props) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TResumeFormData>();

	useEffect(() => {
		if (isOpen) {
			reset(resume as TResumeFormData);
		}
	}, [isOpen]);

	const [userId, setUserId] = useState(0);

	const getUserData = async () => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setUserId(items.id);
			
		}
	};
	useEffect(() => {
		getUserData();
	}, []);

	const {
		isLoading,
		data: attachmentList,
		refetch: fetchAttachmentList,
		isFetching: isFetchingAttachmentList,
	} = useResumeAttachments({
		enabled: userId > 0,
		filter_user: userId,
	}) || [];

	const { mutate, isError, error } = useMutation(saveResumeAttachment, {
		onSuccess: async (res: any) => {
			SuccessToastMessage({
				title: "Resume/Attachment Updated Successfully",
				id: "resume_user_success",
			});

			reset();
			fetchAttachmentList();
		},
		onError: async (e: HTTPError) => {
			ErrorToastMessage({ error: e, id: "resume_user" });
		},
	});

	const onSubmit = async (data: TResumeFormData) => {
		// call update API
		setIsOpen(false);
		mutate(data);
	};

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<div className="rounded-lg shadow-md p-6">
				<div className=" text-2xl font-bold">
					Edit Attachment Details
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="mt-5">
					<div className="flex space-x-4 mb-6">
						{" "}
						{/* Add mb-6 to create margin between the fields */}
						<InputProfile
							placeholder="Enter Title"
							label={`Title :`}
							name={"resume_title"}
							register={register}
							error={errors?.resume_title?.message}
						/>
					</div>

					<div className="flex space-x-4 mb-6">
						{" "}
						{/* Add mb-6 to create margin between the fields */}
						<div className="mr-4">
							<label
								htmlFor="period"
								className="mb-1 font-semibold">
								Show on profile? :
							</label>
							<p className="text-sm">(Only to members)</p>
						</div>
						<div className="flex items-center">
							<input
								type="radio"
								id="show_on_profile1"
								value="Yes"
								className="form-radio h-5 w-5 text-blue-600"
								{...register(`show_on_profile`)}
							/>
							<label htmlFor="show_on_profile1" className="ml-2">
								Yes
							</label>
						</div>
						<div className="flex items-center">
							<input
								type="radio"
								id="show_on_profile2"
								value="No"
								className="form-radio h-5 w-5 text-blue-600"
								{...register(`show_on_profile`)}
							/>
							<label htmlFor="show_on_profile2" className="ml-2">
								No
							</label>
						</div>
					</div>

					<div className="form-group">
						<button
							type="submit"
							value="Update"
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
							Update
						</button>
					</div>
				</form>
			</div>
		</Transition.Root>
	);
}
