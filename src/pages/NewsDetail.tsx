import SiteNavbar from "components/layout/sitenavbar";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNews } from "api/services/newsService";
import { Button } from "flowbite-react";
import { Divider } from "antd";

function NewsDetail() {
	const { id } = useParams() as {
		id: string;
	};

	let {
		isLoading,
		data: newsDetails,
		refetch: fetchNewsDetails,
		isFetching: isFetchingNewsDetails,
		remove,
	} = getNews({
		enabled: +id > 0,
		id: +id,
	}) || [];
	useEffect(() => {
		if (id) {
			fetchNewsDetails();
		} else {
			newsDetails = undefined;
		}
	}, [id]);

	const news = newsDetails?.data;

	if (!news) {
		return (
			<div className="container mx-auto p-4">
				<h2>News not found</h2>
				<Link to="/newsroom" className="text-blue-500 hover:underline">
					Go back to News Room
				</Link>
			</div>
		);
	}

	// Split description into paragraphs
	const paragraphs = news.description
		.split("\n\n")
		.map((para: string, index: number) => (
			<p key={index} className="mb-4">
				{para}
			</p>
		));

	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<SiteNavbar />
			</div>
			<div className="w-full ">
				<div className="md:w-10/12 w-full mx-auto py-6 px-4 relative">
					<h1 className="md:text-3xl text-xl text-black font-bold mb-2 text-center mb-4">
						{news.title}
					</h1>
					<Divider />
					{paragraphs}
					<Link to={`/newsroom`}>
						<Button
							style={{ backgroundColor: "#440178" }}
							className="text-center text-white"
							outline
							size="md">
							Go back to News Room
						</Button>
					</Link>
				</div>
			</div>
		</>
	);
}

export default NewsDetail;
