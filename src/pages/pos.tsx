import { PageHeader } from "@/components/shared/page-header";

export function Component() {
  return (
    <div>
      <PageHeader title="ขายสินค้า" description="หน้าขาย POS" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-muted-foreground">
            รายการสินค้าจะแสดงที่นี่
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">
            ตะกร้าสินค้าจะแสดงที่นี่
          </p>
        </div>
      </div>
    </div>
  );
}
