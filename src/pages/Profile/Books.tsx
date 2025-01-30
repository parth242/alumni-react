import ProfileSidebar from "components/layout/profilesidebar";
import SiteNavbar from "components/layout/sitenavbar";
import { InputProfile } from "components/ui/common/InputProfile";
import Textarea from "components/ui/common/Textarea";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function Books() {
	const navigate = useNavigate();
	return (
		<>
			<SiteNavbar />
			<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
				<div className="md:w-56">
					{/* Sidebar */}
					<ProfileSidebar />
				</div>
				<div className="w-full px-10 min-h-screen">
					<h1 className=" text-3xl my-7 font-semibold">
						Books Authored
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
							Those that you authoured or co-authoured
						</p>
					</div>
					<div className="mt-10">
						<form className="flex flex-col gap-4 mt-10">
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Book Name *
									</label>
									<InputProfile
										placeholder="Enter book name"
										name={"bookName"}
										className="w-full text-sm h-11 border-gray-100"
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Publisher
									</label>
									<InputProfile
										placeholder="Enter Publisher Details"
										name={"publisher"}
										className="w-full text-sm h-11 border-gray-100"
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Date
									</label>
									<input
										type="date"
										className="p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Description
									</label>
									<Textarea
										placeholder="Enter description"
										name={"description"}
										rows={4}
									/>
								</div>
							</div>
							<div>
								<div className="flex space-x-4 mb-6">
									<Button
										style={{ backgroundColor: "#440178" }}
										outline
										type="submit">
										Save
									</Button>
									<Button.Group>
										<Button
											onClick={() =>
												navigate(
													"/profile/add-publications",
												)
											}
											outline
											style={{
												backgroundColor: "#440178",
											}}>
											Prev
										</Button>
										<Button
											onClick={() =>
												navigate("/profile/add-papers")
											}
											outline
											style={{
												backgroundColor: "#440178",
											}}>
											Next
										</Button>
									</Button.Group>
									<Button
										onClick={() =>
											navigate("/profile/achievement")
										}
										outline
										style={{ backgroundColor: "#440178" }}>
										Cancel
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default Books;
