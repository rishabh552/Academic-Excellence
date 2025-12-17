import { useId, useMemo, memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface GridPatternProps {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    squareCount?: number;
    gridColumns?: number;
    gridRows?: number;
    strokeDasharray?: string;
    className?: string;
    [key: string]: unknown;
}

// Seeded random for consistent results
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateRandomSquares(
    count: number,
    columns: number,
    rows: number,
    seed: number = 42
): Array<[number, number, number]> {
    const squares: Array<[number, number, number]> = [];
    const sectionsX = 4;
    const sectionsY = 4;
    const squaresPerSection = Math.ceil(count / (sectionsX * sectionsY));

    const sectionWidth = Math.floor(columns / sectionsX);
    const sectionHeight = Math.floor(rows / sectionsY);

    let seedCounter = seed;

    for (let sy = 0; sy < sectionsY; sy++) {
        for (let sx = 0; sx < sectionsX; sx++) {
            for (let i = 0; i < squaresPerSection; i++) {
                const randomX = Math.floor(seededRandom(seedCounter++) * sectionWidth);
                const randomY = Math.floor(seededRandom(seedCounter++) * sectionHeight);

                const x = sx * sectionWidth + randomX;
                const y = sy * sectionHeight + randomY;

                const exists = squares.some(([ex, ey]) => ex === x && ey === y);
                if (!exists && x < columns && y < rows) {
                    const delay = seededRandom(seedCounter) * 3;
                    squares.push([x, y, delay]);
                }
            }
        }
    }

    return squares.slice(0, count);
}

// Hook to detect mobile and generate random seed
function useRandomSeed() {
    const [seed, setSeed] = useState(42);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            // Generate truly random seed on mobile
            setSeed(Math.floor(Math.random() * 10000));
        }
    }, []);

    return seed;
}

const GridPattern = memo(function GridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    squareCount = 40,
    gridColumns = 40,
    gridRows = 25,
    strokeDasharray = "0",
    className,
    ...props
}: GridPatternProps) {
    const id = useId();
    const seed = useRandomSeed();

    const squares = useMemo(
        () => generateRandomSquares(squareCount, gridColumns, gridRows, seed),
        [squareCount, gridColumns, gridRows, seed]
    );

    return (
        <svg
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
                className,
            )}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
            <svg x={x} y={y} className="overflow-visible">
                {squares.map(([squareX, squareY, delay]) => (
                    <motion.rect
                        strokeWidth="0"
                        key={`${squareX}-${squareY}`}
                        width={width - 1}
                        height={height - 1}
                        x={squareX * width + 1}
                        y={squareY * height + 1}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: [0, 1, 0.6, 1, 0],
                            scale: [0.8, 1.1, 1, 1.1, 0.8],
                        }}
                        transition={{
                            duration: 3,
                            ease: "easeInOut",
                            repeat: Infinity,
                            delay: delay,
                        }}
                    />
                ))}
            </svg>
        </svg>
    );
});

export { GridPattern };
