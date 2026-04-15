import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Lock, User, Key, ArrowRight, ExclamationCircle } from "lucide-react";
import BackgroundSVG from "@/components/BackgroundSVG";

type LoginState = "idle" | "loading" | "success" | "error";

export default function Login() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // التحقق إذا كان المستخدم مسجل دخول بالفعل
  if (isAuthenticated && user) {
    navigate("/admin");
    return null;
  }

  const isFormValid = username.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMessage("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setLoginState("loading");
    setErrorMessage("");

    try {
      // محاكاة عملية تسجيل الدخول
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // بيانات الدخول التجريبية (admin / password123)
      if (username === "admin" && password === "password123") {
        setLoginState("success");
        
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("username", username);
        }

        toast.success("تم تسجيل الدخول بنجاح");
        
        setTimeout(() => {
          navigate("/admin");
        }, 800);
      } else {
        setLoginState("error");
        setErrorMessage("اسم المستخدم أو كلمة المرور غير صحيحة");
        toast.error("بيانات الدخول غير صحيحة");
      }
    } catch (error) {
      setLoginState("error");
      setErrorMessage("حدث خطأ أثناء تسجيل الدخول");
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col font-tajawal bg-[#f8faf9]" 
      dir="rtl"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
        .font-tajawal { font-family: 'Tajawal', sans-serif; }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

      {/* Background SVG */}
      <BackgroundSVG />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header Logo Placeholder (optional) */}
        <header className="p-8">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">ريف</span>
                </div>
              </div>
              <span className="text-2xl font-black text-[#006838]">بوابة ريف</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-green-800 hover:bg-green-50"
            >
              العودة للرئيسية <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            {/* Page Title */}
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-4xl font-black text-[#006838]">تسجيل الدخول</h1>
              <p className="text-gray-600 text-lg">أدخل بيانات حسابك للوصول إلى لوحة الإدارة</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-[24px] shadow-2xl p-8 border border-gray-100 animate-scale-in">
              {/* Icon */}
              <div className="flex flex-col items-center mb-8 border-b border-gray-100 pb-6">
                <div className="w-16 h-16 bg-[#006838] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-900/20">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">مرحباً بك</h2>
                <p className="text-gray-500">سجل دخولك للوصول إلى لوحة الإدارة</p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                  <ExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700 font-medium">{errorMessage}</span>
                </div>
              )}

              {loginState !== "success" ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username */}
                  <div className="space-y-3">
                    <Label className="text-right block font-bold text-gray-700">اسم المستخدم</Label>
                    <div className="relative group">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#006838] transition-colors" />
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="أدخل اسم المستخدم"
                        className="h-14 pr-12 text-lg rounded-xl border-2 border-gray-100 focus:border-[#006838] focus:ring-0 transition-all bg-gray-50/50"
                        disabled={loginState === "loading"}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-3">
                    <Label className="text-right block font-bold text-gray-700">كلمة المرور</Label>
                    <div className="relative group">
                      <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#006838] transition-colors" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        className="h-14 pr-12 text-lg rounded-xl border-2 border-gray-100 focus:border-[#006838] focus:ring-0 transition-all bg-gray-50/50"
                        disabled={loginState === "loading"}
                      />
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-end gap-3">
                    <Label htmlFor="rememberMe" className="text-sm font-bold text-gray-600 cursor-pointer">تذكرني</Label>
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={loginState === "loading"}
                      className="w-5 h-5 rounded border-2 border-gray-200 data-[state=checked]:bg-[#006838] data-[state=checked]:border-[#006838]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-xl font-bold bg-[#006838] hover:bg-[#005a30] rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-[0.98]"
                    disabled={loginState === "loading" || !isFormValid}
                  >
                    {loginState === "loading" ? (
                      <>
                        <Loader2 className="w-6 h-6 ml-2 animate-spin" />
                        جاري التحقق...
                      </>
                    ) : (
                      "تسجيل الدخول"
                    )}
                  </Button>
                </form>
              ) : (
                /* Success Message */
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 scale-up-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-green-700">تم تسجيل الدخول بنجاح</h3>
                  <p className="text-gray-500 font-medium">جاري التحويل إلى لوحة الإدارة...</p>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="p-8 text-center text-gray-500 text-sm font-medium">
          © 2026 بوابة ريف السعودي. جميع الحقوق محفوظة.
        </footer>
      </div>
    </div>
  );
}
