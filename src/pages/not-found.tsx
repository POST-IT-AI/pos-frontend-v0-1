import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export function Component() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">ไม่พบหน้าที่คุณต้องการ</p>
      <Link to="/dashboard" className={buttonVariants()}>
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
