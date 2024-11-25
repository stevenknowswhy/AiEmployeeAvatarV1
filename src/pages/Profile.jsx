import React, { useState, useRef } from 'react';
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
  X 
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [websiteLinks, setWebsiteLinks] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const linkInputRef = useRef(null);

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

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Math.random().toString(36).substr(2, 9),
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
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

  return (
    <div className={`
      min-h-screen w-full
      ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
      transition-colors duration-300
    `}>
      {/* Header/Navigation */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="w-full px-4 py-3">
          {/* Mobile Menu Button */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className={`
            mt-4 sm:mt-6 pb-2
            ${isMobileMenuOpen ? 'block' : 'hidden sm:block'}
          `}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
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
                      group relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all
                      ${activeTab === tab.value 
                        ? 'bg-white text-blue-600 shadow-lg shadow-black/5' 
                        : 'text-white/90 hover:bg-white/10'}
                      ${!isMobileMenuOpen && 'sm:flex-1 sm:justify-center'}
                    `}
                  >
                    <Icon 
                      size={20} 
                      className={`
                        transition-transform group-hover:scale-110
                        ${activeTab === tab.value ? 'text-blue-600' : 'text-white/90'}
                      `}
                    />
                    <span className={`
                      font-medium transition-all
                      ${activeTab === tab.value ? 'text-blue-600' : 'text-white/90'}
                    `}>
                      {tab.label}
                    </span>
                    {activeTab === tab.value && (
                      <span className="absolute inset-0 rounded-xl bg-white/10 animate-pulse-slow pointer-events-none"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full p-4 lg:p-6">
        <div className="max-w-[2000px] mx-auto">
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className={`
              rounded-lg overflow-hidden shadow-lg
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            `}>
              <div className="h-[calc(100vh-16rem)] sm:h-[calc(100vh-12rem)] overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`
                      p-3 rounded-xl shadow-md transition-all max-w-[80%] sm:max-w-[60%] lg:max-w-[50%]
                      ${msg.sender === 'user' 
                        ? 'ml-auto ' + (theme === 'dark' 
                            ? 'bg-blue-600 hover:bg-blue-500' 
                            : 'bg-blue-500 hover:bg-blue-400 text-white')
                        : theme === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-opacity-50 backdrop-blur-sm sticky bottom-0">
                <div className="max-w-4xl mx-auto flex space-x-2">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className={`
                      flex-grow p-3 rounded-lg transition-all
                      ${theme === 'dark' 
                        ? 'bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 border-gray-600' 
                        : 'bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500 border-gray-200'}
                      border
                    `}
                    placeholder="Type a message..."
                  />
                  <button 
                    onClick={sendMessage}
                    className="p-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all flex-shrink-0"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Knowledge Base Tab */}
          {activeTab === 'knowledge' && (
            <div className={`
              rounded-lg overflow-hidden shadow-lg p-6
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            `}>
              <div className="max-w-7xl mx-auto">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload} 
                  multiple 
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full sm:w-auto mb-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Upload size={20} />
                  <span>Upload Documents</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {documents.map(doc => (
                    <div 
                      key={doc.id} 
                      className={`
                        p-4 rounded-lg transition-all
                        ${theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-50 hover:bg-gray-100'}
                      `}
                    >
                      <p className="truncate">{doc.name}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                    <input 
                      type="text" 
                      ref={linkInputRef}
                      placeholder="Enter website link" 
                      className={`
                        flex-grow p-3 rounded-lg transition-all
                        ${theme === 'dark' 
                          ? 'bg-gray-700 text-white border-gray-600' 
                          : 'bg-gray-100 text-gray-800 border-gray-200'}
                        border
                      `}
                      onKeyPress={(e) => e.key === 'Enter' && addWebsiteLink()}
                    />
                    <button 
                      onClick={addWebsiteLink}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <LinkIcon size={20} />
                      <span>Add Link</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {websiteLinks.map(link => (
                      <a 
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className={`
                          p-4 rounded-lg transition-all
                          ${theme === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-50 hover:bg-gray-100'}
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
            <div className={`
              rounded-lg overflow-hidden shadow-lg p-6
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            `}>
              <div className="max-w-2xl mx-auto space-y-6">
                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
                `}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-medium text-lg">Theme Preference</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Choose between light and dark mode
                      </p>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className={`
                        p-3 rounded-lg transition-colors flex items-center space-x-2
                        ${theme === 'dark' 
                          ? 'bg-blue-600 hover:bg-blue-500' 
                          : 'bg-gray-200 hover:bg-gray-300'}
                        text-white
                      `}
                    >
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                  </div>
                </div>

                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
                `}>
                  <h3 className="font-medium text-lg mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div>
                        <p className="font-medium">Desktop Notifications</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Get notified about new messages and updates
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div>
                        <p className="font-medium">Sound Alerts</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Play a sound when receiving new messages
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
                `}>
                  <h3 className="font-medium text-lg mb-4">Account</h3>
                  <button
                    onClick={handleLogout}
                    className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
