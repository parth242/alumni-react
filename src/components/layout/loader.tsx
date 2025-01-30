import LottieAnimation from "utils/LottieAnimation";
import loader from "utils/loading.json";
import { classNames } from "utils";

type LoaderRequestType = {
	additionalClassName?: string[];
};

const Loader: React.FC<LoaderRequestType> = ({ additionalClassName }) => {
	const circleCommonClasses = "h-3 w-3 bg-primary rounded-full";
	return (
		<div
			className={classNames(
				`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/20`,
				additionalClassName,
			)}>
			<LottieAnimation animationData={loader} width={80} height={80} />
		</div>
	);
};

export default Loader;
