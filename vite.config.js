import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // หรือ plugin ที่คุณใช้

export default defineConfig({
  plugins: [react()],
  // แก้ไขตรงนี้: เปลี่ยนจาก '/Star-platinum/' เป็น '/'
  base: '/', 
  build: {
    outDir: 'dist',
    emptyOutDir: true, // สั่งให้ล้างไฟล์เก่าทิ้งทุกครั้งที่ Build ใหม่
  }
})
