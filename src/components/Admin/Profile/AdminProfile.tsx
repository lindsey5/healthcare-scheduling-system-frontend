import { useState } from "react";
import type { PasswordFormData, ProfileFormData } from "../../../schemas/profileSchema";
import { promiseToast } from "../../../utils/utils";
import Profile from "../../shared/Profile"
import Button from "../../ui/Button";
import ChangePassword from "../../shared/ChangePassword";
import useUpdateAdminProfile from "../../../hooks/admin/use-update-admin-profile.hook";
import useAdminChangePassword from "../../../hooks/admin/use-admin-change-password.hook";

export default function AdminProfile () {
    const [showChangePass, setShowChangePass] = useState(false);
    
    const changePasswordMutation = useAdminChangePassword();
    const updateAdminMutation = useUpdateAdminProfile();

    const handleSubmit = (data : ProfileFormData) => {
        promiseToast(updateAdminMutation.mutateAsync(data));
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
                loading={updateAdminMutation.isPending} 
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