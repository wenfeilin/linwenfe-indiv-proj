import PageHeader from "../components/PageHeader";
import { Outlet } from "react-router";

// This is a page wrapper, that always adds the header and the main content under it
function PageLayout() {

  return (
    <div className={`flex flex-col h-full`}>
      <PageHeader />
      {/* Renders content of the child route */}
      <main className="flex-1">
        <Outlet />

        {/* Place calendar player here so it doesn't get unmounted on route changes
        {isLoggedIn && (isOnCalendarPg? !isCalendarLoading: true) &&
          (<div className={`${parentContainerStyles}`}>
            <GlobalPlayer containerStyles={`${containerStyles}`}/>
          </div>)} */}
      </main>
    </div>
  );
}

export default PageLayout;
