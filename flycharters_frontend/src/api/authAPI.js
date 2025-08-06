import axios from 'axios';

export const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    withCredentials: true,
});

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const verifyEmail = (data) => API.post('/auth/verify', data);
export const signin = (data) => API.post('/auth/signin', data); 
export const resendOtp = ({ email }) => API.post('/auth/resend-verification', { email });
export const getCurrentUser =() => API.get('/auth/me')
export const logout = () => API.post('/auth/logout');


// Fleet
export const addFleet = (data) => API.post('/fleet/addfleet', data);
export const deleteFleet = (fleetId) => API.delete(`/fleet/deletefleet/${fleetId}`);
export const updateFleet = (fleetId, data) => {
    return API.patch(`/fleet/updatefleet/${fleetId}`, data); // No headers
};

export const getFleetDetails = (fleetId) => API.get(`/fleet/fleetbyid/${fleetId}`);

// Flight
// export const addFlight = (data) => axios.post("/flight/create_flight", data);

// Operator
export const createOperator = (data) => API.post('/ope/create_op', data);
export const getOperatorById = () => API.get(`/ope/get_operator_login`);


// Empty Legs


export const getFleetAircrafts = (operatorId) =>
  API.get(`/fleet/fleetoperator/${operatorId}`);

export const addEmptyLeg = (fleetId, takeoffAirportId, destinationAirportId, data) =>
  API.post(`/empty/add_empty/${fleetId}/${takeoffAirportId}/${destinationAirportId}`, data);

export const getAllAirports = () => API.get('/air_port/get_all_airport');
export const getAirportById = (airportId) => API.get(`/air_port/getairportbyid/${airportId}`);
export const getOperatorByOptId = (operatorId) => API.get(`/ope/getOperatorByOperator/${operatorId}`);


export const createCapabilities = (data) => API.post('/ope/CreateCapabilities', data);
export const getFlightsById = () => API.get('/flight/operator');


export const getQuotesByOperator = async (operatorId) => { return API.get(`/qu/qut/operator/${operatorId}`);};

//Notification
export const getNotifications = () => API.get(`/notify/getnotification`);
export const markNotificationsAsRead = () => API.patch('/notify/notifications/mark-read');

//chats/ messages
export const getMessages = (params) => API.get('/message/getmessages', { params });
export const getChats = () => API.get('/message/getChats');

