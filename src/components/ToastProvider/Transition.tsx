import React from 'react';

import Slide, { SlideProps } from '@mui/material/Slide';

const Transition = (props: SlideProps) => (
    <Slide
        {...props}
        direction="left"
    />
);

export default Transition;
