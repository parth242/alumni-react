import React, { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useAppState } from "utils/useAppState";
import { useMutation } from "react-query";
import { logout } from "api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "utils/icon";
import { classNames } from "utils";
import { HTTPError } from "ky";
import { StringStringType } from "utils/consts";

export default function HomeHeader() {
	const [{ showSidebar, pageName, isDark, company_data }, setAppState] =
		useAppState();
	const [{ user, customers, wabaActivationStatus, selectedCustomer }] =
		useAppState();
	
	

	const location = useLocation();
	const navigate = useNavigate();

	
	useEffect(() => {
		let pageName: string[] = location.pathname.replace("/admin/", "").split("/");
		setAppState({
			pageName: pageName[0],
		});
	}, [location.pathname]);

	const { mutate, isLoading: logoutLoading } = useMutation(logout, {
		onSuccess: async () => {
			setAppState({ user: undefined });
			localStorage.removeItem("user");
			navigate("/login");
		},
		onError: async () => {
			setTimeout(() => {
				navigate("/login");
			});
		},
	});
	const logoutFn = () => {
		mutate();
	};
	

	return (
		<>
      {/* Meta Tags and Links */}
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>Alumni</title>
      <meta name="description" content="" />
      <meta name="keywords" content="" />
      <link href="assets/img/favicon.png" rel="icon" />
      <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet"
      />
      <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
      <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
      <link href="assets/vendor/aos/aos.css" rel="stylesheet" />
      <link href="assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet" />
      <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />
      <link href="assets/css/main.css" rel="stylesheet" />

      {/* Header Section */}
      <header id="header" className="header sticky-top">
        <div className="topbar d-flex align-items-center">
          <div className="container d-flex justify-content-center justify-content-md-between">
            <div className="social-links d-none d-md-flex align-items-center">
              <p>Follow Us On: </p>
              <a href="#" className="twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="linkedin">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>

            <div className="contact-info d-flex align-items-center">
              <a href="#" className="btn btn-link">Contact Us</a>
              <Link
													to="/register"
													className="btn btn-link">
													Create an Account
												</Link>
              <Link
													to="/login"
													className="btn btn-link btn-log">
													Log In
												</Link>              
             
            </div>
          </div>
        </div>

        <div className="branding d-flex align-items-center">
          <div className="container position-relative d-flex align-items-center justify-content-between">
            <a href="/" className="logo d-flex align-items-center">
              <h1 className="sitename">Alumni <br /> Network</h1>
            </a>

            <nav id="navmenu" className="navmenu">
              <ul>
                <li><a href="#" className="active main-menu">Home</a></li>
                <li><a href="#" className="main-menu">Principal's Message</a></li>
                <li><a href="#" className="main-menu">About Alumni</a></li>
                <li>
                  <Link	to="/newsroom" className="main-menu"> Newsroom </Link>   
                </li>                
                <li>
                  <Link	to="/members" className="main-menu"> Members </Link>                  
                </li>
                <li className="dropdown">
                  <a href="#" className="main-menu">
                    <span>Alumni Assist</span> <i className="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul>
                    <li><a href="#">Be a Mentor</a></li>
                    <li><a href="#">Volunteer</a></li>
                    <li><a href="#">General Request</a></li>
                    <li><a href="#">Invite Friends</a></li>
                    <li><a href="#">Share Achievements</a></li>
                    <li><a href="#">Share Opportunities</a></li>
                  </ul>
                </li>
                <li>
                  <Link	to="/homeevents" className="main-menu"> Events </Link>   
                </li>
                <li>
                  <Link	to="/homegallery" className="main-menu"> Gallery </Link>
                </li>
              </ul>
              <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>
          </div>
        </div>
      </header>
    </>
	);
}
