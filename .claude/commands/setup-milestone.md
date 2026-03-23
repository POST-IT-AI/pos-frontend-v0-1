สร้าง GitHub Milestones สำหรับ milestone workflow (one-time setup ต่อ repo)

## ขั้นตอน

### Step 1: ตรวจสอบ gh auth

รัน `gh auth status` เพื่อตรวจว่า login แล้ว ถ้ายังไม่ login ให้แจ้ง user

### Step 2: ตรวจสอบ milestones ที่มีอยู่แล้ว

รัน `gh api repos/{owner}/{repo}/milestones?state=all --jq '.[].title'` เพื่อดูว่ามี milestone ไหนอยู่แล้วบ้าง — ถ้ามีครบแล้วให้แจ้ง user ว่าไม่ต้องสร้างเพิ่ม

### Step 3: สร้าง milestones ทั้งหมด

สร้าง milestones ทีละตัว — ถ้ามีอยู่แล้วให้ข้ามไป:

```bash
gh api repos/{owner}/{repo}/milestones -f title="PENDING" -f description="รอเริ่มงาน (Human)"
gh api repos/{owner}/{repo}/milestones -f title="DOING" -f description="AI กำลังสร้าง plan"
gh api repos/{owner}/{repo}/milestones -f title="WAITING_APPROVE_PLAN" -f description="รอ human review plan (AI)"
gh api repos/{owner}/{repo}/milestones -f title="APPROVE_PLAN" -f description="Plan approved (Human)"
gh api repos/{owner}/{repo}/milestones -f title="WAITING_APPROVE_CODE" -f description="รอ human review code/PR (AI)"
gh api repos/{owner}/{repo}/milestones -f title="APPROVE_CODE" -f description="Code approved (Human)"
gh api repos/{owner}/{repo}/milestones -f title="DONE" -f description="เสร็จสมบูรณ์ (AI)"
gh api repos/{owner}/{repo}/milestones -f title="REJECT_PLAN" -f description="Plan ถูก reject (Human)"
gh api repos/{owner}/{repo}/milestones -f title="REJECT_CODE" -f description="Code ถูก reject (Human)"
```

### Step 4: ตรวจสอบผลลัพธ์

รัน `gh api repos/{owner}/{repo}/milestones?state=all --jq '.[].title'` แล้วแสดงผลให้ user

### Step 5: แจ้ง user

```
✓ สร้าง milestones สำหรับ milestone workflow เสร็จแล้ว

  | Milestone             | ผู้รับผิดชอบ |
  |-----------------------|------------|
  | PENDING               | Human      |
  | DOING                 | AI         |
  | WAITING_APPROVE_PLAN  | AI         |
  | APPROVE_PLAN          | Human      |
  | WAITING_APPROVE_CODE  | AI         |
  | APPROVE_CODE          | Human      |
  | DONE                  | AI         |
  | REJECT_PLAN           | Human      |
  | REJECT_CODE           | Human      |
```