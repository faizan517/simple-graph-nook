
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Phone, 
  Mail,
  FileText,
  ClipboardList,
  AlertCircle
} from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const { getUserById } = useAuth();
  const [user, setUser] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get basic user info
        const userData = await getUserById(parseInt(id));
        if (userData) {
          setUser(userData);
        }
        
        // Get detailed quotation data for this user using the new API endpoint format
        const response = await fetch(`http://localhost:5000/api/quotation/user/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setQuotations(result.data.quotations);
          
          // If quotations exist, select the most recent one by default
          if (result.data.quotations && result.data.quotations.length > 0) {
            const submittedQuotation = result.data.quotations.find(q => 
              q.quotation_details.status === 'submitted'
            );
            
            // Select submitted quotation if available, otherwise the newest one
            setSelectedQuotation(
              submittedQuotation || result.data.quotations[0]
            );
          }
        } else {
          console.error("API error:", result);
          toast.error("Failed to load quotation data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error connecting to the API");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, getUserById]);

  const handleBack = () => {
    navigate('/users');
  };

  const handleSelectQuotation = (quotation) => {
    setSelectedQuotation(quotation);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Rs. 0.00";
    
    // If it's already a string with "Rs." prefix, return as is
    if (typeof amount === 'string' && amount.includes('Rs.')) {
      return amount;
    }
    
    // Otherwise format it
    return `Rs. ${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
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
              <p className="font-medium">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p>{user.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p>{user.contactInfo?.mobile}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Submission Date</p>
              <p>{user.createdAt}</p>
            </div>
          </div>
        </div>

        {/* Quotation Selection - show only if the user has quotations */}
        {quotations.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-medium mb-4">Quotations</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {quotations.map((quotation) => (
                <button
                  key={quotation.quotation_details.id}
                  onClick={() => handleSelectQuotation(quotation)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedQuotation?.quotation_details.id === quotation.quotation_details.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Quotation #{quotation.quotation_details.id}
                  {quotation.quotation_details.status === 'submitted' && (
                    <span className="ml-1.5 inline-block px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                      Submitted
                    </span>
                  )}
                  {quotation.quotation_details.status === 'draft' && (
                    <span className="ml-1.5 inline-block px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
                      Draft
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Showing {quotations.length} quotation{quotations.length > 1 ? 's' : ''} for this lead
            </p>
          </div>
        )}
        
        {selectedQuotation && selectedQuotation.quotation_details.status === 'submitted' && Object.keys(selectedQuotation.hr_plans).length > 0 ? (
          <>
            {/* Insurance Plan Details for submitted quotation */}
            <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-medium mb-4">Insurance Plan Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Quotation Date</p>
                  <p className="font-medium">{formatDate(selectedQuotation.quotation_details.created_at)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{selectedQuotation.quotation_details.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Maternity Coverage</p>
                  <p className="font-medium">{selectedQuotation.calculations.maternity_coverage_status || "Not applicable"}</p>
                </div>
              </div>
            </div>
            
            {/* Hospitalization Benefits */}
            <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Hospitalization & Related Benefits</h2>
              </div>
              
              {Object.keys(selectedQuotation.hr_plans).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Plan</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Lives Covered</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Premium</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {Object.entries(selectedQuotation.hr_plans).map(([planName, plan]) => (
                        <tr key={planName} className="hover:bg-muted/10">
                          <td className="px-3 py-2 text-sm">{planName}</td>
                          <td className="px-3 py-2 text-sm">{plan.total_lives}</td>
                          <td className="px-3 py-2 text-sm font-medium">{formatCurrency(plan.total_premium)}</td>
                        </tr>
                      ))}
                      <tr className="bg-muted/20 font-medium">
                        <td className="px-3 py-2 text-sm">Total</td>
                        <td className="px-3 py-2 text-sm">{selectedQuotation.calculations.hr_total_lives}</td>
                        <td className="px-3 py-2 text-sm">{formatCurrency(selectedQuotation.calculations.hr_total_premium)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No hospitalization plans available</p>
              )}
            </div>
            
            {/* Maternity Benefits - only show if maternity is included */}
            {selectedQuotation.quotation_details.include_maternity === 1 && Object.keys(selectedQuotation.maternity_plans).length > 0 && (
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
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Spouses Covered</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Premium</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {Object.entries(selectedQuotation.maternity_plans).map(([planName, plan]) => (
                        <tr key={planName} className="hover:bg-muted/10">
                          <td className="px-3 py-2 text-sm">{planName}</td>
                          <td className="px-3 py-2 text-sm">{plan.total_spouses}</td>
                          <td className="px-3 py-2 text-sm font-medium">{formatCurrency(plan.total_premium)}</td>
                        </tr>
                      ))}
                      <tr className="bg-muted/20 font-medium">
                        <td className="px-3 py-2 text-sm">Total</td>
                        <td className="px-3 py-2 text-sm">{selectedQuotation.calculations.maternity_total_lives}</td>
                        <td className="px-3 py-2 text-sm">{formatCurrency(selectedQuotation.calculations.maternity_total_premium)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Waiver Information */}
            {selectedQuotation.calculations.waiver_percentage && (
              <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-medium">Waiver Information</h2>
                </div>
                <p className="mb-2">A {selectedQuotation.calculations.waiver_percentage}% waiver has been applied to this quotation.</p>
              </div>
            )}
            
            {/* Premium Summary */}
            <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-medium mb-4">Premium Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-sm">Total H & R Premium</span>
                  <span className="font-medium">{formatCurrency(selectedQuotation.calculations.hr_total_premium)}</span>
                </div>
                {selectedQuotation.quotation_details.include_maternity === 1 && (
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-sm">Total Maternity Premium</span>
                    <span className="font-medium">{formatCurrency(selectedQuotation.calculations.maternity_total_premium)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold">Total Premium Payable</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(selectedQuotation.calculations.total_premium)}</span>
                </div>
              </div>
            </div>
          </>
        ) : selectedQuotation && selectedQuotation.quotation_details.status === 'draft' ? (
          <div className="border border-border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-medium">Draft Quotation</h2>
            </div>
            <p className="mt-2">This quotation is still in draft mode and doesn't have complete details yet.</p>
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">Quotation #{selectedQuotation.quotation_details.id}</p>
              <p className="text-sm text-muted-foreground">Created on {formatDate(selectedQuotation.quotation_details.created_at)}</p>
              <p className="text-sm text-muted-foreground">Maternity included: {selectedQuotation.quotation_details.include_maternity === 1 ? 'Yes' : 'No'}</p>
            </div>
          </div>
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
