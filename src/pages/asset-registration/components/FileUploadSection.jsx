import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadSection = ({ 
  files, 
  onFilesChange, 
  maxFiles = 5, 
  maxSizePerFile = 10 * 1024 * 1024 // 10MB
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleChange = (e) => {
    e?.preventDefault();
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    const errors = [];
    const validFiles = [];

    // Check if adding these files would exceed the limit
    if (files?.length + newFiles?.length > maxFiles) {
      errors?.push(`Maximum ${maxFiles} files allowed. You can add ${maxFiles - files?.length} more files.`);
      return;
    }

    newFiles?.forEach((file, index) => {
      // Check file size
      if (file?.size > maxSizePerFile) {
        errors?.push(`${file?.name} is too large. Maximum size is ${maxSizePerFile / (1024 * 1024)}MB.`);
        return;
      }

      // Check file type (allow common document and image types)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];

      if (!allowedTypes?.includes(file?.type)) {
        errors?.push(`${file?.name} is not a supported file type.`);
        return;
      }

      // Add file with metadata
      validFiles?.push({
        id: Date.now() + index,
        file: file,
        name: file?.name,
        size: file?.size,
        type: file?.type,
        uploadDate: new Date()?.toISOString()
      });
    });

    setUploadErrors(errors);
    
    if (validFiles?.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files?.filter(f => f?.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return 'Image';
    if (fileType === 'application/pdf') return 'FileText';
    if (fileType?.includes('word')) return 'FileText';
    if (fileType?.includes('excel') || fileType?.includes('sheet')) return 'FileSpreadsheet';
    return 'File';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Paperclip" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Attachments</h3>
        <span className="text-sm text-muted-foreground">({files?.length}/{maxFiles})</span>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={files?.length >= maxFiles}
        />
        
        <div className="space-y-4">
          <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
          <div>
            <p className="text-foreground font-medium">
              {files?.length >= maxFiles 
                ? `Maximum ${maxFiles} files reached`
                : 'Drop files here or click to browse'
              }
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports: PDF, DOC, XLS, TXT, JPG, PNG (Max {maxSizePerFile / (1024 * 1024)}MB each)
            </p>
          </div>
        </div>
      </div>
      {/* Upload Errors */}
      {uploadErrors?.length > 0 && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              {uploadErrors?.map((error, index) => (
                <p key={index} className="text-sm text-error">{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* File List */}
      {files?.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-foreground">Uploaded Files:</h4>
          <div className="space-y-2">
            {files?.map((fileItem) => (
              <div key={fileItem?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Icon 
                    name={getFileIcon(fileItem?.type)} 
                    size={20} 
                    className="text-muted-foreground flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {fileItem?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileItem?.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="X"
                  onClick={() => removeFile(fileItem?.id)}
                  className="flex-shrink-0 text-muted-foreground hover:text-error"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Upload Guidelines */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Recommended Documents:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Purchase receipt or invoice</li>
          <li>• Warranty documentation</li>
          <li>• User manual or specifications</li>
          <li>• Installation or setup photos</li>
          <li>• Compliance certificates</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadSection;