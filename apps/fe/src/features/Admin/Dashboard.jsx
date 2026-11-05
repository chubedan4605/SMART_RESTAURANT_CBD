import React, { useEffect, useState } from "react";
import { LayoutDashboard, Users, Table2, Wallet } from "lucide-react";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import StatCard from "../../Components/StatCard";
import TopListCard from "../../Components/TopListCard";
import { formatInt, formatVND } from "../../utils/adminFormat";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

import { dashboardApi } from "../../services/dashboardApi";
import { toast } from "react-toastify";

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
}

function buildRange(period) {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (period === "day") {
    start.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    const d = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - d);
    start.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 7);
    end.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(start.getMonth() + 1);
    end.setDate(1);
    end.setHours(0, 0, 0, 0);
  }
  const month = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
  return { from: start.toISOString(), to: end.toISOString(), month };
}

const DarkTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3.5 py-2.5 rounded-none bg-card border border-border shadow-xl font-sans">
        <div className="text-foreground text-xs font-semibold">
          {label}h
        </div>
        <div className="text-gold font-serif text-sm mt-0.5 font-medium">
          {payload[0].value} đơn
        </div>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard();

  useEffect(() => {
    if (!error) return;
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Tải dữ liệu tổng quan thất bại";
    toast.error(msg);
  }, [error]);

  const today = new Date().toLocaleDateString("vi-VN");

  const PERIODS = [
    { value: "day", label: "Ngày" },
    { value: "week", label: "Tuần" },
    { value: "month", label: "Tháng" },
  ];

  const [revenuePeriod, setRevenuePeriod] = useState("month");
  const [ordersDailyPeriod, setOrdersDailyPeriod] = useState("month");
  const [peakHoursPeriod, setPeakHoursPeriod] = useState("week");
  const [popularItemsPeriod, setPopularItemsPeriod] = useState("week");

  const [revenueValue, setRevenueValue] = useState(0);
  const [revenueLoading, setRevenueLoading] = useState(false);

  const [ordersDaily, setOrdersDaily] = useState([]);
  const [ordersDailyLoading, setOrdersDailyLoading] = useState(false);
  const [peakHours, setPeakHours] = useState([]);
  const [peakLoading, setPeakLoading] = useState(false);
  const [popularItems, setPopularItems] = useState([]);
  const [popularLoading, setPopularLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setRevenueLoading(true);
        const r = buildRange(revenuePeriod);

        const res = await dashboardApi.getRevenue({
          period: revenuePeriod,
          from: r.from,
          to: r.to,
        });

        if (cancelled) return;
        setRevenueValue(Number(res?.total || 0));
      } catch (e) {
        if (cancelled) return;
        toast.error(e?.message || "Không tải được doanh thu");
        setRevenueValue(0);
      } finally {
        if (!cancelled) setRevenueLoading(false);
      }
    })();

    return () => (cancelled = true);
  }, [revenuePeriod]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setOrdersDailyLoading(true);
        const r = buildRange(ordersDailyPeriod);

        const res = await dashboardApi.getOrdersDaily({
          from: r.from,
          to: r.to,
        });

        if (cancelled) return;
        setOrdersDaily(res?.series || []);
      } catch (e) {
        toast.error(e?.message || "Không tải được đơn hàng hằng ngày");
        if (cancelled) return;
        setOrdersDaily([]);
      } finally {
        if (!cancelled) setOrdersDailyLoading(false);
      }
    })();

    return () => (cancelled = true);
  }, [ordersDailyPeriod]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setPeakLoading(true);
        const r = buildRange(peakHoursPeriod);

        const res = await dashboardApi.getPeakHours({ from: r.from, to: r.to });

        if (cancelled) return;
        setPeakHours(res?.series || []);
      } catch (e) {
        toast.error(e?.message || "Không tải được khung giờ đông khách");
        if (cancelled) return;
        setPeakHours([]);
      } finally {
        if (!cancelled) setPeakLoading(false);
      }
    })();

    return () => (cancelled = true);
  }, [peakHoursPeriod]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setPopularLoading(true);
        const r = buildRange(popularItemsPeriod);

        const res = await dashboardApi.getPopularItems({
          from: r.from,
          to: r.to,
          limit: 8,
        });

        if (cancelled) return;
        setPopularItems(res?.items || []);
      } catch (e) {
        toast.error(e?.message || "Không tải được món ăn phổ biến");
        if (cancelled) return;
        setPopularItems([]);
      } finally {
        if (!cancelled) setPopularLoading(false);
      }
    })();

    return () => (cancelled = true);
  }, [popularItemsPeriod]);

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6 md:py-8 font-sans selection:bg-gold/30 selection:text-gold">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-gold/15 border border-gold/30">
            <LayoutDashboard className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold font-sans font-semibold text-xs uppercase tracking-luxe">
              Executive Analytics
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground mt-2">
            Tổng Quan Điều Hành{" "}
            <span className="text-gold italic font-normal">
              Le Bistro
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Revenue period selector */}
          <div className="px-3 py-2 rounded-none bg-card border border-border text-foreground text-xs uppercase tracking-luxe min-h-11 flex items-center gap-2">
            <span className="text-muted-foreground">Doanh thu:</span>
            <select
              value={revenuePeriod}
              onChange={(e) => setRevenuePeriod(e.target.value)}
              className="bg-transparent outline-none text-gold font-semibold cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="px-4 py-2 rounded-none bg-card border border-border text-xs uppercase tracking-luxe min-h-11 flex items-center">
            <span className="text-muted-foreground mr-1">Ngày:</span>{" "}
            <span className="text-foreground font-serif text-sm font-medium">{today}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Table2}
          label="Số bàn hiện có"
          value={isLoading ? "—" : formatInt(data?.stats?.totalTables)}
          hint="Tổng số bàn trong sơ đồ nhà hàng"
        />
        <StatCard
          icon={Users}
          label="Tài khoản khách hàng"
          value={isLoading ? "—" : formatInt(data?.stats?.totalUsers)}
          hint="Tổng thành viên đã ghi nhận"
        />
        <StatCard
          icon={Wallet}
          label={
            revenuePeriod === "day"
              ? "Doanh thu trong ngày"
              : revenuePeriod === "week"
                ? "Doanh thu tuần này"
                : "Doanh thu tháng này"
          }
          value={revenueLoading ? "—" : formatVND(revenueValue)}
          hint="Thống kê doanh thu thực tế"
        />
      </div>

      {/* Top Lists */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopListCard
          title="Top 5 món được gọi nhiều nhất"
          subtitle="Tính theo lượt gọi món trong tháng"
          badge="Most Ordered"
          columns={[
            { label: "", span: 2 },
            { label: "Món ăn", span: 7 },
            { label: "Số lượt", span: 3 },
          ]}
          rows={
            isLoading
              ? skeletonRows("orders")
              : (data?.topOrderedDishes || []).slice(0, 5).map((d) => ({
                key: d.id,
                title: d.name,
                subtitle: d.category,
                value: formatInt(d.orders),
                valueHint: "lượt",
              }))
          }
        />

        <TopListCard
          title="Top 5 món được đánh giá cao nhất"
          subtitle="Dựa trên đánh giá và cảm nhận của thực khách"
          badge="Top Rated"
          columns={[
            { label: "", span: 2 },
            { label: "Món ăn", span: 7 },
            { label: "Rating", span: 3 },
          ]}
          rows={
            isLoading
              ? skeletonRows("rating")
              : (data?.topRatedDishes || []).slice(0, 5).map((d) => ({
                key: d.id,
                title: d.name,
                subtitle: d.category,
                value: `${Number(d.rating || 0).toFixed(1)} ★`,
                valueHint: `${formatInt(d.reviews)} reviews`,
              }))
          }
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="rounded-none bg-card text-card-foreground border border-border p-4 sm:p-6 lg:col-span-3 mt-6 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-foreground font-serif text-2xl font-medium">
              Biểu Đồ Phân Tích Hoạt Động
            </div>
            <p className="text-muted-foreground text-xs font-light mt-1">
              Dữ liệu đơn hàng, khung giờ cao điểm và tỷ trọng danh mục món ăn
            </p>
          </div>
          {(ordersDailyLoading || peakLoading || popularLoading) ? (
            <div className="text-xs text-gold font-sans uppercase tracking-luxe">Đang cập nhật biểu đồ...</div>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Orders Daily Line Chart */}
          <div className="rounded-none bg-background border border-border p-4 lg:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-foreground font-serif text-lg font-medium">Số đơn theo ngày</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Theo {PERIODS.find((p) => p.value === ordersDailyPeriod)?.label?.toLowerCase()}
                </div>
              </div>

              <select
                value={ordersDailyPeriod}
                onChange={(e) => setOrdersDailyPeriod(e.target.value)}
                className="px-3 py-1.5 rounded-none bg-card border border-border text-foreground text-xs uppercase tracking-luxe outline-none cursor-pointer"
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 sm:mt-6 h-56 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersDaily}>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    width={26}
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<DarkTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#CAA052"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#CAA052",
                      stroke: "#141416",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Items Pie Chart */}
          <div className="rounded-none bg-background border border-border p-4 lg:col-span-2">
            <div className="flex justify-between gap-3">
              <div>
                <div className="text-foreground font-serif text-lg font-medium">Mặt hàng phổ biến</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Theo {PERIODS.find((p) => p.value === popularItemsPeriod)?.label?.toLowerCase()}
                </div>
              </div>

              <select
                value={popularItemsPeriod}
                onChange={(e) => setPopularItemsPeriod(e.target.value)}
                className="px-3 py-1.5 rounded-none bg-card border border-border text-foreground text-xs uppercase tracking-luxe outline-none cursor-pointer"
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularItems}
                    dataKey="quantity"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                    labelLine={false}
                    label={({ percent }) => `${Math.round(percent * 100)}%`}
                  >
                    {popularItems.map((item, index) => (
                      <Cell
                        key={`cell-${item.name}-${index}`}
                        fill={stringToColor(item.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card, #1c1c1f)",
                      borderColor: "var(--color-border, #2a2a2e)",
                      borderRadius: 0,
                      color: "var(--color-foreground, #fff)",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{
                      fontSize: 11,
                      color: "#a1a1aa",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peak Hours Bar Chart */}
          <div className="rounded-none bg-background border border-border p-4 lg:col-span-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-foreground font-serif text-lg font-medium">Khung Giờ Cao Điểm</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Lượng đơn theo giờ (0h – 23h) • Theo {PERIODS.find((p) => p.value === peakHoursPeriod)?.label?.toLowerCase()}
                </div>
              </div>

              <select
                value={peakHoursPeriod}
                onChange={(e) => setPeakHoursPeriod(e.target.value)}
                className="px-3 py-1.5 rounded-none bg-card border border-border text-foreground text-xs uppercase tracking-luxe outline-none cursor-pointer"
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 h-56 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHours} barSize={14}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.05)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(h) => `${h}h`}
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    width={26}
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="orders" fill="#CAA052" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function skeletonRows(type) {
  return Array.from({ length: 5 }).map((_, i) => ({
    key: `${type}-${i}`,
    title: "Đang tải dữ liệu...",
    subtitle: "—",
    value: "—",
    valueHint: "",
  }));
}
