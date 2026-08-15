import { useForm } from "react-hook-form";
import { PasswordSchema, type PasswordFormData } from "../../schemas/profileSchema";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import Textfield from "../ui/Textfield";
import Button from "../ui/Button";

interface ChangePasswordProps {
    close: () => void;
    show: boolean;
    loading: boolean;
    submit: (data : PasswordFormData) => void | Promise<void>;
}

export default function ChangePassword ({
    close,
    show,
    submit,
    loading
} : ChangePasswordProps) {
    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(PasswordSchema),
        defaultValues: {
            confirmPassword: "",
            currentPassword: "",
            newPassword: ""
        },
    });

    return (
        <Modal
            onClose={close}
            open={show}
        >
            <Card className="flex flex-col gap-5">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(submit)}>
                    <h1 className="text-xl font-bold text-[#1E3D15]">Change Password</h1>
                    <Textfield 
                        className="text-sm"
                        type="password"
                        registration={register("currentPassword")}
                        label="Current Password"
                        placeholder="Enter your current password"
                        error={errors.currentPassword?.message}
                    />
                    <Textfield 
                        className="text-sm"
                        type="password"
                        registration={register("newPassword")}
                        label="New Password"
                        placeholder="Enter your new password"
                        error={errors.newPassword?.message}
                    />
                    <Textfield 
                        className="text-sm"
                        type="password"
                        registration={register("confirmPassword")}
                        label="Confirm Password"
                        placeholder="Confirm your new password"
                        error={errors.confirmPassword?.message}
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                    >Change Password</Button>
                </form>
            </Card>
        </Modal>
    )
}