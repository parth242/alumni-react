import React, { useEffect, useState } from "react";
import { Modal, Button } from "flowbite-react";
import BtnComponent from "./BtnComponent";
import { IFeed, IComment, TCommentFormData, TReportFormData, ConfirmPopupDataType } from "utils/datatypes";
import Textarea from "components/ui/common/Textarea";
import { endDateWithSuffix, formatDateWithSuffix } from "./NewsItem";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { HTTPError } from "ky";
import { useMutation } from "react-query";
import Icon from "utils/icon";
import * as yup from "yup";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	useUploadImage,
} from "api/services/user";
import { createComment, useFeedComments, CreateReport, deleteFeed } from "api/services/feedService";
import FlexStartEnd from "./common/FlexStartEnd";
import { Form, Input, Space, Drawer, Card, Avatar, Radio } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { HiFlag } from "react-icons/hi";
import axios, { AxiosResponse } from "axios";
import ConfirmPopup from "components/ui/ConfirmPopup";

// Define the Alumni interface

const { Meta } = Card;

interface AlumniDashboardCardProps {
    feed: IFeed;
    fetchFeedList: () => void; // Add fetchFeedList as a function with no arguments
	key: number;
	loggedUserId: number;
}

const AlumniDashboardCard: React.FC<AlumniDashboardCardProps> = ({ feed,fetchFeedList, key, loggedUserId}) => {
	console.log("feed", feed);
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [isReportOpen, setIsReportOpen] = useState(false);
	const [isCommentOpen, setIsCommentOpen] = useState(false);	
	const [isFeedId, setIsFeedId] = useState(0);

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [comments, setComments] = useState<IComment[]>([]);

	const [inputShareValue, setInputShareValue] = useState("");

	const [isReportReason, setIsReportReason] = useState("");	

	const [shareBtnValue, setShareBtnValue] = useState("Copy");

	const [itemId, setItemId] = useState(null);
	const [oldFeedImage, setOldFeedImage] = useState<string>();
	const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
	const [IsDeleteCancelled, setIsDeleteCancelled] = useState(false);
	const [ConfirmResult, setConfirmResult] = useState(false);
	const [cancelBtnTitle, setcancelBtnTitle] = useState("Cancel");
	const [confirmBtnTitle, setconfirmBtnTitle] = useState("Confirm");

	const ConfirmPopupData: ConfirmPopupDataType = {
		title: "Feed Delete",
		text: "Are you sure you want to delete Feed?",
	};

	const [form] = Form.useForm();

	const { mutate:CommentMutate, isLoading:isPostCommentLoading, isError:isPostCommentError, isSuccess:isPostCommentSuccess, error:postCommentError } = useMutation(
		createComment,
		{
			onSuccess: async (res: any) => {
				SuccessToastMessage({
					title: "Comment Posted Successfully",
					id: "comment_user_success",
				});

				setIsFeedId(0);
				form.resetFields();
				setIsCommentOpen(false);
				fetchFeedList();
				//fetchFeedList();
				//navigate("/dashboard");
			},
			onError: async (e: HTTPError) => {
				ErrorToastMessage({ error: e, id: "comment_user" });
			},
		},
	);

	const onSubmit = (data: TCommentFormData) => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			data.user_id = Number(items?.id);
		}

		data.status = "active";
		data.feed_id = isFeedId;
		CommentMutate(data);
	};

	

	const handleReadMore = () => {
		setIsOpen(true);
	};

	const baseUrl = `${window.location.protocol}//${window.location.host}`;
	const handleShare = (feedid: number) => {
		const shareurl = baseUrl + `/view-feedback/${feedid}`;
		setIsFeedId(feedid);
		setInputShareValue(shareurl);
		setIsShareOpen(true);
	};

	const { mutate:ReportMutate, isLoading:isReportLoading, isError:isReportError, isSuccess:isReportSuccess, error:reportError } = useMutation(
		CreateReport,
		{
			onSuccess: async (res: any) => {
				SuccessToastMessage({
					title: "Report Submited Successfully",
					id: "report_user_success",
				});

				setIsFeedId(0);
				form.resetFields();
				setIsReportOpen(false);
				fetchFeedList();
				//fetchFeedList();
				//navigate("/dashboard");
			},
			onError: async (e: HTTPError) => {
				ErrorToastMessage({ error: e, id: "report_user" });
			},
		},
	);

	const handleReport = (feedid: number) => {
		setIsFeedId(feedid);
		setIsReportOpen(true);
	};

	
	const handleChangeReason = (e: any) => {
		setIsReportReason(e.target.value);
	  };

	const ReportSubmit = () =>{
		const data = {
			user_id: 0,
			report_reason: isReportReason, // Assuming `isReportReason` is defined in your component
			feed_id: isFeedId,             // Assuming `isFeedId` is defined in your component
		};
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			data.user_id = Number(items?.id);
		}
		
		ReportMutate(data);
	}

	const limitWords = (text: string, limit: number) => {
		const words = text.split(" ");
		if (words.length > limit) {
			return words.slice(0, limit).join(" ") + "...";
		}
		return text;
	};

	const showComment = (feedid: number) => {
		setIsFeedId(feedid);
		setIsCommentOpen(true);
	};

	const closeComment = () => {
		form.resetFields();
		setIsCommentOpen(false);
	};

	const handleViewFeed = (id: number) => {
		navigate(`/view-feedback/${id}`);
	};

	const {
		data: commentList,
		refetch: fetchCommentList,
		isFetching: isFetchingCommentList,
	} = useFeedComments({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,
		feed_id: isFeedId,
	}) || [];

	useEffect(() => {
		setPageNumber(1);
		setTimeout(() => {
			fetchCommentList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchCommentList();
	}, [pageNumber]);

	useEffect(() => {
		fetchCommentList();
	}, [isFeedId]);

	useEffect(() => {
		if (commentList) {
			if (pageNumber == 1) {
				setComments([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setComments(prevUsers => [...prevUsers, ...commentList.data]);
			setTotalRecords(commentList.total_records);
			setCurrentRecords(
				prevCurrentRecords =>
					prevCurrentRecords + commentList.data.length,
			);
		} else {
			setComments([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [commentList]);

	const handleCopy = () => {
		if (inputShareValue) {
			navigator.clipboard
				.writeText(inputShareValue)
				.then(() => setShareBtnValue("Copied"))
				.catch(err => console.error("Failed to copy text: ", err));
		} else {
			alert("Please enter some text to copy!");
		}
	};

	const { mutate: deleteItem, isLoading: uploadIsLoading } = useMutation(
		deleteFeed,
		{
			onSuccess: async () => {
				SuccessToastMessage({
					title: "Delete Feed Successfully",
					id: "delete_feed_success",
				});
				fetchFeedList();
			},
			onError: async (e: HTTPError) => {
				// const error = await e.response.text();
				// console.log("error", error);
				ErrorToastMessage({ error: e, id: "delete_feed" });
			},
		},
	);

	const submitDelete = async (itemId: any) => {
		if(oldFeedImage!='' && oldFeedImage!=null){
			const responseapi = await axios.get(
				import.meta.env.VITE_BASE_URL +
					"/api/v1/upload/deleteOldImage?key=" +
					oldFeedImage,
			);

			if (responseapi.status === 200) {
				deleteItem(itemId);
				setIsDeleteConfirm(false);
				setOldFeedImage("");
			}

		}		
	};
	// Handle the displaying of the modal based on type and id
	const showDeleteModal = (itemId: any,feedImage: string) => {
		setItemId(itemId);
		setOldFeedImage(feedImage);
		console.log(itemId);

		//setDeleteMessage(`Are you sure you want to delete the vegetable '${vegetables.find((x) => x.id === id).name}'?`);

		setIsDeleteConfirm(true);
	};

	//console.log('baseUrl',baseUrl);
	// Type assertion for the imported JSON data
	//const alumniData: Alumni[] = alumniDataJson as Alumni[];

	return (
		<>
			<>
				<div
					key={feed.id}
					className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4">
					<div>
						<p className="text-lg font-medium">
							<div
								className="text-sm"
								style={{
									wordWrap: "break-word",
									overflow: "hidden",
								}}
								dangerouslySetInnerHTML={{
									__html: `
									  ${limitWords(feed.description, 500)}
									  ${
											feed.feed_image
												? `<img src="${
														import.meta.env
															.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
														feed.feed_image
												  }" style="max-width:100%; height:auto;" />`
												: ""
										}
									`,
								}}
							/>{" "}
							{/* </FlexStartEnd> */}
							<span
								className="text-blue-600 text-sm cursor-pointer"
								onClick={() => handleReadMore()}>
								Read more
							</span>
						</p>
					</div>

					<div className="flex items-center space-x-4">
						<img
							src={
								feed.user?.image
									? import.meta.env
											.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
									  feed.user?.image
									: "/assets/images/user.svg"
							}
							alt="userImage"
							className="w-12 h-12 rounded-full"
						/>
						<div>
							<p className="font-semibold text-sm">
							<Link to={"/profile/" + feed.user_id}>
								{feed.user?.first_name +
									" " +
									feed.user?.last_name}
							</Link>
							</p>
							<p className="text-sm text-gray-500">
								{endDateWithSuffix(feed.createdAt)}
							</p>
							{feed.group?.group_name && (
							<p className="text-sm text-gray-500">
								Posted From {feed.group?.group_name}
							</p>
							)}
						</div>
					</div>
					<div className="bg-gray-100 p-4 rounded-md">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
							{/* Left section */}
							<div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
								{feed.dashboard_category?.category_name && (
									<span className="text-sm text-white bg-custom-purple px-2 py-1 rounded-md">
										{feed.dashboard_category?.category_name}										
									</span>
								)}
								<span
									className="text-sm text-black-300 cursor-pointer bg-white px-2 py-1 rounded-md"
									onClick={() =>
										showComment(Number(feed.id))
									}>
									Comment (
									{feed.feed_comments?.length as number})
								</span>
								<span
									className="text-sm text-black-300 cursor-pointer bg-white px-2 py-1 rounded-md"
									onClick={() =>
										handleShare(Number(feed.id))
									}>
									Share
								</span>
							</div>

							{/* Right section */}
							<div className="flex justify-end items-center gap-4 text-red-500 w-full"> 
								<HiFlag
									color="red"
									className="w-6 h-6 cursor-pointer"
									onClick={() => handleReport(Number(feed.id))}
								/>
								{loggedUserId==feed?.user_id && (
								<Icon
									icon="trash-outline"
									className="w-6 h-6 cursor-pointer"
									data-tooltip-id="tooltip"
									data-tooltip-content="Delete Feed"
									onClick={() =>
									showDeleteModal(feed.id,feed?.feed_image)}
								/>
								)}
							</div>
						</div>
					</div>
				</div>
			</>

			{/* Modal for Read More */}
			<Modal show={isOpen} onClose={() => setIsOpen(false)}>
				<Modal.Header>
					{feed.user?.first_name + " " + feed.user?.last_name}
				</Modal.Header>
				<Modal.Body>
					<p>
						<div
							dangerouslySetInnerHTML={{
								__html: `
									  ${limitWords(feed.description, 500)}
									  ${
											feed.feed_image
												? `<img src="${
														import.meta.env
															.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
														feed.feed_image
												  }" style="max-width:100%; height:auto;" />`
												: ""
										}
									`,
							}}
						/>
					</p>
				</Modal.Body>
				<Modal.Footer>
					<BtnComponent
						justify="justify-start"
						onClick={() => setIsOpen(false)}
						value="Close"
					/>
				</Modal.Footer>
			</Modal>
			{/* Modal for Share */}
			<Modal show={isShareOpen} onClose={() => setIsShareOpen(false)}>
				<Modal.Header>Share this discussion</Modal.Header>
				<Modal.Body>
					<p>
						<div
							dangerouslySetInnerHTML={{
								__html: limitWords(feed.description, 13),
							}}
						/>
						<div>
							<Input
								placeholder="Share Link"
								name={"resume_title"}
								value={inputShareValue}
							/>
						</div>
					</p>
				</Modal.Body>
				<Modal.Footer>
					<FlexStartEnd>
						<BtnComponent
							justify="justify-start"
							onClick={() => handleCopy()}
							value={shareBtnValue}
						/>
						<BtnComponent
							justify="justify-end"
							onClick={() => setIsShareOpen(false)}
							value="Close"
						/>
					</FlexStartEnd>
				</Modal.Footer>
			</Modal>

			{/* Modal for Share */}
			<Modal show={isReportOpen} onClose={() => setIsReportOpen(false)}>
				<Modal.Header>Report</Modal.Header>
				<Modal.Body>
					<Radio.Group size="large" buttonStyle="solid" name="reason" onChange={handleChangeReason}>
						<Radio value="spam">Spam</Radio>
						<Radio value="offensive">Offensive</Radio>
						<Radio value="other">Other</Radio>
					</Radio.Group>
				</Modal.Body>
				<Modal.Footer>
					<BtnComponent
						justify="justify-start"
						onClick={() => ReportSubmit()}
						value="Submit"
					/>
				</Modal.Footer>
			</Modal>
			<Drawer
				title="Add a comment"
				width={720}
				onClose={closeComment}
				open={isCommentOpen}>
				<div>
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<Form.Item
							name="comment_desc"
							label="Comment"
							rules={[
								{
									required: true,
									message: "please enter comment",
								},
							]}>
							<Input.TextArea
								rows={4}
								placeholder="please enter comment"
							/>
						</Form.Item>
						<Form.Item>
							<BtnComponent
								justify="justify-start"
								value="Submit"
								type="submit"
							/>
						</Form.Item>
					</Form>
				</div>
				<div className="mt-4 ">
					{comments.length > 0 ? (
						comments.map(comment => (
							<Card className="bg-gray-100 rounded-lg mb-4">
								<Meta
									avatar={
										<Avatar
											src={
												comment.user?.image
													? import.meta.env
															.VITE_BASE_URL +
													  "upload/profile/" +
													  comment.user?.image
													: "/assets/images/user.svg"
											}
										/>
									}
									title={
										comment.user?.first_name +
										" " +
										comment.user?.last_name
									}
									description={comment.comment_desc}
								/>
							</Card>
						))
					) : (
						<div className="text-center text-gray-500">
							No any comments.
						</div>
					)}
				</div>
			</Drawer>
			<ConfirmPopup
				isDeleteConfirm={isDeleteConfirm}
				setIsDeleteConfirm={setIsDeleteConfirm}
				setIsDeleteCancelled={setIsDeleteCancelled}
				data={ConfirmPopupData}
				setConfirmResult={setConfirmResult}
				cancelBtnTitle={cancelBtnTitle}
				confirmBtnTitle={confirmBtnTitle}
				ConfirmModal={submitDelete}
				itemId={Number(itemId)}
			/>
		</>
	);
};

export default AlumniDashboardCard;
