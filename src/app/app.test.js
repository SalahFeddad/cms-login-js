jest.mock('jquery')
// jest will mock $ automatically
const $ = require('jquery')
const fs = require('fs')

// Tests are cleaning after themselves automatically
describe('Testing main functionalities', () => {
  const successMock = (data) => jest.fn(conf => conf.success && conf.success(data))
  const errorMock = (response) => jest.fn(conf => conf.error && conf.error(response))
  const disableInputsExcept = (skip) => document.querySelectorAll('input').forEach(e => {
    // check if there is an element to skip otherwise disable all
    if (!skip || skip !== e) {
      e.setAttribute('disabled', true)
      e.classList.add('disabled')
    }
  })
  $.mockImplementation((selectorOrEle) => {
    const element = document.querySelector(
      typeof selectorOrEle === 'string'
        ? selectorOrEle
        : `#${selectorOrEle.id}`
    )

    return {
      slideUp: () => { element.hidden = true },
      slideDown: () => { element.hidden = false },
      addClass: (c) => { element.classList.add(c) }
    }
  })
  beforeEach((done) => {
    fs.promises.readFile('index.html')
      .then((content) => {
        document.body.innerHTML = content
        var main = require('./app').main
        main()
        done()
      })
  })
  it('Test: call init endpoint for pin case flow with correct URL, number,', () => {
    // setting mock success to return
    $.ajax = successMock({ data: { flow: 'pin' } })
    var initURL = 'https://us-central1-api-project-1065873315014.cloudfunctions.net/api/init'
    var numberToServer = '962774567890'
    var inputOrang = '0774567890'

    disableInputsExcept(document.getElementById('confirmButton'))
    document.getElementById('mobile').value = inputOrang
    document.getElementById('confirmButton').click()
    expect($.ajax).toBeCalled()
    expect(document.querySelectorAll('input[disabled]').length).toBe(0) // will look for attribute disabled
    expect(document.querySelectorAll('input.disabled').length).toBe(0) // will look for a class
    expect(document.getElementById('msisdn_form').hidden).toBe(true)
    expect(document.getElementById('pin_form').hidden).toBe(false)
    // expect calling the right URL
    expect($.ajax.mock.calls[0][0].url).toBe(initURL)
    // because of JSON.stringify returns a sting we are using includes
    expect($.ajax.mock.calls[0][0].data.includes(numberToServer)).toBe(true)
  })
  it('Test: invalid numbers to not pass to the api init call', () => {
    $.ajax = errorMock({ data: { flow: 'pin' } })

    var invalid9dig = '077456790'
    document.getElementById('mobile').value = invalid9dig
    document.getElementById('confirmButton').click()
    expect($.ajax).not.toBeCalled()
    var invalid11dig = '07845678911'
    document.getElementById('mobile').value = invalid11dig
    document.getElementById('confirmButton').click()
    expect($.ajax).not.toBeCalled()
    var invalidPrefix = '8234554848'
    document.getElementById('mobile').value = invalidPrefix
    document.getElementById('confirmButton').click()
    expect($.ajax).not.toBeCalled()
    invalidPrefix = '1234567891'
    document.getElementById('mobile').value = invalidPrefix
    document.getElementById('confirmButton').click()
    expect($.ajax).not.toBeCalled()
  })
  it('Test: call send pin end point with correct URL, phone number', () => {
    $.ajax = successMock({ data: { flow: 'pin' } })
    document.getElementById('mobile').value = '0774567890'
    var sendURL = 'https://us-central1-api-project-1065873315014.cloudfunctions.net/api/send'
    var numberToServer = '962774567890'

    document.getElementById('pin').value = '1234'
    disableInputsExcept(document.getElementById('confirmPin'))
    document.getElementById('confirmPin').click()
    expect($.ajax).toBeCalled()
    // expect calling the right URL
    expect($.ajax.mock.calls[0][0].url).toBe(sendURL)
    // because of JSON.stringify returns a sting we are using includes
    expect($.ajax.mock.calls[0][0].data.includes(numberToServer)).toBe(true)
    expect(document.getElementById('pin_form').hidden).toBe(false)
    expect(document.getElementById('msisdn_form').hidden).toBe(true)
    // expect all the inputs to be disabled because of the thank you page does that
    expect(document.querySelectorAll('input[disabled]').length).toBe(4) // will look for attribute disabled
    expect(document.querySelectorAll('input.disabled').length).toBe(4) // will look for a class
  })
  it('Test: wrong pins to not pass to call', () => {
    // wrong pin inputs not to be called more than one which is the prevues
    $.ajax = successMock({ data: { flow: 'pin' } })

    document.getElementById('pin').value = '12345'
    document.getElementById('confirmPin').click()
    expect($.ajax).not.toBeCalled()
    document.getElementById('pin').value = '123'
    document.getElementById('confirmPin').click()
    expect($.ajax).not.toBeCalled()
    document.getElementById('pin').value = ''
    document.getElementById('confirmPin').click()
    expect($.ajax).not.toBeCalled()
    document.getElementById('pin').value = 'abcd'
    document.getElementById('confirmPin').click()
    expect($.ajax).not.toBeCalled()
    expect(document.getElementById('inValidPin').hidden).toBe(false)
  })
  it('Test: init successMock MO flow show message with keyword and shortCode', () => {
    var testKeyword = '444'
    var testShortCode = '555'
    $.ajax = successMock({ data: { flow: 'mo', keyword: testKeyword, shortCode: testShortCode } })

    document.getElementById('mobile').value = '0784567891'
    document.getElementById('confirmButton').click()
    expect($.ajax).toBeCalled()
    expect(Array.from(document.querySelectorAll('#MoMessage span')).map(e => e.innerHTML).join('')).toBe(testKeyword + testShortCode)
  })
  it('Test: init errorMock response and show inValidPhone div', () => {
    $.ajax = errorMock({ responseJSON: { messages: 'Error message Mocked' } })
    var orang = '0774567890'
    document.getElementById('mobile').value = orang
    document.getElementById('confirmButton').click()
    expect($.ajax).toBeCalled()
    expect(document.getElementById('inValidPhone').hidden).toBe(false)
  })
  it('Test: send pin errorMock response and show inValidPin div', () => {
    $.ajax = errorMock({ responseJSON: { messages: 'Error message Mocked' } })
    document.getElementById('pin').value = '1234'
    document.getElementById('confirmPin').click()
    expect($.ajax).toBeCalled()
    expect(document.getElementById('inValidPin').hidden).toBe(false)
  })
  it('Test: init api return flow:"none"', () => {
    $.ajax = successMock({ data: { flow: 'none' } })
    var orang = '0774567890'
    document.getElementById('mobile').value = orang
    document.getElementById('confirmButton').click()
    expect(document.getElementById('inValidPhone').hidden).toBe(false)
  })
  it('Test: toggling border and pulseButton css classes on 10 digit input value', () => {
    // check if border is in the input classes
    expect(document.getElementById('mobile').classList.contains('border')).toBe(true)
    // check if pulseButton is not in the classes
    expect(document.getElementById('confirmButton').classList.contains('pulseButton')).toBe(false)
    document.getElementById('mobile').value = '0774567890'// add value
    document.getElementById('mobile').dispatchEvent(new window.Event('keyup'))// trigger the event makePulse function work
    // check if border was removed  from the input
    expect(document.getElementById('mobile').classList.contains('border')).toBe(false)
    // check if pulseButton was added to the button
    expect(document.getElementById('confirmButton').classList.contains('pulseButton')).toBe(true)
  })
})
