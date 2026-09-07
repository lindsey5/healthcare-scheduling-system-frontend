import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="bg-white">
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
                {/* Heading */}
                <div className="text-center mb-14">
                    <span className="inline-block bg-green-100 text-[#1E3D15] px-4 py-2 rounded-full text-sm font-medium mb-4">
                        Contact Us
                    </span>

                    <h2 className="text-4xl md:text-5xl font-bold text-[#1E3D15]">
                        We're Here to Help
                    </h2>

                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions about our healthcare services or
                        appointments? Get in touch with the Barangay Bagumbayan
                        Health Center.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Information */}
                    <div>
                        <h3 className="text-2xl font-bold text-[#1E3D15]">
                            Get in Touch
                        </h3>

                        <p className="mt-3 text-gray-600">
                            You can reach us through the following contact
                            information.
                        </p>

                        <div className="mt-8 space-y-5">
                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 text-[#1E3D15]">
                                    <MapPin size={22} />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-[#1E3D15]">
                                        Address
                                    </h4>

                                    <p className="mt-1 text-gray-600">
                                       Purok 3, M.L. Quezon Street, Barangay Bagumbayan, Taguig City, 1630.
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 text-[#1E3D15]">
                                    <Phone size={22} />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-[#1E3D15]">
                                        Phone
                                    </h4>

                                    <p className="mt-1 text-gray-600">
                                        +63 XXX XXX XXXX
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 text-[#1E3D15]">
                                    <Mail size={22} />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-[#1E3D15]">
                                        Email
                                    </h4>

                                    <p className="mt-1 text-gray-600">
                                        bagumbayanhealthcenter@gmail.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-[#1E3D15]">
                            Send Us a Message
                        </h3>

                        <form className="mt-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:border-[#1E3D15] focus:ring-2 focus:ring-green-100 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:border-[#1E3D15] focus:ring-2 focus:ring-green-100 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>

                                <textarea
                                    rows={5}
                                    placeholder="How can we help you?"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none resize-none focus:border-[#1E3D15] focus:ring-2 focus:ring-green-100 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-[#1E3D15] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                            >
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}