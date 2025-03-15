
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Phone, 
  Mail,
  FileText,
  ClipboardList
} from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const { getUserById } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const userData = getUserById(parseInt(id));
      if (userData) {
        setUser(userData);
      }
      setIsLoading(false);
    }, 800);
  }, [id, getUserById]);

  const handleBack = () => {
    navigate('/users');
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Lead not found</h2>
          <p className="text-muted-foreground mb-6">The requested lead does not exist.</p>
          <button 
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  // For demo purposes, we'll add insurance proposal data for the first user
  const insuranceData = id === "1" ? {
    companyName: "Mentor Health Assurance",
    proposalTitle: "GROUP HEALTHCARE INSURANCE PROPOSAL",
    personalInfo: {
      name: "Faizan",
      mobile: "+923293423754",
      email: "faizanpervaiz517@gmail.com",
      planFor: "Employees Spouse Children",
      planCategory: "Customized",
      maternityStatus: "Eligible with immediate coverage"
    },
    hospitalizationBenefits: [
      { plan: "Plan C", limits: "500,000", accident: "100%", roomBoard: "15,000", premium: "Rs. 380,717" },
      { plan: "Plan D", limits: "400,000", accident: "100%", roomBoard: "12,000", premium: "Rs. 267,386" }
    ],
    maternityBenefits: [
      { plan: "Plan B", normalDelivery: "100,000", complicatedDelivery: "150,000", premium: "Rs. 443,212" },
      { plan: "Plan E", normalDelivery: "40,000", complicatedDelivery: "60,000", premium: "Rs. 393,066" }
    ],
    censusInfo: {
      totalLives: { hnr: "33", maternity: "41" },
      totalPremium: { hnr: "Rs. 648,103", maternity: "Rs. 836,278" }
    },
    insuredNumbers: {
      totalInsured: "74",
      employees: "33",
      spouses: "41",
      children: "9"
    },
    notes: [
      "In case of treatment from Non-PPN facilities, reasonable and customary charges as in PPN facilities shall be paid.",
      "Eligibility Definition for the 1 Plans has to be provided before Policy Confirmation.",
      "Pre-existing & Congenital Conditions covered up to 15% of H&R limits.",
      "Medical Emergencies are covered.",
      "Room Limits opted shall also apply to Hospitalization in Maternity Cases.",
      "Maternity Coverage Status: Eligible with immediate coverage",
      "For detailed Exclusions / Limitations, please refer to the policy document.",
      "Maternity and its related benefits are not covered under H&R benefit."
    ],
    totalPremiums: {
      hnr: "Rs. 648,103",
      maternity: "Rs. 836,278",
      totalPayable: "Rs. 1,484,381"
    }
  } : null;

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <button 
        onClick={handleBack}
        className="mb-6 inline-flex items-center px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium transition-colors hover:bg-secondary/80"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to Leads
      </button>
      
      <div className="space-y-6">
        {/* Contact Information */}
        <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-lg font-medium mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{insuranceData ? insuranceData.personalInfo.name : user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p>{insuranceData ? insuranceData.personalInfo.email : user.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p>{insuranceData ? insuranceData.personalInfo.mobile : user.contact?.phone}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Submission Date</p>
              <p>{user.joinDate}</p>
            </div>
          </div>
        </div>
        
        {insuranceData ? (
          <>
            {/* Insurance Plan Details */}
            <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-medium mb-4">Insurance Plan Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plan For</p>
                  <p className="font-medium">{insuranceData.personalInfo.planFor}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plan Category</p>
                  <p className="font-medium">{insuranceData.personalInfo.planCategory}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Maternity Coverage</p>
                  <p className="font-medium">{insuranceData.personalInfo.maternityStatus}</p>
                </div>
              </div>
            </div>
            
            {/* Hospitalization Benefits */}
            <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Hospitalization & Related Benefits</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Plan</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">H&R Limits</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Accident Coverage</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Room & Board</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {insuranceData.hospitalizationBenefits.map((benefit, index) => (
                      <tr key={index} className="hover:bg-muted/10">
                        <td className="px-3 py-2 text-sm">{benefit.plan}</td>
                        <td className="px-3 py-2 text-sm">{benefit.limits}</td>
                        <td className="px-3 py-2 text-sm">{benefit.accident}</td>
                        <td className="px-3 py-2 text-sm">{benefit.roomBoard}</td>
                        <td className="px-3 py-2 text-sm font-medium">{benefit.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Maternity Benefits */}
            <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Maternity Benefits</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Plan</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Normal Delivery</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Complicated Delivery</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {insuranceData.maternityBenefits.map((benefit, index) => (
                      <tr key={index} className="hover:bg-muted/10">
                        <td className="px-3 py-2 text-sm">{benefit.plan}</td>
                        <td className="px-3 py-2 text-sm">{benefit.normalDelivery}</td>
                        <td className="px-3 py-2 text-sm">{benefit.complicatedDelivery}</td>
                        <td className="px-3 py-2 text-sm font-medium">{benefit.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Census Information */}
            <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Census Information</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground"></th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">H&R</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Maternity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/10">
                        <td className="px-3 py-2 text-sm font-medium">Total Lives</td>
                        <td className="px-3 py-2 text-sm">{insuranceData.censusInfo.totalLives.hnr}</td>
                        <td className="px-3 py-2 text-sm">{insuranceData.censusInfo.totalLives.maternity}</td>
                      </tr>
                      <tr className="hover:bg-muted/10">
                        <td className="px-3 py-2 text-sm font-medium">Total Premium</td>
                        <td className="px-3 py-2 text-sm">{insuranceData.censusInfo.totalPremium.hnr}</td>
                        <td className="px-3 py-2 text-sm">{insuranceData.censusInfo.totalPremium.maternity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Total Lives Insured</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Numbers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/10">
                        <td className="px-3 py-2 text-sm">Total Number of Insured (for ages &lt;65)</td>
                        <td className="px-3 py-2 text-sm">{insuranceData.insuredNumbers.totalInsured}</td>
                      </tr>
                      <tr className="hover:bg-muted/10">
                        <td className="px-3 py-2 text-sm">Total Number of Employees</td>
                        <td className="px-3 py-2 text-sm">{insuranceData.insuredNumbers.employees}</td>
                      </tr>
                      <tr className="hover:bg-muted/10">
                        <td className="px-3 py-2 text-sm">Total Number of Spouses</td>
                        <td className="px-3 py-2 text-sm">{insuranceData.insuredNumbers.spouses}</td>
                      </tr>
                      <tr className="hover:bg-muted/10">
                        <td className="px-3 py-2 text-sm">Total Number of Children</td>
                        <td className="px-3 py-2 text-sm">{insuranceData.insuredNumbers.children}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Premium Summary */}
            <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-medium mb-4">Premium Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-sm">Total H & R Premium</span>
                  <span className="font-medium">{insuranceData.totalPremiums.hnr}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-sm">Total Maternity Premium</span>
                  <span className="font-medium">{insuranceData.totalPremiums.maternity}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold">Total Premium Payable</span>
                  <span className="text-lg font-bold text-primary">{insuranceData.totalPremiums.totalPayable}</span>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-medium mb-4">Notes</h2>
              
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {insuranceData.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-medium mb-4">No Plan Data</h2>
            <p className="text-muted-foreground">This lead has not submitted any specific insurance plans yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
