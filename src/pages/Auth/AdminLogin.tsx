import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Textfield from "../../components/ui/Textfield";
import { useAuthStore } from "../../lib/store/authStore";
import { loginSchema, type LoginFormData } from "../../schemas/authSchema";
import useLoginAdmin from "../../hooks/admin/use-login-admin.hook";
import useLoginStaff from "../../hooks/staff/use-login-staff.hook";
import { promiseToast } from "../../utils/utils";


export default function AdminLogin() {
    const { isAuthenticated, user } = useAuthStore();
    const loginAdminMutation = useLoginAdmin();
    const loginStaffMutation = useLoginStaff();
    const [role, setRole] = useState<"admin" | "staff">("admin");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        promiseToast(role === "admin" ? 
            loginAdminMutation.mutateAsync(data) : 
            loginStaffMutation.mutateAsync(data), 
            "top-center", 
            () => navigate(`/${role}`)
        )
    };

    if (isAuthenticated()) {
        return <Navigate to={`/${user.role}`} replace />;
    }

    return (
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
            <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Left */}
                <div className="hidden lg:flex flex-col justify-center bg-[#1E3D15] text-white p-12">
                    <div className="w-16 h-16 rounded-2xl bg-green-800 flex items-center justify-center">
                        <ShieldCheck size={34} />
                    </div>

                    <h1 className="mt-8 text-5xl font-bold leading-tight">
                        Admin / Staff Portal
                    </h1>

                    <p className="mt-5 text-green-100 text-lg leading-relaxed">
                        Login to access the Barangay Bagumbayan Healthcare
                        Scheduling System dashboard and manage appointments,
                        services, and patients.
                    </p>

                    <span className="mt-8 bg-green-700 w-fit px-4 py-2 rounded-full text-sm font-medium">
                        Barangay Bagumbayan Health Center
                    </span>
                </div>

                {/* Right */}
                <div className="p-8 md:p-12 flex items-center">
                    <div className="w-full max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-[#1E3D15]">
                            Sign In
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Login as an administrator or staff member.
                        </p>

                        {/* Role Tabs */}
                        <div className="mt-8 bg-gray-100 rounded-xl p-1 flex">
                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                                    role === "admin"
                                        ? "bg-[#1E3D15] text-white shadow"
                                        : "text-gray-600 hover:bg-white"
                                }`}
                            >
                                <ShieldCheck size={18} />
                                Admin
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("staff")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                                    role === "staff"
                                        ? "bg-[#1E3D15] text-white shadow"
                                        : "text-gray-600 hover:bg-white"
                                }`}
                            >
                                <Users size={18} />
                                Staff
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-8 space-y-5"
                        >
                            <Textfield
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                icon={<Mail size={20} />}
                                registration={register("email")}
                                error={errors.email?.message}
                            />

                            <Textfield
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                icon={<Lock size={20} />}
                                registration={register("password")}
                                error={errors.password?.message}
                            />

                            <button
                                type="submit"
                                className="w-full bg-[#1E3D15] hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition"
                            >
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}