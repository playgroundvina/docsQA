import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRouter, publicRoutes } from "../src/routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <ToastContainer
      />
      <Router>
        <Routes>
          <Route>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              return (
                <Route key={index}>
                  <Route path={route.path} element={<Page />} />
                </Route>
              );
            })}
            {PrivateRouter.map((route, index) => {
              const Page = route.component;
              return (
                <Route key={index}>
                  <Route path={route.path} element={<Page />} />
                </Route>
              );
            })}
          </Route>

        </Routes>
      </Router>
    </>
  );
};

export default App;