import React, { useState, useMemo } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';
import { useGetAdminMessagesQuery, useUpdateMessageStatusMutation, type AdminMessage } from '../../api/adminApi';

// Loading skeleton
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
    ))}
  </div>
);

const Messages: React.FC = () => {
  const { toasts = [], showToast, removeToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);

  // API hooks
  const { data: messagesData, isLoading, refetch } = useGetAdminMessagesQuery({ page, limit: 20 });
  const [updateMessageStatus, { isLoading: isUpdating }] = useUpdateMessageStatusMutation();

  const messages = messagesData?.data || [];
  const pagination = messagesData?.pagination;

  // Filter messages locally
  const filteredMessages = useMemo(() => {
    let result = messages;
    
    // Filter by status
    if (activeFilter !== 'all') {
      result = result.filter(msg => msg.status === activeFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(msg =>
        msg.name?.toLowerCase().includes(term) ||
        msg.email?.toLowerCase().includes(term) ||
        msg.subject?.toLowerCase().includes(term) ||
        msg.message?.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [messages, activeFilter, searchTerm]);

  const handleViewMessage = async (message: AdminMessage) => {
    setSelectedMessage(message);
    setShowModal(true);

    // Mark as read if new
    if (message.status === 'new') {
      try {
        await updateMessageStatus({ id: message.id, status: 'read' }).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleMarkAsReplied = async () => {
    if (selectedMessage) {
      try {
        await updateMessageStatus({ id: selectedMessage.id, status: 'replied' }).unwrap();
        setSelectedMessage(prev => prev ? { ...prev, status: 'replied' } : null);
        showToast('Message marked as replied', 'success');
        refetch();
      } catch (error: any) {
        showToast(error?.data?.error || 'Failed to update status', 'error');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'read':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'replied':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const statusCounts = {
    all: messages?.length || 0,
    new: messages?.filter(m => m.status === 'new').length || 0,
    read: messages?.filter(m => m.status === 'read').length || 0,
    replied: messages?.filter(m => m.status === 'replied').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {Array.isArray(toasts) && toasts.length > 0 && toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast?.(toast.id)}
          />
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-inter font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">View and respond to customer inquiries ({filteredMessages.length} messages)</p>
        </div>
        <div className="flex items-center gap-3">
          {statusCounts.new > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{statusCounts.new} new</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              activeFilter === status
                ? 'bg-secondary-2 text-white shadow-lg shadow-secondary-2/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} <span className="ml-1 opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email, subject, or message content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Priority
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.isArray(filteredMessages) && filteredMessages.length > 0 ? filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                      message.status === 'new' ? 'bg-blue-50/30' : ''
                    }`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">
                            {message.name?.split(' ').map(n => n[0]).join('') || '?'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{message.name}</p>
                          <p className="text-xs text-gray-500 truncate">{message.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{message.subject}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {message.message?.substring(0, 50)}...
                      </p>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">No messages found</p>
                        <p className="text-sm text-gray-400">Messages from customers will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 md:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} messages
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm bg-secondary-2 text-white rounded-lg">
                {page}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Message Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Message Details"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-5">
            {/* Message Header */}
            <div className="bg-gray-50 p-5 rounded-xl space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-secondary-2 to-hover-button rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {selectedMessage.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{selectedMessage.name}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                  <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{selectedMessage.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Subject</p>
              <p className="font-semibold text-gray-900 text-lg">{selectedMessage.subject}</p>
            </div>

            {/* Message Body */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Message</p>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <div className="flex-1"></div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleMarkAsReplied}
                disabled={selectedMessage.status === 'replied' || isUpdating}
              >
                {isUpdating ? 'Updating...' : selectedMessage.status === 'replied' ? 'Already Replied' : 'Mark as Replied'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Messages;
