import GlobalSpotifyPlayer from "../components/Music/GlobalSpotifyPlayer";
import PageHeader from "../components/PageHeader";
import { Outlet, useLocation } from "react-router";

// This is a page wrapper, that always adds the header and the main content under it
function PageLayout() {
  const location = useLocation();
  const path = location.pathname;

  let containerStyles = "";
  let parentContainerStyles = ""

  if (path.includes("calendar")) {
    containerStyles = "w-full md:w-3/4 lg:w-1/2 px-3";
    parentContainerStyles = "order-last col-start-2 flex flex-col items-center";
  } else if (path.includes("entry")) {
    containerStyles = "";
    parentContainerStyles = "";
  }

  return (
    <div className="">
      <PageHeader />
      {/* Renders content of the child route */}
      <main className="">
        <Outlet />

        {/* Place calendar player here so it doesn't get unmounted on route changes*/}
        <div className={`${parentContainerStyles}`}>
          <GlobalSpotifyPlayer containerStyles={`${containerStyles}`}/>
        </div>
      </main>
    </div>
  );
}

export default PageLayout;
