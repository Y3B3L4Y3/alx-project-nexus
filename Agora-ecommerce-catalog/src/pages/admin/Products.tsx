import React, { useState, useRef } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';
import { useRBAC, CanAccess } from '../../components/admin/AdminLayout';
import {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAdminCategoriesQuery,
  useUploadProductImagesMutation,
  type AdminProduct,
} from '../../api/adminApi';

// Loading skeleton component
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
    ))}
  </div>
);

const Products: React.FC = () => {
  const { toasts = [], showToast, removeToast } = useToast();
  const { hasPermission } = useRBAC();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  
  // API hooks
  const { data: productsData, isLoading, refetch } = useGetAdminProductsQuery({
    page,
    limit: 20,
    search: searchTerm || undefined,
    category: categoryFilter || undefined,
  });
  
  const { data: categoriesData } = useGetAdminCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadProductImages, { isLoading: isUploadingImages }] = useUploadProductImagesMutation();
  
  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];
  const pagination = productsData?.pagination;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    categoryId: '',
    brand: '',
    thumbnail: '',
    colors: '',
    sizes: '',
    status: 'active' as 'active' | 'draft' | 'deleted',
    isNew: false,
    isFeatured: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleAddProduct = () => {
    if (!hasPermission('products.create')) {
      showToast('You do not have permission to add products', 'error');
      return;
    }
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '',
      categoryId: '',
      brand: '',
      thumbnail: '',
      colors: '',
      sizes: '',
      status: 'active',
      isNew: false,
      isFeatured: false,
    });
    setImagePreview('');
    setAdditionalImages([]);
    setAdditionalImagePreviews([]);
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditProduct = (product: AdminProduct) => {
    if (!hasPermission('products.edit')) {
      showToast('You do not have permission to edit products', 'error');
      return;
    }
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock.toString(),
      categoryId: product.categoryId?.toString() || '',
      brand: product.brand || '',
      thumbnail: product.thumbnail || '',
      colors: product.colors?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      status: product.status,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
    });
    setImagePreview(product.thumbnail || '');
    setAdditionalImages([]);
    // Set existing additional images as previews
    setAdditionalImagePreviews(product.images?.filter(img => img !== product.thumbnail) || []);
    setFormErrors({});
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!hasPermission('products.delete')) {
      showToast('You do not have permission to delete products', 'error');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        showToast('Product deleted successfully', 'success');
        refetch();
      } catch (error: any) {
        showToast(error?.data?.error || 'Failed to delete product', 'error');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, create a local preview URL
      // In production, you would upload to S3 or your server
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        // Use a placeholder URL for now - in production, upload and get real URL
        setFormData(prev => ({ ...prev, thumbnail: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, thumbnail: url }));
    setImagePreview(url);
  };

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAdditionalImages(prev => [...prev, ...newFiles]);
      
      // Create previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }
    // Stock can be 0, so only check if it's empty or negative
    const stockValue = parseInt(formData.stock);
    if (formData.stock === '' || isNaN(stockValue) || stockValue < 0) {
      errors.stock = 'Valid stock quantity is required (0 or more)';
    }
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    if (!formData.thumbnail) {
      errors.thumbnail = 'Product image is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the form errors', 'error');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        discount: formData.originalPrice ? Math.round((1 - parseFloat(formData.price) / parseFloat(formData.originalPrice)) * 100) : 0,
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        brand: formData.brand || undefined,
        thumbnail: formData.thumbnail,
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        status: formData.status,
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
      };

      let productId: number;

      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data: productData }).unwrap();
        productId = editingProduct.id;
        showToast('Product updated successfully', 'success');
      } else {
        const result = await createProduct(productData).unwrap();
        productId = result.data.id;
        showToast('Product added successfully', 'success');
      }

      // Upload additional images if any
      if (additionalImages.length > 0) {
        const formDataImages = new FormData();
        additionalImages.forEach(file => {
          formDataImages.append('images', file);
        });
        
        try {
          await uploadProductImages({ productId, images: formDataImages }).unwrap();
          showToast('Images uploaded successfully', 'success');
        } catch (imgError: any) {
          showToast(imgError?.data?.error || 'Product saved but failed to upload some images', 'warning');
        }
      }

      setShowModal(false);
      refetch();
    } catch (error: any) {
      console.error('Product save error:', error);
      // Handle validation errors from backend
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        const validationErrors = error.data.errors.map((e: any) => e.msg || e.message).join(', ');
        showToast(validationErrors || 'Validation failed', 'error');
      } else {
        const errorMessage = error?.data?.error || error?.data?.message || 'Failed to save product';
        showToast(errorMessage, 'error');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'deleted':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Stats
  const totalProducts = pagination?.total || products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const draftProducts = products.filter(p => p.status === 'draft').length;
  const outOfStock = products.filter(p => p.stock === 0).length;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-inter font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your product inventory ({totalProducts} products)</p>
        </div>
        <div className="flex items-center gap-3">
          <CanAccess permission="products.create">
            <Button variant="primary" onClick={handleAddProduct} className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </CanAccess>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Active</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{activeProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-yellow-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Draft</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">{draftProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-red-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Out of Stock</p>
              <p className="text-xl md:text-2xl font-bold text-red-600">{outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-semibold text-gray-900">All Products</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 md:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2/30"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 md:pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-2/30"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Category
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Stock
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length > 0 ? products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg md:rounded-xl flex-shrink-0 overflow-hidden">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 lg:hidden">{product.categoryName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {product.categoryName || '-'}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-1 md:ml-2">${product.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                      <span className={`text-sm font-medium ${product.stock <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`px-2 md:px-3 py-1 md:py-1.5 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-1">
                        <CanAccess permission="products.edit">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </CanAccess>
                        <CanAccess permission="products.delete">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </CanAccess>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">No products found</p>
                        <CanAccess permission="products.create">
                          <Button variant="primary" onClick={handleAddProduct} className="mt-2">
                            Add Your First Product
                          </Button>
                        </CanAccess>
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
              Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} products
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

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Main Product Image <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full sm:w-32 h-32 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                  imagePreview ? 'border-secondary-2' : formErrors.thumbnail ? 'border-red-300' : 'border-gray-300 hover:border-secondary-2'
                }`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="Or paste image URL"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                    formErrors.thumbnail ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {formErrors.thumbnail && <p className="text-red-500 text-xs mt-1">{formErrors.thumbnail}</p>}
              </div>
            </div>
          </div>

          {/* Additional Images Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Images (Gallery)
            </label>
            <div className="space-y-4">
              <div 
                onClick={() => additionalImagesRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-secondary-2 transition-colors"
              >
                <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm text-gray-500 mt-2">Click to add more images (max 10)</p>
              </div>
              <input
                ref={additionalImagesRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesUpload}
                className="hidden"
              />
              
              {/* Preview Grid */}
              {additionalImagePreviews.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                  formErrors.name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter product name"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all resize-none"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                  formErrors.price ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="0.00"
              />
              {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Original Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="0.00 (for discount display)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all ${
                  formErrors.stock ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="0"
              />
              {formErrors.stock && <p className="text-red-500 text-xs mt-1">{formErrors.stock}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="Brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all cursor-pointer ${
                  formErrors.categoryId ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {formErrors.categoryId && <p className="text-red-500 text-xs mt-1">{formErrors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'deleted' })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Colors (comma separated)
              </label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="Red, Blue, Green"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sizes (comma separated)
              </label>
              <input
                type="text"
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-2/30 focus:border-secondary-2 focus:bg-white transition-all"
                placeholder="S, M, L, XL"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-secondary-2 focus:ring-secondary-2"
                />
                <span className="text-sm text-gray-700">Mark as New</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-secondary-2 focus:ring-secondary-2"
                />
                <span className="text-sm text-gray-700">Featured Product</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={isCreating || isUpdating || isUploadingImages}>
              {isCreating || isUpdating || isUploadingImages ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
