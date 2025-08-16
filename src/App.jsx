import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MembersProvider } from './context/MembersContext';
import { ExpensesProvider } from './context/ExpensesContext';
import { RoundsProvider } from './context/RoundsContext';
import {WalletProvider} from './context/WalletContext';
import {PaymentsProvider} from './context/PaymentsContext';
import Dashboard from './pages/Dashboard';
import AddMember from './pages/AddMember';
import AddPayment from './pages/AddPayment';
import Navbar from './components/Navbar';
import AddExpense from './components/AddExpense';
import MemberList from './components/MamberList';
import MemberPayments from './components/MemberPayments';
import PaymentsList from './components/PaymentsList';
import { PaymentsListProvider } from './context/PaymentsListContext';
import { WalletRounded } from '@mui/icons-material';

function App() {
  return (
    <Router>
      <WalletProvider>
      <MembersProvider>
        <RoundsProvider>
        <ExpensesProvider>
            <PaymentsProvider>
              <PaymentsListProvider>
            <div className="App">
              <Navbar />
              <div className="container">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/add-member" element={<AddMember />} />
                  <Route path="/add-payment" element={<AddPayment />} />
                  <Route path="/add-expense" element={<AddExpense />} />
                  <Route path="/members" element={<MemberList />} />
                  <Route path="/members/:name/payments" element={<MemberPayments />} />
                  <Route path="/paymentsList/:roundNumber" element={<PaymentsList />} />
                </Routes>
              </div>
            </div>
            </PaymentsListProvider>
            </PaymentsProvider>
        </ExpensesProvider>
        </RoundsProvider>
      </MembersProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;
