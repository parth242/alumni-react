import { Avatar, Card, Form, Input } from "antd";
import SiteNavbar from "components/layout/sitenavbar";
import BtnComponent from "components/ui/BtnComponent";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import LinkCommon from "components/ui/common/LinkCommon";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { HTTPError } from "ky";
import { IFeed, IComment, TCommentFormData } from "utils/datatypes";
import {
	createComment,
	useFeedComments,
	getFeed,
} from "api/services/feedService";
import {
	ErrorToastMessage,
	SuccessToastMessage,
	useUploadImage,
} from "api/services/user";
import { FooterComponent } from "components/layout/Footer";

const { Meta } = Card;

const ViewFeedInfo: React.FC = () => {
	const { id } = useParams() as {
		id: string;
	};

	const [form] = Form.useForm();

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [comments, setComments] = useState<IComment[]>([]);

	let {
		data: feedDetails,
		refetch: fetchFeedDetails,
		isFetching: isFetchingFeedDetails,
		remove,
	} = getFeed({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchFeedDetails();
		} else {
			feedDetails = undefined;
			setTimeout(() => {
				form.resetFields();
			});
		}
	}, [id]);

	const { mutate, isLoading, isError, isSuccess, error } = useMutation(
		createComment,
		{
			onSuccess: async (res: any) => {
				SuccessToastMessage({
					title: "Comment Posted Successfully",
					id: "comment_user_success",
				});

				form.resetFields();

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
		data.feed_id = Number(id);
		mutate(data);
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
		feed_id: Number(id),
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
	}, [id]);

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
	//console.log('feedDetails',feedDetails?.data?.description);
	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full">
				<div className="w-11/12 lg:w-9/12 mx-auto py-6 px-4 relative bg-gray-50 rounded-lg mt-10">
					<div>
						<h1 className="text-2xl sm:text-3xl text-black font-bold mb-4 lg:mb-0">
							Discussion Details
						</h1>
					</div>

					<div className="mt-4">
						<Card className="bg-gray-50 rounded-lg">
							<Meta
								avatar={
									<Avatar
										src={
											feedDetails?.data?.user?.image
												? import.meta.env
														.VITE_BASE_URL +
												  "upload/profile/" +
												  feedDetails?.data?.user.image
												: "/assets/images/user.svg"
										}
									/>
								}
								title={
									feedDetails?.data?.user?.first_name +
									" " +
									feedDetails?.data?.user?.last_name
								}
								description={feedDetails?.data?.description}
							/>
						</Card>
					</div>
					<div className="mt-4">
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
				</div>
			</div>
			<FooterComponent />
		</>
	);
};

export default ViewFeedInfo;
