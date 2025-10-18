import React from 'react';
import { Route, Routes, Navigate, Form } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from './NotFound/NotFound';
import OverviewAdmin from "./Admin/OverviewAdmin";
import DelegateDetails from "./Delegates/DelegateDetails";
import DelegatesOrgan from "./Delegates/DelegatesOrgan";
import NOKForm from './NextofKin/NOKForm';
import AddDelegateForm from "./Delegates/AddDelegateForm";
import EditDelegate from "./Delegates/EditDelegate";
import ViewDelegate from "./Delegates/ViewDelegate";
import FundraiserDashboard from "./Fundraiser/FundraiserDashbard";
import CreateCampaignForm from "./Fundraiser/CreateCampaignForm";
import ViewCampaigns from "./Fundraiser/ViewCampaigns";
import CampaignDetails from "./Fundraiser/CampaignDetails";
import EditCampaign from "./Fundraiser/EditCampaign";
import NewsDashboard from "./News/NewsDashboard";
import CreateNews from "./News/CreateNews";
import ViewNews from "./News/ViewNews";
import EditNews from "./News/EditNews";
import AuthPage from "./Auth/AuthPage";
import Sidebar from "./Admin/Sidebar";
import AuthLayout from "./Auth/AuthLayout";
import ContactDashboard from "./Contacts/ContactDashboard";
import CreateSurvey from "./Contacts/CreateSurvey";
import ViewMessage from "./Contacts/ViewMessage";
import MessagesPage from "./Contacts/MessagesPage";
import ViewSurvey from "./Contacts/ViewSurvey";
import SkillsDirectoryDashboard from './Contacts/SkillsDirectoryDashboard';
import UserManagementDashboard from './Settings/UserManagement';
import Forms from './Forms/Forms';
import ConfirmationJournalForm from './Forms/ConfirmationJournalForm';
import NewApplicantJournalForm from './Forms/NewApplicantJournalForm';
import RegistrationRejectionForm from './Forms/RegistrationRejectionForm';
import DataHubDashboard from './Data Hub/DataHub';
import CreateForm from './Forms/CreateForm';
import VisionEditor from './Vision/VisionEditor';
import VolunteerDashboard from './Volunteer/VolunteerDashboard';

const AllRouting = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <div className="flex">
           {isAuthenticated && <Sidebar setIsAuthenticated={setIsAuthenticated} />}
            <div className="flex-grow">
                <Routes>
                    {/* Authentication Routes */}
                    <Route path="/login" element={<AuthLayout><AuthPage type="login" /></AuthLayout>} />
                    <Route path="/register" element={<AuthLayout><AuthPage type="register" /></AuthLayout>} />
                    
                    {/* Protected Routes */}
                    {isAuthenticated ? (
                        <>
                            <Route path="/" element={<OverviewAdmin />} />
                            <Route path="/delegateDetails/:organname" element={<DelegateDetails />} />
                            <Route path="/overview" element={<OverviewAdmin />} />
                            <Route path="/delegateorgans" element={<DelegatesOrgan />} />
                            <Route path="/adddelegate" element={<AddDelegateForm />} />
                            <Route path="/editdelegate/:id" element={<EditDelegate />} />
                            <Route path="/viewdelegate/:id" element={<ViewDelegate />} />
                            <Route path="/fundraiser" element={<FundraiserDashboard />} />
                            <Route path="/fundraiser/createcampaign" element={<CreateCampaignForm />} />
                            <Route path="/fundraiser/viewcampaigns" element={<ViewCampaigns />} />
                            <Route path="/campaign/:id" element={<CampaignDetails />} />
                            <Route path="/editcampaign/:id" element={<EditCampaign />} />
                            <Route path="/polling" element={<NOKForm />} />
                            <Route path="/newsdashboard" element={<NewsDashboard />} />
                            <Route path="/createnews" element={<CreateNews />} />
                            <Route path="/news/:id" element={<ViewNews />} />
                            <Route path="/editnews/:id" element={<EditNews />} />
                            <Route path="/contactsdashboard" element={<ContactDashboard />} />
                            <Route path="/createsurvey" element={<CreateSurvey />} />
                            <Route path="/viewsurvey/:id" element={<ViewSurvey />} />
                            <Route path="/viewmessage/:id" element={<ViewMessage />} />
                            <Route path="/messages" element={<MessagesPage />} />
                            <Route path="/skills-directory" element={<SkillsDirectoryDashboard />} />
                            <Route path="/user-management" element={<UserManagementDashboard />} />
                            <Route path="/forms" element={<Forms/>} />
                            <Route path="/forms/create" element={<CreateForm/>} />
                            <Route path="/forms/confirmation" element={<ConfirmationJournalForm/>} />
                            <Route path="/forms/newapplicant" element={<NewApplicantJournalForm/>} />
                            <Route path="/forms/rrf" element={<RegistrationRejectionForm/>} />
                            <Route path="/datahub" element={<DataHubDashboard/>} />
                             <Route path="/vision" element={<VisionEditor/>} />
                             <Route path="/volunteer" element={<VolunteerDashboard/>} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" />} />
                    )}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
};

export default AllRouting;