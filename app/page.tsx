"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Page = {
  id: number;
  title: string;
  content: string | null;
};

export default function Home() {
  const [pages, setPages] = useState<Page[]>([]);
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setPages(data);
        setActivePage(data[0]);
      } else {
        createInitialPage();
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createInitialPage() {
    const { data, error } = await supabase
      .from("pages")
      .insert([{ title: "🚀 Trang chủ iami", content: "Chào mừng bạn đến với không gian ghi chú đám mây!" }])
      .select();

    if (!error && data) {
      setPages(data);
      setActivePage(data[0]);
    }
  }

  const addNewPage = async () => {
    const newTitle = `Trang mới (${pages.length + 1})`;
    const { data, error } = await supabase
      .from("pages")
      .insert([{ title: newTitle, content: "Nhập nội dung ghi chú tại đây..." }])
      .select();

    if (error) {
      alert("Lỗi khi thêm trang mới!");
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      setPages([...pages, data[0]]);
      setActivePage(data[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Đang kết nối tới dữ liệu iami...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <span className="font-bold text-lg text-indigo-600 tracking-wider">iami</span>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Cloud</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Danh sách trang
          </div>
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setActivePage(page)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage?.id === page.id
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {page.title}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-gray-200">
          <button 
            onClick={addNewPage}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>➕</span> Thêm trang mới
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white overflow-y-auto">
        <header className="h-14 border-b border-gray-100 flex items-center px-8 justify-between">
          <span className="text-sm text-gray-400">Không gian làm việc / {activePage?.title}</span>
          <div className="text-sm text-green-600 font-medium">Đã đồng bộ Cloud</div>
        </header>

        <div className="max-w-3xl w-full mx-auto px-8 py-12 flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{activePage?.title}</h1>
          <p className="text-gray-600 mb-4 whitespace-pre-wrap">
            {activePage?.content}
          </p>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 mt-8">
            Khu vực soạn thảo nội dung (Block Editor)
          </div>
        </div>
      </main>
    </div>
  );
}