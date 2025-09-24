"use client";

import React from 'react';
import { Play, ExternalLink, Atom, Zap, Waves, Thermometer, Magnet, Eye, Microscope, Sparkles, Clock } from 'lucide-react';

// Type for tags
type LabTag = {
    name: string;
    color: string;
};

// Type for lab card props
type VirtualLabCardProps = {
    title: string;
    description: string;
    subject: string;
    icon: React.ComponentType<{ className?: string }>;
    url?: string;
    tags: LabTag[];
    iconColor?: string;
    isComingSoon?: boolean;
    animationDelay?: string;
};

// Reusable card component for each virtual lab
function VirtualLabCard({
    title,
    description,
    subject,
    icon: Icon,
    url,
    tags,
    iconColor = "from-blue-500 to-purple-600",
    isComingSoon = false,
    animationDelay = '0s',
}: VirtualLabCardProps) {
    const handleLabClick = () => {
        if (!isComingSoon && url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-white/20 group ${isComingSoon ? 'cursor-default opacity-75' : 'cursor-pointer hover:-translate-y-2'} animate-fade-in-up`}
            onClick={handleLabClick}
            style={{ animationDelay }}
        >
            {isComingSoon && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-pulse">
                    Coming Soon
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`bg-gradient-to-br ${iconColor} p-3 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        {isComingSoon ? (
                            <Clock className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
                        ) : (
                            <Play className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                        )}
                    </div>
                    <div>
                        <h3 className={`text-xl font-semibold text-gray-800 transition-colors duration-300 ${!isComingSoon ? 'group-hover:text-blue-600' : ''}`}>
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">{subject}</p>
                    </div>
                </div>
                {!isComingSoon && (
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
                )}
            </div>

            <div className="flex items-center space-x-2 mb-3">
                <Icon className={`w-4 h-4 ${isComingSoon ? 'text-purple-500' : 'text-blue-500'} group-hover:scale-110 transition-transform duration-300`} />
                <span className="text-sm text-gray-600 font-medium">
                    {isComingSoon ? 'New Lab Experience' : 'Interactive PhET Lab'}
                </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>

            <div className="flex items-center justify-between">
                <div className="flex space-x-2 flex-wrap gap-1">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`px-3 py-1 ${tag.color} text-xs rounded-full font-medium transition-all duration-300 hover:scale-105`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                    {isComingSoon ? 'Stay tuned' : 'Click to launch'}
                </div>
            </div>
        </div>
    );
}

// Main component for the Virtual Lab page
export default function VirtualLab() {
    const labCards: VirtualLabCardProps[] = [
        {
            title: "Chemistry Simulation",
            subject: "Balancing Chemical Equations",
            description: "Learn to balance chemical equations through interactive simulations. Explore atoms, molecules, and chemical reactions in a virtual environment.",
            icon: Atom,
            url: "https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_en.html",
            iconColor: "from-blue-500 to-purple-600",
            tags: [
                { name: "Chemistry", color: "bg-blue-100 text-blue-700" },
                { name: "Interactive", color: "bg-green-100 text-green-700" }
            ]
        },
        {
            title: "Circuit Construction",
            subject: "DC Circuit Builder",
            description: "Build and test electrical circuits with batteries, resistors, and wires. Learn about current, voltage, and resistance through hands-on experimentation.",
            icon: Zap,
            url: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html",
            iconColor: "from-yellow-500 to-orange-600",
            tags: [
                { name: "Physics", color: "bg-yellow-100 text-yellow-700" },
                { name: "Electronics", color: "bg-orange-100 text-orange-700" }
            ]
        },
        {
            title: "Wave Interference",
            subject: "Sound & Light Waves",
            description: "Explore wave behavior, interference patterns, and wave properties. Visualize how waves interact and create complex patterns.",
            icon: Waves,
            url: "https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html",
            iconColor: "from-cyan-500 to-blue-600",
            tags: [
                { name: "Physics", color: "bg-cyan-100 text-cyan-700" },
                { name: "Waves", color: "bg-blue-100 text-blue-700" }
            ]
        },
        {
            title: "States of Matter",
            subject: "Phase Changes & Temperature",
            description: "Investigate how temperature affects the states of matter. Watch molecules change from solid to liquid to gas in real-time.",
            icon: Thermometer,
            url: "https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_en.html",
            iconColor: "from-red-500 to-pink-600",
            tags: [
                { name: "Chemistry", color: "bg-red-100 text-red-700" },
                { name: "Thermodynamics", color: "bg-pink-100 text-pink-700" }
            ]
        },
        {
            title: "Faraday's Law",
            subject: "Electromagnetic Induction",
            description: "Discover how moving magnets can generate electricity. Explore the relationship between magnetism and electrical current.",
            icon: Magnet,
            url: "https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_en.html",
            iconColor: "from-purple-500 to-indigo-600",
            tags: [
                { name: "Physics", color: "bg-purple-100 text-purple-700" },
                { name: "Magnetism", color: "bg-indigo-100 text-indigo-700" }
            ]
        },
        {
            title: "Geometric Optics",
            subject: "Lenses & Mirrors",
            description: "Study how light behaves with lenses and mirrors. Create images and understand focal points, magnification, and optical systems.",
            icon: Eye,
            url: "https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_en.html",
            iconColor: "from-emerald-500 to-teal-600",
            tags: [
                { name: "Physics", color: "bg-emerald-100 text-emerald-700" },
                { name: "Optics", color: "bg-teal-100 text-teal-700" }
            ]
        },
        {
            title: "Gene Expression",
            subject: "DNA Transcription & Translation",
            description: "Explore how genes are expressed to create proteins. Watch DNA transcription and mRNA translation in action.",
            icon: Microscope,
            url: "https://phet.colorado.edu/sims/html/gene-expression-essentials/latest/gene-expression-essentials_en.html",
            iconColor: "from-rose-500 to-red-600",
            tags: [
                { name: "Biology", color: "bg-rose-100 text-rose-700" },
                { name: "Genetics", color: "bg-red-100 text-red-700" }
            ]
        },
        {
            title: "Quantum Mechanics Lab",
            subject: "Advanced Physics Simulation",
            description: "Dive into the fascinating world of quantum mechanics. Explore wave-particle duality, quantum tunneling, and superposition.",
            icon: Sparkles,
            iconColor: "from-indigo-500 to-purple-600",
            tags: [
                { name: "Physics", color: "bg-indigo-100 text-indigo-700" },
                { name: "Quantum", color: "bg-purple-100 text-purple-700" }
            ],
            isComingSoon: true
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-2xl animate-float-slow"></div>
                <div className="absolute -bottom-20 -left-20 w-32 h-32 md:w-80 md:h-80 bg-gradient-to-br from-cyan-400/25 to-blue-600/25 rounded-full blur-2xl animate-float-medium" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 right-1/4 w-24 h-24 md:w-60 md:h-60 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-xl animate-float-fast" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400/60 rounded-full animate-twinkle"></div>
                <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400/60 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-grid-move"></div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-2xl shadow-lg animate-glow"></div>
                            <Atom className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '8s' }} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            Virtual Laboratory
                        </h1>
                        <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed px-4">
                            Discover the wonders of science through interactive simulations and hands-on virtual experiments.
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-blue-100 font-medium">{labCards.filter(lab => !lab.isComingSoon).length} Labs Available</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                <span className="text-sm text-blue-100 font-medium">Multiple Subjects</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {labCards.map((lab, index) => (
                            <div key={index}>
                                <VirtualLabCard {...lab} animationDelay={`${index * 0.1}s`} />
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '1s' }}>
                        <p className="text-blue-200 text-sm px-4">
                            More exciting labs coming soon! Stay tuned for updates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}