import { useState } from "react";
import type { PasswordFormData, ProfileFormData } from "../../../schemas/profileSchema";
import { promiseToast } from "../../../utils/utils";
import Profile from "../../shared/Profile"
import Button from "../../ui/Button";
import ChangePassword from "../../shared/ChangePassword";
import useStaffChangePassword from "../../../hooks/staff/use-staff-change-password.hook";
import useUpdateStaffProfile from "../../../hooks/staff/use-update-staff-profile.hook";

export default function StaffProfile () {
    const [showChangePass, setShowChangePass] = useState(false);
    
    const changePasswordMutation = useStaffChangePassword();;
    const updateStaffMutation = useUpdateStaffProfile();

    const handleSubmit = (data : ProfileFormData) => {
        promiseToast(updateStaffMutation.mutateAsync(data));
    }

    const handleChangePassword = (data : PasswordFormData) => {
        const isConfirm = confirm("Are you sure you want to change your password?");

        if(!isConfirm) return;

        promiseToast(changePasswordMutation.mutateAsync(data));
    }

    return (
        <div className="p-5">
            <div className="flex justify-end w-full">
                <Button
                    className="text-sm"
                    onClick={() => setShowChangePass(true)}
                >Change Password</Button>
            </div>
            <Profile 
                submit={handleSubmit} 
                loading={updateStaffMutation.isPending} 
            />
            <ChangePassword 
                close={() => setShowChangePass(false)}
                show={showChangePass}
                submit={handleChangePassword}
                loading={changePasswordMutation.isPending}
            />
        </div>
    )
}