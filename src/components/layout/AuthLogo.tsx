type Props = {
	message: string;
};
const AuthLogo = ({ message }: Props) => {
	return (
		<div className="mb-10">
			
			<h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-darkPrimary">
				{message}
			</h2>
		</div>
	);
};

export default AuthLogo;
