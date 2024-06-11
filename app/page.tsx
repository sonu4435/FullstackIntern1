"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FeedbackEntry {
  name: string;
  feedback: string;
}

const Home: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [page, setPage] = useState<number>(1); // Current page number

  useEffect(() => {
          console.log("i fire once");

    fetchFeedbackEntries();
  }, []);

  const fetchFeedbackEntries = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/feedback?page=${page}&limit=10`); // Adjust query parameters according to your API
      if (!response.ok) throw new Error("Failed to fetch feedback");
      const data = await response.json();
      if (data.length === 0 && page === 1) {
        toast.info("No feedback entries available");
      } else if (data.length === 0 && page > 1) {
        toast.info("No more feedback entries");
      } else {
        setFeedbackEntries([...feedbackEntries, ...data]);
        setPage(page + 1);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, feedback })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit feedback");
      }
      const newFeedback = await res.json();
      setFeedbackEntries([newFeedback, ...feedbackEntries]); // Add new feedback at the beginning of the list
      setName("");
      setFeedback("");
      toast.success("Feedback submitted successfully");
      setShowPopup(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center">
          <h1 className="font-display text-3xl tracking-tight text-gray-900 sm:text-4xl">
            Feedback Form
          </h1>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="inline-block relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 mt-8 px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
        >
          Add a Review
        </button>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {feedbackEntries.map((entry, index) => (
            <li key={index}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                <li>
                  <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                    <svg
                      aria-hidden="true"
                      width="105"
                      height="78"
                      className="absolute left-6 top-6 fill-slate-100"
                    >
                      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561">
                        {entry.feedback}
                      </path>
                    </svg>
                    <blockquote className="relative">
                      <p className="text-lg tracking-tight text-slate-900">
                        {entry.feedback}
                      </p>
                    </blockquote>
                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900">
                          {entry.name}
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-full bg-slate-50">
                        <img
                          alt=""
                          className="h-14 w-14 object-cover"
                          style={{ color: "transparent" }}
                          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        />
                      </div>
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </li>
          ))}
        </ul>
        {showPopup && (
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block  sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Add a Review
                      </h3>
                      <div className="mt-2">
                        <form onSubmit={handleSubmit}>
                          <div className="mb-4">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Enter your name"
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="feedback"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Feedback
                            </label>
                            <textarea
                              id="feedback"
                              name="feedback"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Enter your feedback"
                            ></textarea>
                          </div>
                          <div className="text-center">
                            <button
                              type="submit"
                              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => setShowPopup(false)}
                              type="button"
                              className="inline-flex justify-center px-4 py-2 ml-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                              Close
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default Home;
