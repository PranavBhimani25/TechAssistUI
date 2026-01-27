import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { createTicket } from "../../services/ticketService";
import { getProducts } from "../../services/commonService";
import { toast } from "react-hot-toast";

const PRIORITIES = ["Low", "Medium", "High"];

export default function CreateTicket() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    productId: "",
    priority: "Medium",
    image: null,
  });
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // fetch products for dropdown
  useEffect(() => {
    (async () => {
      try {
        const list = await getProducts();
        setProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const onSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!form.productId) return toast.error("Please select a product");
    if (!PRIORITIES.includes(form.priority)) return toast.error("Invalid priority");

    const payload = new FormData();
    payload.append("Title", form.title.trim());
    payload.append("Description", form.description.trim());
    payload.append("ProductId", form.productId);
    payload.append("Priority", form.priority);

    if (form.image) {
      payload.append("Image", form.image);
    }

    setSubmitting(true);
    try {
      const created = await createTicket(payload);
      toast.success("Ticket created successfully");
      toast.info(`Ticket ID: ${created.id}`);
      // Reset or redirect
      setForm({ title: "", description: "", productId: "", priority: "Medium",image: null });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to create ticket";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const titleCount = form.title.length;
  const descCount = form.description.length;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-blue-400">
          Create New Ticket
        </h1>

        <form
          onSubmit={onSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
        >
          {/* Title */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm text-gray-300 mb-1">Title</label>
              <span className="text-xs text-gray-500">{titleCount}/120</span>
            </div>
            <input
              name="title"
              maxLength={120}
              value={form.title}
              onChange={onChange}
              placeholder="Brief summary (e.g., Printer not working)"
              className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-200"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <span className="text-xs text-gray-500">{descCount}/2000</span>
            </div>
            <textarea
              name="description"
              rows={6}
              maxLength={2000}
              value={form.description}
              onChange={onChange}
              placeholder="Describe the issue, steps to reproduce, any error messages..."
              className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-200"
            />
            <p className="text-xs text-gray-400 mt-1">
              Tip: Include screenshots or error codes if possible.
            </p>
          </div>

          {/* Product + Priority */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Product</label>
              <select
                name="productId"
                value={form.productId}
                onChange={onChange}
                disabled={loadingProducts}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-200"
              >
                <option value="" disabled>
                  {loadingProducts ? "Loading..." : "Select a product"}
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name || p.productName || `Product #${p.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={onChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-200"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Attachment</label>
              <input className="file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.image ? form.image.name : "Upload an image related to the issue."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                setForm({ title: "", description: "", productId: "", priority: "Medium" })
              }
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
