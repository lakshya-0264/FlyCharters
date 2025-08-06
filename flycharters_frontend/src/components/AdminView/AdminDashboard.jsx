import React, { useState, useEffect } from 'react';
import { LogOut, Users, Truck, Check, X, Eye, Plane, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react'; // Added BarChart3
import OperatorManagement from './OperatorManagement';
import AdminDashboardAnalytics from './AdminDashboardAnalytics'; // ADD THIS LINE
import logo from '../../assets/LogoOnly.png';
const FleetManagement = () => {
  const [fleets, setFleets] = useState([]);
  const [stats, setStats] = useState({ totalFleets: 0, pendingApproval: 0, approvedFleets: 0, maintenanceFleets: 0 });
  const [loading, setLoading] = useState(true);
  const [processingFleetId, setProcessingFleetId] = useState(null);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const API_BASE = 'http://localhost:8080/fleet';

  useEffect(() => {
    fetchFleets();
    fetchStats();
  }, [filter]);

  const fetchFleets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/fleetsRequestingApproval`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setFleets(data.data || []);
      } else {
        console.error('Failed to fetch fleets:', data.message);
        setFleets([]);
      }
    } catch (error) {
      console.error('Error fetching fleets:', error);
      setFleets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/fleetStats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data || { totalFleets: 0, pendingApproval: 0, approvedFleets: 0, maintenanceFleets: 0 });
      } else {
        console.error('Failed to fetch stats:', data.message);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprovalAction = async (fleetId, isApproved) => {
    try {
      setProcessingFleetId(fleetId);
      const response = await fetch(`${API_BASE}/ApprovalRejection/${fleetId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAdminVerify: isApproved,
          status: isApproved ? 'available' : 'unavailable',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFleets((prevFleets) =>
          prevFleets.map((fleet) =>
            fleet._id === fleetId
              ? { ...fleet, isAdminVerify: isApproved, status: isApproved ? 'available' : 'unavailable' }
              : fleet
          )
        );
        fetchStats();
        alert(`Fleet ${isApproved ? 'approved' : 'rejected'} successfully!`);
      } else {
        alert('Failed to update fleet status');
      }
    } catch (error) {
      console.error('Error updating fleet:', error);
      alert('Error updating fleet status');
    } finally {
      setProcessingFleetId(null);
    }
  };

  const getFilteredFleets = () => {
    switch (filter) {
      case 'pending':
        return fleets.filter((fleet) => !fleet.isAdminVerify && fleet.status !== 'unavailable');
      case 'approved':
        return fleets.filter((fleet) => fleet.isAdminVerify && fleet.status === 'available');
      case 'rejected':
        return fleets.filter((fleet) => fleet.isAdminVerify === false && fleet.status === 'unavailable');
      default:
        return fleets;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: 'translateY(0)',
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
        }}
      ></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#64748b',
              fontWeight: '600',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            {title}
          </p>
          <p style={{ fontSize: '1.8rem', fontWeight: '800', color: '#061953' }}>{value}</p>
        </div>
        <Icon style={{ width: '32px', height: '32px', color }} />
      </div>
    </div>
  );

  const FleetModal = ({ fleet, onClose }) => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
          maxWidth: '900px',
          width: '90%',
          padding: '40px',
          borderRadius: '24px',
          position: 'relative',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(241, 245, 249, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <X style={{ width: '20px', height: '20px', color: '#64748b' }} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #061953, #1e40af)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <Plane style={{ color: 'white', width: '28px', height: '28px' }} />
          </div>
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#061953',
              margin: 0,
              background: 'linear-gradient(90deg, #061953, #1e40af)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {fleet.name}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              <strong>Model:</strong> {fleet.model || 'N/A'}
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              <strong>Capacity:</strong> {fleet.capacity || 0} passengers
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              <strong>Aircraft Registration:</strong> {fleet.aircraftRegn || 'N/A'}
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>
              <strong>Base:</strong> {fleet.aircraftBase?.airport_name || 'N/A'}
            </p>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              <strong>Price per Hour:</strong> ₹{fleet.price_per_hour?.toLocaleString() || 'N/A'}
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              <strong>Cruising Speed:</strong> {fleet.cruisingSpeed || 0} knots
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              <strong>Status:</strong> {fleet.status || 'N/A'}
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>
              <strong>Operator:</strong> {
  fleet.operatorId?.firstName && fleet.operatorId?.lastName 
    ? `${fleet.operatorId.firstName} ${fleet.operatorId.lastName}` 
    : 'N/A'
}
            </p>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>
            <strong>Description:</strong> {fleet.description || 'No description available'}
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            <strong>Capabilities:</strong>
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '0.85rem', color: '#64748b' }}>
            <li>Land at uncontrolled airports: {fleet.isAbleToLandUncontrolled ? 'Yes' : 'No'}</li>
            <li>Performance limited: {fleet.isPerformanceLimited ? 'Yes' : 'No'}</li>
            <li>Short runway capable: {fleet.isAbleToLandShortRunway ? 'Yes' : 'No'}</li>
          </ul>
        </div>

        {fleet.fleetInnerImages && fleet.fleetInnerImages.length > 0 && (
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
              Fleet Images:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {fleet.fleetInnerImages.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    aspectRatio: '4/3',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <img
                    src={image}
                    alt={`Fleet ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      padding: '12px',
                      color: 'white',
                      fontSize: '0.85rem',
                    }}
                  >
                    {fleet.name} - View {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(145deg, #f0f9ff, #e0f2fe)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            border: '4px solid #3b82f6',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f0f9ff, #e0f2fe)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #061953, #1e40af)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <Plane style={{ width: '28px', height: '28px' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Fleet Management Dashboard</h1>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <StatCard title="Total Fleets" value={stats.totalFleets || 0} icon={Plane} color="#3B82F6" />
            <StatCard title="Pending Approval" value={stats.pendingApproval || 0} icon={Clock} color="#F59E0B" />
            <StatCard title="Approved" value={stats.approvedFleets || 0} icon={CheckCircle} color="#10B981" />
            <StatCard title="In Maintenance" value={stats.maintenanceFleets || 0} icon={AlertCircle} color="#EF4444" />
          </div>

          <div style={{ marginBottom: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Fleets' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: filter === key ? 'linear-gradient(135deg, #061953, #1e40af)' : 'white',
                  color: filter === key ? 'white' : '#1e40af',
                  boxShadow:
                    filter === key ? '0 4px 15px rgba(30, 64, 175, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                }}
                onMouseOver={(e) => {
                  if (filter !== key) {
                    e.currentTarget.style.background = '#f0f9ff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (filter !== key) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid #f1f5f9',
                background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#061953', margin: 0 }}>
                Fleet Approval Requests
              </h2>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    {['Fleet Details', 'Operator', 'Specifications', 'Status', 'Created At', 'Actions'].map(
                      (header, index) => (
                        <th
                          key={index}
                          style={{
                            padding: '16px',
                            fontSize: '0.85rem',
                            color: '#64748b',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            textAlign: 'left',
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getFilteredFleets().map((fleet) => (
                    <tr
                      key={fleet._id}
                      style={{
                        transition: 'all 0.3s ease',
                        background: 'white',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#f0f9ff')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
                    >
                      <td style={{ padding: '16px', fontSize: '0.95rem' }}>
                        <div style={{ fontWeight: '600', color: '#061953' }}>{fleet.name || 'N/A'}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{fleet.model || 'N/A'}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {fleet.aircraftRegn || 'N/A'}
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.95rem' }}>
                        <div style={{ fontWeight: '600', color: '#061953' }}>
                          {
  fleet.operatorId?.firstName && fleet.operatorId?.lastName 
    ? `${fleet.operatorId.firstName} ${fleet.operatorId.lastName}` 
    : 'N/A'
}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {fleet.operatorId?.email || 'N/A'}
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.95rem' }}>
                        <div style={{ fontWeight: '600', color: '#061953' }}>
                          Capacity: {fleet.capacity || 0}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          ₹{fleet.price_per_hour?.toLocaleString() || 'N/A'}/hr
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {fleet.cruisingSpeed || 0} knots
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            borderRadius: '9999px',
                            backgroundColor:
                              fleet.isAdminVerify && fleet.status === 'available'
                                ? '#ecfdf5'
                                : fleet.status === 'unavailable'
                                ? '#fef2f2'
                                : '#fef3c7',
                            color:
                              fleet.isAdminVerify && fleet.status === 'available'
                                ? '#065f46'
                                : fleet.status === 'unavailable'
                                ? '#b91c1c'
                                : '#b45309',
                          }}
                        >
                          {fleet.isAdminVerify && fleet.status === 'available'
                            ? 'Approved'
                            : fleet.status === 'unavailable'
                            ? 'Rejected'
                            : 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.95rem', color: '#061953' }}>
                        {fleet.createdAt ? formatDate(fleet.createdAt) : 'N/A'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.95rem' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button
                            onClick={() => {
                              setSelectedFleet(fleet);
                              setShowModal(true);
                            }}
                            style={{
                              color: '#1e40af',
                              padding: '8px',
                              borderRadius: '8px',
                              border: '1px solid #1e40af',
                              background: 'white',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#f0f9ff';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            title="View Details"
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </button>

                          {(!fleet.isAdminVerify || fleet.status !== 'available') && (
                            <>
                              <button
                                onClick={() => handleApprovalAction(fleet._id, true)}
                                disabled={processingFleetId === fleet._id}
                                style={{
                                  color: '#10b981',
                                  padding: '8px',
                                  borderRadius: '8px',
                                  border: '1px solid #10b981',
                                  background: 'white',
                                  transition: 'all 0.3s ease',
                                  opacity: processingFleetId === fleet._id ? 0.5 : 1,
                                }}
                                onMouseOver={(e) => {
                                  if (processingFleetId !== fleet._id) {
                                    e.currentTarget.style.background = '#ecfdf5';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                  }
                                }}
                                onMouseOut={(e) => {
                                  if (processingFleetId !== fleet._id) {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }
                                }}
                                title="Approve"
                              >
                                <Check style={{ width: '16px', height: '16px' }} />
                              </button>
                              <button
                                onClick={() => handleApprovalAction(fleet._id, false)}
                                disabled={processingFleetId === fleet._id}
                                style={{
                                  color: '#ef4444',
                                  padding: '8px',
                                  borderRadius: '8px',
                                  border: '1px solid #ef4444',
                                  background: 'white',
                                  transition: 'all 0.3s ease',
                                  opacity: processingFleetId === fleet._id ? 0.5 : 1,
                                }}
                                onMouseOver={(e) => {
                                  if (processingFleetId !== fleet._id) {
                                    e.currentTarget.style.background = '#fef2f2';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                  }
                                }}
                                onMouseOut={(e) => {
                                  if (processingFleetId !== fleet._id) {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }
                                }}
                                title="Reject"
                              >
                                <X style={{ width: '16px', height: '16px' }} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {getFilteredFleets().length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                <p>No fleets found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>

        {showModal && selectedFleet && (
          <FleetModal
            fleet={selectedFleet}
            onClose={() => {
              setShowModal(false);
              setSelectedFleet(null);
            }}
          />
        )}
      </div>
    </>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('operators');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        alert('Logged out successfully!');
      } else {
        console.error('Logout failed:', data.message);
        alert('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #f0f9ff, #e0f2fe)' }}>
      {/* Navbar */}
      <nav
        style={{
          background: 'linear-gradient(135deg, #061953, #1e40af)',
          color: 'white',
          padding: '12px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logo} alt="FlyCharters Logo" style={{ width: "60px", height: "auto" }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '0.95rem',
              border: 'none',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              background: 'white',
              color: '#1e40af',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseOver={(e) => {
              if (!isLoggingOut) {
                e.currentTarget.style.background = '#f0f9ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoggingOut) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <LogOut style={{ width: '20px', height: '20px' }} />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </nav>

      {/* Tabs */}
      {/* Tabs */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ borderBottom: '1px solid #e2e8f0' }}>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <button
              onClick={() => setActiveTab('operators')}
              style={{
                padding: '8px 4px',
                borderBottom: activeTab === 'operators' ? '2px solid #1e40af' : '2px solid transparent',
                fontWeight: '500',
                fontSize: '0.95rem',
                color: activeTab === 'operators' ? '#1e40af' : '#64748b',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'operators') {
                  e.currentTarget.style.color = '#1e293b';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'operators') {
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              <Users style={{ width: '20px', height: '20px' }} />
              Operator Management
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              style={{
                padding: '8px 4px',
                borderBottom: activeTab === 'fleet' ? '2px solid #1e40af' : '2px solid transparent',
                fontWeight: '500',
                fontSize: '0.95rem',
                color: activeTab === 'fleet' ? '#1e40af' : '#64748b',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'fleet') {
                  e.currentTarget.style.color = '#1e293b';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'fleet') {
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              <Truck style={{ width: '20px', height: '20px' }} />
              Fleet Management
            </button>
            {/* ADD THIS NEW BUTTON */}
            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                padding: '8px 4px',
                borderBottom: activeTab === 'analytics' ? '2px solid #1e40af' : '2px solid transparent',
                fontWeight: '500',
                fontSize: '0.95rem',
                color: activeTab === 'analytics' ? '#1e40af' : '#64748b',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'analytics') {
                  e.currentTarget.style.color = '#1e293b';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'analytics') {
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              <BarChart3 style={{ width: '20px', height: '20px' }} />
              Analytics
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 24px' }}>
        {activeTab === 'operators' ? (
          <OperatorManagement />
        ) : activeTab === 'fleet' ? (
          <FleetManagement />
        ) : (
          <AdminDashboardAnalytics />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;