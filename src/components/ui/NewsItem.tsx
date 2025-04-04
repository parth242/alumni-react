import React from "react";
import { INews } from "utils/datatypes";
import BtnLink from "./common/BtnLink";

export interface ArchiveType {
	[key: string]: number;
}

interface NewsItemProps {
	news: INews;
}

export const formatDateWithSuffix = (dateString: string) => {
	const date = new Date(dateString);
	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();

	// Add ordinal suffix to day
	const suffix = (day: number) => {
		if (day > 3 && day < 21) return "th"; // covers 11th, 12th, 13th, etc.
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	return `on ${day}${suffix(day)} ${month}, ${year}`;
};

export const endDateWithSuffix = (dateString: string) => {
	const date = new Date(dateString);
	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();

	// Add ordinal suffix to day
	const suffix = (day: number) => {
		if (day > 3 && day < 21) return "th"; // covers 11th, 12th, 13th, etc.
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	return `${day}${suffix(day)} ${month}, ${year}`;
};

const NewsItem: React.FC<NewsItemProps> = ({ news }) => (
	<div className="rounded-2xl overflow-hidden shadow-[0_0_16px_5px_rgba(0,0,0,0.1)] hover:bg-neutral-100 flex flex-col hover:cursor-pointer">
		<div className="px-6 pt-6 flex-grow">
			<div className="flex items-center justify-between">
				<div className="font-semibold text-lg mb-2 text-black">
					{news.title}
				</div>
			</div>
			<p className="text-gray-700 text-sm ">{news.description}</p>
		</div>
		<div className="px-6 pt-2 flex-grow mb-8 mt-6">
			<div className="flex items-center justify-between">
				<BtnLink
					style={{ backgroundColor: "#440178" }}
					to={`/newsroom/${news.id}`}>
					Read More
				</BtnLink>
				<BtnLink
					style={{
						backgroundColor: "#ffffff",
						borderWidth: "1px",
						borderColor: "#440178",
						fontWeight: "semibold",
					}}
					to={`/newsroom/${news.id}`}>
					Posted {formatDateWithSuffix(news.posted_date)}
				</BtnLink>
			</div>
		</div>
	</div>
	// <Card className="mb-4">
	// 	<CardHeader floated={false} shadow={false} className="bg-blue-gray-50">
	// 		<h5 className="text-l font-bold tracking-tight text-gray-900 line-clamp-2">
	// 			{news.title}
	// 		</h5>
	// 	</CardHeader>
	// 	<CardBody>
	// 		<p className="font-normal text-gray-700 line-clamp-2">
	// 			{news.description}
	// 		</p>
	// 		<p className="text-sm text-gray-500 mb-4 mt-4">
	// 			{formatDateWithSuffix(news.posted_date)}
	// 		</p>
	// 		<div className="flex justify-end">
	// 			<Link to={`/newsroom/${news.id}`}>
	// 				<Button
	// 					style={{ backgroundColor: "#440178" }}
	// 					className="text-center text-white"
	// 					outline
	// 					size="md">
	// 					Read More{" "}
	// 				</Button>
	// 			</Link>
	// 		</div>
	// 	</CardBody>
	// </Card>
);

export default NewsItem;
