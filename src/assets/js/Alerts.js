// UUID For Unique ID
import { v4 as uuidv4 } from 'uuid'

// Main Wraper For Alerts
let alertPlaceholder = null

// Timer For Delete
const time = 5

// Alert List
let alertList = []

// Convert Type To Background For Alert
const colorToBg = {
  success: 'green',
  danger: 'red',
  warning: 'yellow'
}

/**
 * New Alert
 */
export const appendAlert = (message, info) => {
  return new Promise((resolve, reject) => {
    // ----- STEP ONE -----

    // find main wrapper
    alertPlaceholder = document.getElementById('liveAlertPlaceholder')

    // ----- STEP TWO -----

    // set alert variables
    const content = {
      id: uuidv4(),
      message,
      info
    }

    // add alert to list
    alertList.push(content)

    // ----- STEP THREE -----

    // create a wraper for alert
    const wrapper = document.createElement('div')
    wrapper.classList.add('alert-wraper')
    wrapper.setAttribute('id', `alert-wraper-${content.id}`)

    // create alert item for timer type
    if (content.info.type === 'alert') {
      wrapper.innerHTML = [
        `<div class="progress mb-2" role="progressbar" aria-label="Danger example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="height: 4px">`,
        `<div class="progress-bar bg-${content.info.color}" style="--transition-time: ${time}s; width: 0%"></div>`,
        `</div>`,
        `<div class="alert alert-shadow alert-${content.info.color} alert-dismissible bg-${
          colorToBg[content.info.color]
        }-100 m-0" role="alert" id="alert-${content.id}">`,
        `<div class='alert-text'>${content.message}</div>`,
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '<span class="first"></span>',
        '<span class="last"></span>',
        '</div>'
      ].join('')
    }

    if (content.info.type === 'action') {
      wrapper.innerHTML = [
        `<div class="card alert-shadow border-${content.info.color} bg-${
          colorToBg[content.info.color]
        }-100" id="alert-${content.id}">`,
        `<div class="card-body px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-4">`,
        `<p class="fs-7 mb-0 ls-base text-gray-800 lh-32px">${content.message}</p>`,
        `<div class="d-flex gap-4 w-100 w-sm-initial">`,
        `<button id="cancel" type="button" class="btn btn-sm bg-gray-300 text-${content.info.color} w-100 w-sm-104px h-24px ls-base fw-normal">Cancel</button>`,
        `<button id="accept" type="button" class="btn btn-sm btn-${content.info.color} w-100 w-sm-104px h-24px ls-base fw-normal">${content.info.acceptButtonText}</button>`,
        `</div>`,
        `</div>`,
        '<span class="first"></span>',
        '<span class="last"></span>',
        `</div>`
      ].join('')
    }

    // add wraper to main element to show in the DOM
    alertPlaceholder.append(wrapper)

    // ----- STEP FOUR -----

    // show alert if list has only one parameter
    if (alertList.length == 1) {
      startAlert(alertList[0])
    }

    // show shadows if list has more than one parameter
    if (alertList.length > 1) {
      alertPlaceholder.classList.add('pending-list')
    }

    // ----- STEP FIVE -----

    // fine my alert
    const myAlert = document.querySelector(`#alert-${content.id}`)

    if (content.info.type === 'alert') {
      // add listener for close
      myAlert.addEventListener('closed.bs.alert', (event) => {
        closeAlert(content.id)
        reject()
      })
    }

    if (content.info.type === 'action') {
      const closeBTN = myAlert.querySelector('#cancel')
      const acceptBTN = myAlert.querySelector('#accept')

      // add listener for close
      closeBTN.addEventListener('click', (event) => {
        closeAlert(content.id)
        reject()
      })

      // add listener for accept
      acceptBTN.addEventListener('click', (event) => {
        closeAlert(content.id)
        resolve()
      })
    }

    // ----- OTHER INSIDE FUNCTIONS -----

    // close alert and reject call
    function closeAlert(id) {
      const alertWraper = document.getElementById(`alert-wraper-${id}`)

      // Check IF Deleted Before OR Not
      if (alertWraper) {
        // Remove Item From List
        alertList = alertList.filter((item) => item.id != id)

        // Delete Alert Wraper From DOM
        alertPlaceholder.removeChild(alertWraper)

        // Check For Next Alert
        if (alertList.length) {
          startAlert(alertList[0])
        }

        // Remove Shadows If List Has One Parameter
        if (alertList.length == 1) {
          alertPlaceholder.classList.remove('pending-list')
        }
      }
    }

    // show alert in page
    function startAlert(item) {
      const hasToShowAlert = document.getElementById(`alert-wraper-${item.id}`)

      hasToShowAlert.classList.add('active')

      // Close BTN After Timer Finish
      if (item.info.type === 'alert') {
        setTimeout(() => {
          closeAlert(item.id)
          reject()
        }, time * 1000)
      }
    }
  })
}
