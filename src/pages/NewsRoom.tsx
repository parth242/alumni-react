import React, { useState, useEffect } from "react";
import { ArchiveType } from "../components/ui/NewsItem";
import ArchiveSidebar from "../components/ui/ArchiveSidebar";
import NewsItem from "../components/ui/NewsItem";
import SiteNavbar from "components/layout/sitenavbar";
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { pageStartFrom } from "utils/consts";
import PaginationBar from "components/ui/paginationBar";
import { useNewss } from "api/services/newsService";
import { INews } from "utils/datatypes";
import ReactTooltip from "react-tooltip";
import { Button } from "flowbite-react";
import BtnLink from "components/ui/common/BtnLink";

function NewsRoom() {
	const navigate = useNavigate();
	const [archive, setArchive] = useState<ArchiveType>({});
	const [activeMonth, setActiveMonth] = useState<string>("");

	const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchTextChanged, setSearchTextChanged] = useState(false);
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const [newss, setNewss] = useState<INews[]>([]);
	const [totalNewss, setTotalNewss] = useState<INews[]>([]);

	const {
		isLoading,
		data: newsList,
		refetch: fetchNewsList,
		isFetching: isFetchingNewsList,
	} = useNewss({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: pageSize.value,
		group_id: 0,
	}) || [];

	console.log("newsList", newsList);

	useEffect(() => {
		setPageNumber(pageStartFrom);
		setTimeout(() => {
			fetchNewsList();
		}, 200);
	}, [activeStatus, pageSize]);

	useEffect(() => {
		fetchNewsList();
	}, [pageNumber]);

	useEffect(() => {
		if (newsList) {
			if (pageNumber == 1) {
				setNewss([]);
				setTotalRecords(0);
				setCurrentRecords(0);
			}
			setNewss(prevUsers => [...prevUsers, ...newsList.data]);
			setTotalRecords(newsList.total_records);
			setTotalNewss(newsList.total_data);
			setCurrentRecords(
				prevCurrentRecords => prevCurrentRecords + newsList.data.length,
			);

			const archiveData: ArchiveType = newsList.total_data.reduce(
				(acc, news) => {
					const month = new Date(news.posted_date).toLocaleString(
						"default",
						{
							month: "long",
							year: "numeric",
						},
					);
					acc[month] = acc[month] ? acc[month] + 1 : 1;
					return acc;
				},
				{} as ArchiveType,
			);

			setArchive(archiveData);
		} else {
			setNewss([]);
			setTotalNewss([]);
			setTotalRecords(0);
			setCurrentRecords(0);
			setArchive({});
		}
	}, [newsList]);

	const handleFilterChange = (month: string) => {
		setActiveMonth(month);
		if (month) {
			const filtered = totalNewss.filter(news => {
				const newsMonth = new Date(news.posted_date).toLocaleString(
					"default",
					{
						month: "long",
						year: "numeric",
					},
				);
				return newsMonth === month;
			});
			setNewss(filtered);
		} else {
			setNewss(newss);
		}
	};

	useEffect(() => {
		ReactTooltip.rebuild();
	}, []);

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full ">
				<div className="w-full md:w-10/12 mx-auto py-6 px-4 relative">
				<div className="flex justify-between items-center mb-4">
					<h1 className="md:text-3xl text-xl text-black font-bold mb-2 text-center mb-4">
					News Room {activeMonth}
					</h1>
					<Button
						style={{
							backgroundColor: "#440178",
						}}
						className="text-center text-white ml-auto"
						onClick={() =>
							{ fetchNewsList(); setActiveMonth(""); handleFilterChange("");
							}
						}
							outline>
							Back to All News
						</Button>
					
				</div>
					{/* Loader */}
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner size="xl" />
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
							{/* Sidebar Section */}
							<div className="lg:col-span-1 shadow-[0_0_16px_5px_rgba(0,0,0,0.1)] hover:animate-jump rounded-xl">
								<ArchiveSidebar
									archive={archive}
									onFilterChange={handleFilterChange}
								/>
							</div>

							{/* Main News Section */}
							<div className="lg:col-span-3">
								<div className="grid grid-cols-1 md:grid-cols-1 gap-6">
									{newss && newss.length > 0 ? (
										newss.map((INews, index) => (
											<NewsItem
												key={index}
												news={INews}
											/>
										))
									) : (
										<p className="col-span-2 text-center">
											No news available for the selected
											month.
										</p>
									)}
								</div>
								<div className="flex justify-center mt-10">
									{currentRecords < totalRecords && (
										<Button
											style={{
												backgroundColor: "#440178",
											}}
											className="text-center text-white"
											onClick={() =>
												setPageNumber(pageNumber + 1)
											}
											outline>
											{isLoading
												? "Loading..."
												: "Load More"}
										</Button>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default NewsRoom;
