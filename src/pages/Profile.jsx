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
  X,
  LogOut
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
              <div className="flex-1 overflow-y-auto p-4 space-y-3 w-full">
                <div className="w-full max-w-[1920px] mx-auto">
                  {messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`
                        p-4 rounded-xl shadow-md transition-all w-full
                        ${msg.sender === 'user' 
                          ? 'ml-auto text-white ' + (theme === 'dark' 
                              ? 'bg-blue-600 hover:bg-blue-500' 
                              : 'bg-blue-500 hover:bg-blue-400')
                          : theme === 'dark' 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}
                      `}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full p-4 md:p-6 border-t backdrop-blur-sm">
                <div className="flex gap-3">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className={`
                      flex-1 p-4 rounded-xl transition-all
                      ${theme === 'dark' 
                        ? 'bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 border-gray-600 placeholder-gray-400' 
                        : 'bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-500 border-gray-200 placeholder-gray-500'}
                      border focus:outline-none
                    `}
                    placeholder="Type a message..."
                  />
                  <button 
                    onClick={sendMessage}
                    className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center shadow-lg"
                    aria-label="Send Message"
                  >
                    <Send size={24} />
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
            <div className={`
              w-full rounded-xl overflow-hidden shadow-xl
              ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
            `}>
              <div className="w-full max-w-[1920px] mx-auto space-y-6">
                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
                `}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-medium text-lg">Theme Preference</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Choose between light and dark mode
                      </p>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className={`
                        p-4 rounded-lg transition-colors flex items-center justify-center
                        ${theme === 'dark' 
                          ? 'bg-blue-600 hover:bg-blue-500' 
                          : 'bg-gray-200 hover:bg-gray-300'}
                        text-white
                      `}
                      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                  </div>
                </div>

                <div className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
                `}>
                  <h3 className="font-medium text-lg mb-4">Notifications</h3>
                  <div className="space-y-6">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Desktop Notifications</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Get notified about new messages and updates
                        </p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only"
                          onChange={(e) => console.log('Desktop notifications:', e.target.checked)}
                        />
                        <div className={`
                          block w-14 h-8 rounded-full transition-colors
                          ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}
                          peer-checked:bg-blue-600
                        `}></div>
                        <div className={`
                          absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform
                          peer-checked:translate-x-6
                        `}></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Sound Alerts</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Play a sound when receiving new messages
                        </p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          onChange={(e) => console.log('Sound alerts:', e.target.checked)}
                        />
                        <div className={`
                          block w-14 h-8 rounded-full transition-colors
                          ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}
                          peer-checked:bg-blue-600
                        `}></div>
                        <div className={`
                          absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform
                          peer-checked:translate-x-6
                        `}></div>
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
                    className="p-4 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center justify-center"
                    aria-label="Sign Out"
                  >
                    <LogOut size={24} />
                  </button>
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
