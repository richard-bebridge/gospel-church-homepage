import React from 'react';
import EffectL3 from './effects/EffectL3';
// import EffectL1 from './effects/EffectL1'; // Original version
// import EffectL2 from './effects/EffectL2'; // Blur effect version (experimental)

const LeftPanel = ({ setActiveSection }) => {
    return <EffectL3 setActiveSection={setActiveSection} />;
};

export default LeftPanel;
