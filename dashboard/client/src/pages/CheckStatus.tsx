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
                  {/* ملخص الطلب الاحترافي */}
                  <Card className="border-green-200 overflow-hidden">
                    <div className="bg-green-600 p-6 text-white text-center">
                      <h3 className="text-xl font-bold mb-1">ملخص حالة الطلب</h3>
                      <p className="text-green-100 opacity-90">رقم الطلب: {inquireQuery.data.requestNumber}</p>
                    </div>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-100">
                        {/* الاسم الكامل */}
                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <span className="text-gray-600 font-medium">الاسم الكامل</span>
                          <span className="text-gray-900 font-bold">{inquireQuery.data.fullName}</span>
                        </div>
                        
                        {/* رقم الهاتف */}
                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <span className="text-gray-600 font-medium">رقم الهاتف</span>
                          <span className="text-gray-900 font-bold" dir="ltr">{inquireQuery.data.phoneNumber}</span>
                        </div>

                        {/* القيمة الموافق عليها */}
                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors bg-green-50/30">
                          <span className="text-gray-600 font-medium">القيمة الموافق عليها</span>
                          <span className="text-green-700 font-extrabold text-xl">
                            {inquireQuery.data.approvedAmount
                              ? inquireQuery.data.approvedAmount.toLocaleString() + " ر.س"
                              : "قيد المراجعة"}
                          </span>
                        </div>

                        {/* تفاصيل التمويل */}
                        {inquireQuery.data.fundingAmount && (
                          <>
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <span className="text-gray-600 font-medium">مبلغ التمويل</span>
                              <span className="text-gray-900 font-bold">{Number(inquireQuery.data.fundingAmount).toLocaleString()} ر.س</span>
                            </div>
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <span className="text-gray-600 font-medium">القسط الشهري</span>
                              <span className="text-gray-900 font-bold">{Number(inquireQuery.data.monthlyInstallment).toLocaleString()} ر.س</span>
                            </div>
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <span className="text-gray-600 font-medium">مدة التمويل</span>
                              <span className="text-gray-900 font-bold">{inquireQuery.data.fundingDuration} شهر</span>
                            </div>
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <span className="text-gray-600 font-medium">المبلغ الإجمالي</span>
                              <span className="text-gray-900 font-bold">{Number(inquireQuery.data.totalAmount).toLocaleString()} ر.س</span>
                            </div>
                          </>
                        )}

                        {/* رسوم موافقة التمويل والمتعثرات */}
                        {(inquireQuery.data.approvalFees || inquireQuery.data.arrears) && (
                          <>
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <span className="text-gray-600 font-medium">رسوم موافقة التمويل</span>
                              <span className="text-gray-900 font-bold">{Number(inquireQuery.data.approvalFees).toLocaleString()} ر.س</span>
                            </div>
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <span className="text-gray-600 font-medium">المتعثرات</span>
                              <span className={`font-bold ${Number(inquireQuery.data.arrears) > 0 ? "text-red-600" : "text-gray-900"}`}>
                                {Number(inquireQuery.data.arrears).toLocaleString()} ر.س
                              </span>
                            </div>
                          </>
                        )}

                        {/* الملف المالي */}
                        {inquireQuery.data.financialFile && (
                          <div className="p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors">
                            <span className="text-gray-600 font-medium">الملف المالي / ملاحظات مالية</span>
                            <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded border border-gray-200">
                              {inquireQuery.data.financialFile}
                            </p>
                          </div>
                        )}

                        {/* حالة الطلب */}
                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <span className="text-gray-600 font-medium">حالة الطلب</span>
                          <div className="flex items-center gap-2">
                            {inquireQuery.data.disbursementDate && inquireQuery.data.transactionNumber ? (
                              <div className="flex items-center gap-1 text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-bold">تم الصرف</span>
                              </div>
                            ) : (
                              <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                                inquireQuery.data.status === "approved" ? "text-green-700 bg-green-50 border-green-100" :
                                inquireQuery.data.status === "rejected" ? "text-red-700 bg-red-50 border-red-100" :
                                "text-yellow-700 bg-yellow-50 border-yellow-100"
                              }`}>
                                {getStatusIcon(inquireQuery.data.status)}
                                <span className="font-bold">{getStatusText(inquireQuery.data.status)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* تاريخ نزول المبلغ */}
                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <span className="text-gray-600 font-medium">تاريخ نزول المبلغ</span>
                          <span className="text-gray-900 font-bold">
                            {inquireQuery.data.disbursementDate
                              ? new Date(inquireQuery.data.disbursementDate).toLocaleDateString("ar-SA")
                              : "لم يحدد بعد"}
                          </span>
                        </div>

                        {/* رقم العملية (يظهر فقط إذا وجد) */}
                        {inquireQuery.data.transactionNumber && (
                          <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <span className="text-gray-600 font-medium">رقم العملية</span>
                            <span className="text-blue-600 font-mono font-bold">{inquireQuery.data.transactionNumber}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* معلومات إضافية للمستفيد */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                    <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 leading-relaxed">
                      عزيزي المستفيد، يرجى العلم أن تحديثات الحالة تتم بشكل دوري. في حال وجود أي استفسار، يرجى التواصل مع الدعم الفني برقم الطلب الموضح أعلاه.
                    </p>
                  </div>

                  {/* New Search Button */}
                  <Button
                    onClick={() => {
                      setIdentityNumber("");
                      setRequestNumber("");
                      setHasSearched(false);
                    }}
                    variant="outline"
                    className="w-full border-green-300 text-green-700 hover:bg-green-50 h-12 text-lg"
                  >
                    إجراء استعلام جديد
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
