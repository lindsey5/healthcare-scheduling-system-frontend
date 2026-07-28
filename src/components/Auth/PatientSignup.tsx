import { Link, Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import Textfield from "../ui/Textfield";
import { useForm } from "react-hook-form";
import { type CreateUserFormData, CreateUserSchema } from "../../schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { promiseToast } from "../../utils/utils";
import { useState } from "react";
import useVerifyUser from "../../hooks/patient/use-verify-patient.hook";
import useRegisterPatient from "../../hooks/patient/use-register-patient.hook";
import { useAuthStore } from "../../lib/store/authStore";

type VerificationModalProps = {
    open: boolean;
    email: string;
};

export function VerificationModal({
    open,
    email,
}: VerificationModalProps) {
    const navigate = useNavigate();
    const verifyUserMutation = useVerifyUser();
    const [verificationCode, setVerificationCode] = useState('');

    const onClose = () => window.location.reload();

    const onSubmit = () => {
        promiseToast(verifyUserMutation.mutateAsync({
            email, 
            verificationCode
        }), "top-center", () => navigate('/patient'))
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <Mail className="text-[#1E3D15]" size={30} />
                    </div>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-center text-[#1E3D15]">
                    Verify Your Email
                </h2>

                <p className="mt-3 text-gray-500 text-center">
                    We've sent a verification code to
                </p>

                <p className="font-semibold text-center text-[#1E3D15] mt-1 break-all">
                    {email}
                </p>

                <div className="mt-6">
                    <Textfield
                        label="Verification Code"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        icon={<ShieldCheck size={20} />}
                        maxLength={6}
                    />
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={verifyUserMutation.isPending || !verificationCode}
                        className="flex-1 bg-[#1E3D15] text-white rounded-xl py-3 font-semibold hover:bg-green-800 disabled:opacity-60"
                    >
                        {verifyUserMutation.isPending ? "Loading..." : "Verify"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PatientSignUp() {
    const registerMutation = useRegisterPatient();
    const [showVerify, setShowVerify] = useState(false);
    const { isAuthenticated, user } = useAuthStore();

    const { register, formState: { errors }, handleSubmit, watch } = useForm<CreateUserFormData>({
        resolver: zodResolver(CreateUserSchema)
    })

    const onSubmit = async (data : CreateUserFormData) => {
        promiseToast(registerMutation.mutateAsync(data), "top-center", () => {
            setShowVerify(true)
        })
    }

    if(isAuthenticated()){
        return <Navigate to={`/${user.role}`} replace />
    }

    return (
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
            <VerificationModal 
                email={watch('email')}
                open={showVerify}
            />
            <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Left Side */}
                <div className="hidden lg:flex flex-col bg-[#1E3D15] text-white p-12">

                    <h1 className="text-5xl font-bold leading-tight">
                        Create Your
                        <br />
                        Account
                    </h1>

                    <p className="mt-6 text-green-100 text-lg leading-relaxed">
                        Register to book healthcare appointments online,
                        receive QR code confirmations, and conveniently manage
                        your appointments from anywhere.
                    </p>

                    <span className="bg-green-700 w-fit px-4 py-2 rounded-full text-sm font-medium mt-6">
                        Barangay Bagumbayan Health Center
                    </span>
                </div>

                {/* Right Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-3xl font-bold text-[#1E3D15]">
                            Create Account
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Fill in your information to get started.
                        </p>

                        <form 
                            className="mt-8 space-y-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Textfield 
                                    label="Firstname"
                                    placeholder="Firstname"
                                    icon={<User size={20} />}
                                    registration={register('firstname')}
                                    error={errors.firstname?.message}
                                />

                                <Textfield 
                                    label="Lastname"
                                    placeholder="Lastname"
                                    icon={<User size={20} />}
                                    registration={register('lastname')}
                                    error={errors.lastname?.message}
                                />
                            </div>

                            <Textfield 
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                icon={<Mail size={20} />}
                                registration={register('email')}
                                error={errors.email?.message}
                            />

                            <Textfield 
                                label="Password"
                                type="password"
                                placeholder="Create a password"
                                icon={<Lock size={20} />}
                                registration={register('password')}
                                error={errors.password?.message}
                            />

                            <Textfield 
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm your password"
                                icon={<Lock size={20} />}
                                registration={register('confirmPassword')}
                                error={errors.confirmPassword?.message}
                            />

                            <button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="w-full bg-[#1E3D15] hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="mt-6 text-center text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-green-700 hover:underline"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}