'use client';

import { useEffect, useState } from 'react';
import { AdminTopbar } from '@/features/admin';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import {
  Eye, TrendingUp, Users, Monitor, Smartphone, Tablet,
  Globe, ArrowUpRight,
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface NameCount {
  name: string;
  count: number;
}

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  uniqueVisitors: number;
  chartData: { date: string; count: number }[];
  topPages: { path: string; count: number }[];
  devices: NameCount[];
  browsers: NameCount[];
  os: NameCount[];
  referrers: NameCount[];
}

/* ─── Shared Styles ───────────────────────────────────────────────────────── */

const cardStyle: React.CSSProperties = {
  background: 'var(--admin-bg-card)',
  borderRadius: '12px',
  boxShadow: 'var(--admin-shadow)',
  padding: '24px',
  transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
  position: 'relative',
  overflow: 'hidden',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-outfit), sans-serif',
  fontSize: '1rem',
  color: 'var(--admin-text-primary)',
  fontWeight: 600,
  margin: '0 0 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const labelSmall: React.CSSProperties = {
  fontSize: '0.6875rem',
  color: 'var(--admin-text-secondary)',
  fontFamily: 'var(--font-outfit), sans-serif',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  margin: '0 0 8px',
};

const valueBig: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  color: 'var(--admin-text-primary)',
  fontFamily: 'var(--font-outfit), sans-serif',
  margin: 0,
  lineHeight: 1,
};

/* ─── Color Palettes ──────────────────────────────────────────────────────── */

const DEVICE_COLORS: Record<string, string> = {
  Desktop: '#C8A97E',
  Mobile: '#60A5FA',
  Tablet: '#34D399',
  Unknown: '#9CA3AF',
};

const BROWSER_COLORS: Record<string, string> = {
  Chrome: '#4285F4',
  Safari: '#06B6D4',
  Firefox: '#FF7139',
  Edge: '#0078D7',
  Opera: '#FF1B2D',
  Samsung: '#1428A0',
  Brave: '#FB542B',
  Vivaldi: '#EF3939',
  Yandex: '#FF0000',
  IE: '#0076D6',
  Other: '#9CA3AF',
};

const OS_COLORS: Record<string, string> = {
  Windows: '#0078D4',
  macOS: '#A78BFA',
  Android: '#3DDC84',
  iOS: '#FF6B6B',
  iPadOS: '#FF9500',
  Linux: '#FCC624',
  'Chrome OS': '#4285F4',
  Other: '#9CA3AF',
};

const PIE_COLORS = ['#C8A97E', '#60A5FA', '#34D399', '#F472B6', '#A78BFA', '#F59E0B', '#06B6D4', '#EF4444'];

/* ─── Device Icon ─────────────────────────────────────────────────────────── */

function DeviceIcon({ name, size = 16 }: { name: string; size?: number }) {
  switch (name) {
    case 'Mobile': return <Smartphone size={size} />;
    case 'Tablet': return <Tablet size={size} />;
    case 'Desktop': return <Monitor size={size} />;
    default: return <Globe size={size} />;
  }
}

/* ─── Horizontal Bar ──────────────────────────────────────────────────────── */

function HorizontalBarItem({
  name,
  count,
  total,
  color,
  icon,
}: {
  name: string;
  count: number;
  total: number;
  color: string;
  icon?: React.ReactNode;
}) {
  const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
  return (
    <div style={{ marginBottom: '14px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && <span style={{ color, opacity: 0.8, display: 'flex' }}>{icon}</span>}
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--admin-text-primary)',
              fontFamily: 'var(--font-outfit), sans-serif',
              fontWeight: 500,
            }}
          >
            {name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--admin-text-secondary)',
              fontFamily: 'var(--font-outfit), sans-serif',
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontSize: '0.6875rem',
              color,
              fontFamily: 'var(--font-outfit), sans-serif',
              fontWeight: 600,
              minWidth: '42px',
              textAlign: 'right',
            }}
          >
            {pct}%
          </span>
        </div>
      </div>
      <div
        style={{
          height: '6px',
          borderRadius: '3px',
          background: 'var(--admin-hover-bg)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: '3px',
            background: `linear-gradient(90deg, ${color}, ${color}CC)`,
            transition: 'width 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
      </div>
    </div>
  );
}

/* ─── Custom Pie Label ────────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderPieLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (!percent || percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = (innerRadius ?? 0) + ((outerRadius ?? 0) - (innerRadius ?? 0)) * 0.5;
  const x = (cx ?? 0) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = (cy ?? 0) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="11"
      fontWeight="600"
      fontFamily="var(--font-outfit)"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchData = (d: number) => {
    setIsLoading(true);
    fetch(`/api/admin/analytics?days=${d}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setData(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const totalDevices = data?.devices.reduce((s, d) => s + d.count, 0) ?? 0;
  const totalBrowsers = data?.browsers.reduce((s, b) => s + b.count, 0) ?? 0;
  const totalOS = data?.os.reduce((s, o) => s + o.count, 0) ?? 0;
  const totalReferrers = data?.referrers.reduce((s, r) => s + r.count, 0) ?? 0;

  return (
    <>
      <AdminTopbar title="Website Analytics" subtitle="Statistik pengunjung, device, browser & sumber traffic" />
      <div className="p-4 md:p-8">

        {/* ─── Controls ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[7, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--admin-border)',
                  background: days === d
                    ? 'linear-gradient(135deg, rgba(200,169,126,0.15), rgba(200,169,126,0.05))'
                    : 'var(--admin-bg-card)',
                  color: days === d ? '#C8A97E' : 'var(--admin-text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: days === d ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  transition: 'all 0.2s',
                  borderColor: days === d ? 'rgba(200,169,126,0.3)' : 'var(--admin-border)',
                }}
              >
                {d} Hari
              </button>
            ))}
          </div>
        </div>

        {isLoading && !data ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...cardStyle, height: '120px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : data ? (
          <>
            {/* ─── Stat Cards ──────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              {[
                {
                  label: 'Total Kunjungan',
                  value: data.totalViews,
                  sub: `Selama ${days} hari`,
                  icon: <Eye size={28} />,
                  color: '#C8A97E',
                },
                {
                  label: 'Hari Ini',
                  value: data.todayViews,
                  sub: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }),
                  icon: <TrendingUp size={28} />,
                  color: '#34D399',
                },
                {
                  label: 'Unique Visitors',
                  value: data.uniqueVisitors,
                  sub: `Dari ${data.totalViews} views`,
                  icon: <Users size={28} />,
                  color: '#60A5FA',
                },
              ].map((card) => (
                <div
                  key={card.label}
                  style={{ ...cardStyle, cursor: 'default' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--admin-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '80px',
                      height: '80px',
                      background: `radial-gradient(circle at top right, ${card.color}15, transparent)`,
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <p style={labelSmall}>{card.label}</p>
                      <p style={valueBig}>{card.value.toLocaleString('id-ID')}</p>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: card.color,
                          margin: '6px 0 0',
                          fontFamily: 'var(--font-outfit), sans-serif',
                        }}
                      >
                        {card.sub}
                      </p>
                    </div>
                    <span style={{ opacity: 0.5, color: card.color }}>{card.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Visitor Chart ────────────────────────────────── */}
            <div style={{ ...cardStyle, marginBottom: '24px' }}>
              <h3 style={sectionTitleStyle}>
                <TrendingUp size={18} style={{ color: '#C8A97E' }} />
                Grafik Pengunjung
              </h3>
              <div style={{ width: '100%', height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C8A97E" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#C8A97E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit)' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--admin-bg-card)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        fontFamily: 'var(--font-outfit)',
                        fontSize: '0.8125rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      }}
                      labelStyle={{ color: 'var(--admin-text-primary)', fontWeight: 600 }}
                      itemStyle={{ color: '#C8A97E' }}
                      cursor={{ stroke: 'var(--admin-border)', strokeWidth: 2, strokeDasharray: '5 5' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Views"
                      stroke="#C8A97E"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#C8A97E', strokeWidth: 0 }}
                      activeDot={{ r: 6, stroke: 'var(--admin-bg-card)', strokeWidth: 2 }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ─── Device & Browser Row ─────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Devices — Pie + Legend */}
              <div style={cardStyle}>
                <h3 style={sectionTitleStyle}>
                  <Monitor size={18} style={{ color: '#C8A97E' }} />
                  Perangkat Pengunjung
                </h3>
                {data.devices.length > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '160px', height: '160px', flexShrink: 0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.devices}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={75}
                            paddingAngle={3}
                            label={renderPieLabel}
                            labelLine={false}
                            animationDuration={800}
                          >
                            {data.devices.map((d, i) => (
                              <Cell
                                key={d.name}
                                fill={DEVICE_COLORS[d.name] || PIE_COLORS[i % PIE_COLORS.length]}
                                stroke="none"
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: 'var(--admin-bg-card)',
                              border: '1px solid var(--admin-border)',
                              borderRadius: '8px',
                              fontFamily: 'var(--font-outfit)',
                              fontSize: '0.8125rem',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ flex: 1 }}>
                      {data.devices.map((d) => (
                        <HorizontalBarItem
                          key={d.name}
                          name={d.name}
                          count={d.count}
                          total={totalDevices}
                          color={DEVICE_COLORS[d.name] || '#9CA3AF'}
                          icon={<DeviceIcon name={d.name} size={16} />}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>

              {/* Browsers */}
              <div style={cardStyle}>
                <h3 style={sectionTitleStyle}>
                  <Globe size={18} style={{ color: '#60A5FA' }} />
                  Browser
                </h3>
                {data.browsers.length > 0 ? (
                  <div>
                    {data.browsers.slice(0, 6).map((b, i) => (
                      <HorizontalBarItem
                        key={b.name}
                        name={b.name}
                        count={b.count}
                        total={totalBrowsers}
                        color={BROWSER_COLORS[b.name] || PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>

            {/* ─── OS & Referrers Row ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Operating Systems */}
              <div style={cardStyle}>
                <h3 style={sectionTitleStyle}>
                  <Monitor size={18} style={{ color: '#A78BFA' }} />
                  Sistem Operasi
                </h3>
                {data.os.length > 0 ? (
                  <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.os.slice(0, 6)}
                        layout="vertical"
                        margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--admin-border)" />
                        <XAxis
                          type="number"
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                          tick={{ fontSize: 11, fill: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit)' }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          width={80}
                          tick={{ fontSize: 12, fill: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)' }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--admin-bg-card)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-outfit)',
                            fontSize: '0.8125rem',
                          }}
                          cursor={{ fill: 'var(--admin-hover-bg)' }}
                        />
                        <Bar dataKey="count" name="Views" radius={[0, 6, 6, 0]} animationDuration={800}>
                          {data.os.slice(0, 6).map((o, i) => (
                            <Cell
                              key={o.name}
                              fill={OS_COLORS[o.name] || PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>

              {/* Referrers */}
              <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px 24px 0' }}>
                  <h3 style={sectionTitleStyle}>
                    <ArrowUpRight size={18} style={{ color: '#F59E0B' }} />
                    Sumber Traffic
                  </h3>
                </div>
                {data.referrers.length > 0 ? (
                  data.referrers.slice(0, 8).map((ref, idx) => {
                    const pct = totalReferrers > 0 ? ((ref.count / totalReferrers) * 100).toFixed(1) : '0';
                    return (
                      <div
                        key={ref.name}
                        style={{
                          padding: '12px 24px',
                          borderBottom:
                            idx < Math.min(data.referrers.length, 8) - 1
                              ? '1px solid var(--admin-border)'
                              : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: PIE_COLORS[idx % PIE_COLORS.length],
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--admin-text-primary)',
                              fontFamily: 'var(--font-outfit), sans-serif',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {ref.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--admin-text-secondary)',
                              fontFamily: 'var(--font-outfit), sans-serif',
                            }}
                          >
                            {ref.count}
                          </span>
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              color: '#F59E0B',
                              fontFamily: 'var(--font-outfit), sans-serif',
                              fontWeight: 600,
                              minWidth: '42px',
                              textAlign: 'right',
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>

            {/* ─── Top Pages ────────────────────────────────────── */}
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)' }}>
                <h3 style={{ ...sectionTitleStyle, margin: 0 }}>Halaman Terpopuler</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      background: 'var(--admin-hover-bg)',
                      borderBottom: '1px solid var(--admin-border)',
                    }}
                  >
                    <th
                      style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--admin-text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'var(--font-outfit), sans-serif',
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--admin-text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'var(--font-outfit), sans-serif',
                      }}
                    >
                      URL Halaman
                    </th>
                    <th
                      style={{
                        padding: '12px 24px',
                        textAlign: 'right',
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--admin-text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        width: '150px',
                        fontFamily: 'var(--font-outfit), sans-serif',
                      }}
                    >
                      Total Views
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.length > 0 ? (
                    data.topPages.map((page, idx) => (
                      <tr
                        key={page.path}
                        style={{
                          borderBottom: idx < data.topPages.length - 1 ? '1px solid var(--admin-border)' : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td
                          style={{
                            padding: '14px 24px',
                            fontSize: '0.75rem',
                            color: 'var(--admin-text-secondary)',
                            fontFamily: 'var(--font-outfit), sans-serif',
                            fontWeight: 600,
                            width: '48px',
                          }}
                        >
                          <span
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              background: 'rgba(200,169,126,0.1)',
                              color: '#C8A97E',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                            }}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '14px 24px',
                            fontSize: '0.875rem',
                            color: 'var(--admin-text-primary)',
                            fontFamily: 'var(--font-outfit), sans-serif',
                          }}
                        >
                          <a
                            href={page.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'var(--admin-text-primary)',
                              textDecoration: 'none',
                              transition: 'color 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#C8A97E')}
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = 'var(--admin-text-primary)')
                            }
                          >
                            {page.path}
                          </a>
                        </td>
                        <td
                          style={{
                            padding: '14px 24px',
                            fontSize: '0.875rem',
                            color: 'var(--admin-text-secondary)',
                            textAlign: 'right',
                            fontWeight: 600,
                            fontFamily: 'var(--font-outfit), sans-serif',
                          }}
                        >
                          {page.count}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          padding: '32px 24px',
                          textAlign: 'center',
                          color: 'var(--admin-text-secondary)',
                          fontSize: '0.875rem',
                          fontFamily: 'var(--font-outfit), sans-serif',
                        }}
                      >
                        Belum ada data kunjungan yang tercatat.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
}

/* ─── Empty State ─────────────────────────────────────────────────────────── */

function EmptyState() {
  return (
    <div
      style={{
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--admin-text-secondary)',
        fontSize: '0.875rem',
        fontFamily: 'var(--font-outfit), sans-serif',
      }}
    >
      Belum ada data
    </div>
  );
}
