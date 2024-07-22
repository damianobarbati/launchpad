import MaintenanceService from '@api/maintenance/MaintenanceService';
import createHttpError from 'http-errors';
import type Koa from 'koa';

const maintenance = async (ctx: Koa.BaseContext, next: Koa.Next) => {
  if (await MaintenanceService.isMaintenanceEnabled()) {
    throw createHttpError(503, 'Service is under maintenance');
  }
  await next();
};

export default maintenance;
