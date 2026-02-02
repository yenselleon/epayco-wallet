# ePayco Wallet - Frontend 🎨

Interfaz de usuario moderna y responsive para la billetera digital ePayco, construida con React y Vite.

## 🛠️ Stack Tecnológico

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilos:** CSS Modules + Variables CSS (Diseño adaptable)
- **Formularios:** React Hook Form + Zod (Validación robusta)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Notificaciones:** React Toastify
- **Iconos:** React Icons

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js v18+
- npm

### Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor iniciará en `http://localhost:5173`.

3. **Construir para producción:**
   ```bash
   npm run build
   ```

4. **Vista previa de producción:**
   ```bash
   npm run preview
   ```

## 📂 Estructura del Proyecto

```
src/
├── components/         # Bloques de construcción UI
│   ├── dashboard/      # Componentes específicos del dashboard (Stats, History, etc.)
│   ├── layout/         # Componentes estructurales (Navbar)
│   ├── payment/        # Modales y formularios de pago
│   ├── ui/             # Componentes base reutilizables (Button, Card, Input)
│   └── wallet/         # Componentes de billetera (Balance, Recarga)
├── context/            # Contextos de React (AuthContext)
├── layouts/            # Plantillas de paginas (AuthLayout, MainLayout)
├── pages/              # Vistas principales (Login, Register, Dashboard)
├── services/           # Capa de comunicación con API (Axios)
└── styles/             # Variables globales y resets
```

## ✨ Características Clave

- **Autenticación:** Login y Registro con validación en tiempo real.
- **Dashboard Interactivo:**
    - Visualización de saldo.
    - Gráficos de estadísticas (simulados).
    - Acciones rápidas.
- **Gestión de Billetera:**
    - Recarga de saldo.
    - Retiro/Pago con tokens de confirmación.
- **Historial:** Listado de transacciones recientes.
- **UX/UI:**
    - Diseño Split-screen para autenticación.
    - Feedback visual (Toasts, Spinners, Estados de error).
    - Accesibilidad (Soporte `prefers-reduced-motion`).

## 🔧 Scripts Disponibles

- `npm run dev`: Inicia servidor de desarrollo con Hot Reload.
- `npm run build`: Compila TypeScript y genera bundle de producción.
- `npm run lint`: Ejecuta ESLint para verificar calidad de código.
- `npm run preview`: Sirve la build de producción localmente.

---

Desarrollado para la prueba técnica de ePayco.
