import React, { useState, useEffect, useRef, useContext } from "react";
import { MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { LuPlusCircle } from "react-icons/lu";
import { RiCloseCircleLine } from "react-icons/ri";
import { toast } from "react-toastify"; // Import toast
import { apiConnector } from "../../utils/apiConnector.js";
import Spinner from "../../utils/Spinner.jsx";
import { TargetedSurveyContext } from "../../Context/TargetedSurveyContext.jsx";

export default function Showdatabaseusers() {
  const [loading, setLoading] = useState(false);

  const {
    users,
    setUsers,
    showAudienceSelector,
    setShowAudienceSelector,
    databaseUsers,
    setDatabaseUsers,
    preview,
    setPreview,
    searchInput,
    setSearchInput,
  } = useContext(TargetedSurveyContext);

  // Fetch survey data
  const hasFetched = useRef(false);

  const onClose = () => {
    setShowAudienceSelector(!showAudienceSelector); // Open popup for database users
  };

  // Fetch users from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (hasFetched.current) return; // Prevent duplicate execution
        const url = "targetted/getusers";
        const response = await apiConnector("GET", url, {}, {}, {});
        if (response.data.success) {
          setDatabaseUsers(response.data.data);
        } else {
          toast.error("Error fetching users");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
        hasFetched.current = true; // Mark as fetched
      }
    };

    fetchData();
  });

  // Function to delete user from preview
  const deleteFromPreview = (index) => {
    const updatedPreview = preview.filter((_, ind) => ind !== index);
    setPreview(updatedPreview);
  };

  // Function to add user to preview
  const addToPreview = (user) => {
    if (!preview.some((item) => item.email === user.email)) {
      setPreview([...preview, user]);
    }
  };

  const addUsers = () => {
    // Filter out users that are already selected
    const uniqueUsers = preview.filter(
      (previewUser) =>
        !users.some((existingUser) => existingUser.email === previewUser.email)
    );

    if (uniqueUsers.length === 0) {
      toast.error("No new users to add. All users are already selected.");
      return;
    }

    // Add unique users to the existing list
    const newUsers = [...users, ...uniqueUsers];
    setUsers(newUsers); // Using setUsers from props
    setPreview([]);
    onClose();
  };

  // Filtered users based on search input
  const filteredUsers = databaseUsers.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      ) : (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 py-1">
          <div className="relative bg-white shadow-md w-10/12 h-5/6">
            {/* Header */}
            <div className="relative w-full h-10 border border-gray-400 p-0 m-0">
              <h2 className="text-2xl font-bold absolute top-1 left-4">
                Users in Database
              </h2>
              <button
                onClick={onClose}
                className="flex flex-row absolute right-1 text-black rounded-md bg-red-400 pl-1 pr-1 m-0 items-center justify-center text-sm top-1"
              >
                <MdClose className="text-xl text-black" />
              </button>
            </div>

            {/* Main content */}
            <div className="flex w-full h-[calc(100%-40px)]">
              {/* Users list section */}
              <div className="w-8/12 h-full border border-r-2 border-r-black box-border bg-slate-100 p-3 overflow-y-auto">
                {/* Search bar */}
                <div className="relative border border-black w-full h-10 mb-3">
                  <div className="flex flex-row h-full w-full">
                    <div className="flex items-center w-10/12 p-2">
                      <CiSearch className="ml-1" />
                      <input
                        className="w-full p-2 h-8 bg-slate-100 focus:outline-none"
                        placeholder="Search users by username or email"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Users grid */}
                <div className="grid grid-cols-2 gap-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id || user.email}
                      className="p-2 bg-white border border-gray-300 rounded-md"
                    >
                      <div className="p-2">
                        <div className="flex flex-row items-center mb-2">
                          <LuPlusCircle
                            className="mr-2 text-xl text-green-300 cursor-pointer"
                            onClick={() => addToPreview(user)}
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {user.username}
                            </span>
                            <span className="text-sm text-gray-600">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview section */}
              <div className="w-4/12 h-full p-4 flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Preview</h3>
                <div className="flex-grow overflow-y-auto">
                  {preview.map((user, index) => (
                    <div
                      key={user._id || user.email}
                      className="p-2 mb-3 bg-white border border-gray-300 rounded-md"
                    >
                      <div className="p-2">
                        <div className="flex flex-row items-center justify-between mb-2">
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {user.username}
                            </span>
                            <span className="text-sm text-gray-600">
                              {user.email}
                            </span>
                          </div>
                          <RiCloseCircleLine
                            className="text-2xl text-red-500 cursor-pointer"
                            onClick={() => deleteFromPreview(index)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="bg-green-500 text-white w-full p-3 rounded-md mt-4"
                  onClick={addUsers}
                >
                  Add Users
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
