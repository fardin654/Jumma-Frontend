import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MembersProvider } from './context/MembersContext';
import { ExpensesProvider } from './context/ExpensesContext';
import { UsersProvider } from './context/UsersContext'; 
import { RoundsProvider } from './context/RoundsContext';
import {WalletProvider} from './context/WalletContext';
import {PaymentsProvider} from './context/PaymentsContext';
import {AutoContactsProvider} from './context/AutoContactsContext';
import {RequestsProvider} from './context/RequestsContext';
import Dashboard from './pages/Dashboard';
import AuthenticationPage from './pages/Authenticate';
import AddMember from './pages/AddMember';
import AddPayment from './pages/AddPayment';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AddExpense from './components/AddExpense';
import MemberList from './components/MamberList';
import MemberPayments from './components/MemberPayments';
import PaymentsList from './components/PaymentsList';
import AutoContacts from './components/AutoContacts';
import AddContact from './components/AddContact';
import Rounds from './components/Rounds';
import Requests from './components/Requests';
import { PaymentsListProvider } from './context/PaymentsListContext';
import CreateRound from './components/CreateRound';
import { WalletRounded } from '@mui/icons-material';

function App() {
  const [AccessCode, setAccessCode] = useState(null);
  const [Admin, setAdmin] = useState(null);
  
  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAccessCode(parsedData.AccessCode);
      setAdmin(parsedData.Admin);
      console.log(AccessCode);
    }
  }, []);

  return (
    <Router>
      <RequestsProvider>
      <UsersProvider>
      <WalletProvider>
      <MembersProvider>
        <RoundsProvider>
        <ExpensesProvider>
            <PaymentsProvider>
              <PaymentsListProvider>
                <AutoContactsProvider>
            <div className="App">
              <Navbar AccessCode={AccessCode} Admin={Admin} setAccessCode={setAccessCode}/>
              <div className="container">
                <Routes>
                  <Route path="/authenticate" element={<AuthenticationPage AccessCode={AccessCode} setAccessCode={setAccessCode} setAdmin={setAdmin}/>}/>
                  <Route path="/" element={<Dashboard AccessCode={AccessCode}/>} />
                  <Route path="/add-member" element={<AddMember AccessCode={AccessCode} Admin={Admin}/>} />
                  <Route path="/add-payment" element={<AddPayment AccessCode={AccessCode} Admin={Admin} />} />
                  <Route path="/add-expense" element={<AddExpense AccessCode={AccessCode} Admin={Admin} />} />
                  <Route path="/members" element={<MemberList AccessCode={AccessCode} Admin={Admin}/>} />
                  <Route path="/members/:id/payments" element={<MemberPayments AccessCode={AccessCode}/>} />
                  <Route path="/paymentsList/:roundNumber" element={<PaymentsList AccessCode={AccessCode}/>} /> 
                  <Route path="/create-round" element={<CreateRound AccessCode={AccessCode} Admin={Admin} />} />
                  <Route path="/auto-contact" element={<AutoContacts AccessCode={AccessCode} Admin={Admin}/>} />
                  <Route path="/add-contact" element={<AddContact AccessCode={AccessCode} Admin={Admin}/>} />
                  <Route path="/rounds" element={<Rounds AccessCode={AccessCode} Admin={Admin}/>} />
                  <Route path="/requests" element={<Requests AccessCode={AccessCode} Admin={Admin}/>} />
                </Routes>
              </div>
              <Footer />
            </div>
            </AutoContactsProvider>
            </PaymentsListProvider>
            </PaymentsProvider>
        </ExpensesProvider>
        </RoundsProvider>
      </MembersProvider>
      </WalletProvider>
      </UsersProvider>
      </RequestsProvider>
    </Router>
  );
}

export default App;
