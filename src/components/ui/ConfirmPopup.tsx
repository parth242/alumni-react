import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useRef } from "react";
import { ConfirmPopupDataType } from "utils/datatypes";
import Icon from "utils/icon";
import { useAppState } from "utils/useAppState";

type RequestType = {
	isDeleteConfirm: boolean;
	setIsDeleteConfirm: (fl: boolean) => void;
	isDeleteCancelled?: boolean;
	setIsDeleteCancelled?: (fl: boolean) => void;
	data: ConfirmPopupDataType;
	setConfirmResult: (fl: boolean) => void;
	cancelBtnTitle?: string;
	confirmBtnTitle?: string;
	ConfirmModal:(fl: number) => void;
	itemId:number;
};  

const ConfirmPopup: React.FC<RequestType> = ({
	isDeleteConfirm,
	setIsDeleteConfirm,
	setIsDeleteCancelled,
	data,
	setConfirmResult,
	cancelBtnTitle,
	confirmBtnTitle,
	ConfirmModal,
	itemId,
}) => {
	const cancelButtonRef = useRef(null);
	const [{ isDark }] = useAppState();
	return (
		<>
			<Transition.Root show={isDeleteConfirm} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-40"
					initialFocus={cancelButtonRef}
					onClose={() => {
						setIsDeleteConfirm(false);
						if (setIsDeleteCancelled) setIsDeleteCancelled(true);
					}}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 bg-black/60 transition-opacity" />
					</Transition.Child>

					<div
						className={`${
							isDark ? "dark" : ""
						} fixed inset-0 z-10 overflow-y-auto`}>
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
								<Dialog.Panel className="relative w-10/12 rounded-lg bg-white text-left shadow-xl transition-all dark:bg-dark2 sm:my-8 sm:w-4/12">
									<div className="float-left inline-block w-full  px-6 pt-5 pb-4">
										<div className="text-lg font-medium text-gray-900 dark:text-darkPrimary">
											{data.title && (
												<div className="float-left w-[calc(100%-50px)] text-lg text-gray-900 dark:text-darkPrimary">
													{data.title}
												</div>
											)}
											<button
												autoFocus={true}
												type="button"
												className="float-right justify-center text-gray-400 hover:text-gray-500"
												data-modal-toggle="defaultModal"
												onClick={() => {
													setIsDeleteConfirm(false);
													if (setIsDeleteCancelled) setIsDeleteCancelled(true);
												}}
												ref={cancelButtonRef}>
												<Icon
													icon="x-mark"
													className="h-6 w-6 "
													aria-hidden="true"></Icon>
												<span className="sr-only">Close modal</span>
											</button>
										</div>
									</div>
									<hr className="float-left inline-block w-full dark:border-dark3" />
									<div className="inline-block">
										<div className="mt-4 px-6 text-sm dark:text-darkPrimary">
											{data.text && (
												<div
													className=""
													dangerouslySetInnerHTML={{ __html: data.text }}></div>
											)}
										</div>
										<div className="mt-4 px-6 text-sm text-gray-700 dark:text-darkSecondary">
											{data.description && (
												<div className="">{data.description}</div>
											)}
										</div>
									</div>
									<div className="mt-6 mb-4 flex flex-col-reverse gap-2 px-6 text-right sm:flex-row sm:justify-end sm:gap-0">
										<button
											type="button"
											className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 dark:border-dark3 dark:bg-dark2 dark:text-darkPrimary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
											onClick={() => {
												setIsDeleteConfirm(false);
												if (setIsDeleteCancelled) setIsDeleteCancelled(true);
											}}
											ref={cancelButtonRef}>
											{cancelBtnTitle || "Cancel"}
										</button>
										<button
											type="submit"
											className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-2 sm:ml-4 sm:w-auto sm:text-sm"
											onClick={() => {
												ConfirmModal(itemId);
												setConfirmResult(true);
												setIsDeleteConfirm(false);
												if (setIsDeleteCancelled) setIsDeleteCancelled(false);
											}}>
											{data.contirm_button_text ? (
												<div className="">{data.contirm_button_text}</div>
											) : (
												<div className="">{confirmBtnTitle || "Confirm"}</div>
											)}
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
};

export default ConfirmPopup;
