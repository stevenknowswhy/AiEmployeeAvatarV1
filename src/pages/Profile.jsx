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
  Sun 
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [websiteLinks, setWebsiteLinks] = useState([]);
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

  const renderContent = () => {
    switch(activeTab) {
      case 'chat':
        return (
          <div className={`
            p-4 rounded-lg 
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
              : 'bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800'}
          `}>
            <div className="h-96 overflow-y-auto mb-4 space-y-3">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`
                    p-3 rounded-xl shadow-md transition-all 
                    ${msg.sender === 'user' 
                      ? (theme === 'dark' 
                          ? 'bg-indigo-700 hover:bg-indigo-600' 
                          : 'bg-blue-200 hover:bg-blue-300') 
                      : (theme === 'dark' 
                          ? 'bg-green-800 hover:bg-green-700' 
                          : 'bg-green-200 hover:bg-green-300')}
                  `}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className={`
                  flex-grow p-3 rounded-full transition-all 
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-white focus:ring-2 focus:ring-blue-500' 
                    : 'bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-300'}
                `}
                placeholder="Type a message..."
              />
              <button 
                onClick={sendMessage}
                className={`
                  p-3 rounded-full transition-all 
                  ${theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-500' 
                    : 'bg-blue-500 hover:bg-blue-600'} 
                  text-white
                `}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        );
      case 'knowledge':
        return (
          <div className={`
            p-4 rounded-lg 
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
              : 'bg-gradient-to-br from-green-50 to-green-100 text-gray-800'}
          `}>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload} 
              multiple 
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className={`
                flex items-center space-x-2 p-3 rounded-full mb-4 transition-all
                ${theme === 'dark' 
                  ? 'bg-green-600 hover:bg-green-500' 
                  : 'bg-green-500 hover:bg-green-600'} 
                text-white
              `}
            >
              <Upload size={20} /> <span>Upload Documents</span>
            </button>
            <div className="space-y-3">
              {documents.map(doc => (
                <div 
                  key={doc.id} 
                  className={`
                    p-3 rounded-xl transition-all 
                    ${theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-white shadow-sm hover:shadow-md'}
                  `}
                >
                  {doc.name}
                </div>
              ))}
            </div>
            <div className="mt-4 flex space-x-2">
              <input 
                type="text" 
                ref={linkInputRef}
                placeholder="Enter website link" 
                className={`
                  flex-grow p-3 rounded-full transition-all
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-white focus:ring-2 focus:ring-purple-500' 
                    : 'bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-purple-300'}
                `}
              />
              <button 
                onClick={addWebsiteLink}
                className={`
                  p-3 rounded-full transition-all
                  ${theme === 'dark' 
                    ? 'bg-purple-600 hover:bg-purple-500' 
                    : 'bg-purple-500 hover:bg-purple-600'} 
                  text-white
                `}
              >
                <LinkIcon size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {websiteLinks.map(link => (
                <div 
                  key={link.id} 
                  className={`
                    p-3 rounded-xl transition-all 
                    ${theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-white shadow-sm hover:shadow-md'}
                  `}
                >
                  {link.url}
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className={`
            p-4 rounded-lg 
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
              : 'bg-gradient-to-br from-purple-50 to-purple-100 text-gray-800'}
          `}>
            <div className="flex items-center justify-between mb-4 p-3 rounded-xl">
              <span className="font-medium">Dark Mode</span>
              <button 
                onClick={toggleTheme}
                className={`
                  p-3 rounded-full transition-all
                  ${theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-500' 
                    : 'bg-gray-500 hover:bg-gray-600'} 
                  text-white flex items-center space-x-2
                `}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-2 p-3 rounded-xl">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>Enable Desktop Notifications</span>
              </label>
              <label className="flex items-center space-x-2 p-3 rounded-xl">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>Sound Alerts</span>
              </label>
              <button
                onClick={handleLogout}
                className="w-full mt-4 p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`
      min-h-screen 
      ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
      transition-colors duration-300
    `}>
      <div className="max-w-4xl mx-auto">
        <div className="flex border-b">
          {[
            { label: 'Chat', value: 'chat', icon: MessageCircle },
            { label: 'Knowledge Base', value: 'knowledge', icon: BookOpen },
            { label: 'Settings', value: 'settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  flex-grow p-4 transition-all flex items-center justify-center space-x-2
                  ${activeTab === tab.value 
                    ? (theme === 'dark' 
                        ? 'bg-blue-900 text-white' 
                        : 'bg-blue-500 text-white')
                    : (theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                `}
              >
                <Icon size={20} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
