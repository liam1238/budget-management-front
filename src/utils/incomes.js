import {
  GET_INCOMES_URL,
  GET_INCOME_BY_ID_URL,
  ADD_INCOME_URL,
  UPDATE_INCOME_URL,
  DELETE_INCOME_URL,
} from "./constants";

export const Incomes = {
  getIncomes: async (limit = 5, offset = 0, sortBy = "id") => {
    const response = await fetch(
      `${GET_INCOMES_URL}?limit=${limit}&offset=${offset}&sortBy=${sortBy}`
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    const incomes = await response.json();
    return incomes;
  },

  getIncomeById: async (id) => {
    const url = GET_INCOME_BY_ID_URL.replace(":id", id); // Replace :id with the actual ID
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    const income = await response.json();
    return income;
  },

  addIncome: async (incomeData) => {
    const response = await fetch(ADD_INCOME_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incomeData),
    });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    const newIncome = await response.json();
    return newIncome;
  },

  updateIncome: async (id, updatedData) => {
    const url = UPDATE_INCOME_URL.replace(":id", id);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    const updatedIncome = await response.json();
    return updatedIncome;
  },

  deleteIncome: async (id) => {
    const url = DELETE_INCOME_URL.replace(":id", id);
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return { success: true };
  },
};
