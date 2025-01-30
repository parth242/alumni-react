import { useEffect } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { classNames } from "utils";
import Icon from "utils/icon";

type ToggleType = {
	checked: boolean;
	name: string;
	id: string;
	disable?: boolean;
	defaultChecked?: boolean;
	register?: UseFormRegister<FieldValues>;
	setChecked: (f1: boolean) => void;
	setIsToggleDirty?: (f1: boolean) => void;
	toggleType?: number;
	classes?: string;
};

const Toggle: React.FC<ToggleType> = ({
	checked,
	id,
	name,
	register,
	defaultChecked,
	setIsToggleDirty,
	setChecked,
	disable,
	toggleType,
	classes,
	...rest
}) => {
	return (
		<label htmlFor={id} className=" inline-flex cursor-pointer items-center">
			<div className="relative ml-1">
				<fieldset disabled={disable} className="disabled:cursor-not-allowed ">
					<input
						type="checkbox"
						checked={checked}
						onChange={() => {
							setChecked(!checked);
							if (setIsToggleDirty) {
								setIsToggleDirty(true);
							}
						}}
						disabled={disable}
						id={id}
						{...(register && register(name))}
						className="peer sr-only"
					/>
					<div
						className={classNames(
							"peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:text-white peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-0 peer-checked:peer-disabled:bg-gray-300 dark:bg-dark3 dark:after:border-darkPrimary dark:after:bg-darkPrimary dark:disabled:bg-darkPrimary",
							classes,
							toggleType == 2
								? "peer-focus:ring-yellow-400 dark:peer-checked:after:border-yellow-400 peer-checked:bg-yellow-400 dark:peer-checked:after:bg-yellow-400 dark:peer-checked:bg-yellow-400/20"
								: "peer-focus:ring-green-500 dark:peer-checked:after:border-green-500 peer-checked:bg-green-500 dark:peer-checked:after:bg-green-500 dark:peer-checked:bg-green-500/20",
						)}></div>
					<div className="absolute top-0 right-1 z-10 hidden h-4 w-4  text-gray-400 peer-checked:block dark:text-gray-600">
						<Icon icon="check" className="stroke-2" />
					</div>
					<div className="absolute top-0 left-1 z-10 block h-4 w-4 text-gray-400 peer-checked:hidden">
						<Icon icon="x-mark" className="stroke-2" />
					</div>
				</fieldset>
			</div>
		</label>
	);
};

export default Toggle;
