import { InternalSectionType } from "utils/types/automation-types";

const InternalSection: React.FC<InternalSectionType> = ({
	setActiveSection,
	activeSection,
	data,
}) => {
	return (
		<div className="z-10 mt-4 flex flex-row gap-4 ">
			{data.map(item => (
				<button
					key={item.id}
					disabled={item.disable}
					onClick={() => {
						setActiveSection(item.name);
					}}
					className={`${item.style} text-sm ${
						item.disable
							? "cursor-not-allowed text-gray-400"
							: "hover:text-primary"
					} font-medium leading-5 ${
						activeSection == item.name
							? " text-primary underline decoration-primary decoration-2 underline-offset-[12px]"
							: " text-gray-500 dark:text-darkPrimary"
					}`}
					value={item.name}>
					{item.label}
				</button>
			))}
		</div>
	);
};

export default InternalSection;
