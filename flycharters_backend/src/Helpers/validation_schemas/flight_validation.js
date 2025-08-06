import { z } from "zod"
export const flightZodSchema = z.object({
    aircraftTypeId: z.string().length(24, 'Invalid aircraftTypeId'),
    departureAirportId: z.string().length(24, 'Invalid departureAirportId'),
    destinationAirportId: z.string().length(24, 'Invalid destinationAirportId')
        .refine((val, ctx) => val !== ctx?.parent?.departureAirportId, {
            message: "Departure and destination airports must be different"
        }),
    departureDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid departureDate"
    }),
    departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "departureTime must be in HH:MM format"
    }),
    arrivalDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid arrivalDate"
    }),
    arrivalTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "arrivalTime must be in HH:MM format"
    }),
    availableSeats: z.number().int().min(1, 'availableSeats must be a positive integer'),
    total_seats_given:z.number().int().min(5,"atleast 5 seats should be given"),
    pricePerSeat: z.number().min(0, 'pricePerSeat must be non-negative'),
    fullPlanePrice: z.number().min(0, 'fullPlanePrice must be non-negative'),
    status_requests:z.enum(["Open","Quoted","Rejected","Accepted"]).optional(),
    status: z.enum(['available', 'booked', 'cancelled','discuss']).optional()

}).refine((data)=>{
    const departure = new Date(data.departureDate);
    const arrival = new Date(data.arrivalDate);
    return arrival >= departure;
},{
    message: "arrivalDate cannot be before departureDate",
    path: ['arrivalDate']
})