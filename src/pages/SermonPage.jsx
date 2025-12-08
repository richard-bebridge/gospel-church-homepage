import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SermonPage = () => {
    return (
        <div className="min-h-screen bg-[#F4F3EF]">
            <Header />

            {/* Main Content */}
            <main className="pt-16 md:pt-20 min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-24">
                <div className="w-full max-w-6xl">
                    <h1 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl mb-8 sm:mb-12 text-[#05121C] uppercase tracking-tight">
                        Sermons
                    </h1>

                    {/* Figma Embed */}
                    <div className="w-full aspect-video bg-white rounded-lg shadow-lg overflow-hidden">
                        <iframe
                            style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
                            width="100%"
                            height="100%"
                            src="https://embed.figma.com/design/pF5tKbJvQcjhJ20Eze0fRS/Sketch-book?node-id=4153-4949&embed-host=share"
                            allowFullScreen
                            title="Sermon Sketch"
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SermonPage;
