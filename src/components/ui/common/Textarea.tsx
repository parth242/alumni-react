const Textarea = (props: any) => {
	return (
		<div className="">
			{props.label && (
				<label
					htmlFor={props.name}
					className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
					{props.label}
				</label>
			)}
			<div className="">
				<textarea
					name={props.name}
					rows={5}
					className="block py-1.5  shadow-sm  ring-inset ring-gray-300  focus:border-primary focus:outline-none focus:ring-primary sm:leading-6 dark:bg-slate-800 px-3 w-full p-2 rounded-lg border ring-0 border-border dark:border-border-dark outline-none text-gray-900 placeholder:text-gray-400 sm:text-sm dark:ring-border-dark dark:bg-transparent dark:text-white" placeholder={props.placeholder}
					defaultValue={""}
					{...(props.register &&
						props.register(props.name, {
							onChange: () => {
								props.trigger && props.trigger(props.name);
							},
						}))}
				/>
			</div>
			{props.error && <div className="text-red-600">{props.error}</div>}
		</div>
	);
};

export default Textarea;
