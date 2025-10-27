import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const DashboardOverview = ({ students, statistics }) => {
  const performanceData = [
    { category: 'High (80+)', count: statistics?.high || 0 },
    { category: 'Medium (60-79)', count: statistics?.medium || 0 },
    { category: 'Low (<60)', count: statistics?.low || 0 }
  ];

  const trendsData = students.slice(0, 5).map(s => ({
    name: s.name.split(' ')[0],
    marks: s.marks
  }));

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="overview-container">
      <div className="summary-cards">
        <div className="summary-card">
          <p className="card-label">Total Students</p>
          <p className="card-value" style={{ color: '#4f46e5' }}>
            {statistics?.total || 0}
          </p>
        </div>
        <div className="summary-card">
          <p className="card-label">Class Average</p>
          <p className="card-value" style={{ color: '#10b981' }}>
            {statistics?.average || 0}%
          </p>
        </div>
        <div className="summary-card">
          <p className="card-label">Recent Activity</p>
          <p className="card-value" style={{ color: '#3b82f6' }}>
            {students.filter(s => s.lastUpdated === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3 className="chart-title">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, count }) => `${category}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Student Performance Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marks" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;