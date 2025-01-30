import { pageStartFrom } from "utils/consts";
import { StatusButtonsType } from "utils/datatypes";
import { TemplateStatusClassType } from "utils/types/template-types";

type RequestType = {
	setActiveStatus: (v: string) => void;
	setSearchText: (v: string) => void;
	setPageNumber?: (v: number) => void;
	setExpanded?: (v: number) => void;
	statusName: TemplateStatusClassType;
	activeStatus: string;
	data: StatusButtonsType;
};

const StatusButtons: React.FC<RequestType> = ({
	setActiveStatus,
	setSearchText,
	setPageNumber,
	setExpanded,
	statusName,
	data,
	activeStatus,
}) => {
	return (
		<span className="float-left inline-block">
			{data?.map(item => (
				<button
					key={item.id}
					onClick={() => {
						setActiveStatus(statusName[item.type]);
						setSearchText("");
						if (setPageNumber) {
							setPageNumber(pageStartFrom);
						}
						if (setExpanded) {
							setExpanded(-1);
						}
					}}
					className={`mx-2 rounded-md p-2 hover:text-primary ${
						activeStatus == statusName[item.type]
							? "bg-red-100 text-primary dark:bg-primary/20"
							: "dark:text-darkPrimary"
					}`}
					value={item.type}>
					{item.name}
				</button>
			))}
		</span>
	);
};

export default StatusButtons;
