// Admin API service for dashboard operations
import api from './api';

export const adminApi = {
  // Members
  getMembers: () => api.get('/admin/members'),
  createMember: (member: any) => api.post('/admin/members', member),
  updateMember: (id: number, member: any) => api.put(`/admin/members/${id}`, member),
  deleteMember: (id: number) => api.delete(`/admin/members/${id}`),

  // Staff
  getStaff: () => api.get('/admin/staff'),
  createStaff: (staff: any) => api.post('/admin/staff', staff),
  updateStaff: (id: number, staff: any) => api.put(`/admin/staff/${id}`, staff),
  deleteStaff: (id: number) => api.delete(`/admin/staff/${id}`),

  // Classes
  getClasses: () => api.get('/admin/classes'),
  createClass: (classData: any) => api.post('/admin/classes', classData),
  updateClass: (id: number, classData: any) => api.put(`/admin/classes/${id}`, classData),
  deleteClass: (id: number) => api.delete(`/admin/classes/${id}`),

  // Equipment
  getEquipment: () => api.get('/admin/equipment'),
  createEquipment: (equipment: any) => api.post('/admin/equipment', equipment),
  updateEquipment: (id: number, equipment: any) => api.put(`/admin/equipment/${id}`, equipment),
  deleteEquipment: (id: number) => api.delete(`/admin/equipment/${id}`),

  // Analytics
  getRevenueAnalytics: (params?: any) => api.get('/admin/analytics/revenue', { params }),
  getMembershipAnalytics: (params?: any) => api.get('/admin/analytics/membership', { params }),
  getUtilizationAnalytics: (params?: any) => api.get('/admin/analytics/utilization', { params }),

  // Pricing Plans
  getPricingPlans: () => api.get('/admin/pricing-plans'),
  createPricingPlan: (plan: any) => api.post('/admin/pricing-plans', plan),
  updatePricingPlan: (id: number, plan: any) => api.put(`/admin/pricing-plans/${id}`, plan),
  deletePricingPlan: (id: number) => api.delete(`/admin/pricing-plans/${id}`),

  // Dashboard Stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

export default adminApi;