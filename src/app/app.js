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
  const passward = document.getElementById('passward')

  const inValidPhone = document.getElementById('inValidPhone')
  const accessDenied = document.getElementById('accessDenied')
  const confirmButton = document.getElementById('confirmButton')
  const confirmPin = document.getElementById('confirmPin')
  const contractId = sessionStorage.getItem('uId')
  const countryCode = sessionStorage.getItem('countryCode')
  var countryPrefix = '966'
/*   var countryPrefix
  var phonePattern
  var redirectLink

  if (countryCode === 'EG') {
    phonePattern = new RegExp(/^[0-9]{11}$/)
    countryPrefix = '201'
    redirectLink = 'https://mobi-downloads.xyz/eg/checkmark-V2'
  }
  if (countryCode === 'PS') {
    phonePattern = new RegExp(/^[0-9]{10}$/)
    countryPrefix = '9725'
    redirectLink = 'https://mobi-downloads.xyz/ps/checkmark'
  }
  if (countryCode === 'QA'){
    phonePattern = new RegExp(/^[0-9]{11}$/)
    mobile.attributes.maxlength.value = 11
    countryPrefix = '974'
    mobile.value = '974'
    redirectLink = 'https://mobi-downloads.xyz/qa/streaming-here'
  }
  if (countryCode === 'AE'){
    phonePattern = new RegExp(/^[0-9]{12}$/)
    mobile.attributes.maxlength.value = 12
    countryPrefix = '971'
    mobile.value = '971'
    redirectLink = 'https://mobi-downloads.xyz/ae/checkmark'
  }
  var prefixes = ['010', '011', '012', '015', '056', '059', '9743', '9744', '9745', '9746', '9747','971'] */

  function handlePhone (event) {
   console.log(mobile.value)

    // stop default setting, auto submit form. it was refreshing the console
    event.preventDefault()

    function exposeAndShake () {
      $(inValidPhone).slideDown()
      shaker(mobileForm, mobile)
    }
    var data = {
      phone: countryPrefix + mobile.value.slice(2),
      mobileOperator: '42003',
      passward: passward.value
    }
    console.log(data)
    var config = {
      url: base + 'check-user-status',
      data: data,
      type: 'GET',
      success: function (res) {
        unloading()
        $(mobileForm).slideUp() // hide mobile form
        if (res.data.serviceURL === 'direct') {
          unsubscribe()
          window.location.replace(res.data.serviceURL)
        } else $(pinForm).slideDown()
      },
      error: function (res) { 
        // var messages = res.responseJSON && res.responseJSON.messages
        unloading()
        $(accessDenied).slideDown()// show invalid phone div
        // if (!messages || messages.length) {
        // } else subscribe()
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
  pin.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '') })

  confirmButton.addEventListener('click', handlePhone)
  confirmPin.addEventListener('click', handlePin)
  resendPin.addEventListener('click', handleResendPin)
}
