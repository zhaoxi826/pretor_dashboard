import React, { useState } from 'react';
import apiClient from '../../api/client';
import { Shield } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (token: string, username: string) => void;
}

export function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isLoginView) {
        const res = await apiClient.post('/api/v1/auth/login', {
          user_name: formData.username,
          password: formData.password
        });
        if (res.data && res.data.token) {
          onLoginSuccess(res.data.token, formData.username);
        } else {
          setError('登录失败，未获取到 token');
        }
      } else {
        await apiClient.post('/api/v1/auth/register', {
          user_name: formData.username,
          password: formData.password
        });
        setSuccessMsg('注册成功，请等待管理员审批后登录！');
        setIsLoginView(true);
        setFormData({ username: '', password: '' });
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(
        errorMessage ||
        (isLoginView ? '登录失败，请检查用户名和密码' : '注册失败，可能用户名已存在')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Shield size={24} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          {isLoginView ? '欢迎登录 Pretor' : '注册 Pretor 账号'}
        </h2>
        <p className="text-sm text-center text-slate-500 mb-8">
          {isLoginView ? '请输入您的账号信息进行登录' : '创建您的账号以使用系统'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">用户名</label>
            <input
              type="text"
              name="username"
              placeholder="请输入用户名"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">密码</label>
            <input
              type="password"
              name="password"
              placeholder="请输入密码"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer disabled:opacity-70 mt-6"
          >
            {loading ? '处理中...' : isLoginView ? '登 录' : '注 册'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isLoginView ? (
            <>
              还没有账号？{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(false);
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-blue-600 hover:underline font-medium cursor-pointer"
              >
                立即注册
              </button>
            </>
          ) : (
            <>
              已有账号？{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(true);
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-blue-600 hover:underline font-medium cursor-pointer"
              >
                返回登录
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
