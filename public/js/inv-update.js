document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#updateForm')
  if (!form) return

  const updateBtn = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]')
  if (updateBtn) updateBtn.setAttribute('disabled', 'disabled')

  form.addEventListener('change', function () {
    if (updateBtn) updateBtn.removeAttribute('disabled')
  })
})
