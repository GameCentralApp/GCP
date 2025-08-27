import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Folder, 
  File, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  MoreVertical,
  FolderPlus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified: Date;
  permissions: string;
}

const FileManager: React.FC = () => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  
  const [currentPath, setCurrentPath] = useState('/server');
  const [files, setFiles] = useState<FileItem[]>([
    { name: 'server.properties', type: 'file', size: 2048, lastModified: new Date('2024-01-15T10:30:00'), permissions: 'rw-r--r--' },
    { name: 'world', type: 'directory', lastModified: new Date('2024-01-14T15:20:00'), permissions: 'rwxr-xr-x' },
    { name: 'plugins', type: 'directory', lastModified: new Date('2024-01-13T09:45:00'), permissions: 'rwxr-xr-x' },
    { name: 'logs', type: 'directory', lastModified: new Date('2024-01-15T11:15:00'), permissions: 'rwxr-xr-x' },
    { name: 'server.jar', type: 'file', size: 51200000, lastModified: new Date('2024-01-10T14:30:00'), permissions: 'rw-r--r--' },
    { name: 'whitelist.json', type: 'file', size: 156, lastModified: new Date('2024-01-12T16:45:00'), permissions: 'rw-r--r--' },
    { name: 'banned-players.json', type: 'file', size: 87, lastModified: new Date('2024-01-11T12:20:00'), permissions: 'rw-r--r--' },
    { name: 'ops.json', type: 'file', size: 234, lastModified: new Date('2024-01-09T08:15:00'), permissions: 'rw-r--r--' },
  ]);
  
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pathSegments = currentPath.split('/').filter(segment => segment !== '');

  const handleFileSelect = (fileName: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileName) 
        ? prev.filter(f => f !== fileName)
        : [...prev, fileName]
    );
  };

  const handleNavigateToPath = (index: number) => {
    const newPath = '/' + pathSegments.slice(0, index + 1).join('/');
    setCurrentPath(newPath);
  };

  const handleFileAction = (action: string, fileName?: string) => {
    switch (action) {
      case 'upload':
        setShowUploadModal(true);
        break;
      case 'download':
        if (fileName) {
          console.log(`Downloading: ${fileName}`);
        } else if (selectedFiles.length > 0) {
          console.log(`Downloading: ${selectedFiles.join(', ')}`);
        }
        break;
      case 'delete':
        if (fileName) {
          setFiles(prev => prev.filter(f => f.name !== fileName));
        } else if (selectedFiles.length > 0) {
          setFiles(prev => prev.filter(f => !selectedFiles.includes(f.name)));
          setSelectedFiles([]);
        }
        break;
      case 'createFolder':
        const folderName = prompt('Enter folder name:');
        if (folderName) {
          setFiles(prev => [...prev, {
            name: folderName,
            type: 'directory',
            lastModified: new Date(),
            permissions: 'rwxr-xr-x'
          }]);
        }
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/servers/${serverId}`)}
            className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">File Manager</h1>
            <p className="text-gray-400">Server ID: {serverId}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleFileAction('createFolder')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden md:inline">New Folder</span>
          </button>
          <button
            onClick={() => handleFileAction('upload')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden md:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* File Browser */}
      <div className="bg-dark-800 border border-gray-700 rounded-lg">
        {/* Toolbar */}
        <div className="border-b border-gray-700 p-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={() => setCurrentPath('/server')}
              className="text-primary-500 hover:text-primary-400"
            >
              server
            </button>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={index}>
                <span className="text-gray-500">/</span>
                <button
                  onClick={() => handleNavigateToPath(index)}
                  className="text-primary-500 hover:text-primary-400"
                >
                  {segment}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {selectedFiles.length} selected
                </span>
                <button
                  onClick={() => handleFileAction('download')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Download selected"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleFileAction('delete')}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete selected"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* File List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === filteredFiles.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(filteredFiles.map(f => f.name));
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                    className="rounded border-gray-600 bg-dark-800"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Size</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Modified</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Permissions</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredFiles.map((file) => (
                <tr key={file.name} className="hover:bg-dark-900/50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.name)}
                      onChange={() => handleFileSelect(file.name)}
                      className="rounded border-gray-600 bg-dark-800"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      {file.type === 'directory' ? (
                        <Folder className="h-5 w-5 text-blue-400" />
                      ) : (
                        <File className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-white font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {formatDistanceToNow(file.lastModified, { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                    {file.permissions}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {file.type === 'file' && (
                        <>
                          <button
                            onClick={() => console.log(`Edit: ${file.name}`)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleFileAction('download', file.name)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleFileAction('delete', file.name)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No files found</h3>
            <p className="text-gray-400">
              {searchTerm ? 'No files match your search criteria' : 'This directory is empty'}
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Files</h3>
            
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Drag and drop files here</p>
              <p className="text-sm text-gray-400 mb-4">or</p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach(file => {
                      setFiles(prev => [...prev, {
                        name: file.name,
                        type: 'file',
                        size: file.size,
                        lastModified: new Date(),
                        permissions: 'rw-r--r--'
                      }]);
                    });
                    setShowUploadModal(false);
                  }
                }}
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors cursor-pointer inline-block"
              >
                Choose Files
              </label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;