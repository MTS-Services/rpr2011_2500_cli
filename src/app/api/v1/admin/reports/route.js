import { NextResponse } from 'next/server';

export async function GET() {
  const payload = {
    success: true,
    message: "Reports retrieved successfully",
    statusCode: 200,
    timestamp: "2026-04-01T04:02:33.470Z",
    data: {
      year: 2026,
      cards: {
        rentCollected: {
          value: 16300,
          label: "Year to date",
          changePercent: 100
        },
        outstandingBalance: {
          value: 119200,
          label: "Across 55 units",
          changePercent: 100
        },
        maintenanceCosts: {
          value: 50,
          label: "From recorded costs (1 items)",
          changePercent: 100
        }
      },
      monthlyChart: [
        { "month": "Jan", "monthKey": "2026-01", "collected": 0, "isFuture": false },
        { "month": "Feb", "monthKey": "2026-02", "collected": 0, "isFuture": false },
        { "month": "Mar", "monthKey": "2026-03", "collected": 0, "isFuture": false },
        { "month": "Apr", "monthKey": "2026-04", "collected": 7200, "isFuture": false },
        { "month": "May", "monthKey": "2026-05", "collected": 6900, "isFuture": true },
        { "month": "Jun", "monthKey": "2026-06", "collected": 2200, "isFuture": true },
        { "month": "Jul", "monthKey": "2026-07", "collected": 0, "isFuture": true },
        { "month": "Aug", "monthKey": "2026-08", "collected": 0, "isFuture": true },
        { "month": "Sep", "monthKey": "2026-09", "collected": 0, "isFuture": true },
        { "month": "Oct", "monthKey": "2026-10", "collected": 0, "isFuture": true },
        { "month": "Nov", "monthKey": "2026-11", "collected": 0, "isFuture": true },
        { "month": "Dec", "monthKey": "2026-12", "collected": 0, "isFuture": true }
      ]
    }
  };

  return NextResponse.json(payload);
}
