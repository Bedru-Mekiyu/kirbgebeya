import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  FiGrid,
  FiUsers,
  FiGlobe,
  FiSettings,
  FiFileText,
  FiChevronDown,
  FiMoreHorizontal,
  FiUserCheck,
  FiCreditCard,
  FiLayers,
} from "react-icons/fi";
import { useSidebar } from "../context/SidebarContext";
import { FaBullseye, FaHandHoldingUsd, FaHandsHelping } from "react-icons/fa";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { name: "Dashboard", icon: <FiGrid className="w-5 h-5" />, path: "/" },
  {
    name: "User Management",
    icon: <FiUserCheck className="w-5 h-5" />,
    subItems: [
      { name: "All Users", path: "/users" },
      { name: "Roles & Permissions", path: "/roles", pro: false },
    ],
  },
  {
    name: "Donors",
    icon: <FiUsers className="w-5 h-5" />,
    subItems: [{ name: "All Donors", path: "/donors" }],
  },
  {
    name: "Donations",
    icon: <FaHandsHelping className="w-5 h-5" />,
    subItems: [{ name: "All Donations", path: "/donations" }],
  },
  {
    name: "Campaigns",
    icon: <FaBullseye className="w-5 h-5" />,
    subItems: [{ name: "All Campaigns", path: "/campaigns" }],
  },
  {
    name: "Payments",
    icon: <FiCreditCard className="w-5 h-5" />,
    subItems: [{ name: "All Payments", path: "/payments" }],
  },
  {
    name: "Goats Management",
    icon: <FiLayers className="w-5 h-5" />,
    subItems: [{ name: "Goats", path: "/goats" }],
  },
  // {
  //   name: "CMS",
  //   icon: <FiGlobe className="w-5 h-5" />,
  //   subItems: [
  //     { name: "Pages", path: "/cms/pages" },
  //     { name: "Homepage Editor", path: "/cms/pages/home", pro: false },
  //     { name: "Blog Posts", path: "/cms/blog" },
  //     { name: "Media Library", path: "/cms/media", pro: false },
  //     { name: "SEO & Metadata", path: "/cms/seo", pro: false },
  //   ],
  // },
  // {
  //   name: "Settings",
  //   icon: <FiSettings className="w-5 h-5" />,
  //   subItems: [
  //     { name: "General", path: "/settings/general" },
  //     { name: "Payment Gateways", path: "/settings/payments", pro: false },
  //     { name: "Email Templates", path: "/settings/email", pro: false },
  //     { name: "API & Webhooks", path: "/settings/api", pro: false },
  //   ],
  // },
];

const othersItems: NavItem[] = [
  {
    name: "Reports",
    icon: <FiFileText className="w-5 h-5" />,
    subItems: [
      { name: "Donation Reports", path: "/reports/donations" },
      { name: "Campaign Reports", path: "/reports/campaigns" },
      { name: "Donor Insights", path: "/reports/donors", pro: false },
      { name: "Financial Summary", path: "/reports/finance", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <FiChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex items-center gap-3 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500 rounded-xl flex items-center justify-center">
            <FaHandHoldingUsd className="w-6 h-6 text-white" />
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                Afar Aid
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                Emergency Support
              </span>
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <FiMoreHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <FiMoreHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen}
      </div>
    </aside>
  );
};

export default AppSidebar;
