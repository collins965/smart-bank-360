import React, { useState } from 'react';
import { Trash2, Edit3, PlusCircle } from 'lucide-react';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalData, setGoalData] = useState({
    name: '',
    target: '',
    saved: '',
    deadline: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData({ ...goalData, [name]: value });
  };

  const handleAddOrEditGoal = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedGoals = [...goals];
      updatedGoals[editIndex] = goalData;
      setGoals(updatedGoals);
      setEditIndex(null);
    } else {
      setGoals([...goals, goalData]);
    }

    setGoalData({ name: '', target: '', saved: '', deadline: '' });
  };

  const handleEdit = (index) => {
    setGoalData(goals[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg border-t-4 border-blue-500">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Savings Goals</h2>

      {/* Form */}
      <form
        onSubmit={handleAddOrEditGoal}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <input
          type="text"
          name="name"
          placeholder="Goal Name"
          required
          value={goalData.name}
          onChange={handleChange}
          className="p-3 border rounded-md focus:ring-2 focus:ring-green-400"
        />
        <input
          type="number"
          name="target"
          placeholder="Target Amount"
          required
          value={goalData.target}
          onChange={handleChange}
          className="p-3 border rounded-md focus:ring-2 focus:ring-green-400"
        />
        <input
          type="number"
          name="saved"
          placeholder="Amount Saved"
          required
          value={goalData.saved}
          onChange={handleChange}
          className="p-3 border rounded-md focus:ring-2 focus:ring-green-400"
        />
        <input
          type="date"
          name="deadline"
          placeholder="Deadline"
          required
          value={goalData.deadline}
          onChange={handleChange}
          className="p-3 border rounded-md focus:ring-2 focus:ring-green-400"
        />
        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            {editIndex !== null ? 'Update Goal' : 'Add Goal'} <PlusCircle className="inline ml-2" size={18} />
          </button>
        </div>
      </form>

      {/* Goals List */}
      <div className="space-y-5">
        {goals.map((goal, index) => {
          const progress = Math.min((goal.saved / goal.target) * 100, 100).toFixed(1);

          return (
            <div key={index} className="bg-gray-50 p-4 rounded-md shadow flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="w-full md:w-2/3">
                <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Target: <span className="font-medium">${goal.target}</span> | Saved: <span className="font-medium">${goal.saved}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">Deadline: {goal.deadline}</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs mt-1 text-gray-500">{progress}% Complete</p>
              </div>
              <div className="flex gap-3 mt-3 md:mt-0">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Edit Goal"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete Goal"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsGoals;
