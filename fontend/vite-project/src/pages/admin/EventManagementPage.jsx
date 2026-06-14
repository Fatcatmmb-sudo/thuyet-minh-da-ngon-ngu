import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Toast, { useToast } from "../../components/Toast/Toast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import eventService from "../../services/eventService";
import "./EventManagementPage.css";

// ─── Icons ────────────────────────────────────────────────────
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconEdit = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconTrash = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>;
const IconUpload = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconChevron = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>;
const IconImage = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;

// ─── Helpers ──────────────────────────────────────────────────
function getStatusInfo(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return { label: "Sắp tới", cls: "em-badge--upcoming" };
  if (now > end) return { label: "Đã kết thúc", cls: "em-badge--ended" };
  return { label: "Đang mở", cls: "em-badge--active" };
}

function formatDateRange(start, end) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

// ─── Form mặc định ────────────────────────────────────────────
const EMPTY_FORM = {
  name: "", description: "", location: "",
  startDate: "", endDate: "", logoFile: null, logoPreview: "",
};

// ─── Main Page ────────────────────────────────────────────────
export default function EventManagementPage() {
  const navigate = useNavigate();
  const { toasts, showToast } = useToast();

  // ── State danh sách ────────────────────────────────────────
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 10;

  // ── State form ─────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // ── State xóa ──────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  // ── Fetch danh sách ────────────────────────────────────────
const fetchEvents = useCallback(() => {
    setLoading(true);
    eventService
      .getAll({ page, search, status: statusFilter, pageSize: PAGE_SIZE })
      .then((res) => {
        setEvents(res.items ?? []);
        setTotalPages(res.totalPages ?? 1);
        setTotal(res.total ?? 0);
      })
      .catch((err) => showToast(err.message || "Không thể tải danh sách sự kiện.", "error"))
      .finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Reset về trang 1 khi đổi filter
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  // ── Mở form tạo mới ────────────────────────────────────────
  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowForm(true);
  }

  // ── Mở form sửa ────────────────────────────────────────────
  function openEdit(ev) {
    setEditingId(ev.id);
    setForm({
      name: ev.name ?? "",
      description: ev.description ?? "",
      location: ev.location ?? "",
      startDate: ev.startDate ? ev.startDate.slice(0, 10) : "",
      endDate: ev.endDate ? ev.endDate.slice(0, 10) : "",
      logoFile: null,
      logoPreview: ev.logoUrl ?? "",
    });
    setFormErrors({});
    setShowForm(true);
  }

  // ── Đóng form ──────────────────────────────────────────────
  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }

  // ── Xử lý thay đổi input ───────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // ── Xử lý upload logo ──────────────────────────────────────
  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Logo không được vượt quá 5MB.", "error");
      return;
    }
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, logoFile: file, logoPreview: preview }));
  }

  // ── Validate form ──────────────────────────────────────────
  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = "Vui lòng nhập tên sự kiện.";
    if (!form.location.trim()) errors.location = "Vui lòng nhập địa điểm.";
    if (!form.startDate) errors.startDate = "Vui lòng chọn ngày bắt đầu.";
    if (!form.endDate) errors.endDate = "Vui lòng chọn ngày kết thúc.";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu.";
    return errors;
  }

  // ── Submit form ────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      if (form.logoFile) formData.append("logo", form.logoFile);

      if (editingId) {
        await eventService.update(editingId, formData);
        showToast("Cập nhật sự kiện thành công!", "success");
      } else {
        await eventService.create(formData);
        showToast("Tạo sự kiện thành công!", "success");
      }
      closeForm();
      fetchEvents();
    } catch (err) {
      showToast(err.message || "Có lỗi xảy ra, vui lòng thử lại.", "error");
    } finally {
      setSaving(false);
    }
  }

  // ── Xóa sự kiện ────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await eventService.delete(deleteTarget.id);
      showToast(`Đã xóa sự kiện "${deleteTarget.name}".`, "success");
      setDeleteTarget(null);
      fetchEvents();
    } catch (err) {
      showToast(err.message || "Không thể xóa sự kiện này.", "error");
      setDeleteTarget(null);
    }
  }

  // ── Pagination ─────────────────────────────────────────────
  const startItem = (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, total);

  return (
    <Layout>
      <div className="em-page">
        <Toast toasts={toasts} />

        {/* ── Header ── */}
        <div className="em-header">
          <div className="em-header__left">
            <button className="em-back-btn" onClick={() => navigate("/admin/dashboard")}>
              <IconChevron style={{ transform: "rotate(180deg)" }} /> Dashboard
            </button>
            <h1 className="em-title">Quản lý sự kiện</h1>
          </div>
          <button className="em-btn em-btn--primary" onClick={openCreate}>
            <IconPlus /> Tạo sự kiện
          </button>
        </div>

        {/* ── Toolbar: tìm kiếm + filter ── */}
        <div className="em-toolbar">
          <div className="em-search">
            <IconSearch />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="em-filter-tabs">
            {[
              { value: "", label: "Tất cả" },
              { value: "active", label: "Đang mở" },
              { value: "upcoming", label: "Sắp tới" },
              { value: "ended", label: "Đã kết thúc" },
            ].map((tab) => (
              <button
                key={tab.value}
                className={`em-filter-tab ${statusFilter === tab.value ? "em-filter-tab--active" : ""}`}
                onClick={() => setStatusFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bảng danh sách ── */}
        <div className="em-card">
          {loading ? (
            <div className="em-skeleton-list">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="em-skeleton-row" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="em-empty">
              <p>Không có sự kiện nào.</p>
            </div>
          ) : (
            <table className="em-table">
              <thead>
                <tr>
                  <th>Tên sự kiện</th>
                  <th>Địa điểm</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const status = getStatusInfo(ev.startDate, ev.endDate);
                  return (
                    <tr key={ev.id}>
                      <td>
                        <div className="em-event-name">
                          {ev.logoUrl
                            ? <img src={ev.logoUrl} alt={ev.name} className="em-event-logo" />
                            : <div className="em-event-logo em-event-logo--placeholder"><IconImage /></div>
                          }
                          <span>{ev.name}</span>
                        </div>
                      </td>
                      <td className="em-location">{ev.location}</td>
                      <td className="em-date">{formatDateRange(ev.startDate, ev.endDate)}</td>
                      <td>
                        <span className={`em-badge ${status.cls}`}>{status.label}</span>
                      </td>
                      <td>
                        <div className="em-actions">
                          <button
                            className="em-action-btn em-action-btn--edit"
                            title="Sửa"
                            onClick={() => openEdit(ev)}
                          >
                            <IconEdit />
                          </button>
                          <button
                            className="em-action-btn em-action-btn--delete"
                            title="Xóa"
                            onClick={() => setDeleteTarget({ id: ev.id, name: ev.name })}
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* ── Pagination ── */}
          {!loading && total > 0 && (
            <div className="em-pagination">
              <span className="em-pagination__info">
                Hiển thị {startItem}–{endItem} / {total}
              </span>
              <div className="em-pagination__pages">
                <button
                  className="em-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <IconChevron style={{ transform: "rotate(180deg)" }} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`em-page-btn ${p === page ? "em-page-btn--active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="em-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <IconChevron />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Form tạo / sửa ── */}
        {showForm && (
          <div className="em-overlay" onClick={closeForm}>
            <div className="em-modal" onClick={(e) => e.stopPropagation()}>

              {/* Header modal */}
              <div className="em-modal__header">
                <h2>{editingId ? "Sửa sự kiện" : "Tạo sự kiện mới"}</h2>
                <button className="em-modal__close" onClick={closeForm}>
                  <IconX />
                </button>
              </div>

              {/* Body modal */}
              <form className="em-form" onSubmit={handleSubmit}>

                {/* Tên sự kiện */}
                <div className={`em-field ${formErrors.name ? "em-field--error" : ""}`}>
                  <label>Tên sự kiện <span className="em-required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập tên sự kiện..."
                    maxLength={200}
                  />
                  {formErrors.name && <p className="em-field__error">{formErrors.name}</p>}
                </div>

                {/* Mô tả */}
                <div className="em-field">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả ngắn về sự kiện..."
                    rows={3}
                  />
                </div>

                {/* Địa điểm */}
                <div className={`em-field ${formErrors.location ? "em-field--error" : ""}`}>
                  <label>Địa điểm <span className="em-required">*</span></label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Nhập địa điểm tổ chức..."
                  />
                  {formErrors.location && <p className="em-field__error">{formErrors.location}</p>}
                </div>

                {/* Ngày */}
                <div className="em-field-row">
                  <div className={`em-field ${formErrors.startDate ? "em-field--error" : ""}`}>
                    <label>Ngày bắt đầu <span className="em-required">*</span></label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                    />
                    {formErrors.startDate && <p className="em-field__error">{formErrors.startDate}</p>}
                  </div>
                  <div className={`em-field ${formErrors.endDate ? "em-field--error" : ""}`}>
                    <label>Ngày kết thúc <span className="em-required">*</span></label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                    />
                    {formErrors.endDate && <p className="em-field__error">{formErrors.endDate}</p>}
                  </div>
                </div>

                {/* Upload logo */}
                <div className="em-field">
                  <label>Logo sự kiện</label>
                  <label className="em-upload">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleLogoChange}
                    />
                    {form.logoPreview ? (
                      <div className="em-upload__preview">
                        <img src={form.logoPreview} alt="Logo preview" />
                        <span>Nhấn để đổi logo</span>
                      </div>
                    ) : (
                      <div className="em-upload__placeholder">
                        <IconUpload />
                        <p>Kéo thả hoặc nhấn để upload logo</p>
                        <span>JPG, PNG, WebP – tối đa 5MB</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Footer */}
                <div className="em-form__footer">
                  <button type="button" className="em-btn em-btn--outline" onClick={closeForm}>
                    Hủy
                  </button>
                  <button type="submit" className="em-btn em-btn--primary" disabled={saving}>
                    {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo sự kiện"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Confirm xóa ── */}
        {deleteTarget && (
          <ConfirmDialog
            title="Xóa sự kiện"
            message={`Bạn có chắc muốn xóa sự kiện "${deleteTarget.name}"? Hành động này không thể hoàn tác.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </div>
    </Layout>

  );
}