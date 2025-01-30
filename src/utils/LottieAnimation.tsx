import { useEffect, useRef } from "react";
import lottie from "lottie-web";

type LottieProps = {
	animationData: any;
	width: number;
	height: number;
}

export const LottieAnimation = ({
	width,
	height,
	animationData,
}: LottieProps) => {
	const element = useRef<HTMLDivElement>(null);
	const lottieInstance = useRef<any>();

	useEffect(() => {
		if (element.current) {
			lottieInstance.current = lottie.loadAnimation({
				animationData,
				container: element.current,
			});
		}
		return () => {
			lottieInstance.current?.destroy();
		};
	}, [animationData]);

	return <div style={{ width, height }} ref={element}></div>;
};

export default LottieAnimation;
