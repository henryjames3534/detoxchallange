"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { CategoryResult } from "@/lib/types";

const CHART_COLORS = [
  "#06b6d4",
  "#0d9488",
  "#38bdf8",
  "#14b8a6",
  "#0284c7",
  "#2dd4bf",
  "#0891b2",
  "#5eead4",
];

function burdenColor(percent: number) {
  if (percent < 25) return "#22c55e";
  if (percent < 50) return "#eab308";
  if (percent < 75) return "#f97316";
  return "#ef4444";
}

interface ResultsChartsProps {
  categories: CategoryResult[];
  printMode?: boolean;
}

export function ResultsCharts({ categories, printMode = false }: ResultsChartsProps) {
  const isMobile = useMediaQuery("(max-width: 639px)") && !printMode;
  const isTablet = useMediaQuery("(max-width: 1023px)") && !printMode;

  const chartHeight = printMode ? 280 : isMobile ? 260 : isTablet ? 300 : 320;
  const radarRadius = printMode ? "70%" : isMobile ? "62%" : "75%";
  const pieInner = printMode ? 50 : isMobile ? 40 : 55;
  const pieOuter = printMode ? 88 : isMobile ? 72 : 95;
  const showPieLabels = printMode || !isMobile;

  const radarData = categories.map((c) => ({
    subject: printMode || !isMobile ? c.name.split(" ")[0] : c.name.split(" ")[0].slice(0, 6),
    fullName: c.name,
    burden: Math.round(c.percent),
    fullMark: 100,
  }));

  const barData = categories.map((c) => ({
    name: printMode || !isMobile ? c.name.split(" ")[0] : c.name.split(" ")[0].slice(0, 5),
    fullName: c.name,
    percent: Math.round(c.percent),
    score: c.score,
  }));

  const pieData = categories
    .filter((c) => c.score > 0)
    .map((c, i) => ({
      name: c.name.split(" ")[0],
      value: c.score,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));

  if (pieData.length === 0) {
    pieData.push({ name: "Clear", value: 1, fill: "#22c55e" });
  }

  return (
    <div className="results-charts space-y-8 sm:space-y-10 lg:space-y-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10 print:grid-cols-2 print:gap-6">
        <div className="glass-card print-avoid-break min-w-0 p-4 sm:p-6 md:p-8 print:p-5">
          <h3 className="mb-2 text-base font-semibold text-[#1e3a5f] sm:text-lg">
            Body Systems Radar
          </h3>
          <p className="mb-4 text-xs text-sky-700 sm:mb-6 sm:text-sm">
            Symptom burden across all 8 systems
          </p>
          <div className="print-chart" style={{ width: "100%", height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={radarRadius}>
                <PolarGrid stroke="#bae6fd" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#0c4a6e", fontSize: isMobile ? 9 : 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: isMobile ? 8 : 10 }}
                />
                <Radar
                  name="Burden %"
                  dataKey="burden"
                  stroke="#0d9488"
                  fill="#06b6d4"
                  fillOpacity={0.45}
                  strokeWidth={2}
                  isAnimationActive={!printMode}
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Burden"]}
                  labelFormatter={(_, items) =>
                    (items?.[0]?.payload as { fullName?: string })?.fullName ??
                    ""
                  }
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card print-avoid-break min-w-0 p-4 sm:p-6 md:p-8 print:p-5">
          <h3 className="mb-2 text-base font-semibold text-[#1e3a5f] sm:text-lg">
            Score Distribution
          </h3>
          <p className="mb-4 text-xs text-sky-700 sm:text-sm">
            Where your points accumulate
          </p>
          <div className="print-chart" style={{ width: "100%", height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={pieInner}
                  outerRadius={pieOuter}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={!printMode}
                  label={showPieLabels ? ({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  : false}
                  labelLine={showPieLabels ? { stroke: "#64748b", strokeWidth: 1 } : false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card print-avoid-break min-w-0 p-4 sm:p-6 md:p-8 print:p-5">
        <h3 className="mb-2 text-base font-semibold text-[#1e3a5f] sm:text-lg">
          Category Comparison
        </h3>
        <p className="mb-4 text-xs text-sky-700 sm:text-sm">Burden % per body system</p>
        <div
          className="print-chart"
          style={{ width: "100%", height: chartHeight + (printMode ? 20 : isMobile ? 40 : 20) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{
                top: 8,
                right: 4,
                left: printMode ? 0 : isMobile ? -20 : 0,
                bottom: printMode ? 40 : isMobile ? 56 : 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#0c4a6e", fontSize: isMobile ? 9 : 11 }}
                interval={0}
                angle={isMobile ? -45 : -25}
                textAnchor="end"
                height={isMobile ? 72 : 60}
              />
              <YAxis
                domain={[0, 100]}
                unit="%"
                tick={{ fill: "#64748b", fontSize: isMobile ? 9 : 11 }}
                width={isMobile ? 32 : 40}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, "Burden"]}
                labelFormatter={(_, payload) =>
                  (payload?.[0]?.payload as { fullName?: string })?.fullName ??
                  ""
                }
              />
              <Bar dataKey="percent" radius={[6, 6, 0, 0]} name="Burden %" isAnimationActive={!printMode}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={burdenColor(entry.percent)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
