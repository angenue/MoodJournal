// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// src/setupTests.ts
// src/setupTests.ts
import '@testing-library/jest-dom';
import Modal from 'react-modal';

// Create a div with the ID 'root' and append it to the document body
const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

// Now we can safely set the app element for react-modal
Modal.setAppElement('#root');
