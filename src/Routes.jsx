import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute"; // Import the guard

// Pages
import NotFound from "pages/NotFound";
import SearchResults from './pages/search-results';
import LifecyclePlanning from './pages/lifecycle-planning';
import AssetListPage from './pages/asset-list';
import AssetDetails from './pages/asset-details';
import AssetRegistration from './pages/asset-registration';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import CheckoutManagement from './pages/checkout-management';
import SupplierManagement from './pages/supplier-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* --- Public Routes --- */}
          <Route path="/login" element={<Login />} />

          {/* --- Protected Routes --- */}
          {/* All routes inside this wrapper require login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/checkout-management" element={<CheckoutManagement />} />
            <Route path="/supplier-management" element={<SupplierManagement />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/lifecycle-planning" element={<LifecyclePlanning />} />
            <Route path="/asset-list" element={<AssetListPage />} />
            <Route path="/asset-details" element={<AssetDetails />} />
            <Route path="/asset-registration" element={<AssetRegistration />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;