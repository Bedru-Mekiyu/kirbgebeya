import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { sidebarStructure } from "./sidebarStructure";

const Sidebar = ({ setExpand }) => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || [];
  });

  const [openedMenu, setOpenedMenu] = useState({});
  const [activeName, setActiveName] = useState("");
  const activeLink = window.location.pathname;

  const listRef = useRef({});

  const [isExpand, setIsExpand] = useState(true);
  const [isExpandOnHover, setIsExpandOnHover] = useState(false);

  const handleHoverExpand = (value) => {
    if (!isExpand) {
      setIsExpandOnHover(value);
    }
  };

  const handleNavigate = (path) => {
    setActiveName(path);
  };

  const handleToggle = (name) => {
    const rootEl = name.split(".")[0];

    if (openedMenu[name]?.open === true) {
      setOpenedMenu((prevState) => ({
        ...prevState,
        [name]: {
          open: false,
          height: "0px",
        },
        [rootEl]: {
          open: rootEl === name ? false : true,
          height: `${
            (listRef.current[rootEl]?.scrollHeight || 0) -
            (listRef.current[name]?.scrollHeight || 0)
          }px`,
        },
      }));
    } else {
      setOpenedMenu((prevState) => ({
        ...prevState,
        [name]: {
          open: true,
          height: `${listRef.current[name]?.scrollHeight || 0}px`,
        },
        [rootEl]: {
          open: true,
          height: `${
            (listRef.current[rootEl]?.scrollHeight || 0) +
            (listRef.current[name]?.scrollHeight || 0)
          }px`,
        },
      }));
    }
  };
  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("user", JSON.stringify(userInfo));
    }
    fetchUsers();
  }, [userInfo]);

  const username = userInfo.user.full_name;
  const email = userInfo.user.email;
  const profilePic =
    "https://img.mbiz.web.id/180x180/erp/R2p1IXoyVEpBMk01WOEAdaI3hHVlkuIg0wW5_pn-CJCKHSrA_n1-U1tfE7Bl5H4_4Z7AxgL0DPOmUCdPuCHHC5lWvMU5Ig3t1uDrkVN53MlWlnA";
  const link = "/home";

  const generateIcon = (icon) => {
    var icons_map = {};

    icons_map["dashboard"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 24 24"
        version="1.1"
      >
        <g
          id="ic_kanban"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <path
            d="M20,3 C21.1045695,3 22,3.8954305 22,5 L22,15 C22,16.1045695 21.1045695,17 20,17 L4,17 C2.8954305,17 2,16.1045695 2,15 L2,5 C2,3.8954305 2.8954305,3 4,3 L20,3 Z M11.5,6 L6.5,6 C5.67157288,6 5,6.67157288 5,7.5 L5,7.5 L5,9.5 C5,10.3284271 5.67157288,11 6.5,11 L6.5,11 L11.5,11 C12.3284271,11 13,10.3284271 13,9.5 L13,9.5 L13,7.5 C13,6.67157288 12.3284271,6 11.5,6 L11.5,6 Z"
            id="Combined-Shape"
            fill="currentColor"
          />
          <path
            d="M8,21 L16,21 M12,17 L12,21"
            id="Combined-Shape"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
    icons_map["users"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 24 24"
        version="1.1"
      >
        <g
          id="users-icon"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <circle cx="12" cy="7" r="4" fill="currentColor" />
          <path
            fill="currentColor"
            d="M8,17.5 C6.9,17.5 6,16.6 6,15.5 C6,14.4 6.9,13.5 8,13.5 C9.1,13.5 10,14.4 10,15.5 C10,16.6 9.1,17.5 8,17.5 Z"
          />
          <path
            fill="currentColor"
            d="M16,17.5 C14.9,17.5 14,16.6 14,15.5 C14,14.4 14.9,13.5 16,13.5 C17.1,13.5 18,14.4 18,15.5 C18,16.6 17.1,17.5 16,17.5 Z"
          />
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12,12.5 C14.5,12.5 18,14 18,15.5 L18,18.5 C18,19.3 17.3,20 16.5,20 L7.5,20 C6.7,20 6,19.3 6,18.5 L6,15.5 C6,14 9.5,12.5 12,12.5 Z"
          />
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12,12.5 C9.5,12.5 6,14 6,15.5 L6,18.5 C6,19.3 6.7,20 7.5,20 L16.5,20 C17.3,20 18,19.3 18,18.5 L18,15.5 C18,14 14.5,12.5 12,12.5 Z"
            opacity="0.5"
          />
        </g>
      </svg>
    );
    icons_map["roles"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 24 24"
        version="1.1"
      >
        <g
          id="role-icon"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <path
            fill="currentColor"
            d="M12 2C10.34 2 9 3.34 9 5c0 1.39 1.45 2.78 3 4.74 1.55-1.96 3-3.35 3-4.74 0-1.66-1.34-3-3-3zM4 10c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2H4zm2 2h12v6H6v-6z"
          />
          <path
            fill="currentColor"
            d="M12 15c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4zm1-1h-2v-1h2v1zm-2-2h2v1h-2v-1z"
          />
        </g>
      </svg>
    );
    icons_map["building"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 24 24"
        version="1.1"
      >
        <g
          id="building-icon"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <rect
            x="5"
            y="8"
            width="14"
            height="12"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="9" y="4" width="6" height="4" fill="currentColor" />
          <rect x="7" y="6" width="10" height="2" fill="currentColor" />
          <rect x="8" y="16" width="2" height="4" fill="currentColor" />
          <rect x="14" y="16" width="2" height="4" fill="currentColor" />
          <rect x="10" y="12" width="4" height="8" fill="currentColor" />
        </g>
      </svg>
    );
    icons_map["tenants"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 24 24"
        version="1.1"
      >
        <g
          id="tenants-icon"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <circle cx="12" cy="6" r="4" fill="currentColor" />
          <circle cx="6" cy="12" r="4" fill="currentColor" />
          <circle cx="18" cy="12" r="4" fill="currentColor" />
          <circle cx="12" cy="18" r="4" fill="currentColor" />
        </g>
      </svg>
    );
    icons_map["leases"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 24 24"
        version="1.1"
      >
        <g
          id="leases-icon"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <path
            d="M6,10 C7.1045695,10 8,10.8954305 8,12 C8,13.1045695 7.1045695,14 6,14 C4.8954305,14 4,13.1045695 4,12 C4,10.8954305 4.8954305,10 6,10 Z M18,10 C19.1045695,10 20,10.8954305 20,12 C20,13.1045695 19.1045695,14 18,14 C16.8954305,14 16,13.1045695 16,12 C16,10.8954305 16.8954305,10 18,10 Z M12,3.5 C12.5522847,3.5 13,3.94771525 13,4.5 L13,5 L15.5,5 C16.3284271,5 17,5.67157288 17,6.5 L17,10 C17,10.8284271 16.3284271,11.5 15.5,11.5 L12.5,11.5 C11.6715729,11.5 11,10.8284271 11,10 L11,6.5 C11,5.67157288 11.6715729,5 12.5,5 L15,5 L15,4.5 C15,3.94771525 15.4477153,3.5 16,3.5 L12,3.5 Z M3,14.5 L9.5,14.5 C9.22385763,15.1266071 9.02672867,15.8199439 9.01,16.52 L5,16.5 L5,18 L9.5,18 C9.77614237,18.6266071 9.97327133,19.3199439 9.99,20 L3,20 L3,14.5 Z M21,14.5 L14.5,14.5 C14.7761424,15.1266071 14.9732713,15.8199439 14.99,16.52 L19,16.5 L19,18 L14.5,18 C14.2238576,18.6266071 14.0267287,19.3199439 14.01,20 L21,20 L21,14.5 Z"
            fill="currentColor"
          />
        </g>
      </svg>
    );
    icons_map["maintenance"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 24 24"
        version="1.1"
      >
        <g
          id="maintenance-icon"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <path
            d="M12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 Z M12,20 C7.581722 20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 C16.418278,4 20,7.581722 20,12 C20,13.6568542 18.6568542,15 17,15 L17,17 L15,17 L15,15 L13,15 L13,17 L11,17 L11,15 L9,15 L9,17 L7,17 L7,15 L5,15 L5,13 L7,13 L7,11 L5,11 L5,9 L7,9 L7,7 L9,7 L9,9 L11,9 L11,7 L13,7 L13,9 L15,9 L15,11 L17,11 L17,13 L15,13 L15,15 L17,15 C18.6568542,15 20,13.6568542 20,12 C20,16.418278 16.418278,20 12,20 Z M13,8 L11,8 L11,10 L13,10 L13,8 Z M13,12 L11,12 L11,14 L13,14 L13,12 Z"
            fill="currentColor"
          />
        </g>
      </svg>
    );
    icons_map["reports"] = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-current"
        viewBox="0 0 24 24"
        version="1.1"
      >
        <g
          id="report-icon"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <path
            d="M6,2 C5.44771525,2 5,2.44771525 5,3 L5,21 C5,21.5522847 5.44771525,22 6,22 L18,22 C18.5522847,22 19,21.5522847 19,21 L19,7 L13,1 L6,1 C5.44771525,1 5,1.44771525 5,2 Z"
            fill="currentColor"
          />
          <rect x="8" y="6" width="8" height="1" fill="white" />
          <rect x="8" y="9" width="8" height="1" fill="white" />
          <rect x="8" y="12" width="8" height="1" fill="white" />
          <rect x="8" y="15" width="5" height="1" fill="white" />
          <rect x="8" y="18" width="4" height="1" fill="white" />
          <rect x="10" y="12" width="1.5" height="6" fill="white" />
          <rect x="13" y="15" width="1.5" height="3" fill="white" />
        </g>
      </svg>
    );
    return icons_map[icon];
  };

  const generateMenu = (item, index, recursive = 0) => {
    if (activeName === "" && activeLink.includes(item.link)) {
      setActiveName(item.name);
    }
    const classesActive = activeName === item.name ? "active" : "";

    return (
      <li key={index}>
        <a
          href={item.link}
          role="button"
          tabIndex={0}
          id={item.id}
          onClick={() => {
            if ("child" in item) {
              handleToggle(item.name);
            } else if ("link" in item) {
              handleNavigate(item.name);
            }
          }}
          onKeyDown={(event) => {
            const { code } = event;
            if (code === "Space") {
              if ("child" in item) {
                handleToggle(item.name);
              } else if ("link" in item) {
                handleNavigate(item.name);
              }
            }
          }}
          className={[
            "group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none",
            recursive === 0 ? "pl-4" : recursive === 1 ? "pl-11" : "pl-16",
            activeName === item.name || activeName.split(".")[0] === item.name
              ? `text-white font-semibold ${
                  item.parent ? "bg-blue-200/20 " : "bg-transparent"
                }`
              : `text-white ${item.parent && ""}`,
            "hover:bg-slate-300/20",
            classesActive,
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            {item.icon ? (
              item.icon === "dot" ? (
                <div className="h-3 w-3 flex items-center justify-center">
                  <div
                    className={[
                      `${classesActive ? "h-2 w-2" : "h-1 w-1"}`,
                      "bg-current rounded-full duration-200",
                    ].join(" ")}
                  ></div>
                </div>
              ) : (
                generateIcon(item.icon)
              )
            ) : null}
            <div
              className={`truncate ${
                isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"
              }`}
            >
              {t(`sidebar.${item.title}`)}
            </div>
          </div>
          {"child" in item ? (
            <div
              className={`${
                isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            false
          )}
        </a>

        {"child" in item ? (
          <ul
            ref={(el) => (listRef.current[item.name] = el)}
            className={[
              "overflow-hidden duration-300 ease-in-out",
              isExpand ? "" : isExpandOnHover ? "" : "h-0",
            ].join(" ")}
            style={{ maxHeight: `${openedMenu[item.name]?.height || "0px"}` }}
            key={item.name}
          >
            {item.child.map((value, idx) =>
              generateMenu(value, idx, recursive + 1)
            )}
          </ul>
        ) : (
          false
        )}
      </li>
    );
  };

  return (
    <nav
      role="navigation"
      className={[
        " shadow-sm absolute inset-y-0 left-0",
        "duration-300 ease-in-out md:fixed md:translate-x-0",
        `${
          isExpand
            ? "bg-slate-50 w-72"
            : isExpandOnHover
            ? "bg-slate-50/70 w-72 backdrop-blur-md z-50"
            : "bg-slate-50 w-20"
        }`,
      ].join(" ")}
      style={{
        background: "linear-gradient(to right, #4880EC, #019CAD)",
      }}
    >
      <button
        className="absolute z-50 top-16 -right-3 bg-white hover:bg-slate-100 text-slate-500 p-0.5 rounded-full border border-slate-200"
        onClick={() => {
          setIsExpand(!isExpand);
          setExpand(!isExpand);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            isExpand ? "rotate-0" : "rotate-180"
          } transform duration-500 h-4 w-4`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        onMouseEnter={() => handleHoverExpand(true)}
        onMouseLeave={() => handleHoverExpand(false)}
        className={`relative h-screen overflow-hidden`}
      >
        <SimpleBar style={{ height: "100%" }} autoHide timeout={100}>
          <div className="text-slate-500">
            <div className="my-4 flex flex-col items-center h-44 overflow-x-hidden">
              <a
                href={link}
                className={`text-center flex flex-col items-center justify-center`}
              >
                <div
                  className={`rounded-full border-4 border-white overflow-hidden duration-300 ${
                    isExpand
                      ? "h-20 w-20"
                      : isExpandOnHover
                      ? "h-20 w-20"
                      : "h-12 w-12"
                  }`}
                >
                  <img src={profilePic} className="block" alt="" />
                </div>
                <div
                  className={`text-base font-semibold text-white mt-3 truncate duration-300 ${
                    isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"
                  }`}
                >
                  {username}
                </div>
                <div
                  className={`duration-300 text-sm text-white truncate ${
                    isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"
                  }`}
                >
                  {email}
                </div>
              </a>
            </div>

            <div className="mt-3 mb-10 p-0">
              <ul className="list-none text-sm font-normal px-3">
                {sidebarStructure.map((item, index) =>
                  generateMenu(item, index)
                )}
              </ul>
              <div className="mt-8">
                <a
                  href="https://cms.jabulanimerkato.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline text-white px-8"
                >
                  Website CMS
                </a>
              </div>
            </div>
          </div>
        </SimpleBar>
      </div>
    </nav>
  );
};

export default Sidebar;
