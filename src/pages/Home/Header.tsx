import { useState } from "react";
import { Menu, X } from "lucide-react";
import { scrollTo } from "../../utils/utils";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-[#1E3D15] text-white shadow-md z-10 fixed top-0 left-0 right-0">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        className="w-12 h-12"
                        src="/bagumbayan-logo.png"
                        alt="Bagumbayan Logo"
                    />
                    <h1 className="font-bold text-lg hidden sm:block">
                        Bagumbayan Healthcare Scheduling System
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <nav>
                        <ul className="flex items-center gap-8 font-medium">
                            <li>
                                <button onClick={() => scrollTo("home")} className="hover:text-green-300 transition">
                                    Home
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollTo("about")} className="hover:text-green-300 transition">
                                    About
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollTo("services")} className="hover:text-green-300 transition">
                                    Services
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollTo("contact")} className="hover:text-green-300 transition">
                                    Contact
                                </button>
                            </li>
                        </ul>
                    </nav>

                    <a
                        href="/login"
                        className="bg-white text-[#1E3D15] px-5 py-2 rounded-lg font-semibold hover:bg-green-100 transition"
                    >
                        Login
                    </a>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#1E3D15] border-t border-green-800">
                    <nav>
                        <ul className="flex flex-col">
                            <li>
                                <a
                                    href="#home"
                                    className="block px-6 py-4 hover:bg-green-800"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    className="block px-6 py-4 hover:bg-green-800"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    className="block px-6 py-4 hover:bg-green-800"
                                >
                                    Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    className="block px-6 py-4 hover:bg-green-800"
                                >
                                    Contact
                                </a>
                            </li>
                            <li className="p-4">
                                <a
                                    href="/login"
                                    className="block text-center bg-white text-[#1E3D15] py-2 rounded-lg font-semibold hover:bg-green-100 transition"
                                >
                                    Login
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}