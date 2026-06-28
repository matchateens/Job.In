import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_CONFIG = {
  applied: {
    label: 'Applied',
    color: 'hsl(217, 91%, 60%)',
    bg: 'hsla(217, 91%, 60%, 0.15)',
  },
  interviewing: {
    label: 'Interviewing',
    color: 'hsl(38, 92%, 50%)',
    bg: 'hsla(38, 92%, 50%, 0.15)',
  },
  offered: {
    label: 'Offered',
    color: 'hsl(142, 70%, 45%)',
    bg: 'hsla(142, 70%, 45%, 0.15)',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(350, 89%, 60%)',
    bg: 'hsla(350, 89%, 60%, 0.15)',
  },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const config = STATUS_CONFIG[entry.payload.status];
    return (
      <div
        style={{
          background: 'hsla(220, 30%, 10%, 0.95)',
          border: `1px solid ${config.color}`,
          borderRadius: '10px',
          padding: '0.6rem 1rem',
          backdropFilter: 'blur(8px)',
          boxShadow: `0 4px 20px ${config.bg}`,
        }}
      >
        <div style={{ fontWeight: 700, color: config.color, fontSize: '0.95rem' }}>
          {entry.name}
        </div>
        <div style={{ color: 'hsl(210, 40%, 98%)', fontSize: '0.85rem', marginTop: '2px' }}>
          {entry.value} lamaran ({entry.payload.pct}%)
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ data }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      justifyContent: 'center',
      flex: 1,
    }}
  >
    {data.map((item) => {
      const config = STATUS_CONFIG[item.status];
      return (
        <div
          key={item.status}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.75rem',
            background: config.bg,
            borderRadius: '8px',
            border: `1px solid ${config.color}22`,
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: config.color,
                flexShrink: 0,
                boxShadow: `0 0 6px ${config.color}`,
              }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {config.label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: config.color }}>
              {item.value}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                background: 'hsla(0,0%,100%,0.05)',
                padding: '1px 6px',
                borderRadius: '4px',
              }}
            >
              {item.pct}%
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

const RADIAN = Math.PI / 180;
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  // percent here is Recharts' internal decimal (0–1); hide slices <6%
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '0.75rem', fontWeight: 800, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StatusPieChart = ({ jobs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const total = jobs.length;

  const data = Object.keys(STATUS_CONFIG)
    .map((status) => {
      const count = jobs.filter((j) => j.status === status).length;
      return {
        name: STATUS_CONFIG[status].label,
        value: count,
        status,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
        color: STATUS_CONFIG[status].color,
      };
    })
    .filter((d) => d.value > 0);

  const emptyData = [{ name: 'Belum Ada Data', value: 1, status: null, color: 'hsla(220, 20%, 30%, 0.5)' }];

  const isEmpty = total === 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            Distribusi Status Lamaran
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {isEmpty ? 'Belum ada data lamaran' : `Total ${total} lamaran terdaftar`}
          </p>
        </div>
        <div
          style={{
            padding: '0.4rem 0.85rem',
            background: 'hsla(217, 91%, 60%, 0.12)',
            border: '1px solid hsla(217, 91%, 60%, 0.25)',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'hsl(217, 91%, 60%)',
          }}
        >
          Pie Chart
        </div>
      </div>

      {/* Chart Body */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Pie Chart */}
        <div style={{ width: 200, height: 200, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={isEmpty ? emptyData : data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={90}
                paddingAngle={isEmpty ? 0 : 3}
                dataKey="value"
                labelLine={false}
                label={!isEmpty ? CustomLabel : false}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                strokeWidth={0}
              >
                {(isEmpty ? emptyData : data).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  />
                ))}
              </Pie>
              {!isEmpty && (
                <Tooltip content={<CustomTooltip />} />
              )}
              {/* Center Text */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--text-primary)"
              >
                <tspan
                  x="50%"
                  dy="-0.4em"
                  style={{ fontSize: '1.6rem', fontWeight: 800 }}
                >
                  {total}
                </tspan>
                <tspan
                  x="50%"
                  dy="1.3em"
                  style={{ fontSize: '0.65rem', fill: 'var(--text-secondary)' }}
                >
                  Total
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        {isEmpty ? (
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              padding: '1rem',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.4 }}>📋</div>
            <p>Tambahkan lamaran pekerjaan<br />untuk melihat distribusi status.</p>
          </div>
        ) : (
          <CustomLegend data={data} />
        )}
      </div>
    </div>
  );
};

export default StatusPieChart;
