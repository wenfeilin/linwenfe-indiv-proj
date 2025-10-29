import GlobalSpotifyPlayer from "../components/Music/GlobalSpotifyPlayer";
import PageHeader from "../components/PageHeader";
import { Outlet, useLocation } from "react-router";

// This is a page wrapper, that always adds the header and the main content under it
function PageLayout() {
  const location = useLocation();
  const path = location.pathname;
  let containerStyles = ""

  if (path.includes("calendar")) {
    containerStyles = "order-last col-start-2";
  } else if (path.includes("entry")) {
    containerStyles = "";
  }

  return (
    <div className="h-full flex flex-col">
      <PageHeader />
      {/* Renders content of the child route */}
      <main className="flex-1">
        <Outlet />

        {/* Place calendar player here so it doesn't get unmounted on route changes*/}
        <GlobalSpotifyPlayer containerStyles={containerStyles}/>
      </main>
    </div>
  );
}

export default PageLayout;
