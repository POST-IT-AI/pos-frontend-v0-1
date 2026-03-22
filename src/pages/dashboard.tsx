import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "ยอดขายวันนี้",
    value: "฿0.00",
    icon: DollarSign,
    description: "รอเชื่อมต่อ API",
  },
  {
    title: "ออเดอร์วันนี้",
    value: "0",
    icon: ShoppingCart,
    description: "รอเชื่อมต่อ API",
  },
  {
    title: "สินค้าทั้งหมด",
    value: "0",
    icon: Package,
    description: "รอเชื่อมต่อ API",
  },
  {
    title: "กำไรวันนี้",
    value: "฿0.00",
    icon: TrendingUp,
    description: "รอเชื่อมต่อ API",
  },
];

export function Component() {
  return (
    <div>
      <PageHeader
        title="แดชบอร์ด"
        description="ภาพรวมระบบ POS"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
