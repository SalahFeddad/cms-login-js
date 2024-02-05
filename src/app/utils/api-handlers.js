import $ from 'jquery'
import { unloading, shaker, subscribe } from './utilities'

var mobileForm = document.getElementById('msisdn_form')
var mobile = document.getElementById('mobile')
// var pin = document.getElementById('pin')
// var confirmPin = document.getElementById('confirmPin')
var pinForm = document.getElementById('pin_form')
var inValidPhone = document.getElementById('inValidPhone')

export function verifySuccess (info) { // in case of success
  unloading()

  $(mobileForm).slideUp() // hide mobile form
  $(pinForm).slideDown()
  // pin.addEventListener('keyup', makePulse(confirmPin)) // it takes input field as an event and button as an argument
}
