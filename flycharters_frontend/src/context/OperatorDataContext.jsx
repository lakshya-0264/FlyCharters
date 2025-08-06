// src/context/OperatorDataContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const OperatorDataContext = createContext();

export const OperatorDataProvider = ({ children }) => {
    const [fleets, setFleets] = useState([]);
    const [flights, setFlights] = useState([]);
    const [emptyLegs, setEmptyLegs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // console.log('fleet',user);
        if (!user?.operatorId) return;

        const fetchData = async () => {
        try {
            setLoading(true);
            const [fleetsRes, flightsRes, emptyLegsRes] = await Promise.all([
            fetch(`http://localhost:8080/fleet/fleetoperator/${user.operatorId}`),
            fetch(`http://localhost:8080/flight/operator/${user.operatorId}`),
            fetch(`http://localhost:8080/empty/getEmptyLegByOperator/${user.operatorId}`)
            ]);

            const [fleetsData, flightsData, emptyLegsData] = await Promise.all([
            fleetsRes.json(),
            flightsRes.json(),
            emptyLegsRes.json()
            ]);

            if (fleetsData.success) setFleets(fleetsData.data);
            if (flightsData.success) setFlights(flightsData.data);
            if (emptyLegsData.success) setEmptyLegs(emptyLegsData.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [user?.operatorId]);

    const value = {
        fleets,
        flights,
        emptyLegs,
        loading,
        error,
        refresh: () => {
        // You can implement a refresh function if needed
        }
    };

    return (
        <OperatorDataContext.Provider value={value}>
        {children}
        </OperatorDataContext.Provider>
    );
    };

    export const useOperatorData = () => {
    const context = useContext(OperatorDataContext);
    if (!context) {
        throw new Error('useOperatorData must be used within an OperatorDataProvider');
    }
    return context;
};