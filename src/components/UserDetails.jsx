
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar,
  Mail,
  User,
  FileText,
  Shield,
  Clipboard,
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Profile Card */}
        <div className="glass-card rounded-xl p-6 shadow-sm h-fit lg:sticky lg:top-24">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-sm"
              />
              <span className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-background ${
                user.status === 'Active' ? 'bg-green-500' : 
                user.status === 'Away' ? 'bg-amber-500' : 
                'bg-gray-400'
              }`}></span>
            </div>
            
            <h2 className="mt-4 text-xl font-semibold">{insuranceData ? insuranceData.personalInfo.name : user.name}</h2>
            <p className="text-muted-foreground">{user.role}</p>
            
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {user.department}
              </span>
              <span className={`px-3 py-1 rounded-full ${
                user.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : user.status === 'Away'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.status}
              </span>
            </div>
            
            <div className="w-full mt-6 pt-6 border-t border-border">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                  <p className="text-sm">{insuranceData ? insuranceData.personalInfo.email : user.email}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                  <p className="text-sm">{insuranceData ? insuranceData.personalInfo.mobile : user.contact.phone}</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-3 mt-0.5" />
                  <p className="text-sm">{user.contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Insurance Proposal Details */}
        {insuranceData ? (
          <div className="lg:col-span-2 space-y-8">
            {/* Insurance Header */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">{insuranceData.companyName}</h3>
                <p className="text-muted-foreground">{insuranceData.proposalTitle} FOR {insuranceData.personalInfo.name}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <User className="h-4 w-4 mr-2" />
                    <span>Plan For</span>
                  </div>
                  <p className="font-medium">{insuranceData.personalInfo.planFor}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Plan Category</span>
                  </div>
                  <p className="font-medium">{insuranceData.personalInfo.planCategory}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clipboard className="h-4 w-4 mr-2" />
                    <span>Maternity Coverage</span>
                  </div>
                  <p className="font-medium">{insuranceData.personalInfo.maternityStatus}</p>
                </div>
              </div>
            </div>
            
            {/* Hospitalization Benefits */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Hospitalization & Related Benefits</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-4 py-2 text-left text-sm">Plan</th>
                      <th className="px-4 py-2 text-left text-sm">H&R Limits</th>
                      <th className="px-4 py-2 text-left text-sm">Accident Coverage</th>
                      <th className="px-4 py-2 text-left text-sm">Room & Board</th>
                      <th className="px-4 py-2 text-left text-sm">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {insuranceData.hospitalizationBenefits.map((benefit, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{benefit.plan}</td>
                        <td className="px-4 py-3 text-sm">{benefit.limits}</td>
                        <td className="px-4 py-3 text-sm">{benefit.accident}</td>
                        <td className="px-4 py-3 text-sm">{benefit.roomBoard}</td>
                        <td className="px-4 py-3 text-sm font-medium">{benefit.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Maternity Benefits */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Maternity Benefits</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-4 py-2 text-left text-sm">Plan</th>
                      <th className="px-4 py-2 text-left text-sm">Normal Delivery</th>
                      <th className="px-4 py-2 text-left text-sm">Complicated Delivery</th>
                      <th className="px-4 py-2 text-left text-sm">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {insuranceData.maternityBenefits.map((benefit, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{benefit.plan}</td>
                        <td className="px-4 py-3 text-sm">{benefit.normalDelivery}</td>
                        <td className="px-4 py-3 text-sm">{benefit.complicatedDelivery}</td>
                        <td className="px-4 py-3 text-sm font-medium">{benefit.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Census Information */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Plan Wise Census Information</h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary text-primary-foreground">
                        <th className="px-4 py-2 text-left text-sm"></th>
                        <th className="px-4 py-2 text-left text-sm">H&R</th>
                        <th className="px-4 py-2 text-left text-sm">Maternity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium">Total Lives</td>
                        <td className="px-4 py-3 text-sm">{insuranceData.censusInfo.totalLives.hnr}</td>
                        <td className="px-4 py-3 text-sm">{insuranceData.censusInfo.totalLives.maternity}</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium">Total Premium</td>
                        <td className="px-4 py-3 text-sm">{insuranceData.censusInfo.totalPremium.hnr}</td>
                        <td className="px-4 py-3 text-sm">{insuranceData.censusInfo.totalPremium.maternity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary text-primary-foreground">
                        <th className="px-4 py-2 text-left text-sm">Total Lives Insured</th>
                        <th className="px-4 py-2 text-left text-sm">Numbers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">Total Number of Insured (for ages &lt;65)</td>
                        <td className="px-4 py-3 text-sm">{insuranceData.insuredNumbers.totalInsured}</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">Total Number of Employees</td>
                        <td className="px-4 py-3 text-sm">{insuranceData.insuredNumbers.employees}</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">Total Number of Spouses</td>
                        <td className="px-4 py-3 text-sm">{insuranceData.insuredNumbers.spouses}</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">Total Number of Children</td>
                        <td className="px-4 py-3 text-sm">{insuranceData.insuredNumbers.children}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Notes</h3>
              
              <ul className="list-disc list-inside space-y-2">
                {insuranceData.notes.map((note, index) => (
                  <li key={index} className="text-sm text-muted-foreground pl-2">{note}</li>
                ))}
              </ul>
            </div>
            
            {/* Total Premium */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Premium Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-sm">Total H & R Premium</span>
                  <span className="font-medium">{insuranceData.totalPremiums.hnr}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-sm">Total Maternity Premium</span>
                  <span className="font-medium">{insuranceData.totalPremiums.maternity}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold">Total Premium Payable</span>
                  <span className="text-lg font-bold text-primary">{insuranceData.totalPremiums.totalPayable}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">* The annual premium is subject to change if there is any change in tax rate/tax structure by the government.</p>
                <p className="text-xs text-muted-foreground italic">Especially prepared by Mentor Health Limited for {insuranceData.personalInfo.name}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">General Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <User className="h-4 w-4 mr-2" />
                    <span>User ID</span>
                  </div>
                  <p className="font-medium">{user.id}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    <span>Department</span>
                  </div>
                  <p className="font-medium">{user.department}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Submission Date</span>
                  </div>
                  <p className="font-medium">{user.joinDate}</p>
                </div>
              </div>
            </div>
            
            {/* Lead Submitted Plans */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Submitted Plans</h3>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">This lead has not submitted any specific insurance plans yet. View their profile information for contact details.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
