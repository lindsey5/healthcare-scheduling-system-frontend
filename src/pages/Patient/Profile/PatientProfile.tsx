import { useState } from "react";
import useUpdatePatientOwn from "../../../hooks/patient/use-update-patient-own.hook"
import type { PasswordFormData, ProfileFormData } from "../../../schemas/profileSchema";
import { promiseToast } from "../../../utils/utils";
import Profile from "../../../components/shared/Profile"
import Button from "../../../components/ui/Button";
import ChangePassword from "../../../components/shared/ChangePassword";
import usePatientChangePassword from "../../../hooks/patient/use-patient-change-password.hook";

export default function PatientProfile () {
    const [showChangePass, setShowChangePass] = useState(false);
    
    const changePasswordMutation = usePatientChangePassword();
    const updatePatientMutation = useUpdatePatientOwn();

    const handleSubmit = (data : ProfileFormData) => {
        promiseToast(updatePatientMutation.mutateAsync(data));
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
                loading={updatePatientMutation.isPending} 
                canEditEmail={false}
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