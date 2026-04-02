import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Users, BookOpen, Clock, DollarSign, Award, Activity } from 'lucide-react';
import { useStudentContext } from '../contexts/StudentContext';

const Bar = ({ value, max, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }} />
  </div>
);

const StatCard = ({ title, value, sub, icon: Icon, color, bg }) => (
  <div className={`${bg} rounded-lg p-5 border`}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

// SVG Donut Chart
const DonutChart = ({ segments, size = 160, thickness = 35 }) => {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  let offset = 0;
  const slices = segments.map((seg) => {
    const dash = total > 0 ? (seg.value / total) * circumference : 0;
    const gap = circumference - dash;
    const rotation = (offset / circumference) * 360 - 90;
    offset += dash;
    return { ...seg, dash, gap, rotation };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={thickness} />
        ) : (
          slices.map((s, i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={0}
              transform={`rotate(${s.rotation} ${cx} ${cy})`}
              className="transition-all duration-500"
            />
          ))
        )}
        <text x={cx} y={cy - 6} textAnchor="middle" className="text-lg font-bold" fill="#111827" fontSize="22" fontWeight="bold">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#6b7280" fontSize="11">students</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            {s.label} ({total > 0 ? Math.round(s.value / total * 100) : 0}%)
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdvancedAnalytics = () => {
  const { students } = useStudentContext();

  const analytics = useMemo(() => {
    if (!students.length) return null;

    const total = students.length;
    const high = students.filter(s => s.riskLevel === 'high');
    const medium = students.filter(s => s.riskLevel === 'medium');
    const low = students.filter(s => s.riskLevel === 'low');

    const avgAttendance = (students.reduce((s, st) => s + (st.attendance || 0), 0) / total).toFixed(1);
    const avgScore = (students.reduce((s, st) => s + (st.avgScore || 0), 0) / total).toFixed(1);

    const feesPaid = students.filter(s => s.feesStatus === 'paid').length;
    const feesDue = students.filter(s => s.feesStatus === 'due').length;
    const feesOverdue = students.filter(s => s.feesStatus === 'overdue').length;

    // Attendance buckets
    const attBuckets = [
      { label: '< 60%', count: students.filter(s => s.attendance < 60).length, color: 'bg-red-500' },
      { label: '60–75%', count: students.filter(s => s.attendance >= 60 && s.attendance < 75).length, color: 'bg-orange-400' },
      { label: '75–85%', count: students.filter(s => s.attendance >= 75 && s.attendance < 85).length, color: 'bg-yellow-400' },
      { label: '85–100%', count: students.filter(s => s.attendance >= 85).length, color: 'bg-green-500' },
    ];

    // Score buckets
    const scoreBuckets = [
      { label: '< 50%', count: students.filter(s => s.avgScore < 50).length, color: 'bg-red-500' },
      { label: '50–65%', count: students.filter(s => s.avgScore >= 50 && s.avgScore < 65).length, color: 'bg-orange-400' },
      { label: '65–80%', count: students.filter(s => s.avgScore >= 65 && s.avgScore < 80).length, color: 'bg-yellow-400' },
      { label: '80–100%', count: students.filter(s => s.avgScore >= 80).length, color: 'bg-green-500' },
    ];

    // Grade-wise risk
    const grades = [...new Set(students.map(s => s.grade))].sort();
    const gradeRisk = grades.map(g => {
      const gs = students.filter(s => s.grade === g);
      return {
        grade: `Grade ${g}`,
        total: gs.length,
        high: gs.filter(s => s.riskLevel === 'high').length,
        medium: gs.filter(s => s.riskLevel === 'medium').length,
        low: gs.filter(s => s.riskLevel === 'low').length,
      };
    });

    // Top at-risk students
    const topAtRisk = [...students]
      .sort((a, b) => (a.attendance + a.avgScore) - (b.attendance + b.avgScore))
      .slice(0, 5);

    // Insights
    const insights = [];
    if (high.length > total * 0.3) insights.push({ type: 'danger', text: `${high.length} students (${Math.round(high.length / total * 100)}%) are at high risk — immediate intervention needed` });
    if (parseFloat(avgAttendance) < 80) insights.push({ type: 'warning', text: `Average attendance is ${avgAttendance}% — below the recommended 85% threshold` });
    if (feesOverdue > 0) insights.push({ type: 'danger', text: `${feesOverdue} students have overdue fee payments — high dropout correlation` });
    if (parseFloat(avgScore) < 70) insights.push({ type: 'warning', text: `Average score is ${avgScore}% — consider academic support programs` });
    if (low.length > total * 0.5) insights.push({ type: 'success', text: `${low.length} students (${Math.round(low.length / total * 100)}%) are on track — positive indicator` });

    return { total, high, medium, low, avgAttendance, avgScore, feesPaid, feesDue, feesOverdue, attBuckets, scoreBuckets, gradeRisk, topAtRisk, insights };
  }, [students]);

  if (!students.length) return (
    <div className="text-center py-20 text-gray-500">
      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <p className="text-lg font-medium">No data available</p>
      <p className="text-sm">Import student data to see advanced analytics</p>
    </div>
  );

  const { total, high, medium, low, avgAttendance, avgScore, feesPaid, feesDue, feesOverdue, attBuckets, scoreBuckets, gradeRisk, topAtRisk, insights } = analytics;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Advanced Analytics & Insights</h2>
        <p className="text-gray-600">Deep analysis of student performance, risk patterns, and predictive insights</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={total} icon={Users} color="text-blue-600" bg="bg-blue-50 border-blue-200" />
        <StatCard title="High Risk" value={high.length} sub={`${Math.round(high.length / total * 100)}% of total`} icon={AlertTriangle} color="text-red-600" bg="bg-red-50 border-red-200" />
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} sub={avgAttendance >= 85 ? 'Above threshold' : 'Below threshold'} icon={Clock} color={avgAttendance >= 85 ? 'text-green-600' : 'text-orange-600'} bg={avgAttendance >= 85 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'} />
        <StatCard title="Avg Score" value={`${avgScore}%`} sub={avgScore >= 75 ? 'Satisfactory' : 'Needs improvement'} icon={BookOpen} color={avgScore >= 75 ? 'text-green-600' : 'text-orange-600'} bg={avgScore >= 75 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'} />
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" /> AI-Powered Insights
        </h3>
        <div className="space-y-3">
          {insights.length > 0 ? insights.map((ins, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${ins.type === 'danger' ? 'bg-red-50 border border-red-200' : ins.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ins.type === 'danger' ? 'bg-red-500' : ins.type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <p className={`text-sm ${ins.type === 'danger' ? 'text-red-800' : ins.type === 'warning' ? 'text-yellow-800' : 'text-green-800'}`}>{ins.text}</p>
            </div>
          )) : <p className="text-gray-500 text-sm">No critical insights at this time.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Level Donut */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 self-start">Risk Level Overview</h3>
          <DonutChart segments={[
            { label: 'High Risk', value: high.length, color: '#ef4444' },
            { label: 'Medium', value: medium.length, color: '#f59e0b' },
            { label: 'Low Risk', value: low.length, color: '#22c55e' },
          ]} />
        </div>

        {/* Fee Status Donut */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 self-start">Fee Payment Status</h3>
          <DonutChart segments={[
            { label: 'Paid', value: feesPaid, color: '#22c55e' },
            { label: 'Due', value: feesDue, color: '#f59e0b' },
            { label: 'Overdue', value: feesOverdue, color: '#ef4444' },
          ]} />
        </div>

        {/* Attendance Donut */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 self-start">Attendance Overview</h3>
          <DonutChart segments={[
            { label: '< 60%', value: students.filter(s => s.attendance < 60).length, color: '#ef4444' },
            { label: '60–75%', value: students.filter(s => s.attendance >= 60 && s.attendance < 75).length, color: '#f97316' },
            { label: '75–85%', value: students.filter(s => s.attendance >= 75 && s.attendance < 85).length, color: '#eab308' },
            { label: '85%+', value: students.filter(s => s.attendance >= 85).length, color: '#22c55e' },
          ]} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" /> Attendance Distribution
          </h3>
          <div className="space-y-4">
            {attBuckets.map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{b.label}</span>
                  <span className="font-medium">{b.count} students ({total > 0 ? Math.round(b.count / total * 100) : 0}%)</span>
                </div>
                <Bar value={b.count} max={total} color={b.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" /> Score Distribution
          </h3>
          <div className="space-y-4">
            {scoreBuckets.map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{b.label}</span>
                  <span className="font-medium">{b.count} students ({total > 0 ? Math.round(b.count / total * 100) : 0}%)</span>
                </div>
                <Bar value={b.count} max={total} color={b.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Fee Status */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-yellow-600" /> Fee Payment Status
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Paid', count: feesPaid, color: 'bg-green-500' },
              { label: 'Due', count: feesDue, color: 'bg-yellow-500' },
              { label: 'Overdue', count: feesOverdue, color: 'bg-red-500' },
            ].map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{b.label}</span>
                  <span className="font-medium">{b.count} students ({total > 0 ? Math.round(b.count / total * 100) : 0}%)</span>
                </div>
                <Bar value={b.count} max={total} color={b.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Grade-wise Risk */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" /> Grade-wise Risk Breakdown
          </h3>
          {gradeRisk.length > 0 ? (
            <div className="space-y-4">
              {gradeRisk.map(g => (
                <div key={g.grade}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{g.grade} ({g.total} students)</span>
                    <span className="text-red-600 text-xs">{g.high} high risk</span>
                  </div>
                  <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-200">
                    <div className="bg-red-500" style={{ width: `${g.total > 0 ? (g.high / g.total) * 100 : 0}%` }} />
                    <div className="bg-yellow-400" style={{ width: `${g.total > 0 ? (g.medium / g.total) * 100 : 0}%` }} />
                    <div className="bg-green-500" style={{ width: `${g.total > 0 ? (g.low / g.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full inline-block" />High</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-400 rounded-full inline-block" />Medium</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block" />Low</span>
              </div>
            </div>
          ) : <p className="text-gray-500 text-sm">No grade data available</p>}
        </div>
      </div>

      {/* Top At-Risk Students */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" /> Top 5 Students Needing Immediate Attention
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Student</th>
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Grade</th>
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Attendance</th>
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Score</th>
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Fees</th>
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {topAtRisk.map((s, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-900">{s.name}</td>
                  <td className="py-2 px-3 text-gray-600">{s.grade}-{s.section}</td>
                  <td className={`py-2 px-3 font-medium ${s.attendance < 75 ? 'text-red-600' : 'text-yellow-600'}`}>{s.attendance}%</td>
                  <td className={`py-2 px-3 font-medium ${s.avgScore < 60 ? 'text-red-600' : 'text-yellow-600'}`}>{s.avgScore}%</td>
                  <td className={`py-2 px-3 font-medium ${s.feesStatus === 'overdue' ? 'text-red-600' : s.feesStatus === 'due' ? 'text-yellow-600' : 'text-green-600'}`}>{s.feesStatus}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.riskLevel === 'high' ? 'bg-red-100 text-red-700' : s.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {s.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
