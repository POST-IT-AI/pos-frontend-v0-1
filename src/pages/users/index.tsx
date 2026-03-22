import { PageHeader } from "@/components/shared/page-header";

export function Component() {
  return (
    <div>
      <PageHeader title="ผู้ใช้" description="จัดการผู้ใช้ระบบ" />
      <p className="text-muted-foreground">ตารางผู้ใช้จะแสดงที่นี่</p>
    </div>
  );
}
