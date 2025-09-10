import Sidebar from "./Sidebar";
import Header from "./Header";

function ParentComponent(props) {
  return (
    <div>
      <Header handleSidebarOpen={props.appSidebarOpen} />
      <Sidebar
        sidebarOpen={props.appOpen}
        handleSidebarOpen={props.appSidebarOpen}
      />
    </div>
  );
}

export default ParentComponent;
