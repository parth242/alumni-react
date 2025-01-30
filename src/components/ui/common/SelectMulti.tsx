import Select, { StylesConfig } from 'react-select';

const SelectMulti = (props: any) => {
	const classnamenew = props.className || "w-80";
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
				
			<Select
    name={props.name}				
    closeMenuOnSelect={false}
    value={props.defaultValue}
    isMulti
    options={props.items}
    getOptionLabel={(option:any) => option.text}
    className={classnamenew}
    onChange={props.onChange}
/>
		
				{props.error && (<span className="text-xs text-red-500"><span>{props.error}</span></span>)}
			</div>
		</div>
	);
};

export default SelectMulti;
