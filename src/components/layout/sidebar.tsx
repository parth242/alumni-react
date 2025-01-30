import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Menu, WabaStatus,ISubmenu } from "utils/datatypes";
import Icon from "utils/icon";
import { useAppState } from "utils/useAppState";
import ReactDOMServer from "react-dom/server";

import { useSubmenus } from "api/services/submenuService";
import { RoleEnum, RouteValidation, tooltip, tooltipClass } from "utils/consts";

import { apiClient } from "api/client";

export default function Navbar() {

		
	const [{ showSidebar, pageName, isDark, company_data }, setAppState] =
		useAppState();
	const [{ user, customers, wabaActivationStatus, selectedCustomer,submenu }] =
		useAppState();
		
	const wrapperRef = useRef(null);
	const [checkStatus, setCheckStatus] = useState(false);

	const [hideSidebar, setHideSidebar] =useState<boolean | null>(true);
	
	const isAdmin = user?.role === RoleEnum.admin;

	const [searchText, setSearchText] = useState("");
	
	const [submenunew,setSubMenuNew] = useState([]);

	/*const getSubmenuData = async () => {
		const userDataResponse = (await useSubmenus());
		console.log('userDataResponse',userDataResponse.data);
		setSubMenuNew(userDataResponse?.data);
		setAppState({ submenu: userDataResponse });
		
	};
	useEffect(() => {
	getSubmenuData();
	
	}, []);
	const submenuall : ISubmenu[] = submenunew;
	console.log('submenuall',submenuall);*/
	/*const menu =  useState(
		
		submenus?.data.map((mn) => (
		{ id: 1, 
		  path: mn.page_url,
		  forRole: true,
		  title: mn.moduleshortname,
		  name: mn.module_alias,
		  component: mn.moduleshortname,
		  is_visible: true,
		  is_locked: true,
		  can_access: [RoleEnum.admin, RoleEnum.org_admin],
		  icon: mn.icon,
		  exclude_validation: [
				RouteValidation.check_integrations,
				RouteValidation.is_experimental,
				RouteValidation.check_waba,
			], }
		))
	);*/
	const [menunew,setMenuNew] = useState([]);
	
	useEffect(() => {
		const fetchData = async () => {
		 
		
		  try {
			
			const storedUserData = localStorage.getItem('user');

			const userDataResponse = (await useSubmenus() as ISubmenu);
			var submenuall = userDataResponse?.data;
		
			
			if (storedUserData) {
			const userData = JSON.parse(storedUserData);
			var roleId = userData.role_id;
			}

			const response = await apiClient
			  .get(
				  `api/v1/role/role_id=${roleId}`
			  );
			  const result = await response.json();
			  var rolepermid = (result as { data: any })?.data;
			  
			
		  } catch (error) {
			console.error(`Error fetching data for ID ${user?.role_id}: ${error}`);
		  }

		  const checkIfIncludes = (value: any) => {
			
			return rolepermid.includes(value);
			
		  };
		 
		  //const submenulData = submenu?.data;
		  //console.log('submenuallab',submenuall);
		const originalData = await Promise.all(submenuall.map((mn: any) => {
			if(checkIfIncludes(mn.id)==true){
				var isaccess = true;
			} else{
				var isaccess = false;
			}
			return { 
					id: mn.id, 
					path: mn.page_url,
					forRole: true,
					title: mn.moduleshortname,
					name: mn.module_alias,
					component: mn.moduleshortname,
					is_visible: isaccess,
					is_locked: true,					
					icon: mn.icon,
					
				}
			;
		}));

		setMenuNew(originalData);
		 		 
		};
		
		fetchData();
	  }, []); // Empty dependency array means this effect runs once on mount

	  const menu : Menu[] = menunew;
	  console.log('sidemenu',menu);
	  
	useEffect(() => {
		
		if(pageName=='institutes'){

			setHideSidebar(true);
			setAppState({ showSidebar: false });

		} else {

			if (window.innerWidth < 640) {
				setAppState({ showSidebar: false });
			} else {
				setAppState({ showSidebar: true });
			}
			setHideSidebar(false);
		}
		ReactTooltip.rebuild();
	}, [pageName]);

	


	/* useEffect(() => {
		if (window.innerWidth < 640) {
			setAppState({ showSidebar: false });
		} else {
			setAppState({ showSidebar: true });
		}
	}, []);

	const { data: adminCompany, refetch: fetchAdminCompany } =
		useAdminCompany({
			enabled: false,
			customer_id: selectedCustomer,
		}) || [];

	const { data: companyData, refetch: fetchCompanyData } =
		useCustomerCompany({
			enabled: false,
		}) || [];

	useEffect(() => {
		if (selectedCustomer) {
			if (!isAdmin) {
				fetchCompanyData();
			} else {
				fetchAdminCompany();
			}
		}
	}, [selectedCustomer]);

	useEffect(() => {
		if (adminCompany || companyData) {
			if (!isAdmin) {
				setCompanyExp(companyData);
			} else {
				setCompanyExp(adminCompany);
			}
		}
	}, [adminCompany, companyData]);
	useEffect(() => {
		ReactTooltip.rebuild();
		setCheckStatus(false);
		if (
			user &&
			user.role &&
			(wabaActivationStatus > -1 ||
				(user?.role == RoleEnum.billing_admin &&
					wabaActivationStatus == undefined))
		) {
			setCheckStatus(true);
		}
	}, [wabaActivationStatus, user, companyExp?.experimental_features]);
	const callMixPanel = (event: string) => {
		if (window.innerWidth < 640) {
			setAppState({ showSidebar: false });
		}
		trackMixPanel(event, {
			page: event,
		});
	}; */

	const RenderTooltipHtml = ({ title }: { title: string }) => (
		<React.Fragment>
			<div className="flex flex-row items-center gap-2" ref={wrapperRef}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="h-5 w-5 dark:text-darkPrimary">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
					/>
				</svg>
				<span
					className="text-sm font-medium text-gray-700 dark:text-darkPrimary"
					dangerouslySetInnerHTML={{
						__html: title,
					}}></span>
			</div>
		</React.Fragment>
	);
	
	console.log("hideSidebar",hideSidebar);				
	return (
		<div
			className={`xs:absolute fixed left-0 top-0 z-40 float-left h-screen flex-col items-center overflow-hidden transition-[width] duration-300 md:block lg:block xl:block ${showSidebar ? "w-[calc(220px)]" : "w-[calc(0px)] sm:w-[calc(75px)]"
				}`}>
			{hideSidebar === false && (
			<div className="mb-20 h-[calc(100vh-60px)] w-full overflow-y-auto overflow-x-hidden px-2">
				<div className={`${showSidebar ? "flex h-24 items-center" : ""}`}>
					<Link
						to="/admin/dashboard"
						className={`${showSidebar
							? "inset-y-0 w-[calc(235px)] place-content-center px-3"
							: "justify-between px-2"
							} flex h-24 items-center`}>
						<img
							className={`${showSidebar ? "w-8" : "w-6"} m-auto`}
							src={`${showSidebar ? "/assets/images/logo.png" : "/assets/images/logo.png"
								}`}
						/>
					</Link>
					<button
						className="m-auto mr-2 block rounded-md p-2 text-2xl hover:text-primary focus:outline-none sm:hidden"
						onClick={() => setAppState({ showSidebar: !showSidebar })}>
						<span className="sr-only">Open main menu1</span>
						<Icon icon="bars-3" className="block h-6 w-6" aria-hidden="true" />
					</button>
				</div>
				<div className="flex w-full flex-col items-center">
					{menu.map(
						(item: Menu, index: number) =>
							(item?.is_visible==true) && (
								<Link
									key={index}
									to={`/admin/${item.path}`}
									className={`mt-2 flex h-12 w-full flex-row items-center justify-between rounded px-2 
								${pageName == item.path ? "text-primary" : ""}
								 "hover:text-primary"
										`}>

									<div className="flex min-w-[calc(200px)] flex-row">
										<Icon
											icon={item.icon}
											className="h-6 w-6"
											aria-hidden="true"
										/>
										{showSidebar && (
											<span
												className="ml-2 text-sm font-medium leading-6"
												dangerouslySetInnerHTML={{
													__html: item.title,
												}}></span>
										)}
									</div>

									<div>
										<Icon icon={item.icon_exp || ""} className="-ml-2 h-6 w-6" />
									</div>
								</Link>
							),
					)}
				</div>
			</div>
			)}

			{showSidebar ? (
				<div className="absolute bottom-4 w-full text-center text-xs font-medium">
					<div className="mb-1 w-[220px] text-gray-300 dark:text-darkSecondary">
						Need help? Reach us at:
					</div>
					<div className="text-primary">
						<a href="mailto:support@bidea.com">support@bidea.com</a>
					</div>
				</div>
			) : (
				<div
					data-for="support"
					data-html={true}
					data-tip={`<div class="flex flex-row items-center gap-[2px]">
					<div className="mb-1 text-gray-300 w-[220px]">Need help? Reach us at:</div>
					<div className="text-primary">
						<a href="mailto:support@bidea.com">support@bidea.com</a>
					</div>
			</div>`}
					className="absolute bottom-4 flex w-full flex-row items-center justify-center text-center">
					<Icon icon="question-mark-circle" className="h-6 w-6 text-gray-200" />
					<ReactTooltip
						id="support"
						place="right"
						type={isDark ? "dark" : "light"}
						effect="float"
						html={true}
						className={`${tooltipClass}`}
					/>
				</div>
			)}
		</div>
	);
}
