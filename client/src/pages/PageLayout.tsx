import PageHeader from "../components/PageHeader";
import { Outlet } from "react-router";

// This is a page wrapper, that always adds the header and the main content under it
function PageLayout() {

  return (
    <div>
      <PageHeader />
      {/* Renders content of the child route */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PageLayout;
