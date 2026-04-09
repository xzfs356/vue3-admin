import type { Directive, DirectiveBinding } from 'vue'

const loadingDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    const div = document.createElement('div')
    div.className = 'custom-loading-mask'
    div.innerHTML = `
      <div class="custom-loading-spinner">
        <svg viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20" fill="none" stroke="#1677ff" stroke-width="3"/>
        </svg>
      </div>
    `
    el.style.position = 'relative'
    el.appendChild(div)

    if (!binding.value) {
      div.style.display = 'none'
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    const mask = el.querySelector('.custom-loading-mask') as HTMLElement
    if (mask) {
      mask.style.display = binding.value ? 'flex' : 'none'
    }
  },
}

export default loadingDirective
