import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function Component() {
  return (
    <div>
      <PageHeader title="สินค้า" description="จัดการรายการสินค้า">
        <Link to="/products/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มสินค้า
        </Link>
      </PageHeader>
      <p className="text-muted-foreground">ตารางสินค้าจะแสดงที่นี่</p>
    </div>
  );
}
