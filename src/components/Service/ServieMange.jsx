"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ServiceManager({
  title,
  data,
  onRefresh,
  onUpdateStatus,
  onDelete,
  onEdit,
  columns,
  serviceType,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", icon: Clock, color: "text-yellow-600" },
      approved: {
        variant: "default",
        icon: CheckCircle,
        color: "text-green-600",
      },
      rejected: {
        variant: "destructive",
        icon: XCircle,
        color: "text-red-600",
      },
      under_review: { variant: "outline", icon: Clock, color: "text-blue-600" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status?.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await onUpdateStatus(id, newStatus);
      onRefresh();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      setIsDeleteModalOpen(false);
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const handleEdit = async () => {
    try {
      await onEdit(selectedItem._id, editFormData);
      setIsEditModalOpen(false);
      onRefresh();
    } catch (error) {
      toast.error("Failed to update service");
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditFormData(item);
    setIsEditModalOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription>
              Manage {title.toLowerCase()} applications and requests
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {filteredData.length} Records
          </Badge>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No records found</p>
            <p className="text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left p-3 font-medium text-gray-700"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="text-left p-3 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="border-b hover:bg-gray-50"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="p-3">
                        {column.render
                          ? column.render(item[column.key], item)
                          : item[column.key]?.toString() || "N/A"}
                      </td>
                    ))}
                    <td className="p-3">{getStatusBadge(item.status)}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View {serviceType} Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {Object.entries(selectedItem).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4">
                  <Label className="font-medium capitalize">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  <div className="col-span-2">
                    {typeof value === "object" && value !== null
                      ? JSON.stringify(value, null, 2)
                      : value?.toString() || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  handleStatusUpdate(selectedItem?._id, "approved")
                }
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  handleStatusUpdate(selectedItem?._id, "rejected")
                }
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {serviceType}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem &&
              Object.entries(editFormData).map(([key, value]) => {
                if (
                  ["_id", "__v", "createdAt", "updatedAt", "user"].includes(key)
                )
                  return null;

                return (
                  <div key={key}>
                    <Label className="capitalize">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                    {key === "status" ? (
                      <Select
                        value={editFormData[key]}
                        onValueChange={(val) =>
                          setEditFormData({ ...editFormData, [key]: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="under_review">
                            Under Review
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={editFormData[key] || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            [key]: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                );
              })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {serviceType.toLowerCase()}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(selectedItem?._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
