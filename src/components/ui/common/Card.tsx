import React from "react";
import { Link } from "react-router-dom";

const CardUI = ({ item }: any) => {
	return (
		<Link to={"/profile/" + item.id}>
			<div className="max-w-sm rounded-2xl overflow-hidden shadow-[0_0_16px_5px_rgba(0,0,0,0.1)] hover:bg-neutral-100 flex flex-col hover:cursor-pointer hover:animate-jump ">
				<img
					src={
						item?.image
							? import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
							  item?.image
							: "/assets/images/icon-user.webp"
					}
					alt="userImage"
					className="w-full h-40 object-cover"
				/>
				<div className="px-6 pt-2 flex-grow">
					<div className="flex items-center justify-between">
						<div className="font-bold text-l mb-2 text-black">
							{item.first_name} {item.last_name}
						</div>
					</div>
					{/* <p className="text-gray-700 text-sm ">
						<>
							{item?.educationField && item?.educationField.length
								? item.educationField.map(
										(education: string, index: number) => {
											return (
												<span key={index}>
													{education}
													<br />{" "}
												</span>
											);
										},
								  )
								: ""}
						</>
					</p> */}
					<div className="pt-3 mb-3">
						{item?.educationField && (
							<p className="text-gray-700 text-sm ">
								{item?.educationField?.join(" | ")}
							</p>
						)}
						<p className="text-gray-700 text-sm ">
							{item?.professional_headline
								? item?.professional_headline
								: ""}{" "}
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default CardUI;
