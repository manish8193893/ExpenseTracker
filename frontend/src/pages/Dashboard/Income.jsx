import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import IncomeOverview from '../../components/income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import Modal from '../../components/Modal'
import AddIncomeForm from '../../components/income/AddIncomeForm'
import toast from 'react-hot-toast'
import IncomeList from '../../components/income/IncomeList'
import DeleteAlert from '../../components/DeleteAlert'
import { useUserAuth } from '../../hooks/useUserAuth.'

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false)

  // get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true)

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOMES}`
      );

      if (response.data) {
        setIncomeData(response.data)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again!", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    // validate checks
    if (!source.trim()) {
      toast.error("source is required");
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
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon
      });

      setOpenAddIncomeModel(false)

      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error Adding Income",
        error.response?.data?.message || error.message
      )
    }
  }

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null })
      toast.success("Income details deleted successfully.")
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting Income!", error.response?.data?.message || error.message)
    }
  }

  // Download Income
  const handleDownloadIncomeDetails = async () => {
    let url = null;
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME(),
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
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading income details", error);
      toast.error("Failed to download income details. Please try again!");
    } finally {
      if (url) {
        window.URL.revokeObjectURL(url);
      }
    }
  }

  useEffect(() => {
    fetchIncomeDetails();

    return () => { }
  }, [])



  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModel(true)}
            />
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id })
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModel}
          onClose={() => setOpenAddIncomeModel(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="are you sure to delete this income detail ?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>

      </div>
    </DashboardLayout>
  )
}

export default Income
