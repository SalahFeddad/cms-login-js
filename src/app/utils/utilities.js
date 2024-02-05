import $ from 'jquery'
let loadingInterval
let redirectInterval

export function loading (seconds = 0.5) {
  $('.loadingCard').slideDown() // show loading, HTML div
  // $('input').attr({ disabled: true }).addClass('disabled') // disable input
  document.querySelectorAll('input')
    .forEach(e => {
      e.classList.add('disabled')
      e.setAttribute('disabled', true)
    })

  loadingInterval = setInterval(() => {
    const limit = 3
    const content = $('.loadingCard')[0].innerHTML
    const dotsNumber = (content.match(/\./g) || []).length

    $('.loadingCard')[0].innerHTML = content.replace(/\./g, '') + '.'.repeat(dotsNumber >= limit ? 0 : dotsNumber + 1)
  }, seconds * 1000)
}

export function unloading () {
  $('.loadingCard').slideUp() // hide loading, HTML div
  // $('input').attr({ disabled: false }).removeClass('disabled') // enable the input
  document.querySelectorAll('input[disabled]')
    .forEach(e => {
      e.classList.remove('disabled')
      e.removeAttribute('disabled')
    })
  if (loadingInterval) clearInterval(loadingInterval)
}

// show unsubscribe page
export function unsubscribe () {
  $('.loadingCard').addClass('hidden')
  loading()
  $('form').slideUp()
  $('.unsubscribe').slideDown()
}
/**
 * timeout is to shake the input longer than the form
 * @param {HTML element} form form to shake
 * @param {HTML element} input input to shake
 */
export function shaker (form, input) {
  form.classList.add('shakeMe')
  setTimeout(function () {
    input.classList.add('shakeMe')
  }, 500)
  setTimeout(function () {
    form.classList.remove('shakeMe')
    input.classList.remove('shakeMe')
  }, 2500)
}
// handling pulse and red border logic on both input and button
export function makePulse (Button) {
  return function (event) {
    var length = event.target.value.length
    event.target.value = event.target.value.replace(/[^0-9]/g, '')
    if (event.target.id === 'mobile') { // if it's a mobile input
      if (length >= 10) {
        Button.classList.add('pulseButton')
        event.target.classList.remove('border')
      } else {
        Button.classList.remove('pulseButton')
        event.target.classList.add('border')
        if (length < 2) {
          event.target.value = event.target.defaultValue
        }
      }
    } else { // if it's not a mobile input
      if (length >= 4) {
        Button.classList.add('pulseButton')
        event.target.classList.remove('border')
      } else {
        Button.classList.remove('pulseButton')
        event.target.classList.add('border')
      }
    }
  }
}

/* // block user and show blocked HTML div
export function block () {
  $('.loadingCard').addClass('hidden')
  loading()
  localStorage.setItem('vip', true)
  $('form').slideUp()
  $('.block').slideDown()
}
// check if user is blocked
export function isBlocked () {
  return localStorage.getItem('vip')
} */
/**
   * checks if 'exceeded' or 'blocked' is in the response.
   * @param {string} messages response from api in error cases
   */
export function shouldBlock (messages) {
  return !!(messages || []).filter(function (message) {
    var cleanMessage = message.toLowerCase()
    return cleanMessage.indexOf('exceeded') !== -1 && cleanMessage.indexOf('blocked') !== -1
  })[0]
}

export function redirectToIn (url, count = 3) {
  $('.redirectCard').slideDown()
  redirectInterval = setInterval(() => {
    $('.redirectCard')[0].innerHTML = $('.redirectCard')[0].innerHTML.replace(/[0-9]/, count)
    if (count === 0) {
      window.location.replace(url)
      redirectInterval.clearInterval()
    }
    count -= 1
  }, 1000)
}
