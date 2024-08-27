import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Designer from "./views/designer";
import Previewer from "./views/previewer";

const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Designer />} />
      <Route path="/preview" element={<Previewer />} />
    </>
  )
);

export default AppRouter;
