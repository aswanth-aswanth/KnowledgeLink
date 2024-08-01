"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Overview } from "@/components/shared/Overview"
// import { RecentSales } from "@/components/shared/RecentSales"

export default function DashboardPage() {
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$45,231.89</p>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">+2350</p>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">+12,234</p>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          {/* <Overview /> */}
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <RecentSales /> */}
        </CardContent>
      </Card>
    </div>
  )
}