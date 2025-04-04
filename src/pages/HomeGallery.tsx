import React, { useState, useEffect } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	Typography,
} from "@material-tailwind/react";
import { Button } from "flowbite-react";
import HomeHeader from "components/layout/homeheader";
import HomeFooter from "components/layout/homefooter";
import { Spinner } from "flowbite-react"; // For Loader Spinner
import { useNavigate } from "react-router-dom";
import { pageStartFrom } from "utils/consts";
import { IGallery } from "utils/datatypes";
import ReactTooltip from "react-tooltip";
import LinkCommon from "components/ui/common/LinkCommon";
import { formatDateWithSuffix } from "components/ui/NewsItem";
import { useGallerys } from "api/services/galleryService";


function HomeGallery() {
	const navigate = useNavigate();
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedDateFilter, setSelectedDateFilter] = useState<string>("Upcoming");

	const [activeStatus, setActiveStatus] = useState("active");
	const [searchText, setSearchText] = useState("");

	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 10 });

	const [totalRecords, setTotalRecords] = useState(0);
	const [currentRecords, setCurrentRecords] = useState(0);

	const {
		isLoading,
		data: galleryList,
		refetch: fetchGalleryList,
		isFetching: isFetchingGalleryList,
	} = useGallerys({
		enabled: true,		
		page_number: pageNumber,
		page_size: 10
	}) || [];

	
	
	return (
		<>
			<div className="w-full mx-auto bg-gray-100">
				<HomeHeader />
			</div>
			<div className="w-full ">
				<div className="md:w-10/12 w-full mx-auto py-6 px-4 relative">
					<h1 className="md:text-3xl text-xl text-black font-bold mb-2 text-center mb-4">
						Gallery
					</h1>

					{/* Loader */}
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Spinner size="xl" />
						</div>
					) : (
						<>
							
							{/* Gallery Cards */}
							
          <div className="row g-0 pt-4">
            {/* Gallery Items */}
            {galleryList &&
                      galleryList?.data &&
                      galleryList?.data?.length ? (
                        galleryList?.data?.map((item: IGallery, i: number) => item?.gallery_image && (
                          
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href={import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
                    item?.gallery_image}
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src={import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
                      item?.gallery_image}
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>
            
              ))
                    ) : ("No Gallery Image")
                    }
            {/* Add more gallery items similarly */}
          </div>
        
							<div className="flex justify-center mt-10">
								{currentRecords < totalRecords && (
									<Button
										style={{ backgroundColor: "#440178" }}
										outline
										className="text-center"
										onClick={() =>
											setPageNumber(pageNumber + 1)
										}>
										{isLoading ? "Loading..." : "Load More"}
									</Button>
								)}
							</div>
						</>
					)}
				</div>
			</div>
			<HomeFooter />
		</>
	);
}

export default HomeGallery;
