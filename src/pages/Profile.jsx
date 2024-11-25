import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { 
  MessageCircle, 
  BookOpen, 
  Settings, 
  Send, 
  Upload, 
  Link as LinkIcon, 
  Moon, 
  Sun,
  Menu,
  X,
  LogOut,
  ChevronDown,
  MoreVertical,
  Key,
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [websiteLinks, setWebsiteLinks] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [savedApiKeys, setSavedApiKeys] = useState([]);
  const [employees] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
      status: 'Online',
      department: 'Engineering',
      timezone: 'PST'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Product Manager',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c1f4b6',
      status: 'In a meeting',
      department: 'Product',
      timezone: 'EST'
    },
    {
      id: 3,
      name: 'Emma Davis',
      title: 'UX Designer',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=f4b6e3',
      status: 'Online',
      department: 'Design',
      timezone: 'GMT'
    },
    {
      id: 4,
      name: 'James Wilson',
      title: 'DevOps Engineer',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=f4d6b6',
      status: 'Away',
      department: 'Infrastructure',
      timezone: 'CST'
    }
  ]);

  const aiPlatforms = [
    { id: 'openai', name: 'OpenAI', icon: '🤖' },
    { id: 'anthropic', name: 'Anthropic', icon: '🧠' },
    { id: 'cohere', name: 'Cohere', icon: '💡' },
    { id: 'stability', name: 'Stability AI', icon: '🎨' },
    { id: 'google', name: 'Google AI', icon: '🌐' },
  ];

  const fileInputRef = useRef(null);
  const linkInputRef = useRef(null);

  useEffect(() => {
    // Set default selected employee
    if (!selectedEmployee && employees.length > 0) {
      setSelectedEmployee(employees[0]);
    }
  }, [employees, selectedEmployee]);

  const chatProfile = {
    name: selectedEmployee?.name,
    title: selectedEmployee?.title,
    photoUrl: selectedEmployee?.photoUrl,
    status: selectedEmployee?.status
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const generateEmployeeResponse = (employeeId, userMessage) => {
    const responses = {
      1: [ // Sarah Johnson - Senior Software Engineer
        "That's an interesting technical challenge. Let me help you solve that.",
        "I can help optimize that code for better performance.",
        "Have you considered using a different design pattern here?",
        "Let me share some best practices for this scenario."
      ],
      2: [ // Michael Chen - Product Manager
        "Great idea! Let's discuss how this aligns with our product roadmap.",
        "Have you gathered any user feedback on this feature?",
        "Let's prioritize this in our next sprint planning.",
        "I can help create a user story for this requirement."
      ],
      3: [ // Emma Davis - UX Designer
        "From a user experience perspective, we should consider...",
        "Let me create a quick mockup to visualize this.",
        "Have you considered the accessibility implications?",
        "We should test this with our user research group."
      ],
      4: [ // James Wilson - DevOps Engineer
        "I can help set up the deployment pipeline for this.",
        "Let's review the infrastructure requirements.",
        "We should consider scaling implications here.",
        "I'll check our monitoring setup for this service."
      ]
    };

    const employeeResponses = responses[employeeId] || responses[1];
    return employeeResponses[Math.floor(Math.random() * employeeResponses.length)];
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Math.random().toString(36).substr(2, 9),
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simulate employee typing
      setIsTyping(true);
      
      // Simulate response delay
      setTimeout(() => {
        const employeeResponse = {
          id: Math.random().toString(36).substr(2, 9),
          text: generateEmployeeResponse(selectedEmployee?.id, newMessage),
          sender: 'employee',
          timestamp: new Date(),
          employee: selectedEmployee
        };
        setMessages(prev => [...prev, employeeResponse]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocs = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const addWebsiteLink = () => {
    const link = linkInputRef.current.value;
    if (link.trim()) {
      setWebsiteLinks([
        ...websiteLinks, 
        { id: Math.random().toString(36).substr(2, 9), url: link }
      ]);
      linkInputRef.current.value = '';
    }
  };

  const handleSaveApiKey = () => {
    if (selectedPlatform && apiKey) {
      setSavedApiKeys([
        ...savedApiKeys,
        {
          id: Date.now(),
          platform: selectedPlatform,
          key: apiKey,
          addedAt: new Date()
        }
      ]);
      setSelectedPlatform('');
      setApiKey('');
      setIsAddingKey(false);
    }
  };

  const handleRemoveApiKey = (keyId) => {
    setSavedApiKeys(savedApiKeys.filter(key => key.id !== keyId));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-600 to-blue-800">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[1920px] mx-auto px-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-4 rounded-xl hover:bg-white/10 transition-colors text-white"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className={`
            mt-6 w-full transition-all duration-200 ease-in-out
            ${isMobileMenuOpen ? 'block' : 'hidden sm:block'}
          `}>
            <div className="grid grid-cols-3 gap-4 w-full">
              {[
                { label: 'Chat', value: 'chat', icon: MessageCircle },
                { label: 'Knowledge Base', value: 'knowledge', icon: BookOpen },
                { label: 'Settings', value: 'settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button 
                    key={tab.value}
                    onClick={() => {
                      setActiveTab(tab.value);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      group relative p-4 rounded-xl transition-all w-full
                      ${activeTab === tab.value 
                        ? 'bg-white text-blue-600 shadow-lg' 
                        : 'bg-white/10 hover:bg-white/20 text-white'}
                    `}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Icon 
                        size={24} 
                        className="transition-transform group-hover:scale-110"
                      />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[1920px] mx-auto px-4">
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className={`
              w-full rounded-xl overflow-hidden shadow-xl
              ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
            `}>
              {/* Chat Profile Dropdown */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedEmployee?.photoUrl}
                      alt={selectedEmployee?.name}
                      className="w-10 h-10 rounded-full border-2 border-blue-500/20"
                    />
                    <div className="text-left">
                      <h3 className="font-medium">{selectedEmployee?.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        selectedEmployee?.status === 'Online' ? 'bg-green-500' :
                        selectedEmployee?.status === 'Away' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee?.status}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {/* Dropdown Content */}
                {isProfileDropdownOpen && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    {/* Current Employee Details */}
                    <div className="px-4 py-3 space-y-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Department</span>
                        <span>{selectedEmployee?.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Timezone</span>
                        <span>{selectedEmployee?.timezone}</span>
                      </div>
                    </div>
                    
                    {/* Employee List */}
                    <div className="py-2 max-h-64 overflow-y-auto">
                      {employees.map(employee => (
                        <button
                          key={employee.id}
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            selectedEmployee?.id === employee.id ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                          }`}
                        >
                          <img
                            src={employee.photoUrl}
                            alt={employee.name}
                            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                          />
                          <div className="flex-1 text-left">
                            <h4 className="font-medium text-sm">{employee.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{employee.title}</p>
                          </div>
                          <span className={`w-2 h-2 rounded-full ${
                            employee.status === 'Online' ? 'bg-green-500' :
                            employee.status === 'Away' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}></span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-20rem)]">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`
                      p-4 rounded-xl shadow-md transition-all w-full max-w-2xl
                      ${msg.sender === 'user' 
                        ? 'ml-auto bg-blue-600 text-white font-medium' 
                        : 'mr-auto bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'}
                    `}
                  >
                    {msg.sender === 'employee' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={msg.employee?.photoUrl}
                          alt={msg.employee?.name}
                          className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                        />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {msg.employee?.name}
                        </span>
                      </div>
                    )}
                    <p className={`
                      text-base leading-relaxed
                      ${msg.sender === 'user' 
                        ? 'text-white' 
                        : 'text-gray-800 dark:text-gray-100'}
                    `}>
                      {msg.text}
                    </p>
                    <span className={`
                      text-xs mt-2 block
                      ${msg.sender === 'user'
                        ? 'text-blue-100 opacity-80'
                        : 'text-gray-500 dark:text-gray-400'}
                    `}>
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-2 text-sm">
                    <img
                      src={selectedEmployee?.photoUrl}
                      alt={selectedEmployee?.name}
                      className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                    />
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {selectedEmployee?.name} is typing...
                    </span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" 
                           style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" 
                           style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" 
                           style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 
                             text-gray-900 dark:text-gray-100 
                             placeholder-gray-500 dark:placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-colors duration-200"
                  />
                  <button
                    onClick={sendMessage}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                             dark:focus:ring-offset-gray-900
                             transition-colors duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Knowledge Base Tab */}
          {activeTab === 'knowledge' && (
            <div className={`
              w-full rounded-xl overflow-hidden shadow-xl
              ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
            `}>
              <div className="w-full max-w-[1920px] mx-auto">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload} 
                  multiple 
                  className="hidden"
                />
                <div className="flex justify-between items-center w-full mb-6">
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center"
                  >
                    <Upload size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 w-full">
                  {documents.map(doc => (
                    <div 
                      key={doc.id} 
                      className={`
                        p-4 rounded-xl transition-all w-full
                        ${theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}
                      `}
                    >
                      <p className="truncate">{doc.name}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 w-full">
                  <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
                    <input 
                      type="text" 
                      ref={linkInputRef}
                      placeholder="Enter website link" 
                      className={`
                        flex-1 p-4 rounded-xl transition-all
                        ${theme === 'dark' 
                          ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' 
                          : 'bg-gray-100 text-gray-900 border-gray-200 placeholder-gray-500'}
                        border
                      `}
                      onKeyPress={(e) => e.key === 'Enter' && addWebsiteLink()}
                    />
                    <button 
                      onClick={addWebsiteLink}
                      className="p-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center justify-center"
                    >
                      <LinkIcon size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 w-full">
                    {websiteLinks.map(link => (
                      <a 
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className={`
                          p-4 rounded-xl transition-all w-full
                          ${theme === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}
                        `}
                      >
                        <p className="truncate">{link.url}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className={`
                p-6 rounded-xl shadow-xl
                ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
              `}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Appearance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Choose your preferred theme
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`
                      p-2 rounded-xl transition-colors
                      ${theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* API Keys Management */}
              <div className={`
                p-6 rounded-xl shadow-xl
                ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
              `}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium">API Keys</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage your AI platform API keys
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingKey(!isAddingKey)}
                    className={`
                      p-2 rounded-xl transition-colors flex items-center space-x-2
                      ${isAddingKey
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'}
                    `}
                  >
                    {isAddingKey ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>

                {/* Add New API Key Form */}
                {isAddingKey && (
                  <div className="space-y-4 mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <label className="block text-sm font-medium mb-1">Platform</label>
                      <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className={`
                          w-full p-2 rounded-xl border
                          ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'}
                        `}
                      >
                        <option value="">Select Platform</option>
                        {aiPlatforms.map(platform => (
                          <option key={platform.id} value={platform.id}>
                            {platform.icon} {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">API Key</label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className={`
                            w-full p-2 pr-10 rounded-xl border
                            ${theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'}
                          `}
                          placeholder="Enter your API key"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveApiKey}
                      disabled={!selectedPlatform || !apiKey}
                      className={`
                        w-full p-2 rounded-xl text-white transition-colors
                        ${(!selectedPlatform || !apiKey)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'}
                      `}
                    >
                      Save API Key
                    </button>
                  </div>
                )}

                {/* Saved API Keys List */}
                <div className="space-y-3">
                  {savedApiKeys.map(key => {
                    const platform = aiPlatforms.find(p => p.id === key.platform);
                    return (
                      <div
                        key={key.id}
                        className={`
                          p-3 rounded-xl border flex items-center justify-between
                          ${theme === 'dark'
                            ? 'bg-gray-700/50 border-gray-600'
                            : 'bg-gray-50 border-gray-200'}
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{platform?.icon}</span>
                          <div>
                            <h4 className="font-medium">{platform?.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Added {new Date(key.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveApiKey(key.id)}
                          className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
