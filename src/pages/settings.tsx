import { PageHeader } from "@/components/shared/page-header";

export function Component() {
  return (
    <div>
      <PageHeader title="ตั้งค่า" description="ตั้งค่าระบบ" />
      <p className="text-muted-foreground">หน้าตั้งค่าจะแสดงที่นี่</p>
    </div>
  );
}
