import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFootermenus } from "api/services/submenuService";
import { currentInstitute } from "api/services/instituteService";
import { Menu, ISubmenu } from "utils/datatypes";


export default function HomeFooter() {
	const [menunew,setMenuNew] = useState([]);

	let {
		isLoading,
		data: instituteDetails,
		refetch: fetchInstituteDetails,
		isFetching: isFetchingInstituteDetails,
		remove,
	} = currentInstitute() || [];

	useEffect(() => {
		fetchInstituteDetails();
		// Initialize any external JavaScript libraries here
		const loadScripts = () => {
		  // Example of dynamically loading Bootstrap JS and other libraries
		  const bootstrapScript = document.createElement('script');
		  bootstrapScript.src = 'assets/vendor/bootstrap/js/bootstrap.bundle.min.js';
		  bootstrapScript.async = true;
		  document.body.appendChild(bootstrapScript);
	
		  const aosScript = document.createElement('script');
		  aosScript.src = 'assets/vendor/aos/aos.js';
		  aosScript.async = true;
		  document.body.appendChild(aosScript);
	
		  const glightboxScript = document.createElement('script');
		  glightboxScript.src = 'assets/vendor/glightbox/js/glightbox.min.js';
		  glightboxScript.async = true;
		  document.body.appendChild(glightboxScript);
	
		  const purecounterScript = document.createElement('script');
		  purecounterScript.src = 'assets/vendor/purecounter/purecounter_vanilla.js';
		  purecounterScript.async = true;
		  document.body.appendChild(purecounterScript);
	
		  const imagesLoadedScript = document.createElement('script');
		  imagesLoadedScript.src = 'assets/vendor/imagesloaded/imagesloaded.pkgd.min.js';
		  imagesLoadedScript.async = true;
		  document.body.appendChild(imagesLoadedScript);
	
		  const isotopeScript = document.createElement('script');
		  isotopeScript.src = 'assets/vendor/isotope-layout/isotope.pkgd.min.js';
		  isotopeScript.async = true;
		  document.body.appendChild(isotopeScript);
	
		  const swiperScript = document.createElement('script');
		  swiperScript.src = 'assets/vendor/swiper/swiper-bundle.min.js';
		  swiperScript.async = true;
		  document.body.appendChild(swiperScript);
	
		  const mainScript = document.createElement('script');
		  mainScript.src = 'assets/jshome/main.js';
		  mainScript.async = true;
		  document.body.appendChild(mainScript);
		};
	
		loadScripts(); // Load scripts when component is mounted
	  }, []);

	  
	  useEffect(() => {
		const fetchData = async () => {	 		
		  try {
			const userDataResponse = (await useFootermenus() as ISubmenu);
			var submenuall = userDataResponse?.data;
		
		  } catch (error) {
			console.error(`Error fetching data for ID ${error}`);
		  }

		
		  //const submenulData = submenu?.data;
		  console.log('submenuallab',submenuall);
		const originalData = await Promise.all(submenuall.map(async (mn: any) => {
	
			return { 
					id: mn.id, 
					path: mn.page_url,
					forRole: true,
					title: mn.moduleshortname,
					name: mn.module_alias,
					component: mn.moduleshortname,
					is_visible: true,
					is_locked: true,
					
				}
			;
		
		}));

		setMenuNew(originalData);
		
		 		 
		};
		
		fetchData();
	  }, []); // Empty dependency array means this effect runs once on mount

    const menu : Menu[] = menunew;
	
	return (
		
		<footer id="footer" className="footer light-background">
		<div className="container footer-top">
		  <div className="row gy-4">
			<div className="col-lg-4 col-md-6 footer-about">
			  <a href="/" className="logo d-flex align-items-center">
				<span className="sitename">Alumni <br /> Network</span>
			  </a>
			  <div className="footer-contact pt-3">
			  <div
					dangerouslySetInnerHTML={{ __html: instituteDetails?.data?.site_address ? instituteDetails?.data?.site_address : '' }}
					/>
				<p className="mt-3">
				  <strong>Phone:</strong> <span>{instituteDetails?.data?.contact_number ? instituteDetails?.data?.contact_number : ''}</span>
				</p>
				<p>
				  <strong>Email:</strong> <span>{instituteDetails?.data?.contact_email ? instituteDetails?.data?.contact_email : ''}</span>
				</p>
			  </div>
			  <div className="social-links d-flex mt-4">
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
			</div>
  
			<div className="col-lg-2 col-md-3 footer-links">
			  <h4>Useful Links</h4>
			  <ul>
			  {menu.map(
				(item: Menu, index: number) => ( 
					<li>
						<Link key={index} to={`/${item.path}`}>  {item.title} </Link>   
					</li> 
				),               
                )}
			  </ul>
			</div>
		  </div>
		</div>
  
		<div className="container copyright text-center mt-4">
		  <p>
			© <span id="year"></span> <span>Copyright</span>
			<strong className="px-1 sitename">{instituteDetails?.data.institute_name}.</strong>
			<span>All Rights Reserved.</span>
		  </p>
		</div>
  
		<a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
		  <i className="bi bi-arrow-up-short"></i>
		</a>
  
		
	  </footer>
	 
     
	);
}
