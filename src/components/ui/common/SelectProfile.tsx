const Select = (props: any) => {
	return (
		<div className="">
			{props.label && (
				<label
					htmlFor="username"
					className="block text-sm font-medium leading-6 text-gray-900 dark:text-white  ">
					{props.label}
				</label>
			)}
			<div className="">
				<select
					name={props.name}
					className="block  bg-white shadow-sm ring-inset ring-gray-300 focus:border-primary focus:outline-none focus:ring-primary  w-full p-3 rounded-md border ring-0 border-border dark:border-border-dark outline-none text-gray-900 placeholder:text-gray-400 sm:text-sm dark:ring-border-dark dark:bg-transparent dark:text-white"
					{...(props.register && props.register(props.name,{onChange: (e:any) => {
						props.onChange && props.onChange(e);
						}}))}>
						{props.label && (
					<option value={""}>Select {props.label}</option>
						)}
					{props.items &&
						props.items.map((item: any) => (
							<option value={item.value} key={item.value}>
								{item.text}
							</option>
						))}
				</select>

				{props.error && <div className="text-red-600">{props.error}</div>}
			</div>
		</div>
	);
};

export default Select;
