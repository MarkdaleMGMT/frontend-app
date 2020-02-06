import Axios from "axios";
import { BACKEND_API, FRONTEND_API } from '../config/config';

/**
 * In dashboard page
 */
export const getOverviewTableData = (data)=>Axios.post(BACKEND_API + 'users/balance', data);
export const getBalanceHistory = (data)=>Axios.post(BACKEND_API + 'users/balance_history', data);
export const getTransactionHistory = (data)=>Axios.post(BACKEND_API + 'accounts/transaction_history', data);
export const getInvestments  = (data) => Axios.post(FRONTEND_API + 'all_investments', data);

export const getNewBalanceHistory = (data)=>Axios.post(BACKEND_API + 'users/new_balance_history', data);
export const getNewTransactionHistory = (data)=>Axios.post(BACKEND_API + 'accounts/new_transaction_history', data);

export const transferAmount = (data) => Axios.post(BACKEND_API + 'transactions/transfer', data);
export const globalUpdate = (data) => Axios.post(BACKEND_API + 'transactions/global_update', data);
export const withdrawal = (data) => Axios.post(BACKEND_API + 'transactions/withdrawal', data);
export const deposit = (data) => Axios.post(BACKEND_API + 'transactions/deposit', data);

export const inviteUser = (data) => Axios.post(FRONTEND_API + 'invite_user',data);
export const updatePassword = (data) => Axios.post(FRONTEND_API + 'update_password', data);

export const getAccountDetails = (data) => Axios.post(BACKEND_API + 'users/get_account',data);
export const getAccountBalanceHistory = (data) => Axios.post(BACKEND_API + 'accounts/balance_history', data);
export const getTotalUser = () => Axios.get(FRONTEND_API + "stats/total_users");

export const getDailyRegisteredUsers = (data) => Axios.post(FRONTEND_API + "stats/daily_registered_users", data);

export const getExchangeRates = () => Axios.get(BACKEND_API + 'fx/quote_rates');
export const getRatesInCAD = () => Axios.get(BACKEND_API + 'fx/quote_rates_in_cad');
export const exchangeInvestment = (data) => Axios.post(BACKEND_API + 'fx/exchange', data);
export const getRatesHistory = (data) => Axios.post(BACKEND_API + "fx/rates_history", data);
export const getNewRatesHistory = (data) => Axios.post(BACKEND_API + "fx/new_rates_history", data);

export const updateUserInfo = (data) => Axios.post(FRONTEND_API+'update_info', data);
export const getUserInvestmentDetails = (data) => Axios.post(BACKEND_API + 'users/investments', data);
