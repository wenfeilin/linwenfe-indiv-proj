import PageHeader from "../components/PageHeader";
import { Outlet } from "react-router";

// This is a page wrapper, that always adds the header and the main content under it
function PageLayout() {

  return (
    <div className="h-full flex flex-col">
      <PageHeader />
      {/* Renders content of the child route */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default PageLayout;
