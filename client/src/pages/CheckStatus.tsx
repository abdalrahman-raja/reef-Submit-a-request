import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowRight, CheckCircle, Clock, XCircle } from "lucide-react";

export default function CheckStatus() {
  const [, navigate] = useLocation();
  const [identityNumber, setIdentityNumber] = useState("");
  const [requestNumber, setRequestNumber] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const inquireQuery = trpc.requests.inquire.useQuery(
    {
      identityNumber,
      requestNumber,
    },
    {
      enabled: false,
    }
  );

  const handleSearch = async () => {
    if (!identityNumber || !requestNumber) {
      toast.error("يرجى إدخال رقم الهوية ورقم الطلب");
      return;
    }

    setHasSearched(true);
    await inquireQuery.refetch();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "rejected":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "approved":
        return "موافق عليه";
      case "rejected":
        return "مرفوض";
      case "completed":
        return "مكتمل";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "approved":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      case "completed":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b border-green-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ريف</span>
            </div>
            <h1 className="text-2xl font-bold text-green-700">بوابة ريف السعودي</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-green-700 hover:bg-green-50"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              تحقق من حالة طلبك
            </h2>
            <p className="text-lg text-gray-600">
              أدخل رقم الهوية ورقم الطلب للحصول على معلومات طلبك
            </p>
          </div>

          {/* Search Card */}
          <Card className="mb-8 border-green-200">
            <CardHeader>
              <CardTitle>البحث عن الطلب</CardTitle>
              <CardDescription>
                أدخل البيانات المطلوبة للبحث عن حالة طلبك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="identityNumber" className="text-right block mb-2">
                    رقم الهوية *
                  </Label>
                  <Input
                    id="identityNumber"
                    placeholder="أدخل رقم الهوية"
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    dir="rtl"
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="requestNumber" className="text-right block mb-2">
                    رقم الطلب *
                  </Label>
                  <Input
                    id="requestNumber"
                    placeholder="أدخل رقم الطلب"
                    value={requestNumber}
                    onChange={(e) => setRequestNumber(e.target.value)}
                    dir="rtl"
                    className="text-right"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={inquireQuery.isLoading}
                >
                  {inquireQuery.isLoading && (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  )}
                  تحقق من حالة الطلب
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {hasSearched && (
            <>
              {inquireQuery.isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
              ) : inquireQuery.error ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-red-800 mb-2">
                        لم يتم العثور على الطلب
                      </h3>
                      <p className="text-red-700">
                        {inquireQuery.error.message ||
                          "تأكد من صحة رقم الهوية ورقم الطلب"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : inquireQuery.data ? (
                <div className="space-y-6">
                  {/* Status Card */}
                  <Card className={`border-2 ${getStatusColor(inquireQuery.data.status)}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>حالة الطلب</CardTitle>
                        {getStatusIcon(inquireQuery.data.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800 mb-2">
                          {getStatusText(inquireQuery.data.status)}
                        </p>
                        <p className="text-sm text-gray-600">
                          آخر تحديث: {new Date(inquireQuery.data.updatedAt).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Details Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>تفاصيل الطلب</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* قسم 1: البيانات الأساسية */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-green-700 border-b border-green-100 pb-2">البيانات الأساسية</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">الاسم الكامل</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.fullName}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">الجنس</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.gender}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">رقم الهاتف</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.phoneNumber}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">الجنسية</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.nationality}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* قسم 2: تفاصيل التمويل */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-green-700 border-b border-green-100 pb-2">تفاصيل التمويل</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                              <p className="text-sm text-green-600 mb-1">مبلغ التمويل</p>
                              <p className="text-xl font-bold text-green-700">
                                {inquireQuery.data.fundingAmount ? inquireQuery.data.fundingAmount.toLocaleString() + " ر.س" : "-"}
                              </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                              <p className="text-sm text-green-600 mb-1">القسط الشهري</p>
                              <p className="text-xl font-bold text-green-700">
                                {inquireQuery.data.monthlyInstallment ? inquireQuery.data.monthlyInstallment.toLocaleString() + " ر.س" : "-"}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">مدة التمويل (عدد الأشهر)</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.fundingDuration || "-"}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">المبلغ الإجمالي المستحق</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.totalAmount ? inquireQuery.data.totalAmount.toLocaleString() + " ر.س" : "-"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* قسم 3: الملف المالي */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-green-700 border-b border-green-100 pb-2">الملف المالي</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">رسوم موافقة التمويل</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.approvalFees ? inquireQuery.data.approvalFees.toLocaleString() + " ر.س" : "-"}
                              </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                              <p className="text-sm text-red-600 mb-1">المتعثرات</p>
                              <p className="text-lg font-bold text-red-700">
                                {inquireQuery.data.arrears ? inquireQuery.data.arrears.toLocaleString() + " ر.س" : "لا يوجد"}
                              </p>
                            </div>
                          </div>
                          {inquireQuery.data.financialFile && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">الملف المالي</p>
                              <p className="text-gray-800">{inquireQuery.data.financialFile}</p>
                            </div>
                          )}
                        </div>

                        {/* قسم 4: حالة الطلب وتاريخ التنفيذ */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-green-700 border-b border-green-100 pb-2">حالة الطلب وتاريخ التنفيذ</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">تاريخ التقديم</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {new Date(inquireQuery.data.submissionDate).toLocaleDateString("ar-SA")}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">تاريخ نزول المبلغ</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.disbursementDate
                                  ? new Date(inquireQuery.data.disbursementDate).toLocaleDateString("ar-SA")
                                  : "-"}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">رقم العملية</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.transactionNumber || "-"}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">حالة الطلب</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {inquireQuery.data.disbursementDate ? "تم الصرف" : "قيد الانتظار"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {inquireQuery.data.notes && (
                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <p className="text-sm text-amber-600 mb-1">ملاحظات إضافية</p>
                            <p className="text-gray-800">{inquireQuery.data.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* New Search Button */}
                  <Button
                    onClick={() => {
                      setIdentityNumber("");
                      setRequestNumber("");
                      setHasSearched(false);
                    }}
                    variant="outline"
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  >
                    بحث جديد
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2026 بوابة ريف السعودي. جميع الحقوق محفوظة.</p>
          <p className="text-green-200 text-sm">
            منصة آمنة وموثوقة لإدارة طلبات التمويل
          </p>
        </div>
      </footer>
    </div>
  );
}
