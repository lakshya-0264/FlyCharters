import React, { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Trash2, Filter, RefreshCw, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const OperatorManagement = () => {
  const [operators, setOperators] = useState([]);
  const [filteredOperators, setFilteredOperators] = useState([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [viewingOperator, setViewingOperator] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingOperator, setRejectingOperator] = useState(null);

  // API Base URL - adjust according to your setup
  const API_BASE = 'http://localhost:8080/ope'; // Based on your express app setup

  // Fetch operators based on active tab
  const fetchOperators = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'pending':
          endpoint = `${API_BASE}/pendingVerifications`;
          break;
        case 'verified':
          endpoint = `${API_BASE}/verifiedOperators`;
          break;
        case 'rejected':
          endpoint = `${API_BASE}/rejectedOperators`;
          break;
        default:
          endpoint = `${API_BASE}/alloperator`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setOperators(data.data || []);
        setFilteredOperators(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching operators:', error);
      setOperators([]);
      setFilteredOperators([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Search functionality
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredOperators(operators);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}&status=${activeTab}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setFilteredOperators(data.data || []);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Verify single operator
  const verifyOperator = async (operatorId) => {
    try {
      const response = await fetch(`${API_BASE}/verify/${operatorId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('Operator verified successfully!');
        fetchOperators();
        fetchStats();
      } else {
        alert('Error verifying operator');
      }
    } catch (error) {
      console.error('Error verifying operator:', error);
      alert('Error verifying operator');
    }
  };

  // Reject operator
  const rejectOperator = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/reject/${rejectingOperator}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejection_reason: rejectionReason
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Operator rejected successfully!');
        setShowRejectModal(false);
        setRejectionReason('');
        setRejectingOperator(null);
        fetchOperators();
        fetchStats();
      } else {
        alert('Error rejecting operator');
      }
    } catch (error) {
      console.error('Error rejecting operator:', error);
      alert('Error rejecting operator');
    }
  };

  // Bulk verify operators
  const bulkVerify = async () => {
    if (selectedOperators.length === 0) {
      alert('Please select operators to verify');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/bulkVerify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operator_ids: selectedOperators
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`${selectedOperators.length} operators verified successfully!`);
        setSelectedOperators([]);
        fetchOperators();
        fetchStats();
      } else {
        alert('Error bulk verifying operators');
      }
    } catch (error) {
      console.error('Error bulk verifying:', error);
      alert('Error bulk verifying operators');
    }
  };

  // Delete operator
  const deleteOperator = async (operatorId) => {
    if (!confirm('Are you sure you want to delete this operator?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/delete/${operatorId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('Operator deleted successfully!');
        fetchOperators();
        fetchStats();
      } else {
        alert('Error deleting operator');
      }
    } catch (error) {
      console.error('Error deleting operator:', error);
      alert('Error deleting operator');
    }
  };

  // Toggle operator selection
  const toggleOperatorSelection = (operatorId) => {
    setSelectedOperators(prev => 
      prev.includes(operatorId) 
        ? prev.filter(id => id !== operatorId)
        : [...prev, operatorId]
    );
  };

  // Select all operators
  const selectAllOperators = () => {
    if (selectedOperators.length === filteredOperators.length) {
      setSelectedOperators([]);
    } else {
      setSelectedOperators(filteredOperators.map(op => op._id));
    }
  };

  useEffect(() => {
    fetchOperators();
    fetchStats();
  }, [activeTab]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (operator) => {
    if (operator.verified_documents === true) {
      return (
        <span style={{
          display: "inline-flex",
          padding: "6px 12px",
          fontSize: "0.75rem",
          fontWeight: "600",
          borderRadius: "9999px",
          backgroundColor: "#ecfdf5",
          color: "#065f46",
        }}>
          Verified
        </span>
      );
    } else if (operator.rejection_reason) {
      return (
        <span style={{
          display: "inline-flex",
          padding: "6px 12px",
          fontSize: "0.75rem",
          fontWeight: "600",
          borderRadius: "9999px",
          backgroundColor: "#fef2f2",
          color: "#b91c1c",
        }}>
          Rejected
        </span>
      );
    } else {
      return (
        <span style={{
          display: "inline-flex",
          padding: "6px 12px",
          fontSize: "0.75rem",
          fontWeight: "600",
          borderRadius: "9999px",
          backgroundColor: "#fef3c7",
          color: "#b45309",
        }}>
          Pending
        </span>
      );
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f0f9ff, #e0f2fe)",
        padding: "40px 20px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, #061953, #1e40af)",
            color: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}>
            <Users style={{ width: "28px", height: "28px" }} />
            <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: 0 }}>Operator Management Dashboard</h1>
          </div>

          {/* Statistics Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}>
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
            }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
               onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: "linear-gradient(90deg, #3b82f6, #3b82f680)",
              }}></div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>Total Operators</p>
                  <p style={{ fontSize: "1.8rem", fontWeight: "800", color: "#061953" }}>{stats.total}</p>
                </div>
                <Users style={{ width: "32px", height: "32px", color: "#3b82f6" }} />
              </div>
            </div>
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
            }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
               onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: "linear-gradient(90deg, #f59e0b, #f59e0b80)",
              }}></div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>Pending</p>
                  <p style={{ fontSize: "1.8rem", fontWeight: "800", color: "#061953" }}>{stats.pending}</p>
                </div>
                <Clock style={{ width: "32px", height: "32px", color: "#f59e0b" }} />
              </div>
            </div>
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
            }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
               onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: "linear-gradient(90deg, #10b981, #10b98180)",
              }}></div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>Verified</p>
                  <p style={{ fontSize: "1.8rem", fontWeight: "800", color: "#061953" }}>{stats.verified}</p>
                </div>
                <CheckCircle style={{ width: "32px", height: "32px", color: "#10b981" }} />
              </div>
            </div>
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
            }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
               onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: "linear-gradient(90deg, #ef4444, #ef444480)",
              }}></div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>Rejected</p>
                  <p style={{ fontSize: "1.8rem", fontWeight: "800", color: "#061953" }}>{stats.rejected}</p>
                </div>
                <XCircle style={{ width: "32px", height: "32px", color: "#ef4444" }} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            marginBottom: "32px",
            borderBottom: "1px solid #e2e8f0",
          }}>
            <nav style={{ display: "flex", gap: "32px" }}>
              {['pending', 'verified', 'rejected', 'all'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "8px 4px",
                    borderBottom: activeTab === tab ? "2px solid #1e40af" : "2px solid transparent",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                    color: activeTab === tab ? "#1e40af" : "#64748b",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== tab) {
                      e.currentTarget.style.color = "#1e293b";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== tab) {
                      e.currentTarget.style.color = "#64748b";
                    }
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Actions */}
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
            border: "1px solid #e2e8f0",
            marginBottom: "32px",
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                  <Search style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    color: "#64748b",
                  }} />
                  <input
                    type="text"
                    placeholder="Search operators..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                      padding: "8px 12px 8px 36px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      width: "100%",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#3b82f6";
                      e.currentTarget.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                <button
                  onClick={fetchOperators}
                  style={{
                    padding: "8px 16px",
                    background: "#f1f5f9",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#1e293b",
                    border: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#e2e8f0";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <RefreshCw style={{ width: "16px", height: "16px" }} />
                  Refresh
                </button>
              </div>
              
              {activeTab === 'pending' && selectedOperators.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={bulkVerify}
                    style={{
                      padding: "8px 16px",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      border: "none",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)";
                    }}
                  >
                    <Check style={{ width: "16px", height: "16px" }} />
                    Verify Selected ({selectedOperators.length})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Operators Table */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "24px",
              borderBottom: "1px solid #f1f5f9",
              background: "linear-gradient(135deg, #f8fafc, #ffffff)",
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#061953", margin: 0 }}>Operator Verification Requests</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f8fafc" }}>
                  <tr>
                    {activeTab === 'pending' && (
                      <th style={{
                        padding: "16px",
                        fontSize: "0.85rem",
                        color: "#64748b",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        textAlign: "left",
                        borderBottom: "1px solid #e2e8f0",
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedOperators.length === filteredOperators.length && filteredOperators.length > 0}
                          onChange={selectAllOperators}
                          style={{ border: "1px solid #d1d5db", borderRadius: "4px" }}
                        />
                      </th>
                    )}
                    <th style={{
                      padding: "16px",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                    }}>
                      Operator
                    </th>
                    <th style={{
                      padding: "16px",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                    }}>
                      Contact
                    </th>
                    <th style={{
                      padding: "16px",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                    }}>
                      Location
                    </th>
                    <th style={{
                      padding: "16px",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                    }}>
                      Status
                    </th>
                    <th style={{
                      padding: "16px",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                    }}>
                      Upload Date
                    </th>
                    <th style={{
                      padding: "16px",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: "0.95rem",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}>
                          <div style={{
                            width: "24px",
                            height: "24px",
                            border: "3px solid #3b82f6",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}></div>
                          Loading operators...
                        </div>
                      </td>
                    </tr>
                  ) : filteredOperators.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: "0.95rem",
                      }}>
                        No operators found
                      </td>
                    </tr>
                  ) : (
                    filteredOperators.map((operator) => (
                      <tr key={operator._id} style={{
                        transition: "all 0.3s ease",
                        background: "white",
                      }} onMouseOver={(e) => e.currentTarget.style.background = "#f0f9ff"}
                         onMouseOut={(e) => e.currentTarget.style.background = "white"}>
                        {activeTab === 'pending' && (
                          <td style={{ padding: "16px" }}>
                            <input
                              type="checkbox"
                              checked={selectedOperators.includes(operator._id)}
                              onChange={() => toggleOperatorSelection(operator._id)}
                              style={{ border: "1px solid #d1d5db", borderRadius: "4px" }}
                            />
                          </td>
                        )}
                        <td style={{ padding: "16px" }}>
                          <div>
                            <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#061953" }}>{operator.name}</div>
                            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>AOP: {operator.aopNo}</div>
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#061953" }}>{operator.pointOfContact}</div>
                          <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{operator.operatorid?.email}</div>
                        </td>
                        <td style={{ padding: "16px", fontSize: "0.95rem", color: "#061953" }}>{operator.location}</td>
                        <td style={{ padding: "16px" }}>{getStatusBadge(operator)}</td>
                        <td style={{ padding: "16px", fontSize: "0.95rem", color: "#061953" }}>
                          {formatDate(operator.uploaded_time)}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <button
                              onClick={() => setViewingOperator(operator)}
                              style={{
                                color: "#1e40af",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "1px solid #1e40af",
                                background: "white",
                                transition: "all 0.3s ease",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#f0f9ff";
                                e.currentTarget.style.transform = "translateY(-2px)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "white";
                                e.currentTarget.style.transform = "translateY(0)";
                              }}
                              title="View Details"
                            >
                              <Eye style={{ width: "16px", height: "16px" }} />
                            </button>
                            {operator.verified_documents !== true && (
                              <button
                                onClick={() => verifyOperator(operator._id)}
                                style={{
                                  color: "#10b981",
                                  padding: "8px",
                                  borderRadius: "8px",
                                  border: "1px solid #10b981",
                                  background: "white",
                                  transition: "all 0.3s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#ecfdf5";
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "white";
                                  e.currentTarget.style.transform = "translateY(0)";
                                }}
                                title="Verify"
                              >
                                <Check style={{ width: "16px", height: "16px" }} />
                              </button>
                            )}
                            {operator.verified_documents !== true && (
                              <button
                                onClick={() => {
                                  setRejectingOperator(operator._id);
                                  setShowRejectModal(true);
                                }}
                                style={{
                                  color: "#ef4444",
                                  padding: "8px",
                                  borderRadius: "8px",
                                  border: "1px solid #ef4444",
                                  background: "white",
                                  transition: "all 0.3s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#fef2f2";
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "white";
                                  e.currentTarget.style.transform = "translateY(0)";
                                }}
                                title="Reject"
                              >
                                <X style={{ width: "16px", height: "16px" }} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteOperator(operator._id)}
                              style={{
                                color: "#ef4444",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "1px solid #ef4444",
                                background: "white",
                                transition: "all 0.3s ease",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#fef2f2";
                                e.currentTarget.style.transform = "translateY(-2px)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "white";
                                e.currentTarget.style.transform = "translateY(0)";
                              }}
                              title="Delete"
                            >
                              <Trash2 style={{ width: "16px", height: "16px" }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* View Operator Modal */}
          {viewingOperator && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(2px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}>
              <div style={{
                background: "linear-gradient(145deg, #ffffff, #f8fafc)",
                maxWidth: "600px",
                width: "90%",
                padding: "40px",
                borderRadius: "24px",
                position: "relative",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <button
                  onClick={() => setViewingOperator(null)}
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    background: "rgba(241, 245, 249, 0.8)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                    e.currentTarget.style.transform = "rotate(90deg)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(241, 245, 249, 0.8)";
                    e.currentTarget.style.transform = "rotate(0deg)";
                  }}
                >
                  <X style={{ width: "20px", height: "20px", color: "#64748b" }} />
                </button>
                
                <div style={{ display: "flex", alignItems: "center", marginBottom: "24px", paddingBottom: "10px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #061953, #1e40af)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}>
                    <Users style={{ color: "white", width: "28px", height: "28px" }} />
                  </div>
                  <h2 style={{
                    fontSize: "1.8rem",
                    fontWeight: "800",
                    color: "#061953",
                    margin: 0,
                    background: "linear-gradient(90deg, #061953, #1e40af)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>Operator Details</h2>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px" }}>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>Name</label>
                    <p style={{ fontSize: "0.95rem", color: "#1e293b" }}>{viewingOperator.name}</p>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", margin: "8px 0" }}>Point of Contact</label>
                    <p style={{ fontSize: "0.95rem", color: "#1e293b" }}>{viewingOperator.pointOfContact}</p>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", margin: "8px 0" }}>Location</label>
                    <p style={{ fontSize: "0.95rem", color: "#1e293b" }}>{viewingOperator.location}</p>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", margin: "8px 0" }}>AOP No</label>
                    <p style={{ fontSize: "0.95rem", color: "#1e293b" }}>{viewingOperator.aopNo}</p>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px" }}>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>AOP Validity</label>
                    <p style={{ fontSize: "0.95rem", color: "#1e293b" }}>{formatDate(viewingOperator.aopValidity)}</p>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", margin: "8px 0" }}>Number of Aircraft</label>
                    <p style={{ fontSize: "0.95rem", color: "#1e293b" }}>{viewingOperator.numAircraft}</p>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", margin: "8px 0" }}>NSOP Base</label>
                    <p style={{ fontSize: "0.95rem", color: "#1e293b" }}>{viewingOperator.nsopBase}</p>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", margin: "8px 0" }}>Status</label>
                    <div style={{ marginTop: "8px" }}>{getStatusBadge(viewingOperator)}</div>
                  </div>
                </div>
                
                {viewingOperator.rejection_reason && (
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>Rejection Reason</label>
                    <p style={{ fontSize: "0.95rem", color: "#b91c1c" }}>{viewingOperator.rejection_reason}</p>
                  </div>
                )}
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px" }}>
                  <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>Documents</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {viewingOperator.documents?.map((doc, index) => (
                      <div key={index} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px",
                        background: "#f1f5f9",
                        borderRadius: "8px",
                      }}>
                        <span style={{ fontSize: "0.85rem", color: "#1e293b" }}>Document {index + 1}</span>
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.85rem",
                            color: "#1e40af",
                            transition: "color 0.3s ease",
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = "#1e3a8a"}
                          onMouseOut={(e) => e.currentTarget.style.color = "#1e40af"}
                        >
                          View Document
                        </a>
                      </div>
                    )) || (
                      <p style={{ fontSize: "0.85rem", color: "#64748b" }}>No documents available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reject Modal */}
          {showRejectModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(2px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}>
              <div style={{
                background: "linear-gradient(145deg, #ffffff, #f8fafc)",
                maxWidth: "500px",
                width: "90%",
                padding: "24px",
                borderRadius: "24px",
                position: "relative",
                boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setRejectingOperator(null);
                  }}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "rgba(241, 245, 249, 0.8)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                    e.currentTarget.style.transform = "rotate(90deg)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(241, 245, 249, 0.8)";
                    e.currentTarget.style.transform = "rotate(0deg)";
                  }}
                >
                  <X style={{ width: "20px", height: "20px", color: "#64748b" }} />
                </button>
                
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#061953",
                    background: "linear-gradient(90deg, #061953, #1e40af)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>Reject Operator</h2>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>
                      Rejection Reason *
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a detailed reason for rejection..."
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        resize: "vertical",
                        minHeight: "100px",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#3b82f6";
                        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.2)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectionReason('');
                        setRejectingOperator(null);
                      }}
                      style={{
                        padding: "8px 16px",
                        background: "#f1f5f9",
                        color: "#1e293b",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#e2e8f0";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#f1f5f9";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={rejectOperator}
                      style={{
                        padding: "8px 16px",
                        background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                        color: "white",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        border: "none",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
                      }}
                    >
                      Reject Operator
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OperatorManagement;