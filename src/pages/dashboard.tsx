import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  titleKey: string;
  value: string;
  icon: LucideIcon;
}

const statItems: StatItem[] = [
  { titleKey: "stats.todaySales", value: "฿0.00", icon: DollarSign },
  { titleKey: "stats.todayOrders", value: "0", icon: ShoppingCart },
  { titleKey: "stats.totalProducts", value: "0", icon: Package },
  { titleKey: "stats.todayProfit", value: "฿0.00", icon: TrendingUp },
];

export function Component() {
  const { t } = useTranslation("dashboard");
  const { t: tc } = useTranslation("common");

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <Card key={stat.titleKey}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {t(stat.titleKey)}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {tc("system.waitingApi")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
