import toast, { ToastPosition } from "react-hot-toast";

type LoaderRequestType = {
	title: string;
	id?: string | "";
	position?: string;
};

const Toast: React.FC<LoaderRequestType> = ({
	title,
	id,
	position = "top-right",
}) => {
	toast.success(title, {
		id: id,
		position: position as ToastPosition,
		className: "dark:bg-dark3 dark:text-darkPrimary",
	});
	return <></>;
};

export default Toast;
