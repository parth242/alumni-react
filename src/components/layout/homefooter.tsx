import React, { useEffect, useState } from "react";

declare global {
	interface Window {
	  GLightbox: any; // Declare GLightbox globally
	}
  }


export default function HomeFooter() {
	useEffect(() => {
		// Initialize any external JavaScript libraries here
		
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
		  

		  glightboxScript.onload = () => {
			if (window.GLightbox) {
			  window.GLightbox({ selector: ".glightbox" }); // ✅ Initialize Glightbox after script loads
			}
		  };

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
		
		  return () => {
			document.body.removeChild(glightboxScript); // Cleanup on unmount
		  };
	  }, []);
	
	return (
		
		<footer id="footer" className="footer light-background">
		<div className="container footer-top">
		  <div className="row gy-4">
			<div className="col-lg-4 col-md-6 footer-about">
			  <a href="/" className="logo d-flex align-items-center">
				<span className="sitename">Alumni <br /> Network</span>
			  </a>
			  <div className="footer-contact pt-3">
				<p>#84, First Floor, 8th Main,</p>
				<p>Jayanagar III Block,</p>
				<p>Bengaluru – 560011, Karnataka, India</p>
				<p className="mt-3">
				  <strong>Phone:</strong> <span>+91 80 41510302</span>
				</p>
				<p>
				  <strong>Email:</strong> <span>info@spori.pro</span>
				</p>
			  </div>
			  <div className="social-links d-flex mt-4">
				<a href="#"><i className="bi bi-twitter-x"></i></a>
				<a href="#"><i className="bi bi-facebook"></i></a>
				<a href="#"><i className="bi bi-instagram"></i></a>
				<a href="#"><i className="bi bi-linkedin"></i></a>
			  </div>
			</div>
  
			<div className="col-lg-2 col-md-3 footer-links">
			  <h4>Useful Links</h4>
			  <ul>
				<li><a href="#">Home</a></li>
				<li><a href="#">Principal's Message</a></li>
				<li><a href="#">About Alumni</a></li>
				<li><a href="#">Newsroom</a></li>
				<li><a href="#">Members</a></li>
				<li><a href="#">Events</a></li>
				<li><a href="#">Gallery</a></li>
			  </ul>
			</div>
		  </div>
		</div>
  
		<div className="container copyright text-center mt-4">
		  <p>
			© <span id="year"></span> <span>Copyright</span>
			<strong className="px-1 sitename">Alumni Network.</strong>
			<span>All Rights Reserved.</span>
		  </p>
		</div>
  
		<a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
		  <i className="bi bi-arrow-up-short"></i>
		</a>
  
		
	  </footer>
	 
     
	);
}
