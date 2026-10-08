// src/pages/admin/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

import AdminTopNav from "../../components/admin/AdminTopNav";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminBusinessManagement from "../../components/admin/AdminBusinessManagement";
import AdminBusinessApproval from "../../components/admin/AdminBusinessApproval";
import AdminDashboardView from "../../components/admin/AdminDashboardView";
import AdminPromotionsView from "../../components/admin/AdminPromotionsView";
import AdminAdvertisementsView from "../../components/admin/AdminAdvertisementsView";
import AdminCategoriesView from "../../components/admin/AdminCategoriesView";
import AdminFeaturedView from "../../components/admin/AdminFeaturedView";
import AdminRevenueView from "../../components/admin/AdminRevenueView";
import AdminUsersTable from "../../components/admin/AdminUsersTable";
import AdminSettings from "../../components/admin/AdminSettings";
import AdminAddBusinessModal from "../../components/admin/AdminAddBusinessModal";
import Footer from "../../components/Footer";

import { useListBusinessesQuery } from "../../features/businessApiSlice";

// Only genuinely unimplemented tabs remain here
const PLACEHOLDER_TABS = {
  support: {
    title: "Admin Help & Support",
    body: "For platform moderation disputes or API integration assistance, contact the platform operations team.",
  },
};

const AdminPage = ({ initialTab = "dashboard" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: routeBusinessId } = useParams();

  const tabFromQuery = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabFromQuery || initialTab || "dashboard"
  );
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    routeBusinessId || null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const { data: pendingResp } = useListBusinessesQuery({
    status: "pending",
    limit: 1,
  });
  const pendingCount = pendingResp?.pagination?.total || 0;

  useEffect(() => {
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
    setSidebarOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectBusinessApproval = (bizId) => {
    setSelectedBusinessId(bizId);
    handleTabChange("approval");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col justify-between text-slate-800">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          {toast.tone === "error" ? (
            <FiXCircle className="text-rose-400" size={17} />
          ) : (
            <FiCheckCircle className="text-emerald-400" size={17} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <AdminTopNav
        onMenuClick={() => setSidebarOpen(true)}
        activeTab={activeTab}
        selectedBusinessId={selectedBusinessId}
        pendingCount={pendingCount}
        onGoToApprovals={() => handleTabChange("approval")}
        onTabChange={handleTabChange}
      />

      <div className="flex-1 flex w-full relative">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onOpenAddBusiness={() => setIsAddModalOpen(true)}
          onSelectBusinessApproval={handleSelectBusinessApproval}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          pendingCount={pendingCount}
        />

        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {activeTab === "dashboard" && (
              <AdminDashboardView
                onSelectBusinessApproval={handleSelectBusinessApproval}
                onNavigateToBusinesses={() => handleTabChange("businesses")}
              />
            )}

            {activeTab === "businesses" && (
              <AdminBusinessManagement
                onSelectBusinessApproval={handleSelectBusinessApproval}
                onNotify={showToast}
                onOpenAddBusiness={() => setIsAddModalOpen(true)}
              />
            )}

            {activeTab === "approval" && (
              <AdminBusinessApproval
                businessId={selectedBusinessId}
                onBack={() => handleTabChange("businesses")}
                onNotify={showToast}
                onApproved={() => handleTabChange("businesses")}
                onRejected={() => handleTabChange("businesses")}
              />
            )}

            {activeTab === "promotions" && (
              <AdminPromotionsView onNotify={showToast} />
            )}

            {activeTab === "advertisements" && (
              <AdminAdvertisementsView onNotify={showToast} />
            )}

            {activeTab === "categories" && (
              <AdminCategoriesView onNotify={showToast} />
            )}

            {/* ▼ NEW — real components replace the placeholders ▼ */}
            {activeTab === "featured" && (
              <AdminFeaturedView onNotify={showToast} />
            )}

            {activeTab === "revenue" && <AdminRevenueView />}

            {activeTab === "users" && <AdminUsersTable onNotify={showToast} />}

            {activeTab === "settings" && <AdminSettings onNotify={showToast} />}

            {/* Analytics reuses the dashboard component since it's the same data */}
            {activeTab === "analytics" && (
              <AdminDashboardView
                onSelectBusinessApproval={handleSelectBusinessApproval}
                onNavigateToBusinesses={() => handleTabChange("businesses")}
              />
            )}

            {PLACEHOLDER_TABS[activeTab] && (
              <PlaceholderView {...PLACEHOLDER_TABS[activeTab]} />
            )}
          </main>

          <Footer />
        </div>
      </div>

      <AdminAddBusinessModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onNotify={showToast}
      />
    </div>
  );
};

const PlaceholderView = ({ title, body }) => (
  <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center space-y-3 max-w-2xl mx-auto">
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
      {body}
    </p>
  </div>
);

export default AdminPage;