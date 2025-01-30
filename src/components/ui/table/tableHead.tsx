import { TableHeadType } from "utils/datatypes";
import { useAppState } from "utils/useAppState";

type RequestType = {
	data: TableHeadType;
};

const TableHead: React.FC<RequestType> = ({ data }) => {
	return (
		<thead className="overflow-hidden">
			<tr className="!font-semibold">
				{data?.map(item => (
					<th
						key={item.id}
						scope="col"
						className={`p-4`}>
						{item.name}
					</th>
				))}
			</tr>
		</thead>
	);
};

export default TableHead;
