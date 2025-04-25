import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./Pages/Home/Home";
import Communities from "./Pages/Communities/Communities";
import Community from './Pages/Community/Community';
import SignIn from "./Pages/Auth/SignIn/SignIn";
import SignUp from "./Pages/Auth/SignUp/SignUp";
import RequestResetCode from "./Pages/Auth/RequestResetCode/RequestResetCode";
import VerifyResetCode from "./Pages/Auth/VerifyResetCode/VerifyResetCode";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import VerifyEmail from "./Pages/Auth/VerifyEmail/VerifyEmail";
import Team from './Pages/Team/Team';
import SubTeam from "./Pages/SubTeam/SubTeam";
import LearningPhase from "./Pages/LearningPhase/LearningPhase";
import ManageMembers from "./Pages/ManageMembers/ManageMembers";

export default function App() {



  let routers = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        { index: true, element: <Home /> },
        { path: "communities", element: <Communities /> },
        { path: "communities/community/:communityId", element: <Community /> },
        { path: "communities/community/:communityId/teams/:teamId", element: <Team /> },
        { path: "communities/community/:communityId/teams/:teamId/subteams/:subTeamId", element: <SubTeam /> },
        { path: "communities/:communityId/teams/:teamId/subteams/:subTeamId/manageMembers", element: <ManageMembers /> },

        { path: "LearningPhase", element: <LearningPhase /> }

      ]
    },
    { path: "signUp", element: <SignUp /> },
    { path: "signIn", element: <SignIn /> },
    { path: "/signUp/verifyEmail", element: <VerifyEmail /> },
    { path: "RequestResetCode", element: <RequestResetCode /> },
    { path: "RequestResetCode/VerifyResetCode", element: <VerifyResetCode /> },
    { path: "RequestResetCode/VerifyResetCode/ResetPassword", element: <ResetPassword /> },
  ])

  return <>

    <RouterProvider router={routers}></RouterProvider>

  </>
}
