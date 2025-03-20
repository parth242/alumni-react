import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "utils/useAppState";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { CustomerType, IUser } from "utils/datatypes";
import HomeHeader from "components/layout/homeheader";
import HomeFooter from "components/layout/homefooter";
import { useNewss } from "api/services/newsService";
import { INews } from "utils/datatypes";
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

  const [activeStatus, setActiveStatus] = useState("");
	const [searchText, setSearchText] = useState("");	
	const [pageNumber, setPageNumber] = useState(pageStartFrom);
	const [pageSize, setPageSize] = useState({ value: 2 });

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
		page_size: pageSize.value,
		group_id: 0,
	}) || [];


  

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    fetchNewsList();
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
          <div className="carousel-item active">
            <img
              src="assets/img/hero-carousel/hero-carousel-1.jpg"
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
      newsList?.data?.slice(0, 2).map((item: INews, i: number) => (
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
                      <div className="single-event">
                        <div className="event-image">
                          <p className="date">
                            20<span>Feb</span>
                          </p>
                        </div>
                        <div className="content">
                          <h3>
                            <a href="#">
                              Scientific writing , Research integrity and
                              publication ethics workshop
                            </a>
                          </h3>
                          <p>
                            Excepteur sint occaecat cupidatat non proident, sunt
                            in culpa qui officia deserunt laborum.
                          </p>
                        </div>
                      </div>

					  <div className="single-event">
                        <div className="event-image">
                          <p className="date">
						  28<span>Feb</span>
                          </p>
                        </div>
                        <div className="content">
                          <h3>
                            <a href="#">
							KLE Ayurveda Signs MoU with London College of Ayurveda
                            </a>
                          </h3>
                          <p>
						  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                            deserunt
                                            laborum.
                          </p>
                        </div>
                      </div>

					  <div className="single-event">
                        <div className="event-image">
                          <p className="date">
						  28<span>Feb</span>
                          </p>
                        </div>
                        <div className="content">
                          <h3>
                            <a href="#">
							KLE Ayurveda Signs MoU with London College of Ayurveda
                            </a>
                          </h3>
                          <p>
						  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                            deserunt
                                            laborum.
                          </p>
                        </div>
                      </div>
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
              <div className="single-event">
                <div className="row align-items-center">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="date">
                      <h2>20</h2>
                      <p>Feb</p>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-6 col-12">
                    <div className="event-info">
                      <div className="info">
                        <h4>
                          <a href="javascript:void(0)">
                            Consultant physiotherapist full time at Physiqure
                            healthcare pvt limited
                          </a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

			  <div className="single-event">
                <div className="row align-items-center">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="date">
                      <h2>25</h2>
                      <p>Feb</p>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-6 col-12">
                    <div className="event-info">
                      <div className="info">
                        <h4>
                          <a href="javascript:void(0)">
						  Tutor / Lecturers at School of Allied Health
                                            Sciences (SAHS)
                          </a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

			  <div className="single-event">
                <div className="row align-items-center">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="date">
                      <h2>01</h2>
                      <p>Mar</p>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-6 col-12">
                    <div className="event-info">
                      <div className="info">
                        <h4>
                          <a href="javascript:void(0)">
						  Media est eligendi oatio cumrue
                          </a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
            <SwiperSlide>
              <div className="testimonial-item">
                <p>
                  Proin iaculis purus consequat sem cure digni ssim donec
                  porttitora entum suscipit rhoncus.
                </p>
                <div className="profile mt-auto">
                  <img
                    src="assets/img/testimonials/testimonials-1.jpg"
                    className="testimonial-img"
                    alt=""
                  />
                  <h3>Saul Goodman</h3>
                  <h4>Ceo &amp; Founder</h4>
                </div>
              </div>
            </SwiperSlide>

            {/* Testimonial Item 2 */}
            <SwiperSlide>
              <div className="testimonial-item">
                <p>
                  Export tempor illum tamen malis malis eram quae irure esse
                  labore quem cillum quid cillum eram malis quorum velit fore
                  eram velit sunt aliqua noster fugiat irure amet legam anim
                  culpa.
                </p>
                <div className="profile mt-auto">
                  <img
                    src="assets/img/testimonials/testimonials-2.jpg"
                    className="testimonial-img"
                    alt=""
                  />
                  <h3>Sara Wilsson</h3>
                  <h4>Designer</h4>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="testimonial-item">
                <p>
                  Export tempor illum tamen malis malis eram quae irure esse
                  labore quem cillum quid cillum eram malis quorum velit fore
                  eram velit sunt aliqua noster fugiat irure amet legam anim
                  culpa.
                </p>
                <div className="profile mt-auto">
                  <img
                    src="assets/img/testimonials/testimonials-3.jpg"
                    className="testimonial-img"
                    alt=""
                  />
                  <h3>Sara Wilsson</h3>
                  <h4>Designer</h4>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="testimonial-item">
                <p>
                  Export tempor illum tamen malis malis eram quae irure esse
                  labore quem cillum quid cillum eram malis quorum velit fore
                  eram velit sunt aliqua noster fugiat irure amet legam anim
                  culpa.
                </p>
                <div className="profile mt-auto">
                  <img
                    src="assets/img/testimonials/testimonials-4.jpg"
                    className="testimonial-img"
                    alt=""
                  />
                  <h3>Sara Wilsson</h3>
                  <h4>Designer</h4>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="testimonial-item">
                <p>
                  Export tempor illum tamen malis malis eram quae irure esse
                  labore quem cillum quid cillum eram malis quorum velit fore
                  eram velit sunt aliqua noster fugiat irure amet legam anim
                  culpa.
                </p>
                <div className="profile mt-auto">
                  <img
                    src="assets/img/testimonials/testimonials-5.jpg"
                    className="testimonial-img"
                    alt=""
                  />
                  <h3>Sara Wilsson</h3>
                  <h4>Designer</h4>
                </div>
              </div>
            </SwiperSlide>
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
            <div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href="assets/img/gallery/gallery-1.jpg"
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src="assets/img/gallery/gallery-1.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

			<div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href="assets/img/gallery/gallery-2.jpg"
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src="assets/img/gallery/gallery-2.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

			<div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href="assets/img/gallery/gallery-3.jpg"
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src="assets/img/gallery/gallery-3.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

			<div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href="assets/img/gallery/gallery-4.jpg"
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src="assets/img/gallery/gallery-4.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

			<div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href="assets/img/gallery/gallery-5.jpg"
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src="assets/img/gallery/gallery-5.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

			<div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href="assets/img/gallery/gallery-6.jpg"
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src="assets/img/gallery/gallery-6.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

			<div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href="assets/img/gallery/gallery-7.jpg"
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src="assets/img/gallery/gallery-7.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

			<div className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a
                  href="assets/img/gallery/gallery-8.jpg"
                  className="glightbox"
                  data-gallery="images-gallery"
                >
                  <img
                    src="assets/img/gallery/gallery-8.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

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
      <SwiperSlide>
              <div className="swiper-slide">
                <img
                  src="assets/img/testimonials/testimonials-1.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
            </SwiperSlide>

                       
            <SwiperSlide>
            <div className="swiper-slide">
                    <img
                      src="assets/img/testimonials/testimonials-2.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
              </SwiperSlide>
          <SwiperSlide>
			  <div className="swiper-slide">
                <img
                  src="assets/img/testimonials/testimonials-3.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              </SwiperSlide>
              <SwiperSlide>
			  <div className="swiper-slide">
                <img
                  src="assets/img/testimonials/testimonials-4.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              </SwiperSlide>
              <SwiperSlide>
			  <div className="swiper-slide">
                <img
                  src="assets/img/testimonials/testimonials-5.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              </SwiperSlide>
              <SwiperSlide>
			  <div className="swiper-slide">
                <img
                  src="assets/img/testimonials/testimonials-1.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              </SwiperSlide>
              <SwiperSlide>
			  <div className="swiper-slide">
                <img
                  src="assets/img/testimonials/testimonials-2.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              </SwiperSlide>
              <SwiperSlide>
			  <div className="swiper-slide">
                <img
                  src="assets/img/testimonials/testimonials-3.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              </SwiperSlide>
              <SwiperSlide>
			  <div className="swiper-slide">
                <img
                  src="assets/img/testimonials/testimonials-4.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              </SwiperSlide>
              <SwiperSlide>
			  <div className="swiper-slide">
                <img
                  src="assets/img/testimonials/testimonials-5.jpg"
                  className="img-fluid"
                  alt=""
                />
              </div>
              </SwiperSlide>
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
