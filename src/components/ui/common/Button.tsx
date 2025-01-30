import React from "react";

type Props = {
	border?: string;
	color?: string;
	children?: React.ReactNode;
	height?: string;
	onClick?: () => void;
	radius?: string;
	width?: string;
	paddingX?: string;
	paddingY?: string;
	style?: string;
	disabled?: boolean;
	data_html?: boolean;
	data_tip?: string;
	marginR?: string;
	type?: "button" | "submit" | "reset" | undefined;
	noDisabledClass?: boolean;
	className?: string;
}

const Button: React.FC<Props> = ({
	children,
	onClick,
	paddingX = "4",
	paddingY = "2",
	style,
	disabled,
	data_html,
	type,
	marginR,
	data_tip,
	noDisabledClass,
	className,
}) => {
	return (
		<button
			type={type}
			data-tip={data_tip}
			data-html={data_html}
			onClick={onClick}
			disabled={disabled}
			className={`${marginR ? `mr-${marginR}` : ""
				} rounded-md border border-transparent ${style ? style : ""
				} py-${paddingY} px-${paddingX} text-sm font-medium shadow-sm hover:bg-primary focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 
     
      ${disabled && !noDisabledClass
					? " cursor-not-allowed bg-gray-200 text-gray-400 hover:bg-gray-200 dark:bg-dark2 dark:text-darkPrimary dark:disabled:bg-dark3 dark:disabled:text-darkSecondary"
					: "bg-primary"
				} ${className}`}>
			{children}
		</button>
	);
};

export default Button;
