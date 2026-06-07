// //
// import React, { useState } from "react";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { MenuItem, menuItems } from "./dashboard.utils";
// import { getUserInfo } from "../../services/auth.service";

// const DashboardLayout: React.FC = () => {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

//   const location = useLocation();
//   const navigate = useNavigate();

//   const user = getUserInfo();

//   const currentPage = menuItems
//     .flatMap((item) => (item.subRoutes ? [item, ...item.subRoutes] : [item]))
//     .find(
//       (item) =>
//         location.pathname === item.path ||
//         location.pathname.startsWith(item.path + "/")
//     );

//   const pageTitle = currentPage?.name || "Dashboard";

//   const accessibleMenuItems = menuItems.filter((item) =>
//     item.roles.includes(user?.role || "user")
//   );

//   const toggleSubMenu = (name: string) => {
//     setExpanded((prev) => ({
//       ...prev,
//       [name]: !prev[name],
//     }));
//   };

//   const handleNavigation = (item: MenuItem) => {
//     if (item.subRoutes) {
//       toggleSubMenu(item.name);
//     } else {
//       navigate(item.path);
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col overflow-hidden bg-[#070c18] text-white">
//       {/* Header */}
//       <header className="px-6 py-4 bg-[#0a1020] border-b border-white/[0.06] flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Link to="/">
//             <button className="w-9 h-9 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition">
//               <i className="fas fa-arrow-left"></i>
//             </button>
//           </Link>

//           <div>
//             <p className="text-xs text-slate-400">Dashboard</p>
//             <h1 className="text-lg font-semibold">{pageTitle}</h1>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="relative">
//             <i className="fas fa-bell text-lg"></i>
//             <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
//               5
//             </span>
//           </button>

//           <img
//             className="h-9 w-9 rounded-full"
//             src="https://avatars.githubusercontent.com/u/76697055?v=4"
//             alt="profile"
//           />
//         </div>
//       </header>

//       {/* Main Layout */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside
//           className={`bg-[#0a1020] border-r border-white/[0.06] transition-all duration-300 ${
//             isSidebarCollapsed ? "w-20" : "w-64"
//           }`}
//         >
//           <nav className="p-4 space-y-2 overflow-y-auto h-full">
//             {accessibleMenuItems.map((item) => {
//               const isActive =
//                 location.pathname === item.path ||
//                 location.pathname.startsWith(item.path + "/");

//               return (
//                 <div key={item.name}>
//                   <div
//                     onClick={() => handleNavigation(item)}
//                     className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${
//                       isActive
//                         ? "bg-blue-500/20 text-blue-400"
//                         : "hover:bg-white/[0.05] text-slate-300"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <i className={item.icon}></i>

//                       {!isSidebarCollapsed && <span>{item.name}</span>}
//                     </div>

//                     {item.subRoutes && !isSidebarCollapsed && (
//                       <i
//                         className={`fas fa-chevron-down text-xs transition-transform ${
//                           expanded[item.name] ? "rotate-180" : ""
//                         }`}
//                       ></i>
//                     )}
//                   </div>

//                   {item.subRoutes &&
//                     expanded[item.name] &&
//                     !isSidebarCollapsed && (
//                       <div className="ml-6 mt-1 space-y-1">
//                         {item.subRoutes.map((subItem) => (
//                           <Link
//                             key={subItem.name}
//                             to={subItem.path}
//                             className={`block px-3 py-2 rounded-md text-sm transition ${
//                               location.pathname === subItem.path
//                                 ? "bg-blue-500/20 text-blue-400"
//                                 : "text-slate-400 hover:bg-white/[0.05]"
//                             }`}
//                           >
//                             {subItem.name}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                 </div>
//               );
//             })}
//           </nav>

//           {/* Sidebar Footer */}
//           <div className="p-4 border-t border-white/[0.06]">
//             <button
//               onClick={() =>
//                 setIsSidebarCollapsed(!isSidebarCollapsed)
//               }
//               className="w-full px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition text-sm"
//             >
//               <i
//                 className={`fas ${
//                   isSidebarCollapsed
//                     ? "fa-chevron-right"
//                     : "fa-chevron-left"
//                 }`}
//               ></i>

//               {!isSidebarCollapsed && (
//                 <span className="ml-2">Collapse Sidebar</span>
//               )}
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { MenuItem, menuItems } from "./dashboard.utils";
import { getUserInfo } from "../../services/auth.service";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const location = useLocation();
  const navigate = useNavigate();

  const user = getUserInfo();

  // Single hook call with skip condition - must be called unconditionally
  const { data: userProfile } = useGetProfileInfoQuery(undefined, {
    skip: !user,
  });

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const isCurrentPath = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const currentPage = menuItems
    .flatMap((item) => (item.subRoutes ? [item, ...item.subRoutes] : [item]))
    .sort((left, right) => right.path.length - left.path.length)
    .find((item) => isCurrentPath(item.path));

  const pageTitle = currentPage?.name || "Dashboard";

  const accessibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "user"),
  );

  const toggleSubMenu = (name: string) => {
    setExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleNavigation = (item: MenuItem) => {
    if (item.subRoutes) {
      toggleSubMenu(item.name);
      return;
    }

    closeMobileSidebar();
    navigate(item.path);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#070c18] dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/[0.06] dark:bg-[#0a1020] sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.7] text-slate-900 transition hover:bg-white dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1] lg:hidden"
              aria-label="Open dashboard navigation"
            >
              <i className="fas fa-bars"></i>
            </button>

            <Link
              to="/"
              aria-label="Back to home"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.7] text-slate-900 transition hover:bg-white dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1]"
            >
              <i className="fas fa-arrow-left"></i>
            </Link>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Dashboard
              </p>
              <h1 className="truncate text-base font-semibold sm:text-lg">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-900 dark:text-white sm:gap-4">
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.7] transition hover:bg-white dark:bg-white/[0.05] dark:hover:bg-white/[0.1]"
              aria-label="View notifications"
            >
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-2 rounded-full bg-red-500 px-1 text-[10px] text-white">
                5
              </span>
            </button>

            <img
              className="h-9 w-9 rounded-full border border-slate-200 object-cover dark:border-white/10"
              src={
                userProfile?.profile?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "User"
                )}&background=random`
              }
              alt="profile"
            />
          </div>
        </div>
      </header>

      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Main Layout */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,calc(100vw-2rem))] max-w-full flex-col border-r border-gray-200 bg-gray-50 shadow-2xl transition-transform duration-300 dark:border-white/[0.06] dark:bg-[#0a1020] dark:shadow-black/50 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            isSidebarCollapsed ? "lg:w-20" : "lg:w-64"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-white/[0.06] lg:hidden">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Dashboard
              </p>
              <h2 className="text-sm font-semibold">Navigation</h2>
            </div>

            <button
              type="button"
              onClick={closeMobileSidebar}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.7] text-slate-900 transition hover:bg-white dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1]"
              aria-label="Close dashboard navigation"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <nav className="h-full flex-1 space-y-2 overflow-y-auto p-4">
            {accessibleMenuItems.map((item) => {
              const isActive = isCurrentPath(item.path);

              return (
                <div key={item.name}>
                  <button
                    type="button"
                    aria-label={item.name}
                    aria-expanded={item.subRoutes ? expanded[item.name] : undefined}
                    onClick={() => handleNavigation(item)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                      isActive
                        ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        : "hover:bg-slate-100 text-slate-700 dark:hover:bg-white/[0.05] dark:text-slate-300"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <i className={`${item.icon} shrink-0`}></i>

                      <span className={`truncate ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
                        {item.name}
                      </span>
                    </div>

                    {item.subRoutes && (
                      <i
                        className={`fas fa-chevron-down text-xs transition-transform ${
                          expanded[item.name] ? "rotate-180" : ""
                        } ${isSidebarCollapsed ? "lg:hidden" : ""}`}
                      ></i>
                    )}
                  </button>

                  {item.subRoutes &&
                    expanded[item.name] &&
                    (
                      <div className={`ml-6 mt-1 space-y-1 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
                        {item.subRoutes.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            aria-label={subItem.name}
                            onClick={closeMobileSidebar}
                            className={`block px-3 py-2 rounded-md text-sm transition ${
                              location.pathname === subItem.path
                                ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="hidden border-t border-gray-200 p-4 dark:border-white/[0.06] lg:block">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full px-3 py-2 rounded-lg bg-white hover:bg-slate-100 transition text-sm text-slate-900 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-white"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <i
                className={`fas ${
                  isSidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"
                }`}
              ></i>

              {!isSidebarCollapsed && (
                <span className="ml-2">Collapse Sidebar</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-auto bg-white px-4 py-4 text-slate-900 dark:bg-[#070c18] dark:text-white sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
