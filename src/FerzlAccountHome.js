import React from 'react';
import Home from './Home';
import FerzlAccountSummary from './components/FerzlAccount/FerzlAccountSummary';

export default function FerzlAccountHome() {
    return (
        <Home
            title="Учетные записи ФЕРЗЛ"
            main={<FerzlAccountSummary />}
            sidebarMainListItems={[]}
            actions={[]}
        />
    );
}
