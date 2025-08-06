import { Router } from "express";
import AnalyticsController from '../../Controllers/analyticsController/analyticsController.js';
import { AdminBasedMiddleware } from '../../Middlewares/adminMiddleware.js';
import { createCapabilities } from '../../Controllers/aircraft_controller/aircraft_controller.js'
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
import { OperatorBasedMiddleware } from "../../Middlewares/operatormiddleware.js";
import { upload } from "../../Middlewares/multerMiddleware.js";

const AnalyticsRouter = Router();

// Apply authentication middleware chain to all analytics routes
// First authenticate the user, then check if they're admin
AnalyticsRouter.use(authmiddleware, AdminBasedMiddleware);

// Dashboard overview
AnalyticsRouter.get('/overview', AnalyticsController.getOverview);

// Revenue analytics
AnalyticsRouter.get('/revenue', AnalyticsController.getRevenueAnalytics);

// Booking analytics
AnalyticsRouter.get('/bookings', AnalyticsController.getBookingAnalytics);

// Fleet utilization
AnalyticsRouter.get('/fleet-utilization', AnalyticsController.getFleetUtilization);

// Operator analytics
AnalyticsRouter.get('/operators', AnalyticsController.getOperatorAnalytics);

// Route analytics
AnalyticsRouter.get('/routes', AnalyticsController.getRouteAnalytics);

// Customer analytics
// AnalyticsRouter.get('/customers', AnalyticsController.getCustomerAnalytics);

// Pricing analytics
// AnalyticsRouter.get('/pricing', AnalyticsController.getPricingAnalytics);

// // Empty leg analytics
// AnalyticsRouter.get('/empty-legs', AnalyticsController.getEmptyLegAnalytics);

// Performance metrics
// AnalyticsRouter.get('/performance', AnalyticsController.getPerformanceMetrics);

export { AnalyticsRouter };