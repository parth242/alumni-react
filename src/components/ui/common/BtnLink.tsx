import { Link } from "react-router-dom";

interface BtnLinkProps {
	children: React.ReactNode;
	to?: string;
	onClick?: () => void;
	props?: any;
	style?: React.CSSProperties;
	className?: string;
}

const BtnLink: React.FC<BtnLinkProps> = ({
	children,
	to,
	onClick,
	props,
	style,
	className,
}) => {
	return (
		<Link
			className={`md:text-sm text-xs flex items-center gap-2 bg-custom-purple text-white px-2 py-1 rounded-md ${className}`}
			to={to || ""}
			onClick={onClick}
			{...props}
			style={style}>
			{children}
		</Link>
	);
};

export default BtnLink;
