import $ from 'jquery'
import 'url-polyfill'

import { unsubscribe, shaker, loading, unloading, redirectToIn } from './utils/utilities'
// import { verifyError } from './utils/api-handlers'

export function main () {
  var base = [
    'https://', 'europe-', 'west3-nuvonia-app.', 'cloudfunctions.net', '/api/'
  ].join('')
  // var base = 'http://localhost:5000/nuvonia-app/europe-west3/api/'
  const mobileForm = document.getElementById('msisdn_form')
  var mobile = document.getElementById('mobile')
  
  const inValidPhone = document.getElementById('inValidPhone')
  const successfulAccess = document.getElementById('successfulAccess')
  const inActiveUser = document.getElementById('inActiveUser')
  const accessDenied = document.getElementById('accessDenied')
  const confirmButton = document.getElementById('confirmButton')
  var url = new URL(window.location.href)
  var countryCode = url.searchParams.get('countryCode')
  console.log(countryCode)
  // phone: 46955156
  // password: 0789
  var countryPrefix = '966'
  var phonePattern, redirectToURL

  if (countryCode === 'SA') {
    phonePattern = new RegExp(/^[0-9]{10}$/)
    countryPrefix = '966'
    redirectToURL = 'https://mobi-downloads.xyz/sa/streaming-instruction'
  }
  var prefixes = ['05'] 

  function handlePhoneAndPassword (event) {
    // stop default setting, auto submit form. it was refreshing the console
    event.preventDefault()

    function exposeAndShake () {
      $(inValidPhone).slideDown()
      shaker(mobileForm, mobile)
    }
    var data = {
      phone: countryPrefix + mobile.value.slice(1)
    }
    console.log(data)
    var config = {
      url: base + 'check-user-status',
      data: data,
      type: 'GET',
      success: function (res) {
        unloading()
        $(mobileForm).slideUp() // hide mobile form
        $(successfulAccess).slideDown() // hide mobile form
        if (res.data.serviceURL) {
          redirectToIn(res.data.serviceURL)
        } else {console.log('no service URL!!');$(accessDenied).slideDown()}
      },
      error: function (res) {
        var messages = res.responseJSON && res.responseJSON.messages
        unloading()
        // show invalid phone div
        if (!messages[0] || messages.length) {
          console.log('messages: ', messages[0])
          if (messages[0] === 'Requested user is not Registerd.') {
            $(inValidPhone).slideDown()
          } else if (messages[0] === 'Requested user is not Active.') {
            $(mobileForm).slideUp()
            $(inActiveUser).slideDown()
            redirectToIn(redirectToURL)
          } else $(accessDenied).slideDown()
        } else $(accessDenied).slideDown()
      }
    }

    $(inValidPhone).slideUp()
    // it checks for matching prefixes with the phone number
    console.log(phonePattern.test(mobile.value))
    var validPhone = phonePattern.test(mobile.value) && new RegExp('^' + prefixes.join('|')).test(mobile.value)
    if (validPhone) {
      loading()
      JSON.stringify(data, null, 4)
      $.ajax(config)
    } else exposeAndShake()
  }


  mobile.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '') })

  confirmButton.addEventListener('click', handlePhoneAndPassword)
}
