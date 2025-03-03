import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomAnalysis from "./CustomAnalysis.jsx";
import { apiConnector } from "../../utils/apiConnector.js";
import Spinner from "../../utils/Spinner.jsx";
import ProgressBar from "../../utils/Progressbar.jsx";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { IoCloudDownloadOutline } from "react-icons/io5";
import Logo from "../../assets/Logo.png";
import { MdSlideshow } from "react-icons/md";
import UserDetails from "./UserDetails.jsx";
import { AnalysisContext } from "../../Context/AnalysisContext.jsx";
import { capitalizeFirstLetter } from "../../utils/constants.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analysispage() {
  const {
    surveyData,
    setSurveyData,
    viewAsPercentage,
    setViewAsPercentage,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    showPopup,
    setShowPopup,
    today,
    surveyStartdate,
    setSurveyStartdate,
    responseRate,
    setResponseRate,
    totalResponses,
    setTotalResponses,
    totalRespondents,
    setTotalRespondents,
    AnsweredUserDetails,
    setAnsweredUserDetails,
    notAnsweredUserDetails,
    setnotAnsweredUserDetails,
    showUserDetailspopup,
    setshowUserDetailspopup,
    hasFetched,
    ref,
  } = useContext(AnalysisContext);

  // Fetch survey data

  const { surveyTitle, surveyType, surveyCategory } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveyData = async () => {
      setLoading(true);
      try {
        if (hasFetched.current) return; // Prevent duplicate execution
        let url = `answers/analysis/${surveyTitle}/${surveyType}/${surveyCategory}`;

        if (startDate && endDate) {
          url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
        }

        const response = await apiConnector("GET", url, {}, {}, {});

        if (!response?.data?.success) {
          toast.error("Error showing survey analysis");
          return;
        }
        setResponseRate(response?.data?.data?.metrics?.responseRate);
        setTotalRespondents(response?.data?.data?.metrics?.totalRespondents);
        setTotalResponses(response?.data?.data?.metrics?.totalResponses);

        const data = response?.data?.data?.analysis;
        if (data && data.length > 0) {
          // Set survey start date in state
          setSurveyStartdate(new Date(data[0].createdAt)); // Set the survey start date from the data
          setSurveyData(data);
        } else {
          toast.error("No survey data found.");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Error occurred while displaying analysis"
        );
      } finally {
        setLoading(false);
        hasFetched.current = true; // Mark as fetched
      }
    };

    fetchSurveyData();
  });

  const showUserDetails = async () => {
    const response = await apiConnector(
      "GET",
      "answers/getRespondentdata",
      {},
      {},
      { surveyTitle, surveyType, surveyCategory }
    );

    let { answeredRespondents, notAnsweredRespondents } =
      response?.data?.data || {};

    if (surveyType !== "targeted") {
      answeredRespondents = response?.data?.data;
    }

    setAnsweredUserDetails(answeredRespondents || []);
    setnotAnsweredUserDetails(notAnsweredRespondents || []);
    setshowUserDetailspopup(true);
  };

  useEffect(() => {
    if (showUserDetailspopup && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showUserDetailspopup, ref]); // Call when the popup visibility changes

  const exportToPdf = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margins = 10; // margins in mm
    const headerHeight = 30; // Height reserved for the header in mm

    // Add title to PDF
    pdf.setFontSize(18);
    pdf.text(
      `Survey Title : ${capitalizeFirstLetter(surveyTitle)}`,
      pdfWidth / 2,
      15,
      {
        align: "center",
      }
    );
    pdf.setFontSize(14);
    pdf.text(
      `Survey Type: ${capitalizeFirstLetter(surveyType)}`,
      pdfWidth / 2,
      25,
      { align: "center" }
    );

    let yOffset = headerHeight;

    for (let i = 0; i < surveyData.length; i++) {
      const questionElement = document.getElementById(`question-${i}`);
      const canvas = await html2canvas(questionElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = pdfWidth - 2 * margins;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yOffset + imgHeight > pdfHeight - margins) {
        pdf.addPage();
        yOffset = margins;
      }

      pdf.addImage(imgData, "PNG", margins, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 10; // Add some space between questions
    }

    pdf.save(`${surveyTitle}_${surveyType}_analysis.pdf`);
  };

  const getChartData = (question) => {
    const totalResponses = Object.values(question.answerCounts).reduce(
      (acc, count) => acc + count,
      0
    );

    return {
      labels: question.options,
      datasets: [
        {
          label: viewAsPercentage
            ? "Percentage of Responses"
            : "Number of Responses",
          data: question.options.map((option, optionIndex) => {
            <li key={optionIndex}></li>;
            const count = question.answerCounts[option] || 0;
            return viewAsPercentage && totalResponses > 0
              ? (count / totalResponses) * 100
              : count;
          }),
          backgroundColor: question.options.map((_, index) => {
            <li key={index}></li>;
            const colors = [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(255, 205, 86, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(201, 203, 207, 0.6)",
            ];
            return colors[index % colors.length]; // Cycle through the colors if there are more options than colors
          }),
          borderRadius: 10, // Rounded corners for bars
          barPercentage: 0.6, // Adjust bar thickness
          borderWidth: 2, // Border width for bars
          borderColor: "rgba(0, 0, 0, 0.5)", // Subtle border around bars
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            return data.labels.map((label, index) => ({
              text: `${capitalizeFirstLetter(label)}`,
              fillStyle: data.datasets[0].backgroundColor[index],
              hidden: chart.getDatasetMeta(0).data[index].hidden || false, // Add this line
              datasetIndex: 0,
              index: index,
            }));
          },
        },
        onClick: function (e, legendItem, legend) {
          const index = legendItem.index;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(0);

          // Toggle the hidden state of the clicked item
          meta.data[index].hidden = !meta.data[index].hidden;

          // Update the chart
          ci.update();
        },
      },
      title: {
        display: true,
        text: viewAsPercentage
          ? "Response Distribution (Percentage)"
          : "Response Distribution (Values)",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 20,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const totalResponses = tooltipItem.dataset.data.reduce(
              (acc, val) => acc + val,
              0
            );
            const currentValue = Math.round(tooltipItem.raw);
            const percentage = viewAsPercentage
              ? ((currentValue / totalResponses) * 100).toFixed(2)
              : currentValue;
            return `${tooltipItem.label}: ${percentage} ${
              viewAsPercentage ? "%" : "responses"
            }`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: viewAsPercentage
            ? "Percentage of Responses"
            : "Number of Responses",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          callback: function (value) {
            return viewAsPercentage ? value + "%" : value; // Display percentage or value on the y-axis
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Options",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };

  const showCustomAnalysisPopup = () => {
    setShowPopup(!showPopup);
  };

  const handleEndDateChange = (date) => {
    if (date) {
      // Set the time to 11:59:59 PM
      const newDate = new Date(date);
      newDate.setHours(23);
      newDate.setMinutes(59);
      newDate.setSeconds(59);
      newDate.setMilliseconds(999); // Optionally set milliseconds for precision
      setEndDate(newDate);
    }
  };

  const showProgressbar = () => {
    if (surveyType === "targeted") {
      return (
        <ProgressBar
          progress={responseRate}
          totalRespondents={totalRespondents}
          totalResponses={totalResponses}
        />
      );
    }
  };

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      ) : (
        <>
          <div
            className="absolute top-1 left-4 mt-1 hover:cursor-pointer "
            onClick={() => {
              navigate("/home");
            }}
          >
            <img src={Logo} alt="Logo" className="h-16" />
          </div>

          {/* Survey Info Section */}
          <div className="flex flex-row mt-24 ml-6">
            <div className="text-black rounded-lg p-6 shadow-md bg-gray-200 w-10/12">
              <h1 className="text-3xl font-bold">
                Survey Title: {capitalizeFirstLetter(surveyTitle)}
              </h1>
              <p className="text-lg mt-4">
                Survey Type: {capitalizeFirstLetter(surveyType)}
              </p>
            </div>

            {/* Buttons for Survey Info Section */}
            <div className="flex flex-col ml-4 space-y-4">
              <button
                className="flex items-center bg-green-500 text-white p-3 rounded-lg shadow-md hover:bg-green-700"
                onClick={exportToPdf}
              >
                <IoCloudDownloadOutline className="mr-2" />
                Export to PDF
              </button>
              <button
                className="flex items-center bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-700"
                onClick={showUserDetails}
              >
                <MdSlideshow className="mr-2" />
                Respondent Data
              </button>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="max-w-6xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-lg border ">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              {/* Date Picker and Analysis Buttons */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <label className="mr-2 text-gray-700 font-medium">
                    Start Date:
                  </label>
                  <div className="relative">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      minDate={surveyStartdate}
                      maxDate={today}
                      className="p-2 border rounded-md border-gray-300 "
                      placeholderText="Start date"
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="mr-2 text-gray-700 font-medium">
                    End Date:
                  </label>
                  <div className="relative">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={endDate}
                      onChange={handleEndDateChange}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={surveyStartdate}
                      maxDate={today}
                      className="p-2 border rounded-md border-gray-300"
                      placeholderText="End date"
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <button
                  className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-md hover:text-yellow-400 ml-6"
                  onClick={showCustomAnalysisPopup}
                >
                  <TbBrandGoogleAnalytics className="mr-2" />
                  Custom Analysis
                </button>

                <button
                  className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-md hover:text-yellow-400"
                  onClick={() => setViewAsPercentage(!viewAsPercentage)}
                >
                  <TbBrandGoogleAnalytics className="mr-2" />
                  {viewAsPercentage ? "View as Values" : "View as Percentages"}
                </button>
              </div>
            </div>

            {/* Survey Data Section */}
            {surveyData?.length === 0 ? (
              <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">
                  No responses from {surveyStartdate?.toLocaleDateString()} to{" "}
                  {today?.toLocaleDateString()}, please choose the correct date
                  to see the analysis.
                </h2>
              </div>
            ) : (
              <>
                <div className="flex flex-row items-center gap-4 mb-10 hover:cursor-pointer">
                  {/* Progress Bar */}
                  {showProgressbar()}
                </div>
                <div className="space-y-8">
                  {surveyData?.map((question, index) => (
                    <div
                      id={`question-${index}`}
                      key={index}
                      className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Question {index + 1}:{" "}
                        {capitalizeFirstLetter(question.question)}
                      </h3>
                      <div className="overflow-x-auto">
                        <Bar
                          data={getChartData(question)}
                          options={chartOptions}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-500 mt-12 mb-2">
            <p>&copy; {new Date().getFullYear()} Survey Analysis Tool</p>
          </footer>

          {/* Custom Analysis Popup */}
          {showPopup && <CustomAnalysis />}

          {showUserDetailspopup && (
            <UserDetails
              UserDetails={AnsweredUserDetails}
              title="Users Who Have Responded to Survey"
              surveyTitle={surveyTitle}
              surveyType={surveyType}
              surveyCategory={surveyCategory}
            />
          )}

          {surveyType === "targeted" && showUserDetailspopup && (
            <UserDetails
              UserDetails={notAnsweredUserDetails}
              title="Users Who Have Not Responded to Survey"
              surveyTitle={surveyTitle}
              surveyType={surveyType}
              surveyCategory={surveyCategory}
            />
          )}
        </>
      )}
    </>
  );
}

export default Analysispage;
