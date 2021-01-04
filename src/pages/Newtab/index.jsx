import React from 'react';
import { render } from 'react-dom';

import Newtab from './Newtab';
import './index.css';
import chrome from '../../containers/FairyNote/chromeMock'
import '../Content'
console.log(chrome)
render(<Newtab />, window.document.querySelector('#app-container'));
