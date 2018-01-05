/**
 * Created by piyushkantm on 20/06/17.
 */
export interface OwnerDashStats {
  stats: {
    total_revenue: number;
    total_expenses: number;
    paid_earnings: number;
  };
  days_booked: number;
}
