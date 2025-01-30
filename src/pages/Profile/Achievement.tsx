import ProfileSidebar from "components/layout/profilesidebar";
import SiteNavbar from "components/layout/sitenavbar";
import { Button, Card } from "flowbite-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Achievement() {
	const navigate = useNavigate();
	return (
		<>
			<SiteNavbar />
			<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
				<div className="md:w-56">
					{/* Sidebar */}
					<ProfileSidebar />
				</div>
				<div className="px-10 min-h-screen">
					<h1 className=" text-3xl my-7 font-semibold">
						Achievements
					</h1>
					<div className="mb-4 md:mb-0 md:mr-4">
						<p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
							Please choose an achievement you wish to add to the
							profile.
						</p>
					</div>
					<div className="mt-2">
						<div className="flex space-x-4 mb-6">
							<Button.Group>
								<Button
									onClick={() => navigate("/profile/work")}
									outline
									style={{
										backgroundColor: "#440178",
									}}>
									Prev
								</Button>
								<Button
									onClick={() => navigate("/profile/resume")}
									outline
									style={{
										backgroundColor: "#440178",
									}}>
									Next
								</Button>
							</Button.Group>
						</div>
					</div>
					<div className="grid md:grid-cols-3 gap-4 mt-10">
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-achievements">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Academic Achievements
										</h5>
										<p>
											Class Topper, University Topper,
											etc.
										</p>
									</Card>
								</Link>
							</div>
						</div>
						{/* <div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-honours-awards">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Honours & Awards
										</h5>
										<p>
											Add the recognition you received Eg:
											Fields Medal
										</p>
									</Card>
								</Link>
							</div>
						</div> */}
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-sports">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Sports Achievements
										</h5>
										<p>
											Eg: National/State/University Level
											Player, Awards
										</p>
									</Card>
								</Link>
							</div>
						</div>
						{/*<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-publications">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Publications
										</h5>
										<p>
											Journals, Research Papers Published
											etc..
										</p>
									</Card>
								</Link>
							</div>
						</div>
						 <div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-books">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Books Authored
										</h5>
										<p>
											Those that you authoured or
											co-authoured.
										</p>
									</Card>
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-papers">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Papers Presented
										</h5>
										<p>
											Technical / Non-technical papers
											presented
										</p>
									</Card>
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-patents">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Patents
										</h5>
										<p>
											Any patents that you have received /
											applied
										</p>
									</Card>
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-test-scores">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Test Scores
										</h5>
										<p>GATE, CAT, GRE, GMAT, TOEFL etc.</p>
									</Card>
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-activities">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Activities
										</h5>
										<p>
											Participation in Student Societies /
											NSS / Alumni / Social
										</p>
									</Card>
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-extra-curricular-activities">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Extra-curricular Activities
										</h5>
										<p>
											Participation in Inter &
											Intra-College Competitions
										</p>
									</Card>
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-placement">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold  tracking-tight text-gray-900 dark:text-white">
											Placement
										</h5>
										<p>On-Campus / Off-Campus Placement</p>
									</Card>
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-4 sm:flex-row text-sm">
							<div className="w-full">
								<Link to="/profile/add-certifications">
									<Card className="max-w-sm">
										<h5 className="md:text-base font-semibold tracking-tight text-gray-900 dark:text-white">
											Certifications
										</h5>
										<p>
											Ex: Certified Yoga Instructor
											certificate
										</p>
									</Card>
								</Link>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</>
	);
}

export default Achievement;
