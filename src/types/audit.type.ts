import type { Admin } from "./admin.type";
import type { Staff } from "./staff.type";

export interface Audit {
    id: number;

    userId: number;
    userType: "Admin" | "Staff";

    action: string;
    entity: string;
    entityId: string;

    severity: "INFO" | "WARNING" | "CRITICAL";

    oldValues: object;
    newValues: object;

    ipAddress: string;
    userAgent: string;

    staff: Staff;
    admin: Admin;

    createdAt?: Date;
    updatedAt?: Date;
}