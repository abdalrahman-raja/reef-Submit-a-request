import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b border-green-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ريف</span>
            </div>
            <h1 className="text-2xl font-bold text-green-700">بوابة ريف السعودي</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/check-status")}
              className="text-green-700 hover:bg-green-50"
            >
              تحقق من حالة الطلب
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin")}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  لوحة التحكم
                </Button>
              </>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate("/login")}
              >
                تسجيل الدخول
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Hero Section */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              منصة ريف السعودي
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              منصة موثوقة لإدارة طلبات التمويل والتحقق من حالتها بسهولة وسرعة.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate("/check-status")}
              >
                تحقق من طلبك الآن
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => navigate("/login")}
                >
                  دخول المشرفين
                </Button>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-700">تتبع الطلبات</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                تابع حالة طلبك في الوقت الفعلي باستخدام رقم الهوية ورقم الطلب
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-amber-700">معلومات شاملة</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                احصل على كل التفاصيل المتعلقة بطلبك والمبالغ المصروفة
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-700">آمن وموثوق</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                نظام آمن يحافظ على خصوصية بيانات المستفيدين
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white border border-green-200 rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-green-800 mb-4">كيفية الاستخدام</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-700 font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">أدخل بيانات الطلب</h4>
              <p className="text-sm text-gray-600">
                أدخل رقم الهوية ورقم الطلب الخاص بك
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-amber-700 font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">ابحث عن طلبك</h4>
              <p className="text-sm text-gray-600">
                اضغط على زر البحث للعثور على طلبك
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-700 font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">عرض التفاصيل</h4>
              <p className="text-sm text-gray-600">
                اعرض جميع تفاصيل طلبك والحالة الحالية
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 mt-12">
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
