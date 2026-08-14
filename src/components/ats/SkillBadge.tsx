'use client';

interface SkillBadgeProps {

    label: string;

    matched?: boolean;

}

export default function SkillBadge({

    label,
    matched = true

}: SkillBadgeProps) {

    return (

        <span
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105
            ${
                matched
                    ? "bg-green-500/10 text-green-600 border border-green-500/30"
                    : "bg-red-500/10 text-red-500 border border-red-500/30"
            }`}
        >
            {matched ? "✓ " : "✕ "}
            {label}
        </span>

    );

}