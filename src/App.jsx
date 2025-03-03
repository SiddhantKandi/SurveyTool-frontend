import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Home from "./Pages/Home/Home.jsx";
import CreateSurvey from "./Pages/CreateSurvey/CreateSurvey.jsx";
import Login from "./Pages/Authentication/login.jsx";
import VerifyEmail from "./Pages/verifyEmail.jsx";
import Preview from "./Pages/Preview/Previewpage.jsx";
import SurveyPage from "./Pages/SurveyPage/SurveyPage.jsx";
import Analysis from "./Pages/Analysis.jsx/Analysispage.jsx";
import SurveyAudienceSelector from "./Pages/targettedusers/TargettedSurvey.jsx";
import ProtectedRoute from "./Components/Protected.route.jsx";
import Toast from "./utils/Toast.jsx";
import Respondentdetails from "./Components/Respondentdetails.jsx";
import VerifyOTP from "./Pages/ForgotPassword/verifyEmailOTP.jsx";
import ForgotPasswsord from "./Pages/ForgotPassword/ForgotPassword.jsx";
import ErrorPage from "./Pages/ErrorPage.jsx";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Toast />
          <Outlet />
        </>
      ),
      errorElement: <ErrorPage errorCode="404" />, // Set the error page
      children: [
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/targettedsurvey/:surveyTitle/:surveyType/:surveyCategory",
          // Protect this route
          element: <ProtectedRoute element={<SurveyAudienceSelector />} />,
        },
        {
          path: "/verifyOTP",
          // Protect this route
          element: <VerifyOTP />,
        },
        {
          path: "/forgotPassword",
          // Protect this route
          element: <ProtectedRoute element={<ForgotPasswsord />} />,
        },
        {
          path: "/verifyEmail/:username/:email",
          element: <VerifyEmail />,
        },
        {
          path: "respondent/:surveyTitle/:surveyType:/:surveyCategory",
          element: <Respondentdetails />,
        },
        // {
        //   path: "/signup",
        //   element: <Signup />,
        // },
        {
          path: "/analysis/:surveyTitle/:surveyType/:surveyCategory",
          // Protect this route
          element: <ProtectedRoute element={<Analysis />} />,
        },
        {
          path: "/preview/:surveyTitle/:surveyType/:surveyCategory",
          // Protect this route
          element: <ProtectedRoute element={<Preview />} />,
        },
        {
          path: "/SurveyPage/:surveyTitle/:surveyType/:surveyCategory",
          element: <SurveyPage />,
        },
        {
          element: <Layout />,
          children: [
            {
              path: "/home",
              // Protect this route
              element: <ProtectedRoute element={<Home />} />,
            },
            {
              path: "/createSurvey",
              // Protect this route
              element: <ProtectedRoute element={<CreateSurvey />} />,
            },
          ],
        },
        // Catch-all route for undefined paths
        {
          path: "*",
          element: <ErrorPage errorCode="404" errorMessage="Page Not Found" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
