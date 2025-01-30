const ProductLoader = () => {
	return (
		<div className="flex w-full flex-row gap-6 rounded-lg bg-gray-100 py-4 px-6 dark:bg-dark2">
			<div className="h-24 w-[98px] animate-pulse rounded-lg bg-gray-200 dark:bg-dark3" />
			<div className=" flex  flex-col justify-center gap-2">
				<div className="mt-2 h-4  w-[124px] animate-pulse items-center  rounded-md bg-gray-200 dark:bg-dark3"></div>
				<div className="mt-2 h-4 w-[192px] animate-pulse items-center rounded-md bg-gray-200 dark:bg-dark3"></div>
			</div>
		</div>
	);
};

export default ProductLoader;
