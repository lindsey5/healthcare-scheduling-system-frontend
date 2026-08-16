import { Link, Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Textfield from "../../components/ui/Textfield";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../schemas/authSchema";
import { promiseToast } from "../../utils/utils";
import Button from "../../components/ui/Button";
import useLoginPatient from "../../hooks/patient/use-login-patient.hook";
import { useAuthStore } from "../../lib/store/authStore";

export default function UserLogin() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const loginMutation = useLoginPatient();

    const { register, formState: { errors }, handleSubmit } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data : LoginFormData) => {
        promiseToast(loginMutation.mutateAsync(data), "top-center", () => navigate('/patient'), "Successfully Logged In")
    }

    if(isAuthenticated()){
        return <Navigate to={`/${user.role}`} replace />
    }

    return (
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Left Side */}
                <div className="hidden lg:flex flex-col bg-[#1E3D15] text-white p-12">

                    <h1 className="text-5xl font-bold leading-tight">
                        Welcome
                        <br />
                        Back!
                    </h1>

                    <p className="mt-6 text-green-100 text-lg leading-relaxed">
                        Sign in to manage your appointments, receive QR code
                        confirmations, and access your healthcare records
                        anytime.
                    </p>

                    <span className="bg-green-700 w-fit px-4 py-2 rounded-full text-sm font-medium mt-6">
                        Barangay Bagumbayan Health Center
                    </span>

                </div>

                {/* Right Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-3xl font-bold text-[#1E3D15]">
                            Sign In
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Welcome back! Please enter your account details.
                        </p>

                        <form 
                            className="mt-8 space-y-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Textfield 
                                label="Email Address"
                                icon={<Mail size={20}/> }
                                placeholder="Enter your email"
                                registration={register("email")}
                                error={errors.email?.message}
                            />

                            <Textfield 
                                label="Password"
                                icon={<Lock size={20} />}
                                type="password"
                                placeholder="Enter your password"
                                registration={register("password")}
                                error={errors.password?.message}
                            />

                            <div>
                                <Link
                                    to="/forgot-password"
                                    className="text-green-700 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loginMutation.isPending}
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-semibold text-green-700 hover:underline"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}