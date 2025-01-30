import ProfileSidebar from "components/layout/profilesidebar";
import SiteNavbar from "components/layout/sitenavbar";
import { InputProfile } from "components/ui/common/InputProfile";
import Textarea from "components/ui/common/Textarea";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function Certifications() {
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
						Certifications
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
							Ex: Certified Yoga Instructor certificate
						</p>
					</div>
					<div className="mt-10">
						<form className="flex flex-col gap-4 mt-10">
							<div className="flex flex-col gap-4 sm:flex-row text-sm">
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Certification *
									</label>
									<InputProfile
										placeholder="Enter Certification Details"
										name={"certification"}
										className="w-full text-sm h-11 border-gray-100"
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Issued By
									</label>
									<InputProfile
										placeholder="Enter Issued By Details"
										name={"issuedBy"}
										className="w-full text-sm h-11 border-gray-100"
									/>
								</div>
								<div className="w-full">
									<label className="mb-3 inline-block ">
										Certificate Link
									</label>
									<InputProfile
										placeholder="Enter Certificate Link Details"
										name={"certificateLink"}
										className="w-full text-sm h-11 border-gray-100"
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
									<Button
										onClick={() =>
											navigate("/profile/add-placement")
										}
										outline
										style={{ backgroundColor: "#440178" }}>
										Prev
									</Button>
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

export default Certifications;
