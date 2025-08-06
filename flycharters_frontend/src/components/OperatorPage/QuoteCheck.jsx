import React, { useEffect, useState } from "react";
import { 
  FiClock, 
  FiDollarSign, 
  FiNavigation, 
  FiMapPin, 
  FiAirplay, 
  FiTag, 
  FiDownload, 
  FiChevronDown, 
  FiChevronUp 
} from "react-icons/fi";
import { FaPlane, FaRegCalendarAlt, FaRegMoneyBillAlt } from "react-icons/fa";
import loadingGif from "../../assets/LoadingGIF.gif";
import { getQuotesByOperator } from "../../api/authAPI";
import { saveAs } from 'file-saver';

const OperatorQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCards, setExpandedCards] = useState({});

    useEffect(() => {
        const operatorId = localStorage.getItem("id");
        const fetchQuotes = async () => {
            try {
                const response = await getQuotesByOperator(operatorId);
                setQuotes(response.data.data || []);
                // Initialize all cards as expanded by default
                const initialExpanded = {};
                response.data.data.forEach(quote => {
                    initialExpanded[quote._id] = true;
                });
                setExpandedCards(initialExpanded);
            } catch (err) {
                console.error("Error fetching quotes:", err);
                setQuotes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    const filteredQuotes = quotes.filter(quote => 
        quote._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (quote.fleet?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleCard = (quoteId) => {
        setExpandedCards(prev => ({
            ...prev,
            [quoteId]: !prev[quoteId]
        }));
    };

    const handleDownload = (quote) => {
        const content = `
            Quote Details
            -------------
            Fleet Name: ${quote.fleet?.name || "N/A"}
            Aircraft Registration: ${quote.fleet?.aircraftRegn || "N/A"}
            Model: ${quote.fleet?.model || "N/A"}
            Quote ID: ${quote._id}
            
            Departure: ${quote.deparature_airport_id} on ${quote.departureDate} at ${quote.departureTime}
            Arrival: ${quote.destination_airport_id}
            
            Flight Duration: ${quote.total_time} hours
            Distance: ${quote.total_distance} km
            
            Total Cost: ₹${quote.total_cost_with_gst?.toFixed(2)} (incl. GST)
        `;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `quote_${quote._id.slice(-6)}.txt`);
    };

    return (
        <div className="operator-quotes-container">
            <div className="quotes-header">
                <h1>
                    <FaPlane size={24} />
                    <span>Operator Flight Quotes</span>
                </h1>
                
                <div className="search-control">
                    <FiNavigation className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search quotes by ID or fleet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <img src={loadingGif} alt="Loading..." />
                </div>
            ) : filteredQuotes.length > 0 ? (
                <div className="quotes-list">
                    {filteredQuotes.map((quote) => (
                        <QuoteCard 
                            key={quote._id} 
                            quote={quote} 
                            onDownload={handleDownload}
                            isExpanded={expandedCards[quote._id]}
                            onToggle={() => toggleCard(quote._id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <FiAirplay size={48} />
                    <h3>No quotes found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
};

const QuoteCard = ({ quote, onDownload, isExpanded, onToggle }) => {
    return (
        <div className={`quote-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="card-header" onClick={onToggle}>
                <div className="header-content">
                    <div className="fleet-info">
                        <h2>
                            <FiAirplay size={18} />
                            <span>{quote.fleet?.name || "Unnamed Fleet"}</span>
                        </h2>
                        <div className="fleet-details">
                            <DetailItem 
                                icon={<FiTag size={14} />}
                                label="Reg No:"
                                value={quote.fleet?.aircraftRegn || "N/A"}
                            />
                            <DetailItem 
                                icon={<FiTag size={14} />}
                                label="Quote ID:"
                                value={quote._id}
                                truncate
                            />
                        </div>
                    </div>
                    <div className="header-actions">
                        <button 
                            className="download-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDownload(quote);
                            }}
                            title="Download Quote Details"
                        >
                            <FiDownload size={16} />
                        </button>
                        {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="card-body">
                    <div className="flight-section">
                        <DetailSection 
                            icon={<FiMapPin size={16} />}
                            title="Departure"
                        >
                            <DetailItem 
                                icon={<FaRegCalendarAlt size={14} />}
                                value={`${quote.departureDate} at ${quote.departureTime}`}
                            />
                            <DetailItem 
                                icon={<FiMapPin size={14} />}
                                value={quote.deparature_airport_id}
                            />
                        </DetailSection>

                        <DetailSection 
                            icon={<FiMapPin size={16} />}
                            title="Arrival"
                        >
                            <DetailItem 
                                icon={<FiMapPin size={14} />}
                                value={quote.destination_airport_id}
                            />
                        </DetailSection>
                    </div>

                    <div className="flight-section">
                        <DetailSection 
                            icon={<FiNavigation size={16} />}
                            title="Flight Info"
                        >
                            <DetailItem 
                                icon={<FiClock size={14} />}
                                label="Duration:"
                                value={`${quote.total_time} hours`}
                            />
                            <DetailItem 
                                icon={<FiNavigation size={14} />}
                                label="Distance:"
                                value={`${quote.total_distance} km`}
                            />
                        </DetailSection>
                    </div>

                    <div className="price-section">
                        <DetailSection 
                            icon={<FiDollarSign size={16} />}
                            title="Pricing"
                        >
                            <div className="price-display">
                                <FaRegMoneyBillAlt size={18} />
                                <span>₹{quote.total_cost_with_gst?.toFixed(2)} (incl. GST)</span>
                            </div>
                        </DetailSection>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ icon, label, value, truncate = false }) => (
    <div className={`detail-item ${truncate ? 'truncate' : ''}`}>
        {icon && <span className="detail-icon">{icon}</span>}
        {label && <span className="detail-label">{label}</span>}
        <span className="detail-value">{value}</span>
    </div>
);

const DetailSection = ({ icon, title, children }) => (
    <div className="detail-section">
        <div className="section-header">
            {icon}
            <h3>{title}</h3>
        </div>
        <div className="section-content">
            {children}
        </div>
    </div>
);

// CSS Styles
const styles = `
.operator-quotes-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}

.quotes-header {
    margin-bottom: 25px;
}

.quotes-header h1 {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    color: #2c3e50;
    margin-bottom: 20px;
}

.search-control {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 8px;
    padding: 0 15px;
    border: 1px solid #e0e0e0;
    height: 44px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.search-control input {
    border: none;
    outline: none;
    background: transparent;
    padding: 10px 8px;
    width: 100%;
    font-size: 14px;
    color: #333;
}

.search-icon {
    color: #3498db;
    margin-right: 8px;
}

.loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
}

.loading-state img {
    width: 80px;
}

.quotes-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.quote-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    border: 1px solid #e0e0e0;
    transition: all 0.3s ease;
}

.quote-card.expanded {
    border-color: #3498db;
}

.card-header {
    padding: 15px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    transition: background 0.2s;
}

.card-header:hover {
    background: #f1f3f5;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
}

.fleet-info h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    color: #2c3e50;
    margin-bottom: 8px;
}

.fleet-details {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.download-btn {
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.2s;
}

.download-btn:hover {
    background: #2980b9;
}

.card-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.flight-section, .price-section {
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.detail-section {
    margin-bottom: 10px;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: #2c3e50;
}

.section-header h3 {
    font-size: 16px;
    font-weight: 600;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    margin-bottom: 8px;
    color: #34495e;
}

.detail-item.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}

.detail-icon {
    color: #3498db;
    min-width: 16px;
}

.detail-label {
    font-weight: 500;
    color: #7f8c8d;
    min-width: 70px;
}

.detail-value {
    font-weight: 500;
}

.price-display {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #27ae60;
    margin-top: 8px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: white;
    border-radius: 10px;
    text-align: center;
    color: #7f8c8d;
    border: 1px solid #e0e0e0;
}

.empty-state svg {
    margin-bottom: 16px;
    color: #bdc3c7;
}

.empty-state h3 {
    font-size: 18px;
    margin-bottom: 8px;
    color: #2c3e50;
}

@media (max-width: 600px) {
    .operator-quotes-container {
        padding: 15px;
    }
    
    .header-content {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .header-actions {
        width: 100%;
        justify-content: space-between;
    }
    
    .fleet-details {
        flex-direction: column;
        gap: 8px;
    }
    
    .flight-section, .price-section {
        padding: 12px;
    }
}
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default OperatorQuotes;