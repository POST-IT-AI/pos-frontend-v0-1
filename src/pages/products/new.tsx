import { PageHeader } from "@/components/shared/page-header";

export function Component() {
  return (
    <div>
      <PageHeader title="เพิ่มสินค้าใหม่" description="กรอกรายละเอียดสินค้า" />
      <p className="text-muted-foreground">ฟอร์มเพิ่มสินค้าจะแสดงที่นี่</p>
    </div>
  );
}
