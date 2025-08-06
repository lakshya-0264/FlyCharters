import { FleetModel } from '../../Models/fleetModel.js';
import { FlightModel } from '../../Models/flightsModel.js';
import User from '../../Models/userModel.js';
import { Operator_Model } from '../../Models/operatorModel.js';
import { Quote_Model } from '../../Models/QuotesModel.js';
import { EmptyLegModel } from '../../Models/emptylegModel.js';
import { EmptyLegBookingModel } from '../../Models/emptylegbookingModel.js';
import { AirportModel } from '../../Models/AirportModel.js';
import { Distance_Model } from '../../Models/DistanceModel.js';

class AnalyticsController {
  
  // 1. Dashboard Overview
  static async getOverview(req, res) {
    try {
      const [
        totalBookings,
        totalRevenue,
        activeFleets,
        totalUsers,
        pendingOperators,
        thisMonthBookings,
        thisMonthRevenue
      ] = await Promise.all([
        FlightModel.countDocuments({ payment_status: 'booked' }),
        FlightModel.aggregate([
          { $match: { payment_status: 'booked' } },
          { $lookup: { from: 'quote_models', localField: 'quote_id', foreignField: '_id', as: 'quote' } },
          { $unwind: '$quote' },
          { $group: { _id: null, total: { $sum: '$quote.total_cost_with_gst' } } }
        ]),
        FleetModel.countDocuments({ status: 'available', isAdminVerify: true }),
        User.countDocuments(),
        Operator_Model.countDocuments({ verified_documents: false }),
        FlightModel.countDocuments({
          payment_status: 'booked',
          booking_time: { $gte: new Date(new Date().setDate(1)) }
        }),
        FlightModel.aggregate([
          { 
            $match: { 
              payment_status: 'booked',
              booking_time: { $gte: new Date(new Date().setDate(1)) }
            }
          },
          { $lookup: { from: 'quote_models', localField: 'quote_id', foreignField: '_id', as: 'quote' } },
          { $unwind: '$quote' },
          { $group: { _id: null, total: { $sum: '$quote.total_cost_with_gst' } } }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalBookings,
          totalRevenue: totalRevenue[0]?.total || 0,
          activeFleets,
          totalUsers,
          pendingOperators,
          thisMonthBookings,
          thisMonthRevenue: thisMonthRevenue[0]?.total || 0,
          revenueGrowth: thisMonthRevenue[0]?.total && totalRevenue[0]?.total 
            ? ((thisMonthRevenue[0].total / totalRevenue[0].total) * 100).toFixed(2) 
            : 0
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching overview data',
        error: error.message 
      });
    }
  }

  // 2. Revenue Analytics
  static async getRevenueAnalytics(req, res) {
    try {
      const { period = '12months', type = 'monthly' } = req.query;
      
      let dateFilter = {};
      let groupBy = {};
      
      if (period === '12months') {
        dateFilter = { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };
        groupBy = type === 'monthly' 
          ? { year: { $year: '$booking_time' }, month: { $month: '$booking_time' } }
          : { year: { $year: '$booking_time' }, week: { $week: '$booking_time' } };
      }

      const [revenueData, emptyLegRevenue] = await Promise.all([
        FlightModel.aggregate([
          { $match: { payment_status: 'booked', booking_time: dateFilter } },
          { $lookup: { from: 'quote_models', localField: 'quote_id', foreignField: '_id', as: 'quote' } },
          { $unwind: '$quote' },
          {
            $group: {
              _id: groupBy,
              totalRevenue: { $sum: '$quote.total_cost_with_gst' },
              totalBookings: { $sum: 1 },
              averageBookingValue: { $avg: '$quote.total_cost_with_gst' }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
        ]),
        EmptyLegBookingModel.aggregate([
          { $match: { payment_status: 'paid', createdAt: dateFilter } },
          {
            $group: {
              _id: groupBy,
              totalRevenue: { $sum: '$total_amount' },
              totalBookings: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: { 
          charterRevenue: revenueData, 
          emptyLegRevenue,
          period,
          type
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching revenue analytics',
        error: error.message 
      });
    }
  }

  // 3. Booking Analytics
  static async getBookingAnalytics(req, res) {
    try {
      const { period = '30days' } = req.query;
      
      const dateFilter = period === '30days' 
        ? { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        : { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };

      const [bookingStats, statusBreakdown, roundTripStats] = await Promise.all([
        FlightModel.aggregate([
          { $match: { booking_time: dateFilter } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$booking_time' } },
              totalBookings: { $sum: 1 },
              confirmedBookings: { $sum: { $cond: [{ $eq: ['$payment_status', 'booked'] }, 1, 0] } },
              cancelledBookings: { $sum: { $cond: [{ $eq: ['$payment_status', 'cancelled'] }, 1, 0] } }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        FlightModel.aggregate([
          { $group: { _id: '$payment_status', count: { $sum: 1 } } }
        ]),
        FlightModel.aggregate([
          {
            $group: {
              _id: '$is_round_trip',
              count: { $sum: 1 },
              percentage: { $avg: { $cond: ['$is_round_trip', 100, 0] } }
            }
          }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          dailyBookings: bookingStats,
          statusBreakdown,
          roundTripStats,
          period
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching booking analytics',
        error: error.message 
      });
    }
  }

  // 4. Fleet Utilization Analytics
  static async getFleetUtilization(req, res) {
    try {
      const [fleetUtilization, aircraftTypeStats, capacityUtilization] = await Promise.all([
        FleetModel.aggregate([
          { $match: { isAdminVerify: true } },
          {
            $lookup: {
              from: 'quote_models',
              localField: '_id',
              foreignField: 'fleet_request_id',
              as: 'quotes'
            }
          },
          {
            $lookup: {
              from: 'flightmodels',
              localField: 'quotes._id',
              foreignField: 'quote_id',
              as: 'flights'
            }
          },
          {
            $project: {
              name: 1,
              model: 1,
              capacity: 1,
              status: 1,
              totalBookings: { $size: { $filter: { input: '$flights', cond: { $eq: ['$$this.payment_status', 'booked'] } } } },
              totalQuotes: { $size: '$quotes' },
              utilizationRate: {
                $multiply: [
                  { $divide: [{ $size: { $filter: { input: '$flights', cond: { $eq: ['$$this.payment_status', 'booked'] } } } }, { $max: [{ $size: '$quotes' }, 1] }] },
                  100
                ]
              }
            }
          },
          { $sort: { utilizationRate: -1 } }
        ]),
        Quote_Model.aggregate([
          {
            $lookup: {
              from: 'fleets',
              localField: 'fleet_request_id',
              foreignField: '_id',
              as: 'fleet'
            }
          },
          { $unwind: '$fleet' },
          {
            $group: {
              _id: '$fleet.model',
              totalQuotes: { $sum: 1 },
              avgCost: { $avg: '$total_cost_with_gst' },
              totalRevenue: { $sum: '$total_cost_with_gst' }
            }
          },
          { $sort: { totalQuotes: -1 } }
        ]),
        FleetModel.aggregate([
          {
            $bucket: {
              groupBy: '$capacity',
              boundaries: [0, 6, 10, 15, 20, 100],
              default: '20+',
              output: {
                count: { $sum: 1 },
                avgPricePerHour: { $avg: '$price_per_hour' }
              }
            }
          }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          fleetUtilization,
          aircraftTypeStats,
          capacityUtilization
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching fleet utilization data',
        error: error.message 
      });
    }
  }

  // 5. Operator Analytics
  static async getOperatorAnalytics(req, res) {
    try {
      const [operatorStats, topOperators, verificationStats] = await Promise.all([
        Operator_Model.aggregate([
          {
            $lookup: {
              from: 'fleets',
              localField: 'operatorid',
              foreignField: 'operatorId',
              as: 'fleets'
            }
          },
          {
            $project: {
              name: 1,
              location: 1,
              verified_documents: 1,
              numAircraft: 1,
              actualAircraft: { $size: '$fleets' },
              verifiedAircraft: { $size: { $filter: { input: '$fleets', cond: '$$this.isAdminVerify' } } }
            }
          }
        ]),
        Operator_Model.aggregate([
          {
            $lookup: {
              from: 'fleets',
              localField: 'operatorid',
              foreignField: 'operatorId',
              as: 'fleets'
            }
          },
          {
            $lookup: {
              from: 'quote_models',
              localField: 'fleets._id',
              foreignField: 'fleet_request_id',
              as: 'quotes'
            }
          },
          {
            $project: {
              name: 1,
              totalFleets: { $size: '$fleets' },
              totalQuotes: { $size: '$quotes' },
              totalRevenue: { $sum: '$quotes.total_cost_with_gst' }
            }
          },
          { $sort: { totalRevenue: -1 } },
          { $limit: 10 }
        ]),
        Operator_Model.aggregate([
          {
            $group: {
              _id: '$verified_documents',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          operatorStats,
          topOperators,
          verificationStats
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching operator analytics',
        error: error.message 
      });
    }
  }

  // 6. Route Analytics
  static async getRouteAnalytics(req, res) {
    try {
      const [popularRoutes, airportStats, distanceAnalysis] = await Promise.all([
        Quote_Model.aggregate([
          {
            $lookup: {
              from: 'airports',
              localField: 'deparature_airport_id',
              foreignField: '_id',
              as: 'departure'
            }
          },
          {
            $lookup: {
              from: 'airports',
              localField: 'destination_airport_id',
              foreignField: '_id',
              as: 'destination'
            }
          },
          { $unwind: '$departure' },
          { $unwind: '$destination' },
          {
            $group: {
              _id: {
                from: '$departure.airport_name',
                to: '$destination.airport_name',
                fromCode: '$departure.source_IATA',
                toCode: '$destination.source_IATA'
              },
              totalBookings: { $sum: 1 },
              avgCost: { $avg: '$total_cost_with_gst' },
              totalRevenue: { $sum: '$total_cost_with_gst' },
              avgDistance: { $avg: '$total_distance' },
              avgTime: { $avg: '$total_time' }
            }
          },
          { $sort: { totalBookings: -1 } },
          { $limit: 20 }
        ]),
        AirportModel.aggregate([
          {
            $lookup: {
              from: 'quote_models',
              localField: '_id',
              foreignField: 'deparature_airport_id',
              as: 'departureQuotes'
            }
          },
          {
            $lookup: {
              from: 'quote_models',
              localField: '_id',
              foreignField: 'destination_airport_id',
              as: 'arrivalQuotes'
            }
          },
          {
            $project: {
              airport_name: 1,
              source_IATA: 1,
              classification: 1,
              totalDepartures: { $size: '$departureQuotes' },
              totalArrivals: { $size: '$arrivalQuotes' },
              totalTraffic: { $add: [{ $size: '$departureQuotes' }, { $size: '$arrivalQuotes' }] }
            }
          },
          { $sort: { totalTraffic: -1 } },
          { $limit: 15 }
        ]),
        Quote_Model.aggregate([
  {
    $bucket: {
      groupBy: '$total_distance',
      boundaries: Array.from({ length: 21 }, (_, i) => i * 500), // [0, 500, 1000, ..., 10000]
      default: 10500, // Catch-all bucket for distances > 10000
      output: {
        count: { $sum: 1 },
        avgCost: { $avg: '$total_cost_with_gst' },
        avgTime: { $avg: '$total_time' }
      }
    }
  },
  {
    $addFields: {
      rangeLabel: {
        $cond: [
          { $eq: ['$_id', 10500] },
          '10000+ km',
          {
            $concat: [
              { $toString: '$_id' },
              '–',
              { $toString: { $add: ['$_id', 500] } },
              ' km'
            ]
          }
        ]
      }
    }
  },
  {
    $project: {
      _id: 0,
      range: '$rangeLabel',
      count: 1,
      avgCost: 1,
      avgTime: 1
    }
  }
])

      ]);

      res.status(200).json({
        success: true,
        data: {
          popularRoutes,
          busyAirports: airportStats,
          distanceAnalysis
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching route analytics',
        error: error.message 
      });
    }
  }

  // Add more controller methods for other endpoints...
  // (Customer analytics, pricing analytics, empty legs, performance metrics)
}

export default AnalyticsController;