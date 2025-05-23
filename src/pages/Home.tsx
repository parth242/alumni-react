import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import HomeHeader from "components/layout/homeheader";
import HomeFooter from "components/layout/homefooter";
import { useNewss } from "api/services/newsService";
import { useEvents } from "api/services/eventService";
import { useJobs } from "api/services/jobService";
import { useUserHomeData } from "api/services/user";
import { useSlideshows } from "api/services/slideshowService";
import { useGallerys } from "api/services/galleryService";
import { useTestimonials } from "api/services/testimonialService";
import { INews, IEvent, IJob, CustomerType, IUser, ISlideshow, IGallery, ITestimonial } from "utils/datatypes";
import { endDateWithSuffix } from "../components/ui/NewsItem";
import { pageStartFrom } from "utils/consts";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // ✅ Correct import

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import AOS from "aos";
import "aos/dist/aos.css";



function Home() {
	const navigate = useNavigate();
	const [{ user, selectedCustomer }, setAppState] = useAppState();
	const [userData, setUserData] = useState<IUser | null>();
	const [customersList, setCustomersList] = useState<CustomerType[] | null>();

  const [activeStatus, setActiveStatus] = useState("active");
	const [searchText, setSearchText] = useState("");	
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	

  const {
		isLoading,
		data: newsList,
		refetch: fetchNewsList,
		isFetching: isFetchingNewsList,
	} = useNewss({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		page_number: pageNumber,
		page_size: 2,
		group_id: 0,
	}) || [];

  const {		
		data: eventList,
		refetch: fetchEventList,
		isFetching: isFetchingEventList,
	} = useEvents({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		filter_category: [],
		filter_date: "Upcoming",
		page_number: pageNumber,
		page_size: 3,
		group_id: 0,
		user_id: 0
	}) || [];

  
  const {		
		data: jobList,
		refetch: fetchJobList,
		isFetching: isFetchingJobList,
	} = useJobs({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,
		user_id: 0,
		page_number: pageNumber,
		page_size: 3,
		is_internship: 0,
	}) || [];

  const {
		data: userList,
		refetch: fetchUserList,
		isFetching: isFetchingUserList,
	} = useUserHomeData({
		enabled: true,		
		page_number: pageNumber,
		page_size: 10,		
	}) || [];

  const {
		data: slideshowList,
		refetch: fetchSlideshowList,
		isFetching: isFetchingSlideshowList,
	} = useSlideshows({
		enabled: true,
		filter_status: activeStatus,
		filter_name: searchText,		
		page_number: pageNumber,
		page_size: 3		
	}) || [];

  const {
		data: galleryList,
		refetch: fetchGalleryList,
		isFetching: isFetchingGalleryList,
	} = useGallerys({
		enabled: true,		
		page_number: pageNumber,
		page_size: 9
	}) || [];

  const {	
		data: testimonialList,
		refetch: fetchTestimonialList,
		isFetching: isFetchingTestimonialList,
	} = useTestimonials({
		enabled: true,
		filter_status: activeStatus,		
		page_number: pageNumber,
		page_size: 10,
	}) || [];

  useEffect(() => {
    
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
    
  }, []);

	return (
		<div>
			<HomeHeader></HomeHeader>
			{/* Hero Section */}
			<section id="hero" className="hero section dark-background">
        <div
          id="hero-carousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="5000"
        >
          {slideshowList &&
                      slideshowList?.data &&
                      slideshowList?.data?.length ? (
                        slideshowList?.data?.map((item: ISlideshow, i: number) => (
          <div className="carousel-item active">
            <img
              src={
                item?.slide_image
                  ? import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
                    item?.slide_image
                  : "/assets/img/hero-carousel/hero-carousel-1.jpg"
              }             
              alt="hero-carousel"
            />
            <div className="carousel-container">
              <h2 className="text-center">
                {item.slide_title}
              </h2>
              <p className="col-sm-12 col-md-3 mx-auto text-center">
              {item.slide_description}
              </p>
              
            </div>
          </div>
          ))
          ) : (
            <>
          <div className="carousel-item">
            <img
              src="assets/img/hero-carousel/hero-carousel-2.jpg"
              alt="hero-carousel"
            />
            <div className="carousel-container">
              <h2 className="text-center">
                Welcome to <br /> Alumni Network
              </h2>
              <p className="col-sm-12 col-md-3 mx-auto text-center">
                Reconnect with your classmates, relive the moments that shaped
                your journey, and explore new avenues for collaboration and
                personal development.
              </p>
              <div className="button">
                <a href="#featured-services" className="btn-get-started btn">
                  Register Now
                </a>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="assets/img/hero-carousel/hero-carousel-3.jpg"
              alt="hero-carousel"
            />
            <div className="carousel-container">
              <h2 className="text-center">
                Welcome to <br /> Alumni Network
              </h2>
              <p className="col-sm-12 col-md-3 mx-auto text-center">
                Reconnect with your classmates, relive the moments that shaped
                your journey, and explore new avenues for collaboration and
                personal development.
              </p>
              <div className="button">
                <a href="#featured-services" className="btn-get-started btn">
                  Register Now
                </a>
              </div>
            </div>
          </div>
          </>
          )
          }
          <a
            className="carousel-control-prev"
            href="#hero-carousel"
            role="button"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon bi bi-chevron-left"
              aria-hidden="true"
            ></span>
          </a>

          <a
            className="carousel-control-next"
            href="#hero-carousel"
            role="button"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon bi bi-chevron-right"
              aria-hidden="true"
            ></span>
          </a>

          <ol className="carousel-indicators"></ol>
        </div>
      </section>

      {/* News and Events Section */}
      <section className="news-events section">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-8">
              <div className="row">
                <div className="col-12">
                  <div className="section-title">
                    <div className="section-icon">
                      <i className="bi bi-quote"></i>
                    </div>
                    <h2>Newsroom</h2>
                  </div>
                </div>
              </div>

              <div className="latest-news-area">
                <div className="container" data-aos="fade-up">
                <div className="row">
  {/* Single News Item */}
  {newsList &&
    newsList?.data &&
    newsList?.data?.length ? (
      newsList?.data?.map((item: INews, i: number) => (
        <div
          key={item.id}
          className="col-lg-6 col-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="single-news custom-shadow-hover">
            <div className="image">
              <a href="#">
                <img
                  className="thumb"
                  src="assets/img/news/blog-grid1.jpg"
                  alt="#"
                />
              </a>
            </div>
            <div className="content-body">
              <div className="meta-data">
                <ul>
                  <li>
                    <i className="bi bi-calendar2-week"></i>
                    <a href="javascript:void(0)">
                      {endDateWithSuffix(item.posted_date)}
                    </a>
                  </li>
                </ul>
              </div>
              <h4 className="title">
                <a href="#">{item.title}</a>
              </h4>
              <p>{item.description}</p>
              <div className="button">
                <Link to={`/newsroom/${item.id}`} className="btn">
                  Read More <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))
    ) : null
    }
</div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-4">
              <div className="section-title">
                <div className="section-icon">
                  <i className="bi bi-bookmark"></i>
                </div>
                <h2>Upcoming Events</h2>
              </div>
              <div className="events up-events">
                <div className="container" data-aos="fade-up">
                  <div className="row">
                    {/* Single Event */}
                    <div
                      className="col-lg-12"
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                    {eventList &&
                      eventList?.data &&
                      eventList?.data?.length ? (
                        eventList?.data?.map((item: IEvent, i: number) => (
                      <div key={item.id} className="single-event">
                        <div className="event-image">
                          <p className="date">
                          {new Date(item.event_date).getDate()}
                            <span>{new Date(item.event_date).toLocaleString("default", { month: "short" })}</span>
                          </p>
                        </div>
                        <div className="content">
                          <h3>
                            <a href="#">
                              {item.event_title}
                            </a>
                          </h3>
                          <p>
                            {item.description}
                          </p>
                        </div>
                      </div>

                    ))
                    ) : ("No Upcoming Events")
                    }

					      </div>					

                    {/* Add more events similarly */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats section light-background overlay">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
              <div className="stats-item">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="232"
                  data-purecounter-duration="1"
                  className="purecounter"
                ></span>
                <p>Happy Clients</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
              <div className="stats-item">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="521"
                  data-purecounter-duration="1"
                  className="purecounter"
                ></span>
                <p>Projects</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
              <div className="stats-item">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="1463"
                  data-purecounter-duration="1"
                  className="purecounter"
                ></span>
                <p>Hours Of Support</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
              <div className="stats-item">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="15"
                  data-purecounter-duration="1"
                  className="purecounter"
                ></span>
                <p>Hard Workers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Schedule Section */}
      <section className="events-schedule">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <div className="section-icon">
                  <i className="bi bi-briefcase"></i>
                </div>
                <h2>Jobs</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Jobs Listing */}
            <div className="col-sm-12 col-md-7">
              <div>
                <img
                  src="assets/img/hp/about-img2.png"
                  alt="jobs-banner"
                  className="img-fluid"
                />
              </div>
            </div>

            <div className="col-sm-12 col-md-5">
              {/* Job Item */}
              {jobList &&
                      jobList?.data &&
                      jobList?.data?.length ? (
                        jobList?.data?.map((item: IJob, i: number) => (
              <div key={item.id} className="single-event">
                <div className="row align-items-center">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="date">
                    {item?.deadline_date && item.deadline_date !== "0000-00-00" ? (
                    <>
                      <h2>{new Date(item.deadline_date).getDate()}</h2>
                      <p>{new Date(item.deadline_date).toLocaleString("default", { month: "short" })}</p>
                      </>
                    ) : (
                      <p>No Date</p>
                    )}
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-6 col-12">
                    <div className="event-info">
                      <div className="info">
                        <h4>
                          <a href="javascript:void(0)">
                           {item.job_title}
                          </a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                ))
                ) : ("No Jobs")
                }

			 
              {/* More job items can be added here */}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials section">
        <div className="container section-title" data-aos="fade-up">
          <div className="section-icon">
            <i className="bi bi-hourglass-split"></i>
          </div>
          <h2>Alumni Success Stories</h2>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
        <Swiper
        className={"AlumniSwiper"}
      modules={[Autoplay, Pagination, Navigation]} // ✅ Use modules this way
      loop={true}
      speed={600}
      autoplay={{ delay: 5000 }}
      slidesPerView={"auto"}
      pagination={{ clickable: true }}
      breakpoints={{
        320: { slidesPerView: 1, spaceBetween: 40 },
        1200: { slidesPerView: 3, spaceBetween: 1 },
      }}
    >
            {/* Testimonial Item 1 */}
            {testimonialList &&
                      testimonialList?.data &&
                      testimonialList?.data?.length ? (
                        testimonialList?.data?.map((item: ITestimonial, i: number) => (
            <SwiperSlide>
              <div className="testimonial-item">
                <p>
                  {item.story_description}
                </p>
                <div className="profile mt-auto">
                  <img
                    src={
                      item.user?.image
                        ? import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
                          item.user?.image
                        : "/assets/images/profile.png"
                    }
                    className="testimonial-img"
                    alt=""
                  />
                  <h3>{item.user?.first_name+' '+item.user?.last_name}</h3>
                  <h4>{item.user?.professional_headline}</h4>
                </div>
              </div>
            </SwiperSlide>
            ))
            ) : ("No any Success Story")
            }
           
            {/* Add other SwiperSlides here */}
            {/* Testimonial Item 3, 4, 5 */}
          </Swiper>

          <div className="swiper-pagination"></div>
        </div>
      </section>


      {/* Gallery Section */}
      <section id="gallery" className="gallery section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Gallery</h2>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
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
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients" className="clients section">
        <div className="container section-title" data-aos="fade-up">
          <div className="section-icon">
            <i className="bi bi-person-bounding-box"></i>
          </div>
          <h2>Latest Members</h2>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
        <Swiper
        className={"MemberSwiper"}
      modules={[Autoplay, Pagination, Navigation]} // ✅ Use modules this way
      loop={true}
      speed={600}
      autoplay={{ delay: 5000 }}
      slidesPerView={"auto"}
      pagination={{ clickable: true }}
      breakpoints={{
        320: { slidesPerView: 2, spaceBetween: 40 },
        480: { slidesPerView: 3, spaceBetween: 60 },
        640: { slidesPerView: 4, spaceBetween: 80 },
        992: { slidesPerView: 6, spaceBetween: 10 },
      }}
    >
      <div className="swiper-wrapper align-items-center pt-4">
      {userList &&
                      userList?.data &&
                      userList?.data?.length ? (
                        userList?.data?.map((item: IUser, i: number) => (
      <SwiperSlide>
              <div className="swiper-slide">
                <img
                  src={
                    item?.image
                      ? import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL +
                        item?.image
                      : "/assets/images/profile.png"
                  }
                  alt=""
                  title={item?.first_name+" "+item?.last_name}
                />
              </div>
            </SwiperSlide>
           ))
           ) : ("No Members")
           }
                       
            
              </div>
              {/* Add more client items */}
              </Swiper>

<div className="swiper-pagination"></div>
</div>
</section>
     
	  <HomeFooter></HomeFooter>
		</div>
	);
}

export default Home;
