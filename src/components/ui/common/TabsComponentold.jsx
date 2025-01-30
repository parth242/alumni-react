import React from "react";
import { Link, useLocation } from "react-router-dom";

const TabsComponent = () => {
	const location = useLocation();
	const pathName = location.pathname;
	
	return (
		<ul id="tabs" className="inline-flex pt-2 px-1 w-full border-b">
			<li
				className={`${
					/^\/admin\/alumni-details(\/\d+)?$/.test(pathName)
						? "bg-custom-purple text-white"
						: "bg-white text-gray-800"
				} px-4 font-semibold py-2 rounded-t border-t border-r border-l -mb-px`}>
				<Link to="/admin/alumni-details">Basic Profile</Link>
			</li>
			<li
				className={`${
					/^\/admin\/alumni-location(\/\d+)?$/.test(pathName)
						? "bg-custom-purple text-white"
						: "bg-white text-gray-800"
				} px-4 font-semibold py-2 rounded-t border-t border-r border-l -mb-px`}>
				<Link to="/admin/alumni-location">Location</Link>
			</li>
			<li
				className={`${
					/^\/admin\/alumni-education(\/\d+)?$/.test(pathName)
						? "bg-custom-purple text-white"
						: "bg-white text-gray-800"
				} px-4 font-semibold py-2 rounded-t border-t border-r border-l -mb-px`}>
				<Link to="/admin/alumni-education">Education Details</Link>
			</li>
			<li
				className={`${
					/^\/admin\/work-details(\/\d+)?$/.test(pathName)
						? "bg-custom-purple text-white"
						: "bg-white text-gray-800"
				} px-4 font-semibold py-2 rounded-t border-t border-r border-l -mb-px`}>
				<Link to="/admin/work-details">Work Details</Link>
			</li>
		</ul>
	);
};

export default TabsComponent;
