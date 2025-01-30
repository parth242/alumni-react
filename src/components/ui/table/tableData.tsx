import { TableHeadType } from "utils/datatypes";
import { useAppState } from "utils/useAppState";

type RequestType = {
	data?: string | JSX.Element;
	style?: string;
};

const TableData: React.FC<RequestType> = ({ data, style }) => {
	const [{ pageName }] = useAppState();
	return (
		<td
			className={`${style ? style : ""
				} max-w-sm overflow-hidden text-ellipsis whitespace-nowrap px-4 py-4 text-sm font-normal text-gray-900 dark:text-darkPrimary`}>
			{data}
		</td>
	);
};

export default TableData;
