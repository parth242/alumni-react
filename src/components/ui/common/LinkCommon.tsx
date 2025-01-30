import { Link } from "react-router-dom";

interface LinkCommonProps {
	children: React.ReactNode;
	to?: string;
	onClick?: () => void;
	props?: any;
}

const LinkCommon: React.FC<LinkCommonProps> = ({
	children,
	to,
	onClick,
	props,
}) => {
	return (
		<Link
			className="flex gap-2 items-center text-center text-xs mx-auto font-semibold text-black px-4 py-2 border-2 border-custom-purple rounded-md bg-white hover:bg-custom-purple hover:text-white"
			to={to || ""}
			onClick={onClick}
			{...props}>
			{children}
		</Link>
	);
};

export default LinkCommon;
