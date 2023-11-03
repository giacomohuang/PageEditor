import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/Editorview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'editorview',
      component: EditorView
    }
  ]
})

export default router
