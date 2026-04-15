import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Search, LogOut } from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    requestNumber: "",
    identityNumber: "",
    fullName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    residencyNumber: "",
    age: "",
    nationality: "",
    requestedAmount: "",
    approvedAmount: "",
    submissionDate: "",
    disbursementDate: "",
    transactionNumber: "",
    fundingAmount: "",
    monthlyInstallment: "",
    fundingDuration: "",
    financialFile: "",
    approvalFees: "",
    arrears: "",
    totalAmount: "",
    status: "pending",
    notes: "",
  });

  const requestsList = trpc.requests.list.useQuery({
    search: searchTerm,
    status: statusFilter || undefined,
  });

  const createRequestMutation = trpc.requests.create.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة الطلب بنجاح");
      setShowForm(false);
      setFormData({
        requestNumber: "",
        identityNumber: "",
        fullName: "",
        gender: "",
        phoneNumber: "",
        email: "",
        residencyNumber: "",
        age: "",
        nationality: "",
        requestedAmount: "",
        approvedAmount: "",
        submissionDate: "",
        disbursementDate: "",
        transactionNumber: "",
        fundingAmount: "",
        monthlyInstallment: "",
        fundingDuration: "",
        financialFile: "",
        approvalFees: "",
        arrears: "",
        totalAmount: "",
        status: "pending",
        notes: "",
      });
      requestsList.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة الطلب");
    },
  });

  // التحقق من صلاحيات المشرف
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (user?.role !== "admin") {
      toast.error("ليس لديك صلاحيات كافية للوصول إلى هذه الصفحة");
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من الحقول المطلوبة
    if (
      !formData.requestNumber ||
      !formData.identityNumber ||
      !formData.fullName ||
      !formData.gender ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.nationality ||
      !formData.requestedAmount ||
      !formData.submissionDate
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    await createRequestMutation.mutateAsync({
      requestNumber: formData.requestNumber,
      identityNumber: formData.identityNumber,
      fullName: formData.fullName,
      gender: formData.gender as "ذكر" | "أنثى",
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      residencyNumber: formData.residencyNumber || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      nationality: formData.nationality,
      requestedAmount: parseInt(formData.requestedAmount),
      approvedAmount: formData.approvedAmount ? parseInt(formData.approvedAmount) : undefined,
      submissionDate: new Date(formData.submissionDate),
      disbursementDate: formData.disbursementDate ? new Date(formData.disbursementDate) : undefined,
      transactionNumber: formData.transactionNumber || undefined,
      fundingAmount: formData.fundingAmount ? parseInt(formData.fundingAmount) : undefined,
      monthlyInstallment: formData.monthlyInstallment ? parseInt(formData.monthlyInstallment) : undefined,
      fundingDuration: formData.fundingDuration ? parseInt(formData.fundingDuration) : undefined,
      financialFile: formData.financialFile || undefined,
      approvalFees: formData.approvalFees ? parseInt(formData.approvalFees) : undefined,
      arrears: formData.arrears ? parseInt(formData.arrears) : undefined,
      totalAmount: formData.totalAmount ? parseInt(formData.totalAmount) : undefined,
      status: (formData.status as any) || "pending",
      notes: formData.notes || undefined,
    });
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-green-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ريف</span>
            </div>
            <h1 className="text-2xl font-bold text-green-700">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              مرحباً، {user?.name || "مشرف"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Add Request Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة طلب جديد
          </Button>
        </div>

        {/* Add Request Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-700">إضافة طلب جديد</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* قسم معلومات الهوية والطلب */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-green-700 flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  معلومات الهوية والطلب
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="identityNumber" className="text-right block mb-2 font-medium">
                      رقم الهوية / بطاقة المقيم *
                    </Label>
                    <Input
                      id="identityNumber"
                      value={formData.identityNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, identityNumber: e.target.value })
                      }
                      placeholder="أدخل رقم الهوية أو الإقامة"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="requestNumber" className="text-right block mb-2 font-medium">
                      رقم الطلب *
                    </Label>
                    <Input
                      id="requestNumber"
                      value={formData.requestNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, requestNumber: e.target.value })
                      }
                      placeholder="مثال: REQ-2026-001"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* قسم البيانات الشخصية */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-green-700 flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  البيانات الشخصية
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-right block mb-2 font-medium">
                      الاسم الكامل للمستفيد *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="الاسم الرباعي كما في الهوية"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-right block mb-2 font-medium">
                      رقم الجوال *
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      placeholder="05xxxxxxxx"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gender" className="text-right block mb-2 font-medium">
                      الجنس *
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }>
                      <SelectTrigger id="gender" dir="rtl" className="bg-white">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ذكر">ذكر</SelectItem>
                        <SelectItem value="أنثى">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-right block mb-2 font-medium">
                      العمر
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      placeholder="العمر"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality" className="text-right block mb-2 font-medium">
                      الجنسية *
                    </Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) =>
                        setFormData({ ...formData, nationality: e.target.value })
                      }
                      placeholder="سعودي / مقيم"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* قسم المبالغ والتواريخ */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-green-700 flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  المبالغ المالية والتواريخ
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="requestedAmount" className="text-right block mb-2 font-medium">
                      القيمة المطلوبة (ريال) *
                    </Label>
                    <Input
                      id="requestedAmount"
                      type="number"
                      value={formData.requestedAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, requestedAmount: e.target.value })
                      }
                      placeholder="المبلغ المطلوب من العميل"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="approvedAmount" className="text-right block mb-2 font-medium">
                      القيمة الموافق عليها (ريال)
                    </Label>
                    <Input
                      id="approvedAmount"
                      type="number"
                      value={formData.approvedAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, approvedAmount: e.target.value })
                      }
                      placeholder="المبلغ المعتمد في النظام"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="submissionDate" className="text-right block mb-2 font-medium">
                      تاريخ التقديم *
                    </Label>
                    <Input
                      id="submissionDate"
                      type="datetime-local"
                      value={formData.submissionDate}
                      onChange={(e) =>
                        setFormData({ ...formData, submissionDate: e.target.value })
                      }
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="disbursementDate" className="text-right block mb-2 font-medium">
                      تاريخ نزول المبلغ
                    </Label>
                    <Input
                      id="disbursementDate"
                      type="datetime-local"
                      value={formData.disbursementDate}
                      onChange={(e) =>
                        setFormData({ ...formData, disbursementDate: e.target.value })
                      }
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* قسم بيانات التمويل والملف المالي */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-green-700 flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  بيانات التمويل والملف المالي
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fundingAmount" className="text-right block mb-2 font-medium">
                      مبلغ التمويل
                    </Label>
                    <Input
                      id="fundingAmount"
                      type="number"
                      value={formData.fundingAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, fundingAmount: e.target.value })
                      }
                      placeholder="أصل التمويل"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyInstallment" className="text-right block mb-2 font-medium">
                      القسط الشهري
                    </Label>
                    <Input
                      id="monthlyInstallment"
                      type="number"
                      value={formData.monthlyInstallment}
                      onChange={(e) =>
                        setFormData({ ...formData, monthlyInstallment: e.target.value })
                      }
                      placeholder="قيمة الدفعة الشهرية"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fundingDuration" className="text-right block mb-2 font-medium">
                      مدة التمويل (عدد الأشهر)
                    </Label>
                    <Input
                      id="fundingDuration"
                      type="number"
                      value={formData.fundingDuration}
                      onChange={(e) =>
                        setFormData({ ...formData, fundingDuration: e.target.value })
                      }
                      placeholder="مثال: 24"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalAmount" className="text-right block mb-2 font-medium">
                      المبلغ الإجمالي
                    </Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={formData.totalAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, totalAmount: e.target.value })
                      }
                      placeholder="إجمالي المديونية"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="approvalFees" className="text-right block mb-2 font-medium">
                      رسوم موافقة التمويل
                    </Label>
                    <Input
                      id="approvalFees"
                      type="number"
                      value={formData.approvalFees}
                      onChange={(e) =>
                        setFormData({ ...formData, approvalFees: e.target.value })
                      }
                      placeholder="الرسوم الإدارية"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="arrears" className="text-right block mb-2 font-medium">
                      المتعثرات
                    </Label>
                    <Input
                      id="arrears"
                      type="number"
                      value={formData.arrears}
                      onChange={(e) =>
                        setFormData({ ...formData, arrears: e.target.value })
                      }
                      placeholder="المبالغ المتأخرة إن وجدت"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="financialFile" className="text-right block mb-2 font-medium">
                    الملف المالي
                  </Label>
                  <Input
                    id="financialFile"
                    value={formData.financialFile}
                    onChange={(e) =>
                      setFormData({ ...formData, financialFile: e.target.value })
                    }
                    placeholder="رابط الملف المالي أو ملاحظات مالية"
                    dir="rtl"
                    className="bg-white"
                  />
                </div>
              </div>

              {/* قسم إضافي */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-green-700 flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  بيانات إضافية
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transactionNumber" className="text-right block mb-2 font-medium">
                      رقم العملية
                    </Label>
                    <Input
                      id="transactionNumber"
                      value={formData.transactionNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, transactionNumber: e.target.value })
                      }
                      placeholder="رقم العملية البنكية / النظام"
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-right block mb-2 font-medium">
                      حالة الطلب
                    </Label>
                    <Select value={formData.status} onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }>
                      <SelectTrigger id="status" dir="rtl" className="bg-white">
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="approved">موافق عليه</SelectItem>
                        <SelectItem value="rejected">مرفوض</SelectItem>
                        <SelectItem value="completed">مكتمل / تم الصرف</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-right block mb-2 font-medium">
                    البريد الإلكتروني للإشعارات
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                    dir="rtl"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-right block mb-2 font-medium">
                    ملاحظات إدارية
                  </Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="أي ملاحظات إضافية حول المعاملة"
                    dir="rtl"
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-gray-100 mt-auto">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-lg"
                  disabled={createRequestMutation.isPending}
                >
                  {createRequestMutation.isPending && (
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  )}
                  حفظ المعاملة ونظام الإشعارات
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 h-12 text-lg border-gray-300"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>البحث والتصفية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="text-right block mb-2">
                  بحث
                </Label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="ابحث برقم الطلب أو الهوية أو الاسم"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                    dir="rtl"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="statusFilter" className="text-right block mb-2">
                  الحالة
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="statusFilter" dir="rtl">
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الحالات</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="approved">موافق عليه</SelectItem>
                    <SelectItem value="rejected">مرفوض</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلبات</CardTitle>
            <CardDescription>
              إجمالي الطلبات: {requestsList.data?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requestsList.isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              </div>
            ) : requestsList.data && requestsList.data.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">رقم الهوية</TableHead>
                      <TableHead className="text-right">البريد الإلكتروني</TableHead>
                      <TableHead className="text-right">القيمة المطلوبة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestsList.data.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.requestNumber}
                        </TableCell>
                        <TableCell>{request.fullName}</TableCell>
                        <TableCell>{request.identityNumber}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.requestedAmount.toLocaleString()} ر.س</TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {request.status === "pending"
                              ? "قيد الانتظار"
                              : request.status === "approved"
                              ? "موافق عليه"
                              : request.status === "rejected"
                              ? "مرفوض"
                              : "مكتمل"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(request.createdAt).toLocaleDateString("ar-SA")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                لا توجد طلبات حالياً
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
