import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useRef } from "react";
import { TResumeFormData } from "utils/datatypes";
import { InputProfile } from "components/ui/common/InputProfile";
import Icon from "utils/icon";
import { useAppState } from "utils/useAppState";

type RequestType = {
	isOpen: boolean;
	setIsOpen: (fl: boolean) => void;
	data: TResumeFormData;
	itemId: number;
};

const EditResume: React.FC<RequestType> = ({
	isOpen,
	setIsOpen,
	data,
	itemId,
}) => {
	const cancelButtonRef = useRef(null);

	return (
		<>
			<Transition.Root show={isOpen} as={Fragment}>
				<div className="rounded-lg shadow-md p-6">
					<div className="bg-green-200 text-2xl font-bold">
						Edit Attachment Details
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="mt-5">
						<div className="flex space-x-4 mb-6">
							{" "}
							{/* Add mb-6 to create margin between the fields */}
							<InputProfile
								{...register(`resume_title`, {
									required: true,
								})}
								placeholder="Enter Title"
								label={`Title :`}
								error={
									errors?.resume_title && (
										<p>Title is required.</p>
									)
								}
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
									checked
									{...register(`show_on_profile`)}
								/>
								<label
									htmlFor="show_on_profile1"
									className="ml-2">
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
								<label
									htmlFor="show_on_profile2"
									className="ml-2">
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
		</>
	);
};

export default EditResume;
