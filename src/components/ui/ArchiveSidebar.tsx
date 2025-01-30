import React from "react";
import { ArchiveType } from "./NewsItem";
import { Button } from "flowbite-react";
import BtnComponent from "./BtnComponent";

interface ArchiveSidebarProps {
	archive: ArchiveType;
	onFilterChange: (month: string) => void;
}

const ArchiveSidebar: React.FC<ArchiveSidebarProps> = ({
	archive,
	onFilterChange,
}) => {
	return (
		<div className="archive-sidebar space-x-4 mt-6 mb-6">
			<h3 className="mb-4 text-lg font-bold ml-4">Archive</h3>
			<ul className="space-y-2">
				{Object.keys(archive).map(month => (
					<li key={month}>
						<BtnComponent
							justify="justify-start"
							onClick={() => onFilterChange(month)}
							value={`${month} (${archive[month]})`}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ArchiveSidebar;
