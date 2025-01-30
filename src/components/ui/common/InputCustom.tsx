import { useState } from "react";

const Input = (props: any) => {
	return (
		<div className="py-3">
			{props.label && (
				<label
					htmlFor={props.id}
					className="block text-sm font-medium leading-6 mb-1">
					{/* Show * at the start in red */}
					{props.label.startsWith("*") ? (
						<>
							<span style={{ color: "red" }}>*</span>{" "}
							{/* Red asterisk */}
							{props.label.slice(1).trim()}
						</>
					) : (
						props.label
					)}
				</label>
			)}
			<div className="relative">
				{props.preIcon && (
					<span className="absolute top-6 sm:top-5 transform -translate-y-3.5 left-2.5">
						{props.preIcon}
					</span>
				)}
				<input
					type={props.type || "text"}
					name={props.name}
					defaultValue={props.defaultValue}
					className={`w-full p-2 rounded-md border ring-0 border-border outline-none text-gray-900 border-gray-300 placeholder:text-gray-400 sm:text-sm dark:ring-border-dark dark:bg-transparent dark:text-white ${
						props.class ? props.class : ""
					} ${props.preIcon ? "pl-8" : ""}`}
					placeholder={props.placeholder || ""}
					{...(props.register &&
						props.register(props.name, {
							onChange: (e: any) => {
								if (props.onChange) {
									props.onChange(
										e.target.name,
										e.target.value,
									);
								}
								props.setValue &&
									props.setValue(props.name, e.target.value);

								props.trigger && props.trigger(props.name);
							},
						}))}
				/>
				{props.error && (
					<div className="absolute text-red-600 text-[14px]">
						{props.error}
					</div>
				)}
			</div>
		</div>
	);
};

export default Input;
