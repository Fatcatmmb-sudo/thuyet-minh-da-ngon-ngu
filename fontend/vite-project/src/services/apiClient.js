// ─── Base API Client ──────────────────────────────────────────
// Tất cả service đều dùng file này để gọi HTTP.
// Tự động đính kèm JWT token + xử lý lỗi tập trung.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(method, path, body = null) {
  const token = localStorage.getItem("token");

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  // Token hết hạn → về login
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  // Lỗi server
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

const apiClient = {
  get:    (path)              => request("GET",    path),
  post:   (path, body)        => request("POST",   path, body),
  put:    (path, body)        => request("PUT",    path, body),
  patch:  (path, body)        => request("PATCH",  path, body),
  delete: (path)              => request("DELETE", path),
};

export default apiClient;