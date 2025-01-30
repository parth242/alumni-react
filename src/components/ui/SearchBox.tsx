import { TextInput } from "flowbite-react";
import React from "react";
import { HiSearch } from "react-icons/hi";

interface SearchBoxProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
	searchQuery,
	setSearchQuery,
}) => {
	return (
		<TextInput
			value={searchQuery}
			onChange={e => setSearchQuery(e.target.value)}
			icon={HiSearch}
			placeholder="What are you looking for?"
			className="w-full focus:outline-none"
			shadow={true}
		/>
	);
};

export default SearchBox;
