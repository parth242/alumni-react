import { Card } from "antd";
import { FooterComponent } from "components/layout/Footer";
import SiteNavbar from "components/layout/sitenavbar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pageStartFrom } from "utils/consts";
import { useGroups } from "api/services/groupService";
import { IUser, IUserGroup } from "utils/datatypes";

const { Meta } = Card;

// JSON array with 30 group data

const MyGroups = () => {
	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [groups, setGroups] = useState<IUserGroup[]>([]);

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);
	const [userId, setUserId] = useState(0);

	useEffect(() => {
		const userString = localStorage.getItem("user");
		if (userString !== null) {
			const items = JSON.parse(userString);
			setUserId(items.id);
		}
	}, []);

	const {
		isLoading,
		data: groupList,
		refetch: fetchGroupList,
		isFetching: isFetchingGroupList,
	} = useGroups({
		enabled: userId > 0,
		filter_status: activeStatus,
		filter_name: searchText,
		user_id: userId,
		page_number: pageNumber,
		page_size: pageSize.value,
	}) || [];

	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchGroupList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchGroupList();
	}, [pageNumber]);

	useEffect(() => {
		if (groupList) {
			if (pageNumber == 1) {
				setGroups([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setGroups(prevUsers => [...prevUsers, ...groupList.data]);
			setTotalRecords(groupList.total_records);
			setCurrentRecords(
				prevCurrentRecords =>
					prevCurrentRecords + groupList.data.length,
			);
		} else {
			setGroups([]);
			setTotalRecords(0);
			setCurrentRecords(0);
		}
	}, [groupList]);

	console.log("groups", groups);

	return (
		<>
			<div className="w-full bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full">
				<div className="max-w-screen-xl mx-auto py-6 px-4 lg:px-6">
					{/* Header Section */}
					<div className="flex flex-col items-center lg:flex-row lg:justify-between mb-6">
						<h1 className="text-2xl sm:text-3xl font-bold text-black text-center lg:text-left">
							My Groups
						</h1>
					</div>

					{/* Groups Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{groups.map(group => (
							<Link
								to={`/my-groups/${group.group_id}`}
								key={group.group_id}>
								<Card
									hoverable
									className="w-full"
									cover={
										<img
											alt="group"
											src="/group.webp"
											className="rounded-t-lg"
										/>
									}>
									<Meta title={group.group?.group_name} />
								</Card>
							</Link>
						))}
					</div>
				</div>
			</div>
			<FooterComponent />
		</>
	);
};

export default MyGroups;
