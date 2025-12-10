import { useState, useEffect, useRef } from 'react';

export const useDesktopObserver = (sectionsLength) => {
    const [desktopState, setDesktopState] = useState({ section: 0, direction: 1 });
    const desktopSectionsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = desktopSectionsRef.current.indexOf(entry.target);
                        if (index !== -1) {
                            setDesktopState(prev => {
                                if (prev.section === index) return prev;
                                return {
                                    section: index,
                                    direction: index > prev.section ? 1 : -1
                                };
                            });
                        }
                    }
                });
            },
            { rootMargin: '-20% 0px -20% 0px', threshold: 0.1 }
        );

        desktopSectionsRef.current.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [sectionsLength]);

    return {
        desktopState,
        desktopSectionsRef
    };
};
