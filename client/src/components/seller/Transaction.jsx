import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ fix autoTable import

const Badge = ({ text }) => {
  const lower = (text || "").toLowerCase();
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
  if (lower.includes("completed") || lower.includes("success")) {
    return <span className={`${base} bg-green-100 text-green-800`}>{text}</span>;
  }
  if (lower.includes("expired") || lower.includes("cancel")) {
    return <span className={`${base} bg-red-100 text-red-800`}>{text}</span>;
  }
  if (lower.includes("pending")) {
    return <span className={`${base} bg-yellow-100 text-yellow-800`}>{text}</span>;
  }
  return <span className={`${base} bg-gray-100 text-gray-800`}>{text}</span>;
};

const Transactions = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({ period: "" });
  const [sort, setSort] = useState("desc");
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { page, limit, sort, status: "Completed" }; // ✅ hanya ambil Completed
      if (dateRange.period) params.period = dateRange.period;

      const res = await axios.get("/api/order/transactions", { params });
      if (res.data?.success) {
        setRows(res.data.data || []);
        setTotalPages(res.data.meta?.totalPages || 1);
        setTotalRevenue(res.data.meta?.totalRevenue || 0);
      } else {
        setRows([]);
        setTotalRevenue(0);
      }
    } catch (err) {
      console.error(err);
      setRows([]);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, dateRange, sort]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value || 0);

  // ✅ Generate PDF
  const generatePDF = () => {
    console.log("generatePDF() dijalankan ✅");
    if (!rows || rows.length === 0) {
      alert("Tidak ada data transaksi untuk dicetak.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Laporan Transaksi (Completed)", 14, 15);
    doc.setFontSize(10);
    doc.text(`Periode: ${dateRange.period || "Semua waktu"}`, 14, 22);
    doc.text(`Total Pendapatan: ${formatCurrency(totalRevenue)}`, 14, 28);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleString("id-ID")}`, 14, 34);

    const tableColumn = [
      "Tanggal",
      "Order ID",
      "Tipe",
      "Channel",
      "Status",
      "Jumlah",
      "Customer",
    ];
    const tableRows = rows.map((r) => [
      new Date(r.createdAt).toLocaleString("id-ID"),
      r.orderId,
      r.transactionType,
      r.channel,
      r.status,
      formatCurrency(r.amount),
      r.customerEmail || r.customerName || "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("Laporan_Transaksi_Completed.pdf");
  };

  return (
    <div className="p-6">
      {/* Header + total pendapatan */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Transaksi</h2>

        <div className="text-right">
          <p className="text-sm text-gray-600">
            Total Pendapatan{" "}
            {dateRange.period ? `(${dateRange.period})` : "(Semua)"}:
          </p>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </p>

          {/* ✅ Tombol Download PDF */}
          <button
            onClick={() => {
              console.log("Tombol PDF diklik ✅");
              generatePDF();
            }}
            className="mt-2 bg-green-600 text-white text-sm px-4 py-1.5 rounded hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div className="flex gap-3 flex-wrap">
          {/* 🔥 Filter periode */}
          <select
            value={dateRange.period}
            onChange={(e) => {
              const val = e.target.value;
              setDateRange({ period: val });
              setPage(1);
            }}
            className="border rounded px-3 py-1"
          >
            <option value="">All Time</option>
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="shadow rounded-lg overflow-x-auto bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Waktu & Tanggal</th>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Tipe Transaksi</th>
              <th className="px-6 py-3 text-left">Metode</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Harga</th>
              <th className="px-6 py-3 text-left">Pembeli</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  No transactions found
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.orderId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">
                    {new Date(r.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-6 py-3 font-mono text-xs">{r.orderId}</td>
                  <td className="px-6 py-3">{r.transactionType}</td>
                  <td className="px-6 py-3">{r.channel}</td>
                  <td className="px-6 py-3">
                    <Badge text={r.status} />
                  </td>
                  <td className="px-6 py-3 text-right font-semibold">
                    {formatCurrency(r.amount)}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {r.customerEmail || r.customerName || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {page} / {totalPages}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
