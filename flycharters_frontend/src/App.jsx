import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';
import { routes } from './routes/index.jsx';
import NotFoundPage from './pages/NotFoundPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import appStore, { persistor } from './utils/Redux _Store/appStore.js';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <>
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            {routes.public.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* User Routes */}
            <Route path="/user" element={routes.user[0].element}>
              {routes.user[0].children.map((child) => (
                <Route key={child.path} path={child.path} element={child.element} />
              ))}
            </Route>

            {/* Operator Routes - Simplified */}
            <Route path="/operator" element={routes.operator[0].element}>
              <Route index element={routes.operator[0].children.find(c => c.index).element} />
              {routes.operator[0].children
                .filter(child => !child.index)
                .map((child) => (
                  <Route key={child.path} path={child.path} element={child.element} />
                ))}
            </Route>

            {/* Admin Routes */}
            {routes.admin.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
    
          <ToastContainer position="top-center" autoClose={3000} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;