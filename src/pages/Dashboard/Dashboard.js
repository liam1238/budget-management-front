import React, { useEffect, useState, useCallback } from "react";
import { Budget } from "../../utils/budget";
import { Alert } from "@mui/material";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Bar, Pie } from "react-chartjs-2"; // Import chart components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "./Dashboard.css";

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const getBalance = useCallback(async () => {
    try {
      setLoading(true);
      const summary = await Budget.getSummary();

      setData({
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        balance: summary.balance,
      });
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const barChartData = {
    labels: ["Income", "Expenses", "Balance"],
    datasets: [
      {
        label: "Amount ($)",
        data: [data.totalIncome, data.totalExpenses, data.balance],
        backgroundColor: ["#4CAF50", "#F44336", "#2196F3"],
        borderColor: ["#388E3C", "#D32F2F", "#1976D2"],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [data.totalIncome, data.totalExpenses],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  return (
    <>
      {error && <Alert severity="error">{error?.toString()}</Alert>}
      {loading && <CircularProgress size={100} className="loading-spinner" />}
      {!loading && (
        <div className="dashboard">
          <h1>Dashboard</h1>
          <div className="summary">
            <div className="card">
              <h3>Total Income:</h3>
              <h2>${data.totalIncome}</h2>
            </div>
            <div className="card">
              <h3>Total Expenses:</h3>
              <h2>${data.totalExpenses}</h2>
            </div>
            <div className="card">
              <h3>Remaining Balance:</h3>
              <h2>${data.balance}</h2>
            </div>
          </div>

          <div className="charts">
            <div className="chart-container">
              <h3>Income vs Expenses</h3>
              <Bar
                data={barChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
                width={300}
                height={200}
              />
            </div>
            <div className="chart-container">
              <h3>Income Distribution</h3>
              <Pie
                data={pieChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
                width={300}
                height={200}
              />
            </div>
          </div>

          <div className="to-tables">
            <Link to={"/table"}>
              <h3>Click here to see the incomes and expenses tables</h3>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
