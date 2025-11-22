import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth.';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import Modal from '../../components/Modal'
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {

  useUserAuth();

  const [expenseData, setExpenseData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false)

  // get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true)

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_EXPENSES}`
      );

      if (response.data) {
        setExpenseData(response.data)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again!", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // validate checks
    if (!category.trim()) {
      toast.error("category is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.")
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon
      });

      setOpenAddExpenseModel(false)

      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error Adding Expense",
        error.response?.data?.message || error.message
      )
    }
  }

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null })
      toast.success("Expense details deleted successfully.")
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting Expense!", error.response?.data?.message || error.message)
    }
  }

  // Download Income
  const handleDownloadExpenseDetails = async () => {
    let url = null;
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE(),
        {
          responseType: "blob"
        }
      );

      if (!response.data) {
        throw new Error("No data received for download.");
      }

      url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading expense details", error);
      toast.error("Failed to download expense details. Please try again!");
    } finally {
      if (url) {
        window.URL.revokeObjectURL(url);
      }
    }
  }

  useEffect(() => {
    fetchExpenseDetails();

    return () => { }
  }, [])


  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModel(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({
                show: true,
                data: id
              })
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModel}
          onClose={() => setOpenAddExpenseModel(false)}
          title='Add Expense'
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="are you sure to delete this expense detail ?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense
