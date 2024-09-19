import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import './AnalyticsDashboard.css'; // Import custom CSS file

const AnalyticsDashboard = () => {
  const [pollData, setPollData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Fetch data using Axios
  useEffect(() => {
    fetchPollData();
  }, []);

  const fetchPollData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('/api/polls/analytics');
      
      // Assume response.data contains necessary analytics data
      setPollData(response.data.lineChartData);
      setPieData(response.data.pieChartData);
      setDetailedData(response.data.detailedReportData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handle date range filtering
  const handleFilter = async () => {
    try {
      const response = await axios.get('/api/polls/analytics', {
        params: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      });
      setPollData(response.data.lineChartData);
      setPieData(response.data.pieChartData);
      setDetailedData(response.data.detailedReportData);
    } catch (error) {
      console.error('Error filtering data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Poll Analytics Dashboard</h2>

      {/* Date Pickers for Filtering */}
      <div className="date-filter-container">
        <input
          type="date"
          className="date-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="date-input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="filter-button" onClick={handleFilter}>
          Filter
        </button>
      </div>

      {/* Line Chart for displaying poll trends */}
      <div className="chart-container">
        <LineChart
          width={600}
          height={300}
          data={pollData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="votes" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>

      {/* Bar Chart for additional data visualization */}
      <div className="chart-container">
        <BarChart
          width={600}
          height={300}
          data={pollData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="votes" fill="#82ca9d" />
        </BarChart>
      </div>

      {/* Pie Chart for poll options distribution */}
      <div className="chart-container">
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Detailed Report Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Poll Name</th>
              <th>Votes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {detailedData.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.votes}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
