import { classNames } from "utils";
import { pageStartFrom } from "utils/consts";
import Icon from "utils/icon";

type RequestType = {
	total?: number;
	campaignsPerPage: number;
	totalCampaigns: number;
	siblingCount?: number;
	currentPage: number;
	pageSize?: number;
	paginateFront: () => void;
	paginateBack: () => void;
	paginate: (pageNumber: number) => void;
	handleCampaignperChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function PaginationBar({
	campaignsPerPage,
	totalCampaigns,
	paginateFront,
	paginateBack,
	paginate,
	currentPage,
	handleCampaignperChange,
}: RequestType) {
	const displayItems = 4;
	const pageNumbers: number[] = [];
	const totalPages: number = Math.ceil(totalCampaigns / campaignsPerPage);
	let start = currentPage - 2 > pageStartFrom ? currentPage - 2 : pageStartFrom;
	if (totalPages - 3 < currentPage) {
		start = totalPages - displayItems;
		start = start < pageStartFrom ? pageStartFrom : start;
	}
	let end = 0;
	if (currentPage + 2 < totalPages) {
		end = currentPage + 2;
	} else {
		end = totalPages;
	}
	if (currentPage < 3) {
		end = totalPages > displayItems ? displayItems : totalPages;
	}
	for (let i = start; i <= end; i++) {
		pageNumbers.push(i);
	}
	return (
		<div className="mt-6 flex-row justify-between sm:flex">
			<div className="mt-1.5 flex justify-center">
				<span className="align-middle leading-8">Showing</span>
				<select
					className={classNames(
						"mx-2",
						"rounded-md",
						"border",
						"border-gray-300",
						"bg-white",
						"dark:bg-dark1 dark:text-darkPrimary dark:border-dark3",
						"pl-1",
						"py-1",
						"shadow-sm",
						"focus:border-primary",
						"focus:outline-none",
						"focus:ring-primary",
						"sm:text-sm",
					)}
					value={campaignsPerPage}
					onChange={e => handleCampaignperChange(e)}>
					<option value="10">10</option>
					<option value="20">20</option>
					<option value="50">50</option>
					<option value="100">100</option>
				</select>
				<span className="align-middle leading-8">entries</span>
			</div>

			<div className="mt-2 flex justify-center">
				<nav aria-label="Page navigation example">
					<ul className="flex">
						<li>
							<a
								className={classNames(
									"relative",
									"ml-2",
									"block",
									"rounded-lg",
									"border-0",
									"bg-gray-50",
									"dark:bg-dark3 dark:border-dark3",
									"py-1",
									"px-2",
									"outline-none",
									"transition-all",
									"duration-300",
									"focus:shadow-none",
									`${
										currentPage == pageStartFrom
											? "text-gray-400 dark:text-darkSecondary"
											: "text-gray-800 dark:text-darkPrimary"
									}`,
								)}
								href="#"
								onClick={() => {
									if (currentPage > pageStartFrom) paginate(pageStartFrom);
								}}>
								<Icon
									icon="chevron-double-left"
									className="h-6 w-5 stroke-2"
									aria-hidden="true"
								/>
							</a>
						</li>
						<li>
							<a
								className={classNames(
									"relative",
									"ml-2",
									"block",
									"rounded-lg",
									"border-0",
									"bg-gray-50",
									"dark:bg-dark3 dark:border-dark3",
									"py-1",
									"px-2",
									"outline-none",
									"transition-all",
									"duration-300",
									"focus:shadow-none",
									`${
										currentPage == pageStartFrom
											? "text-gray-400 dark:text-darkSecondary"
											: "text-gray-800 dark:text-darkPrimary"
									}`,
								)}
								href="#"
								onClick={() => {
									if (currentPage > pageStartFrom) paginateBack();
								}}>
								<Icon
									icon="chevron-left"
									className="h-6 w-5 stroke-2"
									aria-hidden="true"
								/>
							</a>
						</li>
						{pageNumbers.length ? (
							<>
								{pageNumbers?.map((pageNumber: number, i: number) => {
									return (
										<li key={`${pageNumber}${i}`}>
											<a
												onClick={() => paginate(pageNumber)}
												className={classNames(
													"relative",
													"ml-2",
													"block",
													"rounded-lg",
													"border-0",
													"py-1.5",
													"px-3",
													"outline-none",
													"transition-all",
													"duration-300",
													"hover:bg-primary",
													"hover:text-white",
													"focus:shadow-none",
													`${
														pageNumber === currentPage
															? "bg-primary text-white dark:bg-primary/10 dark:text-primary dark:border-dark3"
															: "bg-gray-200 text-gray-800 dark:bg-dark3 dark:text-darkPrimary dark:border-dark3"
													}`,
												)}
												href="#">
												{pageNumber}
											</a>
										</li>
									);
								})}
							</>
						) : (
							<li>
								<a
									onClick={() => paginate(pageStartFrom)}
									className={classNames(
										"relative",
										"ml-2",
										"block",
										"rounded-lg",
										"border-0",
										`${
											pageStartFrom === currentPage
												? "bg-primary text-white dark:text-primary dark:bg-primary/20"
												: "bg-gray-200 text-gray-800"
										}`,
										"py-1",
										"px-3",
										"text-gray-800",
										"outline-none",
										"transition-all",
										"duration-300",
										"hover:bg-primary",
										"hover:text-white",
										"focus:shadow-none",
										"dark:bg-dark3  dark:border-dark3",
									)}
									href="#">
									{0 + 1}
								</a>
							</li>
						)}
						<li>
							<a
								className={classNames(
									"relative",
									"ml-2",
									"block",
									"rounded-lg",
									"border-0",
									"bg-gray-50",
									"py-1",
									"px-2",
									"outline-none",
									"transition-all",
									"duration-300",
									"focus:shadow-none",
									"dark:bg-dark3 dark:border-dark3",
									`${
										totalPages == currentPage
											? "text-gray-400 dark:text-darkSecondary"
											: "text-gray-800 dark:text-darkPrimary"
									}`,
								)}
								href="#"
								onClick={() => {
									if (currentPage < Math.max(...pageNumbers)) paginateFront();
								}}>
								<Icon
									icon="chevron-right"
									className="h-6 w-5 stroke-2"
									aria-hidden="true"
								/>
							</a>
						</li>
						<li>
							<a
								className={classNames(
									"relative",
									"ml-2",
									"block",
									"rounded-lg",
									"border-0",
									"bg-gray-50",
									"py-1",
									"px-2",
									"outline-none",
									"transition-all",
									"duration-300",
									"focus:shadow-none",
									"dark:bg-dark3 dark:border-dark3",
									`${
										totalPages == currentPage
											? "text-gray-400 dark:text-darkSecondary"
											: "text-gray-800 dark:text-darkPrimary"
									}`,
								)}
								href="#"
								onClick={() => {
									if (currentPage < Math.max(...pageNumbers))
										paginate(totalPages);
								}}>
								<Icon
									icon="chevron-double-right"
									className="h-6 w-5 stroke-2"
									aria-hidden="true"
								/>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}
