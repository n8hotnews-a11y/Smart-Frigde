import React, { useState } from 'react';
import { signUp, signIn } from '../services/firebaseService';

const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      // On success, the onAuthChange listener in App.tsx will handle the redirect.
    } catch (err: any) {
      // Map Firebase error codes to user-friendly messages
      let message = "Đã xảy ra lỗi. Vui lòng thử lại.";
      if (err.code === "auth/email-already-in-use") {
        message = "Email này đã được sử dụng. Vui lòng đăng nhập.";
      } else if (err.code === "auth/invalid-email") {
        message = "Địa chỉ email không hợp lệ.";
      } else if (err.code === "auth/weak-password") {
        message = "Mật khẩu phải có ít nhất 6 ký tự.";
      } else if (err.code === "auth/invalid-credential") {
        message = "Email hoặc mật khẩu không chính xác.";
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600">Bếp AI</h1>
          <p className="text-stone-600 mt-2">Trợ lý dinh dưỡng thông minh của bạn</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-6">
            {isSignUp ? 'Tạo tài khoản mới' : 'Đăng nhập'}
          </h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-r-lg text-sm" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-300"
            >
              {isLoading ? 'Đang xử lý...' : (isSignUp ? 'Đăng ký' : 'Đăng nhập')}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-sm text-stone-600 hover:text-orange-600 hover:underline"
          >
            {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
