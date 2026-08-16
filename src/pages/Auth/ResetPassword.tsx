import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, type ResetPasswordFormData } from "../../schemas/profileSchema";
import { useForm } from "react-hook-form";
import { promiseToast } from "../../utils/utils";
import useResetPassword from "../../hooks/patient/use-reset-password.hook";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import Textfield from "../../components/ui/Textfield";

export default function ResetPassword() {
    const resetPasswordMutation = useResetPassword();
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            return;
        }

        promiseToast(
            resetPasswordMutation.mutateAsync({
                password: data.newPassword,
                token,
            }),
            "top-center",
            () => navigate('/login')
        );
    };

    return (
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
            <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* Left */}
                <div className="hidden lg:flex flex-col justify-center bg-[#1E3D15] text-white p-12">
                    <div className="w-16 h-16 rounded-2xl bg-green-800 flex items-center justify-center">
                        <ShieldCheck size={34} />
                    </div>

                    <h1 className="mt-8 text-4xl font-bold leading-tight">
                        Secure Account Recovery
                    </h1>

                    <p className="mt-5 text-green-100 text-lg leading-relaxed">
                        Create a new password to securely regain access to
                        your Bagumbayan Healthcare Scheduling System account.
                    </p>

                    <span className="mt-8 bg-green-700 w-fit px-4 py-2 rounded-full text-sm font-medium">
                        Barangay Bagumbayan Health Center
                    </span>
                </div>

                {/* Right */}
                <div className="p-8 md:p-12 flex items-center">
                    <div className="w-full max-w-md mx-auto">

                        <h2 className="text-3xl font-bold text-[#1E3D15]">
                            Reset Password
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Create a new password for your account.
                        </p>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-8 space-y-5"
                        >
                            <Textfield
                                label="New Password"
                                type="password"
                                placeholder="Enter your new password"
                                icon={<Lock size={20} />}
                                registration={register("newPassword")}
                                error={errors.newPassword?.message}
                            />

                            <Textfield
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm your new password"
                                icon={<Lock size={20} />}
                                registration={register("confirmPassword")}
                                error={errors.confirmPassword?.message}
                            />

                            <button
                                type="submit"
                                disabled={
                                    resetPasswordMutation.isPending ||
                                    !token
                                }
                                className="w-full bg-[#1E3D15] hover:bg-green-800
                                    disabled:bg-gray-400 disabled:cursor-not-allowed
                                    text-white font-semibold py-3 rounded-xl transition"
                            >
                                {resetPasswordMutation.isPending
                                    ? "Resetting..."
                                    : "Reset Password"}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-sm text-[#1E3D15] font-medium hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}