import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttachmentsTab = ({ attachments }) => {
  const [dragOver, setDragOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'FileText';
      case 'doc': case'docx':
        return 'FileText';
      case 'xls': case'xlsx':
        return 'FileSpreadsheet';
      case 'jpg': case'jpeg': case'png': case'gif':
        return 'Image';
      case 'zip': case'rar':
        return 'Archive';
      default:
        return 'File';
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    // Handle file drop logic here
    console.log('Files dropped:', e?.dataTransfer?.files);
  };

  const handleFileSelect = (e) => {
    // Handle file selection logic here
    console.log('Files selected:', e?.target?.files);
  };

  return (
    <div tabId="attachments">
      {/* Upload Area */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">File Attachments</h3>
          <Button
            variant="default"
            iconName="Upload"
            iconPosition="left"
            onClick={() => setShowUploadModal(true)}
          >
            Upload Files
          </Button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragOver 
              ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Icon name="Upload" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">
            Drop files here or click to upload
          </h4>
          <p className="text-muted-foreground mb-4">
            Support for PDF, DOC, XLS, images and other common file types
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" as="span">
              Choose Files
            </Button>
          </label>
        </div>
      </div>
      {/* Attachments List */}
      <div className="space-y-3">
        {attachments?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Paperclip" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Attachments</h4>
            <p className="text-muted-foreground mb-4">
              Upload documents, images, or other files related to this asset.
            </p>
            <Button
              variant="outline"
              iconName="Upload"
              iconPosition="left"
              onClick={() => setShowUploadModal(true)}
            >
              Upload First File
            </Button>
          </div>
        ) : (
          attachments?.map((file) => (
            <div key={file?.id} className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors">
              {/* File Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Icon name={getFileIcon(file?.name)} size={24} className="text-muted-foreground" />
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{file?.name}</h4>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span>{formatFileSize(file?.size)}</span>
                  <span>•</span>
                  <span>Uploaded {formatDate(file?.uploadedAt)}</span>
                  <span>•</span>
                  <span>by {file?.uploadedBy}</span>
                </div>
                {file?.description && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {file?.description}
                  </p>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Download"
                  onClick={() => console.log('Download:', file?.name)}
                  className="text-muted-foreground hover:text-foreground"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Eye"
                  onClick={() => console.log('Preview:', file?.name)}
                  className="text-muted-foreground hover:text-foreground"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Trash2"
                  onClick={() => console.log('Delete:', file?.name)}
                  className="text-muted-foreground hover:text-error"
                />
              </div>
            </div>
          ))
        )}
      </div>
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-300 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Upload Files</h3>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowUploadModal(false)}
              />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              This feature would integrate with Supabase Storage to handle file uploads and management.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Files
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full p-2 border border-border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full p-2 border border-border rounded-md resize-none"
                  rows="3"
                  placeholder="Add a description for these files..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => setShowUploadModal(false)}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsTab;