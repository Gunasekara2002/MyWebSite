"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/API/config";
import { useAuth } from "@/context/AuthContext";
import AdminLayout from "@/components/layout/AdminLayout";
import ServiceManager from "@/components/Service/ServieMange";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  DollarSign,
  TreePine,
  Car,
  TrendingUp,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminServicesPage() {
  const [certificates, setCertificates] = useState([]);
  const [disasterLoans, setDisasterLoans] = useState([]);
  const [timberPermits, setTimberPermits] = useState([]);
  const [vehiclePermits, setVehiclePermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAllServices();
      fetchStats();
    }
  }, [user]);

  const fetchAllServices = async () => {
    setLoading(true);
    try {
      // Fixed API endpoints to match backend routes
      const requests = [
        axios.get(`${BASE_URL}/certificate`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/disasterLoan`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/timberPermit`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/vehiclePermit`).catch(() => ({ data: [] })), // Fixed: vehiclePermit
      ];

      const [certRes, loanRes, timberRes, vehicleRes] = await Promise.all(
        requests
      );

      // Handle different response structures
      setCertificates(certRes.data?.data || certRes.data || []);
      setDisasterLoans(loanRes.data?.data || loanRes.data || []);
      setTimberPermits(timberRes.data?.data || timberRes.data || []);
      setVehiclePermits(vehicleRes.data?.data || vehicleRes.data || []);

      console.log("Services loaded:", {
        certificates: certRes.data?.data || certRes.data || [],
        disasterLoans: loanRes.data?.data || loanRes.data || [],
        timberPermits: timberRes.data?.data || timberRes.data || [],
        vehiclePermits: vehicleRes.data?.data || vehicleRes.data || [],
      });
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Make stats optional - don't fail if endpoints don't exist
      const statsRequests = [
        axios
          .get(`${BASE_URL}/certificate/stats`)
          .catch(() => ({ data: { data: {} } })),
        axios
          .get(`${BASE_URL}/vehiclePermit/admin/statistics`) // Fixed: vehiclePermit
          .catch(() => ({ data: { data: {} } })),
      ];

      const [certStats, vehicleStats] = await Promise.all(statsRequests);
      setStats({
        certificates: certStats.data?.data || {},
        vehicles: vehicleStats.data?.data || {},
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Don't show error toast for stats as it's not critical
    }
  };

  // Service management functions with error handling
  const updateCertificateStatus = async (id, status) => {
    try {
      await axios.patch(`${BASE_URL}/certificate/${id}/status`, { status });
      toast.success(`Certificate ${status} successfully`);
      fetchAllServices(); // Refresh data after status update
    } catch (error) {
      console.error("Error updating certificate status:", error);
      toast.error("Failed to update certificate status");
      throw error;
    }
  };

  const updateDisasterLoanStatus = async (id, status) => {
    try {
      await axios.patch(`${BASE_URL}/disasterLoan/${id}/status`, { status });
      toast.success(`Disaster loan ${status} successfully`);
      fetchAllServices(); // Refresh data after status update
    } catch (error) {
      console.error("Error updating disaster loan status:", error);
      toast.error("Failed to update disaster loan status");
      throw error;
    }
  };

  const updateTimberPermitStatus = async (id, status) => {
    try {
      await axios.patch(`${BASE_URL}/timberPermit/${id}/status`, { status });
      toast.success(`Timber permit ${status} successfully`);
      fetchAllServices(); // Refresh data after status update
    } catch (error) {
      console.error("Error updating timber permit status:", error);
      toast.error("Failed to update timber permit status");
      throw error;
    }
  };

  const updateVehiclePermitStatus = async (id, status) => {
    try {
      await axios.put(`${BASE_URL}/vehiclePermit/${id}/status`, { status }); // Fixed: vehiclePermit
      toast.success(`Vehicle permit ${status} successfully`);
      fetchAllServices(); // Refresh data after status update
    } catch (error) {
      console.error("Error updating vehicle permit status:", error);
      toast.error("Failed to update vehicle permit status");
      throw error;
    }
  };

  const deleteService = (endpoint) => async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${endpoint}/${id}`);
      toast.success("Service deleted successfully");
      fetchAllServices(); // Refresh data after deletion
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      toast.error(`Failed to delete ${endpoint}`);
      throw error;
    }
  };

  const editService = (endpoint) => async (id, data) => {
    try {
      await axios.put(`${BASE_URL}/${endpoint}/${id}`, data);
      toast.success("Service updated successfully");
      fetchAllServices(); // Refresh data after update
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      toast.error(`Failed to update ${endpoint}`);
      throw error;
    }
  };

  // Column configurations for each service type
  const certificateColumns = [
    { key: "fullName", label: "Full Name" },
    {
      key: "type",
      label: "Type",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    { key: "copies", label: "Copies" },
    {
      key: "address",
      label: "Address",
      render: (value) => value?.substring(0, 30) + "..." || "N/A",
    },
    {
      key: "createdAt",
      label: "Applied",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const disasterLoanColumns = [
    { key: "fullName", label: "Full Name" },
    {
      key: "disasterType",
      label: "Disaster Type",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "loanAmount",
      label: "Amount",
      render: (value) => `$${value?.toLocaleString() || 0}`,
    },
    { key: "contact", label: "Contact" },
    {
      key: "createdAt",
      label: "Applied",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const timberPermitColumns = [
    { key: "fullName", label: "Full Name" },
    { key: "route", label: "Route" },
    {
      key: "timberDetails",
      label: "Details",
      render: (value) => value?.substring(0, 30) + "..." || "N/A",
    },
    { key: "permitNumber", label: "Permit #" },
    {
      key: "createdAt",
      label: "Applied",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const vehiclePermitColumns = [
    { key: "ownerName", label: "Owner Name" },
    { key: "vehicleNumber", label: "Vehicle #" },
    {
      key: "vehicleType",
      label: "Type",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    { key: "permitType", label: "Permit Type" },
    {
      key: "createdAt",
      label: "Applied",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const StatCard = ({ title, value, icon: Icon, description, trend }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value || 0}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <div className="ml-4 text-lg">Loading services...</div>
        </div>
      </AdminLayout>
    );
  }

  const totalServices =
    certificates.length +
    disasterLoans.length +
    timberPermits.length +
    vehiclePermits.length;
  const pendingServices = [
    ...certificates.filter((c) => c.status === "pending"),
    ...disasterLoans.filter((d) => d.status === "pending"),
    ...timberPermits.filter((t) => t.status === "pending"),
    ...vehiclePermits.filter((v) => v.status === "pending"),
  ].length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className=" text-white text-3xl font-bold">Service Management</h1>
          <p className="text-muted-foreground">
            Manage all government service applications and requests
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Services"
            value={totalServices}
            icon={FileText}
            description="All service applications"
          />
          <StatCard
            title="Pending Review"
            value={pendingServices}
            icon={Clock}
            description="Awaiting approval"
          />
          <StatCard
            title="Certificates"
            value={certificates.length}
            icon={FileText}
            description="Birth, Marriage, Death"
          />
          <StatCard
            title="Vehicle Permits"
            value={vehiclePermits.length}
            icon={Car}
            description="Vehicle registrations"
          />
        </div>

        {/* Service Management Tabs */}
        <Tabs defaultValue="certificates" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="certificates"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Certificates ({certificates.length})
            </TabsTrigger>
            <TabsTrigger
              value="disaster-loans"
              className="flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Disaster Loans ({disasterLoans.length})
            </TabsTrigger>
            <TabsTrigger
              value="timber-permits"
              className="flex items-center gap-2"
            >
              <TreePine className="w-4 h-4" />
              Timber Permits ({timberPermits.length})
            </TabsTrigger>
            <TabsTrigger
              value="vehicle-permits"
              className="flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              Vehicle Permits ({vehiclePermits.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certificates">
            <ServiceManager
              title="Certificates"
              data={certificates}
              onRefresh={fetchAllServices}
              onUpdateStatus={updateCertificateStatus}
              onDelete={deleteService("certificate")} 
              onEdit={editService("certificate")} 
              columns={certificateColumns}
              serviceType="Certificate"
            />
          </TabsContent>

          <TabsContent value="disaster-loans">
            <ServiceManager
              title="Disaster Loans"
              data={disasterLoans}
              onRefresh={fetchAllServices}
              onUpdateStatus={updateDisasterLoanStatus}
              onDelete={deleteService("disasterLoan")}
              onEdit={editService("disasterLoan")}
              columns={disasterLoanColumns}
              serviceType="Disaster Loan"
            />
          </TabsContent>

          <TabsContent value="timber-permits">
            <ServiceManager
              title="Timber Permits"
              data={timberPermits}
              onRefresh={fetchAllServices}
              onUpdateStatus={updateTimberPermitStatus}
              onDelete={deleteService("timberPermit")}
              onEdit={editService("timberPermit")}
              columns={timberPermitColumns}
              serviceType="Timber Permit"
            />
          </TabsContent>

          <TabsContent value="vehicle-permits">
            <ServiceManager
              title="Vehicle Permits"
              data={vehiclePermits}
              onRefresh={fetchAllServices}
              onUpdateStatus={updateVehiclePermitStatus}
              onDelete={deleteService("vehiclePermit")} 
              onEdit={editService("vehiclePermit")} 
              columns={vehiclePermitColumns}
              serviceType="Vehicle Permit"
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
