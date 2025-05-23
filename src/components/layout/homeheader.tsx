import React, { Fragment, useEffect, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { useAppState } from "utils/useAppState";
import { useMutation } from "react-query";
import { logout } from "api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useHeadermenus, useHeaderSubmenus } from "api/services/submenuService";
import { currentInstitute } from "api/services/instituteService";
import { Menu, ISubmenu } from "utils/datatypes";

export default function HomeHeader() {
	const [{ showSidebar, pageName, isDark, company_data }, setAppState] =
		useAppState();
	const [{ user, customers, wabaActivationStatus, selectedCustomer }] =
		useAppState();
	
  const [menunew,setMenuNew] = useState([]);

	const location = useLocation();
	const navigate = useNavigate();

  let {
		isLoading,
		data: instituteDetails,
		refetch: fetchInstituteDetails,
		isFetching: isFetchingInstituteDetails,
		remove,
	} = currentInstitute() || [];

  useEffect(() => {
    fetchInstituteDetails();
		const fetchData = async () => {	 		
     
		  try {
			const userDataResponse = (await useHeadermenus() as ISubmenu);
			var submenuall = userDataResponse?.data;
		
		  } catch (error) {
			console.error(`Error fetching data for ID ${error}`);
		  }
		  //const submenulData = submenu?.data;
		  console.log('submenuallab',submenuall);
		const originalData = await Promise.all(submenuall.map(async (mn: any) => {
		
      const submenusmain = await useHeaderSubmenus(mn.id);

      if(submenusmain?.total_records>0){
        var hassubmenu = true;
      } else{
        var hassubmenu = false;
      }
			return { 
					id: mn.id, 
					path: mn.page_url,
					forRole: true,
					title: mn.moduleshortname,
					name: mn.module_alias,
					component: mn.moduleshortname,
					is_visible: true,
					is_locked: true,
					has_submenus: hassubmenu,
          submenu: submenusmain
				}
			;
		
		}));

		setMenuNew(originalData);
		
		 		 
		};
		
		fetchData();
	  }, []); // Empty dependency array means this effect runs once on mount

    const menu : Menu[] = menunew;
	  	 
	console.log('menuheader',menu);
	useEffect(() => {
		let pageName: string[] = location.pathname.split("/");   
		setAppState({
			pageName: pageName[1],
		});
    window.scrollTo(0, 0);
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
      <title>{instituteDetails?.data.institute_name}</title>
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
              <a href={instituteDetails?.data.twitter_url ? instituteDetails?.data.twitter_url : '#'} 
                className="twitter" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-twitter-x"></i>
              </a>

              <a href={instituteDetails?.data.facebook_url ? instituteDetails?.data.facebook_url : '#'} 
                className="facebook" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook"></i>
              </a>
              
              <a href={instituteDetails?.data.instagram_url ? instituteDetails?.data.instagram_url : '#'} 
                className="instagram" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram"></i>
              </a>

              <a href={instituteDetails?.data.linkedin_url ? instituteDetails?.data.linkedin_url : '#'} 
                className="linkedin" 
                target="_blank"
                rel="noopener noreferrer"
              >
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
              
                {instituteDetails?.data.institute_logo ? (
                  <>                   
              <img																											
														src={import.meta.env.VITE_TEBI_CLOUD_FRONT_PROFILE_S3_URL + instituteDetails?.data.institute_logo}
														alt=""
													/>                        
                  </>
              ) : (
                <>
                <h1 className="sitename">Alumni <br /> Network</h1>
                </>
                )
            }
             
                
            </a>

            <nav id="navmenu" className="navmenu">
              <ul>
              {menu.map(
						(item: Menu, index: number) =>
							(item?.has_submenus==false) ? (              
             
              
                <li>
                  <Link	key={index} to={`/${item.path}`} className={`${pageName == item.path ? "active main-menu" : "main-menu"} `}>
                    {item.title} 
                  </Link>   
                </li> 
                
                ) : (
                  
                  <li className="dropdown">
                  <Link	key={index} to="#" className={`${pageName == item.path ? "active main-menu" : "main-menu"}`}>
                    <span>{item.title} </span> <i className="bi bi-chevron-down toggle-dropdown"></i>
                  </Link>
                <ul>
                  {item?.submenu?.data.map(
                  (itemsub: any, i: number) => (
                    <li>
                      <Link	key={i} to={`/${itemsub.page_url}`}>
                        {itemsub.moduleshortname} 
                      </Link>   
                    </li> 
                  ))
                  }                    
                </ul>
                </li>
                 
                ),
               
                )}
              </ul>
              <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>
          </div>
        </div>
      </header>
    </>
	);
}
