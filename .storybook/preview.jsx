import { MemoryRouter } from 'react-router-dom';
import "../src/index.css"; 

/** @type { import('@storybook/react').Preview } */
export const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export const decorators = [
    (Story) => (
        <MemoryRouter>
            <Story />
        </MemoryRouter>
    ),
];