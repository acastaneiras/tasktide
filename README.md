# TaskTide
A simple Kanban board application built with Next.js & Tailwind CSS.

## Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Drag-and-Drop**: [dnd-kit](https://dndkit.com/)
- **Form Validation**: [React Hook Form](https://www.react-hook-form.com/) + [Zod](https://zod.dev/)

## Installation

If you want to run this yourself you can do it like so:

### Prerequisites

- [Node.js](https://nodejs.org/) >= 21.x

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/acastaneiras/tasktide.git
   cd tasktide
   ```
2. **Set Up Environment Variables**: 

   Copy the ```.env.default``` file and rename it to ```.env``` and fill in the required variables.
3. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run development server**:
   ```bash
   npm run dev
   ```
   or build the application with:
   ```bash
   npm run build && npm run start
   ```

