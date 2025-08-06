class FleetCompleteDetails{
    constructor(Fleet_detail, total_cost,total_time, total_distance,leg_distances, leg_times,gst_cost){
        this.fleet=Fleet_detail,
        this.total_cost=total_cost,
        this.total_time=total_time,
        this.total_distance=total_distance,
        this.leg_distances=leg_distances,
        this.leg_times=leg_times
        this.total_cost_with_gst=gst_cost
    }
}
export {FleetCompleteDetails}