<template>
  <div class="supplier-management">
    <div class="w-full h-8 mt-2">
      <a
        class="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
        @click="$router.go(-1)"
      >
        ← Back
      </a>
    </div>
    <div class="header-proveedors flex inline gap-4 items-center">
      <div class="title-container"></div>
      <router-link
        to="/orders"
        class="text-end pr-4"
        alt="Listado ordenes de facturación"
      >
        <i
          class="fa-solid fa-paper-plane text-blue-400 text-2xl"
          title="Facturacion proveedor"
        ></i>
      </router-link>

      <button class="add-button" @click="showAddModal">
        <i class="fas fa-plus"></i> Nuevo Proveedor
      </button>
    </div>

    <div class="search-container">
      <input
        type="text"
        placeholder="Buscar proveedores..."
        v-model="searchQuery"
        class="search-input"
      />
    </div>

    <div class="table-container">
      <table class="supplier-table">
        <thead class="bg-gray-500 ">
          <tr>
            <th class="text-center">ID</th>
            <th>NOMBRE</th>
            <th>CONTACTO</th>
            <th>TELÉFONO</th>
            <th>EMAIL</th>
            <th>DIRECCIÓN</th>
            <th>ESTADO</th>
            <th>ÚLTIMA VEZ</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="proveedores.length === 0 && searchQuery">
            <td colspan="8" class="no-results">
              No se encontraron proveedores con ese nombre.
            </td>
          </tr>
          <tr v-for="proveedor in proveedores" :key="proveedor.id">
            <td>{{ proveedor.id }}</td>
            <td>
              <span v-if="!proveedor.editing">{{ proveedor.nombre }}</span>
              <input
                v-else
                v-model="proveedor.nombre"
                type="text"
                class="edit-input"
              />
            </td>
            <td>
              <span v-if="!proveedor.editing">{{ proveedor.contacto }}</span>
              <input
                v-else
                v-model="proveedor.contacto"
                type="text"
                class="edit-input"
              />
            </td>
            <td>
              <span v-if="!proveedor.editing">{{ proveedor.telefono }}</span>
              <input
                v-else
                v-model="proveedor.telefono"
                type="text"
                class="edit-input"
              />
            </td>
            <td>
              <span v-if="!proveedor.editing">{{ proveedor.email }}</span>
              <input
                v-else
                v-model="proveedor.email"
                type="email"
                class="edit-input"
              />
            </td>
            <td class="whitespace-nowrap">
              <span class="whitespace-nowrap" v-if="!proveedor.editing">{{
                proveedor.direccion
              }}</span>
              <textarea
                v-else
                v-model="proveedor.direccion"
                class="edit-input"
              />
            </td>
            <td class="text-center">
              <span v-if="!proveedor.editing">
                <span v-if="proveedor.activo === 1"
                  ><span
                    class="text-green-500 bg-green-200 border-green-500 p-2 px-4 font-bold"
                    >ACTIVO</span
                  ></span
                ><span
                  v-else
                  class="text-red-500 bg-red-200 border-red-500 p-2 px-4 font-bold"
                >
                  INACTIVO</span
                >
              </span>
              <label v-show="proveedor.editing" v-else class="edit-input" />
              <select
                v-model="proveedor.activo"
                v-if="proveedor.editing"
                class="edit-input"
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </td>

            <td class="text-center">{{ formatDate(proveedor.updated_at) }}</td>

            <td class="grid grid-cols-1 gap-4">
              <div v-if="rol === 'admin_pro' || rol === 'admin_basico'|| rol === 'admin_empresarial'">
                <button
                  v-if="!proveedor.editing"
                  @click="activateEdition(proveedor)"
                  style="
                    color: white;
                    background-color: var(--color-secundario);
                    padding: 8px 16px;
                    border-radius: 6px;
                  "
                >
                  Modificar
                </button>
                <button
                  v-else
                  @click="saveChanges(proveedor)"
                  :disabled="loading"
                >
                  {{ loading ? "Guardando..." : "Guardar" }}
                </button>
                <button
                  @click="deleteProveedor(proveedor.id)"
                  style="
                    color: white;
                    background-color: #ad4040;
                    padding: 8px 16px;
                    border-radius: 6px;
                  "
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para añadir proveedor -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Nuevo Proveedor</h2>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveNewProveedor">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" v-model="currentProveedor.nombre" required />
            </div>
            <div class="form-group">
              <label>Contacto</label>
              <input type="text" v-model="currentProveedor.contacto" />
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" v-model="currentProveedor.telefono" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="currentProveedor.email" />
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <textarea
                v-model="currentProveedor.direccion"
                class="edit-input"
              ></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="cancel-button" @click="closeModal">
                Cancelar
              </button>
              <button type="submit" class="save-button" :disabled="loading">
                {{ loading ? "Guardando..." : "Guardar" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="pagination">
    <select
      v-model="itemsPerPage"
      @change="handlePageSizeChange"
      class="page-select"
    >
      <option :value="5">5 por página</option>
      <option :value="10">10 por página</option>
      <option :value="20">20 por página</option>
    </select>
    <div class="pages">
      <button @click="prevPage" :disabled="currentPage <= 1" class="page-btn">
        &lt;
      </button>
      <span class="page-info"
        >Página {{ currentPage }} de {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        :disabled="currentPage >= totalPages"
        class="page-btn"
      >
        &gt;
      </button>
    </div>
    <div class="total-info">Total: {{ totalItems }} proveedores</div>
  </div>
</template>

<script>
import api from '@/services/api';



import Swal from "sweetalert2";
export default {
  name: "ProveedorView",
  data() {
    return {
      rol: localStorage.getItem("rol") || "",
      proveedores: [],
      loading: false,
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
      searchQuery: "",
      showModal: false,
      currentProveedor: {
        nombre: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
        updated_at: "",
      },
    };
  },
  watch: {
    searchQuery: {
      handler: function (newQuery) {
        if (newQuery === "") {
          this.fetchAllProveedores();
        } else {
          this.searchProveedores(newQuery);
        }
      },
      immediate: true,
    },
  },
  methods: {
    formatFechaParaMySQL(fechaISO) {
      const fecha = new Date(fechaISO);
      const pad = (n) => n.toString().padStart(2, "0");
      return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(
        fecha.getDate()
      )} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(
        fecha.getSeconds()
      )}`;
    },

    handlePageSizeChange() {
      this.currentPage = 1; // Reset to first page when page size changes
      this.fetchAllProveedores();
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchAllProveedores();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchAllProveedores();
      }
    },
    async fetchAllProveedores() {
      const token = localStorage.getItem("token");
      this.loading = true;
      try {
        // Add pagination parameters to URL
        const url = new URL("https://192.168.0.14:443/api/proveedores");
        url.searchParams.append("page", this.currentPage);
        url.searchParams.append("limit", this.itemsPerPage);

        const response = await fetch(url, {
          credentials: "include", // Include credentials for CORS
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching suppliers: " + response.statusText);
        }

        const data = await response.json();

        // Update providers list
        this.proveedores = data.suppliers.map((item) => ({
          ...item,
          editing: false,
        }));

        // Update pagination data
        this.totalItems = data.total;
        this.totalPages = data.totalPages;

        // Validate current page
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
          await this.fetchAllProveedores();
        }
      } catch (error) {
        if (error.response?.status === 404) {
          Swal.fire({
            title: "Corex AI- V40",
            footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
            text: "No se pudo completar la solicitud.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        } else if (error.response?.status === 401) {
          alert("Tu sesión ha expirado. Vuelve a iniciar sesión.");
          Swal.fire({
            title: "0xdeadfeed",
            footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
            text: "La corrupción es inevitable. ¿Fue error o fue intención?",
            icon: "error",
            confirmButtonText: "Aceptar",
          });

          this.$router.push("/loginview");
        } else {
          alert(error.response?.data?.error || "Ocurrió un error inesperado.");
        }
        this.proveedores = [];
        this.totalItems = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },

    showAddModal() {
      this.currentProveedor = {
        nombre: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
      };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.currentProveedor = {
        nombre: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
      };
    },

    async saveNewProveedor() {
      if (!this.currentProveedor.nombre) return;

      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        await api.post("/api/proveedores", this.currentProveedor, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await this.fetchAllProveedores();

        Swal.fire({
          title: "Corex AI- V40",
          text: "Proveedor creado exitosamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "var(--color-principal)",
        });
        this.currentProveedor = {
          nombre: "",
          contacto: "",
          telefono: "",
          email: "",
          direccion: "",
        };
        this.closeModal();
      } catch (error) {
        if (error.response?.status === 404) {
          Swal.fire({
            title: "Corex AI- V40",
            footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
            text: "No se pudo completar la solicitud.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        } else if (error.response?.status === 403) {
          Swal.fire({
            title:
              '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
            html: "¡UPS! Tu licencia ha expirado, por favor contacta a soporte",
            showConfirmButton: true,
            footer: "Ha ocurrido un error inesperado",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "var(--color-secundario)",
          });

          this.$router.push("/profileconfig#seccion-membership");
        }
      } finally {
        this.loading = false;
      }
    },

    activateEdition(proveedor) {
      this.proveedores = this.proveedores.map((p) => {
        if (p.id === proveedor.id) {
          return { ...p, editing: true };
        }
        return p;
      });
    },

    async saveChanges(proveedor) {
      this.loading = true;

      const confirmSave = await Swal.fire({
        title: "Corex AI- V40",
        text: "¿Estás seguro de guardar los cambios?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "var(--color-principal)",
      });

      if (!confirmSave.isConfirmed) {
        this.loading = false;
        return;
      }

      if (confirmSave.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No hay token de autenticación");
          if (proveedor.id) {
            proveedor.updated_at = this.formatFechaParaMySQL(
              proveedor.updated_at
            );

            // Actualizar proveedor existente
            await api.put(`/api/proveedores/${proveedor.id}`, proveedor, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });
          } else {
            // Crear nuevo proveedor
            const response = await api.post("/api/proveedores", proveedor, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });
            const index = this.proveedores.findIndex((p) => !p.id);
            if (index !== -1) {
              this.proveedores[index] = response.data;
            }
          }
          Swal.fire({
            title: "Corex AI- V40",
            text: "Proveedor modificado exitosamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "var(--color-principal)",
          });
          await this.fetchAllProveedores();
        } catch (error) {
          if (error.response?.status === 404) {
            Swal.fire({
              title: "Corex AI- V40",
              footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
              text: "No se pudo completar la solicitud.",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          } else if (error.response?.status === 401) {
            Swal.fire({
              title: "0xdeadfeed",
              footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
              text: "La corrupción es inevitable. ¿Fue error o fue intención?",
              icon: "error",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "var(--color-principal)",
            });
            this.$router.push("/loginview");
          } else if (error.response?.status === 409) {
            Swal.fire({
              title: "Corex AI- V40",
              footer: "Ha ocurrido in error inesperado", // Usamos 'footer' para el subtítulo
              text: "Se ha modificado el producto por otro usuario, por favor recargue la página",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          } else if (error.response?.status === 403) {
            Swal.fire({
              title:
                '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
              html: "¡UPS! Tu licencia ha expirado, por favor contacta a soporte",
              showConfirmButton: true,
              footer: "Ha ocurrido un error inesperado",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "var(--color-secundario)",
            });

            this.$router.push("/profileconfig#seccion-membership");
          } else {
            alert(
              error.response?.data?.error || "Ocurrió un error inesperado."
            );
          }
        } finally {
          this.loading = false;
        }
      } else {
        this.proveedores = this.proveedores.map((p) => {
          if (p.id === proveedor.id) {
            return { ...p, editing: false };
          }
          return p;
        });
      }
    },

    async deleteProveedor(id) {
      const isConfirmed = await Swal.fire({
        title: "Corex AI- V40",
        text: "¿Estás seguro de eliminar este proveedor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "var(--color-secundario)",
      });

      if (!isConfirmed) return;

      if (isConfirmed.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await api.delete(`/api/proveedores/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              withCredentials: true,
            },
          });

          Swal.fire({
            title: "Corex AI- V40",
            text: "Proveedor eliminado exitosamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "var(--color-principal)",
          });
          // Actualizar la lista de proveedores
          await this.fetchAllProveedores();

          this.proveedores = this.proveedores.filter((p) => p.id !== id);
        } catch (error) {
          if (error.response?.status === 404) {
            Swal.fire({
              title: "Corex AI- V40",
              footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
              text: "No se pudo completar la solicitud.",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          } else if (error.response?.status === 401) {
            alert("Tu sesión ha expirado. Vuelve a iniciar sesión.");
            Swal.fire({
              title: "0xdeadfeed",
              footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
              text: "La corrupción es inevitable. ¿Fue error o fue intención?",
              icon: "error",
              confirmButtonText: "Aceptar",
            });

            this.$router.push("/loginview");
          } else if (error.response?.status === 403) {
            Swal.fire({
              title:
                '<i class="fa-regular fa-face-sad-cry" style="font-size: 48px; color: var(--color-principal);"></i><br>0xdeadfeed',
              html: "¡UPS! Tu licencia ha expirado, por favor contacta a soporte",
              showConfirmButton: true,
              footer: "Ha ocurrido un error inesperado",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "var(--color-secundario)",
            });
          } else {
            alert(
              error.response?.data?.error || "Ocurrió un error inesperado."
            );
          }
        } finally {
          this.loading = false;
        }
      }
    },

    async searchProveedores(query) {
      if (!query) {
        this.fetchAllProveedores();
        return;
      }

      const token = localStorage.getItem("token");
      try {
        this.currentPage = 1;
        const response = await fetch(
          `https://192.168.0.14:443/api/proveedores/search?query=${encodeURIComponent(
            query
          )}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error searching suppliers: " + response.statusText);
        }

        const data = await response.json();

        // Verifica si 'data.suppliers' existe antes de procesarlo
        if (data && Array.isArray(data.suppliers)) {
          this.proveedores = data.suppliers.map((item) => ({
            ...item,
            editing: false,
          }));
        } else {
          console.error('Error: "suppliers" is undefined or not an array');
          this.proveedores = [];
        }
      } catch (error) {
        if (error.response?.status === 404) {
          Swal.fire({
            title: "Corex AI- V40",
            footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
            text: "No se pudo completar la solicitud.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        } else if (error.response?.status === 401) {
          alert("Tu sesión ha expirado. Vuelve a iniciar sesión.");
          Swal.fire({
            title: "0xdeadfeed",
            footer: "Ha ocurrido un error inesperado", // Usamos 'footer' para el subtítulo
            text: "La corrupción es inevitable. ¿Fue error o fue intención?",
            icon: "error",
            confirmButtonText: "Aceptar",
          });

          this.$router.push("/loginview");
        } else {
          alert(error.response?.data?.error || "Ocurrió un error inesperado.");
        }
        this.proveedores = [];
      }
    },

    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return `${d.getDate()}/${
        d.getMonth() + 1
      }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    },
  },
  mounted() {
    this.fetchAllProveedores();
  },
};
</script>

<style scoped>
/* Base Styles */
.supplier-management {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  width: 95%;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--bg);
  color: var(--text);
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.page-select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.pages {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: var(--color-secundario);
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.page-btn:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.total-info {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

/* Header Styles */
.header-proveedors {
  justify-content: end;
}

.title-container {
  display: flex;
  align-items: center;
}

.title-container h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.icon {
  font-size: 24px;
  color: #2563eb;
  margin-right: 10px;
}

.add-button {
  background-color: var(--color-secundario);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.add-button:hover {
  background-color: #1d4ed8;
}

.add-button i {
  margin-right: 8px;
}

/* Search Styles */
.search-container {
  margin-bottom: 20px;
  padding: 0 16px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  background-color: var(--bg);
  color: var(--text);
  border-radius: 4px;
  font-size: 14px;
  max-width: 400px;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #374151;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.save-button {
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Table Styles */
.table-container {
  background-color: var(--bg);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin: 20px 0;
}

.supplier-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1000px;
  text-align: center;
  border: wheat 2px solid;
}

.supplier-table th {
  position: sticky;
  top: 0;
  padding: 16px;
  
  font-weight: 600;

  font-size: 14px;
  white-space: nowrap;
  border-bottom: 2px solid #e5e7eb;
}



.supplier-table td {
  padding: 16px;
  border-bottom: 1px solid #30313254;
  border-left: 1px solid #494b4c8d;


  font-size: 14px;
  background-color: var(--bg);

  vertical-align: top;
  min-width: 100px;
}

.supplier-table td:nth-child(5),
.supplier-table td:nth-child(6) {
  max-width: 200px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.supplier-table tr:hover {
  background-color: #f9fafb;
}

.edit-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.edit-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

textarea.edit-input {
  min-height: 80px;
  resize: vertical;
}

/* Category Badges */
.category-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.technology {
  background-color: #dbeafe;
  color: #1e40af;
}

.office-supplies {
  background-color: #dcfce7;
  color: #166534;
}

.furniture {
  background-color: #fef3c7;
  color: #92400e;
}

.other {
  background-color: #e5e7eb;
  color: #374151;
}

/* Action Buttons */
.action-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.edit {
  color: #2563eb;
}

.delete {
  color: #dc2626;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.delete-modal {
  width: 400px;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2563eb;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.cancel-button {
  background-color: #e5e7eb;
  color: #374151;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.cancel-button:hover {
  background-color: #d1d5db;
}

.save-button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #1d4ed8;
}

.delete-confirm-button {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-confirm-button:hover {
  background-color: #b91c1c;
}

.no-results {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #6b7280;
}
</style>
