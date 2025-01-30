import React from "react";
import Icon from "utils/icon";

type CarouselType = {
	children: JSX.Element;
	currentIndex: number;
	setCurrentIndex: (fl: number) => void;
	slides: any[] | null;
};

const Carousel: React.FC<CarouselType> = ({
	slides,
	children,
	currentIndex,
	setCurrentIndex,
}) => {
	const prevSlide = () => {
		const isFirstSlide = currentIndex === 0;
		const newIndex = isFirstSlide ? slides!.length - 1 : currentIndex - 1;
		setCurrentIndex(newIndex);
	};

	const nextSlide = () => {
		const isLastSlide = currentIndex === slides!.length - 1;
		const newIndex = isLastSlide ? 0 : currentIndex + 1;
		setCurrentIndex(newIndex);
	};

	const goToSlide = (slideIndex: number) => {
		setCurrentIndex(slideIndex);
	};

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div
				// src={`url(${slides[currentIndex].url})`}
				// style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
				className="h-fit w-full rounded-2xl  duration-500">
				{children}
			</div>
			<div className="flex flex-row items-center justify-center gap-6">
				{/* Left Arrow */}
				<div
					onClick={prevSlide}
					className="cursor-pointer rounded-md bg-gray-100 p-2 text-2xl">
					<Icon
						icon="chevron-left"
						className="h-5 w-5 stroke-2 text-gray-900"
					/>
				</div>
				<div className="flex flex-row items-center justify-center gap-5">
					{slides!.map((slide, slideIndex) => (
						<div
							key={slideIndex}
							onClick={() => goToSlide(slideIndex)}
							className={` inline-flex cursor-pointer items-center justify-center ${
								currentIndex === slideIndex
									? "h-5 w-5 rounded-full bg-red-200 p-1"
									: ""
							}`}>
							<Icon
								icon="circle"
								className={` h-2.5 w-2.5 ${
									currentIndex === slideIndex ? "text-primary" : "text-gray-200"
								}`}
							/>
						</div>
					))}
				</div>
				{/* Right Arrow */}
				<div
					onClick={nextSlide}
					className="cursor-pointer rounded-md bg-gray-100 p-2 text-2xl">
					<Icon
						icon="chevron-right"
						className="h-5 w-5 stroke-2 text-gray-900"
					/>
				</div>
			</div>
		</div>
	);
};

export default Carousel;
