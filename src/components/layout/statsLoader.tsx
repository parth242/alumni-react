import { classNames } from "utils";
import { useAppState } from "utils/useAppState";

const StatsLoader: React.FC<{ count: number }> = ({ count }) => {
	const [{ isDark }] = useAppState();
	const skeletonCards = [...Array(count).keys()];
	return (
		<>
			{skeletonCards.map((index: number) => (
				<div
					key={index}
					className="inline-block items-center justify-center overflow-hidden text-gray-900">
					<div className="inline-flex items-center justify-center overflow-hidden rounded-full">
						<svg
							className="float-left animate-pulse "
							width="120"
							height="120"
							viewBox="0 0 120 120">
							<circle
								cx="60"
								cy="60"
								r="54"
								fill="none"
								stroke={isDark ? "#6b7280" : "#E5E7EB"}
								strokeWidth="8"
							/>
							<circle
								className=""
								cx="60"
								cy="60"
								r="54"
								fill="none"
								stroke={isDark ? "#6b7280" : "#E5E7EB"}
								strokeWidth="8"
								pathLength="100"
								strokeDasharray="100"
								strokeDashoffset="0"
								transform="rotate(-90,60,60)"
								strokeLinecap="round"
							/>
						</svg>
					</div>
					<div className="mt-2 h-4 w-full items-center rounded-md bg-gray-100 dark:bg-gray-500"></div>
					<div className="mt-2 h-4 w-full items-center rounded-md bg-gray-100 dark:bg-gray-500"></div>
				</div>
			))}
		</>
	);
};

export default StatsLoader;
