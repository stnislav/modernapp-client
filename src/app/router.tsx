import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HomePage } from "../pages/HomePage";
import { ItemsPage } from "../pages/ItemsPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "items", element: <ItemsPage /> },
    ],
  },
]);