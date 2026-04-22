import { useState } from 'react';
import { Shield, Mail, Phone, Facebook, FileText, MessageSquare, Lightbulb, Send, CheckCircle, Network, Users, Scale, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { PersistentSidebar } from './PersistentSidebar';

interface KoneksyongLokalPageProps {
  onBack: () => void;
  onLogout?: () => void;
  onNavigate?: (view: string) => void;
}

export function KoneksyongLokalPage({ onBack, onLogout, onNavigate }: KoneksyongLokalPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarNavigate = (view: string) => {
    if (view === 'home') {
      onBack();
    } else if (onNavigate) {
      onNavigate(view);
    }
  };

  // Form states
  const [infoRequestForm, setInfoRequestForm] = useState({
    name: '',
    email: '',
    contactNumber: '',
    requestType: '',
    details: ''
  });

  const [complaintForm, setComplaintForm] = useState({
    name: '',
    email: '',
    contactNumber: '',
    complaintType: '',
    details: ''
  });

  const [suggestionForm, setSuggestionForm] = useState({
    name: '',
    email: '',
    contactNumber: '',
    category: '',
    suggestion: ''
  });

  const handleInfoRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Information request submitted successfully! We will respond within 3-5 business days.');
    setInfoRequestForm({ name: '', email: '', contactNumber: '', requestType: '', details: '' });
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Complaint submitted successfully! You will receive a response within 24-48 hours.');
    setComplaintForm({ name: '', email: '', contactNumber: '', complaintType: '', details: '' });
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your suggestion! Your input helps us serve the community better.');
    setSuggestionForm({ name: '', email: '', contactNumber: '', category: '', suggestion: '' });
  };

  return (
    <div className="min-h-screen bg-[#F8F3D9]">
      <PersistentSidebar 
        currentView="koneksyong-lokal"
        onNavigate={handleSidebarNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-sm bg-[#EBE5C2]/90 border-[#504B38]/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu Button - Left Side */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-12 h-12 rounded-xl hover:scale-110 transition-all duration-300 group bg-[#B9B28A] border-2 border-[#504B38]/30 shadow-sm"
              >
                <div className="relative w-6 h-6 mx-auto flex flex-col justify-center gap-1.5">
                  <div className={`h-0.5 rounded-full transition-all duration-500 bg-white ${isSidebarOpen ? 'rotate-45 translate-y-2' : 'rotate-0'}`} style={{ width: '24px' }} />
                  <div className={`h-0.5 rounded-full transition-all duration-500 bg-white ${isSidebarOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} style={{ width: '20px' }} />
                  <div className={`h-0.5 rounded-full transition-all duration-500 bg-white ${isSidebarOpen ? '-rotate-45 -translate-y-2' : 'rotate-0'}`} style={{ width: '24px' }} />
                </div>
              </button>

              {/* Logo */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm">
                <Network className="w-6 h-6 text-[#504B38]" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#504B38] tracking-tight">Koneksyong Lokal</h1>
                <p className="text-xs text-[#504B38]/60 font-bold uppercase tracking-widest">Freedom of Information</p>
              </div>
            </div>
            {onLogout && (
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="border-2 hover:bg-[#504B38]/10 border-[#504B38]/30 text-[#504B38] font-bold"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="py-16 bg-[#EBE5C2] border-b border-[#504B38]/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-md bg-white">
              <Network className="w-10 h-10 text-[#B9B28A]" strokeWidth={1.5} />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-[#504B38] tracking-tight">
                Koneksyong Lokal
              </h1>
              <p className="text-lg text-[#504B38]/70">
                Freedom of Information Office - Your gateway to transparent governance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto bg-white shadow-sm border border-[#504B38]/10 p-1 rounded-2xl">
              <TabsTrigger value="overview" className="flex flex-col gap-1 py-3 data-[state=active]:bg-[#B9B28A] data-[state=active]:text-white rounded-xl transition-all">
                <Shield className="w-5 h-5" />
                <span className="font-bold">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="info-request" className="flex flex-col gap-1 py-3 data-[state=active]:bg-[#B9B28A] data-[state=active]:text-white rounded-xl transition-all">
                <FileText className="w-5 h-5" />
                <span className="font-bold">Info Request</span>
              </TabsTrigger>
              <TabsTrigger value="complaint" className="flex flex-col gap-1 py-3 data-[state=active]:bg-[#B9B28A] data-[state=active]:text-white rounded-xl transition-all">
                <MessageSquare className="w-5 h-5" />
                <span className="font-bold">Complaints</span>
              </TabsTrigger>
              <TabsTrigger value="suggestion" className="flex flex-col gap-1 py-3 data-[state=active]:bg-[#B9B28A] data-[state=active]:text-white rounded-xl transition-all">
                <Lightbulb className="w-5 h-5" />
                <span className="font-bold">Suggestions</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="border-2 border-[#EBE5C2] rounded-2xl overflow-hidden bg-white shadow-sm">
                <CardHeader className="bg-[#F8F3D9] border-b border-[#504B38]/10">
                  <CardTitle className="text-2xl font-bold text-[#504B38]">About Koneksyong Lokal</CardTitle>
                  <CardDescription className="text-[#504B38]/60 font-medium">
                    Your gateway to transparent governance and community engagement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="prose max-w-none">
                    <p className="text-[#504B38]/80 leading-relaxed font-medium">
                      Koneksyong Lokal serves as the official Freedom of Information Office under the Office of the Administrator, 
                      established in accordance with GMA Transparency Mechanism Ordinance No. 37. This platform is designed 
                      to strengthen open governance, transparency, and accountability within our barangay.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                      { title: 'Information Requests', icon: FileText, text: 'Citizens can request access to barangay records, documents, and information through our transparent request process.' },
                      { title: 'Complaints & Grievances', icon: MessageSquare, text: 'File concerns, complaints, or grievances related to barangay services, governance, or community issues.' },
                      { title: 'Suggestions & Feedback', icon: Lightbulb, text: 'Share your ideas and suggestions to help improve barangay services and policymaking.' },
                      { title: 'Citizen Participation', icon: Users, text: 'Support active citizen participation in governance and policymaking. Stay informed and engaged.' },
                    ].map((item, i) => (
                      <Card key={i} className="bg-white border-2 border-[#F8F3D9] rounded-xl hover:border-[#EBE5C2] transition-all">
                        <CardHeader>
                          <item.icon className="w-8 h-8 text-[#B9B28A] mb-2" />
                          <CardTitle className="text-lg font-bold text-[#504B38]">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-[#504B38]/70 font-medium">{item.text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-2 border-[#EBE5C2] bg-white rounded-2xl overflow-hidden shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-[#504B38] flex items-center gap-2">
                    <Mail className="w-6 h-6" />
                    Contact Information
                  </CardTitle>
                  <CardDescription className="text-[#504B38]/60 font-medium">
                    Reach out to us for assistance or inquiries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { label: 'Email', value: 'gmablockchain@gmail.com', icon: Mail },
                      { label: 'Hotline', value: 'Available Soon', icon: Phone },
                      { label: 'Facebook Page', value: 'GMA Blockchain', icon: Facebook },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-[#F8F3D9]/50 rounded-xl border border-[#504B38]/10">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          <item.icon className="w-6 h-6 text-[#B9B28A]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#504B38]/60 mb-1 font-bold uppercase tracking-widest">{item.label}</p>
                          <p className="text-sm text-[#504B38] font-bold">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Information Request Tab */}
            <TabsContent value="info-request">
              <Card className="border-2 border-[#EBE5C2] rounded-2xl shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-[#504B38] flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#B9B28A]" />
                    Information Request Portal
                  </CardTitle>
                  <CardDescription className="text-[#504B38]/60 font-medium">
                    Request access to barangay records and information under FOI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInfoRequestSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="info-name" className="text-[#504B38] font-bold">Full Name *</Label>
                        <Input
                          id="info-name"
                          value={infoRequestForm.name}
                          onChange={(e) => setInfoRequestForm({...infoRequestForm, name: e.target.value})}
                          placeholder="Juan Dela Cruz"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="info-email" className="text-[#504B38] font-bold">Email Address *</Label>
                        <Input
                          id="info-email"
                          type="email"
                          value={infoRequestForm.email}
                          onChange={(e) => setInfoRequestForm({...infoRequestForm, email: e.target.value})}
                          placeholder="juan@example.com"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="info-contact" className="text-[#504B38] font-bold">Contact Number</Label>
                        <Input
                          id="info-contact"
                          value={infoRequestForm.contactNumber}
                          onChange={(e) => setInfoRequestForm({...infoRequestForm, contactNumber: e.target.value})}
                          placeholder="+63 912 345 6789"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="info-type" className="text-[#504B38] font-bold">Request Type *</Label>
                        <Input
                          id="info-type"
                          value={infoRequestForm.requestType}
                          onChange={(e) => setInfoRequestForm({...infoRequestForm, requestType: e.target.value})}
                          placeholder="e.g., Barangay Budget Records"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="info-details" className="text-[#504B38] font-bold">Request Details *</Label>
                      <Textarea
                        id="info-details"
                        value={infoRequestForm.details}
                        onChange={(e) => setInfoRequestForm({...infoRequestForm, details: e.target.value})}
                        placeholder="Please provide detailed information about what records or information you are requesting..."
                        rows={6}
                        className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                        required
                      />
                    </div>

                    <div className="bg-[#F8F3D9] border border-[#504B38]/10 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-[#504B38]/80">
                          <p className="font-bold text-[#504B38] mb-1">Response Time</p>
                          <p className="font-medium">Your request will be reviewed and responded to within 3-5 business days.</p>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#B9B28A] hover:bg-[#504B38] text-white font-bold h-12 rounded-xl transition-all shadow-md" size="lg">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Information Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Complaint Tab */}
            <TabsContent value="complaint">
              <Card className="border-2 border-[#EBE5C2] rounded-2xl shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-[#504B38] flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-[#B9B28A]" />
                    Complaint Submission
                  </CardTitle>
                  <CardDescription className="text-[#504B38]/60 font-medium">
                    File complaints or grievances related to barangay services and governance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleComplaintSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="complaint-name" className="text-[#504B38] font-bold">Full Name *</Label>
                        <Input
                          id="complaint-name"
                          value={complaintForm.name}
                          onChange={(e) => setComplaintForm({...complaintForm, name: e.target.value})}
                          placeholder="Juan Dela Cruz"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complaint-email" className="text-[#504B38] font-bold">Email Address *</Label>
                        <Input
                          id="complaint-email"
                          type="email"
                          value={complaintForm.email}
                          onChange={(e) => setComplaintForm({...complaintForm, email: e.target.value})}
                          placeholder="juan@example.com"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="complaint-contact" className="text-[#504B38] font-bold">Contact Number</Label>
                        <Input
                          id="complaint-contact"
                          value={complaintForm.contactNumber}
                          onChange={(e) => setComplaintForm({...complaintForm, contactNumber: e.target.value})}
                          placeholder="+63 912 345 6789"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complaint-type" className="text-[#504B38] font-bold">Complaint Type *</Label>
                        <Input
                          id="complaint-type"
                          value={complaintForm.complaintType}
                          onChange={(e) => setComplaintForm({...complaintForm, complaintType: e.target.value})}
                          placeholder="e.g., Service Delay, Noise Complaint"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complaint-details" className="text-[#504B38] font-bold">Complaint Details *</Label>
                      <Textarea
                        id="complaint-details"
                        value={complaintForm.details}
                        onChange={(e) => setComplaintForm({...complaintForm, details: e.target.value})}
                        placeholder="Please describe your complaint in detail..."
                        rows={6}
                        className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#B9B28A] hover:bg-[#504B38] text-white font-bold h-12 rounded-xl transition-all shadow-md" size="lg">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Complaint
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suggestion Tab */}
            <TabsContent value="suggestion">
              <Card className="border-2 border-[#EBE5C2] rounded-2xl shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-[#504B38] flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-[#B9B28A]" />
                    Suggestions & Feedback
                  </CardTitle>
                  <CardDescription className="text-[#504B38]/60 font-medium">
                    Your ideas help us build a better community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSuggestionSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="suggest-name" className="text-[#504B38] font-bold">Full Name</Label>
                        <Input
                          id="suggest-name"
                          value={suggestionForm.name}
                          onChange={(e) => setSuggestionForm({...suggestionForm, name: e.target.value})}
                          placeholder="Juan Dela Cruz"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="suggest-email" className="text-[#504B38] font-bold">Email Address</Label>
                        <Input
                          id="suggest-email"
                          type="email"
                          value={suggestionForm.email}
                          onChange={(e) => setSuggestionForm({...suggestionForm, email: e.target.value})}
                          placeholder="juan@example.com"
                          className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suggest-category" className="text-[#504B38] font-bold">Category</Label>
                      <Input
                        id="suggest-category"
                        value={suggestionForm.category}
                        onChange={(e) => setSuggestionForm({...suggestionForm, category: e.target.value})}
                        placeholder="e.g., Environment, Infrastructure, Youth"
                        className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suggest-details" className="text-[#504B38] font-bold">Your Suggestion *</Label>
                      <Textarea
                        id="suggest-details"
                        value={suggestionForm.suggestion}
                        onChange={(e) => setSuggestionForm({...suggestionForm, suggestion: e.target.value})}
                        placeholder="Tell us your ideas..."
                        rows={6}
                        className="border-2 border-[#EBE5C2] focus-visible:ring-[#B9B28A]"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#B9B28A] hover:bg-[#504B38] text-white font-bold h-12 rounded-xl transition-all shadow-md" size="lg">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Suggestion
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 mt-16 bg-[#EBE5C2] border-t border-[#504B38]/10">
        <div className="container mx-auto px-6 text-center text-[#504B38]">
          <p className="font-bold text-lg mb-2">Koneksyong Lokal</p>
          <p className="text-xs opacity-60">Official FOI Office - Barangay Digital Governance</p>
        </div>
      </footer>
    </div>
  );
}
