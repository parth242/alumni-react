import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const TabsComponent = () => {
	const location = useLocation();
	const pathName = location.pathname;
	const { id } = useParams() as {
		id: string;
	};
	
	return (
		<ul id="tabs" className="inline-flex pt-2 px-1 w-full border-b">
			<li
				className={`${
					/^\/admin\/alumni-details(\/\d+)?$/.test(pathName)
						? "bg-custom-purple text-white"
						: "bg-white text-gray-800"
				} px-4 font-semibold py-2 rounded-t border-t border-r border-l -mb-px`}>
				<Link
					to={id ? `/admin/alumni-details/${id}` : "#"}						
					className={`px-4 py-2 rounded ${
						id ? "" : "cursor-not-allowed text-gray-400"
					}`}
					onClick={(e) => {
						if (!id) {
							e.preventDefault(); // Prevent navigation when disabled
						}
					}}
				>
					Basic Profile
				</Link>				
			</li>
			<li
				className={`${
					/^\/admin\/alumni-location(\/\d+)?$/.test(pathName)
						? "bg-custom-purple text-white"
						: "bg-white text-gray-800"
				} px-4 font-semibold py-2 rounded-t border-t border-r border-l -mb-px`}>
				<Link
					to={id ? `/admin/alumni-location/${id}` : "#"}
					className={`px-4 py-2 rounded ${
						id ? "" : "cursor-not-allowed text-gray-400"
					}`}
					onClick={(e) => {
						if (!id) {
							e.preventDefault(); // Prevent navigation when id does not exist
						}
					}}
				>
					Location
				</Link>
			</li>
			<li
				className={`${
					/^\/admin\/alumni-education(\/\d+)?$/.test(pathName)
						? "bg-custom-purple text-white"
						: "bg-white text-gray-800"
				} px-4 font-semibold py-2 rounded-t border-t border-r border-l -mb-px`}>
				<Link
					to={id ? `/admin/alumni-education/${id}` : "#"}					
					className={`px-4 py-2 rounded ${
						id ? "" : "cursor-not-allowed text-gray-400"
					}`}
					onClick={(e) => {
						if (!id) {
							e.preventDefault(); // Prevent navigation when disabled
						}
					}}
				>
					Education Details
				</Link>				
			</li>
			<li
				className={`${
					/^\/admin\/work-details(\/\d+)?$/.test(pathName)
						? "bg-custom-purple text-white"
						: "bg-white text-gray-800"
				} px-4 font-semibold py-2 rounded-t border-t border-r border-l -mb-px`}>
				<Link
					to={id ? `/admin/work-details/${id}` : "#"}						
					className={`px-4 py-2 rounded ${
						id ? "" : "cursor-not-allowed text-gray-400"
					}`}
					onClick={(e) => {
						if (!id) {
							e.preventDefault(); // Prevent navigation when disabled
						}
					}}
				>
					Work Details
				</Link>				
			</li>
		</ul>
	);
};

export default TabsComponent;
