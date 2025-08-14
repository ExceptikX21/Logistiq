// helpers/roles.js
export const roles = {
  DEMO: 'usuario_demo',
  ADMIN_BASIC: 'admin_basico',
  ADMIN_PRO: 'admin_pro',
  ADMIN_EMPRESARIAL: 'admin_empresarial',
};

export const rolesAdmin = [roles.ADMIN_BASIC, roles.ADMIN_PRO, roles.ADMIN_EMPRESARIAL];
export const rolesPro = [roles.ADMIN_PRO, roles.ADMIN_EMPRESARIAL];
export const rolesAll = [roles.DEMO, ...rolesAdmin];
